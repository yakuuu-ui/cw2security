import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { FaEye, FaPrint, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ConfirmOrder = () => {
    const [search, setSearch] = useState('');

    // Example order data
    const orders = [
        {
            _id: 'ORDER001',
            customerName: 'Santosh KC',
            customerPhone: '9840922949',
            orderDate: '2024-01-02T06:44:00',
            totalAmount: 2000,
            paymentStatus: 'Paid',
            status: 'Completed',
        },
        {
            _id: 'ORDER002',
            customerName: 'Saurav Joshi',
            customerPhone: '9876543210',
            orderDate: '2024-02-10T14:25:00',
            totalAmount: 1500,
            paymentStatus: 'Pending',
            status: 'In Progress',
        },
        {
            _id: 'ORDER003',
            customerName: 'Ramesh Thapa',
            customerPhone: '9876543210',
            orderDate: '2024-02-12T12:15:00',
            totalAmount: 2500,
            paymentStatus: 'Paid',
            status: 'Completed',
        },
    ];

    const filteredOrders = orders.filter((order) =>
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('en-US', options);
        const formattedTime = new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return (
            <div>
                <div>{formattedDate}</div>
                <div>{formattedTime}</div>
            </div>
        );
    };

    const formatAmount = (amount, status) => {
        return `Rs. ${amount}, ${status}`;
    };

    return (
        <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium flex items-center">
                    <CheckCircle className="mr-2" /> Confirmed Orders ({orders.length})
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
                        <th className="py-2 px-4 border-b">Customer Information</th>
                        <th className="py-2 px-4 border-b">Total Amount</th>
                        <th className="py-2 px-4 border-b">Order Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order._id} className="text-center">
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{order._id}</td>
                            <td className="py-2 px-4 border-b">{formatDate(order.orderDate)}</td>
                            <td className="py-2 px-4 border-b">
                                <div>{order.customerName}</div>
                                <div>{order.customerPhone}</div>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <div>{order.totalAmount}</div>
                                <div>{order.paymentStatus}</div>
                                {/* {formatAmount(order.totalAmount, order.paymentStatus)} */}
                            </td>
                            <td className="py-2 px-4 border-b">{order.status}</td>
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

export default ConfirmOrder;
