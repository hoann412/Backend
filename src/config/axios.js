import axios from 'axios';
import { envConfig } from './env.js';

const axiosInstance = axios.create({
    baseURL: envConfig.shipping.apiEndpoint,
    headers: {
        'Content-Type': 'application/json',
        token: envConfig.shipping.apiToken,
        shop_id: envConfig.shipping.shopId,
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response && response.data ? response.data : response;
    },
    function (error) {
        return Promise.reject(error);
    },
);

export default axiosInstance;
