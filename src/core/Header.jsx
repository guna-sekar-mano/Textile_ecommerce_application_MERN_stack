import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../shared/services/store/useAuth";
import useCartStore from "../shared/services/store/usecart";
import { apigetallproductsCustomers } from "../shared/services/apicustomerProducts/apicustomerproducts";
import Search from "../shared/components/Search/Search";
import { ChevronDown } from "lucide-react";

const toUrlFriendly = (str) => {return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')};

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenHovered, setIsMenHovered] = useState(false);
    const [isWomenHovered, setIsWomenHovered] = useState(false);
    const { logout, userdetails } = useAuth();
    const { clearCart ,cart, fetchCartItems} = useCartStore();
    const navigate = useNavigate();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menCategories, setMenCategories] = useState([]);
    const [womenCategories, setWomenCategories] = useState([]);

    const [menOpen, setMenOpen] = useState(false);
    const [womenOpen, setWomenOpen] = useState(false);


    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };
    const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); };
    const closeSearch = () => { setIsSearchOpen(false); };
    const menMenuOpen = () => {setMenOpen(!menOpen)};
    const womenMenuOpen = () => {setWomenOpen(!womenOpen)};

    const handleLogout = () => {
        logout();
        clearCart();
        navigate('/');
    };

    useEffect(() => {
        if (userdetails?.Email) {
            fetchCartItems(userdetails.Email);
        }
    }, [userdetails, fetchCartItems]);

    const getProductCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apigetallproductsCustomers();
            if (res?.resdata) {
                const menProductTypes = {};
                const womenProductTypes = {};
                
                res.resdata.forEach(product => {
                    const productType = product.Product_type;
                    const gender = product.gender;
                    
                    if (!productType) return;
                    
                    const firstVariant = product.variants?.find(v => v.status === 'Active') || product.variants?.[0];
                    const categoryImage = firstVariant?.variant_images?.[0] || null;
                    
                    if (gender === 'Men') {
                        if (!menProductTypes[productType]) {
                            menProductTypes[productType] = {
                                Category_Name: productType,
                                redirect_link: `/collections/${toUrlFriendly(productType)}?gender=men`,
                                image: categoryImage,
                                productCount: 1
                            };
                        } else {
                            menProductTypes[productType].productCount += 1;
                        }
                    }
                    
                    if (gender === 'Women') {
                        if (!womenProductTypes[productType]) {
                            womenProductTypes[productType] = {
                                Category_Name: productType,
                                redirect_link: `/collections/${toUrlFriendly(productType)}?gender=women`,
                                image: categoryImage,
                                productCount: 1
                            };
                        } else {
                            womenProductTypes[productType].productCount += 1;
                        }
                    }
                });
                
                setMenCategories(Object.values(menProductTypes));
                setWomenCategories(Object.values(womenProductTypes));
            }
        } catch (error) {
            console.error("Error fetching product categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    let isMounted = true;
    useEffect(() => {
        if (isMounted) {
            getProductCategories();
        }
        return (() => isMounted = false);
    }, []);

    const handleCategoryClick = (redirectLink) => {
        navigate(redirectLink);
    };

    const handleGenderClick = (gender) => {
        navigate(`/collections/all?gender=${gender}`);
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
                                <li className="text-lg cursor-pointer hover:text-gray-300 transition-colors relative" 
                                    onMouseEnter={() => setIsMenHovered(true)} 
                                    onMouseLeave={() => setIsMenHovered(false)}>
                                    Men

                                    <div className={`absolute top-full left-0 mt-2 w-fit bg-white text-black shadow-2xl overflow-hidden transition-all duration-300 z-50 ${isMenHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                        }`}>
                                        <div className="grid gap-0">
                                            <div className="p-6 bg-gray-50 border-r border-gray-200">
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 mb-4">
                                                    Men's Collections
                                                </h3>
                                                <div onClick={() => handleGenderClick('men')}
                                                    className="text-gray-700 hover:text-black transition-colors text-sm whitespace-nowrap p-3 cursor-pointer font-medium border-b border-gray-200 mb-2"
                                                >
                                                    All Men's Products
                                                </div>
                                                <ul className="max-h-fit">
                                                    {menCategories.map((col, index) => (
                                                        <li key={`men-${col.Category_Name}-${index}`} className={index > 3 ? 'border-l' : 'border-0'}>
                                                            <div onClick={() => handleCategoryClick(col.redirect_link)}
                                                                className="text-gray-700 hover:text-black transition-colors text-sm whitespace-nowrap p-3 cursor-pointer">
                                                                {col?.Category_Name}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul> 
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="text-lg cursor-pointer hover:text-gray-300 transition-colors relative" 
                                    onMouseEnter={() => setIsWomenHovered(true)} 
                                    onMouseLeave={() => setIsWomenHovered(false)}>
                                    Women

                                    <div className={`absolute top-full left-0 mt-2 w-fit bg-white text-black shadow-2xl overflow-hidden transition-all duration-300 z-50 ${isWomenHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                                        }`}>
                                        <div className="grid gap-0">
                                            <div className="p-6 bg-gray-50 border-r border-gray-200">
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900 mb-4">
                                                    Women's Collections
                                                </h3>
                                                <div onClick={() => handleGenderClick('women')}
                                                    className="text-gray-700 hover:text-black transition-colors text-sm whitespace-nowrap p-3 cursor-pointer font-medium border-b border-gray-200 mb-2"
                                                >
                                                    All Women's Products
                                                </div>
                                                <ul className="max-h-fit">
                                                    {womenCategories.map((col, index) => (
                                                        <li key={`women-${col.Category_Name}-${index}`} className={index > 3 ? 'border-l' : 'border-0'}>
                                                            <div onClick={() => handleCategoryClick(col.redirect_link)}
                                                                className="text-gray-700 hover:text-black transition-colors text-sm whitespace-nowrap p-3 cursor-pointer">
                                                                {col?.Category_Name}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul> 
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {/* <li className="text-lg cursor-pointer hover:text-gray-300 transition-colors">Sale</li> */}
                            </ul>
                        </div>

                        <button onClick={toggleMenu} className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50 relative">
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                        
                            <Link to={"/"} className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2 lg:translate-none lg:relative lg:left-auto lg:transform-none">
                                <img src="/images/logo/logo1.png" alt="" className="h-8 w-auto" />
                                <p className="font-semibold text-xl hidden sm:block font-handelgothic">EXTREME CULTURE</p>
                                <p className="font-semibold text-lg sm:hidden">EC</p>
                            </Link>
                      

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
                                        {cart?.length || 0}
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

                <div className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>

                <div className={`fixed top-0 left-0 h-full w-80 bg-gray-900 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                                    <div className="flex justify-between items-center">
                                        <p className="text-white text-xl font-medium py-2">Men</p>
                                        <ChevronDown className={`text-white cursor-pointer duration-300 transition-transform ease-in-out ${menOpen ? "rotate-180 " : "rotate-0"}`} onClick={menMenuOpen} />
                                    </div>
                                   { menOpen && (
                                    <div className="mt-3 ml-2 space-y-3 ">
                                        <div onClick={() => { handleGenderClick('men'); toggleMenu(); }} className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer font-medium">
                                            All Men's Products
                                        </div>
                                        {menCategories.map((col, index) => (
                                            <div key={`mobile-men-${index}`} onClick={() => { handleCategoryClick(col.redirect_link); toggleMenu(); }} className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                                                {col?.Category_Name}
                                            </div>
                                        ))}
                                    </div>)}
                                </li>

                                <li>
                                    <div className="flex justify-between items-center">
                                        <p className="text-white text-xl font-medium py-2">Women</p>
                                        <ChevronDown className={`text-white cursor-pointer duration-300 transition-transform ease-in-out ${womenOpen ? "rotate-180 " : "rotate-0"}`} onClick={womenMenuOpen} />
                                    </div>
                                    { womenOpen && (
                                        <div className=" mt-3 ml-2 space-y-3">
                                        <div onClick={() => { handleGenderClick('women'); toggleMenu(); }} className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer font-medium">
                                            All Women's Products
                                        </div>
                                        {womenCategories.map((col, index) => (
                                            <div key={`mobile-women-${index}`}
                                                onClick={() => { handleCategoryClick(col.redirect_link); toggleMenu(); }}
                                                className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer"
                                            >
                                                {col?.Category_Name}
                                            </div>
                                        ))}
                                    </div>)}
                                </li>

                                <li>
                                    <Link to="/sale" className="block text-white text-xl font-medium hover:text-gray-300 transition-colors py-2" onClick={toggleMenu}>
                                        Sale
                                    </Link>
                                </li>
                                <li className="pt-4 border-t border-gray-500">
                                    <Link to="/contact-us" className="block text-white text-lg hover:text-gray-300 transition-colors py-2" onClick={toggleMenu}>
                                        Support
                                    </Link>
                                </li>
                                <li className="border-gray-800">
                                    <Link to="/account-details" className="block text-white text-lg hover:text-gray-300 transition-colors py-2" onClick={toggleMenu}>
                                        My Account
                                    </Link>
                                </li>
                                {!userdetails && (
                                    <li>
                                        <Link to="/login" className="block text-white text-lg hover:text-gray-300 transition-colors py-2" onClick={() => { toggleMenu(); scrollToTop(); }}>
                                            Login / Sign up
                                        </Link>
                                    </li>
                                )}
                                {userdetails && (
                                    <li>
                                        <button onClick={handleLogout} className="block text-white text-lg bg-red-500 px-3 hover:text-gray-300 transition-colors py-2">
                                            Logout
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </nav>

                        <div className="px-6 py-6 border-t border-gray-500">
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

          <Search closeSearch={closeSearch} isSearchOpen={isSearchOpen} />
        </>
    );
}