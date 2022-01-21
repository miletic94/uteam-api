import {Request, Response, NextFunction} from "express"

const healthCheck = (req:Request, res:Response, next: NextFunction) => {
    res.json({
        msg: "OK"
    })
}

export { healthCheck }
