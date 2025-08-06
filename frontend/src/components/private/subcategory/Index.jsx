
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaSearch, FaTags, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchSubcategories = async (token, csrfToken) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/subcategory/getSubcategories', {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch subcategories');
        }
    } catch (error) {
        console.error('AllSubcategory.jsx: Error fetching subcategories:', error.response?.data || error.message);
        throw error;
    }
};

const AllSubcategory = () => {
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
                console.log('AllSubcategory.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('AllSubcategory.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: subcategories, isLoading, error } = useQuery({
        queryKey: ['SUBCATEGORIES'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('AllSubcategory.jsx: JWT Token:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            return fetchSubcategories(token, csrfToken);
        },
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (subcategoryId) => {
            const token = sessionStorage.getItem('token');
            console.log('AllSubcategory.jsx: JWT Token for delete:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            await axios.delete(`http://localhost:3000/api/v1/subcategory/deleteSubcategory/${subcategoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Subcategory deleted successfully.');
            queryClient.invalidateQueries(['SUBCATEGORIES']);
        },
        onError: (error) => {
            console.error('AllSubcategory.jsx: Error deleting subcategory:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to delete subcategory');
            }
        }
    });

    const handleDelete = (subcategoryId) => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this subcategory?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteMutation.mutate(subcategoryId),
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    const filteredSubcategories = subcategories
        ? subcategories.filter(subcategory => subcategory.name.toLowerCase().includes(search.toLowerCase()))
        : [];

    if (isLoading || isCsrfLoading) return <div className="p-6 text-gray-800">Loading...</div>;
    if (error) return <div className="p-6 text-gray-800">Error fetching subcategories: {error.message}</div>;

    return (
        <div className="p-3 bg-gray-100 min-h-screen">
            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium flex items-center text-[#00bf63]">
                        <FaTags className="mr-2 text-[#00bf63]" /> Subcategory List
                    </h2>
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by subcategory name"
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
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Subcategory ID</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Name</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Category</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Description</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-[#00bf63]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubcategories.map((subcategory, index) => (
                            <tr key={subcategory._id} className="text-center hover:bg-green-100 transition">
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{index + 1}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{subcategory._id}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{subcategory.name}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{subcategory.category?.name || "N/A"}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-gray-800">{subcategory.description}</td>
                                <td className="py-7 px-4 border-b border-gray-300 flex justify-center space-x-2">
                                    {/* <button
                                        onClick={() => {
                                            console.log("Navigating to:", `/admin/subcategory/edit-subcategory/${subcategory._id}`);
                                            navigate(`/admin/subcategory/edit-subcategory/${subcategory._id}`);
                                        }}
                                        className="text-[#00bf63] hover:text-[#009f4e] transition"
                                    >
                                        <FaEdit />
                                    </button> */}
                                    <button
                                        className="text-[#00bf63] hover:text-[#009f4e] transition"
                                        onClick={() => handleDelete(subcategory._id)}
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

export default AllSubcategory;
