import {Request, Response, NextFunction } from "express"
import slugify from "slugify"
import { ICompany } from "../interfaces/company"
import Company from "../models/company"
import Profile from "../models/profile"

const createCompany = async (req:Request, res:Response, next:NextFunction) => {
    let {name, logo }:ICompany = req.body
    if(name == null) {
        return res.status(400).json({
            message: "Name can't be empty"
        })
    }
    if(logo == null) {
        logo = "https://cdn4.vectorstock.com/i/1000x1000/18/58/swoosh-generic-logo-vector-21061858.jpg"
    }

    const slug = slugify(name, {
        lower: true
    })

    try {
        const company = await Company.create({
            name,
            logo,
            slug
        })
        res.json(company)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const getAllCompanies = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {rows:companies} = await Company.findAndCountAll({
            limit:20,
            include: {model:Profile, as:"profiles"}
        })
        res.json(companies)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const getOneCompany = async (req:Request, res:Response, next:NextFunction) => {
    const uuid = req.params.id 
    try {
        const company = await Company.findOne({
            where: {
                companyUuid: uuid
            },
            include: {model:Profile, as:"profiles"}
        })
        if(company == null) {
            return res.status(406).json({
                message: "Can't find company.",
            })
        }
        res.json(company)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const updateCompany = async (req:Request, res:Response, next:NextFunction) => {
    const uuid = req.params.id
    let {name, logo}:ICompany = req.body
    if(name == null) {
        return res.status(400).json({
            message: "Name can't be empty"
        })
    }
    const slug = slugify(name)
    if(logo == null) {
        logo = "https://cdn4.vectorstock.com/i/1000x1000/18/58/swoosh-generic-logo-vector-21061858.jpg"
    }

    try {
        const updatedStatus = await Company.update({ 
            name, 
            logo,
            slug
        }, 
        {
            where: {
              companyUuid: uuid
            }
        });
        if(updatedStatus[0] === 1) {
            const company = await Company.findOne({
                where: {
                    companyUuid: uuid
                }
            })
            return res.json(company)
        }
        return res.status(500).json({
            message: "Something went wrong. Company probably doesn't exist"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

const deleteCompany = async (req:Request, res:Response, next:NextFunction) => {
    const uuid = req.params.id 
    try {
        await Company.destroy({
            where: {
                companyUuid: uuid
            }
        })
        return res.json({
            message: "Company deleted if existed"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

export {
    createCompany, getAllCompanies, getOneCompany, updateCompany, deleteCompany
}