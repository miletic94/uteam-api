import {Request, Response, NextFunction } from "express"
import passport from "passport"
import { IProfile } from "../interfaces/profile"
import Company from "../models/company"
import Profile from "../models/profile"
import User from "../models/user"
import { getIdFromUuid } from "../utils/utils"
import isUuid from "is-uuid"
import { ErrorHandler } from "../middleware/errorHandler/ErrorHandler"

const createProfile = async (req:Request, res:Response, next:NextFunction) => {
    const { status, name, profilePhoto, companyUuid }:IProfile = req.body 
    let userId: number
    let companyId: number | null = null
    if(name == null) {
        return next( ErrorHandler.badRequest( "Must enter name"))

    }
    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.internalServerError("Something went wrong while creating profile"))
        }
        userId = user.id

        try {
            // TESTIRATI !!!
            if(companyUuid && isUuid.v4(companyUuid)) {
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
            res.status(500).json({
                message: error.message,
                error
            })
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
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const getOneProfile = async (req:Request, res:Response, next:NextFunction) => {
    const profileUuid = req.params.id 
    if(!isUuid.v4(profileUuid)) {
        return next(ErrorHandler.badRequest("You must enter valid profileUuid"))
    }
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
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const updateProfile = async (req:Request, res:Response, next:NextFunction) => {
    const profileUuid = req.params.id
    let {name, profilePhoto, status}:IProfile = req.body
    if(!isUuid.v4(profileUuid)) {
        return next( ErrorHandler.badRequest("You must enter valid profileUuid"))
    }
    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.internalServerError("Something went wrong while updating profile"))
        }
        try {
            if(profileUuid == null || profileUuid.trim() == "") {
                return next( ErrorHandler.badRequest("Must enter profileUuid"))
            }
        
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
            const companyUuid:string | undefined = req.body.companyId
            
            const companyId = await getIdFromUuid(companyUuid, (companyUuid) => {
                const company = Company.findOne({
                    where: {
                        companyUuid
                    }
                })
                return company
            }, true)
            //-----------------------------------------------// 
            if(name == null) {
                return next( ErrorHandler.badRequest("Name can't be empty"))
            }
        
            if(profilePhoto == null) {
                profilePhoto = "https://image.shutterstock.com/shutterstock/photos/1373616899/display_1500/stock-vector-hand-drawn-modern-man-avatar-profile-icon-or-portrait-icon-user-flat-avatar-icon-sign-1373616899.jpg"
            }
        
            profile.set({
                name,
                profilePhoto,
                status,
                companyId
            })
    
            profile.save()
    
            res.json(profile)
        } catch (error) {
            res.status(500).json({
                message: error.message,
                error
            })
        }
    })(req, res, next)

}

const deleteProfile = async (req:Request, res:Response, next:NextFunction) => {
    const profileUuid = req.params.id 
    if(!isUuid.v4(profileUuid)) {
        return next( ErrorHandler.badRequest("You must enter valid profileUuid"))
    }
    passport.authenticate("jwt", async (error, user) => {
        if(error || !user) {
            return next( ErrorHandler.internalServerError("Something went wrong while deleting profile"))
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
                return next( ErrorHandler.forbidden("Not Authorized"))
            }

            profile.destroy()

            return res.json({
                message: "Profile deleted"
            })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                error
            })
        }
    })(req, res, next)
    
}

export { createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }