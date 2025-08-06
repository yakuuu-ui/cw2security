import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEye, FaPrint, FaSearch, FaTags } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/order/orders');
                setOrders(response.data); // Assuming response.data contains the array of orders
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Filter orders based on search input
    const filteredOrders = orders.filter((order) =>
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.billingDetails.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium flex items-center">
                    <FaTags className="mr-2" /> All Orders ({orders.length})
                </h2>
                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg pl-10 pr-4 py-2 w-full"
                    />
                    <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">SN</th>
                        <th className="py-2 px-4 border-b">Order ID</th>
                        <th className="py-2 px-4 border-b">Order Date</th>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order._id} className="text-center">
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{order._id}</td>
                            <td className="py-2 px-4 border-b">{formatDate(order.createdAt)}</td>
                            <td className="py-2 px-4 border-b">
                                <div>{order.billingDetails.fullName}</div>
                                <div>{order.billingDetails.phone}</div>
                            </td>
                            <td className="py-2 px-4 border-b">Rs {order.totalPrice}</td>
                            <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                            <td className="py-7 px-4 border-b flex justify-center space-x-2">
                                <Link to={`/view-order/${order._id}`} className="text-green-500 hover:text-green-700">
                                    <FaEye />
                                </Link>
                                <button className="text-blue-500 hover:text-blue-700">
                                    <FaPrint />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllOrder;
