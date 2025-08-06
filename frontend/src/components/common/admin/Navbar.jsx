import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/images/logo.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    // Function to handle closing the dropdown
    const handleDropdownClick = () => {
        setShowDropdown(false);
    };
    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        logout(); // Use the AuthContext logout function
                        navigate("/login"); // Navigate to login page
                    },
                },
                {
                    label: "No", // Do nothing if user cancels
                },
            ],
        });
    };


    return (
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white shadow px-6 py-4 z-50">
            {/* musicio Logo & Text */}
            <div className="flex items-center gap-2">
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                    <img src={logo} alt="musicio logo" className="w-10 h-8" />
                    <span className="text-xl font-bold text-blue-700">musicio</span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded hover:bg-gray-100"
                    >
                        <span className="text-gray-700">Admin</span>

                        <img
                            src="/src/assets/images/restaurant.jpg"
                            alt="Profile"
                            className="w-8 h-8 rounded-full border"
                        />
                        <FaChevronDown className="text-gray-500 text-sm" /> {/* Chevron Down Icon */}
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
                            <ul className="text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <Link to="/admin/setting" onClick={handleDropdownClick}>
                                        Setting
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
