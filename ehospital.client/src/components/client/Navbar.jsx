import React, { useContext, useEffect, useState, useMemo } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const {
    resetTokens,
    getCurrentUser,
    accessToken,
    curUser,
    setAccessToken,
    setCurUser,
    fetchUserById,
    ADMIN_URL,
  } = useContext(AppContext);

  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (curUser) {
      setIsPatient(curUser.role === "patient"); // Check if user is a patient
      if (curUser.role === "patient") {
      } else {
        // navigate(ADMIN_URL);
      }
    }
  }, [accessToken, curUser, navigate]);

  const user = useMemo(
    () => ({
      name: curUser ? `${curUser.firstName} ${curUser.lastName}` : "Guest",
      email: curUser ? curUser.email : "",
      imageUrl: assets.profile,
    }),
    [curUser]
  );

  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      resetTokens(
        localStorage.getItem("accessToken"),
        localStorage.getItem("refreshToken"),
        setAccessToken,
        setCurUser,
        fetchUserById
      );
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [resetTokens, setAccessToken, setCurUser, fetchUserById]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setCurUser(null);
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center py-4 mb-5 border-b-2 border-gray-400">
      <img
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {accessToken ? (
          <div className="hidden md:block">
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img className="w-8 rounded-full" src={assets.profile} alt="" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="bg-stone-100 min-w-48 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => {
                      navigate("/myProfile");
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/myAppointments");
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={handleLogout}
                    className="hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-primary text-white px-8 py-2.5 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-8 md:hidden transition-all"
          src={assets.menu_icon}
          alt=""
        />
        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "hidden h-0 w-0"
          } md:hidden top-0 right-0 bottom-0 w-full overflow-hidden bg-white z-20 transition-all`}
        >
          <div className="flex justify-between items-center p-4">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-16"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-4 mt-4 text-lg font-medium">
            <NavLink
              to="/"
              onClick={() => {
                setShowMenu(false);
              }}
              className="w-full p-2 text-center"
            >
              <p className="rounded px-4 py-2 inline-block w-full">Home</p>
            </NavLink>
            <NavLink
              to="/doctors"
              onClick={() => {
                setShowMenu(false);
              }}
              className="w-full p-2 text-center"
            >
              <p className="rounded px-4 py-2 inline-block w-full">
                All Doctors
              </p>
            </NavLink>
            {accessToken ? (
              <>
                <NavLink
                  className="w-full p-2 text-center"
                  to="/myProfile"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  <p className="rounded px-4 py-2 inline-block w-full">
                    My Profile
                  </p>
                </NavLink>
                <NavLink
                  className="w-full p-2 text-center"
                  to="/myAppointments"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  <p className="rounded px-4 py-2 inline-block w-full">
                    My Appointments
                  </p>
                </NavLink>
                <NavLink
                  className="w-full p-2 text-center"
                  to="/login"
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                >
                  <p className="rounded px-4 py-2 inline-block w-full">
                    Logout
                  </p>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  className="w-full p-2 text-center"
                  to="/login"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  <p className="rounded px-4 py-2 inline-block w-full">
                    Create Account
                  </p>
                </NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
