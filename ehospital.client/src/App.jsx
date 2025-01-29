import React from "react";
import { Route, Routes } from "react-router-dom";

// Client Side
import ClientLayout from "./components/client/ClientLayout";
import Home from "./pages/client/Home";
import ClientLogin from "./pages/client/ClientLogin";
import ClientProfile from "./pages/client/ClientProfile";
import ClientDoctors from "./pages/client/ClientDoctors";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientMyAppointments from "./pages/client/ClientMyAppointments";

// Admin Side
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";

// axios config
import setupAxiosInterceptors from "./services/axiosConfig"
function App() {

    
    setupAxiosInterceptors();
    return (
        <div className="mx-4 sm:mx-[5%] ">
            <Routes>
                <Route path="/dashboard" element={<AdminLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/login" element={<AdminLogin />} />
                </Route>
                <Route path="/" element={<ClientLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<ClientLogin />} />
                    <Route path="/MyProfile" element={<ClientProfile />} />
                    <Route path="/doctors" element={<ClientDoctors />} />
                    <Route path="/Appointments/:docId" element={<ClientAppointments />} />
                    <Route path="/Appointments/" element={<ClientAppointments />} />
                    <Route path="/MyAppointments" element={<ClientMyAppointments />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
