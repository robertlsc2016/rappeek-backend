import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import os from "os";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { router as storeRouter } from "./Routes/storeRoutes";
import swaggerDocument from "./swagger/swagger-output.json";

dotenv.config();

const PORT = 3000;
const app = express();

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
import compression from 'compression';

// Documentação Swagger
const swaggerOptions = { explorer: true };
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// Rotas
app.use("/store", storeRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression())

if (os.platform() == "linux") {
  const sslOptions = {
    key: fs.readFileSync(process.env.PRIVATE_KEY || ""),
    cert: fs.readFileSync(process.env.CERT || ""),
    ca: fs.readFileSync(process.env.CHAIN || ""),
  };

  https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor HTTPS rodando em https://${process.env.HOST}`);
  });
}

if (os.platform() == "win32") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API documentation: http://localhost:${PORT}/api-docs`);
    console.log(`API rodando na porta http://localhost:${PORT}`);
  });
}
