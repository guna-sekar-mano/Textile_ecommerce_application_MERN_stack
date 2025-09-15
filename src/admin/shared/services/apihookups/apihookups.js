import axios from "axios";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { gettoken } from "../../../../shared/services/token/token";

export const apisaveHookups = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.post(`${apiurl()}/hookups/apisaveHookups`, params, {headers: { "Authorization": `Bearer ${token}`}, });
        return res.data;
    } catch (err) {
        console.error('Error in API call:', err);
        throw err; 
    }
};

export const apigetallHookups = async (params) => {
    try {
        const token = gettoken();
        const res = await axios.get(`${apiurl()}/hookups/apigetallHookups`,{params:params,headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.log(err);
    }
};


export const apideleteHookups = async (_id) => {
    try {
        const token = gettoken();
        const res = await axios.delete(`${apiurl()}/hookups/apideleteHookups/${_id}`,{headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const apiupdateHookups = async (_id,datas) => {
    try {
        const token = gettoken();
        const res = await axios.put(`${apiurl()}/hookups/apiupdateHookups/${_id}`, datas,{headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getallHookupsforProduct = async () => {
   var res=await axios.get(`${apiurl()}/hookups/apigetHookupforProducts`,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}