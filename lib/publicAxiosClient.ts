// api/publicApi.ts
import axios from "axios";
import { BASE_URL } from "./utils";

const publicApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// No interceptors, plain API
export default publicApi;
