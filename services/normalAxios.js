import axios from 'axios';

const normalAxios = axios.create();

normalAxios.interceptors.request.use((config) => {
    console.log(`%c API REQUEST FOR : ${config?.url} `, 'background: #222; color: #FFFF00', config);
  return config
});

normalAxios.interceptors.response.use((res) => {
   console.log(`%c API SUCCESS RESPONSE FOR : ${res?.config?.url} `, 'background: #222; color: #00FF00', res)
  return res?.data;
},
(error) => {
  console.log(`%c API ERROR RESPONSE FOR : ${error?.config?.url} `, 'background: #222; color: #FF0000', error?.response)
  return Promise.reject(error?.response)
});

export default normalAxios;
