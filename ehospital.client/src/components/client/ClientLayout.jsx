import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientNavBar from './ClientNavBar';

const ClientLayout = () => {
    return (
        <div>
            <ClientNavBar />
            <main style={{ padding: "1rem" }}>
                <Outlet />  {/* This will render the matched child route */}
            </main>
        </div>
    );
};

export default ClientLayout;