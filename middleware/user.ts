import {Request, Response, NextFunction} from "express"
import { IUser } from "../interfaces/user"
import { checkRegex } from "../utils/utils"
import { Role } from "../interfaces/user"
import bcrypt from "bcrypt"

const collectUserData = async (req:Request, res:Response, next:NextFunction) => {
    console.log("collecting user data")

    let {username, email, password, role}:IUser = req.body.user

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

    if(role == null || (!Object.values(Role).includes(role))) {
        role = Role.USER
    }

    try {
        const  hashedPassword = await bcrypt.hash(password, 10)

        const user = {
            username, 
            email, 
            password: hashedPassword,
            role
        }
        req.body.user = user
        next()
    } catch(error) {
        return res.status(500).json({
            message: error.message,
            error
        })
    }
}

export {collectUserData}