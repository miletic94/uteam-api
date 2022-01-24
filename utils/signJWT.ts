import jwt from "jsonwebtoken"
import config from "../config/config"
import { IUser } from "../interfaces/user"

const signJWT = (user:IUser, callback: (error: Error | null, token: string | null) => void):void => {

    try {
        jwt.sign( {
            user: user.username
        }, 
        config.server.token.secret as string,
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
        console.error(error.message, error)
        callback(error, null)
    }
}

export default signJWT