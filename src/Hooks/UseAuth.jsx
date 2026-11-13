import { useContext } from "react";
import { AuthContext } from "../Provider/AuthContext";

const UseAuth = () => {
    return useContext(AuthContext);
};

export default UseAuth;