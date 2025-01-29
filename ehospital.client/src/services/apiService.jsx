/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "./apiConfig";

// get Patients
export const fetchPatients = async () => {
    try {
        const response = await axios.get(`${apiConfig.PATIENTS_URL}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
};

// get Specialities
export const fetchSpecialities = async () => {
    try {
        const response = await axios.get(`${apiConfig.SPECIALTIES_URL}`);
        return response.data;
    } catch (error) {
        toast.error("Failed to fetch specialities");
        console.error("Error fetching specialities:", error);
        throw error;
    }
};

// get Doctors
export const fetchDoctors = async () => {
    try {
        const response = await axios.get(`${apiConfig.DOCTORS_URL}`);
        //console.log(response)
        return response.data;
    } catch (error) {
        toast.error("Failed to fetch doctors");
        console.error("Error fetching doctors:", error);
    }
};

// get User
export const fetchUserById = async (userID, role) => {
    //console.log("user:", role, userID)
    try {
        const response = await axios.get(
            `${apiConfig.API_URL}/${role}s/UserID/${userID}`
        );
        response.data.role = role;
        return response.data;
    } catch (error) {
        toast.error("Failed to fetch user data");
        console.error("Error fetching user data:", error);
        throw error;
    }
};

// Create an Appointment
export const createAppointment = async (DoctorID, PatientID) => {
    try {
        const response = await axios.post(`${apiConfig.APPOINTMENTS_URL}`, {
            DoctorID,
            PatientID,
        });
         toast.success("Appointment created successfully");
        return response.data;
    } catch (error) {
        toast.error("Failed to create appointment");
        console.error("Error creating appointment:", error);
        throw error;
    }
};

// Delete an Appointment
export const deleteAppointment = async (appointmentID) => {
    try {
        await axios.delete(`${apiConfig.APPOINTMENTS_URL}/${appointmentID}`);
         toast.success("Appointment deleted successfully");
        return true;
    } catch (error) {
        toast.error("Failed to delete appointment");
        console.error("Error deleting appointment:", error);
        throw error;
    }
};

// Create a User
export const createUser = async (userData, userRole) => {
    console.log(userData);

    try {
        const response = await axios.post(`${apiConfig.API_URL}/${userRole}s`, userData);
         toast.success("User created successfully");
        return response.data;
    } catch (error) {
        toast.error("Failed to create user");
        console.error("Error creating user:", error);
        throw error;
    }
};

// Delete a User
export const deleteUser = async (userID, userRole) => {
    try {
        await axios.delete(`${apiConfig.API_URL}/${userRole}s/${userID}`);
         toast.success("User deleted successfully");
        return true;
    } catch (error) {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error);
        throw error;
    }
};

// Update a User
export const updateUser = async (userID, userRole, userData) => {
    try {

        const response = await axios.put(
            `${apiConfig.API_URL}/${userRole}s/${userID}`,
            userData
        );
        toast.success("User updated successfully");
        console.log(response.data)
        return response.data;
    } catch (error) {
        toast.error("Failed to update user");
        console.error("Error updating user:", error);
        throw error;
    }
};

export const userLogin = async (loginData) => {
    try {
        const response = await axios.post(
            `${apiConfig.LOGIN_URL}`,
            loginData);
        toast.success("Logged in successfully");
        return response;
    } catch (error) {
        toast.error("Failed to login");
        return null;
    }
}

// get a single patient by ID
export const getPatient = async (patientID) => {
    try {
        const response = await axios.get(`${apiConfig.PATIENTS_URL}/${patientID}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Failed to fetch patient data");
        throw error;
    }
};

// get a single Doctor by ID
export const getDoctor = async (doctorID) => {
    try {
        const response = await axios.get(`${apiConfig.DOCTORS_URL}/${doctorID}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Failed to fetch patient data");
        throw error;
    }
};

export const getDoctorPatients = async (doctorID) => {
    try {
        const response = await axios.get(
            `${apiConfig.DOCTORS_URL}/${doctorID}/patients`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor patients:", error);
        toast.error("Failed to fetch doctor patients");
        throw error;
    }
};

// get a single Doctor by ID
export const getSpecialty = async (specialtyID) => {
    try {
        const response = await axios.get(
            `${apiConfig.SPECIALTIES_URL}/${specialtyID}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Failed to fetch patient data");
        throw error;
    }
};

// get appointments by userID
export const getAppointmentsByID = async (userID) => {
    try {
        const response = await axios.get(
            `${apiConfig.APPOINTMENTS_URL}/UserID/${userID}`
        );
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
        throw error;
    }
};

// get all appointments
export const getAllAppointments = async () => {
    try {
        const response = await axios.get(`${apiConfig.APPOINTMENTS_URL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
        throw error;
    }
};

// Update a specialization
export const updateSpecialization = async (specialityId, updatedData) => {
    try {
        const response = await axios.put(
            `${apiConfig.SPECIALTIES_URL}/${specialityId}`,
            updatedData
        );
         toast.success("Specialization updated successfully");
        return response.data;
    } catch (error) {
        console.error("Error updating specialization:", error);
        toast.error("Failed to update specialization");
        throw error;
    }
};

// Delete a specialization
export const deleteSpecialization = async (specialityId) => {
    try {
        await axios.delete(`${apiConfig.SPECIALTIES_URL}/${specialityId}`);
         toast.success("Specialization deleted successfully");
    } catch (error) {
        console.error("Error deleting specialization:", error);
        toast.error("Failed to delete specialization");
        throw error;
    }
};

// Add a new specialization
export const addSpecialization = async (specializationData) => {
    try {
        const response = await axios.post(
            `${apiConfig.SPECIALTIES_URL}`,
            specializationData
        );
         toast.success("Specialization added successfully");
        return response.data;
    } catch (error) {
        console.error("Error adding specialization:", error);
        toast.error("Failed to add specialization");
        throw error;
    }
};
