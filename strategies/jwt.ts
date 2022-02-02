import { Request, Response, NextFunction } from "express"
import { PassportStatic } from "passport"
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifyCallback} from "passport-jwt"
import User from "../models/user"

import passport from "passport"
import config from "../config/config"

export default function initialize(secret:string, passport:PassportStatic) {
    const authorizeUser:VerifyCallback  = async (payload, done)=> {
        const user = await User.findOne({where: {username: payload.sub}})
        
        if(user == null) {
            return done(null, false, {
                message: "Not authorized"
            })
        }
        if(user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    }

    const options:StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
        algorithms: ["HS256"]
    }
    passport.use(new JwtStrategy(options, authorizeUser))
}

export function authorize(req:Request, res:Response, next:NextFunction) {
    passport.authenticate("jwt", (error, user, info) => {
        if(error) {
            return res.status(500).json(error)
        } 
        if(user) {
            return next()
        } else if (info) {
            return res.json(info)
        }
    })(req, res, next)
}
