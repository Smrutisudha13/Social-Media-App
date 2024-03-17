import { Router } from "express";
import validation from "../../middleware/validation.js";
import * as cc from "./controller/comment.js";
import * as validators from './comment.validator.js';
import { auth } from "../../middleware/auth.js";

const router = Router()
router.post('/addComment/:id',validation(validators.addComment), auth(), cc.addComment)
router.patch('/update/:id',validation(validators.updateComment), auth(), cc.updateComment)
router.delete('/delete/:id',validation(validators.deleteComment), auth(), cc.deleteComment)
router.patch('/like/:id',validation(validators.likeComment), auth(), cc.likeComment)
router.post('/replayComment/:id',validation(validators.replayOnComment), auth(), cc.replayOnComment)
router.post('/replayOnReplay/:id', validation(validators.replayOnReplay), auth(), cc.replayOnReplay)
router.get('/:id', validation(validators.getCommentInfo), cc.getCommentInfo)




export default router;