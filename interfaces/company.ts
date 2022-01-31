export interface ICompany {
    id: number
    name: string
    logo?: string
    userUuid?: string
}

export interface ICollectedCompanyData {
    name?: string
    logo: string
    slug?: string,
    userUuid?: string,
    companyOwner: number
}