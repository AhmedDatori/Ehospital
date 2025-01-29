import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({});
  const {
    accessToken,
    curUser,
    fetchUserById,
    updateUser,
    deleteUser,
  } = useContext(AppContext);
  const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

      const fetchUserData = async () => {
          //console.log(accessToken, curUser)
      if (accessToken && curUser) {
        try {
           //console.log("Fetching user data...", curUser);
            const userData = await fetchUserById(curUser?.userID, curUser?.role);
            if (userData && isMounted) {
                //console.log(userData)
                setUser({
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    birthdate: userData.birthdate,
                    passwprd: null,
                    registerDate: userData.registerDate,
                });
            
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data");
        }
      } else {
        toast.error("You are not logged in. Please log in and try again.");
        //navigate("/login");
      }
    };

      fetchUserData();

      return () => { isMounted = false; };
  }, [accessToken, curUser]);

  // when input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken || !curUser) {
      toast.error("You are not logged in. Please log in and try again.");
      navigate("/login");
      return;
    }

    try {
        const updatedUser = await updateUser(user.id, curUser.role, user);
        //console.log("updated user", updatedUser)
      setUser(updatedUser);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error updating account. Please try again.");
    }
  };

  // delete account
  const handleDeleteAccount = async () => {
    if (!accessToken || !curUser) {
      toast.error("You are not logged in. Please log in and try again.");
      navigate("/login");
      return;
    }

    try {
      await deleteUser(user.id, curUser.role);
      toast.success("Account deleted successfully!");
      navigate("/login");
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
                min={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 99)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                max={new Date().toISOString().split("T")[0]}
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

export default ClientProfile;
