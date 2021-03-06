import {Request, Response, NextFunction } from "express"
import { IUser } from "../interfaces/user"
import signJWT from "../utils/signJWT"
import  passport  from "passport"

import User from "../models/user"
import Profile from "../models/profile"

import {initializeLocalStrategy} from "../strategies/local"
import { IProfile } from "../interfaces/profile"
import { ICompany } from "../interfaces/company"
import Company from "../models/company"
import { ErrorHandler } from "../middleware/errorHandler/ErrorHandler"
import slugify from "slugify"

const filePath = process.env.NODE_ENV === "production"? null : __filename

const register = async (req:Request, res:Response, next:NextFunction) => {
    let {username, email, password, role}:IUser = req.body.user
    const { status, name:profileName, profilePhoto }:IProfile = req.body.profile 
    let {companyName, logo, slug, companyOwner}:ICompany = req.body.company
    let userId:number
    
    try {
        // Ako ima generic u Model<UserAttributes> onda izbacuje grešku kada se ovde ne implementira dobro. 
        // U suprotnom ne reaguje
        const user = await User.create({
            username,
            email,
            password,
            role
        })

        userId = user.id
        const profile = await Profile.create({
            name: profileName,
            status,
            profilePhoto,
            userId
        })
        companyOwner = user.id
        // If user didn't enter companyName, we are making the default one.
        // But if profile names are equal for 2 users, then company names 
        // are going to be equal for them. We want to avoid prompting user
        // to enter unique company name that he didn't enter in the first place. 
        if(companyName == null) {
            companyName = `${profile.name}'s Company`
            if(await Company.findOne({where: {companyName}})){
                companyName = `${companyName}-1`
            }
        }
        // slug is here in case database doesn't handle this
        const slug = slugify(companyName)
        
        const company = await Company.create({
            companyName,
            logo,
            slug,
            companyOwner
        })
        res.status(201).json({
            "user": user,
            "profile": profile,
            "company": company
        })

    } catch(error) {
        if(error.message === "Validation error") {
            return next(ErrorHandler.badRequest(
                error.errors[0].message, 
                {value: error.errors[0].value}))
        }
        next(ErrorHandler.internalServerError(error.message, error))
    }
}


const login = async (req:Request, res:Response, next:NextFunction) => {
    const {username, email}:IUser = req.body
    if(username == null && email == null) {
        return next(ErrorHandler.badRequest("You must enter username or email"))
    }
    if(username) {
        initializeLocalStrategy("username", username, passport)

    } else if (email) {
        initializeLocalStrategy("email", email, passport)
    }
    passport.authenticate("local", (error, user:IUser, info) => {
        if(error) {
        return next( ErrorHandler.internalServerError(error.message))
    
        }
        if(user) {
            signJWT(user, (error, token) => {
                if(error) {
                    return next( ErrorHandler.internalServerError(error.message))
                }
                if(token) {
                    res.json({
                        message: "OK",
                        token: `Bearer ${token}`
                    })
                } 
            })
        } else {
            return res.json(info)
        }
    })(req, res, next)
}



//HELPER CONTROLLERS - NOT FOR PRODUCTION
const getAll = async (req:Request, res:Response, next:NextFunction) => {

    try {
        const users = await User.findAll({
            include: [
                {model: Profile, as: "profile"}, 
                {model:Company, as: "ownedCompanies"}
            ]
        })
        console.log({first:"first"});
        res.json(users)
    } catch (error) {
        next(ErrorHandler.internalServerError(error.message, error))
    }
    
}

// Not from assigment
const deleteOne = async (req:Request, res:Response, next:NextFunction) => {
    const userUuid = req.params.id
    await User.destroy({
        where: {userUuid},
        truncate: false
    })
    next()
}


const deleteAll = async (req:Request, res:Response, next:NextFunction) => {

    
    await User.destroy({
        where: {}
        // truncate: true
    })
    next()
}

export {register, login, getAll, deleteAll, deleteOne}