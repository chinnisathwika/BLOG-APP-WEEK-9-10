import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js';
import { authenticate } from '../services/authService.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { userTypeModel } from '../models/UserModel.js';
export const adminRoute=exp.Router()
//Authenticate admin
adminRoute.post('/adminlogin',async(req,res)=>{
    let admin=req.body;
    let {token,adminlog}=await authenticate(admin)
        //save token as 
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false,
        });
        res.status(200).json({message:"Admin Logged In",payload:adminlog})
})
//read all articles,async
adminRoute.get('/readarticles/:authorId',checkAuthor,async(req,res)=>{
    //get author id from params
    let authorId=req.params.authorId;
    let article=await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author","firstName email")
    //send res
    res.status(200).json({message:"Articles found",payload:article})

})
//block / unblock user roles
adminRoute.put('/hold',async(req,res)=>{
     let { userId, isActive } = req.body; // Destructure correctly
     let user = await userTypeModel.findById(userId);
     if (!user) return res.status(404).json({ message: "user not found" });

     let blockedUser = await userTypeModel.findByIdAndUpdate(userId, { $set: { isActive } }, { new: true });
     res.status(200).json({ message: "User status updated", payload: blockedUser });
});