import express from "express";
import passport from "passport";
import config from "../config/config";
import {
    createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }
from "../controllers/profile"

import initializeJwt from "../strategies/jwt";

initializeJwt(
    config.server.token.secret,
    passport
)

const router = express.Router()

router.post("/profiles", createProfile)
router.get("/profiles", getAllProfiles)
router.get("/profiles/:id", getOneProfile)
router.put("/profiles/:id", updateProfile)
router.delete("/profiles/:id", deleteProfile)

export = router