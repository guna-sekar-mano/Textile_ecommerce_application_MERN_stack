// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../../services/store/useAuth";
// import useCartStore from "../../services/store/usecart";
// import { useCallback, useEffect, useState } from "react";
// import { apideleteShippingAddress, apigetshippingDetails, apiSaveShipping, apiupdateShippingAddress } from "../../services/apishipping/apishipping";
// import { getcartItems } from "../../services/apicart/apicart";
// import apiurl from "../../services/apiendpoint/apiendpoint";
// import toast from "react-hot-toast";
// import { useOrderHandlers } from "./Paymentfunctions";
// import { getuserdetails } from "../../services/token/token";
// import { checkFirstTimeUserCoupon } from "../../services/apiorder/apiorder";
// import { getAllcustomerCoupon } from "../../../admin/shared/services/apiCoupons/apicoupons";
// import { Dialog } from 'primereact/dialog';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import Addshipping from "./AddShipping";
// import { X } from "lucide-react";

// export default function Checkout () {

//     const [shippingDetails, setShippingDetails] = useState([]);
//     const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
//     const [checked, setChecked] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const { userdetails } = useAuth();
//     const { cart, setCartItems, clearCart } = useCartStore();
//     const navigate = useNavigate();
//     const { createOrder } = useOrderHandlers(cart, userdetails, clearCart, setCartItems, navigate);
//     const safeCart = Array.isArray(cart) ? cart : [];
//     const [couponCode, setCouponCode] = useState('');
//     const [appliedCoupon, setAppliedCoupon] = useState(null);
//     const [couponError, setCouponError] = useState('');
//     const [couponSuccess, setCouponSuccess] = useState('');
//     const [availableCoupons, setAvailableCoupons] = useState([]);
//     const [couponDiscount, setCouponDiscount] = useState(0);
//     const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);
//     const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//     const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
//     const [formData, setFormData] = useState({});
//     const [visible, setVisible] = useState(false);
//     const [loading, setLoading] = useState(false);


//     let isMounted = true;

//     const getallCustomerCoupons = useCallback(async ()=>{
//         try {
//             const res = await getAllcustomerCoupon({});
//             // console.log('Fetched coupons:', res);
//             if (res?.resdata) {
//                 setAvailableCoupons(res.resdata);
//             } else if (res?.coupons) {
//                 setAvailableCoupons(res.coupons);
//             }
//         } catch (error) {
//             console.error('Error fetching coupons:', error);
//         }
//     },[]);

//     const checkFirstTimeUser = useCallback(async () => {
//         try {
//             const { Email } = getuserdetails() || {};
//             if (!Email) return;
            
//             const response = await checkFirstTimeUserCoupon();
//             if (response?.success) {
//                 setIsFirstTimeUser(response.isFirstTimeUser);
//             } else {
//                 setIsFirstTimeUser(false);
//             }
//         } catch (error) {
//             console.error('Error checking first-time user:', error);
//             setIsFirstTimeUser(false);
//         }
//     }, []);

//     useEffect(()=>{
//         if(isMounted){
//             getallCustomerCoupons();
//             checkFirstTimeUser();
//         }
//         return(()=>isMounted = false);
//     },[]);

//     const getSubtotalAmount = () => {
//         return subTotal;
//     };

//     const validateCoupon = (coupon, subtotal, userEmail) => {
    
//         const currentDate = new Date();
//         const validFrom = new Date(coupon.Valid_From);
//         const validTo = new Date(coupon.Valid_To);

//         if (coupon.Status !== 'Active') {
//             return { isValid: false, message: 'Coupon is not active' };
//         }

//         if (currentDate < validFrom || currentDate > validTo) {
//             return { isValid: false, message: 'Coupon has expired or not yet valid' };
//         }

//         // Check total usage limit using the new Current_Usage_Count field
//         const totalUsageCount = coupon.Current_Usage_Count || 0;
//         if (totalUsageCount >= coupon.Total_Usage_Limit) {
//             return { isValid: false, message: 'Coupon usage limit has been reached' };
//         }

//         if (coupon.Coupon_Type === 'Private') {
            
//             if (!coupon.Customer || !Array.isArray(coupon.Customer)) {
//                 return { isValid: false, message: 'This coupon is not available for your account' };
//             }
            
//             const isEligible = coupon.Customer.includes(userEmail);
//             if (!isEligible) {
//                 return { isValid: false, message: 'This coupon is not available for your account' };
//             }
//         }

//         if (coupon.Target_Users === 'First_Time_Users') {
//             if (isFirstTimeUser === null) {
//                 return { isValid: false, message: 'Checking user eligibility...' };
//             }
//             if (!isFirstTimeUser) {
//                 return { isValid: false, message: 'This coupon is only available for first-time users' };
//             }
//         }

//         if (subtotal < coupon.Minimum_Amount) {
//             return { 
//                 isValid: false, 
//                 message: `Minimum order amount of ${coupon.Minimum_Amount} required` 
//             };
//         }

//         return { isValid: true, message: '' };
//     };

//     const calculateDiscount = (coupon, subtotal) => {
//         if (coupon.Discount_Type === 'Flat_Discount') {
//             return coupon.Flat_Discount || 0;
//         } else if (coupon.Discount_Type === 'Flat_Percentage') {
//             const percentage = coupon.Flat_Percentage || 0;
//             return (subtotal * percentage) / 100;
//         }
//         return 0;
//     };

//     const handleApplyCoupon = () => {
//         setCouponError('');
//         setCouponSuccess('');

//         if (!couponCode.trim()) {
//             setCouponError('Please enter a coupon code');
//             return;
//         }

//         const coupon = availableCoupons.find(
//             c => c.Coupon_Code && c.Coupon_Code.toUpperCase() === couponCode.toUpperCase()
//         );

//         if (!coupon) {
//             setCouponError('Invalid coupon code');
//             return;
//         }

//         const subtotal = getSubtotalAmount();
        
//         const { Email } = getuserdetails() || {};
        
//         if (!Email) {
//             setCouponError('Please login to apply coupon');
//             return;
//         }
        
//         const validation = validateCoupon(coupon, subtotal, Email);

//         if (!validation.isValid) {
//             setCouponError(validation.message);
//             return;
//         }

//         const discount = calculateDiscount(coupon, subtotal);
        
//         setAppliedCoupon(coupon);
//         setCouponDiscount(discount);
//         let successMessage = `Coupon applied! You saved ${curr?.symbol.split(" - ")[0]} ${discount.toFixed(2)}`;

//         if (coupon.Apply_Shipping_Discount === 'Yes') {
//             if (coupon.Shipping_Discount_Type === 'Free_Shipping') {
//                 successMessage += ' + Free Shipping';
//             } else if (coupon.Shipping_Discount_Type === 'Flat_Amount') {
//                 successMessage += ` + ₹${coupon.Shipping_Discount_Amount} off shipping`;
//             } else if (coupon.Shipping_Discount_Type === 'Percentage') {
//                 successMessage += ` + ${coupon.Shipping_Discount_Percentage}% off shipping`;
//             }
//         }

//         setCouponSuccess(successMessage);
//         setCouponCode('');
//     };

//     const handleRemoveCoupon = () => {
//         setAppliedCoupon(null);
//         setCouponDiscount(0);
//         setCouponError('');
//         setCouponSuccess('');
//         setCouponCode('');
//     };

//     const calculateFinalTotal = () => {
//         const subtotal = getSubtotalAmount();
//         const shipping = getShippingCost(); 
//         const total = subtotal + shipping - couponDiscount;
//         return Math.max(0, total).toFixed(2);
//     };

//     const getShippingCost = () => {
//         const subtotal = getSubtotalAmount();
//         let baseShipping = subtotal >= 5000 ? 0 : 100;
        
//         if (!appliedCoupon || appliedCoupon.Apply_Shipping_Discount !== 'Yes') {
//             return baseShipping;
//         }
        
//         if (baseShipping === 0) {
//             return 0;
//         }
        
//         if (appliedCoupon.Shipping_Discount_Type === 'Free_Shipping') {
//             return 0;
//         } else if (appliedCoupon.Shipping_Discount_Type === 'Flat_Amount') {
//             const discountAmount = appliedCoupon.Shipping_Discount_Amount || 0;
//             return Math.max(0, baseShipping - discountAmount);
//         } else if (appliedCoupon.Shipping_Discount_Type === 'Percentage') {
//             const percentage = appliedCoupon.Shipping_Discount_Percentage || 0;
//             const discountAmount = (baseShipping * percentage) / 100;
//             return Math.max(0, baseShipping - discountAmount);
//         }
        
//         return baseShipping;
//     };

//     const fetchShippingDetails = useCallback(async () => {
//         try {
//             const res = await apigetshippingDetails({ Email: userdetails?.Email });
//             setShippingDetails(res.resdata);
//         } catch (err) {
//             console.log('Error fetching shipping details:', err);
//         }
//     }, [userdetails?.Email]);

//     const fetchCartItems = useCallback(async () => {
//         try {
//             const response = await getcartItems(userdetails?.Email);
//             if (response?.response && JSON.stringify(cart) !== JSON.stringify(response.response)) {
//                 setCartItems(response.response);
//             }
//         } catch (error) {
//             console.log('Error fetching cart items:', error);
//         }
//     }, [userdetails?.Email]);

//     useEffect(() => {
//         if(isMounted && userdetails?.Email) {
//             fetchShippingDetails();
//             fetchCartItems();
//         }
//         return (() => isMounted = false);
//     }, [userdetails?.Email]);

//     const getProductDetails = (item) => {
//         let productData = null;
//         let name = "Unknown Product";
//         let image = null;

//         if (item.variantId) {
//             if (item.variant_name || item.variant_images) {
//                 productData = item;
//                 name = item.variant_name;
//                 image = item.variant_images?.[0];
//             } 
//             else if (item.variantData) {
//                 productData = item.variantData;
//                 name = item.variantData.variant_name;
//                 image = item.variantData.variant_images?.[0];
//             } 
//             else if (item.productId?.variants) {
//                 const variant = item.productId.variants.find(v => v._id === item.variantId);
//                 if (variant) {
//                     productData = variant;
//                     name = variant.variant_name;
//                     image = variant.variant_images?.[0];
//                 }
//             }
//         } 
//         else if (item.productId) {
//             productData = item.productId;
//             name = item.productId.Product_Name;
//             image = item.productId.Images?.[0];
//         } 
//         else if (item.Product_Name || item.variant_name) {
//             productData = item;
//             name = item.Product_Name || item.variant_name;
//             image = item.Images?.[0] || item.variant_images?.[0];
//         }

//         if (!productData) {
//             return { name, image, price: 0, discountedPrice: null };
//         }

//         const selectedSizeData = productData.sizes?.find(sizeObj => sizeObj.size === item.selectedSize);
        
//         let price = 0;
//         let discountedPrice = null;
        
//         if (selectedSizeData) {
//             price = Number(selectedSizeData.price) || 0;
//             discountedPrice = selectedSizeData.sale_price && 
//                             selectedSizeData.sale_price !== "0" && 
//                             selectedSizeData.sale_price !== "" ? 
//                             Number(selectedSizeData.sale_price) : null;
//         } else {
//             price = Number(productData.sale_price) || Number(productData.price) || 0;
//             discountedPrice = productData.discounted_sale_price ? 
//                             Number(productData.discounted_sale_price) : null;
//         }
        
//         return { name, image, price, discountedPrice };
//     };

//     const calculateTotals = () => {
//         let totalQuantity = 0;
//         let subTotal = 0;

//         safeCart.forEach(item => {
//             const quantity = Number(item?.Quantity) || 0;
//             totalQuantity += quantity;

//             const productDetails = getProductDetails(item);
//             const itemPrice = productDetails.discountedPrice || productDetails.price;
//             subTotal += quantity * itemPrice;
//         });

//         return { totalQuantity, subTotal };
//     };

//     useEffect(() => {
//         if (shippingDetails.length > 0 && selectedAddressIndex >= shippingDetails.length) {
//             setSelectedAddressIndex(0); 
//         }
//     }, [shippingDetails, selectedAddressIndex]);

//     const { totalQuantity, subTotal } = calculateTotals();

//     const handlePlaceOrder = async () => {
//         if (selectedAddressIndex === '' || !shippingDetails[selectedAddressIndex]) {
//             toast.error('Please choose an address before placing the order.');
//             return;
//         }

//         if (safeCart.length === 0) {
//             toast.error('Your cart is empty.');
//             return;
//         }

//         setShowLoadingOverlay(true);
        
//         setTimeout(() => {
//             setShowLoadingOverlay(false);
//             setShowPaymentDialog(true);
//         }, 1500);
//     };

//     const handlePaymentMethodSelect = async (paymentMethod) => {
//         setShowPaymentDialog(false);
        
//         if (paymentMethod === 'online') {
//             toast.error('Online payment is currently unavailable. Please select Cash on Delivery.');
//             return;
//         }

//         setShowLoadingOverlay(true);
//         setIsLoading(true);
        
//         try {
//             const finalTotal = parseFloat(calculateFinalTotal());
//             const shippingCost = getShippingCost();
//             await createOrder(
//                 shippingDetails[selectedAddressIndex], 
//                 finalTotal,
//                 appliedCoupon,
//                 couponDiscount,
//                 shippingCost
//             );
            
//             toast.success('Order placed successfully!');
            
//             setTimeout(() => {
//                 setShowLoadingOverlay(false);
//                 navigate('/thank-you');
//             }, 5000);
//         } catch (error) {
//             console.error('Order creation error:', error);
//             setShowLoadingOverlay(false);
//             toast.error('Failed to place order. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const openform = () => {
//         setFormData({});
//         setVisible(true);
//     };

//     const handlechange = (e) => e.target.files ? setFormData({ ...formData, [e.target.name]: e.target.files[0] }) : setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const response = await apiSaveShipping(formData);
//             if (response.message === "Address successfully saved") {
//                 toast.success(response.message);
//                 setFormData({});
//                 setVisible(false);
    
//                 const updatedDetails = await apigetshippingDetails({ Email: userdetails?.Email });
//                 setShippingDetails(updatedDetails.resdata);
    
//                 setSelectedAddressIndex(updatedDetails.resdata.length - 1);
//             } else {
//                 toast.error("Failed to save the address");
//             }
//         } catch (error) {
//             console.log("Error during saving:", error);
//             toast.error("Error saving the address");
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     useEffect(() => {
//         if (shippingDetails.length > 0 && selectedAddressIndex >= shippingDetails.length) {
//             setSelectedAddressIndex(0); 
//         }
//     }, [shippingDetails, selectedAddressIndex]);
    

//     const editform = (data) => {
//         setFormData({});
//         setFormData(data);
//         setVisible(true);
//     }

//     const handleupdate = async (e) => {
//         try {
//             e.preventDefault();
//             const { _id, ...Othersdata } = formData;
//             const res = await apiupdateShippingAddress({ _id, Othersdata });
//             if (res.message === 'Address updated successfully') {
//                 toast.success(res.message);
//                 fetchShippingDetails();
//                 setVisible(false);
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             console.error("Update error:", error);
//             toast.error("Failed to update user.");
//         }
//     };

//     const confirm2 = (_id) => {
//         confirmDialog({
//             message: 'Do you want to delete this record?',
//             header: 'Delete Confirmation',
//             icon: 'pi pi-info-circle',
//             defaultFocus: 'reject',
//             acceptClassName: 'p-button-danger bg-red-500 ml-2 text-white py-2 px-3',
//             rejectClassName: 'ml-2  py-2 px-3',
//             accept: () => { handledelete(_id) }
//         });
//     };

//     const handledelete = async (_id) => {
//         try {
//             const res = await apideleteShippingAddress(_id);
//             if (res.message === 'Address deleted successfully') {
//                 toast.success(res.message);
//                 await fetchShippingDetails(); 
    
//                 if (shippingDetails.length > 1) {
//                     setSelectedAddressIndex(0);
//                 } else {
//                     setSelectedAddressIndex(-1);
//                 }
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             console.log('Error deleting address:', error);
//             toast.error('Failed to delete address.');
//         }
//     };

//     return (
//         <>
//             <section className="py-10">
//                 <div className="max-w-[85rem] mx-auto px-4">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//                     <div>
//                         <h3 className="barlow-condensed text-2xl">Shipping Details</h3>
//                         <div className="flex justify-between">
//                             <p className="azeret-mono mt-4">DELIVERY</p>
//                             <button 
//                                 className="azeret-mono mt-4 bg-black text-white text-xs px-3 py-2 cursor-pointer hover:bg-gray-800" 
//                                 onClick={openform}
//                             >
//                                 Add New Address
//                             </button>
//                         </div>

//                         {shippingDetails.length > 0 ? (
//                             <div className="mt-4 space-y-4">
//                                 {shippingDetails.map((address, index) => (
//                                     <div 
//                                         key={address._id} 
//                                         className={`border-2 p-4 cursor-pointer transition-all ${
//                                             selectedAddressIndex === index 
//                                                 ? 'border-black bg-gray-50' 
//                                                 : 'border-gray-300 hover:border-gray-400'
//                                         }`}
//                                         onClick={() => setSelectedAddressIndex(index)}
//                                     >
//                                         <div className="flex items-start gap-3">
//                                             <div className="mt-1">
//                                                 <input
//                                                     type="radio"
//                                                     name="shippingAddress"
//                                                     checked={selectedAddressIndex === index}
//                                                     onChange={() => setSelectedAddressIndex(index)}
//                                                     className="w-4 h-4 cursor-pointer"
//                                                 />
//                                             </div>

//                                             <div className="flex-1">
//                                                 <div className="flex justify-between items-start">
//                                                     <div>
//                                                         <p className="font-semibold azeret-mono">
//                                                             {address.First_Name} {address.Last_Name}
//                                                         </p>
//                                                         <p className="text-xs text-gray-600 mt-1">
//                                                             {address.Address_Type}
//                                                         </p>
//                                                     </div>
                                                    
//                                                     <div className="flex gap-2">
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 editform(address);
//                                                             }}
//                                                             className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
//                                                         >
//                                                             Edit
//                                                         </button>
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 confirm2(address._id);
//                                                             }}
//                                                             className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
//                                                         >
//                                                             Delete
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-2 text-sm space-y-1">
//                                                     <p>{address.Address}</p>
//                                                     <p>
//                                                         {address.City}, {address.State} - {address.Zipcode}
//                                                     </p>
//                                                     <p className="font-medium">Mobile: {address.Mobilenumber}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-10 border-2 border-dashed border-gray-300 mt-4">
//                                 <p className="text-gray-500 mb-4">No shipping addresses found</p>
//                                 <button 
//                                     className="azeret-mono bg-black text-white text-sm px-4 py-2 cursor-pointer hover:bg-gray-800" 
//                                     onClick={openform}
//                                 >
//                                     Add Your First Address
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                         <div>
//                             <div  className="bg-[#D9D9D9] lg:px-10 px-2 py-5 ">
//                                 <div className="">
//                                     <h3 className="azeret-mono font-semibold">Summary</h3>
//                                 </div>
//                             {safeCart.map((item, index) => {
//                                 const productDetails = getProductDetails(item);
//                                 const itemPrice = productDetails.discountedPrice || productDetails.price;
//                                 const itemTotal = (Number(item?.Quantity) || 0) * itemPrice;
//                                 return (
//                                     <div className="mt-3  bg-white rounded-lg" key={item._id || index}>
//                                         <div className=" p-4 flex justify-between">
//                                             <div className="flex justify-center items-center gap-6">
//                                                 <div className="relative"> 
//                                                     <div className="relative"> 
//                                                         <img src={productDetails.image ? `${apiurl()}/${productDetails.image}` : '/images/default-product.png'} alt="" className="w-20 h-20 object-cover" /> 
//                                                     </div> 
//                                                     <p className="absolute -top-2 -right-2 text-xs z-30 rounded-full bg-black h-5 w-5 flex justify-center items-center text-white">{item.Quantity}</p> 
//                                                 </div>
//                                                 <div>
//                                                     <p>{productDetails.name}</p>
//                                                     <span className="text-xs">SIZE:  {item.selectedSize}</span>
//                                                     {item.variantId && <p className="text-gray-500 text-xs">Variant</p>}
//                                                 </div>
//                                             </div>
//                                             <div className="flex justify-center items-center">
//                                                 <div>
//                                                     {productDetails.discountedPrice ? (
//                                                             <div>
//                                                                 <span className="line-through text-gray-500 text-sm">₹{productDetails.price}</span>
//                                                                 <br />
//                                                                 <span>₹{productDetails.discountedPrice}</span>
//                                                             </div>
//                                                         ) : (
//                                                             <span>₹{productDetails.price}</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     );
//                                 })}
//                                 <div className="mt-5">
//                                     {!appliedCoupon ? (
//                                         <div className="space-y-2">
//                                             <div className="flex items-center gap-2">
//                                                 <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code"
//                                                     className="w-full px-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black azeret-mono"
//                                                 />
//                                                 <button onClick={handleApplyCoupon} 
//                                                     className="px-4 py-2 text-sm font-medium text-white transition-colors bg-black hover:bg-gray-800 azeret-mono whitespace-nowrap"
//                                                 >
//                                                     Apply
//                                                 </button>
//                                             </div>
                                            
//                                             {couponError && (
//                                                 <p className="text-sm text-red-500 azeret-mono">{couponError}</p>
//                                             )}
                                            
//                                             {couponSuccess && (
//                                                 <p className="text-sm text-green-500 azeret-mono">{couponSuccess}</p>
//                                             )}
//                                         </div>
//                                     ) : (
//                                         <div className="p-3 border border-green-200   bg-green-50">
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-green-800 azeret-mono">
//                                                         {appliedCoupon.Coupon_Code}
//                                                     </p>
//                                                     <p className="text-xs text-green-600 azeret-mono">
//                                                         You saved ₹{couponDiscount.toFixed(2)}
//                                                     </p>
//                                                 </div>
//                                                 <button onClick={handleRemoveCoupon} className="text-red-500 cursor-pointer transition-colors hover:text-red-700" aria-label="Remove coupon">
//                                                    <X/>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="py-6 space-y-3">
//                                     <div className="flex justify-between azeret-mono">
//                                         <p className="text-xs font-medium text-gray-600 uppercase">Sub Total : ({totalQuantity}) items</p>
//                                         <span className="text-sm">₹{subTotal.toFixed(2)}</span>
//                                     </div>
                                    
//                                     {appliedCoupon && couponDiscount > 0 && (
//                                         <div className="flex justify-between azeret-mono">
//                                             <p className="text-xs font-medium text-green-600 uppercase">Coupon Discount</p>
//                                             <span className="text-sm text-green-600">- ₹{couponDiscount.toFixed(2)}</span>
//                                         </div>
//                                     )}
                                    
//                                 <div className="flex justify-between azeret-mono">
//                                     <p className="text-xs font-medium text-gray-600 uppercase">Shipping</p>
//                                     <span className="text-sm">
//                                         {getShippingCost() === 0 ? (
//                                             <span className="text-green-600">FREE</span>
//                                         ) : appliedCoupon?.Apply_Shipping_Discount === 'Yes' ? (
//                                             <div className="text-right">
//                                                 <div className="line-through text-gray-400 text-xs">₹100</div>
//                                                 <div className="text-green-600">₹{getShippingCost()}</div>
//                                             </div>
//                                         ) : (
//                                             `₹${getShippingCost()}`
//                                         )}
//                                     </span>
//                                 </div>

//                                     {subTotal < 5000 && (
//                                         <div className="p-2 text-xs text-center bg-yellow-50 text-yellow-800 border border-yellow-200">
//                                             Add ₹{(5000 - subTotal).toFixed(2)} more to get FREE shipping!
//                                         </div>
//                                     )}
                                    
//                                     <div className="pt-3 mt-3 border-t border-gray-300">
//                                         <div className="flex items-center justify-between azeret-mono">
//                                             <div>
//                                                 <div className="text-xl font-bold">TOTAL:</div>
//                                                 <div className="text-xs text-gray-500">(including GST)</div>
//                                             </div>
//                                             <p className="text-xl font-bold">₹{calculateFinalTotal()}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="">
//                                 <button className={`w-full mt-5 text-white p-2 cursor-pointer ${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}`}
//                                     onClick={handlePlaceOrder} disabled={isLoading} >
//                                         {isLoading ? 'Placing Order...' : 'Place Order'}
//                                 </button>
//                             </div>
//                             <hr className="mt-8" />
//                             <div className="flex justify-between mt-5 manrope">
//                                 <Link className="underline">Refund policy</Link>
//                                 <Link className="underline">Shipping</Link>
//                                 <Link className="underline">Privacy policy</Link>
//                                 <Link className="underline">Terms of service</Link>
//                                 <Link className="underline">Contact</Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//                 <Dialog header="Select Payment Method" visible={showPaymentDialog} style={{ width: '90vw', maxWidth: '450px' }} onHide={() => setShowPaymentDialog(false)}modal>
//                     <div className="space-y-4">
//                         <button
//                             className="w-full p-4 text-left transition-colors border-2 border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                             onClick={() => handlePaymentMethodSelect('online')}
//                             disabled
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-semibold azeret-mono">Online Payment</p>
//                                     <p className="text-sm text-gray-500">Pay using UPI, Cards, Net Banking</p>
//                                 </div>
//                                 <span className="text-xs text-red-500">(Unavailable)</span>
//                             </div>
//                         </button>

//                         <button
//                             className="w-full p-4 text-left transition-colors border-2 border-gray-300 cursor-pointer hover:border-black hover:bg-gray-50"
//                             onClick={() => handlePaymentMethodSelect('cod')}
//                         >
//                             <div>
//                                 <p className="font-semibold azeret-mono">Cash on Delivery</p>
//                                 <p className="text-sm text-gray-500">Pay when you receive the product</p>
//                             </div>
//                         </button>
//                     </div>
//                 </Dialog>

//                 {showLoadingOverlay && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55">
//                         <div className="p-8 bg-white rounded-lg shadow-xl">
//                             <div className="flex flex-col items-center gap-4">
//                                 <svg className="w-16 h-16 text-black animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 <p className="text-lg font-semibold azeret-mono">Placing your order...</p>
//                                 <p className="text-sm text-gray-500">Please wait</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <Addshipping openform={openform} visible={visible} setVisible={setVisible} loading={loading} formData={formData}
//                 handleSave={handleSave} handlechange={handlechange} handleupdate={handleupdate} />
//                 <ConfirmDialog />
//         </>
//     )
// }