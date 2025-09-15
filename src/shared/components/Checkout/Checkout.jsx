import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../services/store/useAuth";
import { usePaymentHandlers } from "./Paymentfunctions";
import useCartStore from "../../services/store/usecart";
import { useCallback, useEffect, useState } from "react";
import { apigetshippingDetails } from "../../services/apishipping/apishipping";
import { getcartItems } from "../../services/apicart/apicart";
import apiurl from "../../services/apiendpoint/apiendpoint";

export default function Checkout () {

    const [shippingDetails, setShippingDetails] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [checked, setChecked] = useState(false);
    const { userdetails } = useAuth();
    const { cart, setCartItems,clearCart } = useCartStore();
    const navigate = useNavigate();
    const { initializePayment } = usePaymentHandlers(cart, userdetails, clearCart, setCartItems, navigate);
    const safeCart = Array.isArray(cart) ? cart : [];

    let isMounted = true;

    const fetchShippingDetails = useCallback(async () => {
        try {
            const res = await apigetshippingDetails({ Email: userdetails?.Email });
            setShippingDetails(res.resdata);
        } catch (err) {
            console.log('Error fetching shipping details:', err);
        }
    }, [userdetails?.Email]);

    const fetchCartItems = useCallback(async () => {
        try {
            const response = await getcartItems(userdetails?.Email);
            if (JSON.stringify(cart) !== JSON.stringify(response.response)) {
                setCartItems(response.response);
            }
        } catch (error) {
            console.log('Error fetching cart items:', error);
        }
    }, [userdetails?.Email, cart, setCartItems]);

    useEffect(() => {
        if(isMounted) {
        fetchShippingDetails();
        fetchCartItems();
        }
        return (() => isMounted = false);
    }, [fetchShippingDetails, fetchCartItems]);

    const getProductDetails = (item) => {
        if (item.productId) {
            return {
                name: item.productId.Product_Name,
                image: item.productId.Images?.[0],
                price: Number(item.productId.sale_price) || 0,
                discountedPrice: item.productId.discounted_sale_price ? Number(item.productId.discounted_sale_price) : null
            };
        } else if (item.variantId && safeCart.length > 0) {
            const mainProduct = safeCart.find(cartItem => 
                cartItem.productId?.variants?.some(variant => variant._id === item.variantId)
            );
            
            if (mainProduct) {
                const variant = mainProduct.productId.variants.find(v => v._id === item.variantId);
                if (variant) {
                    return {
                        name: variant.variant_name,
                        image: variant.variant_images?.[0],
                        price: Number(variant.sale_price) || 0,
                        discountedPrice: variant.discounted_sale_price ? Number(variant.discounted_sale_price) : null
                    };
                }
            }
        }
        
        return { name: "Unknown Product", image: null, price: 0, discountedPrice: null };
    };

    const calculateTotals = () => {
        let totalQuantity = 0;
        let subTotal = 0;

        safeCart.forEach(item => {
            const quantity = Number(item?.Quantity) || 0;
            totalQuantity += quantity;

            const productDetails = getProductDetails(item);
            const itemPrice = productDetails.discountedPrice || productDetails.price;
            subTotal += quantity * itemPrice;
        });

        return { totalQuantity, subTotal };
    };

    useEffect(() => {
        if (shippingDetails.length > 0 && selectedAddressIndex >= shippingDetails.length) {
            setSelectedAddressIndex(0); 
        }
    }, [shippingDetails, selectedAddressIndex]);

    const { totalQuantity, subTotal } = calculateTotals();

    return (
        <>
         <section className="py-10">
            <div className="max-w-[85rem] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <h3 className="barlow-condensed text-2xl">Shipping Details</h3>
                        <div className="flex justify-between">
                            <p className="azeret-mono mt-4">DELIVERY</p>
                            {!checked && (<button className="azeret-mono mt-4 bg-black text-white text-xs px-1 py-1 cursor-pointer">Add Billing Address</button>)}
                        </div>
                        {shippingDetails.length > 0 ? (
                        <div className="grid grid-cols-1 mt-2 space-y-2">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                <input type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.First_Name} className="w-full border border-gray-400 p-2" placeholder="First Name" />
                                <input type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.Last_Name} className="w-full border border-gray-400 p-2" placeholder="Last Name" />
                            </div>
                            <div>
                                <textarea type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.Address} className="w-full border border-gray-400 p-2" placeholder="Address" />
                            </div>
                            {/* <div>
                                <input type="text" name="" id="" className="w-full border border-gray-400 p-2" placeholder="Apartment, house etc (Optional)" />
                            </div> */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                <input type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.City} className="w-full border border-gray-400 p-2" placeholder="City" />
                                <input type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.State} className="w-full border border-gray-400 p-2" placeholder="State" />
                                <input type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.Zipcode} className="w-full border border-gray-400 p-2" placeholder="Zipcode" />
                            </div>
                            <div>
                                <input type="text" name="" id="" value={shippingDetails[selectedAddressIndex]?.Mobilenumber} className="w-full border border-gray-400 p-2" placeholder="Phone" />
                            </div>
                        </div>
                        ) : (
                            <p className="text-center py-5">Loading shipping details...</p>
                        )}
                        <div className="flex gap-3 mt-5">
                            <div className="checkbox-wrapper-30">
                            <span className="checkbox">
                                <input type="checkbox" />
                                <svg>
                                <use xlinkHref="#checkbox-30" className="checkbox"></use>
                                </svg>
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                <symbol id="checkbox-30" viewBox="0 0 22 22">
                                <path fill="none" stroke="currentColor" d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"/>
                                </symbol>
                            </svg>
                            </div>
                            <p>Save this Information for next time</p>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <div className="checkbox-wrapper-30">
                                <span className="checkbox">
                                    <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)}  />
                                    <svg>
                                    <use xlinkHref="#checkbox-30" className="checkbox"></use>
                                    </svg>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                                    <symbol id="checkbox-30" viewBox="0 0 22 22">
                                    <path fill="none" stroke="currentColor" d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"/>
                                    </symbol>
                                </svg>
                            </div>
                            <p>Use shipping address as billing address</p>
                        </div>
                    </div>
                    <div>
                       
                        <div  className="bg-[#D9D9D9] lg:px-10 px-2 py-5 ">
                            <div className="">
                                <h3 className="azeret-mono font-semibold">Summary</h3>
                            </div>
                        {safeCart.map((item, index) => {
                            const productDetails = getProductDetails(item);
                            const itemPrice = productDetails.discountedPrice || productDetails.price;
                            const itemTotal = (Number(item?.Quantity) || 0) * itemPrice;
                        return (
                            
                            <div className="mt-3  bg-white rounded-lg" key={item._id}>
                                <div className=" p-4 flex justify-between">
                                    <div className="flex justify-center items-center gap-6">
                                        <div className="relative"> 
                                            <div className="relative"> 
                                                <img src={productDetails.image ? `${apiurl()}/${productDetails.image}` : '/images/default-product.png'} alt="" className="w-20 h-20 object-cover" /> 
                                            </div> 
                                            <p className="absolute -top-2 -right-2 text-xs z-30 rounded-full bg-black h-5 w-5 flex justify-center items-center text-white">{item.Quantity}</p> 
                                        </div>
                                        <div>
                                            <p>{productDetails.name}</p>
                                            <span className="text-xs">SIZE:  {item.selectedSize}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <div>
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
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                            <div className="py-6 space-y-3">
                                <div className="flex justify-between">
                                    <p>Sub Total : ({totalQuantity}) items</p>
                                    <span>₹ {subTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <p>Shipping</p>
                                    <span>₹ 0</span>
                                </div>
                                <div className="flex justify-between">
                                    <p>Total</p>
                                    <span>₹ {subTotal}</span>
                                </div>
                            </div>
                        </div>

                     
                        <div className="">
                           <button className="bg-black w-full mt-5 text-white p-2 cursor-pointer">Pay Now</button>
                        </div>
                        <hr className="mt-8" />
                        <div className="flex justify-between mt-5 manrope">
                            <Link className="underline">Refund policy</Link>
                            <Link className="underline">Shipping</Link>
                            <Link className="underline">Privacy policy</Link>
                            <Link className="underline">Terms of service</Link>
                            <Link className="underline">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>
         </section>
        </>
    )
}