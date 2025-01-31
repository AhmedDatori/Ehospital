/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";
import { cache } from 'react';

export const getAppointments = async (page, size) => {
    try {
        const response = await axios.get(apiConfig.APPOINTMENTS_URL
            //, {params: {page: page,size: size}}
        );
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const getAppointmentById = async (appointmentId) => {
    try {
        const response = await axios.get(apiConfig.APPOINTMENTS_URL + "/" + appointmentId)
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const getAppointmentsByDoctor = async (doctorId) => {
    try {
        const response = await axios.get(apiConfig.APPOINTMENTS_URL + "/doctor/" + doctorId)
        console.log("response", response.data);
        return response.data;
    } catch (err) {
        console.log(err)
    }
}

export const getAppointmentsByPatient = async (patientId) => {
    try {
        const response = await axios.get(apiConfig.APPOINTMENTS_URL + "/patient/" + patientId)
        return response.data;
    } catch (err) {
        console.log(err)
    }
}
export const createAppointment = async (DoctorID, PatientID) => {
    try {
        const response = await axios.post(apiConfig.APPOINTMENTS_URL, { PatientID: PatientID, DoctorID: DoctorID })
        toast.success("Appointment created successfully");
        return response.data;
    } catch {
        toast.error("Failed to create appointment");
    }
}

export const deleteAppointment = async (appointmentId) => {
    try {
        const response = await axios.delete(apiConfig.APPOINTMENTS_URL + "/" + appointmentId)
        toast.success("Appointment deleted successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
