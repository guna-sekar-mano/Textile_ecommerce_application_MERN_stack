import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { apigetNewArrivalProducts, apigetSalePriceProducts } from '../../services/apicustomerProducts/apicustomerproducts';
import apiurl from '../../services/apiendpoint/apiendpoint';
import { Link } from 'react-router-dom';
import { deleteOnewishitems, getAllwishitems, savewishitems } from '../../services/apiwishlist/apiwishlist';
import useAuth from '../../services/store/useAuth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'

const toUrlFriendly = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function Homeproducts() {
    const [data, setData] = useState({ products: [], totallength: 0 });
    const [filteredData, setFilteredData] = useState({ products: [], totallength: 0 });
    const [selectedProductType, setSelectedProductType] = useState('All');
    const isMountedRef = useRef(true);
    const { userdetails } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [saleData, setSaleData] = useState({ products: [], totallength: 0 });
    const [filteredSaleData, setFilteredSaleData] = useState({ products: [], totallength: 0 });
    
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

    const getAllProductsDataForCustomer = useCallback(async () => {
        try {
            const queryParams = {query: "new arrivals"};
            const res = await apigetNewArrivalProducts(queryParams);
            
            const apiData = res?.resdata || [];
            setData({ 
                products: apiData, 
                totallength: res?.totallength || apiData.length 
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setData({ products: [], totallength: 0 });
        }
    }, []);

    useEffect(() => {
        if (isMountedRef.current) {
            getAllProductsDataForCustomer();
        }
        return () => { 
            isMountedRef.current = false; 
        };
    }, [getAllProductsDataForCustomer]);

    const isWithinSaleDateRange = (product) => {
    if (!product.sale_date_from || !product.sale_date_to) {
        return false;
    }
    
    const currentDate = new Date();
    const saleFrom = new Date(product.sale_date_from);
    const saleTo = new Date(product.sale_date_to);
    
    return currentDate >= saleFrom && currentDate <= saleTo;
    };

    const getSalePriceForCustomer = useCallback(async () => {
        try {
            const res = await apigetSalePriceProducts();
            
            const apiData = res?.resdata || [];
            
            const filteredByDate = apiData.filter(product => {
                const productData = product.ProductId?.[0] || product;
                return isWithinSaleDateRange(productData);
            });
            
            setSaleData({ 
                products: filteredByDate, 
                totallength: filteredByDate.length 
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setSaleData({ products: [], totallength: 0 });
        }
    }, []);

    useEffect(() => {
        if (isMountedRef.current) {
            getSalePriceForCustomer();
        }
        return () => { 
            isMountedRef.current = false; 
        };
    }, [getSalePriceForCustomer]);

    useEffect(() => {
        if (selectedProductType === 'All') {
            setFilteredSaleData(saleData);
        } else {
            const filtered = saleData.products.filter(product => 
                product.Product_type === selectedProductType
            );
            setFilteredSaleData({ products: filtered, totallength: filtered.length });
        }
    }, [saleData, selectedProductType]);

    useEffect(() => {
        if (selectedProductType === 'All') {
            setFilteredData(data);
        } else {
            const filtered = data.products.filter(product => 
                product.Product_type === selectedProductType
            );
            setFilteredData({ products: filtered,  totallength: filtered.length });
        }
    }, [data, selectedProductType]);

    const getUniqueProductTypes = () => {
        const types = data.products.map(product => product.Product_type);
        return ['All', ...new Set(types)];
    };

    const handleProductTypeClick = (productType) => {
        setSelectedProductType(productType);
    };

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getAllProductImages = (product) => {
        let allImages = [];
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
                if (variant.variant_images && variant.variant_images.length > 0) {
                    allImages = [...allImages, ...variant.variant_images];
                }
            });
        }
        return allImages.length > 0 ? allImages : [];
    };

    const getPriceDisplay = (product) => {
        if (!product.variants || product.variants.length === 0) {
            return { price: 'Price not available', isRange: false };
        }

        const firstVariant = product.variants[0];
        
        if (firstVariant.sizes && firstVariant.sizes.length > 0) {
            const firstSize = firstVariant.sizes[0];
            const price = firstSize.price ? parseFloat(firstSize.price) : null;
            const salePrice = firstSize.sale_price ? parseFloat(firstSize.sale_price) : null;
            
            if (salePrice && salePrice > 0) {
                return {
                    salePrice: `₹${salePrice}`,
                    originalPrice: `₹${price}`,
                    isRange: false,
                    hasSale: true
                };
            } else {
                return {
                    price: `₹${price}`,
                    isRange: false,
                    hasSale: false
                };
            }
        } else {
            const price = firstVariant.price ? parseFloat(firstVariant.price) : null;
            const salePrice = firstVariant.sale_price ? parseFloat(firstVariant.sale_price) : null;
            
            if (salePrice && salePrice > 0) {
                return {
                    salePrice: `₹${salePrice}`,
                    originalPrice: `₹${price}`,
                    isRange: false,
                    hasSale: true
                };
            } else {
                return {
                    price: `₹${price}`,
                    isRange: false,
                    hasSale: false
                };
            }
        }
    };

    const addWish = async (productData) => {
        try {
            const userDetails = userdetails;
            if (!userDetails || !userDetails.Email) {
                toast("📢 Please log in to manage your wishlist!");  
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
                    Swal.fire({title: "Removed from wishlist !", icon: "success", draggable: true });
                }
            } else {
                const {variants, ...productDataWithoutVariants} = productToProcess;

                const wishlistData = {
                    Email: userDetails.Email,
                    productId: productToProcess._id,
                    variantId: null,
                    variantName: null,
                    Product_Name: productToProcess.Product_Name,
                    Category: productToProcess.Category,
                    Subcategory: productToProcess.Subcategory,
                    Images: getAllProductImages(productToProcess),
                    description: productToProcess.description,
                    material_care: productToProcess.material_care,
                    tags: productToProcess.tags,
                    sizes: [],
                    gender: productToProcess.gender,
                    Product_type: productToProcess.Product_type,
                    price: '',
                    sale_price: '',
                    cost_price: '',
                    stock: productToProcess.stock,
                    variants: productToProcess.variants 
                };

                const response = await savewishitems(wishlistData);
                if (response) {
                    setWishlistItems(prev => [...prev, response]);
                }
                Swal.fire({title: "Add to Wishlist Success !", icon: "success", draggable: true });
            }
        } catch (error) {
            console.error("Error managing wishlist:", error);
            toast.error("Failed to update wishlist. Please try again.");
        }
    };

    return (
        <>
        <section className="px-4 py-7 azeret-mono">
            <div className="max-w-[95rem] mx-auto">
                <h1 className="text-2xl lg:text-3xl mb-5 azeret-mono">New Arrivals</h1>
                <div className="flex flex-wrap gap-4 mb-6">
                    {getUniqueProductTypes().map((productType) => (
                        <button key={productType} onClick={() => handleProductTypeClick(productType)}
                            className={`px-4 py-1 transition-colors duration-200 cursor-pointer ${selectedProductType === productType ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-sm lg:text-base `}>
                            {productType}
                        </button>
                    ))}
                </div>

                {/* <div className="mb-4">
                    <p className="text-gray-600">
                        {selectedProductType === 'All' ? `Showing all products (${filteredData.totallength})` : `Showing ${selectedProductType} (${filteredData.totallength})`}
                    </p>
                </div> */}

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                    {filteredData?.products?.slice(0, 8).map((item) => {
                        const allImages = getAllProductImages(item);
                        const priceInfo = getPriceDisplay(item);
                        
                        return (
                            <div className="group" key={item._id}>
                                <div className="relative">
                                <Link to={`/products/${toUrlFriendly(item.Product_type)}/${item.Router_Link}`} state={{ product: item, productId: item._id }} onClick={scrollToTop}>
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
                                        {item.variants[0].variant_images?.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={getImageUrl(img)} alt={`${item.variants[0].variant_name} - Image ${index + 1}`} className="w-full lg:h-[55dvh] h-[230px] md:h-[400px] object-cover"/>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </Link>
                                    
                                    {item.tags && (
                                        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded z-10">
                                            <p className="text-xs font-medium text-black">{item.tags}</p>
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-2 right-2 bg-white p-1 z-10 hover:bg-white cursor-pointer rounded">
                                        <i className={`fi ${checkIfInWishlist(item, null) ? "fi-sr-heart" : "fi-rr-heart"} flex justify-center items-center hover:cursor-pointer text-xl text-red-700`} onClick={() => {addWish(item); }}></i>
                                    </div>
                                    
                                    {allImages.length > 1 && (
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
                                        {priceInfo.hasSale ? (
                                            <>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {priceInfo.salePrice}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    {priceInfo.originalPrice}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-semibold text-gray-900">
                                                {priceInfo.price}
                                            </span>
                                        )}
                                        
                                       
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredData?.products?.length > 8 && (
                    <div className="flex justify-center mt-8">
                        <Link to={`/collections/${selectedProductType === 'All' ? 'all' : toUrlFriendly(selectedProductType)}`} onClick={scrollToTop} className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200">
                            View More
                        </Link>
                    </div>
                )}
                
                {filteredData?.products?.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            {selectedProductType === 'All' ? 'No products available' : `No products found for "${selectedProductType}"`}
                        </p>
                    </div>
                )}
            </div>
        </section>

        {filteredSaleData?.products?.length > 0 && (
            <section className="px-4 py-7 azeret-mono">
                <div className="max-w-[95rem] mx-auto">
                    <h1 className="text-2xl lg:text-3xl mb-5 azeret-mono">Sale Items</h1>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                        {filteredSaleData?.products?.map((item) => {
                            const allImages = getAllProductImages(item);
                            const priceInfo = getPriceDisplay(item);
                            
                            return (
                                <div className="group" key={item._id}>
                                    <div className="relative">
                                    <Link to={`/products/${toUrlFriendly(item.Product_type)}/${item.Router_Link}`} state={{ product: item, productId: item._id }} onClick={scrollToTop}>
                                        <Swiper 
                                            navigation={{
                                                nextEl: `.swiper-button-next-sale-${item._id}`,
                                                prevEl: `.swiper-button-prev-sale-${item._id}`,
                                            }} 
                                            modules={[Navigation]} className="mySwiper relative" loop={item.Images?.length > 1} allowTouchMove={true}
                                        >
                                            {item.variants[0].variant_images?.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img src={getImageUrl(img)} alt={`${item.variants[0].variant_name} - Image ${index + 1}`} className="w-full lg:h-[55dvh] h-[230px] md:h-[400px] object-cover"/>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </Link>
                                        
                                        {item.tags && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 z-10">
                                                <p className="text-xs font-medium">SALE</p>
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-2 right-2 bg-white p-1 z-10 hover:bg-white cursor-pointer rounded">
                                            <i className={`fi ${checkIfInWishlist(item, null) ? "fi-sr-heart" : "fi-rr-heart"} flex justify-center items-center hover:cursor-pointer text-xl text-red-700`} onClick={() => {addWish(item); }}></i>
                                        </div>
                                        
                                        {allImages.length > 1 && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className={`swiper-button-prev-sale-${item._id} absolute left-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black p-2 cursor-pointer z-20 shadow-md`}>
                                                    <ChevronLeft/>
                                                </div>
                                                <div className={`swiper-button-next-sale-${item._id} absolute right-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white p-2 hover:text-black cursor-pointer z-20 shadow-md`}>
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
                                            {priceInfo.hasSale ? (
                                                <>
                                                    <span className="text-lg font-semibold text-red-600">
                                                        {priceInfo.salePrice}
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        {priceInfo.originalPrice}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {priceInfo.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        )}
        </>
    );
}