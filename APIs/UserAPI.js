import exp from 'express'
import {register} from '../services/authService.js'
import { verifyToken} from '../middlewares/verifyToken.js';
import { ArticleModel } from '../models/ArticleModel.js'
export const userRoute=exp.Router()
//Register user
userRoute.post('/users',async(req,res)=>{
    //get user obj from req
    let userObj=req.body;
    //call register 
    const newUserObj=await register({...userObj,role:"USER"}) // according to user only the division occur so ths is the main step
    //send res
    res.status(201).json({message:"User Created",payload:newUserObj})

})
//Authenticate User
// userRoute.post("/authenticate",async(req,res)=>{
//     let userCred=req.body;
//     //call authenticate cookie
//     let {token,user}=await authenticate(userCred)
//     //save token as 
//     res.cookie("token",token,{
//         httpOnly:true,
//         sameSite:"lax",
//         secure:false,
//     });
//     res.status(200).json({message:"User Authenticated",payload:user})
// })
//Read all articles (protected route )
userRoute.get("/userarticle", verifyToken, async(req, res) => {
    let articles = await ArticleModel.find({ isArticleActive: true });
    res.status(200).json({ message: "Available Articles", payload: articles });
});
//add comment to an article (Protected Route )
userRoute.post("/usercomment/:id", verifyToken, async (req, res) => {
    let articleId = req.params.id;
    let { comments } = req.body; // Use 'comments' to match source 
    let updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId, 
        { $push: { comments: { user: req.user.userId, comment: comments } } }, 
        { new: true }
    );
    res.status(200).json({ message: "Comment Added", payload: updatedArticle });
});