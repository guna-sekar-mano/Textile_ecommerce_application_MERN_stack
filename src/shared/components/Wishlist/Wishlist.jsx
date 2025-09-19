import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteOnewishitems, getAllwishitems } from "../../services/apiwishlist/apiwishlist";
import { Link } from "react-router-dom";
import apiurl from '../../services/apiendpoint/apiendpoint';
import useAuth from '../../services/store/useAuth';
import useCartStore from "../../services/store/usecart";
import { apisavecart } from "../../services/apicart/apicart";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'

const toUrlFriendly = (str) => {return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');};

const SizeSelectionModal = ({ isOpen, onClose, product, onAddToCart, getImageUrl }) => {
    const [selectedSize, setSelectedSize] = useState('');
 

    useEffect(() => {
        if (isOpen) {
            setSelectedSize('');
        }
    }, [isOpen]);

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size!");
            return;
        }
        onAddToCart(product, selectedSize);
        onClose();
    };

    const getPricingInfo = () => {
        const hasSizeSpecificPricing = product?.sizes && product.sizes.length > 0 && 
            product.sizes.some(sizeObj => sizeObj.price || sizeObj.sale_price);
        
        if (hasSizeSpecificPricing) {
            if (selectedSize) {
                const sizeData = product.sizes.find(s => s.size === selectedSize);
                if (sizeData) {
                    return {
                        currentPrice: sizeData.sale_price && sizeData.sale_price !== "0" ? sizeData.sale_price : sizeData.price,
                        originalPrice: sizeData.sale_price && sizeData.sale_price !== "0" ? sizeData.price : null,
                        hasDiscount: sizeData.sale_price && sizeData.sale_price !== "0"
                    };
                }
            }
        }
        
        if (product?.sale_price && product.sale_price !== "0" && product?.price) {
            return {
                currentPrice: product.sale_price,
                originalPrice: product.price,
                hasDiscount: true
            };
        }
        
        return {
            currentPrice: product?.price || 'Price not available',
            originalPrice: null,
            hasDiscount: false
        };
    };

    if (!isOpen) return null;

    const pricingInfo = getPricingInfo();

    return (
        <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Select Size</h2>
                    <button onClick={onClose}className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <img src={getImageUrl(product?.Images?.[0])} alt={product?.Product_Name} className="w-20 h-20 object-cover rounded"/>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-2">
                                {product?.Product_Name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                {pricingInfo.hasDiscount ? (
                                    <>
                                        <span className="text-lg font-semibold">
                                            ₹{pricingInfo.currentPrice}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{pricingInfo.originalPrice}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-semibold">
                                        ₹{pricingInfo.currentPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="font-semibold mb-3">SIZE</p>
                        <div className="flex flex-wrap gap-2">
                            {product?.sizes?.map((sizeObj, index) => {
                                const sizeValue = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                                return (
                                    <button key={index} className={`px-4 py-2 border transition-colors ${
                                            selectedSize === sizeValue ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'
                                        }`} onClick={() => handleSizeSelect(sizeValue)}
                                    >
                                        {sizeValue}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].filter(size => {
                                const availableSizes = product?.sizes?.map(s => typeof s === 'string' ? s : s.size) || [];
                                return !availableSizes.includes(size);
                            }).map((size, index) => (
                                <button key={`inactive-${index}`} className="px-4 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" disabled >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {product?.stock !== 'Active' && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-600 text-sm">This item is currently out of stock</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                       <button 
    onClick={handleAddToCart} // Remove the parameter here
    disabled={!selectedSize || product?.stock !== 'Active'}
    className={`flex-1 py-3 font-semibold transition-colors ${
        !selectedSize || product?.stock !== 'Active' 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800'
    }`}
>
    Add to Cart
</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Wishlist() {
    const [data, setData] = useState({ products: [], totallength: 0 });
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const isMountedRef = useRef(true);
    const { userdetails } = useAuth();
    const { addToCart, cart: cartItems } = useCartStore();

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
            toast.error("Failed to fetch wishlist data");
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

    const removeFromWishlist = async (itemId) => {
        try {
            const userDetails = userdetails;
            if (!userDetails || !userDetails.Email) {
                toast.error("Please log in to manage your wishlist!");  
                return;
            }

            await deleteOnewishitems(itemId);
            setData(prev => ({
                ...prev,
                products: prev.products.filter(item => item._id !== itemId),
                totallength: prev.totallength - 1
            }));
            Swal.fire({title: "Removed from wishlist !", icon: "success", draggable: true });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist. Please try again.");
        }
    };

    const handleAddToCartClick = (product) => {
        if (product.sizes && product.sizes.length > 0) {
            setSelectedProduct(product);
            setShowSizeModal(true);
        } else {
            handleAddToCart(product, null);
        }
    };

    const handleAddToCart = async (product, selectedSize) => {
        const userDetails = userdetails;
        
        if (!userDetails) {
            toast.error("Please log in to add items to your cart!");
            return;
        }

        const cartItemsFromStore = cartItems || [];
        
        const productId = product.productId || product._id;
        const variantId = product.variantId || null;
        
        const existingItem = cartItemsFromStore.find(item => {
            const itemProductId = item.productId?._id || item.productId || item.productId?.id;
            return itemProductId === productId && 
                item.selectedSize === selectedSize &&
                (item.variantId || null) === variantId;
        });

        if (existingItem) {
            const productType = variantId ? 'variant' : 'main product';
            toast.error(`This ${productType} with size ${selectedSize || 'default'} is already in your cart!`);
            return;
        }

        try {
            const cartData = {
                productId: productId,
                Email: userDetails.Email,
                Quantity: 1,
                selectedSize: selectedSize,
                variantId: variantId
            };
            
            await apisavecart(cartData);
            
            let productWithSize;
            
            if (variantId && product.variantName) {
                productWithSize = {
                    _id: product._id,
                    productId: productId,
                    Product_Name: product.Product_Name,
                    variant_name: product.variantName,
                    Images: product.Images,
                    variant_images: product.variant_images,
                    price: product.price,
                    sale_price: product.sale_price,
                    sizes: product.sizes,
                    stock: product.stock,
                    variantId: variantId,
                    selectedSize: selectedSize,
                    Quantity: 1,
                    description: product.description,
                    material_care: product.material_care,
                    tags: product.tags,
                    Product_type: product.Product_type,
                    gender: product.gender,
                    Category: product.Category,
                    Subcategory: product.Subcategory
                };
            } else {
                productWithSize = {
                    _id: product._id,
                    productId: productId,
                    Product_Name: product.Product_Name,
                    Images: product.Images,
                    price: product.price,
                    sale_price: product.sale_price,
                    sizes: product.sizes,
                    stock: product.stock,
                    variantId: variantId,
                    selectedSize: selectedSize,
                    Quantity: 1,
                    description: product.description,
                    material_care: product.material_care,
                    tags: product.tags,
                    Product_type: product.Product_type,
                    gender: product.gender,
                    Category: product.Category,
                    Subcategory: product.Subcategory
                };
            }

            addToCart(productWithSize);
            const productType = variantId ? 'Variant' : 'Product';
            toast.success(`${productType} added to cart successfully!`);
            
        } catch (error) {
            toast.error("Failed to add product to cart.");
            console.error("Error adding product to cart:", error);
        }
    };

    return (
        <>
            <section className="px-4 py-10 azeret-mono">
                <div className="max-w-[95rem] mx-auto">
                    <div className="flex gap-8 text-xl">
                        <h1 className="text-2xl">Your Wishlist Items</h1>
                        <span className="text-gray-500">({data?.totallength || 0} items)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                        {data?.products?.map((item) => (
                            <div className="group" key={item._id}>
                                <div className="relative">
                                    <Link to={`/products-view/${toUrlFriendly(item.Product_type)}/${toUrlFriendly(item.Product_Name)}`} state={{ product: item, productId: item.productId }} >
                                        <Swiper 
                                            navigation={{
                                                nextEl: `.swiper-button-next-${item._id}`,
                                                prevEl: `.swiper-button-prev-${item._id}`,
                                            }} 
                                            modules={[Navigation]} className="mySwiper relative" loop={item.Images?.length > 1} allowTouchMove={true}>
                                            {item.Images?.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img src={getImageUrl(img)} alt={`${item.Product_Name} - Image ${index + 1}`} className="w-full h-[55dvh] object-cover"/>
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
                                        <i className="fi fi-sr-heart flex justify-center items-center hover:cursor-pointer text-xl text-red-700" onClick={() => removeFromWishlist(item._id)}></i>
                                    </div>
                                    
                                    {item.Images?.length > 1 && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className={`swiper-button-prev-${item._id} absolute left-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black p-2 cursor-pointer z-20 shadow-md`}>
                                                <ChevronLeft />
                                            </div>
                                            <div className={`swiper-button-next-${item._id} absolute right-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white p-2 hover:text-black cursor-pointer z-20 shadow-md`}>
                                                <ChevronRight />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <button onClick={() => handleAddToCartClick(item)} disabled={item.stock !== 'Active'}
                                        className={`text-center w-full py-2 cursor-pointer border transition-colors ${item.stock === 'Active' ? 'bg-black text-white hover:text-black hover:bg-white border-black' : 'bg-gray-400 text-gray-200 cursor-not-allowed border-gray-400'}`}
                                    >
                                        {item.stock === 'Active' ? 'Add to cart' : 'Out of Stock'}
                                    </button>
                                </div>
                                <div className="mt-3 px-1">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.Product_Name}</h3>

                                    <div className="mt-1 flex items-center gap-2">
                                        {(() => {
                                            if (item.price || item.sale_price) {
                                                const hasGlobalSalePrice = item.sale_price && parseFloat(item.sale_price) > 0;
                                                if (hasGlobalSalePrice) {
                                                    return (
                                                        <>
                                                            <span className="text-lg font-semibold text-gray-900">₹{item.sale_price}</span>
                                                            <span className="text-sm text-gray-500 line-through">₹{item.price}</span>
                                                        </>
                                                    );
                                                } else {
                                                    return (
                                                        <span className="text-lg font-semibold text-gray-900">₹{item.price}</span>
                                                    );
                                                }
                                            } else if (item.sizes && item.sizes.length > 0) {
                                                const firstSize = item.sizes[0];
                                                const hasSizeWiseSalePrice = firstSize.sale_price && parseFloat(firstSize.sale_price) > 0;
                                                if (hasSizeWiseSalePrice) {
                                                    return (
                                                        <>
                                                            <span className="text-lg font-semibold text-gray-900">₹{firstSize.sale_price}</span>
                                                            <span className="text-sm text-gray-500 line-through">₹{firstSize.price}</span>
                                                            <span className="text-xs text-gray-400">(from {firstSize.size})</span>
                                                        </>
                                                    );
                                                } else {
                                                    return (
                                                        <>
                                                            <span className="text-lg font-semibold text-gray-900">₹{firstSize.price}</span>
                                                            <span className="text-xs text-gray-400">(from {firstSize.size})</span>
                                                        </>
                                                    );
                                                }
                                            } else {
                                                return (
                                                    <span className="text-lg font-semibold text-gray-900">Price not available</span>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {data?.products?.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Your wishlist is empty</p>
                            <Link to="/products" className="text-blue-600 hover:underline mt-2 inline-block">
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <SizeSelectionModal isOpen={showSizeModal} onClose={() => setShowSizeModal(false)} product={selectedProduct} onAddToCart={handleAddToCart} getImageUrl={getImageUrl}/>
        </>
    );
}