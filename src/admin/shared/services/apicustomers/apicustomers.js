import axios from "axios";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { gettoken } from "../../../../shared/services/token/token";

export const getallcustomers = async(params)=>{
    var res=await axios.get(`${apiurl()}/customers/apigetallcustomers`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getFilterOptions = async(data)=>{
    var res=await axios.post(`${apiurl()}/customers/getfilteroptions`,{field:data},{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}