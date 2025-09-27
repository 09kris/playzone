import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloud } from "../utils/fileUpload.cloudnary.js";
import { apiResponce } from "../utils/apiResponce.js";
import jwt from "jsonwebtoken";
// import { use } from "react";


const generateAccessTokenAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("generateAccessTokenAndRefereshTokens error:", error);
    throw new apiError(500, "Something went wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get detail
  const { username, email, fullName, password } = req.body;
  const alocalPath = req.files?.avatar[0]?.path;
  // console.log(fullName, email, username, password);

  //valoidate

  //check for empty field
  if (fullName == "" || email == "" || username == "" || password == "") {
    throw new apiError(400, "please fill all the fields")
  }


  //check already exist
  const userExist = await User.findOne({
    $or: [
      { email },
      { username }
    ]
  })

  if (userExist) {
    throw new apiError(409, "User already exsist")
  }


  //CHECK IMAGE and avtar
  // console.log(req.files);
  // const clocalPath=req.files?.coverImage[0]?.path;
  if (!alocalPath) {
    throw new apiError(400, "please upload image")
  }
  let clocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    clocalPath = req.files.coverImage[0].path;
  }

  //upload on cloudinary
  const avater = await uploadOnCloud(alocalPath);
  // const coverImage=await uploadOnCloud(clocalPath);
  const coverImage = clocalPath ? await uploadOnCloud(clocalPath) : { url: "" };
  // console.log("avatar::--->", avater);
  if (!avater) {
    throw new apiError(400, "avatear image upload failed")
  }

  //create user object-create entryee in db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avater.url,
    coverImage: coverImage.url || "",
  });
  //remove password and referesh token field from response

  //check user creation

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  //check user creation

  if (!createdUser) {
    throw new apiError(500, "user creation failed")
  }
  //return response
  return res.status(201).json(
    new apiResponce(200, createdUser, "user registered successfully")
  )

});

// export { registerUser };




const loginUser = asyncHandler(async (req, res) => {
  //req to body
  const { username, email, password } = req.body;
  // console.log(email, username, password);

  //validate
  // console.log(email)
  if (!email && !username) {
    throw new apiError(400, "please provide email or username")
  }

  if (!password) {
    throw new apiError(400, "please provide password")
  }
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new apiError(404, "user not exist")
  }
  const isvalidpas = await user.isPasswordCorrect(password)
  if (!isvalidpas) {
    throw new apiError(401, "password is not valid")
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefereshTokens(user._id);

  const logedUser = await User.findById(user._id).
    select("-password -refreshToken")


  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).
    cookie("accessToken", accessToken, options).
    cookie("refreshToken", refreshToken, options).
    json(
      new apiResponce(200,
        {
          user: logedUser, accessToken, refreshToken
        },
        "user loggerd in success"
      )
    )
})


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponce(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incommingRefreshToken = req.cookies.refreshToken;
    if (!incommingRefreshToken) {
      throw new apiError(401, "unauthorized access")
    }
    const decodedToken = jwt.verify(incommingRefreshToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new apiError(401, "invalid refresh token")
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "refresh token is expired")
    }

    const options = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, nrefreshToken } = await generateAccessTokenAndRefereshTokens(user._id)
    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", nrefreshToken, options)
      .json(
        new apiResponce(
          200,
          { accessToken, refreshToken: nrefreshToken },
          "accessToken token genereted"
        )
      )
  } catch (error) {
    throw new apiError(400, error + "invalid acces  token");

  }
})

const authenticateUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new apiError(401, "Access token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new apiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded._id).select("-password -refreshToken");

  if (!user) {
    throw new apiError(404, "User not found");
  }
// console.log(user)
  return res.status(200).json(
    new apiResponce(
      200,
      user,
      "Authenticated user fetched successfully"
    )
  );
});




const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(User?._id)
  const isCorrectPassword = await user.isPasswordCorrect(oldPassword)
  if (!isCorrectPassword) {
    throw new apiError(400, "password is incorect")
  }
  if (!oldPassword || !newPassword) {
    throw new apiError(401, "field is empty")
  }

  user.password = newPassword
  await user.save({
    validateBeforeSave: false
  })

  return res.status(200)
    .json(new apiResponce(200, {}, "password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200)
    .json(new apiResponce(200, req.user, "cutternt user fatched successfully"))
})


const updateAccountDetail = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body
  if (!fullName || !email) {
    throw new apiError(400, "all field are required")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password")

  return res.status(200)
    .json(new apiResponce(200, user, "accout detail updated succesfully"))
})

const updateAvatar = asyncHandler(async (req, res) => {
  const avaterpath = req.file
  const avatarPath = avaterpath.path
  if (!avatarPath) {
    throw new apiError(400, "avatar is missing")
  }

  const avatar = await uploadOnCloud(avatarPath)
  if (!avatar.url) {
    throw new apiError(400, "Error while uploding avatar")
  }

  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password")



  return res.status(200)
    .json(new apiResponce(200, user, "avatar updated updated succesfully"))
})


const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params
  if (!username?.trim()) {
    throw new apiError(400, "username is required")
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeTo"
      }
    },
    {
      $addFilds: {
        subscribersCount: { $size: "$subscribers" },
        subscribeToCount: { $size: "$subscribeTo" },
        isSusbscribed:{
          $cond:{
            if:{$in:[req.user._id,"$subscribeTo.subscriber"]},
            then:true,
            else:false
          }
        }
      }
    },
    {
      $project: {
  
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribeToCount: 1,
        isSusbscribed: 1,
        email: 1,

        
      }
    }
  ])
  if (!channel || channel.length === 0) {
    throw new apiError(404, "channel not found")
  }
  // console.log("channel::--->", channel);
  return res.status(200)
  .json(new apiResponce(200,channel[0],"channel profile fetched successfully"))
})


const getWatchHisteroy =asyncHandler(async(req, res) => {
  const user=await User.aggregate([
    {
      $match: {
        _id: req.User._id
      }
    },
  {
    $lookup: {
      from:"videos",
      localField:"watchHistory",
      foreignField:"_id",
      as:"watchHistory",
      pipeline:[
        {
          $lookup:{
            from:"Users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
              {
                $project:{
                  fullName:1,
                  username:1,
                  avatar:1
                }
              }
            ]
          }
        }
      ]
    }

  }
  ])
  return res.status(200)
  .json(new apiResponce(200, user[0].watchHistory, "watch history fetched successfully"))
}
)
export { registerUser, loginUser,authenticateUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail, updateAvatar ,getUserChannelProfile,getWatchHisteroy};
