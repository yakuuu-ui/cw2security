
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchCategories = async (token, csrfToken) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/category/getCategories', {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch categories');
        }
    } catch (error) {
        console.error('AddSubcategory.jsx: Error fetching categories:', error.response?.data || error.message);
        throw error;
    }
};

const AddSubcategory = () => {
    const [subcategory, setSubcategory] = useState({
        category: '',
        name: '',
        description: ''
    });
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('AddSubcategory.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('AddSubcategory.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['CATEGORIES'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('AddSubcategory.jsx: JWT Token:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            return fetchCategories(token, csrfToken);
        },
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    const addSubcategoryMutation = useMutation({
        mutationKey: ['ADD_SUBCATEGORY'],
        mutationFn: async (subcategoryData) => {
            const token = sessionStorage.getItem('token');
            console.log('AddSubcategory.jsx: JWT Token for submit:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            return axios.post('http://localhost:3000/api/v1/subcategory/createSubcategory', subcategoryData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Subcategory added successfully.', { autoClose: 4000 });
            setSubcategory({ category: '', name: '', description: '' });
        },
        onError: (error) => {
            console.error('AddSubcategory.jsx: Error adding subcategory:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to add subcategory. Please try again.');
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategory({ ...subcategory, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to continue.', { autoClose: 4000 });
            setTimeout(() => navigate('/login'), 4000);
            return;
        }
        addSubcategoryMutation.mutate(subcategory);
    };

    return (
        <div className="p-3 bg-gray-100 min-h-screen">
            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <h2 className="text-xl font-medium flex items-center mb-4 text-[#00bf63]">
                    <FaPlus className="mr-2 text-[#00bf63]" /> Add New Subcategory
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={subcategory.category}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                            disabled={isLoading || isCsrfLoading}
                        >
                            <option value="">Select Category</option>
                            {isLoading || isCsrfLoading ? (
                                <option>Loading categories...</option>
                            ) : error ? (
                                <option>Error fetching categories</option>
                            ) : (
                                categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Subcategory Name</label>
                        <input
                            type="text"
                            name="name"
                            value={subcategory.name}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={subcategory.description}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00bf63] text-white px-4 py-2 rounded-lg hover:bg-[#009f4e] transition disabled:bg-gray-400"
                        disabled={addSubcategoryMutation.isLoading || isCsrfLoading}
                    >
                        {addSubcategoryMutation.isLoading ? 'Adding...' : isCsrfLoading ? 'Loading...' : 'Add Subcategory'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSubcategory;
