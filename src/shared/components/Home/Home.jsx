import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoriesPage from '../../../components/Categoriespage';
import Homeproducts from './Homeproducts';
import HandtoHand from './HandToHand';
import Popularproducts from './Popularproducts';
import { useNavigate } from 'react-router-dom';
import { getallCustomerBanner } from '../../services/apiCustomerhomebanner/apicustHomebanner';
import apiurl from '../../services/apiendpoint/apiendpoint';

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % data.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [data.length, isAutoPlaying]);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % data.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + data.length) % data.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    let isMounted = true;

    const getallcustomerbanners = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getallCustomerBanner();
            if (res?.resdata) {
                setData(res.resdata);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            getallcustomerbanners();
        }
        return (() => isMounted = false);
    }, [getallcustomerbanners]);

    const getImageUrl = (imagePath) => {
        return `${apiurl()}/${imagePath}`;
    };

    const handleBannerClick = () => {
        const currentBanner = data[currentSlide];
        if (currentBanner) {            
            if (currentBanner.redirect_link && currentBanner.redirect_link.trim() !== '') {
                window.open(currentBanner.redirect_link, '_parent');
            } else if (currentBanner.ProductId && currentBanner.ProductId.length > 0) {
                const bannerNameSlug = currentBanner.Banner_Name
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                
                navigate(`/banner-products/${bannerNameSlug}?id=${currentBanner._id}`);
            }
        }
    };

    const getBannerImage = (item) => {
        if (isMobile && item.MobileImage) {
            return getImageUrl(item.MobileImage);
        } else if (item.DesktopImage) {
            return getImageUrl(item.DesktopImage);
        } else if (item.Images && item.Images.length > 0) {
            return getImageUrl(item.Images[0]);
        }
        return null;
    };

    return (
        <>
        <section className="relative w-full h-[92vh] overflow-hidden">
            <div className="relative w-full h-full">
                {data.map((item, index) => {
                    const imageUrl = getBannerImage(item);
                    
                    return (
                        <div key={item._id} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                            {imageUrl && (
                                <div className='w-full h-full cursor-pointer' onClick={handleBannerClick}>
                                    <img 
                                        src={imageUrl} 
                                        alt={`${item.Banner_Name} - Slide ${index + 1}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
                {data.map((_, index) => (
                    <button key={index} onClick={() => goToSlide(index)} className={`h-1 transition-all duration-300 cursor-pointer ${
                            index === currentSlide ? 'bg-white w-8 shadow-lg' : 'bg-white/50 w-6 hover:bg-white/70' }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-6 right-6 z-10 flex space-x-3">
                <button onClick={prevSlide} className="bg-white hover:bg-black hover:text-white cursor-pointer transition-all p-3 group" aria-label="Previous slide">
                    <ChevronLeft className="w-5 h-5 text-black group-hover:text-white " />
                </button>

                <button onClick={nextSlide} className="bg-white hover:bg-black hover:text-white cursor-pointer transition-all p-3 group" aria-label="Next slide">
                    <ChevronRight className="w-5 h-5 text-black group-hover:text-white" />
                </button>
            </div>
        </section>

        <CategoriesPage/>
        <Homeproducts/>
        <HandtoHand/>
        <Popularproducts/>
        </>
    );
}