
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
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
        console.error('AddItem.jsx: Error fetching categories:', error.response?.data || error.message);
        throw error;
    }
};

const fetchSubcategories = async (category, token, csrfToken) => {
    try {
        if (!category) return [];
        const response = await axios.get(`http://localhost:3000/api/v1/subcategory/getSubcategoriesByCategoryId/${category}`, {
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
        console.error('AddItem.jsx: Error fetching subcategories:', error.response?.data || error.message);
        throw error;
    }
};

const AddItem = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [availability, setAvailability] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);
    const tagOptions = ['Featured', 'Popular', 'Trending', 'Special'];

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('AddItem.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('AddItem.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: categories, isLoading: categoryLoading, error: categoryError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('AddItem.jsx: JWT Token for categories:', token);
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

    const { data: subcategories, isLoading: subcategoryLoading } = useQuery({
        queryKey: ['subcategories', category],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('AddItem.jsx: JWT Token for subcategories:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            return fetchSubcategories(category, token, csrfToken);
        },
        enabled: !!category && !!csrfToken
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleTagChange = (e) => {
        const { value, checked } = e.target;
        setTags((prevTags) => (checked ? [...prevTags, value] : prevTags.filter((tag) => tag !== value)));
    };

    const mutation = useMutation({
        mutationKey: ['ADD_ITEM'],
        mutationFn: async (newItem) => {
            const token = sessionStorage.getItem('token');
            console.log('AddItem.jsx: JWT Token for submit:', token);
            if (!token) {
                throw new Error('No authentication token found');
            }
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('category', newItem.category);
            formData.append('subcategory', newItem.subcategory);
            formData.append('description', newItem.description);
            formData.append('price', newItem.price);
            formData.append('availability', newItem.availability);
            formData.append('tags', newItem.tags.join(','));
            formData.append('itemImage', newItem.image);
            return axios.post('http://localhost:3000/api/v1/item/createItem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['items']);
            toast.success('Item added successfully.', { autoClose: 4000 });
            setName('');
            setCategory('');
            setSubcategory('');
            setDescription('');
            setPrice('');
            setAvailability('');
            setImage(null);
            setPreview(null);
            setTags([]);
            document.getElementById('imageInput').value = '';
        },
        onError: (error) => {
            console.error('AddItem.jsx: Error adding item:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to add item. Please try again.');
            }
        }
    });

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
        if (!name || !category || !subcategory || !description || !price || !image) {
            toast.error('Please fill in all fields and upload an image.');
            return;
        }
        if (isNaN(price) || price <= 0) {
            toast.error('Please enter a valid price.');
            return;
        }
        const newItem = { name, category, subcategory, description, price, availability, tags, image };
        mutation.mutate(newItem);
    };

    return (
        <div className="p-3 bg-white min-h-screen">
            <div className="p-6 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                <h2 className="text-xl font-medium flex items-center mb-4 text-blue-700">
                    <FaPlus className="mr-2 text-blue-700" /> Add New Instrument
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Instrument Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter instrument name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setSubcategory('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={categoryLoading || isCsrfLoading}
                            required
                        >
                            <option value="">Select Category</option>
                            {categoryLoading || isCsrfLoading ? (
                                <option>Loading categories...</option>
                            ) : categoryError ? (
                                <option>Error fetching categories</option>
                            ) : (
                                categories?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Subcategory</label>
                        <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!category || subcategoryLoading || isCsrfLoading}
                            required
                        >
                            <option value="">Select Subcategory</option>
                            {subcategoryLoading ? (
                                <option>Loading subcategories...</option>
                            ) : (
                                subcategories?.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Availability</label>
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Availability</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
                            id="imageInput"
                            required
                        />
                        {preview && (
                            <div className="mt-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Tags</label>
                        <div className="flex space-x-4">
                            {tagOptions.map((tag) => (
                                <div key={tag} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={tag}
                                        checked={tags.includes(tag)}
                                        onChange={handleTagChange}
                                        className="mr-2 accent-blue-600"
                                    />
                                    <span className="text-gray-800">{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                            disabled={mutation.isLoading || isCsrfLoading}
                        >
                            {mutation.isLoading ? 'Adding...' : isCsrfLoading ? 'Loading...' : 'Add Instrument'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
