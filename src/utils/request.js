import axios from 'axios'

const base = {
    baseURL: process.env.VUE_APP_URL,
    timeout: 1000 * 60,
    method: 'POST'
}

const instance = axios.create(base);

instance.interceptors.request.use(function (config) {
    return config
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use( response => {
    return response.data
}, function (error) {
    return  Promise.reject(error)
});

export default instance
