/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetTokens } from "../../services/authUtils";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { assets } from "../../assets/assets_frontend/assets";

const AdminLogin = () => {
  const [isAdmin, setIsAdmin] = useState(true);
    const { accessToken,
        login,
        getCurrentUser } =
    useContext(AppContext);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
    role: isAdmin ? "admin" : "doctor",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/Dashboard");
    }
  }, [accessToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { ...loginFormData, role: isAdmin ? "admin" : "doctor" };
      const response = await login(formData);
      await getCurrentUser();
      if (response) {
          navigate("/Dashboard");
      }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={assets.logo}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isAdmin ? "Doctor? " : "Admin? "}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Login to Your Dashboard
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
