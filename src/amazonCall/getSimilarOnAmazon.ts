import axios from "axios";

export const getSimilarOnAmazon = async ({
  product_name,
}: {
  product_name: string;
}) => {
  const proxyUrl = "https://proxy.corsfix.com/?";
  const searchUrl = `https://www.amazon.com.br/s?k=${product_name}`;

  const url = proxyUrl + searchUrl;

  try {
    const { data: html } = await axios
      .get(url, {
        headers: {
          origin: "https://app.corsfix.com",
          "sec-fetch-mode": "cros",
        },
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw {
          message: "erro ao coletar os dados da amazon",
          status: 503,
          erro: err,
        };
      });

    return html;
  } catch (err) {
    throw err;
  }
};
