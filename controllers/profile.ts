import {Request, Response, NextFunction } from "express"
import passport from "passport"
import { IProfile } from "../interfaces/profile"
import Company from "../models/company"
import Profile from "../models/profile"
import User from "../models/user"
import { getIdFromUuid } from "../utils/utils"
import { ErrorHandler } from "../middleware/errorHandler/ErrorHandler"

const filePath = process.env.NODE_ENV === "production"? null : __filename

const createProfile = async (req:Request, res:Response, next:NextFunction) => {
    const { status, name, profilePhoto, companyUuid }:IProfile = req.body.profile 

    let userId: number
    let companyId: number | null = null

    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.unauthorized("Not Authenticated", {filePath, ...error}))
        }
        userId = user.id

        try {
            // TESTIRATI !!!
            if(companyUuid) {
                companyId = await getIdFromUuid(
                    companyUuid, 
                    (companyUuid) => {
                    return Company.findOne({where: {companyUuid}})
                }, 
                true)
            }
            
            const profile = await Profile.create({
                status,
                name,
                profilePhoto,
                userId,
                companyId
            })
            return res.status(201).json(profile)
        } catch (error) {
            next(ErrorHandler.internalServerError(error.message, error))
        }
    })(req, res, next)
    
}

const getAllProfiles = async (req:Request, res:Response, next:NextFunction) => {

    try {
        const {count, rows:profiles} = await Profile.findAndCountAll({
            include:[
                {
                    model:User, as: "user",
                    include: [{model:Company, as: "ownedCompanies"}]
                }, 
                {model:Company, as: "company"}
            ],
            limit: 20
        })
        res.json(profiles)
    } catch (error) {
        next(ErrorHandler.internalServerError(error.message, error))
    }
}

const getOneProfile = async (req:Request, res:Response, next:NextFunction) => {
    const profileUuid = req.params.id 

    try {
        const profile = await Profile.findOne({
            where: {
                profileUuid,
            },
            include:[
                {
                    model:User, as: "user",
                    include: [{model:Company, as: "ownedCompanies"}]
                }, 
                {model:Company, as: "company"}
            ]
        })
        if(profile == null) {
            return next( ErrorHandler.badRequest("Can't find profile."))
        }
        res.json(profile)
    } catch (error) {
        next(ErrorHandler.internalServerError(error.message, error))
    }
}

const updateProfile = async (req:Request, res:Response, next:NextFunction) => {
    const profileUuid = req.params.id
    const { status, name, profilePhoto, companyUuid }:IProfile = req.body.profile 

    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.unauthorized("Not Authenticated", {filePath, ...error}))
        }
        try {
        
            const profile = await Profile.findOne({
                where: {
                    profileUuid
                }
            })
            if (profile == null) {
                return next( ErrorHandler.notFound("Profile with this profileUuid doesn't exist"))
            }
            if(user.id !== profile.userId) {
                return next( ErrorHandler.forbidden("Not Authorized"))
            }
            // To connect Profile to a Company (as employee)

            
            const companyId = await getIdFromUuid(companyUuid, (companyUuid) => {
                const company = Company.findOne({
                    where: {
                        companyUuid
                    }
                })
                return company
            }, true)
            //-----------------------------------------------// 
            console.log({companyId});
            console.log({updating: true})
            profile.set({
                name,
                profilePhoto,
                status,
                companyId
            })
    
            profile.save()
    
            res.json(profile)
        } catch (error) {
            next(ErrorHandler.internalServerError(error.message, error))
        }
    })(req, res, next)

}

const deleteProfile = async (req:Request, res:Response, next:NextFunction) => {
    const profileUuid = req.params.id 

    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.unauthorized("Not Authenticated", {filePath, ...error}))
        }
        try {
            const profile = await Profile.findOne({
                where: {
                    profileUuid
                }
            })
            if(profile == null) {
                return next( ErrorHandler.notFound("Profile with this profileUuid doesn't exist"))
            }
            if(user.id !== profile.userId) {
                return next( ErrorHandler.methodNotAllowed("Not Authorized"))
            }

            profile.destroy()

            return res.json({
                message: "Profile deleted"
            })
        } catch (error) {
            next(ErrorHandler.internalServerError(error.message, error))
        }
    })(req, res, next)
    
}

export { createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }