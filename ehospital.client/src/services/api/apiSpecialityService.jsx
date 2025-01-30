/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getSpecialities = async () => {
    await axios.get(apiConfig.SPECIALITIES_URL)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getSpecialityById = async (specialityId) => {
    await axios.get(apiConfig.SPECIALITIES_URL + "/" + specialityId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const createSpeciality = async (specialityData) => {
    await axios.post(apiConfig.SPECIALITIES_URL, specialityData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const updateSpeciality = async (specialityData) => {
    const id = specialityData.id;
    await axios.put(apiConfig.SPECIALITIES_URL + "/" + id, specialityData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });

}

export const deleteSpeciality = async (specialityId) => {
    await axios.delete(apiConfig.SPECIALITIES_URL + "/" + specialityId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

