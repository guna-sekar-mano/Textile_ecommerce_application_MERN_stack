import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apigetPopularProducts } from '../../services/apicustomerProducts/apicustomerproducts';
import apiurl from '../../services/apiendpoint/apiendpoint';
import { Link, useNavigate } from 'react-router-dom';
import { deleteOnewishitems, getAllwishitems, savewishitems } from '../../services/apiwishlist/apiwishlist';
import useAuth from '../../services/store/useAuth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'

const toUrlFriendly = (str) => {
  return str ?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

export default function Popularproducts () {

    const isMountedRef = useRef(true);
    const [data, setData] = useState({ products: [], highlightedProduct: null, totallength: 0 });
    const { userdetails } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const navigate = useNavigate();

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

    const getAllPopularProductsData = useCallback(async () => {
        try {
            const res = await apigetPopularProducts();
            
            const apiData = res?.resdata || [];
            let allProducts = [];
            let highlightedData = null;

            apiData.forEach(popularProductGroup => {
                if (popularProductGroup.ProductId && Array.isArray(popularProductGroup.ProductId)) {
                    allProducts.push(...popularProductGroup.ProductId);
                }
                
                if (!highlightedData && popularProductGroup.Images && popularProductGroup.Images.length > 0) {
                    highlightedData = {
                        image: popularProductGroup.Images[0],
                        sectionName: popularProductGroup.Highlighted_Section_Name || 'Featured Collection'
                    };
                }
            });

            const uniqueProducts = allProducts.filter((product, index, self) => 
                index === self.findIndex((p) => p._id === product._id)
            );

            setData({ products: uniqueProducts,highlightedProduct: highlightedData,totallength: uniqueProducts.length });
        } catch (error) {
            console.error('Error fetching data:', error);
            setData({ products: [], highlightedProduct: null, totallength: 0 });
        }
    }, []);
    
    useEffect(() => {
        if (isMountedRef.current) {
            getAllPopularProductsData();
        }
        return () => { 
            isMountedRef.current = false; 
        };
    }, [getAllPopularProductsData]);

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

    const getProductImage = (product) => {
        if (product.variants && product.variants.length > 0) {
            const firstVariant = product.variants.find(v => v.status === 'Active') || product.variants[0];
            if (firstVariant && firstVariant.variant_images && firstVariant.variant_images.length > 0) {
                return firstVariant.variant_images[0];
            }
        }
        return null;
    };

    const getProductImages = (product) => {
        if (product.variants && product.variants.length > 0) {
            const firstVariant = product.variants.find(v => v.status === 'Active') || product.variants[0];
            if (firstVariant && firstVariant.variant_images && firstVariant.variant_images.length > 0) {
                return firstVariant.variant_images;
            }
        }
        return [];
    };

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

    const handleViewMore = () => {
        navigate('/collections/popular-products', { 
            state: { products: data.products,categoryName: data.highlightedProduct?.sectionName || 'Popular Products',isPopularProducts: true} 
        });
    };

    return (
        <>
        <section className="px-4 py-5 lg:py-10">
            <div className="max-w-[95rem] mx-auto">
                <h1 className="text-2xl azeret-mono">Popular Products</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-5 lg:mt-8">
                    <div className="col-span-4 ">
                        <div className='sticky top-20 relative'>
                            {data.highlightedProduct && (
                                <>
                                    <img src={getImageUrl(data.highlightedProduct.image)} alt={data.highlightedProduct.sectionName} className="lg:h-[80dvh] w-full object-cover object-center" />
                                    <div className='absolute bottom-0 left-0 w-full p-4 azeret-mono'>
                                        <div className='bg-white/90 p-3 rounded'>
                                            <h3 className='font-semibold text-gray-800 text-lg'>{data.highlightedProduct.sectionName}</h3>
                                            <button onClick={handleViewMore} className='mt-3 w-full bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors duration-200 cursor-pointer'>
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {data?.products.slice(0, 6).map((item) => {
                                const productImages = getProductImages(item);
                                const firstVariant = item.variants?.find(v => v.status === 'Active') || item.variants?.[0];
                                
                                return (
                                    <div className="group" key={item._id}>
                                        <div className="relative">
                                            <Link to={`/products/${toUrlFriendly(item.Product_type)}/${toUrlFriendly(item.Product_Name)}`} state={{ product: item, productId: item._id }} onClick={scrollToTop}>
                                                <Swiper 
                                                    navigation={{
                                                        nextEl: `.swiper-button-next-${item._id}`,
                                                        prevEl: `.swiper-button-prev-${item._id}`,
                                                    }} 
                                                    modules={[Navigation]} 
                                                    className="mySwiper relative" 
                                                    loop={productImages.length > 1} 
                                                >
                                                    {productImages.map((img, index) => (
                                                        <SwiperSlide key={index}>
                                                            <img src={getImageUrl(img)} alt={`${item.Product_Name} - Image ${index + 1}`} className="w-full h-[230px] md:h-[400px] lg:h-[500px] object-cover" />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </Link>
                                            
                                            {/* <div className="absolute top-2 left-2 bg-white/60 p-1 z-10">
                                                <p className="text-sm flex justify-center items-center">{item.tags || 'NEW'}</p>
                                            </div> */}
                                            <div className="absolute top-2 right-2 bg-white p-1 z-10">
                                               <i className={`fi ${checkIfInWishlist(item, null) ? "fi-sr-heart" : "fi-rr-heart"} flex justify-center items-center hover:cursor-pointer text-xl text-red-700`} onClick={() => {addWish(item); }}></i>
                                            </div>
                                            
                                            {productImages.length > 1 && (
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
                                                {(() => {
                                                    if (item.price || item.sale_price) {
                                                        const hasGlobalSalePrice = item.sale_price && parseFloat(item.sale_price) > 0;
                                                        
                                                        if (hasGlobalSalePrice) {
                                                            return (
                                                                <>
                                                                    <span className="text-lg font-semibold text-gray-900">
                                                                        ₹{item.sale_price}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        ₹{item.price}
                                                                    </span>
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <span className="text-lg font-semibold text-gray-900">
                                                                    ₹{item.price}
                                                                </span>
                                                            );
                                                        }
                                                    } 
                                                    else if (firstVariant?.sizes && firstVariant.sizes.length > 0) {
                                                        const firstSize = firstVariant.sizes[0];
                                                        const displayPrice = firstSize?.sale_price && firstSize.sale_price !== "0" 
                                                            ? firstSize.sale_price 
                                                            : firstSize?.price;
                                                        const originalPrice = firstSize?.price;
                                                        
                                                        const hasDiscount = firstSize?.sale_price && 
                                                            firstSize.sale_price !== "0" && 
                                                            firstSize.sale_price !== firstSize.price;
                                                        
                                                        if (hasDiscount) {
                                                            return (
                                                                <>
                                                                    <span className="text-lg font-semibold text-gray-900">
                                                                        ₹{displayPrice}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        ₹{originalPrice}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        ({firstSize.size})
                                                                    </span>
                                                                </>
                                                            );
                                                        } else if (displayPrice) {
                                                            return (
                                                                <>
                                                                    <span className="text-lg font-semibold text-gray-900">
                                                                        ₹{displayPrice}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        ({firstSize.size})
                                                                    </span>
                                                                </>
                                                            );
                                                        }
                                                    }
                                                    // Check if item has old sizes structure
                                                    else if (item.sizes && item.sizes.length > 0) {
                                                        const firstSize = item.sizes[0];
                                                        const hasSizeWiseSalePrice = firstSize.sale_price && parseFloat(firstSize.sale_price) > 0;
                                                        
                                                        if (hasSizeWiseSalePrice) {
                                                            return (
                                                                <>
                                                                    <span className="text-lg font-semibold text-gray-900">
                                                                        ₹{firstSize.sale_price}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        ₹{firstSize.price}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        ({firstSize.size})
                                                                    </span>
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    <span className="text-lg font-semibold text-gray-900">
                                                                        ₹{firstSize.price}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        ({firstSize.size})
                                                                    </span>
                                                                </>
                                                            );
                                                        }
                                                    }
                                                    else {
                                                        return (
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                Price not available
                                                            </span>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}