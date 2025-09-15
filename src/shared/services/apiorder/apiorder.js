import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const getFilterOptions = async(data)=>{
    var res= await axios.post(`${apiurl()}/order/getfilteroptions`,{field:data},{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getallorders = async(params)=>{
    var res = await axios.get(`${apiurl()}/order/apigetallorder`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }

 export const apidownloadPDF = async(datas)=>{
    var res = await axios.post(`${apiurl()}/order/downloadPDF`,{Order_id:datas},{ responseType:'blob', headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }

 export const getOrderitemsbyid = async(Order_id)=>{
    var res= await axios.get(`${apiurl()}/order/apigetorderitemsbyid`,{params:{Order_id:Order_id},headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const updateOrder = async(datas)=>{
    try {
       var res=await axios.put(`${apiurl()}/order/apiupdateorder`,datas,{params:{_id:datas._id}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
       return res.data;
    }
    catch(err){
       console.log(err);
    }
}

export const apiCreateOrder = async (orderData) => {
    try {
        const token = gettoken();
        console.log('Sending order data:', orderData);
        
        const response = await axios.post(`${apiurl()}/order/createorder`, orderData,  {headers: {"Authorization": `Bearer ${token}`,"Content-Type": "application/json"}});
        return response.data;
    } catch (error) {
        console.error("API Create order Error:", error.response?.data || error.message);
        throw error;
    }
};

export const apiPaymentDone = async (paymentData) => {
    try {
        const token = gettoken();
        const response = await axios.post(`${apiurl()}/order/saveorder`, paymentData, {headers: {"Authorization": `Bearer ${token}`,"Content-Type": "application/json"}});
        return response.data;
    } catch (error) {
        console.error("API Payment done Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getOrderdetails = async(params)=>{
    var res=await axios.get(`${apiurl()}/order/apigetorderdetails`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }