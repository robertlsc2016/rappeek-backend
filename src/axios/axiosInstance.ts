require("dotenv").config();
import axios from "axios";

const headers = {
  // accept: "application/json",
  "accept-language": "pt-BR",
  "access-control-allow-headers": "*",
  "access-control-allow-origin": "*",
  // 'app-version': '1.149.4',
  authorization: process.env.AUTHORIZATION,
  "app-version": "web_v1.216.6",
  "sec-fetch-mode": "cors",
  accept: "*/*",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

const Axios = axios.create({
  headers: headers,
});

export default Axios;
