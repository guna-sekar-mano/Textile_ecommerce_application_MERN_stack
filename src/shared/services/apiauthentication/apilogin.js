import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";


export const apilogin = async (datas) => {
    try {
        const res = await axios.post(`${apiurl()}/api/apilogin`, datas);
        console.log(res);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};