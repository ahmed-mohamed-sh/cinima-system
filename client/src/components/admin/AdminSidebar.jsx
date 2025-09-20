import React from "react";
import { assets } from "../../assets/assets";
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from "lucide-react";
import { Link } from "react-router-dom";
const AdminSidebar = () => {
    const User = {
        firstName: "Admin",
        lastName: "User",
        imageUrl: assets.profile,
    }
     const adminNavLinks = [
        { name: "Dashboard", path: "/admin" , icon: LayoutDashboardIcon},
        { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
        { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
        { name: "List Bookings", path: "/admin/list-bookings", icon: ListCollapseIcon },
     ]
    return (
        <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-64 w-full border-r border-gray-300/30 text-sm"> 
            <img src={User.imageUrl} alt={`${User.firstName} ${User.lastName}`} className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto" />
            <p className="mt-2 text-base max-md:hidden">{User.firstName} {User.lastName}</p>
            <div className="mt-4 w-full ">
                {adminNavLinks.map((link) => (
                    <Link key={link.name} to={link.path} className="flex items-center py-2 px-4 rounded-md hover:bg-[#F84565]/10 transition-colors text-gray-500 hover:text-[#F84565] active:scale-95">
                        <link.icon className="h-5 w-5 mr-2" />
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminSidebar;
