import { ErrorHandler } from "../errorHandler/ErrorHandler";
import {check, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express"
import { Role } from "../../interfaces/user";

export const validateUser = [
    check("user.username")
        .exists()
        .withMessage("Must enter username")
        .trim()
        .notEmpty()
        .withMessage("Usarname can't be empty")
        .matches(/\S/)
        .withMessage("Username can't hold spaces")
        .matches(/^[A-Z]/i)
        .withMessage("Username can only start with letter")
        .matches(/^[A-Za-z][a-z0-9#%\_\-\*)]*$/)
        .withMessage("Username can have letters, numbers, and some of these characters: #%-_*"),

    check("user.email")
        .exists()
        .withMessage("Must enter email")
        .isEmail()
        .withMessage("Must enter valid email")
        .normalizeEmail(),

    check("user.password")
        .exists() 
        .withMessage("Must enter password")
        .isLength({min: 6})
        .withMessage("Length of the password must be at least 6 characters."),

    check("user.role")
        .default(Role.USER)
        .if((value: Role)=> !Object.values(Role).includes(value))
        .customSanitizer(value => {
            return Role.USER
        }),

    (req:Request, res:Response, next:NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorsArray = errors.array().map(error => {
                return next(ErrorHandler.badRequest(error.msg))
            })
        }
        next()
    }
]

