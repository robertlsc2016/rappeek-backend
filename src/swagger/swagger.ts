import dotenv from "dotenv";
dotenv.config();
import swaggerAutogen from "swagger-autogen";

const time = `${
  new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
}-${
  new Date().getMonth() + 1 < 10
    ? `0${new Date().getMonth() + 1}`
    : new Date().getMonth() + 1
}-${new Date().getFullYear()}`;

const doc = {
  info: {
    title: "API Filtro de ofertas do Rappi",
    description: "Métodos da API que retorna alguns scrapings da rappi.com.br",
  },
  host: process.env.NODE_ENV === "production" ? "" : process.env.HOST,
  schemes: ["http", "https"],
};

const outputFile = `./swagger-output-${time}.json`;
const routes = [`./index.ts`];

swaggerAutogen()(outputFile, routes, doc);
