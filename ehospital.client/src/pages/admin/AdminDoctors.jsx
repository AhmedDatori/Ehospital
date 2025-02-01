/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Doctor from "../../components/admin/Doctor";
import DoctorModal from "../../components/admin/DoctorModal";
import { Button } from "@material-tailwind/react";

const Doctors = () => {
  const { speciality } = useParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
  const navigate = useNavigate();

  const {
      doctors,
    deleteDoctor,
    specialities,
    createDoctor,
    currentUser,
    updateDoctor,
    accessToken,
    } = useContext(AppContext);

  const [modalUser, setModalUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, edit, add

  const applyFilter = () => {
    if (speciality) {
      const filtered = doctors.filter((doc) => {
          return doc.specialization === speciality;
      });
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const handleOpenModalForAdd = () => {
    setModalUser({}); // clear the modal user to add a new doctor
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (doctor) => {
    setModalUser(doctor);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleOpenModalForView = (doctor) => {
    setModalUser(doctor);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (currentUser) {
        setIsAdmin(currentUser.role === "admin");
    }
  }, [accessToken, currentUser, navigate]);

  return (
    <div className="p-6">
      {isAdmin && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <Button
            onClick={handleOpenModalForAdd}
            className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 w-32"
          >
            Add New Doctor
          </Button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {showFilter && (
          <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Specializations</h2>
            <div className="space-y-2">
              {specialities.map((spec) => (
                <Button
                  key={spec.id}
                  onClick={() =>
                      speciality === spec.name
                          ? navigate(`/doctors`)
                          : navigate(`/doctors/${spec.name}`)
                  }
                  className={`w-full text-gray-700 text-left pl-3 py-2.5 pr-20 border border-gray-300 rounded transition-all cursor-pointer hover:bg-slate-200 ${
                    speciality === spec.name
                      ? "bg-primary text-white hover:bg-secondary-1"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                      {spec.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Doctor
              key={doctor.id}
              doctor={doctor}
              onView={() => handleOpenModalForView(doctor)}
              onEdit={() => handleOpenModalForEdit(doctor)}
            />
          ))}
        </div>
      </div>

      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={modalUser}
        mode={modalMode}
              onSave={updateDoctor}
              onDelete={deleteDoctor}
              onAdd={createDoctor}
      />
    </div>
  );
};

export default Doctors;
