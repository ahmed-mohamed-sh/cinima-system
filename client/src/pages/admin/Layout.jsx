import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/adminNavbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 px-4 py-10 md:px-10 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
