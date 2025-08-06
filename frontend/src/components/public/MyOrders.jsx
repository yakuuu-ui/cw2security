
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import Footer from '../common/customer/Footer';
import Navbar from '../common/customer/Navbar';

function MyOrders() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const customerId = user.userId || sessionStorage.getItem('userId');
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    email: '',
  });
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token and user data
  useEffect(() => {
    console.log('MyOrders.jsx: isAuthenticated:', isAuthenticated);
    console.log('MyOrders.jsx: user:', user);
    console.log('MyOrders.jsx: loading:', loading);
    console.log('MyOrders.jsx: sessionStorage:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      rememberMe: localStorage.getItem('rememberMe'),
    });

    // Fetch CSRF token
    axios
      .get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true })
      .then((response) => {
        console.log('MyOrders.jsx: CSRF Token fetched:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('MyOrders.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      });

    if (!isAuthenticated && !user.token) {
      toast.error('Please log in to view your orders.');
      navigate('/login');
      return;
    }
    if (!loading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/auth/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const { fname, lname, email } = response.data.data;
        setUserData({
          fname: fname || '',
          lname: lname || '',
          email: email || '',
        });
      } else {
        toast.error('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('MyOrders.jsx: Error fetching user data:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching user data.');
    } finally {
      setIsUserLoading(false);
    }
  };

  const { data: orders, error, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const res = await axios.get(`http://localhost:3000/api/v1/order/orders/user/${customerId}`, {
        headers: {
          Authorization: `Bearer ${user.token || sessionStorage.getItem('token')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      return res.data; // The API returns orders directly, not wrapped in data
    },
    enabled: !!customerId && !!csrfToken,
  });

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-[#00bf63]/10 text-[#00bf63]';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-500';
      case 'delivered':
        return 'bg-[#00bf63]/10 text-[#00bf63]';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-300/10 text-gray-600';
    }
  };

  const paymentBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-[#00bf63]/10 text-[#00bf63]';
      case 'paid':
        return 'bg-[#00bf63]/10 text-[#00bf63]';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-300/10 text-gray-600';
    }
  };

  if (!customerId || !isAuthenticated || !user.token) {
    return (
      <div className="p-10 text-center text-red-500 bg-[#F3F4F6] min-h-screen font-sans">
        Please log in to view your orders.
      </div>
    );
  }

  if (isUserLoading || isOrdersLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F3F4F6] font-sans">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-[#00bf63]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 bg-[#F3F4F6] min-h-screen font-sans">
        Failed to load orders. Please try again later.
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600 bg-[#F3F4F6] min-h-screen font-sans">
        You have no orders yet.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black font-sans px-6 md:px-10 py-10 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-3/4 space-y-8">
          <h1 className="text-3xl font-bold mb-4 text-blue-700">My Orders</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {userData.fname} {userData.lname}</h2>
            <p className="text-gray-600">Email: {userData.email}</p>
          </div>
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Order ID: {order._id}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Order Date:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Payment Status:</strong>{' '}
                  <span className={`px-2 py-0.5 rounded font-medium ${paymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>{' '}
                  | <strong>Method:</strong> {order.paymentMethod}
                </p>
                <p className="text-lg font-bold text-gray-800 mb-4">Total: Rs. {order.totalPrice.toFixed(2)}</p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-1 text-gray-800">Billing Details</h3>
                  <p className="text-gray-600">{order.billingDetails.fullName}</p>
                  <p className="text-gray-600">{order.billingDetails.email}</p>
                  <p className="text-gray-600">{order.billingDetails.phone}</p>
                  <p className="text-gray-600">
                    {order.billingDetails.address}, {order.billingDetails.city} - {order.billingDetails.zipCode}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-800">Items</h3>
                  <ul className="space-y-3 max-h-48 overflow-y-auto">
                    {order.cartItems.map((item) => {
                      const product = item.itemId;
                      return (
                        <li key={product._id || product} className="flex items-center gap-4">
                          <img
                            src={`http://localhost:3000/uploads/${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md border border-gray-300"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{product.name || 'Unnamed Product'}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} | Price: Rs. {item.price}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </>
  );
}

export default MyOrders;
