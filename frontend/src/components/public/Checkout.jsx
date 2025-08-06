import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Checkout = () => {

    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


    if (!cartItems || cartItems.length === 0) {
        return <div>No items in the cart!</div>;
    }

    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0;
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState("stripe");
    const [billingDetails, setBillingDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
    });

    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cvv: "",
        zipCode: "",
    });

    const [showCardForm, setShowCardForm] = useState(true);

    const handleInputChange = (e) => {
        setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    };

    const handleCardInputChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    }

    const handleStripePayment = async () => {
        try {
            toast.info('Creating Stripe checkout session...', { autoClose: 2000 });

            // Create checkout session with Stripe
            const response = await fetch("http://localhost:3000/api/v1/stripe/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: parseFloat(totalPrice),
                    customerId: userId,
                    cartItems: cartItems,
                    billingDetails: billingDetails,
                }),
            });

            if (response.ok) {
                const { url } = await response.json();

                if (url) {
                    // Redirect to Stripe Checkout
                    window.location.href = url;
                } else {
                    toast.error('No checkout URL received from server', {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            } else {
                const errorData = await response.json();
                toast.error(`Failed to create checkout session: ${errorData.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Stripe payment error:", error);
            toast.error("❌ Failed to process payment. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleOrderSubmit = async () => {
        if (totalPrice > 5000.0) {
            toast.error("Amount exceeds the limit of Rs 5000. Please reduce the total price.");
            return;
        }

        if (paymentMethod === "stripe") {
            await handleStripePayment();
            return;
        }

        const orderData = {
            userId,
            cartItems: cartItems.map(item => ({
                itemId: item.itemId,
                price: item.itemId.price,
                quantity: item.quantity,
            })),
            billingDetails,
            paymentMethod,
            subtotal,
            deliveryCharge,
            totalPrice,
            status: "pending",
        };

        try {
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("cartItems");

                // Clear cart from database
                try {
                    const clearCartResponse = await fetch(`http://localhost:3000/api/v1/cart/clear/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (clearCartResponse.ok) {
                        console.log('Cart cleared successfully from database');
                    } else {
                        console.log('Failed to clear cart from database');
                    }
                } catch (error) {
                    console.error('Error clearing cart:', error);
                }

                toast.success("Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {
                    navigate("/checkout/success");
                }, 5000);
            } else {
                toast.error("Error placing order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <>
            <Layout />
            <div className="bg-gray-100 min-h-screen py-10 text-black">
                <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Checkout</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-300">
                                <h3 className="text-xl font-semibold mb-4">Billing Details</h3>
                                <div className="space-y-4">
                                    <input type="text" name="fullName" placeholder="Full Name" value={billingDetails.fullName} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    <input type="email" name="email" placeholder="Email Address" value={billingDetails.email} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    <input type="text" name="phone" placeholder="Phone Number" value={billingDetails.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    <input type="text" name="address" placeholder="Street Address" value={billingDetails.address} onChange={handleInputChange} className="w-full p-3 border-gray-400 border rounded-md" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="city" placeholder="City" value={billingDetails.city} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                        <input type="text" name="zipCode" placeholder="Zip Code" value={billingDetails.zipCode} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <label className={`flex flex-col p-4 border-b cursor-pointer ${paymentMethod === "stripe" ? "bg-green-50 border-green-200" : ""}`} onClick={() => handlePaymentChange("stripe")}>
                                        <div className="flex items-center">
                                            <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={() => handlePaymentChange("stripe")} className="hidden" />
                                            <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex justify-center items-center mr-3">
                                                {paymentMethod === "stripe" && <span className="w-3 h-3 bg-green-600 rounded-full"></span>}
                                            </span>
                                            <span className="text-gray-800 font-medium">💳 Stripe Payment</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Secure online payment with credit/debit card via Stripe.</p>
                                    </label>

                                    <label className={`flex flex-col p-4 cursor-pointer ${paymentMethod === "cod" ? "bg-orange-50 border-orange-200" : ""}`} onClick={() => handlePaymentChange("cod")}>
                                        <div className="flex items-center">
                                            <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => handlePaymentChange("cod")} className="hidden" />
                                            <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex justify-center items-center mr-3">
                                                {paymentMethod === "cod" && <span className="w-3 h-3 bg-orange-500 rounded-full"></span>}
                                            </span>
                                            <span className="text-gray-800 font-medium">💵 Cash on Delivery</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Pay in cash when your order is delivered.</p>
                                    </label>
                                </div>

                                {/* Stripe Payment Info */}
                                {paymentMethod === "stripe" && (
                                    <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h4 className="text-lg font-semibold mb-3 text-green-700">💳 Secure Payment with Stripe</h4>
                                        <p className="text-sm text-green-600 mb-3">
                                            You'll be redirected to Stripe's secure payment page where you can safely enter your card details.
                                        </p>
                                        <div className="flex items-center space-x-2 text-xs text-green-600">
                                            <span>🔒</span>
                                            <span>SSL Encrypted</span>
                                            <span>•</span>
                                            <span>PCI Compliant</span>
                                            <span>•</span>
                                            <span>Secure Checkout</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-300 min-h-[300px]">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h3>
                            <div className="flex justify-between font-medium border-b pb-2">
                                <span>Product</span>
                                <span>Subtotal</span>
                            </div>

                            <div className="space-y-4 mt-4">
                                {cartItems.map((item, index) => (
                                    <div key={item._id || `item-${index}`} className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} className="w-12 h-12 rounded-lg object-cover" />
                                            <span>{item.itemId.name} × {item.quantity}</span>
                                        </div>
                                        <span className="font-semibold">${(item.itemId.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Delivery Charge:</span>
                                    <span>${deliveryCharge.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
                                    <span>Total:</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => {
                                console.log('Button clicked!');
                                console.log('Payment method:', paymentMethod);
                                handleOrderSubmit();
                            }}
                            className="bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-[#e66b14] transition"
                        >
                            {paymentMethod === "stripe" ? "Pay Now" : "Confirm Order"}
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
            <Footer />
        </>
    );
};

export default Checkout; 