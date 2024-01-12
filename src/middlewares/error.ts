import { Request, Response, NextFunction } from "express";
import Errorhandler from "../utils/utility-class.js";
import { controllerType } from "../types/types.js";
export const errorMiddleware = (
  err: Errorhandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server errors";
  err.statusCode ||= 500;


if(err.name === "CastError") err.message = "Invalid ID"

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};


export const TryCatch =
  (func: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next))
    .catch(next)
  };
