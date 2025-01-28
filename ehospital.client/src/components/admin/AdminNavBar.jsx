import React,{
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { assets } from "../../assets/assets_frontend/assets";
import { AppContext } from "../../context/AppContext";

function AdminNavBar() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const {
        resetTokens,
        getCurrentUser,
        accessToken,
        curUser,
        setAccessToken,
        setCurUser,
        fetchUserById,
    } = useContext(AppContext);

    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        if (!accessToken) {
            navigate("/Dashboard/login"); // Redirect to login if no access token
        } else if (curUser) {
            setIsAdmin(curUser.role === "admin"); // Check if user is admin
        }
    }, [accessToken, curUser, navigate]);

    // Memoize user data
    const user = useMemo(
        () => ({
            name: userData.firstName + " " + userData.lastName,
            email: userData.email,
            imageUrl: assets.profile,
        }),
        [userData]
    );

    // Handle storage changes (e.g., token updates)
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

    // Load user data when accessToken or curUser changes
    useEffect(() => {
        const loadUserData = async () => {
            if (accessToken && curUser) {
                try {
                    const userData = await getCurrentUser();
                    if (userData) {
                        setUserData(userData);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        loadUserData();
    }, [accessToken, curUser, getCurrentUser]);

    const navigation = [
        { name: "Dashboard", href: "/Dashboard/" },
        { name: "Doctors", href: "/Dashboard/Doctors" },
        { name: "Specialization", href: "/Dashboard/Specialization" },
        { name: "Appointments", href: "/Dashboard/Appointments" },
        { name: "Patients", href: "/Dashboard/Patients" },
    ];

    const userNavigation = [
        { name: "My Profile", href: "/Dashboard/my-profile" },
        { name: "Sign out", href: "" },
    ];

    return (
        <>
            {!accessToken ? (
                ""
            ) : (
                <div>
                    <div className="min-h-full">
                        <Disclosure as="nav" className="bg-gray-800">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="shrink-0">
                                            <img
                                                alt="EHospital"
                                                src={assets.logo}
                                                className="size-8"
                                            />
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <NavLink
                                                        key={item.name}
                                                        to={item.href}
                                                        className="text-gray-300 hover:bg-gray-700 hover:rounded-md hover:text-white"
                                                    >
                                                        <p className=" text-white  rounded-md px-3 py-2 text-sm font-medium">
                                                            {item.name}
                                                        </p>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {/* Profile dropdown */}
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">Open user menu</span>
                                                        <img
                                                            alt=""
                                                            src={user.imageUrl}
                                                            className="size-8 rounded-full"
                                                        />
                                                    </MenuButton>
                                                </div>
                                                <MenuItems
                                                    transition
                                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                                >
                                                    {userNavigation.map((item) => (
                                                        <MenuItem key={item.name}>
                                                            <a
                                                                href={item.href}
                                                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                                                onClick={() => {
                                                                    if (item.name == "Sign out") {
                                                                        localStorage.clear();
                                                                        navigate("/login");
                                                                    }
                                                                }}
                                                            >
                                                                {item.name}
                                                            </a>
                                                        </MenuItem>
                                                    ))}
                                                </MenuItems>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Open main menu</span>
                                            <Bars3Icon
                                                aria-hidden="true"
                                                className="block size-6 group-data-[open]:hidden"
                                            />
                                            <XMarkIcon
                                                aria-hidden="true"
                                                className="hidden size-6 group-data-[open]:block"
                                            />
                                        </DisclosureButton>
                                    </div>
                                </div>
                            </div>

                            <DisclosurePanel className="md:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                    {navigation.map((item) => (
                                        <DisclosureButton
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            aria-current={item.current ? "page" : undefined}
                                        >
                                            <p className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                                                {item.name}
                                            </p>
                                        </DisclosureButton>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pb-3 pt-4">
                                    <div className="flex items-center px-5">
                                        <div className="shrink-0">
                                            <img
                                                alt=""
                                                src={user.imageUrl}
                                                className="size-10 rounded-full"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base/5 font-medium text-white">
                                                {user.name}
                                            </div>
                                            <div className="text-sm font-medium text-gray-400">
                                                {user.email}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="absolute -inset-1.5" />
                                            {/* <span className="sr-only">View notifications</span> */}
                                            {/* <BellIcon aria-hidden="true" className="size-6" /> */}
                                        </button>
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        {userNavigation.map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as="a"
                                                onClick={() => {
                                                    if (item.name == "Sign out") {
                                                        localStorage.clear();
                                                        navigate("/login");
                                                    }
                                                }}
                                                href={item.href}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                    </div>
                                </div>
                            </DisclosurePanel>
                        </Disclosure>

                        {/* <header className="bg-white shadow">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Dashboard
                </h1>
              </div>
            </header> */}
                        {/* <main>
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"></div>
            </main> */}
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminNavBar;
