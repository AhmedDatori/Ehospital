import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<AdminLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/login" element={<AdminLogin />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
