import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const getallcustomercategory = async(params)=>{
    var res=await axios.get(`${apiurl()}/categories/apigetCustomercategory`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getProductsByCategory = async (categoryId, params = {}) => {
    try {
        const queryParams = new URLSearchParams(params);
        const response = await fetch(`${apiurl()}/categories/products/category/${categoryId}?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
};