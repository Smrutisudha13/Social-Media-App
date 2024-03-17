import { catchAsyncError } from "../../../service/catchAsyncError.js";
import cloudinary from "../../../service/cloudinary.js";
import paginate from "../../../service/paginate.js";
import postModel from "./../../../DB/model/Post.model.js";
import userModel from "./../../../DB/model/User.model.js";

export const addPost =catchAsyncError( async (req, res,next) => {
  const { postBody,privacy } = req.body;
  try {
    if (req.file) {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `user/${req.authUser._id}/post/pictures`,
      });
      // const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      //   folder: `user/${req.authUser._id}/post/pictures`,resource_type: "image"
      // });
      const post = new postModel({
        postBody,privacy,
        createdBy: req.authUser._id,
        postPicture: secure_url,
      });
      const savedpost = await post.save();
      if (savedpost) {
        await userModel.updateOne(
          { _id: req.authUser._id },
          {
            $push: { postId: savedpost._id },
          }
        );
        res.status(200).json({ message: "Done" });
      } else {
        res.status(400).json({ message: "faild to add post" });
      }
    } else {
      const post = new postModel({ postBody, createdBy: req.authUser._id });
      const savedpost = await post.save();
      if (savedpost) {
        await userModel.updateOne(
          { _id: req.authUser._id },
          {
            $push: { postId: savedpost._id },
          }
        );
        res.status(200).json({ message: "Done" });
      } else {
        res.status(400).json({ message: "faild to add post" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
})  
export const updatePost =  catchAsyncError(async (req, res,next) => {
  const { postBody } = req.body;
  const { id } = req.params;
  try {
    const post = await postModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.authUser._id,
        isDeleted: false,
      },
      { postBody }
    );
    post
      ? res.status(200).json({ message: "Done" })
      : res.status(400).json({ message: "in_valid post id or maybe deleted" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 
export const deletePost = catchAsyncError( async (req, res,next) => {
  const { id } = req.params;
  try {
    const post = await postModel.findOneAndDelete({
      _id: id,
      createdBy: req.authUser._id,
      isDeleted: false,
    });
    if (post) {
      await userModel.updateOne(
        { _id: req.authUser._id },
        { $pull: { postId: id } }
      );
      res.status(200).json({ message: "Done" });
    } else {
      res.status(400).json({ message: "in-valid post id or maybe deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 
export const getPublicPosts = catchAsyncError(async (req, res, next) => {
  const posts = await postModel.find({ privacy: "public" });
  res.status(201).json({ message: "success", posts });
}) 
export const getPrivatePosts = catchAsyncError(async (req, res, next) => {
  const posts = await postModel.find({
    privacy: "private",
    createdBy: req.authUser._id,
  });
  res.status(201).json({ message: "success", posts });
}) 
export const likePost = catchAsyncError(async (req, res,next) => {
  const { id } = req.params;
  try {
    console.log("mostafa");
    const post = await postModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        likes: { $nin: req.authUser._id },
      },
      {
        $push: { likes: req.authUser._id },
        $pull: { unlikes: req.authUser._id },
      }
    );
    if (!post) {
      res
        .status(404)
        .json({ message: "in-valid post id or already likes by user" });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
})
export const unLikePost = catchAsyncError(async (req, res,next) => {
  const { id } = req.params;
  try {
    console.log("mostafa");
    const post = await postModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        likes: { $in: req.authUser._id },
        unlikes: { $nin: req.authUser._id },
      },
      {
        $push: { unlikes: req.authUser._id },
        $pull: { likes: req.authUser._id },
      }
    );
    if (!post) {
      res
        .status(404)
        .json({ message: "in-valid post id or already unLikes by user" });
    } else {
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
})
export const getAllPosts = catchAsyncError(async (req, res,next) => {
  const { page, size } = req.query;
  const { skip, limit } = paginate(page, size);
  try {
    const posts = await postModel
      .find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "createdBy",
          select: "name email -_id",
          match: { isDeleted: false },
        },
        {
          path: "likes",
          select: "name email -_id",
          match: { isDeleted: false },
        },
        {
          path: "unlikes",
          select: "name email -_id",
          match: { isDeleted: false },
        },
        {
          path: "commentId",
          populate: [
            {
              path: "createdBy",
              select: "name email -_id",
              match: { isDeleted: false },
            },
            {
              path: "likes",
              select: "name email -_id",
              match: { isDeleted: false },
            },
            {
              path: "replayComment.commentId",
            },
          ],
        },
      ]);
    if (!posts.length) {
      res.status(404).json({ message: "postes not found" });
    } else {
      res.status(200).json({ message: "Done", posts });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
})
export const getPostsOfUser = catchAsyncError(async (req, res,next) => {
  const { id } = req.params;
  const { page, size } = req.query;
  const { skip, limit } = paginate(page, size);
  try {
    const posts = await postModel
      .find({ createdBy: id })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "createdBy",
          select: "name email -_id",
          match: { isDeleted: false },
        },
        {
          path: "likes",
          select: "name email -_id",
          match: { isDeleted: false },
        },
        {
          path: "unlikes",
          select: "name email -_id",
          match: { isDeleted: false },
        },
        {
          path: "commentId",
          populate: [
            {
              path: "createdBy",
              select: "name email -_id",
              match: { isDeleted: false },
            },
            {
              path: "likes",
              select: "name email -_id",
              match: { isDeleted: false },
            },
            {
              path: "replayComment.commentId",
            },
          ],
        },
      ]);
    if (!posts.length) {
      res.status(404).json({ message: "posts Not found yet" });
    } else {
      res.status(200).json({ message: "Done", posts });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}
) 