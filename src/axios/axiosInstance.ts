require("dotenv").config();
import axios from "axios";

const headers = {
  // accept: "application/json",
  // "accept-language": "pt-BR",
  // "access-control-allow-headers": "*",
  // "access-control-allow-origin": "*",
  // "User-Agent":
  //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  // 'app-version': '1.149.4',
  authorization: process.env.AUTHORIZATION,
  "app-version": "web_v1.217.1",
};

const Axios = axios.create({
  headers: headers,
});

export default Axios;
