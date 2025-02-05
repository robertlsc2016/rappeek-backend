import app from ".";
import https from "https";
import fs from "fs";
import os from "os";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

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

