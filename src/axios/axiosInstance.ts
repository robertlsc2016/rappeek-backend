require('dotenv').config()
import axios from "axios";

const headers = {
  accept: "application/json",
  "accept-language": "pt-BR",
  "access-control-allow-headers": "*",
  "access-control-allow-origin": "*",
  // 'app-version': '1.149.4',
  authorization: process.env.AUTHORIZATION,

  // origin: "https://www.rappi.com.br",
  // referer: "https://www.rappi.com.br/",

  // accept: "application/json",
  // "accept-language": "pt-BR",
  // "access-control-allow-headers": "*",
  // "access-control-allow-origin": "*",
  "app-version": "web_v1.216.6",
  // authorization:
  // "content-type": "application/json",
  // deviceid: "3577be35-6122-430f-9f9d-4e5d7cdfc166",
  // include_context_info: "true",
  // language: "pt",
  // needappsflyerid: "false",
  // origin: "https://www.rappi.com.br",
  // priority: "u=1, i",
  // referer: "https://www.rappi.com.br/",
  // "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  // "sec-ch-ua-mobile": "?1",
  // "sec-ch-ua-platform": '"Android"',
  // "sec-fetch-dest": "empty",
  // "sec-fetch-mode": "cors",
  // "sec-fetch-site": "same-site",
  // "sec-gpc": "1",
  // "user-agent":
  //   "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
};

const Axios = axios.create({
  headers: headers,
});

export default Axios;
