import axios from "axios";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    headers: { "Content-Type": "application/json" }
});

export const axiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    headers: { "Content-Type": "application/json" }
});

export const axiosServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    headers: { "Content-Type": "application/json" }
});