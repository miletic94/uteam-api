import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from 'express'
import { ErrorHandler } from "../errorHandler/ErrorHandler";

export const validateLogin = [
    check("email")
    .if((value:string) => value != null)
    .trim()
    .isEmail()
    .withMessage("Must enter valid email")
    .normalizeEmail()
    .withMessage("Must enter valid email"),
    
    check("username")
    .if((value:string) => value != null)
    .trim(),
    (req:Request, res:Response, next:NextFunction) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const errorsArray = errors.array().map(error => {
                return next(ErrorHandler.badRequest(error.msg))
            })
        }
        next()
    }
]

/*

*/

