import { Grid2x2, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apigetallproductsCustomers } from "../../services/apicustomerProducts/apicustomerproducts";
import apiurl from "../../services/apiendpoint/apiendpoint";


export default function Collection() {
    const [isOpen, setIsOpen] = useState(false);
    const [grid, setGrid] = useState(4);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    
    const { collectionName } = useParams();

    const changeGrid = () => {
        setGrid((prev) => (prev === 4 ? 2 : prev + 1));
    };

    const getAllProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apigetallproductsCustomers();
            const productData = res?.resdata || [];
            setProducts(productData);
            setFilteredProducts(productData);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterProductsByCollection = useCallback(() => {
        if (!collectionName || !products.length) return;

        const filtered = products.filter(product => {
            const productCollectionName = product?.header_menu?.collection_name?.toLowerCase().replace(/\s+/g, '');
            const urlCollectionName = collectionName.toLowerCase();
            return productCollectionName === urlCollectionName;
        });

        setFilteredProducts(filtered);
    }, [products, collectionName]);

    const getUniqueSubcategories = () => {
        const subcategories = new Set();
        filteredProducts.forEach(product => {
            if (product.Subcategory) {
                subcategories.add(product.Subcategory.toUpperCase());
            }
        });
        return Array.from(subcategories);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        
        if (category === "ALL") {
            filterProductsByCollection();
        } else {
            const filtered = products.filter(product => {
                const matchesCollection = collectionName ? 
                    product?.header_menu?.collection_name?.toLowerCase().replace(/\s+/g, '') === collectionName.toLowerCase() : true;
                const matchesCategory = product.Subcategory?.toUpperCase() === category;
                return matchesCollection && matchesCategory;
            });
            setFilteredProducts(filtered);
        }
    };

 const getCollectionTitle = () => {
        if (filteredProducts.length > 0 && filteredProducts[0]?.header_menu?.collection_name) {
            return filteredProducts[0].header_menu.collection_name.toUpperCase();
        }
        return collectionName ? collectionName.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase() : "COLLECTION";
    };

    const formatPrice = (price) => {
        return `₹ ${price}`;
    };

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        if (products.length > 0) {
            filterProductsByCollection();
        }
    }, [filterProductsByCollection]);

    const uniqueSubcategories = getUniqueSubcategories();

    if (loading) {
        return (
            <section className="py-10">
                <div className="max-w-[85rem] mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl">Loading products...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-10">
                <div className="max-w-[85rem] mx-auto px-4">
                    <div>
                        <p className="barlow-condensed text-4xl font-medium">{getCollectionTitle()}</p>
                        <hr className="mt-10 text-gray-400" />
                    </div>

                    <div className="flex justify-between py-5 azeret-mono">
                        <div className="flex gap-5 flex-wrap">
                            <p 
                                className={`cursor-pointer ${selectedCategory === "ALL" ? "font-bold" : ""}`}
                                onClick={() => handleCategoryFilter("ALL")}
                            >
                                ALL
                            </p>
                            {uniqueSubcategories.map((subcategory, index) => (
                                <p 
                                    key={index}
                                    className={`cursor-pointer ${selectedCategory === subcategory ? "font-bold" : ""}`}
                                    onClick={() => handleCategoryFilter(subcategory)}
                                >
                                    {subcategory}
                                </p>
                            ))}
                        </div>

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

                    {filteredProducts.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-xl text-gray-500">No products found for this collection.</p>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${grid} gap-3 mt-6`}>
                            {filteredProducts.map((item) => (
                                <div className="group" key={item._id}>
                                    <div className="relative">
                                        <Swiper 
                                            navigation={{
                                                nextEl: `.swiper-button-next-${item._id}`,
                                                prevEl: `.swiper-button-prev-${item._id}`,
                                            }} 
                                            modules={[Navigation]} 
                                            className="mySwiper relative" 
                                            loop={item.Images.length > 1}
                                        >
                                            {item.Images.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img 
                                                        src={getImageUrl(img)}
                                                        alt={item.Product_Name}
                                                        className="w-full h-auto" 
                                                        onError={(e) => {
                                                            e.target.src = '/images/placeholder.png'; // Fallback image
                                                        }}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        
                                        <div className="absolute top-2 left-2 bg-white/60 p-1 z-10">
                                            <p className="text-sm flex justify-center items-center">
                                                {item.tags || 'NEW'}
                                            </p>
                                        </div>
                                        <div className="absolute top-2 right-2 bg-white p-1 z-10">
                                            <i className="fi fi-rr-heart flex justify-center items-center cursor-pointer"></i>
                                        </div>
                                        
                                        {item.Images.length > 1 && (
                                            <div className="opacity-0 group-hover:opacity-100">
                                                <div className={`swiper-button-prev-${item._id} absolute left-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black p-2 cursor-pointer z-20 shadow-md`}>
                                                    <ChevronLeft/>
                                                </div>
                                                <div className={`swiper-button-next-${item._id} absolute right-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white p-2 hover:text-black cursor-pointer z-20 shadow-md`}>
                                                    <ChevronRight/>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 mx-3">
                                        <p className="text-sm md:text-base">
                                            {item.Product_Name.length > 30 
                                                ? item.Product_Name.substring(0, 30) + "..." 
                                                : item.Product_Name
                                            }
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {item.discounted_sale_price ? (
                                                <>
                                                    <p className="font-semibold">{formatPrice(item.discounted_sale_price)}</p>
                                                    <p className="text-sm text-gray-500 line-through">{formatPrice(item.sale_price)}</p>
                                                    <p className="text-sm text-green-600">({item.discount}% off)</p>
                                                </>
                                            ) : (
                                                <p className="font-semibold">{formatPrice(item.sale_price)}</p>
                                            )}
                                        </div>
                                        {item.sizes && item.sizes.length > 0 && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                Sizes: {item.sizes.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`fixed top-0 right-0 h-full w-68 bg-zinc-800 z-[100] text-white p-5 transition-transform duration-300 ${ isOpen ? "translate-x-0" : "translate-x-full"}`}>
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold mb-4">Filters</h2>
                            <X onClick={() => setIsOpen(!isOpen)} className="cursor-pointer"/>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Filter by Size</h3>
                            <div className="space-y-2">
                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <label key={size} className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span>{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Filter by Price</h3>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>Under ₹1000</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>₹1000 - ₹2000</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>₹2000 - ₹3000</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>Above ₹3000</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Filter by Category</h3>
                            <div className="space-y-2">
                                {uniqueSubcategories.map(category => (
                                    <label key={category} className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        <span>{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}