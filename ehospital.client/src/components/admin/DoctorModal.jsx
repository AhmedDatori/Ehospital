/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
//import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const DoctorModal = ({
  isOpen,
  mode,
  onClose,
  doctor,
  onSave,
  onDelete,
  onAdd,
}) => {
  const [formData, setFormData] = useState(doctor || {});
  const [isEditing, setIsEditing] = useState(mode === "add" || mode === "edit");
    const { specialities, accessToken, currentUser } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    setFormData(doctor || {});
    setIsEditing(mode === "add" || mode === "edit");
  }, [doctor, isOpen, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      onAdd(formData);
    } else if (isEditing) {
      onSave(formData);
    }
    setIsEditing(false);
    onClose();
  };

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (currentUser) {
        setIsAdmin(currentUser.role === "admin"); // Check if user is admin
    }
  }, [accessToken, currentUser, navigate]);

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "add" ? "Add Doctor" : "Doctor Details"}
                  </h2>
                  <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white rounded-md mt-4 p-3 w-24 "
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              disabled={mode === "view" && !isEditing}
              className="p-2 border border-primary rounded-md"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              disabled={mode === "view" && !isEditing}
              className="p-2 border border-primary rounded-md"
            />
            <select
                          name="specialization"
                          value={formData.specialization || ""}
              onChange={handleInputChange}
              disabled={mode === "view" && !isEditing}
              className="p-2 border border-primary rounded-md"
            >
              <option value="">Select Specialization</option>
              {specialities.map((spec) => (
                  <option key={spec.id} value={spec.name}>
                  {spec.name}
                </option>
              ))}
            </select>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleInputChange}
              disabled={mode === "view" && !isEditing}
              className="p-2 border border-primary rounded-md"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password || ""}
              onChange={handleInputChange}
              disabled={mode === "view" && !isEditing}
              className="p-2 border border-primary rounded-md"
            />
            <input
              name="birthdate"
              type="date"
              value={formData.birthdate || ""}
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 99))
                  .toISOString()
                  .split("T")[0]
              }
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleInputChange}
              disabled={mode === "view" && !isEditing}
              className="p-2 border border-primary rounded-md"
            />
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              {mode === "add" && (
                              <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white rounded-md mt-4 p-2 w-32"
                >
                  Add
                </button>
              )}
              {mode === "view" && !isEditing && (
                <>
                                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 w-32"
                  >
                    Edit
                  </button>
                                  <button
                    onClick={() => onDelete(doctor.id)}
                    className="bg-red-500 hover:bg-red-700 text-white rounded-md mt-4 p-3 w-32 "
                  >
                    Delete
                  </button>
                </>
              )}
              {(mode === "view" || mode === "edit") && isEditing && (
                              <button
                  type="submit"
                  className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 w-32"
                >
                  Save
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  ) : null;
};

export default DoctorModal;
