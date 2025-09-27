import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Cookies:", req.cookies);
        console.log("accessToken cookie:", req.cookies?.accessToken);

        // console.log(token);
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        console.log(token)
        if (typeof token !== "string") {
  throw new apiError(401, "Token is not a string");
}

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new apiError(401, "Invalid user Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new apiError(401,  "Invalid access token")
    }
    
})