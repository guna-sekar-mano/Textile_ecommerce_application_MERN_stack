import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiSaveNewsletter } from "../shared/services/apinewsletter/apinewsletter";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

export default function Footer () {

    const [newsletterEmail, setNewsletterEmail] = useState({});
    const [instagramPosts, setInstagramPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const INSTAGRAM_TOKEN = 'EAAKB6IGCVvQBP6HcFxXOchXheXOAcDdo3CCYb2pzc7GZAgnXQw4v4lPyWNJAZC0RAkRTfxpi9t1D3LuTalZBO7BbbaulJoBQvEevLMLALaZAhPnZApUA6ZCZAnCbWS23vw8ceUWDXEMjoXcZBeSJ5BOOXRJZCmPQS4pSErAsmGVkGATDVrmxZCOS9bNJ8bBFyMmZCvB';
    const INSTAGRAM_USER_ID = 'sergio_kalai';

    useEffect(() => {
        fetchInstagramPosts();
    }, []);

    const fetchInstagramPosts = async () => {
        try {
            const response = await fetch(
                `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_TOKEN}&limit=2`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch Instagram posts');
            }

            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                setInstagramPosts(data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Instagram posts:', error);
            setLoading(false);
            setInstagramPosts([
                { id: '1', media_url: '/images/popular-products/1.png', permalink: '' },
                { id: '2', media_url: '/images/popular-products/2.png', permalink: '' }
            ]);
        }
    };


    const handleChange = (e) =>{
        setNewsletterEmail({...newsletterEmail, [e.target.name] : e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiSaveNewsletter(newsletterEmail);
             if(res.message === "Newsletter successfully saved"){
                Swal.fire({ title: "Thank you for subscribing to our newsletter!", icon: "success", draggable: true,});
                setNewsletterEmail("");
            } else if (res.message === "This email is already subscribed to our newsletter") {
                Swal.fire({ title: "This email is already subscribed! Try another email", icon: "info", draggable: true,});
            } else {
                toast("Something went wrong. Please try again.");
            }
           
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <footer className="bg-black">
                <div className="max-w-[95rem] mx-auto py-5 px-5 lg:px-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-white">
                        <div>
                            <p className="text-5xl md:text-7xl leading-20 barlow-condensed">Become Part of <br /> The Extreme Culture</p>
                            <div className="mt-10">
                                <form onSubmit={handleSubmit}>
                                    <div className="lg:flex gap-5 lg:space-y-0 space-y-2">
                                        <div>
                                            <input type="email" name="Newsletter_email" onChange={handleChange} value={newsletterEmail.Newsletter_email} className="p-2 bg-white azeret-mono text-center placeholder:text-black text-black" placeholder="Enter your E-mail" required/>
                                        </div>
                                        <div>
                                            <button type="submit" className="bg-gray-600 px-4 py-2 cursor-pointer azeret-mono">
                                                JOIN OUR NEWSLETTER
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="border-t lg:border-t-0 lg:border-l-5  border-white flex lg:justify-end justify-center lg:items-end items-center">
                            <div className="lg:mt-0 mt-5">
                                <div className="text-center">
                                    <h1 className="lg:text-4xl text-2xl azeret-mono">Our Social Post</h1>
                                </div>
                                   <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mt-8">
                                    {loading ? (
                                        <>
                                            <div className="lg:h-[350px] w-full bg-gray-800 animate-pulse"></div>
                                            <div className="lg:h-[350px] w-full bg-gray-800 animate-pulse"></div>
                                        </>
                                    ) : (
                                        instagramPosts.slice(0, 2).map((post, index) => (
                                            <div key={post.id || index}>
                                                {post.permalink ? (
                                                    <a 
                                                        href={post.permalink} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="block"
                                                    >
                                                        <img 
                                                            src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} 
                                                            alt={post.caption ? post.caption.substring(0, 50) : "Instagram post"} 
                                                            className="lg:h-[350px] w-full object-cover hover:opacity-80 transition-opacity" 
                                                        />
                                                    </a>
                                                ) : (
                                                    <img 
                                                        src={post.media_url} 
                                                        alt="" 
                                                        className="lg:h-[350px] w-full object-cover" 
                                                    />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-white mt-10 text-white border-r-0 border-l-0">
                    <div className="lg:flex justify-center items-center gap-10 lg:text-xl p-3 tracking-wider azeret-mono text-center lg:space-y-0 space-y-3">
                        <p>5+ Years of Experience</p>
                        <p>600+ Happy Customers</p>
                        <p>300+ Premium Collections</p>
                    </div>
                </div>

                <div className="max-w-[80rem] mx-auto py-10 text-white lg:px-2 px-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 lg:space-y-0 space-y-5">
                            <div className="text-start">
                                <p className="font-semibold text-lg barlow-condensed">SHOP NOW</p>
                                <ul className="mt-3 lg:mt-5 flex flex-col gap-2 lg:gap-3 text-gray-400">
                                    <Link to={""}><li className="hover:text-white">Men</li></Link>
                                    <Link to={""}><li className="hover:text-white">Tracks</li></Link>
                                    <Link to={""}><li className="hover:text-white">T-Shirt</li></Link>
                                    <Link to={""}><li className="hover:text-white">Shorts</li></Link>
                                </ul>
                            </div>
                             <div className="text-start">
                                <p className="font-semibold text-lg barlow-condensed">SUPPORT</p>
                                <ul className="mt-3 lg:mt-5 flex flex-col gap-2 lg:gap-3 text-gray-400">
                                    <Link to={"/track-order"}><li className="hover:text-white">Track My order</li></Link>
                                    <Link to={"/frequently-asked-questions"}><li className="hover:text-white">FAQs</li></Link>
                                    <Link to={"/contact-us"}><li className="hover:text-white">Contact Us</li></Link>
                                </ul>
                            </div>
                             <div className="text-start">
                                <p className="font-semibold text-lg barlow-condensed">SOCIAL</p>
                                <ul className="mt-3 lg:mt-5 flex flex-col gap-2 lg:gap-3 text-gray-400">
                                    <Link to={""}><li className="hover:text-white">Instagram</li></Link>
                                    <Link to={""}><li className="hover:text-white">Youtube</li></Link>
                                    <Link to={""}><li className="hover:text-white"> X</li></Link>
                                    <Link to={""}><li className="hover:text-white">Facebook</li></Link>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-center items-center lg:mt-0 mt-5">
                            <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 azeret-mono">
                                <Link to={"/terms-and-conditions"}><p className="">Terms & Condition</p></Link>
                                <Link to={"/privacy-policy"}><p className="">Privacy Policy</p></Link>
                                <Link to={""}><p className="">Cookies Policy</p></Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-white  text-white border-r-0 border-l-0">
                    <div className="flex justify-center items-center gap-10 lg:text-lg text-sm text-center p-3 tracking-wider azeret-mono">
                        <p>Copyright ©2025 All rights reserved. Developed by <span><Link to={"https://www.arrowthought.com"} target="_blank" className="text-[#0A4F90]">Arrow Thought</Link></span></p>
                    </div>
                </div>

                <div className="py-6">
                    <h1 className="text-[#A1A1A1] tracking-wider text-center text-2xl md:text-4xl lg:text-9xl font-handelgothic">EXTREME CULTURE</h1>
                </div>
            </footer>
        </>
    )
}