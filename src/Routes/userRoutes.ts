import { Router } from "express";
import { validate } from "../middlewares/validate";
import { UserController } from "../controllers/userController";
import { userSchema } from "../schemas/userSchema";
import Joi from "joi";

const userRouter = Router();

userRouter.post(
    "/register",
    validate(userSchema),
    UserController.registerController
);

userRouter.post(
    "/login",
    validate(Joi.object({
        username: Joi.string().required(),
        password: Joi.number().required(),
    }),
    ), UserController.loginController
)

export { userRouter };
