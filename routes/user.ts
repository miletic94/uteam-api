import express from "express";
import {register, login, getAll, deleteOne, deleteAll } from "../controllers/user"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/get/all/users", getAll)
router.delete("/delete/all/users", deleteAll, getAll)
router.delete("/users/delete/:id", deleteOne, getAll)

export = router