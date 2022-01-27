import express from "express"
import {
    createCompany, getAllCompanies, 
    getOneCompany,
    updateCompany, deleteCompany
} from "../controllers/company"
getOneCompany
const router = express.Router()

router.get("/companies", getAllCompanies)
router.post("/companies", createCompany)
router.get("/companies/:id", getOneCompany)
router.put("/companies/:id", updateCompany)
router.delete("/companies/:id", deleteCompany)


export = router