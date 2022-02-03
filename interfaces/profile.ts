export enum Status {
    PENDING = "pending",
    PUBLISHED = "published"
}

export interface IProfile {
    status: Status
    name: string | undefined
    profilePhoto: string
    userUuid?: string
    companyUuid?: string
}