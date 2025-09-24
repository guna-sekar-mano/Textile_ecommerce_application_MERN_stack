import axios from "axios";
import apiurl from "../../../../shared/services/apiendpoint/apiendpoint";
import { gettoken } from "../../../../shared/services/token/token";

const token = gettoken();

export const apisaveProducts = async (datas) => {

    try {
        const formData = new FormData();
        
        if (datas.sizes) {
            if (Array.isArray(datas.sizes)) {
                formData.append('sizes', JSON.stringify(datas.sizes));
            } else {
                formData.append('sizes', datas.sizes);
            }
        }
        
        if (datas.Images && datas.Images.length > 0) {
            datas.Images.forEach((file) => {
                if (file instanceof File) {
                    formData.append('Images', file);
                }
            });
        }
        
        if (datas.variants && Array.isArray(datas.variants)) {
            const processedVariants = datas.variants.map((variant, variantIndex) => {
                const { variant_images, ...otherFields } = variant;
                
                if (variant_images && Array.isArray(variant_images)) {
                    const imageFiles = variant_images.filter(item => item instanceof File);
                    const existingImages = variant_images.filter(item => typeof item === 'string');
                    
                    imageFiles.forEach((file) => {
                        formData.append(`variants[${variantIndex}][variant_images]`, file);
                    });
                    
                    return { ...otherFields, variant_images: existingImages };
                }
                
                return { ...otherFields, variant_images: [] };
            });
            
            formData.append('variants', JSON.stringify(processedVariants));
        }
        
        for (const key in datas) {
            if (key !== 'Images' && key !== 'variants' && key !== 'sizes') {
                formData.append(key, datas[key]);
            }
        }

        const res = await axios.post(`${apiurl()}/products/apisaveproductdata`, formData, { 
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data;
    } catch (err) {
        console.error('API Save Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apiupdateproductss = async (_id, formData) => {
    try {
        const multipartFormData = new FormData();

        // Handle sizes properly - stringify if it's an array of objects
        if (formData.sizes) {
            if (Array.isArray(formData.sizes)) {
                multipartFormData.append('sizes', JSON.stringify(formData.sizes));
            } else {
                multipartFormData.append('sizes', formData.sizes);
            }
        }

        if (formData.Images && formData.Images.length > 0) {
            const imageFiles = formData.Images.filter(item => item instanceof File);
            const existingImages = formData.Images.filter(item => typeof item === 'string');
            
            multipartFormData.append('existingMainImages', JSON.stringify(existingImages));
            
            imageFiles.forEach((file) => {
                multipartFormData.append('Images', file);
            });
        } else {
            multipartFormData.append('existingMainImages', JSON.stringify([]));
        }

        if (formData.variants && Array.isArray(formData.variants)) {
            const processedVariants = formData.variants.map((variant, variantIndex) => {
                const { variant_images, ...otherFields } = variant;
                
                if (variant_images && Array.isArray(variant_images)) {
                    const imageFiles = variant_images.filter(item => item instanceof File);
                    const existingImages = variant_images.filter(item => typeof item === 'string');
                    
                    imageFiles.forEach((file) => {
                        multipartFormData.append(`variants[${variantIndex}][variant_images]`, file);
                    });
                    
                    return { ...otherFields, variant_images: existingImages };
                }
                
                return { ...otherFields, variant_images: [] };
            });
            
            multipartFormData.append('variants', JSON.stringify(processedVariants));
        }

        // Handle other fields (exclude sizes since we handled it above)
        for (const key in formData) {
            if (key !== 'Images' && key !== 'variants' && key !== 'sizes') {
                multipartFormData.append(key, formData[key]);
            }
        }

        console.log('FormData being sent:');
        for (let pair of multipartFormData.entries()) {
            if (pair[1] instanceof File) {
                console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].size} bytes)`);
            } else {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
        }

        const res = await axios.put(`${apiurl()}/products/apiupdateproductdata/${_id}`, multipartFormData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data;
    } catch (err) {
        console.error('API Update Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};


export const apigetallproducts = async (params) => {
    try {
        const res = await axios.get(`${apiurl()}/products/apigetproductdata`, {params: params, headers: { "Authorization": `Bearer ${token}` } });
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apideleteproducts = async (_id) => {
    try {
        const res = await axios.delete(`${apiurl()}/products/apideleteproductsdata/${_id}`, {headers: { "Authorization": `Bearer ${token}` }});
        return res.data;
    } catch (err) {
        console.error('API Delete Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const apigetallHeaderproducts = async (params) => {
    try {
        const res = await axios.get(`${apiurl()}/products/apigetHeaderProducts`, {params: params, headers: { "Authorization": `Bearer ${token}` } });
        return res.data;
    } catch (err) {
        console.error('API Get Products Error:', err.response ? err.response.data : err);
        throw err;
    }
};

export const getFilterOptions = async(data)=>{
   var res = await axios.post(`${apiurl()}/products/getfilteroptions`,{field:data},{headers: {"Authorization" : `Bearer ${token}`}});
   return res.data;
}