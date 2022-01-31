import jwt from "jsonwebtoken"
import config from "../config/config"
import { IUser } from "../interfaces/user"

const signJWT = (user:IUser, callback: (error: Error | null, token: string | null) => void):void => {
    
    try {
        jwt.sign( {
            sub: user.username
        }, 
        config.server.token.secret,
        {
            algorithm: "HS256",
            expiresIn: 60
        }, 
        (error, token) => {
            if(error) {
                callback(error, null)
            } else if (token) {
                callback(null, token)
            }
        } )
    } catch (error) {
        callback(error, null)
    }
}

export default signJWT