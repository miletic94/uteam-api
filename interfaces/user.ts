export enum Role {
    USER = "company-user",
    ADMMIN = "company-admin",
    SUPERADMIN = "superadmin"
}

export interface IUser {
    username?: string
    email?: string 
    password?: string
    role?: Role 
}

export interface ICollectedUserData {
    username:string
    email:string
    password:string, 
    role: Role
}