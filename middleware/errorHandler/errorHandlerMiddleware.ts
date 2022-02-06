import { Request, Response, NextFunction, Application } from "express";
import { ErrorHandler } from "./ErrorHandler";


export default function errorHandler(
    err:ErrorHandler, 
    req:Request, 
    res:Response, 
    next:NextFunction) {

    const status = (err.status || 500);
    const message = err.message || 'Something went wrong';
    res
      .status(status)
      .send({
        status,
        message,
      })
};


