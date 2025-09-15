import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const getallCustomerBanner = async(params)=>{
    var res=await axios.get(`${apiurl()}/homeBanner/apigetCustomerbanner`,{
        params:params, 
        headers: {"Authorization" : `Bearer ${gettoken()}`}
    });
    return res.data;
}

export const getBannerProducts = async (bannerId) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/homeBanner/banner/${bannerId}/products`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.data;
    } catch (err) {
        console.error('API Get Banner Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const getBannerProductsByLink = async (redirectLink) => {
    try {
        const token = gettoken();
        // Encode the redirect link to handle special characters
        const encodedLink = encodeURIComponent(redirectLink);
        const res = await axios.get(`${apiurl()}/homeBanner/banner/products/${encodedLink}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.data;
    } catch (err) {
        console.error('API Get Banner Products By Link Error:', err.response ? err.response.data : err);
        throw err;
    }
};