import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getOrderdetails } from "../../../services/apiorder/apiorder";
import useAuth from "../../../services/store/useAuth";
import apiurl from "../../../services/apiendpoint/apiendpoint";

export default function Myorders() {
    const [orderData, setOrderData] = useState({ orders: [], orderDetails: [] });
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const { userdetails } = useAuth();

    let isMounted = true;

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getOrderdetails({ Email: userdetails?.Email });
            setOrderData(res || { orders: [], orderDetails: [] });
        } catch (err) {
            console.error("Error fetching order details:", err);
            setOrderData({ orders: [], orderDetails: [] });
        } finally {
            setLoading(false);
        }
    }, [userdetails?.Email]);

    useEffect(() => {
        if (isMounted) {
            fetchOrderDetails();
        }
        return () => (isMounted = false);
    }, [fetchOrderDetails]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Order Placed':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getProductImage = (item) => {
        if (item.variantId && item.variant_images && item.variant_images.length > 0) {
            return `${apiurl()}/${item.variant_images[0]}`;
        }
        else if (item.productId && item.Images && item.Images.length > 0) {
            return `${apiurl()}/${item.Images[0]}`;
        }
        return null;
    };

    const getProductPrice = (item) => {
        const salePrice = item.sale_price ? parseInt(item.sale_price) : null;
        const regularPrice = parseInt(item.price);
        
        return {
            salePrice: salePrice,
            regularPrice: regularPrice,
            displayPrice: salePrice || regularPrice
        };
    };

    if (loading) {
        return (
            <section className="relative top-0">
                <h1 className="barlow-condensed text-2xl font-bold">My Orders</h1>
                <hr className="mt-5" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-500">Loading your orders...</div>
                </div>
            </section>
        );
    }

    if (!orderData.orders || orderData.orders.length === 0) {
        return (
            <section className="relative top-0">
                <h1 className="barlow-condensed text-2xl font-bold">My Orders</h1>
                <hr className="mt-5" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-500">No orders found</div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative top-0">
            <h1 className="barlow-condensed text-2xl">My Orders</h1>
            <hr className="mt-5" />
            
            <div className="mt-6 space-y-4">
                {orderData.orders.map((order) => {
                    const orderItems = orderData.orderDetails.filter(item => item.Order_id === order.Order_id);
                    const isExpanded = expandedOrders.has(order.Order_id);
                    
                    return (
                        <div key={order._id} className="bg-white border border-gray-200 shadow overflow-hidden">
                            <div 
                                className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => toggleOrderExpansion(order.Order_id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Order #{order.Order_id}</h3>
                                            <p className="text-sm text-gray-600">Placed on {formatDate(order.Order_Date)}</p>
                                        </div>
                                        <div className="mt-2 lg:mt-0">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium ${getStatusBadgeColor(order.Order_Status)}`}>
                                                {order.Order_Status}
                                            </span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium ml-2 ${getPaymentStatusColor(order.Payment_Status)}`}>
                                                {order.Payment_Status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">₹{order.Total_Amount.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">{orderItems.length} item{orderItems.length > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`transition-all duration-300 ease-in-out ${ isExpanded ? 'max-h-full opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="divide-y divide-gray-200">
                                    {orderItems.map((item) => {
                                        const productImage = getProductImage(item);
                                        const priceInfo = getProductPrice(item);
                                        
                                        return (
                                            <div key={item._id} className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                                                    <div className="flex-shrink-0 mb-4 md:mb-0">
                                                        {productImage ? (
                                                            <img src={productImage}  alt={item.Product_Name} className="w-20 h-20 object-cover border border-gray-200 rounded"/>
                                                        ) : (
                                                            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                                                                <span className="text-gray-400 text-xs">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 mb-1">{item.Product_Name}</h4>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <p>Type: {item.Product_type}</p>
                                                            <p>Size: {item.selectedSize}</p>
                                                            {item.tags && <p>Tags: {item.tags}</p>}
                                                            {item.variantId && <p>Variant: {item.variant_name}</p>}
                                                            {item.Category && <p>Category: {item.Category}</p>}
                                                            {item.Subcategory && <p>Subcategory: {item.Subcategory}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 md:mt-0 md:text-right">
                                                        <div className="flex flex-col space-y-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Price: </span>
                                                                <span className="font-medium">
                                                                    ₹{priceInfo.displayPrice.toLocaleString()}
                                                                    {priceInfo.salePrice && priceInfo.salePrice < priceInfo.regularPrice && (
                                                                        <span className="text-sm text-gray-400 line-through ml-2">
                                                                            ₹{priceInfo.regularPrice.toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Qty: </span>
                                                                <span className="font-medium">{item.Quantity}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Total: </span>
                                                                <span className="font-semibold text-lg">
                                                                    ₹{(priceInfo.displayPrice * item.Quantity).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-2">Delivery Address</h5>
                                            <div className="text-sm text-gray-600">
                                                <p className="font-medium">{order.Billing_Name}</p>
                                                <p>{order.Delivery_Address}</p>
                                                <p>{order.City}, {order.State} - {order.Zipcode}</p>
                                                <p>{order.Country}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                                            <div className="text-sm text-gray-600">
                                                <p>Email: {order.Email}</p>
                                                <p>Mobile: {order.Mobilenumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}