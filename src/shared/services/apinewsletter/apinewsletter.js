import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const apiSaveNewsletter = async (newsletterEmail) => {
    try {
        const res = await axios.post(`${apiurl()}/newsletter/apisaveNewsletter`, newsletterEmail, {"Content-Type": "application/json" });
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getNewsletters = async(params)=>{
    var res=await axios.get(`${apiurl()}/newsletter/apigetNewsletter`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}