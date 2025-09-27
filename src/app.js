// import express from "express"

// import cors from "cors"
// import cookieParser from "cookie-parser"
// const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))
// app.use(express.json({ limit: "16kb" }))
// app.use(express.urlencoded({
//     extended: true,
//     limit: "16kb"
// }))

// app.use(express.static("public"))

// app.use(cookieParser())


// //routs
// import userRouter from "./routes/user.routes.js"


// //declare
// app.use("/users", userRouter)
// export { app }



import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import functionalityRouter from "./routes/Functionality.routes.js";
const app = express();
// Enable CORS for all routes



app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Needed to parse JSON POST body
app.use(express.json());

// Static files
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(cookieParser());

// Register your routes under `/users`
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/functionality",functionalityRouter)
export default app;
