import { PassportStatic } from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local"
import { IUser } from "../interfaces/user";
import bcrypt from "bcrypt"
import User from "../models/user";

export  function initializeLocalStrategy(tactics:"username", passport: PassportStatic, callback:(username:string) => Promise<User | null>):void
export function initializeLocalStrategy(tactics:"email" ,passport: PassportStatic, callback:(email:string) => Promise<User | null>):void

export function initializeLocalStrategy(tactics:"username" | "email", passport:PassportStatic, callback:(credential:string) => Promise<User | null>) {
    const authenticateUser:VerifyFunction = async ( credential, password, done) => {

        try {
            const user = await callback(credential)

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