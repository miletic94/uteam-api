import express from "express";
import {
    createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }
 from "../controllers/profile"

const router = express.Router()

router.post("/profiles", createProfile)
router.get("/profiles", getAllProfiles)
router.get("/profiles/:id", getOneProfile)
router.put("/profiles/:id", updateProfile)
router.delete("/profiles/:id", deleteProfile)

export = router