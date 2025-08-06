import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
    const params = useParams();
    console.log("Params:", params); // Check if params contain 'id'

    const { id } = useParams();



    const navigate = useNavigate();

    const [category, setCategory] = useState({
        name: "",
        description: "",
        image: "",
    });

    const [imagePreview, setImagePreview] = useState(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["CATEGORY_DETAILS", id],
        enabled: !!id, // Only fetch if id exists
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/category/getCategory/${id}`);
            return res.data;
        },
        onError: (err) => {
            console.error("Error fetching category:", err);
        }
    });

    useEffect(() => {
        if (data && data.data) { // Ensure `data.data` exists
            setCategory({
                name: data.data.name || "",
                description: data.data.description || "",
                image: data.data.image || "",
            });

            setImagePreview(`http://localhost:3000/uploads/${data.data.image}`); // Assuming image is stored in uploads folder
        }
    }, [data]);


    // Handle text input changes

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategory({ ...category, image: file });
            setImagePreview(URL.createObjectURL(file)); // Preview new image
        }
    };

    // Mutation for updating category
    const updateCategoryMutation = useMutation({
        mutationKey: ["UPDATE_CATEGORY", id],
        mutationFn: async (formData) => {
            return axios.put(`http://localhost:3000/api/v1/category/updateCategory/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
        },

        onSuccess: () => {
            console.log("Category updated successfully."); // Debugging
            toast.success("Category updated successfully.", { autoClose: 5000 });
            setTimeout(() => navigate("/admin/category/all-categories"), 3000); // Wait 3 seconds
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update category. Please try again.");
        },
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", category.name);
        formData.append("description", category.description);
        if (category.image) {
            formData.append("categoryImage", category.image);
        }
        updateCategoryMutation.mutate(formData);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-medium flex items-center mb-4">
                <FaEdit className="mr-2" /> Edit Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Name */}
                <div>
                    <label className="block text-gray-700 mb-2">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        required
                        className="border border-gray-400 rounded-lg p-2 w-full"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={(e) => setCategory({ ...category, description: e.target.value })}
                        required
                        className="border border-gray-400 rounded-lg p-2 w-full"
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-700 mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-400 rounded-lg p-2 w-full"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-gray-600">Current Image:</p>
                            <img
                                src={imagePreview}
                                alt="Selected"
                                className="mt-2 w-40 h-40 object-cover rounded-lg border"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded "
                    disabled={updateCategoryMutation.isLoading}
                >
                    {updateCategoryMutation.isLoading ? "Updating..." : "Update Category"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditCategory;
