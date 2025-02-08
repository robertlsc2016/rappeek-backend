import { IUser } from "../interfaces/body_requests/IUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET

export class UserService {
    static users: IUser[] = [];

    static registerService = async ({ username, password, email, name }: IUser) => {
        try {
            if (UserService.users.find((u) => u.username === username)) {
                return { message: "Usuário já existe" };
            }

            const newUser: IUser = { username, password, email, name };
            const hashedPassword = await bcrypt.hash(password, 10);

            UserService.users.push({ ...newUser, password: hashedPassword });

            return newUser;
        } catch (err: any) {
            throw err;
        }
    };

    static loginService = async ({ username, password }: { username: string, password: string }) => {

        console.log(SECRET_KEY)

        try {
            const user = this.users.find((u) => u.username === username);

            if (!user || !(await bcrypt.compare(password, user.password))) {

                return ({ message: "Credenciais inválidas" });
            }

            if (!SECRET_KEY) {
                throw new Error("JWT_SECRET is not defined");
            }

            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
            return token
        } catch (err) {
            throw {
                message: 'erro ao executar login',
                status: 400,
                error: err
            }
        }

    }

    // static getUsers = async () => {
    //     return UserService.users;
    // };

    // static getUserByUsername = async (username: string) => {
    //     return UserService.users.find((u) => u.username === username) || null;
    // };
}
