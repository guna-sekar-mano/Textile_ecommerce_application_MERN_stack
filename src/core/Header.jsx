import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../shared/services/store/useAuth";
import useCartStore from "../shared/services/store/usecart";
import { apigetallHeaderproducts } from "../admin/shared/services/apiproducts/apiproducts";
import { getallcustomercategory } from "../shared/services/apiCustomercategory/apicustomercategory";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCollectionHovered, setIsCollectionHovered] = useState(false);
    const { logout, userdetails } = useAuth();
    const { clearCart } = useCartStore();
    const navigate = useNavigate();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [Data, setData] = useState([]);
    const { cart } = useCartStore();

    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };
    const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); };
    const closeSearch = () => { setIsSearchOpen(false); };

    const handleLogout = () => {
        logout();
        clearCart();
        navigate('/');
    };


    const getallcustomercategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getallcustomercategory();
            setData(res.resdata);
            console.log(res?.resdata)
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    let isMounted = true;
    useEffect(() => {
        if (isMounted) {
            getallcustomercategories();
        }
        return (() => isMounted = false);
    }, []);

    const handleCategoryClick = (redirectLink, categoryId) => {
        sessionStorage.setItem('currentCategoryId', categoryId);
        navigate(redirectLink);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <>
            <header className="bg-black relative sticky top-0 z-50">
                <div className="max-w-[85rem] mx-auto px-4 py-5">
                    <div className="flex items-center justify-between text-white">
                        <div className="hidden lg:block">
                            <ul className="flex space-x-8">
                                <Link to={"/"}>
                                    <li className="text-lg hover:text-gray-300 transition-colors">Home</li>
                                </Link>
                                <li
                                    className="text-lg cursor-pointer hover:text-gray-300 transition-colors relative"
                                    onMouseEnter={() => setIsCollectionHovered(true)}
                                    onMouseLeave={() => setIsCollectionHovered(false)}
                                >
                                    Collection

                                    <div className={`absolute top-full left-0 mt-2 w-fit bg-white text-black shadow-2xl overflow-hidden transition-all duration-300 z-50 ${isCollectionHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                        }`}>
                                        <div className="grid gap-0">

                                            <div className="p-6 bg-gray-50 border-r border-gray-200">
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 mb-4">
                                                    Collections
                                                </h3>
                                                <ul className="grid grid-rows-4 grid-flow-col">
                                                    {Data.map((col, index) => {
                                                        return (
                                                            <li key={`${col._id || index}`} className={index > 3 ? 'border-l' : 'border-0'} >
                                                                <div onClick={() => handleCategoryClick(col.redirect_link, col._id)}
                                                                    className="text-gray-700 hover:text-black transition-colors text-sm whitespace-nowrap p-3">
                                                                    {col?.Category_Name}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul> 
                                            </div>


                                            {/* {Object.entries(groupedProducts).slice(0, 2).map(([category, products], categoryIndex) => (
                                                <div key={categoryIndex} className="p-6 border-r border-gray-200">
                                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 mb-4">
                                                        {category}
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {products.slice(0, 6).map((product, productIndex) => (
                                                            <li key={productIndex}>
                                                                <Link
                                                                    to={`/product/${product._id}`}
                                                                    className="text-gray-700 hover:text-black transition-colors text-sm"
                                                                >
                                                                    {product.Subcategory || product.Product_type}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}

                                       
                                            <div className="p-6">
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 mb-4">
                                                    Featured
                                                </h3>
                                                <ul className="space-y-3 mb-6">
                                                    {headerData.filter(product => product.tags === "FRESH IN").slice(0, 4).map((product, index) => (
                                                        <li key={index}>
                                                            <Link
                                                                to={`/product/${product._id}`}
                                                                className="text-gray-700 hover:text-black transition-colors text-sm"
                                                            >
                                                                {product.Product_Name.length > 25
                                                                    ? product.Product_Name.substring(0, 25) + "..."
                                                                    : product.Product_Name
                                                                }
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 mb-4">
                                                    Shop All
                                                </h3>
                                                <Link
                                                    to="/collections"
                                                    className="inline-block bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                                                >
                                                    View All Collections
                                                </Link>
                                            </div> */}
                                        </div>
                                    </div>
                                </li>
                                <li className="text-lg cursor-pointer hover:text-gray-300 transition-colors">Sale</li>
                            </ul>
                        </div>

                        <button onClick={toggleMenu} className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50 relative">
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>

                        <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2 lg:translate-none lg:relative lg:left-auto lg:transform-none">
                            <img src="/images/logo/logo1.png" alt="" className="h-8 w-auto" />
                            <p className="font-semibold text-xl hidden sm:block font-handelgothic">EXTREME CULTURE</p>
                            <p className="font-semibold text-lg sm:hidden">EC</p>
                        </div>

                        <div className="hidden lg:flex space-x-8 items-center">
                            <Link to={"/contact-us"} onClick={scrollToTop}>
                                <p className="cursor-pointer hover:text-gray-300 transition-colors">Support</p>
                            </Link>
                            {userdetails ? (
                                <div className="relative" onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                                    <div className="cursor-pointer hover:text-gray-300 transition-colors flex items-center">
                                        <i className="fi fi-rr-user text-lg mt-1"></i>
                                    </div>

                                    <div className={`absolute top-full right-0 mt-2 w-48 bg-white text-black shadow-2xl overflow-hidden transition-all duration-300 z-50 ${isUserDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                        }`}>
                                        <div className="py-2">
                                            <Link to="/account-details" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                                onClick={() => setIsUserDropdownOpen(false)} >
                                                My Account
                                            </Link>
                                            {userdetails.Role === 'Admin' && (
                                                <Link to="/dashboard/adminhome" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                                    onClick={() => setIsUserDropdownOpen(false)}>
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button onClick={() => { setIsUserDropdownOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to={"/login"}><p className="cursor-pointer hover:text-gray-300 transition-colors" onClick={scrollToTop}>Login / Sign up</p></Link>
                            )}

                            <div className="flex justify-center items-center gap-6 mt-1.5 -ml-2">
                                <button onClick={toggleSearch} className="hover:text-gray-300 transition-colors cursor-pointer">
                                    <i className="fi fi-rr-search text-lg "></i>
                                </button>
                                <Link to={"/wishlist"} className="hover:text-gray-300 transition-colors">
                                    <i className="fi fi-rr-heart text-lg "></i>
                                </Link>
                                <Link to={"/cart"} className="hover:text-gray-300 transition-colors relative">
                                    <i className="fi fi-rr-shopping-bag text-lg "></i>
                                    <span className="absolute -top-2 -right-3 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full">
                                        {cart?.length}
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="flex lg:hidden items-center gap-4">
                            <button onClick={toggleSearch} className="hover:text-gray-300 transition-colors">
                                <i className="fi fi-rr-search text-lg"></i>
                            </button>
                            <Link to={"/cart"} className="hover:text-gray-300 transition-colors">
                                <i className="fi fi-rr-shopping-bag text-lg"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>

                <div className={`fixed top-0 left-0 h-full w-80 bg-black z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div className="flex items-center space-x-2">
                                <img src="/images/logo/logo1.png" alt="" className="h-8 w-auto" />
                                <p className="font-semibold text-xl text-white">EXTREME CULTURE</p>
                            </div>
                        </div>

                        <nav className="flex-1 px-6 py-8">
                            <ul className="space-y-6">
                                <li>
                                    <Link to="/" className="block text-white text-xl font-medium hover:text-gray-300 transition-colors py-2" onClick={toggleMenu}>
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <p className="text-white text-xl font-medium py-2">Collections</p>
                                    <ul className="space-y-3">
                                        {Data.map((col, index) => (
                                            <li key={index}>
                                                <div
                                                    onClick={() => { handleCategoryClick(col.redirect_link, col._id) }}
                                                    className="text-gray-700 hover:text-black transition-colors text-sm"
                                                >
                                                    {col?.Category_Name}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li>
                                    <Link to="/sale" className="block text-white text-xl font-medium hover:text-gray-300 transition-colors py-2" onClick={toggleMenu}>
                                        Sale
                                    </Link>
                                </li>
                                <li className="pt-4 border-t border-gray-800">
                                    <Link to="/support" className="block text-white text-lg hover:text-gray-300 transition-colors py-2" onClick={toggleMenu}>
                                        Support
                                    </Link>
                                </li>
                                {!userdetails && (
                                    <li>
                                        <Link to="/login" className="block text-white text-lg hover:text-gray-300 transition-colors py-2" onClick={{ toggleMenu, scrollToTop }}>
                                            Login / Sign up
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </nav>

                        <div className="px-6 py-6 border-t border-gray-800">
                            <div className="flex justify-center space-x-8">
                                <button onClick={toggleSearch} className="text-white hover:text-gray-300 transition-colors">
                                    <i className="fi fi-rr-search text-xl"></i>
                                </button>
                                <Link to="/wishlist" className="text-white hover:text-gray-300 transition-colors">
                                    <i className="fi fi-rr-heart text-xl"></i>
                                </Link>
                                <Link to="/cart" className="text-white hover:text-gray-300 transition-colors">
                                    <i className="fi fi-rr-shopping-bag text-xl"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center transition-all duration-500 ease-in-out ${isSearchOpen ? 'opacity-100 visible backdrop-blur-sm' : 'opacity-0 invisible'}`}>
                <div className={`w-full max-w-4xl px-6 transform transition-all duration-500 ease-out ${isSearchOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>
                    <button onClick={closeSearch} className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="text-center mb-12">
                        <h2 className="text-white text-4xl md:text-5xl font-light mb-4 tracking-wide">
                            What are you looking for?
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Search through our collection
                        </p>
                    </div>

                    <div className="relative mb-16">
                        <input type="text" placeholder="Search products, categories, brands..."
                            className="w-full bg-transparent text-white text-2xl md:text-3xl font-light border-b-2 border-gray-600 focus:border-white outline-none py-4 px-0 placeholder-gray-500 transition-colors duration-300" autoFocus
                        />
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <i className="fi fi-rr-search text-white text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}