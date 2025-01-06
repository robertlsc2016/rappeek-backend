import cron = require("node-cron");
import { getFistProductsDay } from "../utils/getFirstProductsDay";

const runGetFirstProductsDay = async () => {
  console.log("cron executado às ", new Date())
  setTimeout(async () => {
    return await getFistProductsDay();
  }, 5000);
};

runGetFirstProductsDay();

// Agenda uma tarefa para ser executada a cada 1 hora
const runCronJobs = () => {
  cron.schedule("0 * * * *", runGetFirstProductsDay);
};

export default runCronJobs;
