import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import useAuth from '../../shared/services/store/useAuth';

export default function Sidebar({ isOpen }) {
    const { userdetails } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
       
        checkMobile();
        window.addEventListener('resize', checkMobile);
       
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    useEffect(() => {
        if (!isMobile) {
            setIsMobileOpen(false);
        }
    }, [isMobile]);
    
    return (
        <>
            <div className="sticky inset-x-0 top-0 z-20 px-4 bg-white border-y sm:px-6 md:px-8 lg:hidden">
                <div className="flex items-center justify-between py-2">
                    <ol className="flex items-center ms-3 whitespace-nowrap">
                        <li className="flex items-center text-sm text-gray-800">
                            Application
                            <svg className="flex-shrink-0 mx-3 overflow-visible size-2.5 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </li>
                        <li className="text-sm font-semibold text-gray-800 truncate" aria-current="page">
                            Dashboard
                        </li>
                    </ol>
                    <button type="button"
                        className="flex items-center justify-center gap-x-1.5 px-3 py-2 text-gray-500 transition-colors border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-600"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13"/>
                        </svg>
                        <span className="sr-only">Toggle Sidebar</span>
                    </button>
                </div>
            </div>
            {isMobile && isMobileOpen && (
                <div className="fixed inset-0 z-[50] bg-black/30 bg-opacity-50 transition-opacity lg:hidden" onClick={() => setIsMobileOpen(false)} />
            )}
            <div className={`fixed flex-nowrap overflow-x-hidden inset-y-0 start-0 z-[60] bg-black shadow-xl border-r border-gray-800/10 transition-all duration-300 transform
                ${isMobile ? isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full' : isOpen ? 'w-64' : 'w-20' }
                ${isMobile ? 'lg:translate-x-0' : ''}
            `}>
                <div className="flex flex-col items-center justify-center px-4 pt-6 pb-8">
                    <div className="p-1 shadow-lg bg-white backdrop-blur-sm flex flex-nowrap w-full gap-3">
                        <img src="/images/logo/logo1.png" alt="" className='w-10 h-10'/>
                        <p className={`text-sm flex flex-nowrap justify-center items-center font-handelgothic `}>EXTREME CULTURE</p>
                    </div>
                </div>
                <nav className="flex flex-col flex-wrap w-full py-4">
                    <ul className="space-y-1.5 px-2">
                        {userdetails?.Role === "Admin" && (
                            <>
                                <NavItem icon="fi-rr-apps" label="Dashboard" to="/dashboard/adminhome" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-rr-box-open" label="Products" to="/dashboard/products" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-sr-target-audience" label="Customers" to="/dashboard/customer" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-rr-back-up" label="Hookups" to="/dashboard/hookups" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-brands-c" label="Categories" to="/dashboard/categories" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-rr-banner" label="Home Banner" to="/dashboard/home-banner" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-br-supplier-alt" label="Popular Products" to="/dashboard/popular-products" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-sr-order-history" label="Orders" to="/dashboard/orders" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-rr-ticket" label="Coupons" to="/dashboard/coupons" isOpen={isMobile ? isMobileOpen : isOpen} />
                                <NavItem icon="fi fi-ts-newsletter-subscribe" label="Newsletter Emails" to="/dashboard/newsletter" isOpen={isMobile ? isMobileOpen : isOpen} />
                                {/* <NavItem icon="fi fi-sr-shipping-fast" label="Shipping Amounts" to="/dashboard/shipping-amounts" isOpen={isMobile ? isMobileOpen : isOpen} /> */}
                            </>
                        )}
                       
                    </ul>
                </nav>
            </div>
        </>
    );
}

const NavItem = ({ icon, label, to, isOpen }) => (
    <li>
        {isOpen ? (
            <NavLink to={to} className={({ isActive }) => `flex items-center w-full gap-3 px-4 py-3  transition-all duration-200
                    ${isActive ? 'bg-white text-black shadow-lg shadow-[#F5C231]/20' : 'text-white hover:text-white hover:bg-white/10'}`} >
                <i className={`text-xl ${icon} flex-shrink-0`}></i>
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
            </NavLink>
        ) : (
            <NavLink to={to} className={({ isActive }) => `flex items-center justify-center w-full p-3  transition-all duration-200
                    ${isActive ? 'bg-gray-400  text-white shadow-lg shadow-[#F5C231]/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} >
                <i className={`text-xl ${icon}`}></i>
            </NavLink>
        )}
    </li>
);