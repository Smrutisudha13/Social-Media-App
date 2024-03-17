import userModel from "./../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { myEmail } from "../../../service/nodemailerEmail.js";
import cloudinary from "./../../../service/cloudinary.js";
import schedule from "node-schedule";
import path from "path";
import { fileURLToPath } from "url";
import paginate from "./../../../service/paginate.js";
import { catchAsyncError } from "../../../service/catchAsyncError.js";

export const shareProfile = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel
      .findById(id)
      .select("-password -confirmEmail -Qrcode")
      .populate([
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
                  select: "commentBody -_id",
                },
              ],
            },
          ],
        },
      ]);
    if (!user || user.isDeleted) {
      res.status(404).json({ message: "In-Valid User or maybe deleted" });
    } else {
      res.status(200).json({ message: "Done", user });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 
export const updateProfile = catchAsyncError(async (req, res) => {
  const { name, email, age, cPassword } = req.body;
  try {
    if (email) {
      const user = await userModel.findOne({ email });
      if (user) {
        res.status(400).json({ message: "Email exist" });
      } else {
        const auth = await userModel.findById(req.authUser._id);
        const match = bcrypt.compareSync(cPassword, auth.password);
        if (!match) {
          res.status(400).json({ message: "In-Valid Password" });
        } else {
          const newUpdate = await userModel.findByIdAndUpdate(
            req.authUser,
            {
              name,
              email,
              age,
              cPassword,
              confirmEmail: false,
            },
            { new: true }
          );
          const token = jwt.sign(
            { id: newUpdate._id },
            process.env.confirmEmailToken,
            { expiresIn: 60 * 60 * 10 }
          );
          const retoken = jwt.sign(
            { id: newUpdate._id },
            process.env.confirmEmailToken,
            { expiresIn: "1h" }
          );
          const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
          const refLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/reConfirmEmail/${retoken}`;
          const message = `
                    <a href= ${confirmLink}>follow link to confirm your email</a>
                    <br>
                    <br>
                    <a href= ${refLink}>follow link to Reconfirm your email</a>
                    `;
          await myEmail(email, "Confirm Email", message);
          res
            .status(201)
            .json({ message: "Done Check your email to confirm it" });
        }
      }
    } else {
      const auth = await userModel.findById(req.authUser._id);
      const match = bcrypt.compareSync(cPassword, auth.password);
      if (!match) {
        res.status(400).json({ message: "In-Valid Password" });
      } else {
        const updateUser = await userModel.updateOne(
          { _id: req.authUser._id },
          { name, age }
        );
        updateUser.modifiedCount
          ? res.status(200).json({ message: "Done" })
          : res.status(400).json({ message: "fail to update" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 
export const softDelete = catchAsyncError( async (req, res) => {
  try {
    const user = await userModel.updateOne(
      { _id: req.authUser._id },
      { isDeleted: true }
    );
    user.modifiedCount
      ? res.status(200).json({ message: "Done" })
      : res.status(400).json({ message: "fail to delete" });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
})
export const addProfilePic = catchAsyncError(async (req, res) => {
  try {
    if (!req.file) {
      res.status(404).json({ message: "please upload your image" });
    } else {
      const image = req.file;
      const imageSize = 2000;
      if (image.size / 1024 > imageSize) {
        res
          .status(400)
          .json({ message: `image size should be less than ${imageSize}KB` });
      } else {
        const { secure_url } = await cloudinary.uploader.upload(image.path, {
          folder: `user/${req.authUser._id}/profile/pic`,
        });
        await userModel.updateOne(
          { _id: req.authUser._id },
          { profilePic: secure_url }
        );
        res.status(201).json({ message: "Done", secure_url });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 
export const addProfileCov =  catchAsyncError(async (req, res) => {
  try {
    if (!req.files) {
      res.status(404).json({ message: "please upload your images" });
    } else {
      const images = req.files;
      const urls = [];
      for (let image of images) {
        const { secure_url } = await cloudinary.uploader.upload(image.path, {
          folder: `user/${req.authUser._id}/profile/cover`,
        });
        urls.push(secure_url);
      }
      await userModel.updateOne({ _id: req.authUser._id }, { coverPics: urls });
      res.status(200).json({ message: "Done", urls });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 
export const getAllUsers = catchAsyncError(async (req, res) => {
  try {
    const { page, size } = req.query;
    const { skip, limit } = paginate(page, size);
    const users = await userModel
      .find({
        isDeleted: false,
        confirmEmail: true,
      })
      .select("-password -Qrcode")
      .skip(skip)
      .limit(limit)
      .populate([
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
                  select: "commentBody -_id",
                },
              ],
            },
          ],
        },
      ]);
    if (!users.length) {
      res.status(400).json({ message: "404 Not found Users" });
    } else {
      res.status(200).json({ message: "Done", users });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}) 