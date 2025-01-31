import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Doctor from "../../components/client/Doctor";

const ClientDoctors = () => {
    const { speciality } = useParams();
    const { doctors, specialities } = useContext(AppContext);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const navigate = useNavigate();

    // console.log(doctors, specialities, speciality);

    const applyFilter = () => {
        if (speciality) {
            setFilteredDoctors(
                doctors.filter(
                    (doc) => doc.specialization == speciality
                )
            );
        } else {
            setFilteredDoctors(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality]);
    return (
        <div>
            <p className="text-gray-600">Browse through the doctors specialist.</p>
            <div className="flex flex-col sm:flex-row items-start gap-6 mt-5">
                <div className="flex flex-col gap-4 text-lg text-gray-600">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`py-1 px-3 w-24 border rounded text-sm transition-all md:hidden ${showFilter ? "bg-primary text-white " : ""
                            }`}
                    >
                        Filters
                    </button>
                    {specialities && (specialities.map((spec) => (
                        <div
                            key={spec.id}
                            onClick={() => {
                                speciality === spec.name
                                    ? navigate(`/doctors`)
                                    : navigate(`/doctors/${spec.name}`);
                            }}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-20 border border-gray-300 rounded transition-all cursor-pointer hover:bg-slate-200 
                  ${speciality === spec.name
                                    ? "bg-primary text-white hover:bg-primary"
                                    : ""
                                } ${showFilter ? "flex" : "hidden sm:flex"}`}
                        >
                            {spec.name}
                        </div>
                    )))}
                </div>
                <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                    {filteredDoctors && (filteredDoctors.map((doctor, index) => (
                        <Doctor
                            key={index}
                            doctor={doctor}
                        />
                    )))}
                </div>
            </div>
        </div>
    );
};

export default ClientDoctors;
