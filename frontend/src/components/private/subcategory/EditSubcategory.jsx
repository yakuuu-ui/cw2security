import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

const User = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage

                const response = await axios.get("http://localhost:3000/api/v1/auth/getAllCustomers", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Log the response data to ensure it's an array
                console.log(response.data);

                // Ensure that the response data is an array, if not set to empty array
                setCustomers(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch customers");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-3">
            <h2 className="text-xl font-medium text-left text-black mb-8 flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <span>Customer Details</span>
            </h2>
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Phone</th>
                        <th className="py-2 px-4 text-left">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(customers) && customers.length > 0 ? (
                        customers.map((customer) => (
                            <tr key={customer._id} className="border-b">
                                <td className="py-2 px-4 flex items-center space-x-2">
                                    <FaUser className="text-gray-500" />
                                    {`${customer.fname} ${customer.lname}`}
                                </td>
                                <td className="py-2 px-4">{customer.email}</td>
                                <td className="py-2 px-4">{customer.phone}</td>
                                <td className="py-2 px-4">{customer.role}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-2 px-4 text-center">No customers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default User;
