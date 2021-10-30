import axios from "axios";

const BACKEND_URI = "http://localhost:8080/api/v1";

const downloadYtd = async (id) => {
    const API = BACKEND_URI + "/download-ytd";
    return axios.get(API, { params: { id } })
}

const test = async () => {
    return axios.get(BACKEND_URI + "/test");
}

export const videoService = {
    downloadYtd,
    test
}