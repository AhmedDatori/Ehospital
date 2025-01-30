/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getAdminById = async (adminId) => {

    await axios.get(apiConfig.ADMINS_URL + "/" + adminId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const updateAdmin = async (adminData) => {
    await axios.put(apiConfig.ADMINS_URL, adminData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const deleteAdmin = async (adminId) => {
    await axios.delete(apiConfig.ADMINS_URL + "/" + adminId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

