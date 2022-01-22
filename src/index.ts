import express, { Application } from "express";
import "dotenv/config"
import config from "../config/config";

import db from "../models"
import healthCheckRoute from "../routes/healthCheck";
import userRoutes from "../routes/user"

const app:Application = express()
app.use(express.json())

app.use("/", healthCheckRoute)
app.use("/", userRoutes)

db.sequelize.sync({force: true}).then(() => {
    app.listen(config.server.port, () => {
        console.log(`App is listening to config.server.port:${config.server.port}`)
    })
}) 




