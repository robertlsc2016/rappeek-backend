import cron = require("node-cron");
import { StoreService } from "../services/storeService";

const runGetFirstProductsDay = async () => {
  console.log("inicio da execucão do cron", new Date());
  setTimeout(async () => {
    return await StoreService.getAllProductsDay()
      .then(() => {
        console.log("fim da execucão do cron", new Date());
      })
      .catch((err) => {
        console.log("fim da execucão do cron com erro", new Date(), err);
      });
  }, 5000);
};

runGetFirstProductsDay();

const runCronJobs = () => {
  cron.schedule("*/30 * * * *", runGetFirstProductsDay);
};

export default runCronJobs;
