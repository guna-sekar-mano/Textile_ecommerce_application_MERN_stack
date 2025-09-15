import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const apisavecart = async (datas) => {
    try {
        const token = gettoken();
        const res = await axios.post(`${apiurl()}/cart/savecart`, datas, { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }});

        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getcartItems = async (email) => {
    try {
      const response = await axios.get(`${apiurl()}/cart/getallcart`, {params: { Email: email }, headers: {"Authorization": `Bearer ${gettoken()}`  }});
      return response.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  };

  export const updatecartItem = async (productId, Quantity, Email) => {
    try {
        const response = await axios.put(`${apiurl()}/cart/updatecart`,{ productId, Quantity, Email },{ headers: { Authorization: `Bearer ${gettoken()}` } });
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

export const deletecartItem = async (productId) => {
  try {
    const response = await axios.delete(`${apiurl()}/cart/deleteonecart`, {
      params: { _id: productId },
      headers: { Authorization: `Bearer ${gettoken()}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};

export const deleteAllcartItems = async (email) => {
  try {
    const response = await axios.delete(`${apiurl()}/cart/deleteallcart`, { headers: { Authorization: `Bearer ${gettoken()}` } });
    return response.data;
  } catch (error) {
    console.error('Error deleting all cart items:', error);
    throw error;
  }
};