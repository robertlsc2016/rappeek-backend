import { Request, Response } from "express";
import { logger } from "../logger";
import { UserService } from "../services/userService";
import { IUser } from "../interfaces/body_requests/IUser";

export class UserController {
    static async registerController(req: Request, res: Response) {
        const { username, password, email, name }: IUser = req.body
        try {
            const handleRegister = await UserService.registerService({ username, password, email, name })
            res.status(200).json(handleRegister);
        } catch (err: any) {
            logger.log("error", err)
            res.status(err.status).json(err);
        }
    }

    static async loginController(req: Request, res: Response) {
        const { username, password } = req.body;
        try {
            const loggedUser = await UserService.loginService({ username, password })
            res.status(200).json(loggedUser);
        } catch (err: any) {
            logger.log("error", err)
            res.status(err.status).json(err);
        }
    }

}
