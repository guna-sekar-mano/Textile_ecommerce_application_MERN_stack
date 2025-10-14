import { useCallback, useEffect, useState } from "react";
import apiurl from "../../services/apiendpoint/apiendpoint";
import { Link, useNavigate } from "react-router-dom";
import { getallcustomercategory } from "../../services/apiCustomercategory/apicustomercategory";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let isMounted = true;

    const getCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getallcustomercategory();
            if (res?.resdata) {
                const activeCategories = res.resdata.filter(category => 
                    category.Status === 'Active'
                );
                setCategories(activeCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            getCategories();
        }
        return (() => isMounted = false);
    }, []);

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    const handleCategoryClick = (redirectLink, categoryName) => {
        sessionStorage.setItem('currentCategory', categoryName);
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
                            <Link key={item._id} to={item.redirect_link || "#"} 
                                onClick={() => {
                                    handleCategoryClick(item.redirect_link, item.Category_Name); 
                                    scrollToTop();
                                }}
                            >
                                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                                    {item.Images && item.Images.length > 0 ? (
                                        <div className="relative">
                                            <img src={getImageUrl(item.Images[0])} alt={item.Category_Name} className="w-full lg:h-[50dvh] h-[230px] md:h-[400px] object-cover"/>
                                        </div>
                                    ) : (
                                        <div className="w-full h-[50dvh] bg-gray-200 rounded-lg flex items-center justify-center">
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