import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { router as storeRouter } from "./Routes/storeRoutes";
import swaggerDocument from "./swagger/swagger-output.json";
import compression from 'compression';
import { userRouter } from "./Routes/userRoutes";


const app = express();

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression())

// Documentação Swagger
const swaggerOptions = { explorer: true };
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

app.use("/store", storeRouter);
app.use("/user", userRouter);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'live', http_status: 200 });
});

export default app;
