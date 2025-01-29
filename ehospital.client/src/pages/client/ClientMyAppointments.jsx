import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";

const ClientMyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { accessToken, curUser, getAppointmentsByID, deleteAppointment } =
    useContext(AppContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      // console.log("Fetching appointments...");
      if (accessToken && curUser) {

          const fetchedAppointments = await getAppointmentsByID(
              curUser.userID,
              curUser.role
          );
          setAppointments(fetchedAppointments || []);
        
      }
    };

    fetchAppointments();
  }, [accessToken, curUser, getAppointmentsByID]);

    const handleDeleteAppointment = async (appointmentId) => {

    // update the UI
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
    setAppointments(updatedAppointments);

    try {
      await deleteAppointment(appointmentId);
    } catch (error) {
      console.error("Failed to delete the appointment:", error);
      setAppointments(appointments);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-10 mx-16">
      <h1>My Appointments</h1>
      <hr className="w-full" />
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <React.Fragment key={appointment.id}>
            {/* {console.log("Appointment:", appointment)} */}
            <div className="flex flex-row max-md:flex-col items-center gap-4 justify-between">
              <div className="flex flex-row max-md:flex-col items-center gap-4">
                <img
                  src={assets.docAvatatr}
                  className="w-32 max-md:w-5/6"
                  alt="Doctor"
                />
                <div className="flex flex-col gap-2 self-center mb-2 max-md:text-center">
                  <p className="text-lg font-semibold ml-4 max-md:text-2xl">
                    Dr. {appointment.doctorName}
                  </p>
                  <p className="text-lg font-semibold ml-4 max-md:text-xl">
                                {appointment.specialityName}
                  </p>
                </div>
              </div>
              <button
                className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 max-md:text-xl max-md:w-5/6"
                onClick={() => {
                  handleDeleteAppointment(appointment.id);
                }}
              >
                Cancel Appointment
              </button>
            </div>
            <hr className="w-full" />
          </React.Fragment>
        ))
      ) : (
        <p>No appointments found</p>
      )}
    </div>
  );
};

export default ClientMyAppointments;
