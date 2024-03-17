
import authRouter from './auth/auth.router.js'
import userRouter from './user/user.router.js'
import postRouter from './post/post.router.js';
import commentRouter from './comment/comment.router.js';
export {
    authRouter,
    userRouter,
    postRouter,
    commentRouter
}

/*
export const addProfilePic = catchAsyncError(async (req, res, next) => {
  const userPhoto = await userModel.findByIdAndUpdate(
    { _id: req._id },
    { profilePic: req.file.filename },
    { new: true }
  );
  res.json({ message: "success", userPhoto });
});
userRoute.post(
  "/addProfilePic",
  uploadFile("profilePic"),
  userToken,
  userControler.addProfilePic
);



*/ 