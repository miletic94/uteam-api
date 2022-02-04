import { Request, Response, NextFunction, Application } from "express";

export class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
    }
  }

export default function errorHandler(
    err:HttpException, 
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


