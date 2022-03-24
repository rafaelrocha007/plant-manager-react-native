import axios from "axios";

const api = axios.create({
  baseURL: "https://cnhrapidoefacil.com.br/api",
});

export default api;
