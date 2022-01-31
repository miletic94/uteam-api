import { ICompany } from "../interfaces/company"


const checkRegex = (regex: RegExp, text:string) => {
    return regex.test(text)
}

// GENERALISE??
async function getCompanyId(uuid:string | undefined, callback: (uuid:string | undefined) => Promise<ICompany | null>):Promise<number | null> {

    let companyId
    if(uuid=== undefined) {
        companyId = null
        console.log("Com NULL")
    } else {
        const company = await callback(uuid)
        if(company == null) {
            console.error("Can't find company")
            return null
        }
        return company.id
    }
    return companyId
}

const capitalize = (string:string) => {
    return string.charAt(0) + string.slice(1)
}

export { checkRegex, getCompanyId, capitalize }