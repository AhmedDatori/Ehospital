import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const {
    curUser,
    accessToken,
    doctors,
    patients,
    specialities,
    appointments,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!accessToken) {
      navigate("/dashboard/login");
    } else if (curUser) {
      setIsAdmin(curUser.role === "admin"); // Check if user is admin
    }
  }, [accessToken, curUser, navigate]);

  return (
    <>
      {isAdmin ? (
        <div className="h-screen bg-[#F3F5F7] p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome,{" "}
            {curUser?.firstName
              ? curUser.firstName + " " + curUser.lastName
              : "Admin"}
            !
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Doctors</h2>
              <p className="text-3xl font-bold text-primary mt-2">
                {doctors.length}
              </p>
              <p className="text-sm text-gray-600">Total Doctors</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Patients</h2>
              <p className="text-3xl font-bold text-primary mt-2">
                {patients.length}
              </p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">
                Specialities
              </h2>
              <p className="text-3xl font-bold text-primary mt-2">
                {specialities.length}
              </p>
              <p className="text-sm text-gray-600">Total Specialities</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">
                Appointments
              </h2>
              <p className="text-3xl font-bold text-primary mt-2">
                {appointments.length}
              </p>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-[#F3F5F7]">
          <p className="text-2xl font-semibold text-gray-800">
            You are not allowed to view this page.
          </p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
