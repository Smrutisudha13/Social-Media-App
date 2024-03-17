import {Schema, model, Types} from 'mongoose'

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    confirmEmail: {
        type : Boolean,
        default : false
    },
    gender : {
        type : String,
        enum : ['male', 'fmale']
    },
    
    isLoggedIn:{
        type:Boolean,
        default:false
      },
      isOnline:{
        type:Boolean,
        default:false
      },
      lastSeen:Date
      ,
      code:{
        type:String,
        default:''
      },
    age : Number,
    profilePic : String,
    coverPics : Array,
    isDeleted : {
        type : Boolean,
        default : false
    },
    postId : [{type : Types.ObjectId, ref : 'Post'}],
    Qrcode : String
}, {
    timestamps : true
})
const userModel = model('User', userSchema)
export default userModel