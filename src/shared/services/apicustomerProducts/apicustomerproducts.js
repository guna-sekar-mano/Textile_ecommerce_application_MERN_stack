import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const apigetallproductsCustomers = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/products/apigetproductdataforCustomer`, { params: params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const getCustomerProductById = async (id, productType, productName) => {
  try {
    const token = gettoken();
    const response = await axios.get(
      `${apiurl()}/products/apigetproductsbyID/${id}/${productType}/${productName}`,
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const apigetPopularProducts = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/products/apigetPopularProducts`, { params: params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apigetBannerProducts = async (params) => {
    try {
        const token = gettoken();
        
        // Convert array to comma-separated string if productIds is an array
        let queryParams = { ...params };
        if (params.productIds && Array.isArray(params.productIds)) {
            queryParams.productIds = params.productIds.join(',');
        }
        
        const res = await axios.get(`${apiurl()}/products/apigetBannerProducts`, { 
            params: queryParams,
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.data;
    } catch (err) {
        console.error('API Get Banner Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};