import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteOnewishitems, getAllwishitems, savewishitems } from "../../services/apiwishlist/apiwishlist";
import { Link } from "react-router-dom";
import apiurl from '../../services/apiendpoint/apiendpoint';
import useAuth from '../../services/store/useAuth';
import toast from 'react-hot-toast';

export default function Wishlist () {

    const [data, setData] = useState({ products: [], totallength: 0 });
    const isMountedRef = useRef(true);
    const [wishlistItems, setWishlistItems] = useState([]);
    const { userdetails } = useAuth();


    const getAllWishlistData = useCallback(async () => {
        try {
            const res = await getAllwishitems();
            
            const apiData = res?.response || [];
            setData({ 
                products: apiData, 
                totallength: res?.totallength || apiData.length 
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setData({ products: [], totallength: 0 });
            // toast.error("Failed to fetch products data");
        }
    }, []);

    useEffect(() => {
        if (isMountedRef.current) {
            getAllWishlistData();
        }
        return () => { 
            isMountedRef.current = false; 
        };
    }, [getAllWishlistData]);

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const checkIfInWishlist = (productToCheck, variantToCheck = null) => {
        if (!wishlistItems.length) return false;
        
        return wishlistItems.some(item => {
            const isSameProduct = item.productId === productToCheck._id;
            
            const isSameVariant = variantToCheck ? item.variantId === variantToCheck._id : !item.variantId;
            
            return isSameProduct && isSameVariant;
        });
    };

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                if (userdetails?.Email) {
                    const response = await getAllwishitems();
                    if (response?.response) {
                        setWishlistItems(response.response);
                    }
                }
            } catch (error) {
                console.error("Error fetching wishlist items:", error);
            }
        };

        fetchWishlistItems();
    }, [userdetails]);

    const addWish = async (productData) => {
        try {
            const userDetails = userdetails;
            if (!userDetails || !userDetails.Email) {
                toast.error("Please log in to manage your wishlist!");  
                return;
            }

            const productToProcess = productData;
            const currentWishlistState = checkIfInWishlist(productToProcess, null);
            
            if (currentWishlistState) {
                const wishlistItem = wishlistItems.find(item => {
                    const isSameProduct = item.productId === productToProcess._id;
                    const isSameVariant = !item.variantId;
                    return isSameProduct && isSameVariant;
                });

                if (wishlistItem) {
                    await deleteOnewishitems(wishlistItem._id);
                    setWishlistItems(prev => prev.filter(item => item._id !== wishlistItem._id));
                    toast.success("Removed from wishlist!");
                }
            } else {
                const {_id, variants, ...productDataWithoutId} = productToProcess;

                const wishlistData = {
                    Email: userDetails.Email,
                    productId: productToProcess._id,
                    variantId: null,
                    variantName: null,
                    Product_Name: productToProcess.Product_Name,
                    Category: productToProcess.Category,
                    Subcategory: productToProcess.Subcategory,
                    Images: productToProcess.Images,
                    description: productToProcess.description,
                    material_care: productToProcess.material_care,
                    tags: productToProcess.tags,
                    sizes: productToProcess.sizes,
                    gender: productToProcess.gender,
                    Product_type: productToProcess.Product_type,
                    sale_price: productToProcess.sale_price,
                    discount: productToProcess.discount,
                    discounted_sale_price: productToProcess.discounted_sale_price,
                    stock: productToProcess.stock
                };

                const response = await savewishitems(wishlistData);
                if (response) {
                    setWishlistItems(prev => [...prev, response]);
                }
                toast.success("Added to wishlist!");
            }
        } catch (error) {
            console.error("Error managing wishlist:", error);
            toast.error("Failed to update wishlist. Please try again.");
        }
    };
    

    return (
        <>
        <section className="px-4 py-10 azeret-mono">
            <div className="max-w-[95rem] mx-auto">
                 <div className="flex gap-8 text-xl">
                    <h1 className="text-2xl">Your Wishlist Items</h1>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                    {data?.products?.map((item) => (
                        <div className="group" key={item._id}>
                            <div className="relative">
                                <Link to={`/products-view/${item.productId}`} state={{ product: item }} onClick={scrollToTop}>
                                    <Swiper 
                                        navigation={{
                                            nextEl: `.swiper-button-next-${item._id}`,
                                            prevEl: `.swiper-button-prev-${item._id}`,
                                        }} 
                                        modules={[Navigation]} 
                                        className="mySwiper relative" 
                                        loop={item.Images?.length > 1}
                                        allowTouchMove={true}
                                    >
                                        {item.Images?.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={getImageUrl(img)} alt={`${item.Product_Name} - Image ${index + 1}`} className="w-full h-[55dvh] object-cover"
                                                    onError={(e) => {
                                                        // Fallback for broken images
                                                        e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                                                    }}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </Link>
                                
                                {item.tags && (
                                    <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded z-10">
                                        <p className="text-xs font-medium text-black">{item.tags}</p>
                                    </div>
                                )}
                                
                                <div className="absolute top-2 right-2 bg-white p-2 z-10 hover:bg-white cursor-pointer">
                                    <i className={`fi ${checkIfInWishlist(item, null) ? "fi-sr-heart" : "fi-rr-heart"} flex justify-center items-center hover:cursor-pointer text-xl text-red-700`} onClick={() => {addWish(item); }}></i>
                                </div>
                                
                                {item.Images?.length > 1 && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className={`swiper-button-prev-${item._id} absolute left-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black p-2 cursor-pointer z-20 shadow-md`}>
                                            <ChevronLeft/>
                                        </div>
                                        <div className={`swiper-button-next-${item._id} absolute right-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white p-2 hover:text-black cursor-pointer z-20 shadow-md`}>
                                            <ChevronRight/>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-3 px-1">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {item.Product_Name}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-lg font-semibold text-gray-900">
                                        ₹{item.discounted_sale_price || item.sale_price}
                                    </span>
                                    {item.discounted_sale_price && item.discount && parseInt(item.discount) > 0 && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">₹{item.sale_price}</span>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5">{item.discount}% OFF</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {data?.products?.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No products available</p>
                    </div>
                )}
            </div>
        </section>
        </>
    )
}