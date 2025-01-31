/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getSpecialities = async () => {
    try {
        const response = await axios.get(apiConfig.SPECIALTIES_URL);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const getSpecialityById = async (specialityId) => {
    try {
        const response = await axios.get(apiConfig.SPECIALTIES_URL + "/" + specialityId)
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const createSpeciality = async (specialityData) => {
    try {
        const response = await axios.post(apiConfig.SPECIALTIES_URL, specialityData)
        toast.success("Speciality created successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const updateSpeciality = async (specialityData) => {
    try {
        const response = await axios.put(apiConfig.SPECIALTIES_URL + "/" + specialityData.id, specialityData)
        toast.success("Speciality updated successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const deleteSpeciality = async (specialityId) => {
    try {
        const response = await axios.delete(apiConfig.SPECIALTIES_URL + "/" + specialityId)
        toast.success("Speciality deleted successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

