import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const ContactUs = () => {
    return (
        <>
            <Layout />
            <div className="max-w-7xl bg-gray-300  mx-auto p-6">
                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-black mb-8">Contact Musicio</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <FaPhoneAlt className="text-[#00bf63]" />
                                <span className="text-gray-700">+1 234 567 890</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <FaEnvelope className="text-[#00bf63]" />
                                <span className="text-gray-700">support@Musicio.com</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <FaMapMarkerAlt className="text-[#00bf63]" />
                                <span className="text-gray-700">123 Musicio Street, Food City, Country</span>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-6 flex space-x-4">
                            <a href="#" className="text-[#00bf63] hover:text-green-700 text-xl" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-[#00bf63] hover:text-green-700 text-xl" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-[#00bf63] hover:text-green-700 text-xl" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="border p-2 w-full rounded" />
                                <input type="text" placeholder="Last Name" className="border p-2 w-full rounded" />
                            </div>
                            <input type="email" placeholder="Email" className="border p-2 w-full rounded" />
                            <input type="tel" placeholder="Phone Number" className="border p-2 w-full rounded" />
                            <input type="text" placeholder="Subject" className="border p-2 w-full rounded" />
                            <textarea placeholder="Message" className="border p-2 w-full rounded h-24"></textarea>
                            <button type="submit" className="w-full bg-[#00bf63] text-white py-2 rounded hover:bg-green-700 transition">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>

                {/* Google Map Container */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">Our Location</h3>
                    <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                        <iframe
                            title="Google Map"
                            className="w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345086204!2d144.95565161531577!3d-37.81732397975154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df93df25f%3A0x2a0b1e787c8a4387!2sSome%20Location!5e0!3m2!1sen!2sus!4v1632950148477!5m2!1sen!2sus"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ContactUs;
