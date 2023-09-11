import express from "express";
import { createPartners, getPartnerByadminName, getPartnerByEmail, getPartnerById, getPartners, updatePartnerById, updatePartnerPassword } from "../services/partnerServices";
import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { tokenBlacklist } from "../middlewares/fetchPartnerUsingAuthToken";
import nodemailer from 'nodemailer';
import generateOtp from "../services/generateOtp";
require('dotenv').config();

// nodemailer transpoter
const transpoter = nodemailer.createTransport({
    service: "gmail",
    port: 7000,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
})

let OTP = '';
let partnerEmail = '';

// for send otp to partner
export const sendOtpToPartner = async(req: express.Request , res: express.Response) => {
    try {
        const {email} = req.body;
        partnerEmail = email;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ isSuccess: false, errors: errors.array()});
        }
        //check weather partner with this email exist or not
        const existingPartnerWithEmail = await getPartnerByEmail(email);
            if(existingPartnerWithEmail){
                return res.status(409).json({isSuccess : false , message : 'user with this email already exist.'});
            }
        OTP = generateOtp();
        const info = await transpoter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "otp validation",
            text: `this is s message from bookmybox for otp validaiton`,
            html: `<h3>YOUR OTP IS : <b>${OTP}</b></h3>`
        });
        return res.status(200).json({isSuccess : true , message : 'otp send successFully' , info});
    } catch (error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error.' , error});
    }
}

// for validate otp is correct or not
export const otpValidationPartner = async(req: express.Request , res: express.Response) => {
    try {
        const {partnerOtp} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ isSuccess: false, errors: errors.array()});
        }
        if(!partnerOtp){
            return res.status(403).json({isSuccess : false , message : 'otp is require'});
        }
        if(partnerOtp != OTP){
            return res.status(403).json({isSuccess : false , message : 'Invalid otp'});
        }
        return res.status(200).json({isSuccess : true , message : 'otp validate successFully'});
    } catch (error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error.' , error});
    }
}

// for register our partner
export const partnerRegister = async(req: express.Request , res: express.Response) => {  
    try{
        const {adminName , password , confirmPassword , officeContact } = req.body;
        // check for express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ isSuccess: false, errors: errors.array()});
        }
        // handle file is require
        const file = req.file;
        if(!file){
            return res.json({isSuccess : false , message : 'image is require.'});
        }

        // handle all fields are require
        if(!(adminName && password && confirmPassword && officeContact)){
            return res.status(400).json({isSuccess : false , message : 'All fields are required.'});
        }

        //check weather partner with this adminName exist or not
        const existingPartnerWithadminName = await getPartnerByadminName(adminName);
        if(existingPartnerWithadminName){
            return res.status(409).json({isSuccess : false , message : 'user with this adminName already exist.'});
        }

        // check weather a password and confirmpassword is same or not
        if(password !== confirmPassword){
            return res.status(400).json({isSuccess : false , message : 'password and confirmpassword must be same.'});
        }

        //password hashing
        const saltRounds = 10; // Number of salt rounds
        const securePassword = await bcrypt.hash(password, saltRounds);
        const filepath = "http://localhost:"+process.env.PORT+'/profileImages/'+req.file?.originalname;

        // create partner
        await createPartners({
            adminName , email : partnerEmail , password : securePassword , officeContact , profileImage : filepath
        });

        return res.status(200).json({isSuccess : true , message : 'partner created successfully.'}).end();

    } catch(error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error.' , error});
    }
}

// for login our partner
export const partnerLogin = async(req: express.Request , res: express.Response) => {
    try {
        const {email , password} = req.body;

        // check for express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ isSuccess: false, errors: errors.array() });
        }

        // check weather a partner is exist or not
        const existLoginUser = await getPartnerByEmail(email);
        if(!existLoginUser){
            return res.status(401).json({isSuccess : false , message : 'Invalid username or password.'});
        }

        // check password is correct using jwt secret
        const isPasswordValid:boolean = await bcrypt.compare(password , existLoginUser?.password as string);
        if(!isPasswordValid){
            return res.status(401).json({isSuccess : false , message : 'Invalid username or password.'});
        }

        let data = {
            partner : {
                id : existLoginUser?._id,
            },
        };

        const SECRET_KEY: string = process.env.SECRET_KEY || '';
        const authToken = jwt.sign(data , SECRET_KEY);

        return res.status(200).json({isSuccess : true , message : 'partner loggedin successfully.' , authToken}).end();

        } catch (error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error'});
    }
}

// for get single partner
export const getPartner = async(req: any , res: express.Response) => {
    try {
        const partnerId = req.partner.id;
        const partner = await getPartnerById(partnerId).select("-password");
        res.status(200).json({isSuccess : true , message : 'partner get successfully' , partner}).end();
    } catch (error) {
        console.log({error});
        return res.status(500).send({message : 'internal server error'});
    }
}

// for get all partners
export const getAllPartners = async(req: express.Request , res: express.Response) => {
    try{
        const {bookmyboxname , bookmyboxpassword} = req.body;
        if(!bookmyboxname || !bookmyboxpassword){
            return res.status(400).json({isSuccess : false , message : 'ourusername and password require'});
        }
        if(bookmyboxname === process.env.ourusername && bookmyboxpassword === process.env.ourpassword){
            const partners = await getPartners();
            return res.status(200).json({isSuccess : true , message : 'get All partners Successfully' , partnersList : partners}).end();
        }
        res.status(401).json({isSuccess : false , message : 'not allowed'}).end();
    } catch(error){
        console.log(error);
        res.status(500).json({error : 'internal server error'});
    }
}

// for edit partner
export const editPartner = async(req: express.Request , res: express.Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors});
        }
        const currentPartner = await getPartnerById(req.params.partnerid);
        if(!currentPartner){
            return res.status(400).json({isSuccess : false , message : 'partner not found with this id'});
        }
        const editedObj = req.body;
        if(req.file){
            const filepath = "http://localhost:"+process.env.PORT+'/profileImages/'+req.file?.originalname;
            fs.unlinkSync('src/uploads/'+currentPartner.profileImage.split(process.env.PORT+'/')[1]);
            editedObj.productImages = filepath;
        } else{
            editedObj.productImages = currentPartner.profileImage;
        }
        const editedPartner = await updatePartnerById(req.params.partnerid , editedObj);
        if(!editedPartner){
            return res.status(400).json({isSuccess : false , message : 'partner not found with this id'});
        }
        res.status(200).json({isSuccess : true , message : 'partner edited successfully'}).end();

    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'internal server error' , err : error});  
    }
}

// for logout partner
export const logoutPartner = async(req: express.Request , res: express.Response) => {
    try {
        const authToken: string | undefined = req.headers.authorization?.split(" ")[1];
        tokenBlacklist.add(authToken);
        return res.status(200).json({isSuccess : true , message : 'Logged out successfully'}).end();
    } catch (error) {
       console.log(error);
       res.status(500).json({error : 'internal server error' , err : error});
    }
}

//verify for forgot-password 
export const forgotPartnerPassword = async(req: express.Request , res:express.Response) => {
    try {
        const {email} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors});
        }
        const existedPartner = await getPartnerByEmail(email);
        if(!existedPartner){
            return res.status(401).json({isSuccess : false , message : 'partner with this email not exist'});
        }
        const secret = process.env.SECRET_KEY + existedPartner.password;
        const token = jwt.sign({email: existedPartner.email , id: existedPartner._id} , secret , {expiresIn : '5m'});
        const link = `http://localhost:8000/resetPartnerPassword/${existedPartner._id}/${token}`;
        res.send(link);
    } catch (error) {
       console.log(error);
       res.status(500).json({error : 'internal server error' , err : error});
    }
}

// verify for reset password and reset password
export const resetPartnerPassword = async(req: express.Request , res: express.Response) => {
    try {
        const {id , token} = req.params;
        const {password , confirmPassword} = req.body;
        const {email} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors});
        }
        if(!(id && token)){
            return res.status(400).json({isSuccess : false , message : 'id or token not found'});
        }
        if(!(password && confirmPassword)){
            return res.status(400).json({isSuccess : false , message : 'password and confirmpassword require'});
        }
        if(password !== confirmPassword){
            return res.status(400).json({isSuccess : false , message : 'password and confirmpassword must be same'});
        }
        const existedPartner = await getPartnerById(id);
        if(!existedPartner){
            return res.status(401).json({isSuccess : false , message : 'partner with this email not exist'});
        }
        const secret = process.env.SECRET_KEY + existedPartner.password;
        const verify = jwt.verify(token , secret);
        if(!verify){
            return res.status(401).json({isSuccess :false , message : 'verification failed'});
        }
        const saltRounds = 10; // Number of salt rounds
        const newPassword = await bcrypt.hash(password, saltRounds);
        await updatePartnerPassword(id , newPassword);
        res.status(200).json({isSuccess : true , message : 'password updated successsfully'}).end();
    } catch (error) {
       console.log(error);
       res.status(401).json({error : 'Invalid token or id' , err : error});    
    }
}