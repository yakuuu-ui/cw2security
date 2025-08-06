import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // States for form fields
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [availability, setAvailability] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);

    const [tags, setTags] = useState([]);

    // Tags options
    const tagOptions = ["Featured", "Popular", "Trending", "Special"];

    // Fetch item details
    const { data: itemData, isLoading: itemLoading } = useQuery({
        queryKey: ['ITEM_DETAILS', id],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/item/getItem/${id}`);
            return res.data;
        },
        onError: (err) => {
            console.error("Error fetching item:", err);
        },
    });

    // Fetch categories
    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:3000/api/v1/category/getCategories');
            return response.data.data;
        }
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Show selected image preview
        }
    };

    const { data: subcategories, isLoading: subcategoryLoading } = useQuery({
        queryKey: ["subcategories", category?._id], // Use category._id in queryKey
        queryFn: async () => {
            if (!category?._id) return []; // Ensure categoryId exists
            const res = await axios.get(`http://localhost:3000/api/v1/subcategory/getSubcategoriesByCategoryId/${category._id}`);
            return res.data.data;
        },
        enabled: !!category?._id, // Only fetch when category._id is available
    });

    useEffect(() => {
        if (itemData && itemData.data) {
            const { name, category, subcategory, description, price, availability, tags, image } = itemData.data;
            setName(name);
            setCategory(category);
            setSubcategory(subcategory);
            setDescription(description);
            setPrice(price);
            setAvailability(availability);
            setTags(tags || []);
            setImage(image);
            setImagePreview(`http://localhost:3000/uploads/${image}`);

        }
    }, [itemData]);

    // Mutation to update item
    const updateItemMutation = useMutation({
        mutationFn: async (updatedItem) => {
            const formData = new FormData();
            formData.append("name", updatedItem.name);
            formData.append("category", updatedItem.category);
            formData.append("subcategory", updatedItem.subcategory);
            formData.append("description", updatedItem.description);
            formData.append("price", updatedItem.price);
            formData.append("availability", updatedItem.availability);
            formData.append("tags", updatedItem.tags.join(","));
            formData.append("itemImage", updatedItem.image);

            await axios.put(`http://localhost:3000/api/v1/item/updateItem/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },

            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["items"]);
            toast.success("Item updated successfully!");
            setTimeout(() => navigate("/admin/menu/all-items"), 5000);
        },
        onError: (error) => {
            toast.error("Error updating item. Please try again.");
        }
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !category || !subcategory || !description || !price || !image) {
            toast.error("Please fill in all fields and upload an image.");
            return;
        }

        const updatedItem = {
            name,
            category: category?._id,
            subcategory: subcategory?._id,
            description,
            price,
            availability,
            tags,
            image,
        };

        updateItemMutation.mutate(updatedItem);
    };
    // Handle tag checkbox changes
    const handleTagChange = (e) => {
        const tag = e.target.value;
        setTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
        );
    };


    // if (itemLoading || categoryLoading || subcategoryLoading) return <p>Loading...</p>;

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-medium flex items-center mb-4">
                <FaEdit className="mr-2" /> Edit Item
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Item Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Item Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter item name"
                    />
                </div>

                <select
                    value={category?._id || ""}
                    onChange={(e) => {
                        const selectedCategory = categories.find(cat => cat._id === e.target.value);
                        setCategory(selectedCategory || null);
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>


                {/* Subcategory Dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <select
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled={!category || subcategoryLoading}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories?.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter description"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter price"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Item Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}

                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    {tagOptions.map((tag) => (
                        <div key={tag} className="inline-block mr-4">
                            <input
                                type="checkbox"
                                id={tag}
                                value={tag}
                                checked={tags.includes(tag)}
                                onChange={handleTagChange}
                                className="mr-2"
                            />
                            <label htmlFor={tag} className="text-sm">{tag}</label>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={updateItemMutation.isLoading}
                >
                    {updateItemMutation.isLoading ? 'Updating...' : 'Update Item'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditItem;
