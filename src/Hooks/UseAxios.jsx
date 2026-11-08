import axios from "axios";

const UseAxios = () => {
    const instance = axios.create({
        baseURL: "http://localhost:5000",
        withCredentials: true,
        headers: { 
            "Content-Type": "application/json" 
        },
    });
    return instance;
};

export default UseAxios;