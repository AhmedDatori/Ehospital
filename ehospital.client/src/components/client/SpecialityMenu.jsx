/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
const SpecialityMenu = () => {
    const { specialities } = useContext(AppContext);

    return (
        <div
            id="speciality"
            className="flex flex-col items-center gap-4 py-16 p-8 "
        >
            <h1 className="text-3xl font-medium">Find by Speciality</h1>
            <p className="sm:w-1/2 text-center text-sm">
                Simply browse through our extensive list of trusted doctors, schedule
                your appointment hassle-free.
            </p>
            <div className="flex flex-wrap sm:justify-center gap-4 pt-5 ">
                {specialities && (specialities.map((item, index) => (
                    <Link
                        onClick={() => scrollTo(0, 0)}
                        to={`/doctors/${item.name}`}
                        className="flex flex-col items-center  cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-300"
                        key={index}
                    >
                        <div className="bg-primary text-center shadow-md rounded-full mb-2 flex items-center justify-center w-40 h-40 hover:bg-secondary text-white ">
                            <p className="text-white ">{item.name}</p>
                        </div>
                    </Link>
                )))}
            </div>
        </div>
    );
};

export default SpecialityMenu;
