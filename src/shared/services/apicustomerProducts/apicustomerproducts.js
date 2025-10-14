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

export const getCustomerProductById = async (routerLink, productType) => {
  try {
    const token = gettoken();
    const response = await axios.get(
    `${apiurl()}/products/apigetproductsbyRouterLink/${productType}/${routerLink}`,
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
        const res = await axios.get(`${apiurl()}/popular-products/apigetCustomerpopularproducts`, { params: params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apigetNewArrivalProducts = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/products/apigetNewArrivalProducts`, { params: params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apigetSalePriceProducts = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/products/apigetSalePriceProducts`, { params: params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apigetHeaderproductsCustomers = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/products/apigetHeaderProductsCustomer`, { params: params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};
