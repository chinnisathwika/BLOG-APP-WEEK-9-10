import { userTypeModel } from "../models/UserModel.js";
export const checkAuthor=async(req,res,next)=>{
    //get author id 
    let authorId=req.body?.author || req.params.authorId
    //check the author exists
    let author= await userTypeModel.findById(authorId)
    if(!author || author.role!="AUTHOR"){
        return res.status(401).json({message:"author not found"});
    }
    if(author.role!='AUTHOR'){
        return res.status(403).json({message:"user is not an author"});
    }
    if(!author.isActive){
         return res.status(403).json({message:"Author Account is not active "});
    }
    //verify author
    //forward req to next
    next();
}