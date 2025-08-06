import { Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { VscHeart } from "react-icons/vsc";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/images/logo.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        logout();
                        navigate("/");
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleSignInClick = () => navigate("/login");
    const handleSignUpClick = () => navigate("/register");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/searchresult?query=${searchQuery}`);
        }
    };

    const activeLinkStyle = ({ isActive }) =>
        isActive
            ? "text-black border-b-2 border-blue-600 transition duration-300"
            : "text-black text-base hover:border-b-2 hover:border-blue-600 transition duration-300";

    return (
        <div className="bg-white shadow text-black sticky w-full top-0 left-0 z-50">
            <div className="flex justify-between items-center p-3 max-w-7xl mx-auto">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-2 ml-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                        <img
                            src={logo}
                            alt="musicio logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">musicio</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
                    <NavLink to="/menu" className={activeLinkStyle}>Shop</NavLink>
                    <NavLink to="/about-us" className={activeLinkStyle}>About</NavLink>
                </div>

                {/* Search Bar */}
                <div className="flex items-center bg-gray-100 p-2 rounded-lg w-64 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search instruments"
                        className="ml-2 bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="text-gray-600 ml-2">
                        <Search size={20} />
                    </button>
                </div>

                {/* Icons & Buttons */}
                <div className="flex items-center space-x-4 mr-4">
                    <Link to="/wishlist" className="text-2xl text-black"><VscHeart /></Link>
                    <Link to="/cart" className="text-2xl text-black"><ShoppingCart /></Link>
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-white text-black text-base px-3 py-1 rounded hover:bg-gray-100"
                            >
                                My Account
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded">
                                    <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 text-black">
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </Link>
                                    <Link to="/my-orders" className="flex items-center px-4 py-2 hover:bg-gray-100 text-black">
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        My Orders
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={handleSignInClick} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Sign In</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
