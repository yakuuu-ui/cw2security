
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaUser, FaSearch, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchCustomers = async (token, csrfToken) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/getAllCustomers', {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch customers');
        }
    } catch (error) {
        console.error('User.jsx: Error fetching customers:', error.response?.data || error.message);
        throw error;
    }
};

const User = () => {
    const [search, setSearch] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('User.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('User.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: customers, isLoading, error } = useQuery({
        queryKey: ['CUSTOMERS'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('User.jsx: JWT Token:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            return fetchCustomers(token, csrfToken);
        },
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (customerId) => {
            const token = sessionStorage.getItem('token');
            console.log('User.jsx: JWT Token for delete:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            await axios.delete(`http://localhost:3000/api/v1/auth/deleteCustomer/${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Customer deleted successfully.');
            queryClient.invalidateQueries(['CUSTOMERS']);
        },
        onError: (error) => {
            console.error('User.jsx: Error deleting customer:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to delete customer');
            }
        }
    });

    const handleDelete = (customerId) => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this customer?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteMutation.mutate(customerId),
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const filteredCustomers = customers
        ? customers.filter(customer =>
            `${customer.fname} ${customer.lname}`.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    if (isLoading || isCsrfLoading) return <div className="p-6 text-gray-800">Loading...</div>;
    if (error) return <div className="p-6 text-gray-800">Error fetching customers: {error.message}</div>;

    return (
        <div className="p-3 bg-gray-100 min-h-screen">
            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium flex items-center text-[#00bf63]">
                        <FaUser className="mr-2 text-[#00bf63]" /> User Details
                    </h2>
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by customer name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                        />
                        <FaSearch className="absolute left-3 top-2.5 text-[#00bf63]" />
                    </div>
                </div>
                <table className="min-w-full bg-green-50 border border-gray-300">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] text-left">Name</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] text-left">Email</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] text-left">Phone</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] text-left">Role</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer._id} className="border-b hover:bg-green-100 transition">
                                    <td className="py-2 px-4 text-gray-800 flex items-center space-x-2">
                                        <FaUser className="text-[#00bf63]" />
                                        <span>{`${customer.fname} ${customer.lname}`}</span>
                                    </td>
                                    <td className="py-2 px-4 text-gray-800">{customer.email}</td>
                                    <td className="py-2 px-4 text-gray-800">{customer.phone}</td>
                                    <td className="py-2 px-4 text-gray-800">{customer.role}</td>
                                    <td className="py-2 px-4 text-gray-800">
                                        <button
                                            className="text-[#00bf63] hover:text-[#009f4e] transition"
                                            onClick={() => handleDelete(customer._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-2 px-4 text-center text-gray-800">
                                    No customers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
