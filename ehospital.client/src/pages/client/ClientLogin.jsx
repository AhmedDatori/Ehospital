/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";


const ClientLogin = () => {
    const [isLogin, setIsLogin] = useState(false);
    const {
        accessToken,
        login,
        createPatient,
    } = useContext(AppContext);

    const [PatientFormData, setPatientFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        registerDate: new Date().toISOString().split("T")[0],
        birthdate: "",
    });
    const [LoginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
        role: "patient"
    });

    useEffect(() => {
        setLoginFormData({
            email: "",
            password: "",
            role: "patient"
        });
    }, [isLogin]);

    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        if (isLogin) {
            setLoginFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setPatientFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = isLogin ? LoginFormData : PatientFormData;

        if (!accessToken) {
            if (isLogin) {
                const response = await login(formData);
                console.log("Response:", response);
                if (response) {
                    setIsLogin(false);
                    if (response == "patient") {
                        console.log("patient login")
                    }
                    navigate("/MyProfile");
                }
            }
        } else {
            await createPatient(formData);
            setIsLogin(true);

        }
    }


return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src={assets.logo}
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        {isLogin ? "Sign in to your account" : "Create a New account"}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form method="POST" onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            onChange={handleInputChange}
                                            autoComplete="given-name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            onChange={handleInputChange}
                                            autoComplete="given-name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        Birth Date
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="birthdate"
                                            name="birthdate"
                                            onChange={handleInputChange}
                                            type="date"
                                            required
                                            min={
                                                new Date(
                                                    new Date().setFullYear(new Date().getFullYear() - 99)
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            max={new Date().toISOString().split("T")[0]}
                                            autoComplete="given-name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    type="email"
                                    required
                                    value={isLogin ? LoginFormData.email : PatientFormData.email}
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    type="password"
                                    required
                                    value={
                                        isLogin ? LoginFormData.password : PatientFormData.password
                                    }
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                {isLogin ? "Login" : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        {isLogin && "Don't"} have an Account?{" "}
                        <a
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-semibold text-primary hover:text-primary cursor-pointer"
                        >
                            {isLogin ? "Create Account" : "Login"}
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ClientLogin;
