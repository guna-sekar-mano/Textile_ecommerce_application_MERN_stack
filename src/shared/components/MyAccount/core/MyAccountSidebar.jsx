import { NavLink } from "react-router-dom";

export default function MyAccountSidebar () {

    return (
        <>
         <section className="bg-gray-200 py-8 px-4 sticky top-28">
            <div className="space-y-4 text-center">
                <div>
                    <NavLink to={"/account-details"} className={({ isActive }) => isActive ? "block bg-gray-500 text-white p-2 border-l-4 border-black" : "block bg-white p-2 hover:bg-gray-100 border-l-4 border-transparent"}>
                        Account Details
                    </NavLink>
                </div>
                <div>
                    <NavLink to={"/my-orders"}className={({ isActive }) =>isActive ? "block bg-gray-500 text-white p-2 border-l-4 border-black" : "block bg-white p-2 hover:bg-gray-100 border-l-4 border-transparent"}>
                        My Orders
                    </NavLink>
                </div>
               
            </div>

        </section>
        </>
    )
}