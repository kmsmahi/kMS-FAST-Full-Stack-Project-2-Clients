import axios from "axios";
const UseAxios = () => {
    const instance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
    headers: { "X-Custom-Header": "foobar" },
});
    return instance;
};

export default UseAxios;