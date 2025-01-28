import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

function Doctor({ doctor, specName }) {
  // Properly destructure props
  const navigate = useNavigate(); // Use the navigate hook here if needed

  return (
    <div
      onClick={() => navigate(`/appointments/${doctor.id}`)}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-15px] transition-all duration-300 "
    >
      <img src={assets.docAvatatr} alt="Doctor Avatar" className="bg-blue-50" />
      <div className="p-4">
        <p className="text-lg text-gray-900 font-medium">
          Dr. {doctor.firstName} {doctor.lastName}
        </p>
        <p className="text-gray-600 text-sm">{specName}</p>
      </div>
    </div>
  );
}

export default Doctor;
