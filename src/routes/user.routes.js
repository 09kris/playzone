import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateAvatar,
    getWatchHisteroy,
    getUserChannelProfile,
    authenticateUser,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Register with avatar and cover image
userRouter.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);

// Auth routes
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.post("/refreshToken", refreshAccessToken);
userRouter.post("/authUser",authenticateUser)
// Apply verifyJWT for all user account routes below
userRouter.use(verifyJWT);

// Get current user
userRouter.get("/me", getCurrentUser);

// Change password
userRouter.post("/change-password", changeCurrentPassword);

// Update account info
// userRouter.put("/update-account", updateAccountDetail);
userRouter.route("/updateAccountDetail").patch(updateAccountDetail);

userRouter.route("/updateAvatar").patch(upload.single("avatar"), updateAvatar);
// Update avatar only
// userRouter.put("/update-avatar", upload.single("avatar"), updateAvatar);
userRouter.route("/c/:username")
  .get(getUserChannelProfile); // Assuming this is to get the user's channel profile

  userRouter.route("/getWatchHisteroy").get(getWatchHisteroy); // Assuming this is to get the user's watch history
export default userRouter;

