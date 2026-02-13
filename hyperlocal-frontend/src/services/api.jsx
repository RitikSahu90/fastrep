import axios from "axios";

const api = axios.create({
  baseURL: "https://hyperlocal-backend-8mjq.onrender.com"
});

export default api;
