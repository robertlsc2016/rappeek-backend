import cron = require("node-cron");
import { StoreService } from "../services/storeService";

const runGetFirstProductsDay = async () => {
  console.log("cron executado às ", new Date())
  setTimeout(async () => {
    return await StoreService.getAllProductsDay();
  }, 5000);
};

runGetFirstProductsDay();

const runCronJobs = () => {
  cron.schedule("0 * * * *", runGetFirstProductsDay);
};

export default runCronJobs;
