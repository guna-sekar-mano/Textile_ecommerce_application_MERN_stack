import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function Adminmain () {

    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Topbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <main className='bg-slate-50'>
                <div className={`w-full transition-all duration-300 ${isSidebarOpen ? 'lg:ps-64' : 'lg:ps-20'}`}>
                <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
                    <Outlet/>
                </div>
                </div>
            </main>
        </>
    )
}