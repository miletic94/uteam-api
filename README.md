# UTEAM-API
Express and TypeScript App

# Quick Start
Install app locally
```
$npm install
```

If you get error 'ts-node' is not recognized as an internal or external command - install ts-node globaly:
```
$ npm i -g ts-node
```
## Scripts
Run development .ts server with nodemon. 
```
$ npm run dev
```
Compile typescript
```
$ npm run build
```
Start production .js server
```
$ npm start
```
## Authorization
For authorizing user in protected routes (logging in) use Authorization: "Barer \<TOKEN\>" in header of requests
# Usage
### Registering

Registering of user is done by going on /register route.<br/>

Registering creates user, profile and company.<br>

Data needed for registering:<br/>

```
{
    user: {
        username: <username>,
        email: <email>,
        password: <password>
    },
    profile: {
        name: <name>,
        profilePhoto: <link to photo>
        companyUuid: <uuid of company that user works in>
    },
    company {
        name: <Company name>
        logo: <link to logo>
    }
}

```
All attributes from user object, and name attribute from profile object are required.
Ommiting other attributes will set up default values.

### Logging in
User is logging in by going on /login route<br/>

For logging in username or email and password are needed. <br/>

If logged in successfully user gets Bearer token back<br/>
```
{
    "message": "OK",
    "token": "Bearer <JWT token>"
```

## Getting profile data

### Get one profile 
Send GET request to /profiles/:id where :id is profile's UUID 

This returns profile with next attributes 
```
{
    "profileUuid": <profileUuid>
    "status": <pending | published>
    "name": <name>
    "profilePhoto": <link to photo>
    "user": {
        "userUuid": <userUuid>
        "username": <username != name>
        "email": <email>
        "password": <hashedPassword>,
        "role": "company-user | company-admin | superadmin",
        "ownedCompanies": [
            {
                "companyUuid": <companyUuid>,
                "name": <company naem>
                "logo": <link to logo>
                "slug": <slugified nume>
                "createdAt" <creation of instance>
                "updatedAt"
            }
        ]
    },
    "company": <company where user works>
}
```

### Get all profiles 
Send GET request to /profiles

It will send back array of companies in the same format as when returning one company above
## Creating, Updating and Deleting Profile

#### Constraints
Only logged in user can create, update or delete profile
One user can't create two profiles
One user can create many companies
Attribute companyUuid must refer to existing company

### Creating profile
Create profile by sending POST request to /profiles route<br/>
Data needed: 
```
{
    name, 
    profilePhoto,
    companyUuid
}
```
Name is only required. <br/>
Omitting companyUuid will put company as null
Profile will connect user with company in which user work.<br/>

### Updating profile
Send PUT request to /profiles/:id where :id is profile's uuid <br/>
Data sent while while creating profile can also be updated.

### Deleting profile
Send DELETE request to profile/:id where :id is profile's uuid<br>

User's company that he already created will not be deleted but user won't be able to create new company without profile.

## Getting company data

### Get one company 
Send GET request to /companies/:id where :id is company's UUID 
It will give you next result:
```
{
    "name": <name>
    "logo": <link to logo>
    "slug": <slugified name of the company>,
    "profiles": []
}
```
Profiles holds record of all users working for the company.

### Get all companies 
Send GET request to /companies. 
It will send back array of companies in the same format as when returning one company above.

## Creating, Updating and Deleting Company

#### Constraints
Only logged in user can create, update or delete company
One user can create many companies

### Creating company
Create company by sending POST request to /companies route<br/>
Data needed: 
```
{
    name, 
    logo
}
```
Nothing is required. If you ommit entering data, generic Company will be created. <br/>

### Updating company
Send PUT request to /companies/:id where :id is profile's uuid <br/>
Data sent while while creating company can also be updated.

### Deleting company
Send DELETE request to companies/:id where :id is company's uuid<br>

User's company that he already created will not be deleted but user won't be able to create new company without profile.

