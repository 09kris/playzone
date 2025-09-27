import { addComment, getComments, LikeVideo, Subscribe ,subscriptions,getSubscribedVideos,createPlaylist, addVideoToPlaylist, getPlaylistVideos ,getAllPlaylists} from "../controllers/like.controller.js";
import { getLikedVideos } from "../controllers/video.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const functionalityRouter = Router();
// Like a video
functionalityRouter.get("/video/:id", verifyJWT, LikeVideo);
functionalityRouter.post("/comment/:id", verifyJWT, addComment);
functionalityRouter.get("/getComment/:id", getComments);
functionalityRouter.get("/subscribe/:id", verifyJWT,Subscribe);
functionalityRouter.get("/subscriptions", verifyJWT, subscriptions);
functionalityRouter.get("/subscribedVideos", verifyJWT, getSubscribedVideos);
functionalityRouter.get("/likedVideos", verifyJWT, getLikedVideos);
functionalityRouter.post("/createPlaylist", verifyJWT, createPlaylist);
functionalityRouter.post("/addVideoToPlaylist/:id/:playlistId", verifyJWT, addVideoToPlaylist);
functionalityRouter.get("/getAllPlaylists", verifyJWT, getAllPlaylists);
functionalityRouter.get("/getPlaylistVideos/:playlistId", verifyJWT, getPlaylistVideos);

export default functionalityRouter