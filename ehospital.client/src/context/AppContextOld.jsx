import React from 'react';
import {
    createContext,
    useCallback,
    useState,
    useMemo,
    useEffect,
} from "react";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import * as apiService from "../services/apiService";
import { resetTokens, getCurrentUser } from "../services/authUtils";
import axios from "axios";
import { apiConfig } from "../services/apiConfig";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const BASE_URL = apiConfig.BASE_URL;
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken") || null
    );
    const [curUser, setCurUser] = useState(null);
    const [specialities, setSpecialities] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    // Fetch user data by ID and role
    const fetchUserById = useCallback(async (userID, role) => {
        try {
            //console.log("userRole",role)
            const userData = await apiService.fetchUserById(userID, role);
            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }, []);

    // Initialize user data on app load
    useEffect(() => {
        const initializeUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    //console.log("userRole", decodedToken)
                    const userData = await fetchUserById(
                        decodedToken.userID,
                        decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                    );
                    if (userData !== curUser) {
                        userData.userID = decodedToken.userID
                        setCurUser(userData);
                    }
                } catch (error) {
                    console.error("Error initializing user:", error);
                    toast.error("Failed to load user data");
                }
            }
        };

        initializeUser();
    }, [fetchUserById]);

    // Reset Tokens
    const handleResetTokens = useCallback(
        async (accessToken, refreshToken) => {
            await resetTokens(
                accessToken,
                refreshToken,
                setAccessToken,
                setCurUser,
                fetchUserById
            );
        },
        [fetchUserById]
    );

    // Get Current User
    const handleGetCurrentUser = useCallback(async () => {
        if (!accessToken || !curUser?.role || !curUser?.userID) return;
        const userData = await getCurrentUser(accessToken, curUser, fetchUserById);
        if (userData !== curUser) {
            setCurUser(userData);
        }
        return userData;
    }, [accessToken, curUser, fetchUserById]);

    // Fetch Data
    const fetchPatients = useCallback(async () => {
        const data = await apiService.fetchPatients();
        setPatients(data);
        return data;
    }, []);

    // Fetch all specializations
    const fetchSpecialities = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Specializations`);
            setSpecialities(response.data);
        } catch (error) {
            console.error("Error fetching specialities:", error);
            toast.error("Failed to fetch specialities");
        }
    }, []);

    // Add a new specialization
    const addSpecialization = useCallback(async (specializationData) => {
        try {
            const newSpeciality = await apiService.addSpecialization(
                specializationData
            );
            setSpecialities((prevSpecialities) => [
                ...prevSpecialities,
                newSpeciality,
            ]);
        } catch (error) {
            console.error("Error adding specialization:", error);
            throw error;
        }
    }, []);

    // Update a specialization
    const updateSpecialization = useCallback(
        async (specialityId, updatedData) => {
            try {
                const updatedSpeciality = await apiService.updateSpecialization(
                    specialityId,
                    updatedData
                );
                setSpecialities((prevSpecialities) =>
                    prevSpecialities.map((spec) =>
                        spec.id === specialityId ? { ...spec, ...updatedSpeciality } : spec
                    )
                );
            } catch (error) {
                console.error("Error updating specialization:", error);
                throw error;
            }
        },
        []
    );

    // Delete a specialization
    const deleteSpecialization = useCallback(async (specialityId) => {
        try {
            await apiService.deleteSpecialization(specialityId);
            setSpecialities((prevSpecialities) =>
                prevSpecialities.filter((spec) => spec.id !== specialityId)
            );
        } catch (error) {
            console.error("Error deleting specialization:", error);
            throw error;
        }
    }, []);

    // Fetch specializations on component mount
    useEffect(() => {
        if (accessToken) {
            fetchSpecialities();
            fetchDoctors();
            if (curUser?.role === "admin") {
                fetchPatients();

                getAllAppointments();
            }
        }
    }, [accessToken, curUser]);

    const fetchDoctors = useCallback(async () => {
        const data = await apiService.fetchDoctors();
        setDoctors(data);
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, []);
    // Fetch a single patient by ID
    const getPatient = useCallback(async (patientID) => {
        try {
            const patientData = await apiService.getPatient(patientID);
            return patientData;
        } catch (error) {
            console.error("Error fetching patient:", error);
            throw error;
        }
    }, []);

    const getDoctorPatients = useCallback(async (doctorID) => {
        try {
            const patientsData = await apiService.getDoctorPatients(doctorID);
            return patientsData;
        } catch (error) {
            console.error("Error fetching doctor patients:", error);
            throw error;
        }
    }, []);

    // Fetch a single patient by ID
    const getDoctor = useCallback(async (doctorID) => {
        try {
            const doctorData = await apiService.getDoctor(doctorID);
            doctorData.specialty = await getSpecialty(doctorData.specializationID);

            return doctorData;
        } catch (error) {
            console.error("Error fetching patient:", error);
            throw error;
        }
    }, []);

    // Fetch a single patient by ID
    const getSpecialty = useCallback(async (specialtyID) => {
        try {
            const doctorData = await apiService.getSpecialty(specialtyID);
            return doctorData;
        } catch (error) {
            console.error("Error fetching patient:", error);
            throw error;
        }
    }, []);

    // Get the Speciality Name by the ID
    const getSpecialtyName = (specializationID) => {
        const specialty = specialities.find((spec) => spec.id === specializationID);
        return specialty ? specialty.specialization : "Unknown";
    };

    // Fetch appointments by userID
    const getAppointmentsByID = useCallback(async (userID, userRole) => {

        const appointmentsData = await apiService.getAppointmentsByID(
            userID,
            userRole
        );

        return appointmentsData;

    }, []);

    // Fetch all appointments
    const getAllAppointments = useCallback(async () => {
        try {
            const appointmentsData = await apiService.getAllAppointments();
            appointmentsData.map(async (appointment) => {
                appointment.doctor = await getDoctor(appointment.doctorID);
                appointment.doctorName =
                    appointment.doctor.firstName + " " + appointment.doctor.lastName;
                appointment.Patient = await getPatient(appointment.patientsID);
                appointment.patientName =
                    appointment.Patient.firstName + " " + appointment.Patient.lastName;
                appointment.specialtyName = appointment.doctor.specialty.specialization;
                return appointment;
            });
            setAppointments(appointmentsData);
            return appointmentsData;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            throw error;
        }
    }, []);

    // User Login
    const handleUserLogin = useCallback(async (formData) => {
        console.log(formData)
        const response = await apiService.userLogin(formData);
        console.log(response.data)
        if (response) {
            localStorage.setItem("accessToken", response.data.accessToken);
            setAccessToken(response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            const user = jwtDecode(response.data.accessToken);
            setCurUser(user);

            handleGetCurrentUser();
            return user;
        }   

    }, []);


    // Memoized Context Value
    const contextValue = useMemo(
        () => ({
            BASE_URL,
            accessToken,
            curUser,
            resetTokens: handleResetTokens,
            getCurrentUser: handleGetCurrentUser,
            userLogin: handleUserLogin,
            fetchUserById,
            setAccessToken,
            setCurUser,
            getAppointmentsByID,
            getPatient,
            specialities,
            patients,
            doctors,
            appointments,
            updateSpecialization,
            deleteSpecialization,
            addSpecialization,
            fetchPatients,
            fetchSpecialities,
            fetchDoctors,
            getAllAppointments,
            getSpecialtyName,
            getDoctorPatients,
            createAppointment: apiService.createAppointment,
            deleteAppointment: apiService.deleteAppointment,
            createUser: apiService.createUser,
            deleteUser: apiService.deleteUser,
            updateUser: apiService.updateUser,
        }),
        [
            BASE_URL,
            accessToken,
            handleResetTokens,
            fetchUserById,
            getAppointmentsByID,
            getPatient,
            curUser,
            specialities,
            patients,
            doctors,
            appointments,
            updateSpecialization,
            deleteSpecialization,
            addSpecialization,
            handleGetCurrentUser,
            fetchPatients,
            fetchSpecialities,
            fetchDoctors,
            getDoctorPatients,
        ]
    );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
            <Toaster richColors />
        </AppContext.Provider>
    );
};

export default AppContextProvider;
