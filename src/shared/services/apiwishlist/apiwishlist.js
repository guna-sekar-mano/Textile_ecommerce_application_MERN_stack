import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const savewishitems = async(data)=>{
    var res = await axios.post(`${apiurl()}/wishlists/apisavewislist`,data,{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }

 export const getAllwishitems = async()=>{
    var res = await axios.get(`${apiurl()}/wishlists/apigetallwislist`,{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }

 export const updatewishitems = async(data)=>{
    var res = await axios.put(`${apiurl()}/wishlists/apiupdatewislist`,data,{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }

 export const deleteOnewishitems = async(data)=>{
    var res = await axios.delete(`${apiurl()}/wishlists/apideleteOnewislist`,{params:{_id:data},headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }
 
 export const deleteAllwishitems = async()=>{
    var res = await axios.delete(`${apiurl()}/wishlists/apideletewislist`,{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
 }

