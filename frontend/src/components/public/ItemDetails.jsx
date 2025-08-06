import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/Layout";

const ItemDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Get customerId from localStorage
    const getCustomerId = () => localStorage.getItem("userId");

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/item/getItem/${id}`);
                console.log("Fetched item data:", response.data.data);
                setItem(response.data.data);
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItemDetails();
    }, [id]);

    useEffect(() => {
        const customerId = getCustomerId();
        if (!customerId || !item) return;

        axios.get(`http://localhost:3000/api/v1/wishlist/check/${item._id}`, { params: { customerId } })
            .then((res) => {
                console.log("Wishlist status:", res.data.isWishlisted);
                setIsWishlisted(res.data.isWishlisted);
            })
            .catch((err) => console.error("Error checking wishlist:", err));
    }, [item]);

    const toggleWishlist = async () => {
        const customerId = getCustomerId();
        if (!customerId) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        try {
            if (isWishlisted) {
                await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${item._id}`, { params: { customerId } });

            } else {
                await axios.post(`http://localhost:3000/api/v1/wishlist/add`, { customerId, itemId: item._id });

            }
            setIsWishlisted((prev) => !prev);
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            toast.error("Failed to update wishlist.");
        }
    };

    const addToCart = async () => {
        const customerId = getCustomerId();
        if (!customerId) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        try {
            await axios.post(`http://localhost:3000/api/v1/cart/add`, {
                customerId,
                itemId: item._id,
                quantity,
            });
            toast.success("Item added to cart successfully.");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart.");
        }
    };

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
    };

    if (loading) return <div className="text-center py-10 text-lg font-bold">Loading...</div>;
    if (!item) return <div className="text-center py-10 text-lg font-bold">Item not found</div>;

    return (
        <><Layout /><div className="bg-gray-100 py-20 px-4">
            <div className="max-w-6xl mx-auto rounded-xl shadow-lg bg-white grid grid-cols-1 md:grid-cols-2 gap-10 p-8">

                {/* Image Section */}
                <div className="relative">
                    <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        className="w-full h-[300px] object-cover rounded-lg shadow-lg"
                        alt={item.name} />
                    <button className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 ${isWishlisted ? "text-red-500" : "text-blue-700"}`} onClick={toggleWishlist}>
                        <FaHeart size={20} />
                    </button>

                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center space-y-6">
                    <h2 className="text-3xl font-bold text-black">{item.name}</h2>

                    <span className="text-blue-700 font-semibold text-2xl">
                        ${parseFloat(item.price).toLocaleString()}
                    </span>

                    <p className="text-gray-700 leading-relaxed text-lg">{item.description}</p>

                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                                className="bg-blue-600 text-white px-5 py-2 rounded-l-md hover:bg-blue-700 transition"
                                onClick={() => handleQuantityChange("decrease")}
                            >-</button>
                            <span className="w-12 h-10 flex items-center justify-center text-lg font-medium bg-gray-50 text-black">{quantity}</span>
                            <button
                                className="bg-blue-600 text-white px-5 py-2 rounded-r-md hover:bg-blue-700 transition"
                                onClick={() => handleQuantityChange("increase")}
                            >+</button>
                        </div>
                        <button className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition" onClick={addToCart}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

        </div>
            <ToastContainer />
            <Footer /></>
    );
};

export default ItemDetails;
