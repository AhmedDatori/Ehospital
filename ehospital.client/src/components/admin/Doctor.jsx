/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
//import { Button } from "@material-tailwind/react";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor, onView, onEdit }) {
  const navigate = useNavigate();
    const { accessToken, currentUser } = useContext(AppContext);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (currentUser) {
        setIsAdmin(currentUser.role === "admin"); // Check if user is admin
    }
  }, [accessToken, currentUser, navigate]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={assets.docAvatatr}
        alt="Doctor Avatar"
        className="w-full h-48 object-scale-down"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Dr. {doctor.firstName} {doctor.lastName}
        </h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
        <div className="mt-4 flex gap-2">
                  <button
            onClick={onView}
            className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 w-full"
          >
            View
          </button>
          {isAdmin && (
                      <button
              onClick={onEdit}
              className="bg-gray-500 hover:bg-gray-700  text-white rounded-md mt-4 p-2 w-full"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctor;
