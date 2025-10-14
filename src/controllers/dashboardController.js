import { Order } from "../models/ordermodel.js";
import Products from "../models/productmodel.js";
import { Customer } from "../models/signupmodel.js";

export const dashboardCardCounts =async (req, res) => {

     try {
        const productCount = await Products.countDocuments();
        
        const products = await Products.find({}, { variants: 1 });
        const variantCount = products.reduce((total, product) => {return total + (product.variants ? product.variants.length : 0);}, 0);

        const customerCount = await Customer.countDocuments();

        const orderCount = await Order.countDocuments();

        const revenueResult = await Order.aggregate([{$match: {Payment_Status: "Paid"}},{$group: {_id: null,totalRevenue: { $sum: "$Total_Amount" }}}]);
        
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        
        res.send({ 
            productCount: productCount,
            variantCount: variantCount,
            customerCount: customerCount,
            orderCount: orderCount,
            totalRevenue: totalRevenue,
            message: "Product count retrieved successfully" 
        });
        
    } catch (err) {
        console.error("Get Products Count Error:", err);
        res.status(500).send({ error: "An error occurred while fetching product count",details: err.message });
    }
}