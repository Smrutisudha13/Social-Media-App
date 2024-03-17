import jwt from "jsonwebtoken";
import userModel from "./../DB/model/User.model.js";

export const auth = () => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    try {
      if (!authorization.startsWith(process.env.BearerKey)) {
        res
          .status(400)
          .json({ message: "In-valid token or In-valid Bearer Token" });
      } else {
        const token = authorization.split(process.env.BearerKey)[1];
        const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
        if (!decoded?.id || !decoded.isLoggedIn) {
          res.status(400).json({ message: "In-valid payload" });
        } else {
          const user = await userModel
            .findById(decoded.id)
            .select("name email isDeleted");
          if (!user) {
            res.status(404).json({ message: "In-valid token user" });
          } else {
            if (user.isDeleted) {
                res.status(400).json({message: 'not allow because user already deleted'})
            } else {
                req.authUser = user;
                next();
            }
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };
};
