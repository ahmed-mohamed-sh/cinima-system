import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import Loading from "../../components/Loading";

const Layout = () => {
    const {isAdmin, fetchIsAdmin} = useAppContext()
    useEffect(() => {
       fetchIsAdmin() 
    },[])
    return isAdmin ?  (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 px-4 py-10 md:px-10 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    ): <Loading/>;
};

export default Layout;
