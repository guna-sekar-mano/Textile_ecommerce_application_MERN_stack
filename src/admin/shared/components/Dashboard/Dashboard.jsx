import { useCallback, useEffect, useState } from "react"
import { Package, TrendingUp, ShoppingCart, Users } from "lucide-react"
import { apigetDashboardCardCount } from "../../services/apiDashboard/apiDashboard";


export default function Dashboard () {
    const [dashboardData, setDashboardData] = useState({
        productCount: 0,
        variantCount: 0,
        customerCount: 0,
        orderCount: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    const getProductsCountCard = useCallback(async()=>{
        try {
            setLoading(true);
            const res = await apigetDashboardCardCount();
            setDashboardData({
                productCount: res.productCount || 0,
                variantCount: res.variantCount || 0,
                customerCount: res.customerCount || 0,
                orderCount: res.orderCount || 0,
                totalRevenue: res.totalRevenue || 0
            });
        } catch (error) {
            console.log(`Error getting data` , error);
        } finally {
            setLoading(false);
        }
    },[])

    useEffect(()=>{
        getProductsCountCard();
    },[getProductsCountCard])

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }

    const formatIndianCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-4 max-w-full mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        {getCurrentGreeting()} Admin !
                    </h1>
                    <p className="text-gray-600 text-lg">Welcome back to your admin dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-3 ">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-800">
                            {loading ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                dashboardData?.variantCount?.toLocaleString() || 0
                            )}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Product variants available</p>
                    </div>

                    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-3 ">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Revenue</h3>
                        <p className="text-3xl font-bold text-gray-800">
                              {loading ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                formatIndianCurrency(dashboardData.totalRevenue)
                            )}
                        </p>
                        <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                    </div>

                    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-3 ">
                                <ShoppingCart className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Orders</h3>
                        <p className="text-3xl font-bold text-gray-800"> 
                            {loading ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                dashboardData.orderCount.toLocaleString()
                            )}</p>
                        <p className="text-xs text-gray-500 mt-2">Pending: 23</p>
                    </div>

                    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 p-3 ">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Customers</h3>
                        <p className="text-3xl font-bold text-gray-800">
                             {loading ? (<span className="animate-pulse">...</span>
                            ) : (
                                dashboardData.customerCount.toLocaleString()
                            )}
                        </p>
                        <p className="text-xs text-orange-600 mt-2">↑ 8% growth</p>
                    </div>
                </div>
            </div>
        </div>
    )
}