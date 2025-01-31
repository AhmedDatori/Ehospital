/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Doctor from "./Doctor";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ specId, docId }) => {
    const { doctors, getSpecialityById } = useContext(AppContext);
    const [relDoc, setRelDoc] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Filter related doctors when `doctors`, `specId`, or `docId` changes
        if (doctors.length > 0 && specId && docId) {
            const relatedDocs = doctors.filter(
                (doc) => doc.specializationID == specId && doc.id != docId
            );
            setRelDoc(relatedDocs);
        }
    }, [doctors, specId, docId]);

    // Handle "more" button click
    const handleMoreClick = () => {
        const spec = getSpecialityById(specId);
        navigate(`/doctors/${spec.name}`);
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">Related Doctors</h1>
            <p className="text-center sm:w-1/3 text-sm">
                Simply browse through our extensive list of trusted doctors.
            </p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {relDoc.length > 0 ? (
                    relDoc
                        .slice(0, 5)
                        .map((doctor) => (
                            <Doctor
                                key={doctor.id}
                                doctor={doctor}
                            />
                        ))
                ) : (
                    <p>No related doctors found.</p>
                )}
            </div>
            {relDoc.length > 5 && (
                <button
                    onClick={handleMoreClick}
                    className="bg-primary text-white px-12 py-3 rounded-full mt-10 hover:bg-primary-dark transition-colors"
                >
                    More
                </button>
            )}
        </div>
    );
};

export default RelatedDoctors;
