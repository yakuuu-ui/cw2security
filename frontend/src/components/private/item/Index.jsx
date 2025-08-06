
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaSearch, FaTags, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchItems = async (token, csrfToken) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/item/getItems', {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch items');
        }
    } catch (error) {
        console.error('AllItem.jsx: Error fetching items:', error.response?.data || error.message);
        throw error;
    }
};

const AllItem = () => {
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
                console.log('AllItem.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('AllItem.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: items, isLoading, error } = useQuery({
        queryKey: ['ITEMS'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('AllItem.jsx: JWT Token:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            return fetchItems(token, csrfToken);
        },
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (itemId) => {
            const token = sessionStorage.getItem('token');
            console.log('AllItem.jsx: JWT Token for delete:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            await axios.delete(`http://localhost:3000/api/v1/item/deleteItem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Item deleted successfully.');
            queryClient.invalidateQueries(['ITEMS']);
        },
        onError: (error) => {
            console.error('AllItem.jsx: Error deleting item:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to delete item');
            }
        }
    });

    const handleDelete = (itemId) => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteMutation.mutate(itemId),
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const filteredItems = items
        ? items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        : [];

    if (isLoading || isCsrfLoading) return <div className="p-6 text-gray-800">Loading...</div>;
    if (error) return <div className="p-6 text-gray-800">Error fetching items: {error.message}</div>;

    return (
        <div className="p-3 bg-gray-100 min-h-screen">
            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium flex items-center text-[#00bf63]">
                        <FaTags className="mr-2 text-[#00bf63]" /> Item List
                    </h2>
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by item name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                        />
                        <FaSearch className="absolute left-3 top-2.5 text-[#00bf63]" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300 bg-green-50">
                        <thead className="bg-green-50">
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">SN</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Item ID</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Name</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Category</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Subcategory</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Image</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Description</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Price</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Tags</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Availability</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63] whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, index) => (
                                <tr key={item._id} className="text-center hover:bg-green-100 transition">
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{index + 1}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item._id}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item.category?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item.subcategory?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <img
                                            src={`http://localhost:3000/uploads/${item.image}`}
                                            alt={item.name}
                                            className="w-20 h-15 object-cover rounded mx-auto"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item.description}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">Rs {item.price}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item.tags ? item.tags.join(', ') : 'N/A'}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{item.availability}</td>
                                    <td className="py-10 px-4 border-b border-gray-300 flex justify-center space-x-2">
                                       
                                        <button
                                            className="text-[#00bf63] hover:text-[#009f4e] transition"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllItem;
