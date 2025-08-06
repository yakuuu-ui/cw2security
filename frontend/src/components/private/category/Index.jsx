
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaSearch, FaTags, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllCategory = () => {
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
                console.log('AllCategory.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('AllCategory.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('AllCategory.jsx: JWT Token:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await axios.get('http://localhost:3000/api/v1/category/getCategories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });
            return response.data;
        },
        onError: (error) => {
            console.error('AllCategory.jsx: Error fetching categories:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (categoryId) => {
            const token = sessionStorage.getItem('token');
            console.log('AllCategory.jsx: JWT Token for delete:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            await axios.delete(`http://localhost:3000/api/v1/category/deleteCategory/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Category deleted successfully.');
            queryClient.invalidateQueries(['categories']);
        },
        onError: (error) => {
            console.error('AllCategory.jsx: Error deleting category:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to delete category');
            }
        }
    });

    const handleDelete = (categoryId) => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteMutation.mutate(categoryId),
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const filteredCategories = data?.data.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading || isCsrfLoading) return <div className="p-6 text-gray-800">Loading...</div>;
    if (error) return <div className="p-6 text-gray-800">Error fetching categories: {error.message}</div>;

    return (
        <div className="p-3 bg-gray-100 min-h-screen">
            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium flex items-center text-[#00bf63]">
                        <FaTags className="mr-2 text-[#00bf63]" /> Category List
                    </h2>
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by category name"
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
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">SN</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Image</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Category ID</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Name</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Description</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories?.map((category, index) => (
                            <tr key={category._id} className="text-center hover:bg-green-100 transition">
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{index + 1}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    <img
                                        src={`http://localhost:3000/uploads/${category.image}`}
                                        alt={category.name}
                                        className="w-20 h-15 object-cover rounded mx-auto"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{category._id}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{category.name}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{category.description}</td>
                                <td className="py-10 px-4 border-b border-gray-300 flex justify-center space-x-2">
                                    
                                    <button
                                        className="text-[#00bf63] hover:text-[#009f4e] transition"
                                        onClick={() => handleDelete(category._id)}
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
    );
};

export default AllCategory;
