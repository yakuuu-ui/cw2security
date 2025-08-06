import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);

    const sessionId = searchParams.get('session_id');
    const userId = localStorage.getItem("userId");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    useEffect(() => {
        // If there's a session_id, it means this is a Stripe payment success
        if (sessionId) {
            handleStripePaymentSuccess();
        }
    }, [sessionId]);

    const handleStripePaymentSuccess = async () => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            // Create order data
            const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
            const deliveryCharge = subtotal > 0 ? 5.00 : 0;
            const totalPrice = (subtotal + deliveryCharge).toFixed(2);

            const orderData = {
                userId,
                cartItems: cartItems.map(item => ({
                    itemId: item.itemId,
                    price: item.itemId.price,
                    quantity: item.quantity,
                })),
                billingDetails: {
                    fullName: "Stripe Payment Customer",
                    email: "stripe@musicio.com",
                    phone: "+977 1234567890",
                    address: "Stripe Payment Address",
                    city: "Kathmandu",
                    zipCode: "44600",
                },
                paymentMethod: "stripe",
                subtotal,
                deliveryCharge,
                totalPrice,
                paymentStatus: "paid",
                stripeSessionId: sessionId,
            };

            // Create order in database
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

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

                toast.success("🎉 Payment successful! Your order has been placed.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                toast.error("❌ Error creating order. Please contact support.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("❌ Network error. Please contact support.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to redirect the user back to the home page
    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center py-20">
                <div className="bg-white p-12 rounded-xl shadow-xl text-center max-w-lg w-full border border-gray-200">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-[#00bf63] mb-4">
                        {sessionId ? "Payment Successful!" : "Order Placed Successfully!"}
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                        {sessionId
                            ? "Your payment has been processed successfully and your order has been placed. Thank you for choosing Quick Bites!"
                            : "Your order has been placed successfully. Thank you for choosing Quick Bites!"
                        }
                    </p>
                    {/* <div className="bg-green-50 p-6 rounded-lg mb-8">
                        <h3 className="text-lg font-semibold text-[#00bf63] mb-2">Order Details</h3>
                        <p className="text-gray-600">
                            We'll send you an email confirmation with your order details shortly.
                        </p>
                    </div> */}
                    <div className="space-x-4">
                        <button
                            onClick={handleGoHome}
                            className="bg-[#00bf63] text-white px-8 py-4 rounded-lg text-lg shadow-md hover:bg-[#009f4e] transition ease-in-out duration-200 font-semibold"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default OrderSuccess;
