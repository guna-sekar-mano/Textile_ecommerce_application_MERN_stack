import { Outlet } from "react-router-dom";
import Supportsidebar from "./Supportsidebar";

export default function SupportMain() {
    return (
        <>
            <div className="max-w-[85rem] mx-auto lg:py-10 md:py-8 py-2 ">
                <div className="lg:p-0 p-4">
                    <h1 className="barlow-condensed text-6xl">SUPPORT</h1>
                </div>
                
                <div className="lg:flex lg:mt-10 mt-2">
                    <aside className="lg:w-64 flex-shrink-0 p-2">
                        <Supportsidebar />
                    </aside>
                    
                    <main className="flex-1 lg:ml-6">
                        <div className="p-4 space-y-4  sm:space-y-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}