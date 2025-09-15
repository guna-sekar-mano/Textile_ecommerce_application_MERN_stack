import { Link } from "react-router-dom";

export default function Footer () {

    return (
        <>
            <footer className="bg-black">
                <div className="max-w-[95rem] mx-auto py-5 px-5 lg:px-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-white">
                        <div>
                            <p className="text-7xl leading-20 barlow-condensed">Become Part of <br /> The Extreme Culture</p>
                            <div className="mt-10">
                                <form action="#">
                                    <div className="lg:flex gap-5 lg:space-y-0 space-y-2">
                                        <div>
                                            <input type="text" name="" id="" className="p-2 bg-white azeret-mono text-center placeholder:text-black text-black" placeholder="Enter your E-mail"/>
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
                                    <h1 className="text-4xl azeret-mono">Our Social Post</h1>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mt-8">
                                    <div>
                                        <img src="/images/popular-products/1.png" alt="" className="h-[40dvh] w-full object-cover" />
                                    </div>
                                    <div>
                                        <img src="/images/popular-products/2.png" alt="" className="h-[40dvh] w-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-white mt-10 text-white border-r-0 border-l-0">
                    <div className="lg:flex justify-center items-center gap-10 text-xl p-3 tracking-wider azeret-mono text-center lg:space-y-0 space-y-3">
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
                                <ul className="mt-5 space-y-5 text-gray-400 ">
                                    <Link to={""}><li className="hover:text-white">Men</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">Tracks</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">T-Shirt</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">Shorts</li></Link>
                                </ul>
                            </div>
                             <div className="text-start">
                                <p className="font-semibold text-lg barlow-condensed">SUPPORT</p>
                                <ul className="mt-5 space-y-5 text-gray-400">
                                    <Link to={""}><li className="hover:text-white">Track My order</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">FAQs</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">Contact Us</li></Link>
                                </ul>
                            </div>
                             <div className="text-start">
                                <p className="font-semibold text-lg barlow-condensed">SOCIAL</p>
                                <ul className="mt-5 space-y-5 text-gray-400">
                                    <Link to={""}><li className="hover:text-white">Instagram</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">Youtube</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3"> X</li></Link>
                                    <Link to={""}><li className="hover:text-white mt-3">Facebook</li></Link>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-center items-center lg:mt-0 mt-5">
                            <div className="lg:flex gap-6 azeret-mono">
                                <Link to={""}><p className="">Terms & Condition</p></Link>
                                <Link to={""}><p className="lg:mt-0 mt-5">Privacy Policy</p></Link>
                                <Link to={""}><p className="lg:mt-0 mt-5">Cookies Policy</p></Link>
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
                    <h1 className="text-[#A1A1A1] tracking-wider text-center text-4xl md:text-4xl lg:text-9xl font-handelgothic">EXTREME CULTURE</h1>
                </div>
            </footer>
        </>
    )
}