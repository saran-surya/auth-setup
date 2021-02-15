const express = require('express');
const router = express.Router();
const {spawn} = require('child_process');
const dotenv = require('dotenv');
const path = require('path')

// initialisation variables
var setupFiles = {}
var OTP = ""


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function initiateFiles(){
    const {authSetupFiles} = require("../index")
    setupFiles = authSetupFiles;
    dotenv.config({
        path: setupFiles.filePath
    })
}

function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000);
}

function checkCredentials(){
    return new Promise((resolve, reject)=>{
    try {
        const mailData = spawn('python', [path.resolve(setupFiles.execPath,'login.py'), process.env.loginEmailID, process.env.loginPassword])
            mailData.stdout.on('data', async(data)=>{
                const readerData = await data.toString();
                console.log(data.toString());
                if(String(readerData).includes("error")){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        } catch (error) {
            console.log(error.message)
            resolve(false)
        }
    })
}

function sendOTP(reciptantMail){
    OTP = generateOtp();
    return new Promise((resolve, reject)=>{
        try {
            const mailData = spawn('python', [path.resolve(setupFiles.execPath,'mailer.py'), reciptantMail, OTP, setupFiles.sessionName, process.env.loginEmailID, process.env.loginPassword])
            mailData.stdout.on('data', async(data)=>{
                const readerData = await data.toString()
                console.log(data.toString());
                if(String(readerData).includes("error")){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
            console.log("OTP sent to ->",reciptantMail)
        } catch (error) {
            console.log(error.message)
            resolve(false)
        }
    })
}

// ************** For checking if the Email ID can be logged into ********************
router.get("/", async(req, res)=>{
    initiateFiles();
    console.log(process.env.loginEmailID)
    if(await checkCredentials()){
        res.status(200).json({
            success : true,
            message : "Successfully logged in"
        })
    }else{
        res.status(500).json({
            success : false,
            message : "credentials mis-match"
        })       
    }
})

// *********************** To send OTP to the reciptant ***************************
router.post("/", async(req, res)=>{
    initiateFiles()
    const {reciptantMail} = req.query;
    console.log("reciptant -->",reciptantMail)
    if(reciptantMail && await checkCredentials() && validateEmail(reciptantMail) && await sendOTP(reciptantMail)){
        res.status(200).json({
            success : true,
            OTP : OTP,
            mail : reciptantMail,
            message : "OTP sent successfully"
        })
    } else if(!validateEmail(reciptantMail)) {
        console.log("Mail ID not valid ->",reciptantMail)
        res.status(404).json({
            success : false,
            mail : reciptantMail,
            message : "Reciptant mail is not valid"
        })
    } else {
        console.log("server error")
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
})

module.exports = {
    emailRouter: router
}