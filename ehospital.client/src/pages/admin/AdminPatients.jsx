/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_frontend/assets";

const AdminPatients = () => {
  const {
      getPatientsByDoctor,
    accessToken,
      currentUser,
      getCurrentUser,
      getPatients,
  } = useContext(AppContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (!accessToken) {
      navigate("/dashboard/login");
    } else if (!currentUser) {
      getCurrentUser().finally(() => setUserLoading(false));
    } else {
      setUserLoading(false);
    }
  }, [accessToken, currentUser, navigate]);


    useEffect(() => {
        if (patients.length != 0) {
            return;
        }
        const loadPatients = async () => {
            if (!accessToken || userLoading) return;

            try {
                var patientsData;
                if (currentUser) {
                    if (currentUser.role === "admin") {
                        patientsData = await getPatients();

                    } else if (currentUser.role === "doctor") {
                        patientsData = await getPatientsByDoctor(currentUser.id);
                    }
                }
                    setPatients(patientsData || []);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPatients();

    }, [getPatients, getPatientsByDoctor, accessToken, userLoading, currentUser, patients]);


  // Show loading message while fetching data
  if (loading) {
    return <div className="text-center py-24">Loading patients...</div>;
  }

  // Show message if no patients are found
  if (patients.length === 0) {
    return <div className="text-center py-24">No patients found.</div>;
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
        <ul
          role="list"
          className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
        >
          {patients.map((person) => (
            <li
              key={person.id}
              className="hover:bg-primary hover:text-white cursor-pointer p-4 rounded-lg"
              onClick={() => navigate(`/dashboard/patient/${person.id}`)}
            >
              <div className="flex items-center gap-x-6">
                <img
                  alt=""
                  src={assets.profile}
                  className="size-16 rounded-full"
                />
                <div>
                  <h3 className="text-base/7 font-semibold tracking-tight">
                    {person.firstName} {person.lastName}
                  </h3>
                  <p className="text-sm/6 font-semibold text-indigo-600">
                    {person.email}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPatients;
