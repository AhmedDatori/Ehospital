/* eslint-disable no-unused-vars */
import React from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";

export const getAdminById = async (adminId) => {
    try {
        const response = await axios.get(apiConfig.ADMINS_URL + "/" + adminId)
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const updateAdmin = async (adminData) => {
    try {
        const response = await axios.put(apiConfig.ADMINS_URL + "/" + adminData.id, adminData)
        toast.success("Admin updated successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const deleteAdmin = async (adminId) => {
    try {
        const response = await axios.delete(apiConfig.ADMINS_URL + "/" + adminId)
        toast.success("Admin deleted successfully");
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

