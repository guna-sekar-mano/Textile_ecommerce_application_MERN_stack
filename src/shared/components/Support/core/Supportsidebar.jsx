import { NavLink } from "react-router-dom";

export default function Supportsidebar () {

    return (
        <>
        <section className="bg-gray-200 py-8 px-4 sticky top-28">
            <div className="space-y-4 text-center">
                <div>
                    <NavLink to={"/contact-us"} className={({ isActive }) => isActive ? "block bg-gray-500 text-white p-2 border-l-4 border-black" : "block bg-white p-2 hover:bg-gray-100 border-l-4 border-transparent"}>
                        Contact Us
                    </NavLink>
                </div>
                <div>
                    <NavLink to={"/track-order"}className={({ isActive }) =>isActive ? "block bg-gray-500 text-white p-2 border-l-4 border-black" : "block bg-white p-2 hover:bg-gray-100 border-l-4 border-transparent"}>
                        Track my order
                    </NavLink>
                </div>
                <div>  
                    <NavLink to={"/frequently-asked-questions"} className={({ isActive }) => isActive ? "block bg-gray-500 text-white p-2 border-l-4 border-black" : "block bg-white p-2 hover:bg-gray-100 border-l-4 border-transparent"}>
                        FAQ
                    </NavLink>
                </div>
            </div>

        </section>
        </>
    )
}