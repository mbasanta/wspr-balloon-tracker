import axios, {InternalAxiosRequestConfig} from "axios";
import ApiEndpoints from "../constants/ApiEndpoints";

const axiosClient = axios.create({
    baseURL: ApiEndpoints.WsprApi,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Do something before request is sent
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default axiosClient;
