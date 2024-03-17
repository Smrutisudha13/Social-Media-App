import { Router } from "express";
import * as pc from "./controller/post.js";
import { auth } from "./../../middleware/auth.js";
import validation from "./../../middleware/validation.js";
import * as validators from "./post.validator.js";
import { HME, myMulter, validationTypes } from "../../service/cloudMulter.js";
const router = Router();
router.post(
  "/addPost",
//   validation(validators.addPost),
  myMulter(validationTypes.image).single('image'),HME,
  auth(),
  pc.addPost
);
router.patch('/update/:id', validation(validators.updatePost),auth(), pc.updatePost)
router.delete('/delete/:id', validation(validators.deletePost),auth(), pc.deletePost)
router.patch('/like/:id', validation(validators.likePost),auth(), pc.likePost)
router.patch('/unlike/:id', validation(validators.unLikePost),auth(), pc.unLikePost)
router.get('/', validation(validators.getAllposts),pc.getAllPosts)
router.get('/:id', validation(validators.getPostsOfUser),pc.getPostsOfUser)
router.get('/getPublicPosts',pc.getPublicPosts)
router.get('/getPrivatePosts',pc.getPrivatePosts)
export default router;
