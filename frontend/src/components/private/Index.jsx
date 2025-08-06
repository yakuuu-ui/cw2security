import Navbar from "@/components/common/admin/Navbar";
import Sidebar from "@/components/common/admin/Sidebar";
import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet

export default function Layout() {
    // State to track the sidebar collapse state
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar (Fixed at the top) */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
                <Navbar />
            </div>

            {/* Sidebar & Main Content Wrapper */}
            <div className="flex flex-1 mt-16">
                {/* Sidebar (Now below Navbar) */}
                <div className="shadow-md">
                    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                </div>

                {/* Main Content (Starts next to Sidebar) */}
                <div className={`flex-1 p-4 bg-white transition-all duration-130 ${collapsed ? 'ml-20' : 'ml-64'}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
