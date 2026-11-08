import { useMemo } from "react";
import axios from "axios";

const UseAxios = () => {
    const instance = useMemo(() => {
        return axios.create({
            baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }, []);

    return instance;
};

export default UseAxios;