import postModel from "../../../DB/model/Post.model.js";
import { catchAsyncError } from "../../../service/catchAsyncError.js";
import commentModel from "./../../../DB/model/Comment.model.js";

export const addComment = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { commentBody } = req.body;
  try {
    const post = await postModel
      .findOne({ _id: id, isDeleted: false })
      .select("_id");
    if (!post) {
      res.status(404).json({ message: "In-Valid Post id" });
    } else {
      const comment = new commentModel({
        commentBody,
        postId: id,
        createdBy: req.authUser._id,
      });
      const savedComment = await comment.save();
      if (savedComment) {
        await postModel.updateOne(
          { _id: id },
          { $push: { commentId: savedComment._id } }
        );
        console.log("ahmed");
        res.status(200).json({ message: "Done" });
      } else {
        res.status(400).json({ message: "falid to add comment" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});

export const updateComment = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { commentBody } = req.body;
  try {
    const comment = await commentModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.authUser._id,
      },
      { commentBody },
      { new: true }
    );
    if (!comment) {
      res
        .status(404)
        .json({ message: "In_valid comment id or in-valid owner" });
    } else {
      res.json({ message: "Done", comment });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});

export const deleteComment = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await commentModel.findById(id).populate([
      {
        path: "postId",
      },
    ]);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      if (`${req.authUser._id}` == `${comment.createdBy}`) {
        await commentModel.updateOne(
          { _id: id },
          { deletedBy: req.authUser._id }
        );
        const deleteComment = await commentModel
          .findByIdAndDelete(id)
          .populate([
            {
              path: "deletedBy",
              select: "name email",
            },
          ])
          .select("deletedBy commentBody");
        res
          .status(200)
          .json({ message: "Done Deleted By Comment Owner", deleteComment });
      } else if (`${req.authUser._id}` == `${comment.postId.createdBy}`) {
        await commentModel.updateOne(
          { _id: id },
          { deletedBy: req.authUser._id }
        );
        const deleteComment = await commentModel
          .findByIdAndDelete(id)
          .populate([
            {
              path: "deletedBy",
              select: "name email",
            },
          ])
          .select("deletedBy commentBody");
        res
          .status(200)
          .json({ message: "Done Deleted By post Owner", deleteComment });
      } else {
        res.status(405).json({ message: "Not allow to delete comment" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});

export const likeComment = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await commentModel.findById(id);
    if (!comment) {
      res.status(404).json({ message: "In-Valid Comment id" });
    } else {
      if (!comment.likes.includes(`${req.authUser._id}`)) {
        await commentModel.updateOne(
          { _id: id },
          { $push: { likes: req.authUser._id } }
        );
        res.status(200).json({ message: "Done you liked this comment" });
      } else {
        await commentModel.updateOne(
          { _id: id },
          { $pull: { likes: req.authUser._id } }
        );
        res.status(200).json({ message: "Done you unliked this comment" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});
export const replayOnComment = catchAsyncError(async (req, res) => {
  console.log("mostafa");
  const { id } = req.params;
  const { commentBody } = req.body;
  try {
    const comment = await commentModel.findById(id);
    if (!comment) {
      res.status(404).json({ message: "In-Valid comment id" });
    } else {
      await commentModel.updateOne(
        { _id: id },
        {
          $push: {
            replayComment: [
              { commentBody, commentId: id, createdBy: req.authUser._id },
            ],
          },
        }
      );
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});
export const replayOnReplay = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { commentBody } = req.body;
  try {
    const comment = await commentModel.findOne({
      "replayComment._id": id,
    });
    if (!comment) {
      res.status(404).json({ message: "comment not found" });
    } else {
      await commentModel.updateOne(
        { "replayComment._id": id },
        {
          $push: {
            "replayComment.$.replayOnReplay": {
              commentBody,
              commentId: id,
              createdBy: req.authUser._id,
            },
          },
        }
      );
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});
export const getCommentInfo = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await commentModel.findById(id).populate([
      {
        path: "postId",
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
            path: "commentId",
            select: "commentBody -_id",
          },
        ],
      },
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
        select: "commentBody -_id",
      },
    ]);
    if (!comment) {
      res.status(404).json({ message: "comment not found" });
    } else {
      res.status(200).json({ message: "Done", comment });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
});
