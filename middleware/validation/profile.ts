import { ErrorHandler } from "../errorHandler/ErrorHandler";
import {check, validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express"
import { Status } from "../../interfaces/profile";

export const validateProfile = [

    check("profile.name")
        .exists()
        .withMessage("Must enter name")
        .notEmpty()
        .withMessage("Name can't be empty"),

    check("profile.status")
        .default(Status.PENDING)
        .if((value:Status) => !Object.values(Status).includes(value))
        .customSanitizer(value => Status.PENDING),

    check("profile.profilePhoto")
    .default("https://image.shutterstock.com/shutterstock/photos/1373616899/display_1500/stock-vector-hand-drawn-modern-man-avatar-profile-icon-or-portrait-icon-user-flat-avatar-icon-sign-1373616899.jpg")
    .isURL()
    .withMessage("Enter valid link to the profile photo"),

    check("profile.companyUuid")
        .if((value:string) => value != null)
        .isUUID()
        .withMessage("companyUuid must be valid UUID"),
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