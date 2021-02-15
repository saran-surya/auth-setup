const fs = require('fs');
const dotenv = require('dotenv');
const {emailRouter} = require('./routes/routes');
const initialiseSetup = require('./hostingCommands/herokuSetup');
const setupFlag = "--setup=heroku"
const path = require('path')
const [filePath, flag] = process.argv.slice(1);

if(flag == setupFlag){
    nameSplit = filePath.split("\\")
    if(nameSplit[0] === filePath){
        nameSplit = filePath.split("/")
    }
    initialiseSetup(nameSplit[nameSplit.length - 1])
}

const authSetupFiles = {
    filePath : "",
    emailRouter : emailRouter,
    sessionName : "",
    execPath : path.resolve(__dirname)
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function initiateFiles(){
    if(authSetupFiles.filePath.length > 0 && authSetupFiles.filePath !== undefined){
        if(fs.existsSync(authSetupFiles.filePath)){
            dotenv.config({
                path : authSetupFiles.filePath
            })
            if(process.env.loginEmailID && process.env.loginPassword && process.env.loginEmailID.length > 5 && process.env.loginPassword.length > 5 && validateEmail(process.env.loginEmailID)){
                console.log("------> Bootstrapped auth server settings.✔️")
            }else{
                console.log("\n------> Variables missing <loginEmailID> and <loginPassword> !!")
            }
        }else{
            console.log("\n------> Error config file path is incorrect !")
            console.log("------> check <authSetupFiles.filePath> !")
        }
    }else{
        console.log("\n------> Error Config File Path missing !!")
        console.log("------> check <authSetupFiles.filePath> !")
    }
}

// *********** To delay and initialise the values ******************
if(setupFlag !== flag){
    setTimeout(()=>{
        initiateFiles();
    }, 1000);
}

module.exports = {
    authSetupFiles : authSetupFiles,
}