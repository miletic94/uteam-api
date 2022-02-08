import express from "express";
import {register, login, getAll, deleteOne, deleteAll } from "../controllers/user"
import { validateCompany } from "../middleware/validation/company";
import { validateLogin } from "../middleware/validation/login";
import { validateProfile } from "../middleware/validation/profile";
import { validateUser } from "../middleware/validation/user";
const router = express.Router()



router.post("/register",validateUser,validateProfile,validateCompany,register)
router.post("/login", validateLogin, login)
router.get("/get/all/users", getAll)
router.delete("/delete/all/users", deleteAll, getAll)
router.delete("/users/delete/:id", deleteOne, getAll)

export = router