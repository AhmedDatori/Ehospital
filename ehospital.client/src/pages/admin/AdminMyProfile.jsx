/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
    const [user, setUser] = useState({});
    const { accessToken, currentUser, getDoctorById, getAdminById, updateDoctor, deleteDoctor, updateAdmin,deleteAdmin } =
        useContext(AppContext);
    const [userDataFetched, setUserDataFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
        if (accessToken && currentUser) {
        try {
            var userData;
            if (currentUser.role === "doctor") {
                userData = await getDoctorById(currentUser.id);
            } else if (currentUser.role === "admin") {
                userData = await getAdminById(currentUser.id);
            }
            if (userData && !userDataFetched) {
                console.log(userData)
                setUserDataFetched(true);
                setUser(prevUser => ({
                    ...prevUser,
                    id: userData.id,
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    specialization: userData.specialization || "",
                    email: userData.email || "",
                    password: userData.password || "",
                    birthdate: userData.birthdate || "",
                }));
            }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        toast.error("You are not logged in. Please log in and try again.");
        // navigate("/dashboard/login");
      }
    };

      fetchUserData();
  }, [accessToken, currentUser, navigate, userDataFetched]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

      if (!accessToken || !currentUser) {
      toast.error("You are not logged in. Please log in and try again.");
        navigate("/dashboard/login");
      return;
    }

    try {
        var updatedUser;
        if (currentUser.role === "doctor") {
            console.log("user",user)
            updatedUser = await updateDoctor(user);
        } else if (currentUser.role === "admin") {
            //console.log("user",user)
            updatedUser = await updateAdmin(user)
        }
      setUser(updatedUser);
        setIsEdit(false);
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error updating account. Please try again.");
    }
        setUserDataFetched(false);
  };

  // Handle deleting account
  const handleDeleteAccount = async () => {
      if (!accessToken || !currentUser) {
      toast.error("You are not logged in. Please log in and try again.");
        navigate("/dashboard/login");
      return;
    }

      try {
          if (currentUser.role === "doctor") {
              await deleteDoctor(user.id);
          } else if (currentUser.role === "admin") {
              await deleteAdmin(user.id);
          }
        navigate("/dashboard/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account. Please try again.");
    }
  };

  return (
    <>
      {accessToken ? (
        <div className="flex flex-col gap-4 mt-10 mx-16 max-md:mx-4">
          <img
            src={assets.profile}
            className="w-64 max-md:w-full"
            alt="Profile"
          />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold ml-4 max-md:text-center max-md:text-3xl max-md:font-bold max-md:mt-4">
              {user.firstName} {user.lastName}
            </p>
            <hr className="w-96 sm:w-64" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="my-3 font-semibold max-md:text-center max-md:text-xl max-md:mt-4">
              Contact Information
            </p>
            <form className="grid grid-cols-1 gap-2 max-md:items-center max-md:text-lg">
              <label>First Name:</label>
              <input
                disabled={!isEdit}
                className="text-lg mb-3 w-80 border-primary border rounded-md p-2 max-md:w-full"
                value={user.firstName || ""}
                name="firstName"
                type="text"
                onChange={handleInputChange}
              />
              <label>Last Name:</label>
              <input
                disabled={!isEdit}
                className="text-lg mb-3 w-80 border-primary border rounded-md p-2 max-md:w-full"
                value={user.lastName || ""}
                name="lastName"
                type="text"
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                disabled={!isEdit}
                className="text-lg mb-3 w-80 border-primary border rounded-md p-2 max-md:w-full"
                value={user.email || ""}
                name="email"
                type="email"
                onChange={handleInputChange}
              />
              <label>Birth Date:</label>
              <input
                disabled={!isEdit}
                className="text-lg mb-3 w-80 border-primary border rounded-md p-2 max-md:w-full"
                value={user.birthdate || ""}
                name="birthdate"
                type="date"
                onChange={handleInputChange}
              />
              <div className="flex gap-4 max-md:flex-col">
                <button
                  type="button"
                  className="bg-primary hover:bg-secondary-1 text-white rounded-md mt-4 p-2 w-32 max-md:w-full"
                  onClick={isEdit ? handleSubmit : () => setIsEdit(true)}
                >
                  {isEdit ? "Save" : "Edit"}
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white rounded-md mt-4 p-3 w-32 max-md:w-full"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        "Please log in to view your profile"
      )}
    </>
  );
};

export default MyProfile;
