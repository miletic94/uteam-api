export interface ICompany {
    companyName: string
    logo: string
    profileUuid?: string
    slug: string
    companyOwner?: number
}

export interface ICollectedCompanyData {
    name?: string
    logo: string
    slug?: string,
    userUuid?: string,
    companyOwner: number
}