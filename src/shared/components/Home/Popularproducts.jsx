import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apigetPopularProducts } from '../../services/apicustomerProducts/apicustomerproducts';
import apiurl from '../../services/apiendpoint/apiendpoint';
import { Link } from 'react-router-dom';

export default function Popularproducts () {

    const isMountedRef = useRef(true);
    const [data, setData] = useState({ products: [], totallength: 0 });


    const getAllPopularProductsData = useCallback(async () => {
        try {
            const res = await apigetPopularProducts();
            
            const apiData = res?.resdata || [];
            setData({ products: apiData, totallength: res?.totallength || apiData.length });
        } catch (error) {
            console.error('Error fetching data:', error);
            setData({ products: [], totallength: 0 });
            // toast.error("Failed to fetch products data");
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


    return (
        <>
        <section className="px-4 py-10">
            <div className="max-w-[95rem] mx-auto">
                <h1 className="text-2xl azeret-mono">Popular Products</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-8">
                    <div className="col-span-4 ">
                        <div className='relative sticky top-20'>
                            <img src="/images/popular-products/3.jpg" alt="" className="lg:h-[80dvh] w-full object-cover object-center" />
                            <div className='absolute bottom-0 left-0 w-full p-4 azeret-mono'>
                                <p className="text-sm font-semibold  bg-white/55 w-fit px-1 py-1">ESSENTIAL COLLECTION NEW DROP</p>
                                <div className='flex gap-3 mt-3 font-semibold text-gray-600 text-sm'>
                                    <p className='bg-white p-1'>TRACKS</p>
                                    <p className='bg-white p-1'>T-SHIRTS</p>
                                    <p className='bg-white p-1'>SHORTS</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            { data?.products.map((item) => (
                                <div className="group" key={item.id}>
                                    <div className="relative">
                                        <Link to={`/products-view/${item._id}`} state={{ product: item }} onClick={scrollToTop}>
                                            <Swiper 
                                                navigation={{
                                                    nextEl: `.swiper-button-next-${item._id}`,
                                                    prevEl: `.swiper-button-prev-${item._id}`,
                                                }} modules={[Navigation]} className="mySwiper relative" loop={true} >
                                                    {item.Images?.map((img, index) => (
                                                        <SwiperSlide key={index}><img src={getImageUrl(img)} alt="" className="w-full h-auto" /></SwiperSlide>
                                                    ))}
                                            </Swiper>
                                        </Link>
                                        
                                        <div className="absolute top-2 left-2 bg-white/60 p-1 z-10">
                                            <p className="text-sm flex justify-center items-center">{item.tags}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 bg-white p-1 z-10">
                                            <i className="fi fi-rr-heart flex justify-center items-center"></i>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100">
                                            <div className={`swiper-button-prev-${item._id} absolute left-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black p-2 cursor-pointer z-20 shadow-md`}>
                                                <ChevronLeft/>
                                            </div>
                                            <div className={`swiper-button-next-${item._id} absolute right-2 lg:w-32 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white p-2 hover:text-black cursor-pointer z-20 shadow-md`}>
                                                <ChevronRight/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-1">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {item.Product_Name}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-lg font-semibold text-gray-900">
                                        ₹{item.discounted_sale_price || item.sale_price}
                                    </span>
                                    {item.discounted_sale_price && item.discount && parseInt(item.discount) > 0 && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">₹{item.sale_price}</span>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5">{item.discount}% OFF</span>
                                        </>
                                    )}
                                </div>
                            </div>
                                </div>
                            )) }
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}