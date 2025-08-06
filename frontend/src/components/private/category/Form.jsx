
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const [category, setCategory] = useState({
        name: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);

    useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('VerifyOtp.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('VerifyOtp.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to initialize. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategory({ ...category, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addCategoryMutation = useMutation({
        mutationKey: ['ADD_CATEGORY'],
        mutationFn: async (formData) => {
            return axios.post('http://localhost:3000/api/v1/category/createCategory', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Category added successfully.', { autoClose: 4000 });
            setCategory({ name: '', description: '', image: null });
            setImagePreview(null);
            document.getElementById("imageInput").value = "";
        },
        onError: (error) => {
            console.error('AddCategory.jsx: Error adding category:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to add category. Please try again.');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        const formData = new FormData();
        formData.append('name', category.name);
        formData.append('description', category.description);
        if (category.image) {
            formData.append('categoryImage', category.image);
        }
        addCategoryMutation.mutate(formData);
    };

    return (
        <div className="p-3 bg-gray-100 min-h-screen">
            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition">
                <h2 className="text-xl font-medium flex items-center mb-4 text-[#00bf63]">
                    <FaPlus className="mr-2 text-[#00bf63]" /> Add New Category
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
                            required
                            className="border text-black border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={category.description}
                            onChange={handleChange}
                            required
                            className="border text-black border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                            id="imageInput"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-gray-600">Image Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Selected"
                                    className="mt-2 w-40 h-40 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00bf63] text-white px-4 py-2 rounded-lg hover:bg-[#009f4e] transition disabled:bg-gray-400"
                        disabled={addCategoryMutation.isLoading || isCsrfLoading}
                    >
                        {addCategoryMutation.isLoading ? 'Adding...' : isCsrfLoading ? 'Loading...' : 'Add Category'}
                    </button>
                </form>
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
            </div>
        </div>
    );
};

export default AddCategory;