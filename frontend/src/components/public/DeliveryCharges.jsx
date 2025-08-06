import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

import { FaClock, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const DeliveryCharges = () => {
    return (
        <>
            <Layout />
            <div className="max-w-4xl mx-auto p-6 bg-white mt-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
                    Delivery Charges
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Know the delivery charges based on your location and order value.
                </p>

                {/* Pricing Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border border-gray-300">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="p-4 text-gray-700 text-left border-r border-gray-300">
                                    <span className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-blue-500" /> Location
                                    </span>
                                </th>
                                <th className="p-4 text-gray-700 text-left border-r border-gray-300">
                                    <span className="flex items-center gap-2">
                                        <FaMoneyBillWave className="text-green-500" /> Charge
                                    </span>
                                </th>
                                <th className="p-4 text-gray-700 text-left">
                                    <span className="flex items-center gap-2">
                                        <FaClock className="text-yellow-500" /> Estimated Time
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-4 border-r border-gray-300">Within 5 km</td>
                                <td className="p-4 text-[#ff7918] font-semibold border-r border-gray-300">Free</td>
                                <td className="p-4">30 - 45 mins</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-4 border-r border-gray-300">5 - 10 km</td>
                                <td className="p-4 text-[#ff7918] font-semibold border-r border-gray-300">Rs. 100</td>
                                <td className="p-4">40 - 60 mins</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-4 border-r border-gray-300">10 - 15 km</td>
                                <td className="p-4 text-[#ff7918] font-semibold border-r border-gray-300">Rs. 150</td>
                                <td className="p-4">50 - 75 mins</td>
                            </tr>
                            <tr>
                                <td className="p-4 border-r border-gray-300">15+ km</td>
                                <td className="p-4 text-[#ff7918] font-semibold border-r border-gray-300">Rs. 200</td>
                                <td className="p-4">60 - 90 mins</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                {/* Extra Information */}
                <div className="mt-6 text-gray-700">
                    <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Free delivery is available for orders over <strong>Rs. 2000 </strong> within a 5 km radius.
                        </li>
                        <li>
                            Express delivery is available for an additional <strong>Rs. 1000</strong> (delivered within 30 mins).
                        </li>
                        <li>
                            Delivery times may vary depending on weather, traffic, and order volume.
                        </li>
                        <li>
                            For bulk or special orders, please contact our customer service.
                        </li>
                    </ul>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default DeliveryCharges;
