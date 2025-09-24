import { useCallback, useEffect, useState } from "react";
import apiurl from "../../services/apiendpoint/apiendpoint";
import { Link, useNavigate } from "react-router-dom";
import { apigetallproductsCustomers } from "../../services/apicustomerProducts/apicustomerproducts";

const toUrlFriendly = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let isMounted = true;

    const getProductCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apigetallproductsCustomers();
            if (res?.resdata) {
                const genderCategoryMap = {};
                
                res.resdata.forEach(product => {
                    const productType = product.Product_type;
                    const gender = product.gender;
                    
                    if (!productType || !gender) return;
                    
                    const key = `${productType}-${gender}`;
                    const firstVariant = product.variants?.find(v => v.status === 'Active') || product.variants?.[0];
                    const categoryImage = firstVariant?.variant_images?.[0] || null;
                    
                    if (!genderCategoryMap[key]) {
                        genderCategoryMap[key] = {
                            _id: `${toUrlFriendly(productType)}-${gender.toLowerCase()}`,
                            Category_Name: `${productType}/${gender}`,
                            Product_Type: productType,
                            Gender: gender,
                            redirect_link: `/collections/${toUrlFriendly(productType)}?gender=${gender.toLowerCase()}`,
                            image: categoryImage,
                            productCount: 1
                        };
                    } else {
                        genderCategoryMap[key].productCount += 1;
                        if (!genderCategoryMap[key].image && categoryImage) {
                            genderCategoryMap[key].image = categoryImage;
                        }
                    }
                });
                
                const categoriesArray = Object.values(genderCategoryMap).sort((a, b) => {
                    if (a.Product_Type !== b.Product_Type) {
                        return a.Product_Type.localeCompare(b.Product_Type);
                    }
                    if (a.Gender === 'Men' && b.Gender === 'Women') return -1;
                    if (a.Gender === 'Women' && b.Gender === 'Men') return 1;
                    return 0;
                });
                
                setCategories(categoriesArray);
            }
        } catch (error) {
            console.error("Error fetching product categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            getProductCategories();
        }
        return (() => isMounted = false);
    }, []);

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    const handleCategoryClick = (redirectLink, productType) => {
        sessionStorage.setItem('currentProductType', productType);
        navigate(redirectLink);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <section className="px-2 pt-5 lg:pt-7 azeret-mono">
                <div className="max-w-[95rem] mx-auto">
                    <h1 className="text-2xl lg:text-3xl azeret-mono">Categories</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-5 lg:pt-7">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 w-full h-48 rounded"></div>
                                <div className="bg-gray-200 h-4 mt-2 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="px-2 pt-5 lg:pt-7 azeret-mono">
                <div className="max-w-[95rem] mx-auto">
                    <h1 className="text-2xl lg:text-3xl azeret-mono">Categories</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-5 lg:pt-7">
                        {categories.map((item) => (
                            <Link key={item._id} to={item.redirect_link || "#"} onClick={() => {handleCategoryClick(item.redirect_link, item.Product_Type); scrollToTop();}}>
                                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                                    {item.image ? (
                                        <div className="relative">
                                            <img src={getImageUrl(item.image)} alt={item.Category_Name} className="w-full h-[50dvh] object-cover"/>
                                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                                {item.productCount} {item.productCount === 1 ? 'item' : 'items'}
                                            </div>
                                           
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">No Image</span>
                                        </div>
                                    )}
                                    <h2 className="mt-1 lg:mt-3 text-center font-semibold lg:text-xl">
                                        {item.Category_Name}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {categories.length === 0 && !loading && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No categories found</p>
                        </div>
                    )}
                    <hr className="mt-5 lg:mt-7" />
                </div>
            </section>
        </>
    );
}