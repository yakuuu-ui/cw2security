import axios from 'axios';
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';



const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get userId from local storage
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        if (userId) {
            // Fetch cart data from API
            axios.get(`http://localhost:3000/api/v1/cart/${userId}`)
                .then(response => {
                    // Accessing items array and setting the state
                    setCartItems(response.data.items); // Assuming response.data.items contains the list of items
                    setLoading(false);
                })
                .catch(err => {
                    setError("Error fetching cart data.");
                    setLoading(false);
                });
        } else {
            setError("No user ID found.");
            setLoading(false);
        }
    }, [userId]);

    const handleProceedToCheckout = async () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        navigate("/checkout");

        const userId = localStorage.getItem("userId"); // Retrieve userId

        if (!userId) {
            console.error("Error: No user ID found in local storage.");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/v1/cart/clear/${userId}`);
            setCartItems([]); // Clear the cart state
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };




    const handleQuantityChange = async (id, type) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.itemId._id === id
                    ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            );
            // Make the API call to update the cart on the server
            const itemToUpdate = updatedItems.find(item => item.itemId._id === id);

            axios.put(`http://localhost:3000/api/v1/cart/update`, {
                customerId: userId,
                itemId: id,
                quantity: itemToUpdate.quantity
            })
                .then(response => {
                    console.log("Cart updated successfully", response.data);
                })
                .catch(error => {
                    console.error("Error updating cart:", error);
                });

            return updatedItems;
        });
    };

    const handleRemoveItem = async (itemId) => {
        const customerId = localStorage.getItem("userId");

        if (!customerId) {
            setError("No user ID found.");
            return;
        }

        try {
            // Make the DELETE request to remove the item from the cart
            const response = await axios.delete(`http://localhost:3000/api/v1/cart/remove/${itemId}`, {
                params: { customerId },
            });


            // Log the response to verify success
            console.log(response.data); // Log response
            toast.success("Item removed from cart successfully.");

            // Update cartItems state by removing the deleted item
            setCartItems((prevItems) => prevItems.filter(item => item.itemId._id !== itemId));

        } catch (error) {
            console.error("Error removing item from cart:", error.response ? error.response.data : error.message);
            setError("Error removing item from cart.");
        }
    };

    // Calculate total prices
    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0; // Set a delivery charge of $5 if subtotal is > $0
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    return (
        <>
            <Layout />
            <div className="bg-white min-h-screen py-20 text-black">
                <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-blue-700">Shopping Cart</h2>

                    {loading ? (
                        <p>Loading cart...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : cartItems.length > 0 ? (
                        <>
                            {/* Cart Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    {/* Table Header */}
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-3 text-left text-black font-semibold">Instrument Name</th>
                                            <th className="p-3 text-center text-black font-semibold">Image</th>
                                            <th className="p-3 text-center text-black font-semibold">Price</th>
                                            <th className="p-3 text-center text-black font-semibold">Quantity</th>
                                            <th className="p-3 text-center text-black font-semibold">Subtotal</th>
                                            <th className="p-3 text-center text-black font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    {/* Table Body */}
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={`${item.itemId._id}-${item._id}`} className="hover:bg-green-50 transition-colors">
                                                <td className="p-3">{item.itemId.name}</td>
                                                <td className="p-3 text-center">
                                                    <img
                                                        src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined}
                                                        alt={item.itemId.name}
                                                        className="w-16 h-16 object-cover rounded-md mx-auto"
                                                    />
                                                </td>
                                                <td className="p-3 text-center">Rs {item.itemId.price}</td>
                                                <td className="p-3 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            className="bg-green-600 text-white px-2 py-1 rounded-l-md hover:bg-green-700 transition"
                                                            onClick={() => handleQuantityChange(item.itemId._id, "decrease")}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-12 py-1 text-center border-t border-b border-green-600 flex items-center justify-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="bg-green-600 text-white px-2 py-1 rounded-r-md hover:bg-green-700 transition"
                                                            onClick={() => handleQuantityChange(item.itemId._id, "increase")}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center font-semibold">${(Number(item.itemId.price) * item.quantity).toFixed(2)}</td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                                                        onClick={() => handleRemoveItem(item.itemId._id)}
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Cart Total Section */}
                            <div className="mt-6 flex justify-end">
                                <div className="bg-white p-6 rounded-lg shadow w-full sm:w-1/3">
                                    <h3 className="text-lg font-bold mb-4 text-blue-700">Cart Total</h3>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-bold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-b py-2">
                                        <span className="text-gray-600">Delivery Charge:</span>
                                        <span className="font-bold">${deliveryCharge.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 text-lg font-bold text-black">
                                        <span>Total:</span>
                                        <span>${totalPrice}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <button className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition" onClick={handleProceedToCheckout}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Your cart is empty.</p>
                    )}
                </div>
                <ToastContainer />
            </div>
            <Footer />
        </>
    );
};

export default Cart;
