process.on("uncaughtException", (err) => {
  console.log("error", err);
});
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectDB from './DB/connection.js'
import * as indexRouter from './modules/index.router.js'
import { AppError } from './service/AppError.js';
import { globalErrorMiddleWare } from './service/globalErrorMiddleWare.js';
const app = express()
const port = 4000 ||4001
const baseUrl = process.env.BASEURL
app.use(express.json())
app.use(`${baseUrl}/uploads`, express.static("./uploads"))
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/users`, indexRouter.userRouter)
app.use(`${baseUrl}/posts`, indexRouter.postRouter)
app.use(`${baseUrl}/comments`, indexRouter.commentRouter)
app.use('*', (req, res) => res.send('In-valid Routing'))
app.all("*", (req, res, next) => {
  next(
    new AppError(
      "invalid url-can't access this endpoint" + req.originalUrl,
      404
    )
  );
});
app.use(globalErrorMiddleWare);
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});