import app from ".";

import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API documentation: http://localhost:${PORT}/api-docs`);
  console.log(`API rodando na porta http://localhost:${PORT}`);
});
