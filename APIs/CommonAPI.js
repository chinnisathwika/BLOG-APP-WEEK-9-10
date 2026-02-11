import exp from "express"
import {authenticate} from '../services/authService.js'
import { userTypeModel } from "../models/UserModel.js";
export const commonRoute=exp.Router()
commonRoute.post("/login",async(req,res)=>{
    let userCred=req.body;
    //call authenticate cookie
    let {token,user}=await authenticate(userCred)
    //save token as 
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false,
    });
    res.status(200).json({message:"Login Success",payload:user})
})
commonRoute.get("/logout",async(req,res)=>{
        res.clearCookie('token',{
        httpOnly:true, //must match  original settings
        secure:false, //must match original settings
        sameSite:'lax'// must match original settings
    });
    res.status(200).json({message:"Logged Out Succesfully"})
})

commonRoute.put("/change-password",async(req,res)=>{
    let userId=req.body
    let email=await userTypeModel.findOne(userId)
    if(email){
        res.status(200).json({message:"Email is found now change the password"});
        let changedpassword=await userTypeModel.findByIdAndUpdate({$push: { passwords: password } },  // Add updated password to array
        { new: true })
        res.status(200).json({message:"changed password",payload:changedpassword});
    }
    res.status(201).json({message:"Email is not Found",payload:email})
})