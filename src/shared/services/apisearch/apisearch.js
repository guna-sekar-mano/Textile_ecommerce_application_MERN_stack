import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

const searchAPI = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

searchAPI.interceptors.request.use(
    (config) => {
        const token = gettoken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const searchProducts = async (params = {}) => {
    try {
        const {
            query = '',
            category_id = '',
            gender = '',
            product_type = '',
            min_price = '',
            max_price = '',
            sort_by = 'relevance',
            page = 1,
            limit = 20
        } = params;

        // Build query parameters, excluding empty values
        const queryParams = Object.entries({
            query: query.trim(),
            category_id,
            gender,
            product_type,
            min_price,
            max_price,
            sort_by,
            page: page.toString(),
            limit: limit.toString()
        })
        .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        const response = await searchAPI.get(`${apiurl()}/search/searchproducts`, {
            params: queryParams
        });

        return {
            success: true,
            data: response.data.data,
            ...response.data
        };
    } catch (error) {
        console.error('Search Products Error:', error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to search products',
            data: {
                products: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalCount: 0,
                    limit: 20,
                    hasNext: false,
                    hasPrev: false
                }
            }
        };
    }
};

