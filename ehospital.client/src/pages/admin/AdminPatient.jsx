import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_frontend/assets";

const AdminPatient = () => {
    const { patientID } = useParams();
    const navigate = useNavigate();
    const {
        getPatientById,
        getAppointmentsByPatient,
        deleteAppointment,
        deletePatient,
        accessToken,
    } = useContext(AppContext);

    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch patient data
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                var patientData = await getPatientById(patientID);

                if (patientData) {
                    setPatient(patientData);
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [getPatientById, patientID]);

    // Fetch the appointments for a specific patient
    useEffect(() => {
        const fetchAppointmentsData = async () => {
            if (accessToken && patient) {
                try {
                    const appointmentsData = await getAppointmentsByPatient(patientID);

                    setAppointments(appointmentsData || []);

                } catch (error) {
                    console.error("Error fetching appointments:", error);
                }
            }
        };

        if (patient) {
            fetchAppointmentsData();
        }
    }, [accessToken, getAppointmentsByPatient, patient, patientID]);

    // Handle deleting appointment
    const handleDeleteAppointment = async (appointmentId) => {
        try {
            await deleteAppointment(appointmentId);
            setAppointments((prevAppointments) =>
                prevAppointments.filter(
                    (appointment) => appointment.id !== appointmentId
                )
            );
        } catch (error) {
            console.error("Failed to delete appointment:", error);
        }
    };

    // Handle dleting patient
    const handleDeletePatient = async () => {
        try {
            await deletePatient(patientID, "patient");
            navigate("/patients");
        } catch (error) {
            console.error("Failed to delete patient:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-25">Loading patient data...</div>;
    }

    if (!patient) {
        return (
            <div className="text-center py-25">The Patient has not been found.</div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center justify-center sm:flex gap-5 sm:flex-row">
                <div>
                    <img
                        className="w-full sm:max-w-72 rounded-lg"
                        src={assets.profile}
                        alt={`${patient.firstName} ${patient.lastName}`}
                    />
                </div>
                <div className="border flex flex-col gap-2 border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                        <img className="w-5" src={assets.verified_icon} alt="Verified" />
                    </p>
                    <div className="flex items-center gap-2 text-xl font-light text-gray-700">
                        <p>Birth Date: </p>
                        <button className="text-sm">{patient.birthdate}</button>
                    </div>
                    <div className="flex items-center gap-2 text-xl font-light text-gray-700">
                        <p>Email: </p>
                        <button className="text-light text-indigo-700">
                            {patient.email}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <p>Patient since </p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">
                            {patient.registerDate}
                        </button>
                    </div>
                </div>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white rounded-md mt-4 p-3 w-32 max-md:w-full"
                    onClick={handleDeletePatient}
                >
                    Delete Patient
                </button>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-center">
                    {patient.firstName}'s Appointments
                </h1>
                <div className="flex flex-col gap-4 mt-10 mx-16">
                    <hr className="w-full" />
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <React.Fragment key={appointment.id}>
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
                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                    >
                                        Cancel Appointment
                                    </button>
                                </div>
                                <hr className="w-full" />
                            </React.Fragment>
                        ))
                    ) : (
                        <p className="text-center">No appointments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPatient;
