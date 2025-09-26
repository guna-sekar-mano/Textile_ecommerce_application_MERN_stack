import axios from "axios";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { gettoken } from "../../../../shared/services/token/token";


export const getallBanner = async(params)=>{
    var res=await axios.get(`${apiurl()}/homeBanner/apigetallbanner`,{
        params:params, 
        headers: {"Authorization" : `Bearer ${gettoken()}`}
    });
    return res.data;
}

export const saveBanners = async(datas) => {
    try {
        const formData = new FormData();
        
        for (const key in datas) {
            if (key === 'DesktopImage' || key === 'MobileImage') {
                if (datas[key] && datas[key] instanceof File) {
                    formData.append(key, datas[key]);
                }
            } else if (key === 'ProductId') {
                if (Array.isArray(datas['ProductId'])) {
                    datas['ProductId'].forEach(productId => {
                        formData.append('ProductId[]', productId);
                    });
                } else {
                    formData.append('ProductId', datas['ProductId']);
                }
            } else {
                formData.append(key, datas[key]);
            }
        }
        
        var res = await axios.post(`${apiurl()}/homeBanner/apisavebanner`, formData, {headers: {"Authorization": `Bearer ${gettoken()}`,"Content-Type": "multipart/form-data"}});
        return res.data;
    } catch(err) {
        console.log('Error in savecollection:', err);
        throw err;
    }
}

export const updatedBanner = async(datas) => {
    try {
        const formData = new FormData();
        
        for (const key in datas) {
            if (key === 'Images') {
                if (datas['Images']) {
                    for(let i = 0; i < datas['Images'].length; i++) {
                        if (datas['Images'][i] instanceof File) {
                            formData.append(key, datas['Images'][i]);
                        } else {
                            formData.append(key, datas['Images'][i]);
                        }
                    }
                }
            } else if (key === 'ProductId') {
                if (Array.isArray(datas['ProductId'])) {
                    datas['ProductId'].forEach(productId => {
                        formData.append('ProductId[]', productId);
                    });
                } else {
                    formData.append('ProductId', datas['ProductId']);
                }
            } else {
                // Handle other form fields
                formData.append(key, datas[key]);
            }
        }
        
        var res = await axios.put(`${apiurl()}/homeBanner/apiupdatebanner`, formData, {params: {_id: datas?._id}, headers: {"Authorization": `Bearer ${gettoken()}`,"Content-Type": "multipart/form-data"}});
        return res.data;
    } catch(err) {
        console.log('Error in updatedecollection:', err);
        throw err;
    }
}

export const deleteBanner = async(id) => {
    var res = await axios.delete(`${apiurl()}/homeBanner/apideletebanner`, {
        params: {_id: id}, 
        headers: {"Authorization" : `Bearer ${gettoken()}`}
    });
    return res.data;
}