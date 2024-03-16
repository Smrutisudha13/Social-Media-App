import express from "express";
import mongoose from "mongoose";

const app = express();



mongoose
  .connect(
    "mongodb+srv://senapatismrutisudha:K1VnBKetVRxSWC9r@socialmediaapp.synh69f.mongodb.net/SocialMediaApp?retryWrites=true&w=majority&appName=SocialMediaApp"
  )
  .then(() => app.listen(5000))
  .then(() => console.log("Connected to DB and Listening to localhost 5000"))
  .catch((err) => console.log(err));
