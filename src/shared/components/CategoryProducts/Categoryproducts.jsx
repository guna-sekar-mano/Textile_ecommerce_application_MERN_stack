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
import { apigetHeaderproductsCustomers, apigetPopularProducts } from '../../services/apicustomerProducts/apicustomerproducts';
import Swal from 'sweetalert2';
import FilterSidebar from './FilterSidebar';

const toUrlFriendly = (str) => {return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');};

const fromUrlFriendly = (str) => {return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');};

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
    const [availableColors, setAvailableColors] = useState([]);
    const [availablePrices, setAvailablePrices] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [availableProductTypes, setAvailableProductTypes] = useState([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);


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

    const extractUniqueColors = (products) => {
        const colorsSet = new Set();
        const colorMap = new Map();
        
        products.forEach(product => {
            if (product.variants && Array.isArray(product.variants)) {
                product.variants.forEach(variant => {
                    if (variant.variant_color && variant.variant_color.trim()) {
                        const colorName = variant.variant_color.trim();
                        const colorCode = variant.variant_color_code || '#000000';
                        
                        if (!colorMap.has(colorName)) {
                            colorMap.set(colorName, colorCode);
                            colorsSet.add(colorName);
                        }
                    }
                });
            }
        });
        
        return Array.from(colorsSet).map(color => ({
            name: color,
            code: colorMap.get(color)
        }));
    };

    const extractUniquePrices = (products) => {
        const prices = products.map(product => getProductPrice(product)).filter(price => price);
        
        if (prices.length === 0) return { min: 0, max: 10000 };
        
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        
        return { min, max };
    };

    const extractUniqueProductTypes = (products) => {
        const typesSet = new Set();
        
        products.forEach(product => {
            if (product.Product_type && product.Product_type.trim()) {
                typesSet.add(product.Product_type.trim());
            }
        });
        
        return Array.from(typesSet).sort();
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

    const productHasColor = (product, targetColor) => {
        if (product.variants && Array.isArray(product.variants)) {
            return product.variants.some(variant => 
                variant.variant_color === targetColor
            );
        }
        return false;
    };

    const productInPriceRange = (product, minRange, maxRange) => {
        const productPrice = getProductPrice(product);
        return productPrice >= minRange && productPrice <= maxRange;
    };

    const applyFilters = (products, sizes, colors, priceMin, priceMax, productTypes) => {
        return products.filter(product => {
            if (sizes.length > 0) {
                const hasSize = sizes.some(size => productHasSize(product, size));
                if (!hasSize) return false;
            }
            
            if (colors.length > 0) {
                const hasColor = colors.some(color => productHasColor(product, color));
                if (!hasColor) return false;
            }

            if (!productInPriceRange(product, priceMin, priceMax)) {
                return false;
            }

            if (productTypes.length > 0) {
                if (!productTypes.includes(product.Product_type)) return false;
            }
            
            return true;
        });
    };

    const handleSizeChange = (size) => {
        const newSelectedSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        
        setSelectedSizes(newSelectedSizes);
        
        const filtered = applyFilters(products, newSelectedSizes, selectedColors, priceRange[0], priceRange[1], selectedProductTypes);
        setFilteredProducts(filtered);
    };

    const handleColorChange = (color) => {
        const newSelectedColors = selectedColors.includes(color)
            ? selectedColors.filter(c => c !== color)
            : [...selectedColors, color];
        
        setSelectedColors(newSelectedColors);
        
        const filtered = applyFilters(products, selectedSizes, newSelectedColors, priceRange[0], priceRange[1], selectedProductTypes);
        setFilteredProducts(filtered);
    };

    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
        
        const filtered = applyFilters(products, selectedSizes, selectedColors, newRange[0], newRange[1], selectedProductTypes);
        setFilteredProducts(filtered);
    };

    const handleProductTypeChange = (productType) => {
        const newSelectedProductTypes = selectedProductTypes.includes(productType)
            ? selectedProductTypes.filter(pt => pt !== productType)
            : [...selectedProductTypes, productType];
        
        setSelectedProductTypes(newSelectedProductTypes);
        
        const filtered = applyFilters(products, selectedSizes, selectedColors, priceRange[0], priceRange[1], newSelectedProductTypes);
        setFilteredProducts(filtered);
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedProductTypes([]);
        setPriceRange([minPrice, maxPrice]);
        setFilteredProducts(products);
    };

    const fetchCategoryProducts = useCallback(async () => {
        const passedProducts = location.state?.products;
        const passedCategoryName = location.state?.categoryName;
        const isPopularProducts = location.state?.isPopularProducts;

        if (isPopularProducts && passedProducts && passedProducts.length > 0) {
            setProducts(passedProducts);
            setCategoryName(passedCategoryName || 'Popular Products');
            
            const uniqueSizes = extractUniqueSizes(passedProducts);
            const uniqueColors = extractUniqueColors(passedProducts);
            const priceMinMax = extractUniquePrices(passedProducts);
            const uniqueProductTypes = extractUniqueProductTypes(passedProducts);
            
            setAvailableSizes(uniqueSizes);
            setAvailableColors(uniqueColors);
            setMinPrice(priceMinMax.min);
            setMaxPrice(priceMinMax.max);
            setPriceRange([priceMinMax.min, priceMinMax.max]);
            setAvailableProductTypes(uniqueProductTypes);
            setFilteredProducts(passedProducts);
            setLoading(false);
            return;
        }
        
        if (!productType) return;
        
        setLoading(true);
        try {
            const urlParams = new URLSearchParams(location.search);
            const genderFilter = urlParams.get('gender');
            
            let data;
            let displayName = '';
            
            if (productType === 'popular-products') {
                const res = await apigetPopularProducts();
                const apiData = res?.resdata || [];
                let allProducts = [];

                apiData.forEach(popularProductGroup => {
                    if (popularProductGroup.ProductId && Array.isArray(popularProductGroup.ProductId)) {
                        allProducts.push(...popularProductGroup.ProductId);
                    }
                });

                const uniqueProducts = allProducts.filter((product, index, self) => 
                    index === self.findIndex((p) => p._id === product._id)
                );

                data = { resdata: uniqueProducts };
                displayName = 'Popular Products';
            } else {
                const params = {};
                
                if (productType === 'sale') {
                    params.saleItems = true;
                } else if (productType !== 'all') {
                    params.productType = productType;
                }
                
                if (genderFilter) {
                    params.gender = genderFilter;
                }
                
                data = await apigetHeaderproductsCustomers(params);
                
                if (productType === 'all' && genderFilter) {
                    const capitalizedGender = genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1);
                    displayName = `All ${capitalizedGender}'s Products`;
                } else if (data.resdata && data.resdata.length > 0) {
                    const displayProductType = data.resdata[0].Product_type || fromUrlFriendly(productType);
                    displayName = displayProductType;
                    if (genderFilter) {
                        const capitalizedGender = genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1);
                        displayName = `${capitalizedGender}'s ${displayProductType}`;
                    }
                } else {
                    displayName = fromUrlFriendly(productType);
                }
            }
            
            if (data.resdata) {
                setProducts(data.resdata);
                setCategoryName(displayName);
                
                const uniqueSizes = extractUniqueSizes(data.resdata);
                const uniqueColors = extractUniqueColors(data.resdata);
                const priceMinMax = extractUniquePrices(data.resdata);
                const uniqueProductTypes = extractUniqueProductTypes(data.resdata);
                
                setAvailableSizes(uniqueSizes);
                setAvailableColors(uniqueColors);
                setMinPrice(priceMinMax.min);
                setMaxPrice(priceMinMax.max);
                setPriceRange([priceMinMax.min, priceMinMax.max]);
                setAvailableProductTypes(uniqueProductTypes);
                setFilteredProducts(data.resdata);
                
                if (productType !== 'all' && productType !== 'popular-products') {
                    sessionStorage.setItem('currentProductType', displayName);
                }
            }
        } catch (error) {
            console.error("Error fetching category products:", error);
            setProducts([]);
            setFilteredProducts([]);
            setCategoryName('');
        } finally {
            setLoading(false);
        }
    }, [productType, location.search, location.state]);

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
            
            if (variantToCheck) {
                return isSameProduct && item.variantId === variantToCheck._id;
            }
            
            const firstVariant = productToCheck.variants?.find(v => v.status === 'Active') || productToCheck.variants?.[0];
            if (firstVariant) {
                return isSameProduct && item.variantId === firstVariant._id;
            }
            
            return isSameProduct && !item.variantId;
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
                toast("📢 Please log in to manage your wishlist!");  
                return;
            }

            const productToProcess = productData;
            
            const firstVariant = productToProcess.variants?.find(v => v.status === 'Active') || productToProcess.variants?.[0];
            
            const currentWishlistState = checkIfInWishlist(productToProcess, firstVariant);
            
            if (currentWishlistState) {
                const wishlistItem = wishlistItems.find(item => {
                    const isSameProduct = item.productId === productToProcess._id;
                    if (firstVariant) {
                        return isSameProduct && item.variantId === firstVariant._id;
                    }
                    return isSameProduct && !item.variantId;
                });

                if (wishlistItem) {
                    await deleteOnewishitems(wishlistItem._id);
                    setWishlistItems(prev => prev.filter(item => item._id !== wishlistItem._id));
                    
                    Swal.fire({ title: "Removed from Wishlist!", icon: "success", draggable: true, timer: 2000, showConfirmButton: false});
                }
            } else {
                let wishlistData;

                if (firstVariant) {
                    wishlistData = {
                        Email: userDetails.Email,
                        productId: productToProcess._id,
                        variantId: firstVariant._id,
                        Product_Name: productToProcess.Product_Name,
                        Category: productToProcess.Category || '',
                        Subcategory: productToProcess.Subcategory || '',
                        description: productToProcess.description || '',
                        material_care: productToProcess.material_care || '',
                        tags: productToProcess.tags || '',
                        gender: productToProcess.gender || '',
                        Product_type: productToProcess.Product_type || '',
                        is_popular_products: productToProcess.is_popular_products || false,
                        Images: productToProcess.Images || [],
                        variants: [firstVariant]
                    };
                } else {
                    const {_id, variants, ...productDataWithoutId} = productToProcess;

                    wishlistData = {
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
                }

                const response = await savewishitems(wishlistData);
                if (response) {
                    setWishlistItems(prev => [...prev, response]);
                }
                
                Swal.fire({title: "Added to Wishlist!",icon: "success",draggable: true,timer: 2000,showConfirmButton: false});
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
                                {selectedSizes.length > 0 || selectedColors.length > 0 || selectedPrices.length > 0 ? "No products found matching the selected filters." : "No products found in this category."}
                            </p>
                           {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedProductTypes.length > 0 || priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
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
                                            
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 z-10 hover:bg-white cursor-pointer transition-all duration-200  shadow-sm">
                                                <i className={`fi ${checkIfInWishlist(item, firstVariant) ? "fi-sr-heart" : "fi-rr-heart"} flex justify-center items-center hover:cursor-pointer text-xl transition-colors duration-200 ${
                                                    checkIfInWishlist(item, firstVariant) ? "text-red-600" : "text-gray-600 hover:text-red-600"
                                                }`} 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addWish(item);
                                                    }}
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

                    <FilterSidebar 
                        setIsOpen={setIsOpen} 
                        isOpen={isOpen} 
                        selectedSizes={selectedSizes} 
                        selectedColors={selectedColors}
                        selectedProductTypes={selectedProductTypes}
                        priceRange={priceRange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        availableSizes={availableSizes} 
                        availableColors={availableColors}
                        availableProductTypes={availableProductTypes}
                        handleSizeChange={handleSizeChange}
                        handleColorChange={handleColorChange}
                        handlePriceRangeChange={handlePriceRangeChange}
                        handleProductTypeChange={handleProductTypeChange}
                        clearFilters={clearFilters}
                    />

                    {isOpen && (
                        <div className="fixed inset-0 bg-black/35 z-[99]" onClick={() => setIsOpen(false)} />
                    )}
                </div>
            </section>
        </>
    );
}