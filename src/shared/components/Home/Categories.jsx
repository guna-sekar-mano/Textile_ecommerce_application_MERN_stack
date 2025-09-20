import { useCallback, useEffect, useState } from "react";
import apiurl from "../../services/apiendpoint/apiendpoint";
import { getallcustomercategory } from "../../services/apiCustomercategory/apicustomercategory";
import { useNavigate } from "react-router-dom";

export default function Categories () {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    let isMounted = true;

    const getallcustomercategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getallcustomercategory();
            if (res?.resdata) {
                setData(res.resdata);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            getallcustomercategories();
        }
        return (() => isMounted = false);
    }, []);

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    const handleCategoryClick = (redirectLink, categoryId) => {
        sessionStorage.setItem('currentCategoryId', categoryId);
        navigate(redirectLink);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
        <section className="px-2 pt-5 lg:pt-7 azeret-mono">
            <div className="max-w-[95rem] mx-auto">
                <h1 className="text-2xl lg:text-3xl azeret-mono">Categories</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-5 lg:pt-7">
                   {data.map((item) => (
                        <div key={item._id} className="cursor-pointer" onClick={() => {handleCategoryClick(item.redirect_link, item._id); scrollToTop()}}>
                            {item.Images?.map((img, index) => (
                                <div key={index}>
                                    <img src={getImageUrl(img)} alt={item.Category_Name} className="w-full h-auto"/>
                                </div>
                             ))}
                            <h2 className="mt-1 lg:mt-3 text-center font-semibold lg:text-xl">{item.Category_Name}</h2>
                        </div>
                    ))}
                </div>
                <hr className="mt-5 lg:mt-7" />
            </div>
        </section>
        </>
    )
}