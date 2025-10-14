import { Link } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

export default function OrderThankyou() {
    return (
        <section className=" bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-black opacity-5 rounded-full -translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-black opacity-5 rounded-full translate-x-20 translate-y-20"></div>
                    
                    <div className="relative mb-6 inline-block">
                        <div className="bg-black rounded-full p-6 inline-block">
                            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">Order Placed!</h1>
                    
                    <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-md mx-auto">
                        Thank you for your purchase. Your order has been successfully placed and is being processed.
                    </p>
                    
                    <div className="flex items-center justify-center mb-8 gap-2">
                        <div className="h-px w-16 bg-gray-300"></div>
                        <Package className="w-5 h-5 text-gray-400" />
                        <div className="h-px w-16 bg-gray-300"></div>
                    </div>
                    
                    {/* <div className="bg-gray-50 border-2 border-black rounded-xl p-6 mb-8">
                        <p className="text-gray-700 text-sm md:text-base">
                            A confirmation email has been sent to your inbox with your order details and tracking information.
                        </p>
                    </div> */}
                    
                    <Link to="/my-orders">
                        <button className="bg-black text-white px-8 py-4 cursor-pointer font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl w-full md:w-auto">
                            View My Orders
                        </button>
                    </Link>
                    
                    <div className="mt-6">
                        <Link to="/" className="text-gray-600 hover:text-black transition-colors duration-200 text-sm underline">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}