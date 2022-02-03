import express, { application, Application } from "express";
import "dotenv/config"
import config from "../config/config";
import { sequelize } from "../models";
import passport from "passport"

import healthCheckRoute from "../routes/healthCheck";
import userRoutes from "../routes/user"
import profileRoutes from "../routes/profile"
import companyRoutes from "../routes/company"

const app:Application = express()
app.use(express.json())
app.use(passport.initialize())
app.use("/", [healthCheckRoute, userRoutes, profileRoutes, companyRoutes])

sequelize.sync({force:true}).then(() => {
    app.listen(config.server.port, () => {
        console.log(`App is listening to port:${config.server.port}`)
    })
}) 




