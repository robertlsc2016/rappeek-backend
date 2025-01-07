import express from "express";
import cors from "cors";
import { router as storeRouter } from "./Routes/storeRoutes";
import { StoreService } from "./services/storeService";
import runCronJobs from "./crons/test-cron";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

StoreService.addStores();
runCronJobs();

app.use("/store", storeRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando na porta ${PORT}!`);
});
