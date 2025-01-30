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
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

    useEffect(() => {
        const initialize = async () => {
            toast.success("Welcome to eHospital");
            getDoctors();
            getSpecialities();
            getCurrentUser();
            setTokens();
        };
        initialize();

    }, []);

    const setTokens = () => {
        if (localStorage.getItem("accessToken")) {
            setAccessToken(localStorage.getItem("accessToken"));
        }
    }



    // get all data
    const getSpecialities = async () => {
        // get specialities
        await apiSpeciality.getSpecialities()
            .then((response) => {
                setSpecialities(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getDoctors = async () => {
        // get doctors
        await apiDoctor.getDoctors()
            .then((response) => {
                setDoctors(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getPatients = async () => {
        // get patients
        await apiPatient.getPatients()
            .then((response) => {
                setPatients(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getAppointments = async () => {
        // get appointments
        await apiAppointment.getAppointments()
            .then((response) => {
                setAppointments(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }




    //login
    const login = async (data) => {
        await apiUser.login(data)
            .then((response) => {
                setCurrentUser(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //logout
    const logout = async () => {
        await apiUser.userLogout();
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




    //create new patient
    const createPatient = async (data) => {
        await apiPatient.createPatient(data)
            .then((response) => {
                toast.success("Account created successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //create new doctor
    const createDoctor = async (data) => {
        await apiDoctor.createDoctor(data)
            .then((response) => {
                toast.success("Doctor created successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //create new speciality
    const createSpeciality = async (data) => {
        await apiSpeciality.createSpeciality(data)
            .then((response) => {
                toast.success("Speciality created successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //create new appointment
    const createAppointment = async (data) => {
        await apiAppointment.createAppointment(data)
            .then((response) => {
                toast.success("Appointment created successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };




    //update patient
    const updatePatient = async (data) => {
        await apiPatient.updatePatient(data)
            .then((response) => {
                toast.success("Account updated successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //update doctor
    const updateDoctor = async (data) => {
        await apiDoctor.updateDoctor(data)
            .then((response) => {
                toast.success("Doctor updated successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //update admin
    const updateAdmin = async (data) => {
        await apiAdmin.updateAdmin(data)
            .then((response) => {
                toast.success("Admin updated successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //update speciality
    const updateSpeciality = async (data) => {
        await apiSpeciality.updateSpeciality(data)
            .then((response) => {
                toast.success("Speciality updated successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };




    // delete patient
    const deletePatient = async (id) => {
        await apiPatient.deletePatient(id)
            .then((response) => {
                toast.success("Account deleted successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // delete doctor
    const deleteDoctor = async (id) => {
        await apiDoctor.deleteDoctor(id)
            .then((response) => {
                toast.success("Doctor deleted successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // delete appointment
    const deleteAppointment = async (id) => {
        await apiAppointment.deleteAppointment(id)
            .then((response) => {
                toast.success("Appointment deleted successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // delete speciality
    const deleteSpeciality = async (id) => {
        await apiSpeciality.deleteSpeciality(id)
            .then((response) => {
                toast.success("Speciality deleted successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    };




    // get doctor by id
    const getDoctorById = async (id) => {
        await apiDoctor.getDoctorById(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // get patient by id
    const getPatientById = async (id) => {
        await apiPatient.getPatientById(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // get appointment by id
    const getAppointmentById = async (id) => {
        await apiAppointment.getAppointmentById(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // get speciality by id
    const getSpecialityById = async (id) => {
        await apiSpeciality.getSpecialityById(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }




    // get doctor by speciality
    const getDoctorBySpeciality = async (id) => {
        await apiDoctor.getDoctorBySpeciality(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // get appointments by doctor
    const getAppointmentsByDoctor = async (id) => {
        await apiAppointment.getAppointmentsByDoctor(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // get appointments by patient
    const getAppointmentsByPatient = async (id) => {
        await apiAppointment.getAppointmentsByPatient(id)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    
    
    // use memot on all the functions
    const contextValue = useMemo(() => ({
        specialities,
        doctors,
        patients,
        appointments,
        currentUser,
        login,
        logout,
        getCurrentUser,
        createPatient,
        createDoctor,
        createSpeciality,
        createAppointment,
        updatePatient,
        updateDoctor,
        updateAdmin,
        updateSpeciality,
        deletePatient,
        deleteDoctor,
        deleteAppointment,
        deleteSpeciality,
        getDoctorById,
        getPatientById,
        getAppointmentById,
        getSpecialityById,
        getDoctorBySpeciality,
        getAppointmentsByDoctor,
        getAppointmentsByPatient,
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
