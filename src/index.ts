import express from "express";
import cors from "cors";
import { router as storeRouter } from "./Routes/storeRoutes";
import { StoreService } from "./services/storeService";
import runCronJobs from "./crons/test-cron";
import https from "https";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

StoreService.addStores();
runCronJobs();

app.use("/store", storeRouter);

if (os.platform() == "linux") {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "..", "src", "ssl", "privkey1.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "src", "ssl", "cert1.pem")),
    ca: fs.readFileSync(path.join(__dirname, "..", "src", "ssl", "fullchain1.pem")),
  };

  https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(
      `Servidor HTTPS rodando em https://${process.env.PUBLIC_IP}:${PORT}`
    );
  });
}

if (os.platform() == "win32") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API rodando na porta http://localhost:${PORT}`);
  });
}
