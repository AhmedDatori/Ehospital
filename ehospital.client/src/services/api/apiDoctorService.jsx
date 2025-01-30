/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";


export const getDoctors = async (page, size) => {
    await axios.get(apiConfig.DOCTORS_URL + "?page=" + page + "&size=" + size)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getDoctorById = async (doctorId) => {
    await axios.get(apiConfig.DOCTORS_URL + "/" + doctorId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getDoctorsBySpeciality = async (speciality) => {
    await axios.get(apiConfig.DOCTORS_URL + "/speciality/" + speciality)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const createDoctor = async (doctorData) => {
    await axios.post(apiConfig.DOCTORS_URL, doctorData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const updateDoctor = async (doctorData) => {
    await axios.put(apiConfig.DOCTORS_URL, doctorData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const deleteDoctor = async (doctorId) => {
    await axios.delete(apiConfig.DOCTORS_URL + "/" + doctorId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

