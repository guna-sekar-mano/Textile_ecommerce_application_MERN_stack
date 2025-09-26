import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useCallback, useEffect, useState } from "react";
import apiurl from "../../services/apiendpoint/apiendpoint";
import { ChevronLeft, ChevronRight, Grid2x2, SlidersHorizontal, X } from 'lucide-react';
import useAuth from '../../services/store/useAuth';
import { deleteOnewishitems, getAllwishitems, savewishitems } from '../../services/apiwishlist/apiwishlist';
import toast from 'react-hot-toast';
import { Link, useParams, useLocation } from 'react-router-dom';
import { apigetallproductsCustomers } from '../../services/apicustomerProducts/apicustomerproducts';

const toUrlFriendly = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const fromUrlFriendly = (str) => {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function Categoryproducts() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const { userdetails } = useAuth();
    const { productType } = useParams();
    const location = useLocation();
    const [grid, setGrid] = useState(4);
    const [isOpen, setIsOpen] = useState(false);

    const [availableSizes, setAvailableSizes] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const changeGrid = () => {
        setGrid((prev) => (prev === 4 ? 2 : prev + 1));
    };

    const extractUniqueSizes = (products) => {
        const sizesSet = new Set();
        
        products.forEach(product => {
            if (product.sizes && Array.isArray(product.sizes)) {
                product.sizes.forEach(size => {
                    if (size && size.trim()) {
                        sizesSet.add(size.trim());
                    }
                });
            }
            
            if (product.variants && Array.isArray(product.variants)) {
                product.variants.forEach(variant => {
                    if (variant.sizes && Array.isArray(variant.sizes)) {
                        variant.sizes.forEach(sizeObj => {
                            if (sizeObj.size && sizeObj.size.trim()) {
                                sizesSet.add(sizeObj.size.trim());
                            }
                        });
                    }
                });
            }
        });
        
        const sizesArray = Array.from(sizesSet);
        
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        
        return sizesArray.sort((a, b) => {
            const aIndex = sizeOrder.indexOf(a.toUpperCase());
            const bIndex = sizeOrder.indexOf(b.toUpperCase());
            
            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            } else if (aIndex !== -1) {
                return -1;
            } else if (bIndex !== -1) {
                return 1;
            } else {
                return a.localeCompare(b);
            }
        });
    };

    const generatePriceRanges = (products) => {
        const prices = [];
        
        products.forEach(product => {
            if (product.sale_price && product.sale_price !== "0") {
                prices.push(parseFloat(product.sale_price));
            } else if (product.price) {
                prices.push(parseFloat(product.price));
            }
            
            if (product.variants && Array.isArray(product.variants)) {
                product.variants.forEach(variant => {
                    if (variant.sizes && Array.isArray(variant.sizes)) {
                        variant.sizes.forEach(sizeObj => {
                            if (sizeObj.sale_price && sizeObj.sale_price !== "0") {
                                prices.push(parseFloat(sizeObj.sale_price));
                            } else if (sizeObj.price) {
                                prices.push(parseFloat(sizeObj.price));
                            }
                        });
                    }
                });
            }
        });
        
        if (prices.length === 0) return [];
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        const ranges = [];
        const step = Math.ceil((maxPrice - minPrice) / 4);
        
        for (let i = minPrice; i < maxPrice; i += step) {
            const rangeEnd = Math.min(i + step - 1, maxPrice);
            ranges.push({
                label: `₹${i} - ₹${rangeEnd}`,
                min: i,
                max: rangeEnd
            });
        }
        
        if (ranges.length > 0) {
            const lastRange = ranges[ranges.length - 1];
            if (lastRange.max < maxPrice) {
                ranges.push({
                    label: `Above ₹${lastRange.max}`,
                    min: lastRange.max + 1,
                    max: maxPrice
                });
            }
        }
        
        return ranges;
    };

    const getProductPrice = (product) => {
        const firstVariant = product.variants?.find(v => v.status === 'Active') || product.variants?.[0];
        
        if (firstVariant?.sizes?.[0]) {
            const firstSize = firstVariant.sizes[0];
            return firstSize.sale_price && firstSize.sale_price !== "0" 
                ? parseFloat(firstSize.sale_price)
                : parseFloat(firstSize.price);
        }
        
        return product.sale_price && product.sale_price !== "0" 
            ? parseFloat(product.sale_price) 
            : parseFloat(product.price || 0);
    };

    const productHasSize = (product, targetSize) => {
        if (product.sizes && product.sizes.includes(targetSize)) {
            return true;
        }
        
        if (product.variants && Array.isArray(product.variants)) {
            return product.variants.some(variant => 
                variant.sizes && variant.sizes.some(sizeObj => 
                    sizeObj.size === targetSize
                )
            );
        }
        
        return false;
    };

    const applyFilters = (products, sizes, priceRanges) => {
        return products.filter(product => {
            if (sizes.length > 0) {
                const hasSize = sizes.some(size => productHasSize(product, size));
                if (!hasSize) return false;
            }
            
            if (priceRanges.length > 0) {
                const productPrice = getProductPrice(product);
                const inPriceRange = priceRanges.some(range => 
                    productPrice >= range.min && productPrice <= range.max
                );
                if (!inPriceRange) return false;
            }
            
            return true;
        });
    };

    const handleSizeChange = (size) => {
        const newSelectedSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        
        setSelectedSizes(newSelectedSizes);
        
        const filtered = applyFilters(products, newSelectedSizes, selectedPriceRanges);
        setFilteredProducts(filtered);
    };

    const handlePriceRangeChange = (range) => {
        const newSelectedRanges = selectedPriceRanges.some(r => r.min === range.min && r.max === range.max)
            ? selectedPriceRanges.filter(r => !(r.min === range.min && r.max === range.max))
            : [...selectedPriceRanges, range];
        
        setSelectedPriceRanges(newSelectedRanges);
        
        const filtered = applyFilters(products, selectedSizes, newSelectedRanges);
        setFilteredProducts(filtered);
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedPriceRanges([]);
        setFilteredProducts(products);
    };

    const fetchCategoryProducts = useCallback(async () => {
        if (!productType) return;
        
        setLoading(true);
        try {
            const data = await apigetallproductsCustomers();
            
            if (data.resdata) {
                const urlParams = new URLSearchParams(location.search);
                const genderFilter = urlParams.get('gender');
                
                const filteredProducts = data.resdata.filter(product => {
                    if (!product.Product_type) return false;
                    
                    const productTypeUrlFriendly = toUrlFriendly(product.Product_type);
                    const urlProductType = productType.toLowerCase();
                    
                    const productTypeMatches = productTypeUrlFriendly === urlProductType;
                    
                    if (genderFilter && productTypeMatches) {
                        const genderMatches = product.gender.toLowerCase() === genderFilter.toLowerCase();
                        return genderMatches;
                    }
                    
                    return productTypeMatches;
                });
                
                const displayProductType = filteredProducts.length > 0 ? filteredProducts[0].Product_type : fromUrlFriendly(productType);
                
                let displayName = displayProductType;
                if (genderFilter) {
                    const capitalizedGender = genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1);
                    displayName = `${capitalizedGender}'s ${displayProductType}`;
                }
                
                setProducts(filteredProducts);
                setCategoryName(displayName);
                
                const uniqueSizes = extractUniqueSizes(filteredProducts);
                const dynamicPriceRanges = generatePriceRanges(filteredProducts);
                
                setAvailableSizes(uniqueSizes);
                setPriceRanges(dynamicPriceRanges);
                setFilteredProducts(filteredProducts);
                
                sessionStorage.setItem('currentProductType', displayProductType);
            }
        } catch (error) {
            console.error("Error fetching category products:", error);
        } finally {
            setLoading(false);
        }
    }, [productType, location.search]);

    useEffect(() => {
        fetchCategoryProducts();
    }, [fetchCategoryProducts]);

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading products...</div>
            </div>
        );
    }

    return (
        <>
            <section className="px-2 py-10 azeret-mono">
                <div className="max-w-[95rem] mx-auto">
                    <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                        {categoryName && (
                            <h1 className="text-2xl azeret-mono mb-6">{categoryName}</h1>
                        )}

                        <div className="flex justify-between py-5 azeret-mono">
                            <div className="flex gap-5">
                                <div className="flex gap-1">
                                    <p>GRID</p>
                                    <Grid2x2 onClick={changeGrid} className="cursor-pointer" />
                                </div>
                                <div className="flex gap-1">
                                    <p>FILTER & SORT</p>
                                    <SlidersHorizontal onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredProducts.length === 0 && !loading ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-600">
                                {selectedSizes.length > 0 || selectedPriceRanges.length > 0 ? "No products found matching the selected filters." : "No products found in this category."}
                            </p>
                            {(selectedSizes.length > 0 || selectedPriceRanges.length > 0) && (
                                <button onClick={clearFilters} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Clear Filters</button>
                            )}
                        </div>
                    ) : (
                        <div className={`grid ${grid === 2 ? 'grid-cols-2' : grid === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' } gap-3 mt-6`}>
                            {filteredProducts.map((item) => {
                                const firstVariant = item.variants?.find(v => v.status === 'Active') || item.variants?.[0];
                                const variantImages = firstVariant?.variant_images || [];
                                
                                const firstSize = firstVariant?.sizes?.[0];
                                const displayPrice = firstSize?.sale_price && firstSize.sale_price !== "0" 
                                    ? firstSize.sale_price 
                                    : firstSize?.price;
                                const originalPrice = firstSize?.price;
                                
                                const hasDiscount = firstSize?.sale_price && 
                                    firstSize.sale_price !== "0" && 
                                    firstSize.sale_price !== firstSize.price;
                                const discountPercent = hasDiscount ? Math.round(((originalPrice - firstSize.sale_price) / originalPrice) * 100) : 0;

                                return (
                                    <div className="group" key={item._id}>
                                        <div className="relative">
                                            <Link to={`/products/${toUrlFriendly(item.Product_type)}/${item.Router_Link}`} state={{ product: item }} onClick={scrollToTop}>
                                                <Swiper 
                                                    navigation={{
                                                        nextEl: `.swiper-button-next-${item._id}`,
                                                        prevEl: `.swiper-button-prev-${item._id}`,
                                                    }} 
                                                    modules={[Navigation]} className="mySwiper relative" loop={variantImages.length > 1} allowTouchMove={true}
                                                >
                                                    {variantImages.map((img, index) => (
                                                        <SwiperSlide key={index}>
                                                            <img src={getImageUrl(img)} alt={`${item.Product_Name} - Image ${index + 1}`} className="w-full h-[230px] md:h-[400px] lg:h-[500px] object-cover"/>
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
                                                <i className={`fi ${checkIfInWishlist(item, null) ? "fi-sr-heart" : "fi-rr-heart"} flex justify-center items-center hover:cursor-pointer text-xl text-red-700`} 
                                                    onClick={() => {addWish(item);}}
                                                ></i>
                                            </div>
                                            
                                            {variantImages.length > 1 && (
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
                                            {displayPrice && (
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ₹{displayPrice}
                                                    </span>
                                                    {hasDiscount && (
                                                        <>
                                                            <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5">{discountPercent}% OFF</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className={`fixed top-0 right-0 h-full w-80 bg-zinc-800 z-[100] text-white p-5 transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <X onClick={() => setIsOpen(!isOpen)} className="cursor-pointer"/>
                        </div>
                        
                        {(selectedSizes.length > 0 || selectedPriceRanges.length > 0) && (
                            <button onClick={clearFilters} className="mb-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 w-full">
                                Clear All Filters
                            </button>
                        )}
                        
                        {availableSizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Filter by Size ({selectedSizes.length} selected)</h3>
                                <div className="space-y-2 overflow-y-auto">
                                    {availableSizes.map(size => (
                                        <label key={size} className="flex items-center cursor-pointer hover:bg-zinc-700 p-2 rounded">
                                            <input type="checkbox" className="mr-3" checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)}/>
                                            <span>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {priceRanges.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Filter by Price ({selectedPriceRanges.length} selected)</h3>
                                <div className="space-y-2">
                                    {priceRanges.map((range, index) => (
                                        <label key={index} className="flex items-center cursor-pointer hover:bg-zinc-700 p-2 rounded">
                                            <input type="checkbox" className="mr-3" checked={selectedPriceRanges.some(r => r.min === range.min && r.max === range.max)}
                                                onChange={() => handlePriceRangeChange(range)}/>
                                            <span>{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {isOpen && (
                        <div className="fixed inset-0 bg-black/35 z-[99]" onClick={() => setIsOpen(false)} />
                    )}
                </div>
            </section>
        </>
    );
}