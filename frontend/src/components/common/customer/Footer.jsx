import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import logo from "../../../assets/images/logo.svg";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
                {/* Logo and About Section */}
                <div className='md:ml-8'>
                    <h2 className="text-2xl font-bold flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center p-2">
                            <img
                                src={logo}
                                alt="musicio logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-white">musicio</span>
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        musicio is your trusted marketplace for musical instruments—connecting musicians and sellers with ease. Discover your perfect sound.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="/about-us" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/contact-us" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Other Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Other Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="/privacy-and-policy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                Terms & Conditions
                            </a>
                        </li>
                        <li>
                            <a href="/refund-policy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                Refund Policy
                            </a>
                        </li>
                        <li>
                            <a href="/cancellation-policy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                Cancellation Policy
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            <a href="mailto:musicio@musicio.com" className="hover:text-white transition-colors duration-200">
                                musicio@musicio.com
                            </a>
                        </li>
                        <li className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            +977 1234567890
                        </li>
                        <li className="flex items-center">
                            <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                            Kathmandu, Nepal
                        </li>
                    </ul>
                    <div className="flex space-x-4 mt-6">
                        <a href="https://www.facebook.com/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-xl" />
                        </a>
                        <a href="https://www.linkedin.com/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-xl" />
                        </a>
                        <a href="https://x.com/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10" target="_blank" rel="noopener noreferrer">
                            <FaXTwitter className="text-xl" />
                        </a>
                        <a href="https://www.instagram.com/" className="text-gray-300 hover:text-pink-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-xl" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/20 mt-12 pt-6 text-center text-gray-400 text-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <img src={logo} alt="musicio logo" className="w-4 h-4 object-contain" />
                    </div>
                    <span>Copyright © 2024 musicio | All Rights Reserved</span>
                </div>
                <p className="text-xs text-gray-500">Harmonizing the world, one instrument at a time</p>
            </div>
        </footer>
    );
};

export default Footer;
