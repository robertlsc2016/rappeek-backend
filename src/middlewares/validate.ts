// middlewares/validateMiddleware.ts
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      // Se houver erro de validação, envia a resposta diretamente e não retorna mais nada
      res.status(400).json({ error: error.details[0].message });
      return; // Apenas retorna a resposta e não o valor `Response`
    }
    next(); // Passa para o próximo middleware ou rota
  };
};
