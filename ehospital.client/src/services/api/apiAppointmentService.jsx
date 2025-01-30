/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getAppointments = async (page, size) => {
    await axios.get(apiConfig.APPOINTMENTS_URL + "?page=" + page + "&size=" + size)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getAppointmentById = async (appointmentId) => {
    await axios.get(apiConfig.APPOINTMENTS_URL + "/" + appointmentId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getAppointmentsByDoctor = async (doctorId) => {
    await axios.get(apiConfig.APPOINTMENTS_URL + "/doctor/" + doctorId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getAppointmentsByPatient = async (patientId) => {
    await axios.get(apiConfig.APPOINTMENTS_URL + "/patient/" + patientId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
export const createAppointment = async (appointmentData) => {
    await axios.post(apiConfig.APPOINTMENTS_URL, appointmentData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const deleteAppointment = async (appointmentId) => {
    await axios.delete(apiConfig.APPOINTMENTS_URL + "/" + appointmentId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}
