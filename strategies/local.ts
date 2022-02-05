import { PassportStatic } from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local"
import bcrypt from "bcrypt"
import User from "../models/user";

export  function initializeLocalStrategy(tactics:"username", credential:string, passport: PassportStatic):void
export function initializeLocalStrategy(tactics:"email", credential:string, passport: PassportStatic):void

export function initializeLocalStrategy(tactics:"username" | "email", credential:string, passport:PassportStatic) {
    const authenticateUser:VerifyFunction = async ( credential, password, done) => {

        try {
            let user
            if(tactics === "username") {
                user = await User.findOne({where:{username: credential}})
            } else if (tactics === "email") {
                user = await User.findOne({where: {email: credential}})
            }

            if(user == null) {
                return done(null, false, {
                    message: `Can't find user with that ${tactics==="email" ? "email" : "username"}`
                })
            }

            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "Not Allowed"
                })
            }
        } catch (error) {
            done(error, null)
        }
        
    }
    if(tactics === "email") {
        passport.use(new LocalStrategy({usernameField: "email"}, authenticateUser))
    } else {
        passport.use(new LocalStrategy( authenticateUser))
    }
}