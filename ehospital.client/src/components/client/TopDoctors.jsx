/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Doctor from "./Doctor";

const TopDoctors = () => {
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
            <p className="text-center sm:w-1/3 text-sm">
                Simply browse through our extensive list of trusted doctors.
            </p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {doctors && (doctors.length > 0 ? (
                    doctors.slice(0, 5).map((doctor) => (
                        <Doctor
                            key={doctor.id}
                            doctor={doctor}
                        />
                    ))
                ) : (
                    <p>No doctors available.</p>
                ))}
            </div>

            {doctors && (
                doctors.length > 5 && (
                    <button
                        onClick={() => {
                            navigate("/doctors");
                            window.scrollTo(0, 0);
                        }}
                        className="bg-primary text-white px-12 py-3 rounded-full mt-10 hover:bg-primary-dark transition-colors"
                    >
                        More
                    </button>
                )
            )}
        </div>
    );
};

export default TopDoctors;
