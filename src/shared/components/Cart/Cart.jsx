import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import useCartStore from "../../services/store/usecart";
import { useCallback, useEffect } from "react";
import { getallcart, handleDecreaseQuantity, handleIncreaseQuantity, handleRemoveItem } from "./Cartfunctions";
import useAuth from "../../services/store/useAuth";
import { Link, useNavigate } from "react-router-dom";
import apiurl from "../../services/apiendpoint/apiendpoint";


export default function Cart() {
    const { userdetails } = useAuth();
    const navigate = useNavigate();
    let isMounted = true;

    const { cart, setCartItems, removeFromCart, clearCart } = useCartStore();
    const safeCart = Array.isArray(cart) ? cart : [];

    const getAllCartItems = useCallback(() => {
        getallcart(userdetails, cart, setCartItems);
    }, [cart, userdetails?.Email]);

    useEffect(() => {
        if (isMounted) {
            getAllCartItems();
        }
        return () => (isMounted = false);
    }, [cart]);

    const getProductDetails = (item) => {
        let productData = null;
        let name = "Unknown Product";
        let image = null;

        if (item.variantId) {
            if (item.variant_name || item.variant_images) {
                productData = item;
                name = item.variant_name;
                image = item.variant_images?.[0];
            } else if (item.variantData) {
                productData = item.variantData;
                name = item.variantData.variant_name;
                image = item.variantData.variant_images?.[0];
            } else if (item.productId?.variants) {
                const variant = item.productId.variants.find(v => v._id === item.variantId);
                if (variant) {
                    productData = variant;
                    name = variant.variant_name;
                    image = variant.variant_images?.[0];
                }
            }
        } else if (item.productId) {
            productData = item.productId;
            name = item.productId.Product_Name;
            image = item.productId.Images?.[0];
        } else if (item.Product_Name || item.variant_name) {
            productData = item;
            name = item.Product_Name || item.variant_name;
            image = item.Images?.[0] || item.variant_images?.[0];
        }

        if (!productData) {
            return { name, image, price: 0, discountedPrice: null };
        }

        const selectedSizeData = productData.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);

        let price = 0;
        let discountedPrice = null;

        if (selectedSizeData) {
            price = Number(selectedSizeData.price) || 0;
            discountedPrice = selectedSizeData.sale_price &&
                selectedSizeData.sale_price !== "0" &&
                selectedSizeData.sale_price !== "" ?
                Number(selectedSizeData.sale_price) : null;
        } else {
            price = Number(productData.sale_price) || Number(productData.price) || 0;
            discountedPrice = productData.discounted_sale_price ?
                Number(productData.discounted_sale_price) : null;
        }

        return { name, image, price, discountedPrice };
    };

    // const calculateTotals = () => {
    //     let totalQuantity = 0;
    //     let subTotal = 0;

    //     safeCart.forEach(item => {
    //         const quantity = Number(item?.Quantity) || 0;
    //         totalQuantity += quantity;

    //         const productDetails = getProductDetails(item);
    //         const itemPrice = productDetails.discountedPrice || productDetails.price;
    //         subTotal += quantity * itemPrice;
    //     });

    //     console.log(safeCart)

    //     return { totalQuantity, subTotal };
    // };

    const calculateTotals = () => {
        const { totalQuantity, subTotal } = safeCart.reduce((acc, item) => {
            const quantity = Number(item?.Quantity) || 0;
            const productDetails = getProductDetails(item);
            const itemPrice = productDetails.discountedPrice || productDetails.price;

            return {
                totalQuantity: acc.totalQuantity + quantity,
                subTotal: acc.subTotal + quantity * itemPrice,
            } },
            { totalQuantity: 0, subTotal: 0 }
        );
        return { totalQuantity, subTotal };
    };

    const { totalQuantity, subTotal } = calculateTotals();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const productView = (product) => {
        navigate('/products/type/product', {
            state: {
                productId: product?.productId?._id,
                // product: product
            }
        });
    };


    return (
        <>
            <section className="py-10">
                <div className="max-w-[95rem] mx-auto px-3">
                    <div className="mb-5">
                        <h1 className="barlow-condensed text-2xl">CART VIEW</h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
                        <div className="col-span-8">
                            <div className="space-y-4">
                                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-200 p-5">
                                    <div className="col-span-5 font-semibold">PRODUCT</div>
                                    <div className="col-span-2 font-semibold">PRICE</div>
                                    <div className="col-span-3 font-semibold">QUANTITY</div>
                                    <div className="col-span-2 font-semibold">TOTAL</div>
                                </div>

                                {safeCart.length > 0 ? (
                                    <>
                                        {safeCart.map((item, index) => {
                                            const productDetails = getProductDetails(item);
                                            const itemPrice = productDetails.discountedPrice || productDetails.price;
                                            const itemTotal = (Number(item?.Quantity) || 0) * itemPrice;

                                            return (
                                                <div key={index}>
                                                    <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 p-5 items-center">
                                                        <div className="col-span-5">
                                                            <div className="flex items-center gap-3">
                                                                <img onClick={() => { productView(item) }} src={productDetails.image ? `${apiurl()}/${productDetails.image}` : '/images/default-product.png'} alt={productDetails.name}
                                                                    className="h-20 w-20 object-cover object-center" />
                                                                <div>
                                                                    <p className="font-medium">{productDetails.name}</p>
                                                                    <p className="text-gray-500 text-sm">Size: {item.selectedSize}</p>
                                                                    {item.variantId && <p className="text-gray-500 text-xs">Variant</p>}
                                                                </div>
                                                                {/* {item.productId ? (
                                                                    <Link to={`/products/${toUrlFriendly(item.productId.Product_type)}/${toUrlFriendly(item.productId.Product_Name)}`} state={{ product: item.productId, productId: item.productId._id }} onClick={scrollToTop}>
                                                                        <img src={productDetails.image ? `${apiurl()}/${productDetails.image}` : '/images/default-product.png'} alt={productDetails.name} 
                                                                            className="h-20 w-20 object-cover object-center" />
                                                                    </Link>
                                                                ) : (
                                                                    <img src={productDetails.image ? `${apiurl()}/${productDetails.image}` : '/images/default-product.png'} alt={productDetails.name} 
                                                                        className="h-20 w-20 object-cover object-center" />
                                                                )} */}
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2 font-semibold">
                                                            {productDetails.discountedPrice ? (
                                                                <div>
                                                                    <span className="line-through text-gray-500 text-sm">₹{productDetails.price}</span>
                                                                    <br />
                                                                    <span>₹{productDetails.discountedPrice}</span>
                                                                </div>
                                                            ) : (
                                                                <span>₹{productDetails.price}</span>
                                                            )}
                                                        </div>
                                                        <div className="col-span-3">
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    className="w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                                                                    onClick={() => handleDecreaseQuantity(index, safeCart, userdetails, setCartItems)}
                                                                    disabled={item.Quantity <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="font-medium">{item.Quantity}</span>
                                                                <button 
                                                                    className="w-8 h-8 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center" 
                                                                    onClick={() => handleIncreaseQuantity(index, safeCart, userdetails, setCartItems,item)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 font-semibold">₹{itemTotal}</div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <button className="text-gray-500 hover:text-red-500 cursor-pointer" onClick={() => handleRemoveItem(item._id, removeFromCart)}>
                                                                <X />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="md:hidden bg-gray-100 p-4 rounded-lg">
                                                        <div className="flex gap-3">
                                                            <div className="flex-shrink-0">
                                                                <img onClick={() => { productView(item) }} src={productDetails.image ? `${apiurl()}/${productDetails.image}` : '/images/default-product.png'}
                                                                    alt={productDetails.name} className="h-20 w-20 object-cover object-center rounded" />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1 min-w-0 pr-2">
                                                                        <h3 className="font-medium text-sm leading-tight truncate">{productDetails.name}</h3>
                                                                        <p className="text-gray-500 text-xs mt-1">Size: {item.selectedSize}</p>
                                                                        {item.variantId && <p className="text-gray-500 text-xs">Variant</p>}
                                                                    </div>
                                                                    <button
                                                                        className="text-gray-500 hover:text-red-500 cursor-pointer flex-shrink-0"
                                                                        onClick={() => handleRemoveItem(item._id, removeFromCart)}
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>

                                                                <div className="mt-2">
                                                                    {productDetails.discountedPrice ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="line-through text-gray-500 text-sm">₹{productDetails.price}</span>
                                                                            <span className="font-semibold text-sm">₹{productDetails.discountedPrice}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="font-semibold text-sm">₹{productDetails.price}</span>
                                                                    )}
                                                                </div>

                                                                <div className="flex justify-between items-center mt-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-600">Qty:</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-sm"
                                                                                onClick={() => handleDecreaseQuantity(index, safeCart, userdetails, setCartItems)}
                                                                                disabled={item.Quantity <= 1}
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <span className="font-medium text-sm w-8 text-center">{item.Quantity}</span>
                                                                            <button
                                                                                className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-sm"
                                                                                onClick={() => handleIncreaseQuantity(index, safeCart, userdetails, setCartItems)}
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-xs text-gray-600">Total:</span>
                                                                        <div className="font-semibold text-sm">₹{itemTotal}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className="p-4 text-center">
                                        <img src="/images/No_Product_Found.png" alt="" className="mx-auto max-w-xs" />
                                        <h1 className="text-xl font-semibold text-center text-[#292764] mt-4">No Product found in your Cart.</h1>
                                        <Link to="/">
                                            <button className="p-2 mt-5 text-lg text-white cursor-pointer tracking-widest barlow-condensed bg-black">Continue Shopping</button>
                                        </Link>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" className="w-full bg-gray-200 p-2 azeret-mono text-center text-sm" placeholder="Gift card or Discount coupon" />
                                    <button className="azeret-mono w-full px-4 py-2 border-2 hover:bg-black hover:text-white hover:transition-all duration-300 cursor-pointer text-sm">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 lg:mt-0 mt-6 sticky top-20 self-start">
                            <div className="bg-gray-200 p-4">
                                <p className="mb-1 font-semibold">CART SUMMARY</p>
                                <hr />
                                <div className="flex justify-between mt-4">
                                    <p className="text-sm">Items ({totalQuantity})</p>
                                    <h3 className="font-semibold">₹{subTotal}</h3>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-sm">Discount</p>
                                    <h3>₹0</h3>
                                </div>
                                <hr className="mt-4" />
                                <div className="flex justify-between mt-3">
                                    <p className="font-semibold">You Pay</p>
                                    <h3 className="font-semibold text-lg">₹{subTotal}</h3>
                                </div>

                                <div className="mt-4 azeret-mono">
                                    <Link to={"/checkout"}
                                        className="block tracking-widest p-3 text-center bg-black w-full text-white cursor-pointer hover:bg-white hover:text-black hover:transition-all duration-300 text-sm font-medium"
                                    >
                                        CHECKOUT SECURELY
                                    </Link>
                                </div>

                                <div className="mt-5 relative">
                                    <hr className="" />
                                    <Swiper
                                        navigation={{
                                            nextEl: `.swiper-button-next`,
                                            prevEl: `.swiper-button-prev`,
                                        }}
                                        autoplay={true}
                                        modules={[Navigation, Autoplay]}
                                        loop={true}
                                        className="mySwiper relative"
                                    >
                                        <SwiperSlide>
                                            <div className="text-center mt-4">
                                                <h1 className="azeret-mono text-sm">5+ Years of Experience</h1>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="text-center mt-4">
                                                <h1 className="azeret-mono text-sm">Free Shipping Above ₹999</h1>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="text-center mt-4">
                                                <h1 className="azeret-mono text-sm">Easy Returns & Exchanges</h1>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>

                                    <div className="hidden sm:block">
                                        <div className="swiper-button-prev absolute left-2 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black p-2 cursor-pointer z-20 shadow-md">
                                            <ChevronLeft size={16} />
                                        </div>
                                        <div className="swiper-button-next absolute right-2 bottom-0 transform flex justify-center items-center -translate-y-1/2 bg-black text-white hover:bg-white p-2 hover:text-black cursor-pointer z-20 shadow-md">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                    <hr className="mt-3" />
                                </div>

                                <div className="mt-2">
                                    <p className="text-center text-xs text-gray-600">Shipping amount has been not included</p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <Link
                                    to={"/"}
                                    className="azeret-mono text-center w-full border-2 p-3 hover:bg-black hover:text-white hover:transition-all duration-300 cursor-pointer block text-sm font-medium"
                                >
                                    CONTINUE SHOPPING
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}