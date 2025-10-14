import axios from "axios";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { gettoken } from "../../../../shared/services/token/token";

const token = gettoken();

export const apigetDashboardCardCount = async (params) => {
    try {
        const res = await axios.get(`${apiurl()}/dashboard/apigetDashboardCount`, {params: params, headers: { "Authorization": `Bearer ${token}` } });
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};