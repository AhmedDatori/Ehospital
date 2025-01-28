import React from 'react';

export const apiConfig = {
    BASE_URL: "https://localhost:7227",
    get API_URL() { return `${this.BASE_URL}/api`; },
    get AUTH_URL() { return `${this.API_URL}/auth`; },
    get LOGIN_URL() { return `${this.AUTH_URL}/login`; },
    get REGISTER_URL() { return `${this.AUTH_URL}/register`; },
    get REFRESH_TOKEN_URL() { return `${this.AUTH_URL}/refresh-token`; },
    get ADMINS_URL() { return `${this.API_URL}/admins`; },
    get DOCTORS_URL() { return `${this.API_URL}/doctors`; },
    get PATIENTS_URL() { return `${this.API_URL}/patients`; },
    get SPECIALTIES_URL() { return `${this.API_URL}/Specializations`; },
    get APPOINTMENTS_URL() { return `${this.API_URL}/appointments`; },

    get ADMIN_DASHBOARD_URL() { return `https://localhost:11954`; },

};