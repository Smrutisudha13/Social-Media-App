import {Schema, model, Types} from 'mongoose'

const commentSchema = new Schema({
    commentBody : {
        type : String,
        required : true
    },
    postId : {type : Types.ObjectId, ref : 'Post'},
    createdBy : {
        type : Types.ObjectId,
        ref : 'User',
        required : true,
    },
    likes : [{type: Types.ObjectId, ref : 'User'}],
    deletedBy : {
        type : Types.ObjectId,
        ref : 'User',
    },
    replayComment : [{
        commentBody : String,
        commentId : {type : Types.ObjectId, ref : 'Comment'},
        replayOnReplay : [{
            commentBody : String,
            commentId : {type : Types.ObjectId, ref : 'Comment.replayComment'},
            createdBy : {type : Types.ObjectId, ref : 'User'}
        }],
    
    }],
}, {
    timestamps : true
})
const commentModel = model('Comment', commentSchema)
export default commentModel
