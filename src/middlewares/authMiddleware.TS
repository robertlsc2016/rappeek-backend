import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1]; // Padrão "Bearer TOKEN"

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return; // Evita que continue a execução
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next(); // Continua para o próximo middleware
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
        return;
    }
};
