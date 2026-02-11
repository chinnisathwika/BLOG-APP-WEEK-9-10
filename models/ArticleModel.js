import {Schema, model} from "mongoose"
import { userTypeModel } from "./UserModel.js"
const userCommentSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:userTypeModel
    },
    comment:{
        type:String
    }
})
const articleSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Author id is required"]
    },
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"]
    },
    content:{
        type:String,
        required:[true,"Content is required"]
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true,
    strict:"throw",
    versionKey:false
})
export const ArticleModel=model("article",articleSchema)