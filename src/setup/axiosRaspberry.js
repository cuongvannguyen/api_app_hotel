import axios from "axios";
require("dotenv").config();
// import { toast } from "react-toastify";
// require("dotenv").config();

// Set config defaults when creating the instance
const instance = axios.create({
  // baseURL: process.env.RAS,
});

instance.defaults.withCredentials = true;

// Alter defaults after instance has been created
// instance.defaults.headers.common[
//   "Authorization"
// ] = `Bearer ${localStorage.getItem("jwt")}`;

// // Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor

instance.interceptors.response.use(
  function (response) {

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response; // cương fix
    // return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = (error && error.response && error.response.status) || 500;
    switch (status) {
      case 401: {
        // window.location.href = "/login";
        return error.response.data;
      }
      case 403: {
        // toast.error(`You don't have the permission to access this resource...`);
        return error.response.data;
      }
    }
  }
);

export default instance;
