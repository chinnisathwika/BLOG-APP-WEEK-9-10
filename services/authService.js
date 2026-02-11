import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userTypeModel } from "../models/UserModel.js"
import {config} from "dotenv";
config()
//register function
export const register =async(userObj)=>{
//create a document 
const userDoc = new userTypeModel(userObj);
//validate for empty passwords
await userDoc.validate();
//hash and replace the password 
userDoc.password=await bcrypt.hash(userDoc.password,10);
//save
const created =await userDoc.save();
//convert document to object to remove password 
const newUserObj = created.toObject(); // this will convert the mongodb document to js object 
//remove passwrod
delete newUserObj.password;
//return userObj without password 
return newUserObj;
};
//authenticate function 
export const authenticate =async({email,password,role})=>{
    const user = await userTypeModel.findOne({ email });
    if (!user || (role && user.role !== role)) {
    const err = new Error("Invalid email or role");
    err.status = 401;
    throw err;
}
    //if user valid, but blocked by admin 

    //compare passwords
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        const err = new Error("Invalid Password");
        err.status=401;
        throw err;
    }
    if(user.isActive==false){
        const err= new Error("Your Account is blocked Contact admin ");
        err.status=403;
        throw err;
    }
    const token =jwt.sign({userId:user._id,role:user.role,email:user.email}
        ,process.env.JWT_SECRET,{expiresIn:"1h",})
    const userObj=user.toObject();
    delete userObj.password;

    return {token, user:userObj };
};