import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://smashlunar-api-b7hddkhfdse9bdgy.westeurope-01.azurewebsites.net/api',
    timeout: 5000,
});

export default apiClient;
