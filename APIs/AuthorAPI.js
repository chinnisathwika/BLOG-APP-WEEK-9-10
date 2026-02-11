import exp from 'express'
import {register} from '../services/authService.js';
import { ArticleModel } from '../models/ArticleModel.js';
import {checkAuthor} from '../middlewares/checkAuthor.js'
import { verifyToken } from '../middlewares/verifyToken.js';
export const authorRoute=exp.Router()
//REGISTER author (public)
authorRoute.post('/users',async(req,res)=>{
    //get user obj from req
    let userObj=req.body;
    //call register 
    const newUserObj=await register({...userObj,role:"AUTHOR"}) // according to user only the division occur so ths is the main step
    //send res
    res.status(201).json({message:"Author Created",payload:newUserObj})

})
//authenticate author (public)
// authorRoute.post("/authenticate",async(req,res)=>{

// })
// create article (protected)
authorRoute.post("/articles",verifyToken,checkAuthor,async(req,res)=>{
    //get article from req
    let article=req.body;
    // let author=await userTypeModel.findById(article.author)
    // //check author is existed or not 
    // if(!author || author.role!="AUTHOR"){
    //     return res.status(401).json({message:"author not existed"});
    // }
    let newArticleDoc=new ArticleModel(article)
    let createdArticleDoc=await newArticleDoc.save()
    res.status(201).json({message:"article Created",payload:createdArticleDoc})
    //create article document 

    //save 
})
// read articles for author (protected)
authorRoute.get("/articles/:authorId",verifyToken,checkAuthor,async(req,res)=>{
    //get author id from params
    let authorId=req.params.authorId;
    // //check the author exists
    // let author=await userTypeModel.findById(authorId)
    // if(!author || author.role!="AUTHOR"){
    //     return res.status(401).json({message:"author not found"});
    // }
    //read articles by this author
    let article=await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author","firstName email")
    //send res
    res.status(200).json({message:"Articles found",payload:article})

})
// edit article (protected)

authorRoute.put("/articles",verifyToken,checkAuthor,async(req,res)=>{
    //find article 
    let {articleId,author,title,category,content}=req.body;
    let articleOfDB=await ArticleModel.findOne({_id:articleId,author:author})
    if(!articleOfDB){
        res.status(401).json({message:"article not found"})
    }
    //check of the article is published by the same author or not 
    //get modified article request
    let updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,
        {$set:{title,category,content}},
        {new:true})
    //update the article 
    res.status(200).json({message:"Updated the Article ",payload:updatedArticle})
    //send res
})
// delete article with soft delete (protected)
authorRoute.put("/articledelete",verifyToken,checkAuthor,async(req,res)=>{
    let {articleId,author}=req.body;
    let articleOfDB=await ArticleModel.findOne({_id:articleId,author:author})
    if(!articleOfDB){
        res.status(401).json({message:"article not found"})
    }
    let deletedArticle=await ArticleModel.findByIdAndDelete(articleId)
    res.status(200).json({message:"Article Deleted",payload:deletedArticle})
})