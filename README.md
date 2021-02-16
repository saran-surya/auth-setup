# ``` npm i --save auth-setup ``` 
- ### A node file with prebuilt server functions for setting up [two-step-auth](https://www.npmjs.com/package/two-step-auth) locally for custom Mail ID's and server.

## prerequisites
- ### You need PYTHON for the successful execution of the package
- #### Download [PYTHON](https://www.python.org/downloads/).

## Need for the package
  - As per the suggestions, people need the package to be available locally, and also have them easily set for hosting, 
  - **Privacy concerns** , Even though we never share any email ID's that was sent using the package [two-step-auth](https://www.npmjs.com/package/two-step-auth), and neither do we use it for our purposes, people wanted their own server so this was created on top of  that, You have control on your data.
    -  #### You have control on your data
    -  #### Own Mail ID
    -  #### Host on your favorite servers / Micro servers
    - #### Greater speeds of sending mails

## Usage (server side configuration)
- ##### Create a config file inside the project and add the following variables to the ENV file
  - File Name : **(test.env)** for example.
```env
loginEmailID = "sample@sample.com"
loginPassword = "samplePassword"
```
- ##### In your index.js / server.js
- ##### Initialise your express server.
```js
const express = require('express')
const app = express();
```
- ##### Import the <span color = "red">authSetupFiles</span> object from the package.
```js
const {authSetupFiles} = require('auth-setup')
```
- ##### Declare your config file path.
```js
authSetupFiles.filePath = "test.env"
```
- ##### Delcare your session name / Company Name (optional)
```js
authSetupFiles.sessionName = "Sample"
```
- ##### Declare your favorite route to use with the package and point it using the <span color='red'>app.use()</span> method.
```js
app.use("/email", authSetupFiles.emailRouter)
```
- ### You are all done for the backend setup 👍

## Usage (accessing the routes from Frontend)
- ### Check if credentials pass initial test.
- I am using **localhost:5000** as the parent route here, it is applicable for all other routes.
- To check if the package is able to login to the Mail ID provided, performa  get request so the script will login to your Email ID and then give you a call back in JSON stating if it was success. Pass the route you specified in the previous step. ... *app.use*('/email', ...)
```http
GET http://localhost:5000/email
```
- **Success Response** on login:
```
{
  "success": true,
  "message": "Successfully logged in"
}
```

- **Failure Response** on login:
```
{
  "success": false,
  "message": "credentials mis-match"
}
```
- ### Sending an OTP to the reciever Email
- All you need to do is to send a **POST** Request to the same route that you specified with the query containing the Paramaters : **<routepath>?reciptantMail=dummy@dummy.com**
```
POST http://localhost:5000/email?reciptantMail=dummy@dummy.com
```
- This will yield you an OTP and the JSON will look as follows.
    - ##### Gives an OTP.
    - ##### Gives a reference mail to work with.
```
{
  "success": true,
  "OTP": 121568,
  "mail" : "dummy@dummy.com",
  "message": "OTP sent successfully"
}
```

- #### Complete Example : 
```
const express = require('express')
const app = express();

const {authSetupFiles} = require('auth-setup')
authSetupFiles.filePath = "config/test.env"
authSetupFiles.sessionName = "Sample"

app.use("/email", authSetupFiles.emailRouter)

app.listen(5000, async(req, res)=>{
    console.log("server started")
})
```
#### Preparing your NODE server for HOSTING:
- ##### HEROKU  
    - ```node test.js --setup=heroku```
    - **node <fileName>.js --setup=heroku**
    - Execute the following command in the command line,
    - This will create a ProcFile and a requirements.txt file in helping with hosting in Heroku.
    - ### If you have already created a ProcFile for Heroku, then kindly ignore, Just add the requirements.txt file if you have missed it
    - (Adding Requirements.txt) in your **Command Promt** follow the snippet below.
    #### ```pip freeze > requirements.txt```
    
##### Feel free to raise PR for issues :)

#### Thankyou ❤️