import {Request, Response, NextFunction } from "express"
import passport from "passport"
import { ICompany } from "../interfaces/company"
import Company from "../models/company"
import Profile from "../models/profile"
import User from "../models/user"
import { ErrorHandler } from "../middleware/errorHandler/ErrorHandler"
import slugify from "slugify"

const filePath = process.env.NODE_ENV === "production"? null : __filename

const createCompany = async (req:Request, res:Response, next:NextFunction) => {
    let {companyName, logo}:ICompany = req.body.company

    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.unauthorized("Not Authenticated", {filePath, ...error}))
        }
        const companyOwner = user.id
        try {
            const profile = await Profile.findOne({where:{userId: companyOwner}})
                if(profile == null) {
                    return next( ErrorHandler.forbidden( "You must have profile to create a company"))
                }
            if(companyName == null) {
                companyName = `${profile.name}'s Company`
            }
            const slug = slugify(companyName) // if database don't handle this
            const company = await Company.create({
                companyName,
                logo,
                slug,
                companyOwner
            })
            res.json(company)
        } catch (error) {
            next(ErrorHandler.internalServerError(error.message, error))
        }
    })(req, res, next)
}

const getAllCompanies = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {rows:companies} = await Company.findAndCountAll({
            limit:20,
            include: [
                {model:Profile, as:"profiles"},
                {model:User, as:"owner"}
            ]
        })
        res.json(companies)
    } catch (error) {
        next(ErrorHandler.internalServerError(error.message, error))
    }
}

const getOneCompany = async (req:Request, res:Response, next:NextFunction) => {
    const companyUuid = req.params.id 
    try {
        const company = await Company.findOne({
            where: {
                companyUuid
            },
            include: {model:Profile, as:"profiles"}
        })
        if(company == null) {
            return next( ErrorHandler.notFound("Can't find company."))
        }
        res.json(company)
    } catch (error) {
        next(ErrorHandler.internalServerError(error.message, error))
    }
}



const updateCompany = async (req:Request, res:Response, next:NextFunction) => {
    const companyUuid = req.params.id
    let {companyName, logo}:ICompany = req.body.company    

    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.unauthorized("Not Authenticated", {filePath, ...error}))
        }
        try {
            const company = await Company.findOne({
                where:{companyUuid}
            })
            if(company == null) {
            return next( ErrorHandler.notFound("Company with this companyUuid doesn't exist"))
            }
            if(user.id !== company.companyOwner) {
                return next( ErrorHandler.forbidden("Not Authorized"))
            }
            const companyOwner = user.id
            const profile = await Profile.findOne({where:{userId: companyOwner}})
            if(profile == null) {
                return next( ErrorHandler.forbidden( "You must have profile to create a company"))
            }
            if(companyName == null) {
                companyName = `${profile.name}'s Company`
            }

            const slug = slugify(companyName) // if database don't handle this
            company.set({
                companyName, 
                logo,
                slug
            })
            company.save()
            res.json(company)
    
        } catch (error) {
            next(ErrorHandler.internalServerError(error.message, error))
        }
    })(req, res, next)
    
}

const deleteCompany = async (req:Request, res:Response, next:NextFunction) => {
    const companyUuid = req.params.id 
    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.unauthorized("Not Authenticated", {filePath, ...error}))
        }
        try {
            const company = await Company.findOne({where: {companyUuid}})
            if(company == null) {
                return next( ErrorHandler.badRequest("Company with this companyUuid doesn't exist"))
            }
            if(user.id !== company.companyOwner) {
                return next( ErrorHandler.methodNotAllowed("Not Allowed"))
            }

            company.destroy()

            return res.json({
                message: "Company deleted"
            })
        } catch (error) {
            next(ErrorHandler.internalServerError(error.message, error))
        }
        
    })(req, res, next)
    
}

export {
    createCompany, getAllCompanies, getOneCompany, updateCompany, deleteCompany
}