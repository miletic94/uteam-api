import express from "express"
import {
    createCompany, getAllCompanies, 
    getOneCompany,
    updateCompany, deleteCompany
} from "../controllers/company"
import { validateCompany } from "../middleware/validation/company"
import { validateUuid } from "../middleware/validation/uuid"

const router = express.Router()

router.post("/companies", validateCompany, createCompany)
router.get("/companies", getAllCompanies)
router.get("/companies/:id", validateUuid, getOneCompany)
router.put("/companies/:id", validateCompany, updateCompany)
router.delete("/companies/:id", validateUuid, deleteCompany)


export = router