import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";

const Patients = () => {
  const {
    fetchPatients,
    getDoctorPatients,
    accessToken,
    curUser,
    getCurrentUser,
  } = useContext(AppContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (!curUser) {
      getCurrentUser().finally(() => setUserLoading(false));
    } else {
      setUserLoading(false);
    }
  }, [accessToken, curUser, navigate]);

  useEffect(() => {
    if (curUser) {
      // console.log("curUser", curUser);
      setIsAdmin(curUser.role == "admin");
      // console.log("isAdmin", isAdmin);
    }
  }, [curUser]);

  let mounted = true;

  useEffect(() => {
    const loadPatients = async () => {
      if (!mounted) return;
      if (!accessToken || userLoading) return;

      try {
        var patientsData;
        if (curUser && isAdmin) {
          patientsData = await fetchPatients(); // Fetch all patients for admin
        } else if (curUser) {
          patientsData = await getDoctorPatients(curUser.id); // Fetch patients for a specific doctor
        }
        if (mounted) {
          setPatients(patientsData || []);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();

    return () => {
      mounted = false;
    };
  }, [fetchPatients, getDoctorPatients, accessToken, isAdmin, userLoading]);

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
              onClick={() => navigate(`/patient/${person.id}`)}
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

export default Patients;
