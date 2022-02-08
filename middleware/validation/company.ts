import { ErrorHandler } from "../errorHandler/ErrorHandler";
import {check, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express"

export const validateCompany = [
    check("company.logo")
    .default("https://cdn4.vectorstock.com/i/1000x1000/18/58/swoosh-generic-logo-vector-21061858.jpg")
    .isURL()
    .withMessage("Must enter valid link to company's logo"),
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