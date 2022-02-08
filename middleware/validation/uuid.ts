import { ErrorHandler } from "../errorHandler/ErrorHandler";
import {param, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express"


export const validateUuid = [
    param("id")
    .isUUID()
    .withMessage("Must enter valid UUID in route params"),
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