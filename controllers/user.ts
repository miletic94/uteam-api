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


const register = async (req:Request, res:Response, next:NextFunction) => {
    let {username, email, password, role}:IUser = req.body.user
    const { status, name:profileName, profilePhoto }:IProfile = req.body.profile 
    let {name:companyName, logo, slug, companyOwner}:ICompany = req.body.company
    let userId:number

    if(username == null || email == null || password == null ) {
        return res.status(400).json({
            message: "Must enter username, email, and password"
        })
    }
    if(profileName == null) {
        return res.status(400).json({
            message: "Profile name can't be empty"
        })
    }
    
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
        if(companyName == null) {
            companyName = `${profile.name}'s Company`
        }
        const compoany = await Company.create({
            name: companyName,
            logo,
            slug,
            companyOwner
        })
        res.status(201).json({
            "user": user,
            "profile": profile
        })

    } catch(error) {
        return res.status(500).json({
            message: error.message,
            error
        })
    }
}


const login = async (req:Request, res:Response, next:NextFunction) => {
    const {username, email}:IUser = req.body
    if(username == null && email == null) {
        return res.status(400).json({
            message: "You must enter email or password"
        })
    }
    if(username) {
        initializeLocalStrategy("username", passport, (username) => {
            const _user = User.findOne({
                where: {
                    username
                }
            })
            return _user
        })
    } else if (email) {
        initializeLocalStrategy("email", passport, (email) => {
            const _user = User.findOne({
                where: {
                    email
                }
            })
            return _user
        })
    }
    passport.authenticate("local", (error, user:IUser, info) => {
        if(error) {
            return res.status(500).json(error)
        }
        if(user) {
            signJWT(user, (error, token) => {
                if(error) {
                    return res.status(500).json({
                        message: error.message,
                        error
                    })
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
        }
        )
        res.json(users)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
    
}
const deleteOne = async (req:Request, res:Response, next:NextFunction) => {
    const userUuid = req.params.id
    console.log(userUuid);
    await User.destroy({
        where: {userUuid},
        truncate: false
    })
    next()
}


const deleteAll = async (req:Request, res:Response, next:NextFunction) => {
    await User.destroy({
        where: {},
        // truncate: true
    })
    next()
}

export {register, login, getAll, deleteAll, deleteOne}