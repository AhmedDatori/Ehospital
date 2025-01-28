import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "sonner";

const Appointments = () => {
  const { docId } = useParams();
  const {
    doctors,
    getSpecialtyName,
    getCurrentUser,
    createAppointment,
    accessToken,
  } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // get the current patient data
  useEffect(() => {
    const fetchCurrentPatient = async () => {
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const currentPatientData = await getCurrentUser();
        setCurrentPatient(currentPatientData);
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPatient();
  }, [accessToken, getCurrentUser, navigate]);

  // get the doctor information
  useEffect(() => {
    if (doctors.length > 0 && docId) {
      const doctor = doctors.find((doc) => doc.id.toString() === docId);
      if (doctor) {
        setDocInfo(doctor);
      } else {
        setError("Doctor not found.");
      }
    }
  }, [doctors, docId]);

  // book appointment button
  const handleBookAppointment = async () => {
    if (!currentPatient || !docId) {
      setError("Patient or doctor information is missing.");
      return;
    }

    try {
      await createAppointment(docId, currentPatient.id);
      toast.success("Appointment booked successfully.");
    } catch (error) {
      console.error("Failed to book appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!docInfo) {
    return <div>Doctor not found.</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-4">
        {/* Doctor Information Section */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <div className="w-full sm:w-auto">
            <img
              className="bg-primary w-full sm:w-72 rounded-lg"
              src={assets.docAvatatr}
              alt={`Dr. ${docInfo.firstName} ${docInfo.lastName}`}
            />
          </div>
          <div className="border border-gray-400 rounded-lg p-8 py-7 bg-white mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              Dr. {docInfo.firstName} {docInfo.lastName}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <p>MBBS {getSpecialtyName(docInfo.specializationID)}</p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                4 years
              </button>
            </div>
          </div>
        </div>

        {/* Book Appointment Button */}
        <button
          className="bg-primary text-white text-lg font-normal px-14 py-3 rounded-full my-6 mb-16 hover:bg-secondary-2 transition-colors"
          onClick={handleBookAppointment}
        >
          Book an appointment
        </button>
      </div>

      {/* Related Doctors Section */}
      <RelatedDoctors docId={docId} specId={docInfo.specializationID} />
    </>
  );
};

export default Appointments;
