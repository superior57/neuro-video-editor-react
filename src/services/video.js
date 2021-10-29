import axios from "axios";

const BACKEND_URI = "http://localhost:8080/api/v1";

export const downloadYtd = async (src) => {
    const API = BACKEND_URI + "/download-ytd";
    return await axios.get(API, { params: { src } })
}