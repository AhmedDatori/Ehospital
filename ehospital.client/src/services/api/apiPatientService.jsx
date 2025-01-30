/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getPatients = async (page, size) => {
    await axios.get(apiConfig.PATIENTS_URL + "?page=" + page + "&size=" + size)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getPatientById = async (patientId) => {
    await axios.get(apiConfig.PATIENTS_URL + "/" + patientId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const createPatient = async (patientData) => {
    await axios.post(apiConfig.PATIENTS_URL, patientData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const updatePatient = async (patientData) => {
    const id = patientData.id;
    await axios.put(apiConfig.PATIENTS_URL + "/" + id, patientData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const deletePatient = async (patientId) => {
    await axios.delete(apiConfig.PATIENTS_URL + "/" + patientId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

