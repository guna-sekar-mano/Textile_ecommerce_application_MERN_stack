import { Order, Ordermaster } from "../models/ordermodel.js";
import Products from "../models/productmodel.js";
import { uniqueorderid } from "../services/uniqueidService.js";

export const saveOrder = async (req, res) => {
  try {
    const { orderData, orderItems } = req.body;

    // if (!orderData || !orderItems) {
    //   return res.status(400).json({ error: 'Order data and order items are required' });
    // }

    // if (!Array.isArray(orderItems)) {
    //   return res.status(400).json({ error: 'Order items must be an array' });
    // }

    // const existingOrder = await Order.findOne({ Order_id: orderData.Order_id });
    
    // if (existingOrder) {
    //   return res.status(200).json({ message: "Order already exists", savedOrder: existingOrder});
    // }

    const Invoice_ID = await uniqueorderid();

    const orderDoc = new Order({
      Order_id: orderData.Order_id,
      Invoice_ID,
      Total_Amount: orderData.Total_Amount,
      Billing_Name: orderData.Billing_Name,
      Email: orderData.Email,
      Mobilenumber: orderData.Mobilenumber,
      Delivery_Address: orderData.Delivery_Address,
      City: orderData.City,
      State: orderData.State,
      Country: orderData.Country || 'India',
      Zipcode: orderData.Zipcode,
      Delivery_Address_id: orderData.Delivery_Address_id,
      Payment_Status: orderData.Payment_Status || "Not Paid",
      Order_Status: orderData.Order_Status || "Order Placed",
      Order_Date: new Date(),
      Payment_Id: null,
      Payment_Date: null,
      failed_reason: null
    });

    const savedOrder = await orderDoc.save();

    if (orderItems.length > 0) {
      console.log(orderItems)
      const orderMasterDocs = orderItems.map(item => ({
        Order_id: orderData.Order_id,
        Invoice_ID,
        First_Name: orderData.Billing_Name.split(' ')[0],
        productId: item.productId,
        variantId: item.variantId || null,
        Product_Name: item.Product_Name,
        variant_name: item.variant_name || null,
        Images: item.Images || [],
        variant_images: item.variant_images || null,
        price: item.price,
        sale_price: item.sale_price || null,
        selectedSize: item.selectedSize,
        Quantity: Number(item.Quantity),
        Category: item.Category,
        Subcategory: item.Subcategory,
        Product_type: item.Product_type,
        tags: item.tags
      }));
      
      var updateSotck = await Promise.all( orderMasterDocs.map(async (item) => {
        const { productId, variantId, selectedSize, Quantity } = item;
        console.log(productId, variantId, selectedSize, Quantity)


        // Update stock atomically in MongoDB
        await Products.updateOne(
          { _id: productId, "variants._id": variantId, "variants.sizes.size": selectedSize },
          { $inc: { "variants.$[v].sizes.$[s].Stock": - Quantity } },
          { arrayFilters: [ { "v._id": variantId }, { "s.size": selectedSize } ] }
        );
      }))

      // console.log(updateSotck)

      await Ordermaster.insertMany(orderMasterDocs);
    }

    res.json({ messsage: "Order saved successfully", savedOrder, success: true});

  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({ error: error.message, success: false});
  }
};

export const getorderdetails = async (req, res) => {
    try {
        const orders = await Order.find({ Email: req.user.Email });

        const orderIds = orders.map(order => order.Order_id);

        const orderDetails = await Ordermaster.find({ Order_id: { $in: orderIds } });

        res.send({ orders, orderDetails });
    } catch (err) {
        console.error("Error fetching Order details:", err);
        res.send({ message: "Error fetching Order details" });
    }
};

export const getallOrders = async (req, res, next) => {
  try {
    const { first, rows, globalfilter, colfilter } = req.query;

    const fieldArray = Object.keys(Order.schema.obj);
    const globalFilter = globalfilter ? { $or: fieldArray.filter((field1) => Order.schema.path(field1) instanceof mongoose.Schema.Types.String).map(field => ({ [field]: { $regex: globalfilter, $options: 'i' } })) } : {};
    const emailFilter = req.user.Role == 'Customer' ? {...globalFilter, Email: req.user.Email } : globalFilter;
    const filter = colfilter?{ ...colfilter, ...emailFilter }:emailFilter;
    const resdata = await Order.find(filter).sort({ createdAt: -1 }).skip(first).limit(rows);
    const totallength = await Order.countDocuments(filter);
    res.send({ resdata, totallength });
  } catch (err) {
    console.error(err);
  }
};

export const getfilteroptions= async (req, res, next) => {
  try {
    const { field } = req.body;
    console.log(req.body)
    const updatedData = await Order.distinct(field);
    res.send({[field]:updatedData});
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrder = async (req, res, next) => {
    try {
      const { _id } = req.query
      let previousVal = await Order.find({_id}).lean();
      let updateData = req.body.Order_Status != previousVal.Order_Status ?{...req.body,Order_Last_Update_Date: new Date(moment().format('YYYY-MM-DD'))}:req.body;
      const resdata = await Order.findOneAndUpdate({ _id }, updateData, { new: true });
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
}

export const getOrderitemsbyid = async (req, res, next) => {
    try {
      const { Order_id } = req.query
      const resdata = await Ordermaster.find({ Order_id })
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
}