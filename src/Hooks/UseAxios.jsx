
import { useEffect, useMemo } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase.config";

const UseAxios = () => {

    const axiosSecure = useMemo(() => {

        return axios.create({
            baseURL:
                import.meta.env.VITE_API_URL ||
                "http://localhost:5000",

            headers: {
                "Content-Type": "application/json"
            }
        });

    }, []);

    useEffect(() => {

        // Request Interceptor
        const requestInterceptor =
            axiosSecure.interceptors.request.use(
                async (config) => {

                    const currentUser = auth.currentUser;

                    if (currentUser) {

                        const token =
                            await currentUser.getIdToken();

                        config.headers.Authorization =
                            `Bearer ${token}`;

                    }

                    return config;

                },
                (error) => Promise.reject(error)
            );

        // Response Interceptor
        const responseInterceptor =
            axiosSecure.interceptors.response.use(
                (response) => response,

                (error) => {

                    const status = error.response?.status;

                    if (
                        status === 401 ||
                        status === 403
                    ) {
                        console.error(
                            "Authentication error:",
                            error.response?.data
                        );
                    }

                    return Promise.reject(error);
                }
            );

        return () => {

            axiosSecure.interceptors.request.eject(
                requestInterceptor
            );

            axiosSecure.interceptors.response.eject(
                responseInterceptor
            );

        };

    }, [axiosSecure]);

    return axiosSecure;
};

export default UseAxios;
