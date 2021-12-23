
import express, { Application, Request, Response } from "express";
import "dotenv/config"

const app:Application = express()
app.use(express.json())

const PORT:string = process.env.PORT || "5000"

app.get("*", (req:Request, res:Response) => {
    res.json({message: "0K"})
})

app.listen(PORT, () => {
    console.log(`App is listening to port:${PORT}`)
})

