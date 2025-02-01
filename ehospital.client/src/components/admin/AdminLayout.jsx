import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavBar from './AdminNavBar'; 

const AdminLayout = () => {
    return (
        <div >
            <AdminNavBar />
            <main style={{ padding: "1rem" }}>
                <Outlet />  {/* This will render the matched child route */}
            </main>
        </div>
    );
};

export default AdminLayout;