require('dotenv').config()
import axios from "axios";

const headers = {
  accept: "application/json",
  "accept-language": "pt-BR",
  "access-control-allow-headers": "*",
  "access-control-allow-origin": "*",
  // 'app-version': '1.149.4',
  auth_user: "3927881100",
  authorization: process.env.AUTHORIZATION,

  // origin: "https://www.rappi.com.br",
  // referer: "https://www.rappi.com.br/",

  // accept: "application/json",
  // "accept-language": "pt-BR",
  // "access-control-allow-headers": "*",
  // "access-control-allow-origin": "*",
  "app-version": "web_v1.216.6",
  // authorization:
  //   "Bearer ft.gAAAAABndDqAEHOE704kaXtzyIPtWiwNWU5o3ElIz9K1WAOq5pjSwRQibBhCn9wnEkhOwJL2eumA0TBdl_oyGFq_gVHy1x1K56CvvSq6qYsG9_pewR4VgPud4jZdL3nfPtUPBqGIPzDJ7tG_c_ps0-EKU9SEc_6Gu6RVcPp1SaVA2xUsCjIPIKFl3gGAYuhQyJWuQOOYhYzIJCWa4YiPjfvWNijydbWhOL_IGoVnQyfx2kJYoKSTBtOzykiEq_3-lxu-KagAxqixaJoPMTEzlaiPgXKPa8e0F2PK0btvL2yxQOtyeSrcRj-yEFTUllpsVAUz2W14VEmAYTenu-WyoWFiie-LngMpo58HpCSjgjPjna0rp6l1_RA-RUoY2nk-1wh6-OTltc8tJZHyp-P5iNnpsyLljULS-A==",
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
