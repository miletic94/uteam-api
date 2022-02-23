import express from "express";
import {
    createProfile, getAllProfiles, getOneProfile, updateProfile, deleteProfile }
from "../controllers/profile"
import { validateProfile } from "../middleware/validation/profile";
import { validateUuid } from "../middleware/validation/uuid";


const router = express.Router()

router.post("/profiles", validateProfile, createProfile)
router.get("/profiles", getAllProfiles)
router.get("/profiles/:id", validateUuid, getOneProfile)
router.put("/profiles/:id", validateUuid, validateProfile, updateProfile)
router.delete("/profiles/:id", validateUuid, deleteProfile)

export = router