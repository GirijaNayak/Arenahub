import axios from 'axios';
export const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
const api=axios.create({baseURL:API});
api.interceptors.request.use(c=>{const t=localStorage.getItem('arenahub_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
export default api;
