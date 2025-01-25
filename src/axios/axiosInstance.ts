require('dotenv').config()
import axios from "axios";

const headers = {
  accept: "application/json",
  "accept-language": "pt-BR",
  "access-control-allow-headers": "*",
  "access-control-allow-origin": "*",
  // 'app-version': '1.149.4',
  "authorization": process.env.AUTHORIZATION,
  "app-version": "web_v1.216.6",
};

const Axios = axios.create({
  headers: headers,
});

export default Axios;
