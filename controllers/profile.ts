import {Request, Response, NextFunction } from "express"
import { IProfile, Status } from "../interfaces/profile"
import Profile from "../models/profile"
import User from "../models/user"

const createProfile = async (req:Request, res:Response, next:NextFunction) => {
    const { status, name, profilePhoto, userUuid }:IProfile = req.body 
    if(name == null || userUuid == null) {
        return res.status(400).json({
            message: "Must insert 'name' and 'userUuid' "
        })
    }
    try {
        const user = await User.findOne({
            where: {userUuid}
        })
        if(user == null) {
            return res.status(406).json({
                message: "User with specific ID was not found" // PRODUCTION
            })
        }

        const profile = await Profile.create({
            status,
            name,
            profilePhoto,
            userId: user.id
        })
        res.status(201).json(profile)
    } catch (error) {
        res.json({
            message: error.message,
            error
        })
    }
}

const getAllProfiles = async (req:Request, res:Response, next:NextFunction) => {

    try {
        const {count, rows:profiles} = await Profile.findAndCountAll({
            include: [{model: User, as: "user"}],
            limit: 20
        })
        res.json(profiles)
    } catch (error) {
        res.json({
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
                profileUuid: uuid
            }
        })
        res.json(profile)
    } catch (error) {
        res.json({
            message: error.message,
            error
        })
    }
}

const updateProfile = async (req:Request, res:Response, next:NextFunction) => {
    const uuid = req.params.id
    let {name, profilePhoto, status}:IProfile = req.body
    if(name == null) {
        return res.status(400).json({
            message: "Name can't be empty"
        })
    }
    if(profilePhoto == null) {
        profilePhoto = "https://image.shutterstock.com/shutterstock/photos/1373616899/display_1500/stock-vector-hand-drawn-modern-man-avatar-profile-icon-or-portrait-icon-user-flat-avatar-icon-sign-1373616899.jpg"
    }
    if(status == null) {
        status = Status.PENDING
    }
    try {
        // const profile = await Profile.findOne({
        //     where: {
        //         profileUuid: uuid
        //     }
        // })
        // if(profile == null) {
        //     return res.json({
        //         message: "Profile doesn't exist"
        //     })
        // }
        const updatedStatus = await Profile.update({ 
            name, 
            profilePhoto, 
            status
        }, 
        {
            where: {
              profileUuid: uuid
            }
        });
        if(updatedStatus[0] === 1) {
            const profile =await Profile.findOne({
                where: {
                    profileUuid: uuid
                }
            })
            return res.json(profile)
        }
        return res.json({
            message: "Something went wrong. Profile probably doesn't exist"
        })

    } catch (error) {
        res.json({
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
        res.json({
            message: error.message,
            error
        })
    }
}

export { createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }