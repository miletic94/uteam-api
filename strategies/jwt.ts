import { PassportStatic } from "passport"
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifyCallback} from "passport-jwt"
import User from "../models/user"

export default function initialize(secret:string, passport:PassportStatic) {
    const authorizeUser:VerifyCallback  = async (payload, done)=> {
        try {
            const user = await User.findOne({where: {username: payload.sub}})
            if(user == null) {
                console.log("USER NULL Authenticate")
                return done(null, false, {
                    message: "Not authorized"
                })
            }
            if(user) {
                console.log("USER THERE Authenticate");
                return done(null, user)
            } else {
                console.log("ELSE Authenticate")
                return done(null, false)
            }
        } catch(error) {
            done(error)
        }
    }

    const options:StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
        algorithms: ["HS256"]
    }
    passport.use(new JwtStrategy(options, authorizeUser))

}

