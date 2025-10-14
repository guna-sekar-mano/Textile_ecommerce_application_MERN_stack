import mongoose from 'mongoose'
import { Coupon } from '../models/couponmodel.js'

export const saveCoupons = async (req, res, next) => {
  try {
    const resdata = await new Coupon(req.body).save()
    res.send(resdata)
  } catch (err) {
    console.error(err)
  }
}

export const getallCoupons = async (req, res, next) => {
  try {
    const { first, rows, globalfilter, ...othersdata } = req.query;
    const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }));
    const fieldArray = Object.keys(Coupon.schema.obj);
    const globalFilter = globalfilter ? {
      $or: fieldArray
        .filter(field => Coupon.schema.path(field) instanceof mongoose.Schema.Types.String)
        .map(field => ({ [field]: { $regex: globalfilter, $options: 'i' } }))
    } : {};
    const filter = { $and: [globalFilter, ...individualFilters] };
    const resdata = await Coupon.find(filter).skip(Number(first)).limit(Number(rows));
    const totallength = await Coupon.countDocuments(filter);
    res.send({ resdata, totallength });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getAllCustomerCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().select('-Used_By_Customers');
    
    const couponsWithUsage = await Promise.all(
      coupons.map(async (coupon) => {
        const couponWithUsage = await Coupon.findById(coupon._id);
        const usageCount = couponWithUsage.Used_By_Customers?.length || 0;
        
        return {...coupon.toObject(), Current_Usage_Count: usageCount };
      })
    );
    
    const totalCount = await Coupon.countDocuments();
    res.send({ coupons: couponsWithUsage, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const trackCouponUsage = async (req, res) => {
  try {
    const { couponId, userEmail, orderId } = req.body;
    
    if (!couponId || !userEmail || !orderId) {
      return res.status(400).json({ success: false, message: 'Coupon ID, user email, and order ID are required'});
    }

    const coupon = await Coupon.findById(couponId);
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found'});
    }

    const totalUsageCount = coupon.Used_By_Customers?.length || 0;
    if (totalUsageCount >= coupon.Total_Usage_Limit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        $push: {
          Used_By_Customers: {
            email: userEmail,
            used_date: new Date(),
            order_id: orderId
          }
        }
      },
      { new: true }
    );

    res.status(200).json({success: true, message: 'Coupon usage tracked successfully', data: updatedCoupon});

  } catch (error) {
    console.error('Error tracking coupon usage:', error);
    res.status(500).json({ success: false, message: 'Error tracking coupon usage'});
  }
};

export const validateCouponUsage = async (req, res) => {
  try {
    const { couponCode, userEmail, subtotal } = req.body;
    
    if (!couponCode || !userEmail) {
      return res.status(400).json({success: false,message: 'Coupon code and user email are required'});
    }

    const coupon = await Coupon.findOne({ Coupon_Code: couponCode.toUpperCase(),Status: 'Active'});
    
    if (!coupon) {
      return res.status(404).json({success: false,message: 'Invalid or inactive coupon code'});
    }


    const currentDate = new Date();
    const validFrom = new Date(coupon.Valid_From);
    const validTo = new Date(coupon.Valid_To);

    if (currentDate < validFrom || currentDate > validTo) {
      return res.status(400).json({success: false,message: 'Coupon has expired or not yet valid'});
    }

    const totalUsageCount = coupon.Used_By_Customers?.length || 0;
    if (totalUsageCount >= coupon.Total_Usage_Limit) {
      return res.status(400).json({success: false,message: 'Coupon usage limit has been reached'});
    }

    if (subtotal < coupon.Minimum_Amount) {
      return res.status(400).json({success: false, message: `Minimum order amount of ${coupon.Minimum_Amount} required`});
    }

    if (coupon.Coupon_Type === 'Private') {
      if (!coupon.Customer || !coupon.Customer.includes(userEmail)) {
        return res.status(400).json({success: false,message: 'This coupon is not available for your account'});
      }
    }

    let discount = 0;
    if (coupon.Discount_Type === 'Flat_Discount') {
      discount = coupon.Flat_Discount || 0;
    } else if (coupon.Discount_Type === 'Flat_Percentage') {
      const percentage = coupon.Flat_Percentage || 0;
      discount = (subtotal * percentage) / 100;
    }

    res.status(200).json({success: true,message: 'Coupon is valid',
      data: {
        coupon: coupon,
        discount: discount,
        remaining_uses: coupon.Total_Usage_Limit - totalUsageCount
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({success: false,message: 'Error validating coupon'});
  }
};

export const updateCoupondata = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body, updatedAt: new Date() };

        if (updateData.Discount_Type) {
            if (updateData.Discount_Type === 'Flat_Discount') {
                updateData.Flat_Percentage = null;
            } else if (updateData.Discount_Type === 'Flat_Percentage') {
                updateData.Flat_Discount = null;
            }
        }

        if (updateData.Coupon_Type) {
            if (updateData.Coupon_Type === 'Public') {
                updateData.Customer = [];
            } else if (updateData.Coupon_Type === 'Private') {
                updateData.Target_Users = null;
            }
        }

        const updatedCoupons = await Coupon.findByIdAndUpdate(id,updateData,{ new: true, runValidators: true });

        if (!updatedCoupons) {
            return res.status(404).json({success: false,message: 'Coupon not found'});
        }

        res.status(200).json({success: true,message: 'Coupon updated successfully',data: updatedCoupons});
    } catch (error) {
        console.error('Error updating Coupon:', error);
        res.status(500).json({success: false,message: 'Error updating Coupon'});
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await Coupon.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return res.status(404).json({success: false,message: 'Coupon not found'});
        }

        res.status(200).json({success: true,message: 'Coupon deleted successfully'});

    } catch (error) {
        console.error('Error deleting Coupon:', error);
        res.status(500).json({success: false,message: 'Error deleting Coupon',});
    }
};