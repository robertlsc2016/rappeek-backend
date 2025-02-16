import app from ".";

import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`API documentation: http://localhost:${PORT}/api-docs`);
  console.log(`API rodando na porta http://localhost:${PORT}`);
});
