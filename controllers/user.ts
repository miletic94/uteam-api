import {Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { IUser } from "../interfaces/user"
import signJWT from "../utils/signJWT"
import { checkRegex } from "../utils/utils"

import User from "../models/user"
import Profile from "../models/profile"

const register = async (req:Request, res:Response, next:NextFunction) => {
    let {username, email, password}:IUser = req.body

    if(username == null || email == null || password == null ) {
        return res.status(400).json({
            message: "Must enter username, email, and password"
        })
    }
    
    if(!checkRegex(/^[a-zA-Z](?:[0-9][#%-_*])*/, username)) {
        return res.status(400).json({
            message: "Username starts with character, contains characters, numbers and any of this symbols: #, %, -, _, *. Choose wisely"
        })
    }

    if(password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        })
    }

    try {
        const  hashedPassword = await bcrypt.hash(password, 10)
        // Ako ima generic u Model<UserAttributes> onda izbacuje grešku kada se ovde ne implementira dobro. 
        // U suprotnom ne reaguje
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        })

        res.status(201).json(user)

    } catch(error) {
        console.error(error)
        return res.json({
            message: error.message,
            error
        })
    }
}

const login = async (req:Request, res:Response, next:NextFunction) => {
    const {username, email, password}:IUser = req.body
    if(username == null && email == null) {
        return res.status(400).json({
            message: "You must enter email or password"
        })
    }
    try {
        const user = username ? 
            await User.findOne({where: {username}}):
            await User.findOne({where: {email}})

        if(user == null) {
            return res.status(406).json({ // PRODUCTION??
                message: "Can't find user"
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            signJWT(user, (error, token) => {
                if(error) {
                    return res.status(500).json({
                        message: error.message,
                        error
                    })
                }
                if(token) {
                    return res.status(200).json({
                        message: "OK",
                        token
                    })
                }
            })
        } else {
            res.status(403).json({
                message: "Not Allowed"
            })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message,
            error
        })
    }

}


//HELPER CONTROLLERS - NOT FOR PRODUCTION
const getAll = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        res.json({
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