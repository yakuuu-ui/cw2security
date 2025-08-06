
import { Card } from "@/components/common/ui/card";
import axios from "axios";
import { DollarSign, LayoutDashboard, List, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/v1";

const Dashboard = () => {
    const [users, setUsers] = useState(0);
    const [orders, setOrders] = useState(0);
    const [items, setItems] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${API_BASE_URL}/auth/getAllCustomers`);
                setUsers(userResponse.data.count || 0);

                const orderResponse = await axios.get(`${API_BASE_URL}/order/orders`);
                setOrders(orderResponse.data.length);

                const totalRevenue = orderResponse.data
                    ? orderResponse.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    : 0;
                setRevenue(totalRevenue);

                const itemResponse = await axios.get(`${API_BASE_URL}/item/getItems`);
                setItems(itemResponse.data.count || 0);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-3 space-y-4 bg-white min-h-screen">
            <div className="flex items-center gap-2 text-xl font-bold text-blue-700">
                <LayoutDashboard size={28} className="text-blue-700" />
                Dashboard
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-gray-50 shadow hover:bg-gray-100 transition">
                    <User size={32} className="text-blue-700" />
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700">Users</h2>
                        <p className="text-xl font-bold text-gray-800">{users}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-gray-50 shadow hover:bg-gray-100 transition">
                    <ShoppingBag size={32} className="text-blue-700" />
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700">Orders</h2>
                        <p className="text-xl font-bold text-gray-800">{orders}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-gray-50 shadow hover:bg-gray-100 transition">
                    <DollarSign size={32} className="text-blue-700" />
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700">Revenue</h2>
                        <p className="text-xl font-bold text-gray-800">$ {revenue}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-gray-50 shadow hover:bg-gray-100 transition">
                    <List size={32} className="text-blue-700" />
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700">Instruments</h2>
                        <p className="text-xl font-bold text-gray-800">{items}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 shadow bg-gray-50 hover:bg-gray-100 transition">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700">Top Selling Instruments</h2>
                    <ul className="list-disc ml-4 text-gray-800">
                        <li>Electric Guitar - 45 orders</li>
                        <li>Acoustic Guitar - 38 orders</li>
                        <li>Piano - 32 orders</li>
                        <li>Drums - 28 orders</li>
                    </ul>
                </Card>
                <Card className="p-4 shadow bg-gray-50 hover:bg-gray-100 transition">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700">Top Categories</h2>
                    <ul className="list-disc ml-4 text-gray-800">
                        <li>String Instruments - 4.9/5</li>
                        <li>Percussion - 4.8/5</li>
                        <li>Wind Instruments - 4.7/5</li>
                        <li>Keyboard - 4.6/5</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;