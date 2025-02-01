/* eslint-disable no-unused-vars */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminAppointments = () => {
  const {
      getAppointments,
      getAppointmentsByDoctor,
    accessToken,
    getCurrentUser,
    currentUser,
    deleteAppointment,
  } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (!currentUser) {
      getCurrentUser().finally(() => setUserLoading(false));
    } else {
      setUserLoading(false);
    }
  }, [accessToken, currentUser, navigate]);


  useEffect(() => {
    const fetchAppointments = async () => {
        if (appointments.length > 0) return;
      // console.log("Fetching appointments...");
      if (!accessToken || userLoading) return;
      try {
          var fetchedAppointments;
          if (currentUser) {
              if (currentUser.role === "admin") {
                  fetchedAppointments = await getAppointments();
              } else if (currentUser.role === "doctor") {
                  fetchedAppointments = await getAppointmentsByDoctor(currentUser.id);
              }
          }

          setAppointments(fetchedAppointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {

          setLoading(false);
      }
    };

    fetchAppointments();

  }, [getAppointments, getAppointmentsByDoctor, accessToken, userLoading, currentUser]);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        )
      );
    } catch (error) {
      console.error("Failed to delete the appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  if (userLoading || loading) {
    return <div className="text-center py-24">Loading appointments...</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-10 mx-16">
      <h1 className="text-2xl font-bold">All Appointments</h1>
      <hr className="w-full" />
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Fragment key={appointment.id}>
            <div className="flex flex-row max-md:flex-col items-center gap-4 justify-between">
              <div className="flex flex-row max-md:flex-col items-center gap-4">
                <img
                  src={assets.profile}
                  className="w-32 max-md:w-5/6"
                  alt="Doctor"
                />
                <div className="flex flex-col gap-2 self-center mb-2 max-md:text-center">
                  {
                    <>
                      <p className="text-lg font-semibold ml-4 max-md:text-2xl">
                        Dr. {appointment.doctorName}
                      </p>
                      <p className="text-lg font-semibold ml-4 max-md:text-xl">
                                        Speciality: {appointment.specialityName}
                      </p>
                    </>
                  }
                  <p className="text-lg font-semibold ml-4 max-md:text-xl">
                    Patient: {appointment.patientName}
                  </p>
                </div>
              </div>
              <button
                className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 max-md:text-xl max-md:w-5/6"
                onClick={() => handleDeleteAppointment(appointment.id)}
              >
                Cancel Appointment
              </button>
            </div>
            <hr className="w-full" />
          </Fragment>
        ))
      ) : (
        <p className="text-center">No appointments found</p>
      )}
    </div>
  );
};

export default AdminAppointments;
