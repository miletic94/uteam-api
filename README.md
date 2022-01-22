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

# Basic use
+ /register route needs username, email and password in request body. 
It returns user that is inserted in database

+ /login route needs username OR email AND password
If user is authenticated, app returns message: OK and JWT
