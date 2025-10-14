import axios from "axios";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { gettoken } from "../../../../shared/services/token/token";

export const getCouponCustomers = async(params)=>{
    var res=await axios.get(`${apiurl()}/customers/apigetCouponcustomers`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const saveCoupons=async(data)=>{
   try {
      var res=await axios.post(`${apiurl()}/coupons/apisaveCoupons`,data,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}

export const getAllCoupons = async () => {
    try {
        const response = await axios.get(`${apiurl()}/coupons/apigetallCoupons`, { headers: {"Authorization" : `Bearer ${gettoken()}`}});
        return response.data;
    } catch (error) {
        console.error('Error fetching Coupons:', error);
        throw error.response?.data || error;
    }
};

export const updateCoupons = async (id, data) => {
    try {
        const response = await axios.put(`${apiurl()}/coupons/apiupdateCoupons/${id}`, data, { headers: {"Authorization" : `Bearer ${gettoken()}`}});
        return response.data;
    } catch (error) {
        console.error('Error updating Coupons:', error);
        throw error.response?.data || error;
    }
};

export const deleteCoupons = async (id) => {
    try {
        const response = await axios.delete(`${apiurl()}/coupons/apideleteCoupon/${id}`, { headers: {"Authorization" : `Bearer ${gettoken()}`}});
        return response.data;
    } catch (error) {
        console.error('Error deleting Coupons:', error);
        throw error.response?.data || error;
    }
};

export const trackCouponUsage = async (couponId, userEmail, orderId) => {
    try {
        const response = await axios.post(`${apiurl()}/coupons/apitrackCouponUsage`, {
            couponId,
            userEmail,
            orderId
        }, { 
            headers: {"Authorization" : `Bearer ${gettoken()}`}
        });
        return response.data;
    } catch (error) {
        console.error('Error tracking coupon usage:', error);
        throw error.response?.data || error;
    }
};

export const validateCouponUsage = async (couponCode, userEmail, subtotal) => {
    try {
        const response = await axios.post(`${apiurl()}/coupons/apivalidateCouponUsage`, {
            couponCode,
            userEmail,
            subtotal
        });
        return response.data;
    } catch (error) {
        console.error('Error validating coupon usage:', error);
        throw error.response?.data || error;
    }
};

export const getAllcustomerCoupon = async()=>{
   var res = await axios.get(`${apiurl()}/coupons/apigetallcustomercoupon`);
   return res.data;
}