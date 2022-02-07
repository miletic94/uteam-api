import {Request, Response, NextFunction } from "express"
import passport from "passport"
import { ICompany } from "../interfaces/company"
import Company from "../models/company"
import Profile from "../models/profile"
import User from "../models/user"
import isUuid from "is-uuid"
import { ErrorHandler } from "../middleware/errorHandler/ErrorHandler"

const createCompany = async (req:Request, res:Response, next:NextFunction) => {
    let {name, logo, slug, profileUuid}:ICompany = req.body

    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.internalServerError("Something went wrong while creating company"))
        }
        const companyOwner = user.id
        try {
            const profile = await Profile.findOne({where:{userId: companyOwner}})
                if(profile == null) {
                    return next( ErrorHandler.forbidden( "You must have profile to create a company"))
                }
            if(name == null) {
                name = `${profile.name}'s Company`
            }

            const company = await Company.create({
                name,
                logo,
                slug,
                companyOwner
            })
            res.json(company)
        } catch (error) {
            res.status(500).json({
                message: error.message,
                error
            })
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
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const getOneCompany = async (req:Request, res:Response, next:NextFunction) => {
    const companyUuid = req.params.id 
    if(!isUuid.v4(companyUuid)) {
        return next( ErrorHandler.badRequest("You must enter valid companyUuid"))
    }
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
        res.status(500).json({
            message: error.message,
            error
        })
    }
}



const updateCompany = async (req:Request, res:Response, next:NextFunction) => {
    const companyUuid = req.params.id
    let {name, logo}:ICompany = req.body    

    if(!isUuid.v4(companyUuid)) {
        return next( ErrorHandler.badRequest("You must enter valid companyUuid"))
    }
    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.internalServerError("Something went wrong while updating company"))
        }
        console.log(req.user)
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
            
            if(name == null) {
                return next( ErrorHandler.badRequest("Name can't be empty"))
            }
    
            if(logo == null) {
                logo = "https://cdn4.vectorstock.com/i/1000x1000/18/58/swoosh-generic-logo-vector-21061858.jpg"
            }
    
            company.set({
                name, 
                logo
            })
            company.save()
            res.json(company)
    
        } catch (error) {
            res.status(500).json({
                message: error.message,
                error
            })
        }
    })(req, res, next)
    
}

const deleteCompany = async (req:Request, res:Response, next:NextFunction) => {
    const companyUuid = req.params.id 

    if(!isUuid.v4(companyUuid)) {
        return next( ErrorHandler.badRequest("You must enter valid companyUuid"))
    }
    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.internalServerError("Something went wrong while deleting company"))
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
            res.status(500).json({
                message: error.message,
                error
            })
        }
        
    })(req, res, next)
    
}

export {
    createCompany, getAllCompanies, getOneCompany, updateCompany, deleteCompany
}