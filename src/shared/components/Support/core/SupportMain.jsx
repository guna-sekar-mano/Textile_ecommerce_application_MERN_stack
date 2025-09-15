import { Outlet } from "react-router-dom";
import Supportsidebar from "./Supportsidebar";

export default function SupportMain() {
    return (
        <>
            <div className="max-w-[85rem] mx-auto py-10">
                <div>
                    <h1 className="barlow-condensed text-6xl">SUPPORT</h1>
                </div>
                
                <div className="flex mt-10">
                    <aside className="w-64 flex-shrink-0">
                        <Supportsidebar />
                    </aside>
                    
                    <main className="flex-1 ml-6">
                        <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}