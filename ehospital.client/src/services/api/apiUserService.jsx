/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "../apiconfig";
import { jwtDecode } from "jwt-decode";
import AppContext from "../../context/AppContext";



export const userLogin = async (userData) => {
    try {
        const response = await axios.post(
            `${apiConfig.LOGIN_URL}`,
            userData);
        toast.success("Logged in successfully");
        const tokens = response.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        const user = await userGet(tokens.accessToken);

        return user;
    } catch (error) {
        toast.error("Failed to login");
        return null;
    }
}

export const userLogout = async () => {
    localStorage.clear();
}

export const userRegister = async (userData) => {
}

export const userDelete = async (userID) => {
}

export const userUpdate = async (userData) => {
}

export const userGet = async (token) => {
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const userID = decodedToken.userID;

    try {
        const response = await axios.get(`${apiConfig.API_URL}/${role}s/UserID/${userID}`);

        const userData = response.data;
        userData.role = role;
        userData.userID = userID;

        return userData;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}
