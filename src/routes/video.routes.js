import { Router } from "express";

import {
    getVideoById,
    uploadVideo,deleteVideo,
    getAllVideos,
    getSingleVideo

}from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const videoRouter = Router();
videoRouter.route("/upload").post(verifyJWT, upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbNailFile", maxCount: 1 }
]), uploadVideo);

videoRouter.route("/videoget/:videoId").post(getVideoById);
videoRouter.route("/update/:videoId").post(verifyJWT, getVideoById);
videoRouter.route("/delete/:videoId").post(verifyJWT, deleteVideo);
videoRouter.route("/getall").get(getAllVideos);
videoRouter.route("/:id").get(getSingleVideo);
export default videoRouter;