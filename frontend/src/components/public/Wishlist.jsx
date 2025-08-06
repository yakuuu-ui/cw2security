import axios from "axios";
import { ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';

const API_BASE_URL = "http://localhost:3000/api/v1/wishlist";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [customerId, setCustomerId] = useState(null);  // Store userId from localStorage

    // Fetch userId from localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setCustomerId(storedUserId);
            fetchWishlist(storedUserId);  // Fetch wishlist for this user
        }
    }, []);

    // Fetch Wishlist Items from API
    const fetchWishlist = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/${id}`);
            setWishlistItems(response.data.wishlist.map(item => ({
                ...item,
                itemId: { ...item.itemId, price: Number(item.itemId.price) }
            })));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/remove/${itemId}`, { params: { customerId } });
            console.log(response.data); // Log the response to check success message

            // Directly update the wishlistItems state by removing the deleted item
            setWishlistItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };


    // Handle Move Item to Cart
    const handleMoveToCart = async (item) => {
        try {
            // Simulate adding item to cart
            setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
            // Remove item from wishlist after moving it to cart
            await handleRemoveItem(item._id);
        } catch (error) {
            console.error("Error moving to cart:", error);
        }
    };

    return (
        <>
            <Layout />
            <div className="bg-white min-h-screen py-20">
                <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-blue-700">Wishlist</h2>

                    {wishlistItems.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-3 text-left text-black font-semibold">Instrument Name</th>
                                        <th className="p-3 text-center text-black font-semibold">Image</th>
                                        <th className="p-3 text-center text-black font-semibold">Price</th>
                                        <th className="p-3 text-center text-black font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wishlistItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td className="p-3 text-black">{item.itemId.name}</td>
                                            <td className="p-3 text-center">
                                                <img src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} className="w-16 h-16 object-cover rounded-md mx-auto" />
                                            </td>
                                            <td className="p-3 text-center font-semibold text-black">
                                                Rs {item.itemId.price.toFixed(2)}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition mr-2"
                                                    onClick={() => handleMoveToCart(item)}
                                                >
                                                    <ShoppingCart size={18} />
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                                                    onClick={() => handleRemoveItem(item._id)}
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Your wishlist is empty.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;
