
import express, { Application } from "express";
import "dotenv/config"
import config from "../config/config";

import db from "../models"
import healthCheckRoute from "../routes/healthCheck";

const app:Application = express()
app.use(express.json())


db.sequelize.sync().then(() => {
    app.listen(config.server.port, () => {
        console.log(`App is listening to config.server.port:${config.server.port}`)
    })
}) 

app.use("/", healthCheckRoute)



