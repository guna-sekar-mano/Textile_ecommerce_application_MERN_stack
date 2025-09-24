import { ChevronDown, ChevronUp, Share } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import useAuth from "../../services/store/useAuth";
import { apisavecart } from "../../services/apicart/apicart";
import useCartStore from "../../services/store/usecart";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { deleteOnewishitems, savewishitems, getAllwishitems } from "../../services/apiwishlist/apiwishlist";
import Swal from 'sweetalert2'

export default function Productsview(props) {

    const { selected, container2Ref, container3Ref, container7Ref, currentProduct, getImageUrl, currentMainImage, setSelectedVariant, selectedVariant, handlePrimaryProductClick, product,
        handleVariantClick, handleThumbnailClick, toggleAccordion,selectedSize, setSelectedSize } = props;
   
    const {addToCart, cart: cartItems, cart} = useCartStore();
    const { userdetails } = useAuth();
    const [wishlist, setwishlist] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);

    const checkIfInWishlist = (productToCheck, variantToCheck = null) => {
        if (!wishlistItems.length) return false;
        
        return wishlistItems.some(item => {
            const productMatch = item.productId === productToCheck._id;
            const variantMatch = item.variantId === (variantToCheck?._id || selectedVariant?._id);
            
            return productMatch && variantMatch;
        });
    };

    const getProductDetails = () => {
        const productData = selectedVariant || product.variants?.[0] || product;
        
        return {
            description: productData?.description || product?.description || 'No description available for this product.',
            material_care: productData?.material_care || product?.material_care || 'No material care information available.'
        };
    };

    const getPricingInfo = () => {
        const productData = selectedVariant || product.variants?.[0] || product;
        
        const hasSizeSpecificPricing = productData?.sizes && productData.sizes.length > 0 && productData.sizes.some(sizeObj => sizeObj.price || sizeObj.sale_price);
        
        if (hasSizeSpecificPricing) {
            if (selectedSize) {
                const sizeData = productData.sizes.find(s => s.size === selectedSize);
                if (sizeData) {
                    return {
                        currentPrice: sizeData.sale_price && sizeData.sale_price !== "0" ? sizeData.sale_price : sizeData.price,
                        originalPrice: sizeData.sale_price && sizeData.sale_price !== "0" ? sizeData.price : null,
                        hasDiscount: sizeData.sale_price && sizeData.sale_price !== "0",
                        showSizeNote: false
                    };
                }
            } else {
                const prices = productData.sizes
                    .map(s => parseFloat(s.sale_price && s.sale_price !== "0" ? s.sale_price : s.price))
                    .filter(price => !isNaN(price))
                    .sort((a, b) => a - b);
                
                if (prices.length > 0) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    
                    return {
                        currentPrice: minPrice === maxPrice ? minPrice.toString() : `${minPrice} - ${maxPrice}`,
                        originalPrice: null,
                        hasDiscount: false,
                        showSizeNote: minPrice !== maxPrice,
                        isPriceRange: minPrice !== maxPrice
                    };
                }
            }
        }
        
        if (productData?.sale_price && productData.sale_price !== "0" && productData?.price) {
            return {
                currentPrice: productData.sale_price,
                originalPrice: productData.price,
                hasDiscount: true,
                showSizeNote: false
            };
        }
        
        return {
            currentPrice: productData?.price || 'Price not available',
            originalPrice: null,
            hasDiscount: false,
            showSizeNote: false
        };
    };

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product, selectedVariant]);

    const { description, material_care } = getProductDetails();

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

    useEffect(() => {
        if (currentProduct && selectedVariant) {
            const isInWishlist = checkIfInWishlist(product, selectedVariant);
            setwishlist(isInWishlist);
        }
    }, [currentProduct, selectedVariant, wishlistItems]);

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = async (product) => {
        const userDetails = userdetails;
        // if (!userDetails) {
        //     toast.error("Please log in to add items to your cart!");
        //     return;
        // }

        if (!selectedSize) {
            toast.error("Please select a size!");
            return;
        }

        const cartItemsFromStore = cartItems || [];
        
        const existingItem = cartItemsFromStore.find(item => {
            const itemProductId = item.productId?._id || item.productId || item.productId?.id;
            
            return itemProductId === product._id && 
                item.selectedSize === selectedSize &&
                (item.variantId || null) === (selectedVariant?._id || null);
        });

        if (existingItem) {
            const productType = selectedVariant ? 'variant' : 'main product';
            toast.error(`This ${productType} with size ${selectedSize} is already in your cart!`);
            return;
        }

        try {
            const cartData = { productId: product._id, Email: userDetails.Email, Quantity: 1, selectedSize: selectedSize, variantId: selectedVariant?._id || null};
            
            await apisavecart(cartData);
            
            const productWithSize = {...product,selectedSize: selectedSize,variantId: selectedVariant?._id || null};

            addToCart(productWithSize);
            const productType = selectedVariant ? 'Variant' : 'Main product';
            toast.success(`${productType} added to cart successfully!`);
            
            setSelectedSize('');
        } catch (error) {
            toast.error("Failed to add product to cart.");
            console.error("Error adding product to cart:", error);
        }
    };

    const addWish = async (productData) => {
        try {
            const userDetails = userdetails;
            if (!userDetails?.Email) {
                toast.error("Please log in to manage your wishlist!");  
                return;
            }

            const productToProcess = product;
            const variantToProcess = selectedVariant;
            
            if (!variantToProcess) {
                toast.error("Please select a variant to add to wishlist!");
                return;
            }
            
            const currentWishlistState = checkIfInWishlist(productToProcess, variantToProcess);
            
            if (currentWishlistState) {
                const wishlistItem = wishlistItems.find(item => {
                    return item.productId === productToProcess._id && 
                        item.variantId === variantToProcess._id;
                });

                if (wishlistItem) {
                    await deleteOnewishitems(wishlistItem._id);
                    setWishlistItems(prev => prev.filter(item => item._id !== wishlistItem._id));
                    Swal.fire({
                        title: "Removed from Wishlist !",
                        icon: "success",
                        draggable: true,
                    });
                }
            } else {
                const wishlistData = {
                    Email: userDetails.Email,
                    productId: productToProcess._id,
                    variantId: variantToProcess._id,
                    variantName: variantToProcess.variant_name,
                    Product_Name: variantToProcess.variant_name,
                    Category: productToProcess.Category || '',
                    Subcategory: productToProcess.Subcategory || '',
                    description: variantToProcess.description || productToProcess.description || '',
                    material_care: variantToProcess.material_care || productToProcess.material_care || '',
                    tags: variantToProcess.tags || productToProcess.tags || '',
                    gender: variantToProcess.gender || productToProcess.gender || '',
                    Product_type: variantToProcess.Product_type || productToProcess.Product_type || '',
                    is_popular_products: productToProcess.is_popular_products || false,
                    stock: variantToProcess.stock || 'Inactive',
                    status: variantToProcess.status || 'Active',
                    variants: [variantToProcess]
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

    const pricingInfo = getPricingInfo();

    return (
        <>
            <section className="py-10">
                <div className="max-w-[85rem] mx-auto px-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="flex justify-center items-center gap-5">
                            <div className="h-[60dvh] relative">
                                <Swiper direction={'vertical'} navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom', }} modules={[Navigation]} className="h-full w-20 mySwiper" slidesPerView={4} spaceBetween={10} >
                                    {currentProduct?.Images?.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={getImageUrl(img)} alt={`${currentProduct.Product_Name} - Thumbnail ${index + 1}`}
                                                className={`h-20 w-20 object-cover cursor-pointer border-2 ${ currentMainImage === index ? 'border-black' : 'border-transparent hover:border-gray-300' }`}
                                                onClick={() => handleThumbnailClick(index)} onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="swiper-button-prev-custom absolute -top-12 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer text-white bg-black shadow-md px-5">
                                    <ChevronUp/>
                                </div>
                                
                                <div className="swiper-button-next-custom absolute -bottom-0 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer text-white bg-black shadow-md px-5">
                                    <ChevronDown/>
                                </div>
                            </div>
                            <div>
                                <img src={currentProduct?.Images && currentProduct.Images.length > 0 ? getImageUrl(currentProduct.Images[currentMainImage]) : 'https://via.placeholder.com/400x600?text=No+Image'} 
                                    alt={currentProduct?.Product_Name} className="h-[75dvh] w-[35rem] object-cover" />
                            </div>
                        </div>

                        <div className="py-10">
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <p className="text-xl barlow font-semibold tracking-wider"> {currentProduct?.Product_Name || 'Product Name Not Available'} </p>
                                    <h3 className="text-gray-500"> {currentProduct?.tags || 'NEW DROP'} </h3>
                                </div>
                                <div className="flex gap-5">
                                    <i className={`fi ${wishlist ? "fi-sr-heart" : "fi-rr-heart"} hover:cursor-pointer text-xl text-red-700`} onClick={() => {addWish(); }}></i>
                                    <Share />
                                </div>
                            </div>

                            <div className="py-8">
                                <div className="flex items-center gap-3">
                                    {pricingInfo.hasDiscount ? (
                                        <>
                                            <p className="font-semibold text-2xl">
                                                ₹ {pricingInfo.currentPrice}
                                            </p>
                                            <span className="text-lg text-gray-500 line-through">
                                                ₹ {pricingInfo.originalPrice}
                                            </span>
                                        </>
                                    ) : (
                                        <p className="font-semibold text-2xl">
                                            ₹ {pricingInfo.currentPrice}
                                        </p>
                                    )}
                                </div>
                                
                                {pricingInfo.showSizeNote && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        * Prices may vary by size. Select a size to see exact price.
                                    </p>
                                )}
                                
                                <div className="mt-6">
                                    <div className="flex flex-wrap gap-3">
                                        {/* <div onClick={handlePrimaryProductClick} className={`cursor-pointer p-2  transition-all ${selectedVariant === null ? 'border-black bg-gray-100' : ''}`} >
                                            <div className="flex items-center gap-2">
                                                {product.Images && product.Images[0] && (
                                                    <img src={getImageUrl(product.Images[0])} alt={product.Product_Name} className="w-20 h-20 object-cover"/>
                                                )}
                                                
                                            </div>
                                        </div> */}

                                        {product.variants?.map((variant, index) => (
                                            <div key={variant._id} onClick={() => handleVariantClick(variant)}
                                                className={`cursor-pointer p-2  transition-all ${
                                                    selectedVariant?._id === variant._id ? 'border-black bg-gray-200' : 'border-gray-300 hover:border-gray-400'
                                                }`} >
                                                <div className="flex items-center gap-2">
                                                    {variant.variant_images && variant.variant_images[0] && (
                                                        <img src={getImageUrl(variant.variant_images[0])} alt={variant.variant_name} className="w-20 h-20 object-cover"/>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="lg:flex justify-between">
                                    <div className="space-y-3">
                                        <p className="font-semibold manrope">SIZE</p>
                                         <div className="flex gap-2 text-lg">
                                            {currentProduct?.sizes?.map((sizeObj, index) => {
                                                const sizeValue = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                                                return (
                                                    <p key={index} className={`px-5 py-1 cursor-pointer transition-colors ${selectedSize === sizeValue ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                                                        onClick={() => handleSizeClick(sizeValue)} >
                                                        {sizeValue}
                                                    </p>
                                                );
                                            })}
                                            {['S', 'M', 'L', 'XL', 'XXL'].filter(size => {
                                                const availableSizes = currentProduct?.sizes?.map(s => typeof s === 'string' ? s : s.size) || [];
                                                return !availableSizes.includes(size);
                                            }).map((size, index) => (
                                                <p key={`inactive-${index}`} className="bg-gray-200 px-5 py-1 cursor-not-allowed text-gray-400">
                                                    {size}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="lg:mt-0 mt-5">
                                        <p className="manrope cursor-pointer  hover:underline">Size Guide</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-10">
                                <button onClick={() => handleAddToCart(currentProduct)}
                                    className={`w-full py-3 uppercase font-semibold manrope cursor-pointer transition-colors ${
                                        currentProduct?.stock === 'Active' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                                    disabled={currentProduct?.stock !== 'Active'}>
                                    {currentProduct?.stock === 'Active' ? 'Add To Cart' : 'Out of Stock'}
                                </button>
                            </div>

                            <div>
                                <div className="max-w-full mx-auto">
                                    <div className="grid md:grid-cols-1 gap-8">
                                        <div className="bg-white max-w-full mx-auto">
                                            <ul className="shadow-box">
                                                <li className="relative border-b border-gray-200 w-full">
                                                    <button type="button" className="w-full px-6 py-3 text-left" onClick={() => toggleAccordion(3)}>
                                                        <div className="flex items-center justify-between">
                                                            <span>DESCRIPTION</span>
                                                            <ChevronDown className={`text-gray-500 transition-transform ${selected === 3 ? "transform rotate-180" : ""}`} />
                                                        </div>
                                                    </button>
                                                    <div className="relative overflow-hidden transition-all duration-700" style={{maxHeight: selected === 3 ? container3Ref.current?.scrollHeight || "auto" : "0"}} ref={container3Ref}>
                                                        <div className="px-6 pb-6">
                                                           <div dangerouslySetInnerHTML={{__html: description}}/>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li className="relative border-b border-gray-200">
                                                    <button type="button" className="w-full px-6 py-3 text-left" onClick={() => toggleAccordion(7)}>
                                                        <div className="flex items-center justify-between">
                                                            <span>MATERIAL CARE</span>
                                                            <ChevronDown className={`text-gray-500 transition-transform ${selected === 7 ? "transform rotate-180" : ""}`} />
                                                        </div>
                                                    </button>
                                                    <div className="relative overflow-hidden transition-all duration-700" style={{maxHeight: selected === 7 ? container7Ref.current?.scrollHeight || "auto" : "0"}} ref={container7Ref}>
                                                        <div className="px-6 pb-6">
                                                            <div dangerouslySetInnerHTML={{__html: material_care}}/>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li className="relative border-b border-gray-200">
                                                    <button type="button" className="w-full px-6 py-3 text-left" onClick={() => toggleAccordion(2)}>
                                                        <div className="flex items-center justify-between">
                                                            <span>REVIEWS</span>
                                                            <ChevronDown className={`text-gray-500 transition-transform ${selected === 2 ? "transform rotate-180" : ""}`} />
                                                        </div>
                                                    </button>
                                                    <div className="relative overflow-hidden transition-all duration-700" style={{maxHeight: selected === 2 ? container2Ref.current?.scrollHeight || "auto" : "0"}} ref={container2Ref}>
                                                        <div className="px-6 pb-6">
                                                            <p>No reviews yet. Be the first to review this product!</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}