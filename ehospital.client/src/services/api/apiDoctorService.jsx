/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";


export const getDoctors = async (page, size) => {
    try {
        const response = await axios.get(apiConfig.DOCTORS_URL
            //, {params: {page: page,size: size}}
        );
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const getDoctorById = async (doctorId) => {
    if (!doctorId) return;
    try {
        //console.log("get", doctorId)
        const response = await axios.get(apiConfig.DOCTORS_URL + "/" + doctorId)
        //console.log("now", response.data)

        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const getDoctorsBySpeciality = async (speciality) => {
    if (!speciality) return;
    try {
        const response = await axios.get(apiConfig.DOCTORS_URL + "/speciality/" + speciality)
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const createDoctor = async (doctorData) => {
    if (!doctorData) return;
    try {
        const response = await axios.post(apiConfig.DOCTORS_URL, doctorData)
        toast.success("Doctor created successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const updateDoctor = async (doctorData) => {
    if (!doctorData) return;
    try {
        const response = await axios.put(apiConfig.DOCTORS_URL + "/" + doctorData.id, doctorData)
        toast.success("Doctor updated successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const deleteDoctor = async (doctorId) => {
    if (!doctorId) return;
    try {
        const response = await axios.delete(apiConfig.DOCTORS_URL + "/" + doctorId)
        toast.success("Doctor deleted successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

