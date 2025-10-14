import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const apigetshippingDetails = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/customers/apigetshippingdetails`,{params:params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getAccountdetails = async(params)=>{
    var res=await axios.get(`${apiurl()}/customers/apigetaccountdetails`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const updateAccountdetails = async (params) => {
    const response = await axios.put(`${apiurl()}/customers/apiupdateaccoutdetails`, params,{params: { _id: params._id }, headers: {"Authorization": `Bearer ${gettoken()}`}});
    return response.data;
};

export const apiSaveShipping = async (formdata) => {
    try {
        const token = gettoken();
        const res = await axios.post(`${apiurl()}/customers/apisaveshippingAddress`, formdata, { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }});

        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const apiupdateShippingAddress = async ({ _id, Othersdata }) => {
    try {
        const token = gettoken();
        const res = await axios.put(`${apiurl()}/customers/updateShippingaddress`,Othersdata ,{params:{_id}, headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const apideleteShippingAddress = async (_id) => {
    try {
        const token = gettoken();
        const res = await axios.delete(`${apiurl()}/customers/apideleteShipping`, {params: { _id },headers: { "Authorization": `Bearer ${token}` }  });
        return res.data;
    } catch (err) {
        console.error("API Delete Error:", err);
    }
};