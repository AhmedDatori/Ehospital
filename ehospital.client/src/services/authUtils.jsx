import React from 'react';
import { jwtDecode } from "jwt-decode";

// Reset Tokens
export const resetTokens = async (
    accessToken,
    refreshToken,
    setAccessToken,
    setCurUser,
    fetchUserById
) => {
    if (!accessToken) {
        const storedAccessToken = localStorage.getItem("accessToken");
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
            const decodedToken = jwtDecode(storedAccessToken);
            const userData = await fetchUserById(
                decodedToken.userID,
                decodedToken.role
            );
            setCurUser(userData);
        }
    } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setAccessToken(accessToken);
        const decodedToken = jwtDecode(accessToken);
        const userData = await fetchUserById(
            decodedToken.userID,
            decodedToken.role
        );
        setCurUser(userData);
    }
};

// Get Current User
export const getCurrentUser = async (accessToken, curUser, fetchUserById) => {
    if (!accessToken || !curUser?.role || !curUser?.userID) return;

    try {
        const userData = await fetchUserById(curUser.userID, curUser.role);
        return userData;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};
