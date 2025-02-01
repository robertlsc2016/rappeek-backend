const cheerio = require("cheerio");

export const cleanHtmlFromAmazon = ({ html }: { html: string }) => {
  try {
    const $ = cheerio.load(html);
    const products: any = [];

    $('[role="listitem"]').each((index: any, item: any) => {
      const name = $(item).find("h2 span").text();
      const price = `${$(item).find(".a-price-whole").text()}${$(item)
        .find(".a-price-fraction")
        .text()}`;

      const image = $(item).find(".s-image").attr("src");
      const link =
        "https://www.amazon.com.br/" +
        $(item).find(".a-link-normal.s-no-outline").attr("href");

      if (name && price && image && link) {
        products.push({ name, price, image, link });
      }
    });

    if (products.length == 0) {
      throw {
        message: "não foi possível extrair nenhum produto da amazon",
        status: 503,
        error: "",
      };
    }
    return products;
  } catch (err) {
    throw err;
  }
};
