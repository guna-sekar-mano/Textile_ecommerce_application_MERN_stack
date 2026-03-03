import { useCallback, useEffect, useState } from "react";
import { getOrderdetails } from "../../../services/apiorder/apiorder";
import useAuth from "../../../services/store/useAuth";
import { CheckCircle, Circle, Package, Truck, Home } from "lucide-react";

export default function Trackorder() {
    const [orderData, setOrderData] = useState({ orders: [], orderDetails: [] });
    const [loading, setLoading] = useState(true);
    const [trackingOrderId, setTrackingOrderId] = useState("");
    const [trackingEmail, setTrackingEmail] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState("");
    const { userdetails } = useAuth();

    const orderStatuses = [
        { status: "Order Placed", label: "Order Placed", icon: Package },
        { status: "Order Confirmed", label: "Confirmed", icon: CheckCircle },
        { status: "Order Packed", label: "Packed", icon: Package },
        { status: "Order Shipped", label: "Shipped", icon: Truck },
        { status: "Out for Delivery", label: "Out for Delivery", icon: Truck },
        { status: "Order Delivered", label: "Delivered", icon: Home }
    ];

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
        let isMounted = true;
        if (isMounted) {
            fetchOrderDetails();
        }
        return () => { isMounted = false; };
    }, [fetchOrderDetails]);

    const handleTrackOrder = (e) => {
        e.preventDefault();
        setError("");
        setSelectedOrder(null);

        if (!trackingOrderId.trim() || !trackingEmail.trim()) {
            setError("Please enter both Order ID and Email");
            return;
        }

        const order = orderData.orders.find(
            (o) => o.Order_id === trackingOrderId && o.Email.toLowerCase() === trackingEmail.toLowerCase()
        );

        if (order) {
            setSelectedOrder(order);
        } else {
            setError("Order not found. Please check your Order ID and Email.");
        }
    };

    const getCurrentStatusIndex = (status) => {
        return orderStatuses.findIndex((s) => s.status === status);
    };

    const renderProgressBar = () => {
        if (!selectedOrder) return null;

        const currentIndex = getCurrentStatusIndex(selectedOrder.Order_Status);

        return (
            <div className="mt-8 bg-white border p-6">
                <h2 className="text-xl font-semibold mb-6">Order Status</h2>
                
                <div className="relative">
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(currentIndex / (orderStatuses.length - 1)) * 100}%` }}
                        />
                    </div>

                    <div className="relative flex justify-between">
                        {orderStatuses.map((statusObj, index) => {
                            const Icon = statusObj.icon;
                            const isCompleted = index <= currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                                <div key={statusObj.status} className="flex flex-col items-center" style={{ flex: 1 }}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isCompleted
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-400"
                                        } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <p
                                        className={`text-xs mt-2 text-center ${
                                            isCompleted ? "text-gray-900 font-medium" : "text-gray-400"
                                        }`}
                                    >
                                        {statusObj.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 border-t pt-6">
                    <h3 className="font-semibold mb-4">Order Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Order ID</p>
                            <p className="font-medium">{selectedOrder.Order_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Order Date</p>
                            <p className="font-medium">
                                {new Date(selectedOrder.Order_Date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Amount</p>
                            <p className="font-medium">₹{selectedOrder.Total_Amount}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Payment Status</p>
                            <p className="font-medium">{selectedOrder.Payment_Status}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500">Delivery Address</p>
                            <p className="font-medium">{selectedOrder.Delivery_Address}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="relative top-0">
            <h1 className="barlow-condensed text-2xl">Track my order</h1>
            <hr className="mt-5 text-gray-300" />

            <div className="max-w-[45rem] mt-10">
                <div className="border p-5 bg-white">
                    <p className="text-justify text-sm">
                        To Track your order please enter your order ID in the text box below and press
                        the "TRACK ORDER" button. This was given to you on your receipt and in the
                        confirmation email you should have received.
                    </p>
                    <div className="mt-5">
                        <div className="mb-4">
                            <label htmlFor="orderId" className="block text-sm font-medium mb-1">
                                Order ID *
                            </label>
                            <input type="text" id="orderId" value={trackingOrderId} onChange={(e) => setTrackingOrderId(e.target.value)} className="w-full p-2 border mt-1 rounded focus:outline-none focus:ring-2 focus:ring-black"/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Billing E-mail *
                            </label>
                            <input type="email" id="email" value={trackingEmail} onChange={(e) => setTrackingEmail(e.target.value)} className="w-full p-2 border mt-1 rounded focus:outline-none focus:ring-2 focus:ring-black"/>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <button type="button" onClick={handleTrackOrder} className="bg-black w-full p-2 text-white rounded hover:bg-gray-800 transition-colors" disabled={loading}>
                            {loading ? "Loading..." : "Track my order"}
                        </button>
                    </div>
                </div>

                {renderProgressBar()}
            </div>
        </section>
    );
}