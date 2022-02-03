import { ICompany } from "../interfaces/company"


const checkRegex = (regex: RegExp, text:string) => {
    return regex.test(text)
}

async function getIdFromUuid<T extends {id:number}>(uuid:string | undefined, callback: (uuid:string | undefined) => Promise<T | null>, allowNull:boolean = false) {

    if(uuid=== undefined) {
        if(allowNull) {
            console.log("getIdFromUuid: Uuid is undefined")
            return null
        } else {
            throw "getIdFromUuid: Uuid is undefined. Id can't be null"
        }
    } else {
        const model = await callback(uuid)
        if(model == null) {
            if(allowNull) {
                console.error("getIdFromUuid: Can't find wanted model. Callback returned 'null'")
                return null
            } else {
                throw "getIdFromUuid: Can't find wanted model. Id can't be null"
            }
            
        }
        return model.id
    }
}

const capitalize = (string:string) => {
    return string.charAt(0) + string.slice(1)
}

export { checkRegex, getIdFromUuid, capitalize }