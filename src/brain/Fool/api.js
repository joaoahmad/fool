import axios from 'axios';
const apiHost = '/api';

axios.interceptors.response.use(response => response.data || response,  error => Promise.reject(error));

export default {
  get(endpoint, data) {
    return axios({
      url: apiHost + endpoint,
      method: 'get',
      params: data || {},
      responseType: 'json',
    })
  },
  post(endpoint, data, config = {}) {
    return axios({
      url: apiHost + endpoint,
      method: 'post',
      data: data || {},
      responseType: 'json',
      ...config
    })
  },
  put(endpoint, data, config = {}) {
    return axios({
      url: apiHost + endpoint,
      method: 'put',
      data: data || {},
      responseType: 'json',
      ...config
    })
  },
  delete(endpoint, data, config = {}) {
    return axios({
      url: apiHost + endpoint,
      method: 'delete',
      data: data || {},
      responseType: 'json',
      ...config
    })
  },
}
