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
    const [isDataFetched, setIsDataFetched] = useState(false);  // Flag to prevent re-running


    useEffect(() => {
        const welcom = sessionStorage.getItem("welcom");
        if (!welcom) {
            toast.success("Welcome to eHospital");
            sessionStorage.setItem("welcom", "true");
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (!isDataFetched) {  // Check if data has already been fetched
                await setTokens();
                await getCurrentUser();
                await getDoctors();
                await getSpecialities();
                //console.log("AppContext initialized");
                //console.log("Access Token: ", accessToken);
                //console.log("Current User: ", currentUser);
                //console.log("Specialities: ", specialities);
                //console.log("Doctors: ", doctors);

                setIsDataFetched(true); // Set the flag to true to prevent further fetching
            }
        };
        initialize();
    }, [isDataFetched, accessToken, currentUser, doctors, specialities]);  // Add `isDataFetched` in dependencies to prevent infinite loop


    const setTokens = () => {
        if (localStorage.getItem("accessToken")) {
            setAccessToken(localStorage.getItem("accessToken"));
        } else {
            setAccessToken(null);
        }
    }

    //useEffect(() => {
    //    console.log("specialities updated", specialities)
    //}, [specialities]);

    // get all data
    const getSpecialities = async () => {
        // get specialities
        const specialitiesData = await apiSpeciality.getSpecialities()
        if (specialitiesData) {
            if (specialitiesData != specialities) {
                //console.log("Specialities Data", specialitiesData);
                setSpecialities(specialitiesData);
                //console.log("Specialities Data", specialities);
            }
        }
    };

    const getDoctors = async () => {
        // get doctors
        const doctorsData = await apiDoctor.getDoctors()
        if (doctorsData) {
            if (doctorsData != doctors) {
                //console.log("doctors Data", doctorsData);
                setDoctors(doctorsData);
            }
        }
    }

    const getPatients = async () => {
        // get patients
        await apiPatient.getPatients()
            .then((response) => {
                setPatients(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getAppointments = async () => {
        // get appointments
        await apiAppointment.getAppointments()
            .then((response) => {
                setAppointments(response);
            })
            .catch((error) => {
                console.log(error);
            });
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




    ////create new patient
    //const createPatient = async (data) => {
    //    const response = await apiPatient.createPatient(data)
    //    return response;
    //};

    ////create new doctor
    //const createDoctor = async (data) => {
    //    const response = await apiDoctor.createDoctor(data)
    //    return response;
    //};

    ////create new speciality
    //const createSpeciality = async (data) => {
    //    const response = await apiSpeciality.createSpeciality(data)
    //    return response;
    //};

    ////create new appointment
    //const createAppointment = async (data) => {
    //    const response = await apiAppointment.createAppointment(data)
    //    return response;
    //};




    ////update patient
    //const updatePatient = async (data) => {
    //    console.log("data to update", data);
    //    const response = await apiPatient.updatePatient(data)
    //    return response;
    //};

    ////update doctor
    //const updateDoctor = async (data) => {
    //    const response = await apiDoctor.updateDoctor(data)
    //    return response;
    //};

    ////update admin
    //const updateAdmin = async (data) => {
    //    const response = await apiAdmin.updateAdmin(data)
    //    return response;
    //};

    ////update speciality
    //const updateSpeciality = async (data) => {
    //    const response = await apiSpeciality.updateSpeciality(data)
    //    return response;
    //};




    //// delete patient
    //const deletePatient = async (id) => {
    //    const response = await apiPatient.deletePatient(id)
    //    return response;
    //};

    //// delete doctor
    //const deleteDoctor = async (id) => {
    //    const response = await apiDoctor.deleteDoctor(id)
    //    return response;
    //};

    //// delete appointment
    //const deleteAppointment = async (id) => {
    //    const response = await apiAppointment.deleteAppointment(id)
    //    return response;
    //};

    //// delete speciality
    //const deleteSpeciality = async (id) => {
    //    const response = await apiSpeciality.deleteSpeciality(id)
    //    return response;
    //};




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
