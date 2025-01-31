/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getPatients = async (page, size) => {
    try {
        const response = await axios.get(apiConfig.PATIENTS_URL
            //, {params: {page: page,size: size}}
        );
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const getPatientById = async (patientId) => {
    if (!patientId) return;
    if (!patientId) return;
    try {
    const response = await axios.get(apiConfig.PATIENTS_URL + "/" + patientId)
    return response.data;

    } catch (err) {
        console.log(err);
    }
}

export const createPatient = async (patientData) => {
    if (!patientData) return;
    //console.log("patientData", patientData);
    try {
        const response = await axios.post(apiConfig.PATIENTS_URL, patientData)
        toast.success("Patient Account created successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const updatePatient = async (patientData) => {
    if (!patientData) return;
    try {
        const response = await axios.put(apiConfig.PATIENTS_URL + "/" + patientData.id, patientData)
        toast.success("Patient updated successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const deletePatient = async (patientId) => {
    if (!patientId) return;
    try {
        const response = await axios.delete(apiConfig.PATIENTS_URL + "/" + patientId)
        toast.success("Patient Account deleted successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
