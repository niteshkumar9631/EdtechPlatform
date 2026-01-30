import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}



// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_URL,
//   withCredentials: true,
// });

// export const apiConnector = (method, url, bodyData, headers, params) => {
//   return axiosInstance({
//     method,
//     url,
//     data: bodyData || null,
//     headers: headers || null,
//     params: params || null,
//   });
// };



// import axios from "axios";

// // ✅ Axios instance for Vite + MERN backend
// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000/api/v1",
//   withCredentials: false, // ❌ set to false unless you use cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Universal API connector
// export const apiConnector = (
//   method,
//   url,
//   bodyData = null,
//   headers = {},
//   params = {}
// ) => {
//   return axiosInstance({
//     method,
//     url,
//     data: bodyData,
//     headers,
//     params,
//   });
// };
