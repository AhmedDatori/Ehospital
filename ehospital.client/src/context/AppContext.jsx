/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { useMemo, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { createContext } from "react";

import * as apiAdmin from "../services/api/apiAdminService";
import * as apiUser from "../services/api/apiUserService";
import * as apiDoctor from "../services/api/apiDoctorService";
import * as apiPatient from "../services/api/apiPatientService";
import * as apiAppointment from "../services/api/apiAppointmentService";
import * as apiSpeciality from "../services/api/apiSpecialityService";



export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [isGeneralDataFetched, setIsGeneralDataFetched] = useState(false);
    const [isPrivateDataFetched, setIsPrivateDataFetched] = useState(false);


    useEffect(() => {
        const welcom = sessionStorage.getItem("welcom");
        if (!welcom) {
            toast.success("Welcome to eHospital");
            sessionStorage.setItem("welcom", "true");
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (!isGeneralDataFetched) {
                await setTokens();
                await getCurrentUser();
                await getDoctors();
                await getSpecialities();
                //console.log("AppContext initialized");
                //console.log("Access Token: ", accessToken);
                //console.log("Current User: ", currentUser);
                //console.log("Specialities: ", specialities);
                //console.log("Doctors: ", doctors);

                setIsGeneralDataFetched(true);
            } else if (!isPrivateDataFetched) {
                if (currentUser) {
                    if (currentUser.role === "admin") {
                        await getPatients();
                        await getAppointments();
                    }
                    if (currentUser.role === "doctor") {
                        await getAppointmentsByDoctor(currentUser.id);
                        await getPatientsByDoctor(currentUser.id);
                    }

                    setIsPrivateDataFetched(true)
                }
            }
        };
        initialize();
    }, [isGeneralDataFetched, accessToken, currentUser, doctors, specialities, appointments, patients]);


    const setTokens = () => {
        if (localStorage.getItem("accessToken")) {
            setAccessToken(localStorage.getItem("accessToken"));
        } else {
            setAccessToken(null);
        }
    }

    // get all data
    const getSpecialities = async () => {
        // get specialities
        const specialitiesData = await apiSpeciality.getSpecialities()
        if (specialitiesData) {
            if (specialitiesData != specialities) {
                setSpecialities(specialitiesData);
                return specialitiesData;
            }
        }
    };

    const getDoctors = async () => {
        // get doctors
        const doctorsData = await apiDoctor.getDoctors()
        if (doctorsData) {
            if (doctorsData != doctors) {
                setDoctors(doctorsData);
                return doctorsData;
            }
        }
    }

    const getPatients = async () => {
        // get patients
        const patientsData = await apiPatient.getPatients()
        if (patientsData) {
            if (patientsData != patients) {
                setPatients(patientsData);
                return patientsData;
            }
        }
    }

    const getAppointments = async () => {
        // get appointments
        const appointmentsData = await apiAppointment.getAppointments()
        if (appointmentsData) {
            if (appointmentsData != appointments) {
                setAppointments(appointmentsData);
                return appointmentsData;
            }
        }
    }

    //login
    const login = async (data) => {
        const response = await apiUser.userLogin(data);
        setTokens();
        return response;
    };

    //logout
    const logout = async () => {
        await apiUser.userLogout();
        setTokens();
        setCurrentUser(null);
    };

    //get current user
    const getCurrentUser = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return null;
        }
        await apiUser.userGet(token)
            .then((response) => {
                setCurrentUser(response);
                return response;
            })
    };





    //// get doctor by id
    //const getDoctorById = async (id) => {
    //    const response = await apiDoctor.getDoctorById(id)
    //    return response;
    //}

    //// get patient by id
    //const getPatientById = async (id) => {
    //    const response = await apiPatient.getPatientById(id)

    //    return response;
    //}

    //// get appointment by id
    //const getAppointmentById = async (id) => {

    //        const response = await apiAppointment.getAppointmentById(id)
    //        return response;
    //}

    //// get speciality by id
    //const getSpecialityById = async (id) => {

    //        const response = await apiSpeciality.getSpecialityById(id)
    //        return response;

    //}




    //// get doctor by speciality
    //const getDoctorBySpeciality = async (id) => {
    //    await apiDoctor.getDoctorBySpeciality(id)
    //        .then((response) => {
    //            return response;
    //        })
    //        .catch((error) => {
    //            console.log(error);
    //        });
    //}

    //// get appointments by doctor
    //const getAppointmentsByDoctor = async (id) => {
    //    await apiAppointment.getAppointmentsByDoctor(id)
    //        .then((response) => {
    //            return response;
    //        })
    //        .catch((error) => {
    //            console.log(error);
    //        });
    //}

    //// get appointments by patient
    //const getAppointmentsByPatient = async (id) => {
    //    const response = await apiAppointment.getAppointmentsByPatient(id)
    //    console.log("response", response);
    //    return response;

    //}



    // use memot on all the functions
    const contextValue = useMemo(() => ({
        setTokens,
        specialities,
        doctors,
        patients,
        appointments,
        currentUser,
        login,
        logout,
        getCurrentUser,
        getPatients,
        createPatient: apiPatient.createPatient,
        createDoctor: apiDoctor.createDoctor,
        createSpeciality: apiSpeciality.createSpeciality,
        createAppointment: apiAppointment.createAppointment,
        updatePatient: apiPatient.updatePatient,
        updateDoctor: apiDoctor.updateDoctor,
        updateAdmin: apiAdmin.updateAdmin,
        updateSpeciality: apiSpeciality.updateSpeciality,
        deletePatient: apiPatient.deletePatient,
        deleteDoctor: apiDoctor.deleteDoctor,
        deleteAppointment: apiAppointment.deleteAppointment,
        deleteSpeciality: apiSpeciality.deleteSpeciality,
        getDoctorById: apiDoctor.getDoctorById,
        getPatientById: apiPatient.getPatientById,
        getAppointmentById: apiAppointment.getAppointmentById,
        getSpecialityById: apiSpeciality.getSpecialityById,
        getDoctorBySpeciality: apiDoctor.getDoctorsBySpeciality,
        getAppointmentsByDoctor: apiAppointment.getAppointmentsByDoctor,
        getAppointmentsByPatient: apiAppointment.getAppointmentsByPatient,
        getPatientsByDoctor: apiPatient.getPatientsByDoctor,
        accessToken,
        setAccessToken,
    }), [specialities, doctors, patients, appointments, currentUser, accessToken]);


    return (
        <AppContext.Provider value={contextValue}>
            {children}
            <Toaster richColors />
        </AppContext.Provider>
    );
}

export default AppContextProvider;
