import dotenv from "dotenv";
dotenv.config();

import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: process.env.NODE_ENV === "production" ? "" : process.env.HOST,
  schemes: ["https", "http"],
};

const outputFile = "./swagger-output.json";
const routes = ["../index.ts"];

swaggerAutogen()(outputFile, routes, doc);
