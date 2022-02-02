import {Request, Response, NextFunction } from "express"
import { IProfile, Status } from "../interfaces/profile"
import Company from "../models/company"
import Profile from "../models/profile"
import User from "../models/user"
import { getIdFromUuid } from "../utils/utils"

const createProfile = async (req:Request, res:Response, next:NextFunction) => {
    const { status, name, profilePhoto, userUuid, companyUuid }:IProfile = req.body.profile 
    let userId: number
    let companyId: number | null = null
    if(name == null || userUuid == null) {
        return res.status(400).json({
            message: "Must insert 'name' and 'userUuid' "
        })
    }
    try {
        userId = await getIdFromUuid(
            userUuid,
            (userUuid) => {
                return User.findOne({where: {userUuid}}) 
            }
        ) as number // Function is set up to throw error if null is return value, and allow Null is set to false
        
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
        res.status(201).json(profile)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const getAllProfiles = async (req:Request, res:Response, next:NextFunction) => {

    try {
        const {count, rows:profiles} = await Profile.findAndCountAll({
            include: [{model: User, as: "user"}, {model:Company, as: "company"}],
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
    const uuid = req.params.id 
    try {
        const profile = await Profile.findOne({
            where: {
                profileUuid: uuid,
            },
            include:[{model:User, as: "user"}, {model:Company, as: "company"}]
        })
        if(profile == null) {
            return res.status(406).json({
                message: "Can't find profile."
            })
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

    try {
        if(profileUuid == null || profileUuid.trim() == "") {
            return res.status(400).json({
                message: "Must enter profileUuid"
            })
        }
        console.log(profileUuid)
    
        const profile = await Profile.findOne({
            where: {
                profileUuid
            }
        })
        if (profile == null) {
            return res.status(500).json({
                message: "Profile with this profileUuid doesn't exist"
            })
        }
        // To connect Profile to a Company (as employee)
        const companyUuid:string | undefined = req.body.companyId
        
        const companyId = await getIdFromUuid(companyUuid, (companyUuid) => {
            const company =Company.findOne({
                where: {
                    companyUuid
                }
            })
            return company
        }, true)
        //-----------------------------------------------// 
        if(name == null) {
            return res.status(400).json({
                message: "Name can't be empty"
            })
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

        res.json({
            profile
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const deleteProfile = async (req:Request, res:Response, next:NextFunction) => {
    const uuid = req.params.id 
    try {
        await Profile.destroy({
            where: {
                profileUuid: uuid
            }
        })
        return res.json({
            message: "Profile deleted if existed"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

export { createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }