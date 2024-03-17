import userModel from "../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { myEmail } from "../../../service/nodemailerEmail.js";
import { catchAsyncError } from "../../../service/catchAsyncError.js";
import { sendConfirmation } from "../../../service/sendConfirmation.js";
import { AppError } from "../../../service/AppError.js";

export const signup = catchAsyncError(async (req, res) => {
  const { name, email, password, gender, age } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("email");
    if (user) {
      res.status(400).json({ message: "Email exist" });
    } else {
      const hashPassword = bcrypt.hashSync(
        password,
        parseInt(process.env.SALTROUND)
      );
      const newUser = new userModel({
        name,
        email,
        password: hashPassword,
        gender,
        age,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.confirmEmailToken,
        { expiresIn: 60 * 60 * 10 }
      );
      const retoken = jwt.sign(
        { id: savedUser._id },
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
      await myEmail(savedUser.email, "Confirm Email", message);
      res.status(201).json({ message: "Done Check your email" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
});
export const confirmEmail = catchAsyncError( async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-valid Payload" });
    } else {
      const user = await userModel
        .findById(decoded.id)
        .select("email confirmEmail Qrcode");
      if (!user) {
        res.status(404).json({ message: "In-Valid Token id" });
      } else {
        if (user.confirmEmail) {
          res.status(400).json({ message: "email already confirmed" });
        } else {
          const profileLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/user/shareProfile/${user._id}`;
          QRCode.toDataURL(`${profileLink}`, async (err, url) => {
            await userModel.updateOne(
              { email: user.email },
              { Qrcode: url, confirmEmail: true }
            );
            res.status(200).json({ message: "Done please signin" });
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
}) 
export const refreshToken = catchAsyncError(async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-valid Payload" });
    } else {
      const user = await userModel
        .findById(decoded.id)
        .select("email confirmEmail Qrcode");
      if (!user) {
        res.status(404).json({ message: "In-Valid Token id" });
      } else {
        if (user.confirmEmail) {
          res.status(400).json({ message: "email already confirmed" });
        } else {
          const token = jwt.sign(
            { id: user._id },
            process.env.confirmEmailToken,
            { expiresIn: 60 * 60 * 10 }
          );
          const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
          const message = `
            <a href= ${confirmLink}>follow link to confirm your email</a>
            `;
          await myEmail(user.email, "ReConfirm Email", message);
          res.status(200).json({ message: "Done Check your email" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
})  
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("user is not found ", 400));
  }
  let code = nanoid(5);
  const token = jwt.sign({ email: user.email, id: user._id }, "mostafa@22");
  const link = `${req.protocol}://${req.headers.host}/api/v1/auth/resetPassword/${token}`;
  sendConfirmation(
    user.email,
    "Verify your password",
    `<a href='${link}'>Verify password</a>`
  );
  const sendCode = await userModel.findOneAndUpdate(
    { email },
    { code },
    { new: true }
  );
  sendCode
    ? res.status(201).json({ message: "success", code, link })
    : res.status(400).json({ message: "error" });
});
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { code, newPassword } = req.body;
  if (!token) {
    return next(new AppError("invalid token", 400));
  }
  const decoded = jwt.verify(token, "mostafa@22");
  if (!decoded?.id) {
    return next(new AppError("invalid token  payload", 400));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("user not found", 400));
  }
  const match = bcrypt.compareSync(newPassword, user.password);
  if (match) {
    res.status(400).json({ message: "password match , change your password" });
  } else {
    if (code == "") {
      return next(new AppError("invalid code ", 400));
    }
    const hash = bcrypt.hashSync(newPassword, Number(process.env.ROUND));
    const updated = await userModel.updateOne(
      { code },
      { password: hash, code: "" },
      { new: true }
    );
    updated.modifiedCount
      ? res.status(200).json({ message: "success" })
      : res.status(400).json({ message: "error" });
  }
});
export const signin = catchAsyncError( async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "In-Valid account" });
    } else {
      if (!user.confirmEmail) {
        res.status(400).json({ message: "confirm your email first" });
      } else {
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
          res.status(404).json({ message: "In-Valid account" });
        } else {
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.TOKENSIGNATURE,
            { expiresIn: 60 * 60 * 24 }
          );
          res.status(200).json({ message: "Done", token });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
}
)
export const logOut = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new AppError("user is not found ", 400));
  }
  const userLogOut = await userModel.findOneAndUpdate(
    { email, isLoggedIn: true, isOnline: true },
    {
      isLoggedIn: false,
      isOnline: false,
      lastSeen: Date.now(),
    }
  );
  userLogOut
    ? res.status(200).json({ message: "success" })
    : res.status(400).json({ message: "error" });
});
