import React, { Fragment, useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const {
    getAllAppointments,
    getAppointmentsByID,
    accessToken,
    getCurrentUser,
    curUser,
    deleteAppointment,
  } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setIsAdmin(curUser.role === "admin");
    }
  }, [curUser]);

  let mounted = true;
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!mounted) return;
      // console.log("Fetching appointments...");
      if (!accessToken || userLoading) return;
      try {
        var fetchedAppointments;
        if (curUser && curUser.role === "admin") {
          fetchedAppointments = await getAllAppointments();
        } else if (curUser && curUser.role === "doctor") {
          fetchedAppointments = await getAppointmentsByID(curUser.id, "doctor");
        }

        if (mounted) {
          setAppointments(fetchedAppointments || []);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      mounted = false;
    };
  }, [
    getAllAppointments,
    getAppointmentsByID,
    accessToken,
    isAdmin,
    userLoading,
  ]);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        )
      );
      toast.success("Appointment deleted successfully");
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
                  src={assets.profile} // Fixed typo in `docAvatar`
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
                        Speciality: {appointment.specialtyName}
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

export default Appointments;
