import jwt from "jsonwebtoken";
import {config} from "dotenv";
config();
export const verifyToken=async(req,res,next)=>{
    //read token from request - check cookies first, then Authorization header
    let token = req.cookies.token;
    
    // If no token in cookies, check Authorization header
    if(!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer TOKEN"
    }
    
    if(token==undefined){
        return res.status(401).json({message:"Unauthorized Request - Please Login"})
    }
    // verify the validity of the token (Decoding the token )
    let decodedToken=jwt.verify(token,process.env.JWT_SECRET)
    //forward the request to middleware or route 
    req.user = decodedToken;
    next()
}

//cookie parser install and use it here