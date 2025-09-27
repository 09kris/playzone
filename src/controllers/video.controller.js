import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/Video.model.js";
import { uploadOnCloud } from "../utils/fileUpload.cloudnary.js";
import { apiResponce } from "../utils/apiResponce.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";


const uploadVideo = asyncHandler(async (req, res) => {
    const  { title, description } = req.body;
    const videoFile = req.files.videoFile[0];
    const thumbNailFile = req.files.thumbNailFile[0];
    if(!videoFile || !thumbNailFile){
        throw new apiError(400,"plese upload all files");
    }
    if(!title || !description){
        throw new apiError(400, "Please provide title and description");
    }
    const videoUrl=await uploadOnCloud(videoFile.path,"video");
    const thumbNailUrl = await uploadOnCloud(thumbNailFile.path);
    if(!videoUrl){
        throw new apiError(500, "Failed to upload files to cloud");
    }
  const video =new Video({
        videoFile: videoUrl.url,
        thumbnail: thumbNailUrl.url,
        title,
        description,
        duration: videoUrl.duration,
        owner: req.user._id
    });



    if(!video) {
        throw new apiError(500, "Failed to upload video");
    }
    // video.createdAt = Timestamp.fromDate(new Date());
    await video.save();

    res.status(20).json(new apiResponce(200,video,"Video uploaded successfully"));

    
})

const getSingleVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
    // console.log(id);
    
  const video = await Video.findById(id);
  if (!video) {
    throw new apiError(404, "Video not found");
  }
//   console.log(video);
  
  return res.status(200).json(
    new apiResponce(200, video, "Video fetched successfully")
  );
});




const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    
    if(!videoId) {
        throw new apiError(400, "Video ID is required");
    }
    const videos =await Video.findById(videoId)
    if(!videos) {
        throw new apiError(404, "Video not found");
    }
    res.status(200).json(new apiResponce(200, videos, "Video fetched successfully"));
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
       const thumbNailFile = req.files.thumbNailFile[0];

    if(!thumbNailFile){
        throw new apiError(400, "Please upload video file");
    }    //TODO: update video details like title, description, thumbnail


 if(!videoId) {
        throw new apiError(400, "Video ID is required");
    }
    const thumbNailUrl=await uploadOnCloud(thumbNailFile.path,"thumbnail");
if(!thumbNailUrl){
    throw new apiError(500, "Failed to upload thumbnail to cloud");
}

    const video = await Video.findByIdAndUpdate(videoId,{
        $set:{
            thumbnail:thumbNailUrl.url
        }
    }, { new: true });
    if(!video) {
        throw new apiError(404, "Video not found");
    }
    res.status(200).json(new apiResponce(200, video, "Video updated successfully"));
})


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) {
        throw new apiError(400, "Video ID is required");
    }
    const video = await Video.findByIdAndDelete(videoId);
    if(!video) {
        throw new apiError(404, "Video not found");
    }
    //unlink video file from cloud
    
    res.status(200).json(new apiResponce(200, null, "Video deleted successfully"));
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new apiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new apiResponce(200, video, "Video publish status toggled successfully"));
});


const getAllVideos = asyncHandler(async (req, res) => {
    const videos=await Video.find({})
      return res.status(200).json(
    new apiResponce(200, videos, "All videos fetched successfully")
  );
})

//get Liked Videos
const getLikedVideos = asyncHandler(async (req, res) => {
      const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new apiError(401, "No refresh token provided");
    }
    const user = await User.findOne({ refreshToken }).select("_id");
    if (!user) {
        throw new apiError(401, "User not found");
    }
    const likedVideos = await Like.find({ likedBy: user})
        .populate("video", "_id title thumbnail videoFile duration")
        .select("video createdAt");
    // console.log("likedVideos=",likedVideos);
        
    return res.status(200).json(
        new apiResponce(200, likedVideos, "Liked videos fetched successfully")
    );

    

   
})

// const getAllVideos = asyncHandler(async (req, res) => {
//     const {
//         page = 1,
//         limit = 10,
//         query = "",
//         sortBy = "createdAt",
//         sortType = "desc",
//         userId
//     } = req.body;

//     if (!page || !limit || !userId) {
//         throw new apiError(400, "Page, limit and userId are required");
//     }

//     const matchStage = {
//         owner: new mongoose.Types.ObjectId(userId),
//         isPublished: true,
//         title: { $regex: query, $options: "i" }
//     };

//     const sortStage = {
//         [sortBy]: sortType === "asc" ? 1 : -1
//     };

//     const aggregate = Video.aggregate([
//         { $match: matchStage },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "owner",
//                 foreignField: "_id",
//                 as: "ownerDetails"
//             }
//         },
//         { $unwind: "$ownerDetails" },
//         { $sort: sortStage }
//     ]);

//     const options = {
//         page: parseInt(page),
//         limit: parseInt(limit)
//     };

//     const result = await Video.aggregatePaginate(aggregate, options);

//     res.status(200).json(new apiResponce(200, result, "Videos fetched successfully"));
// });

export {uploadVideo,getVideoById,togglePublishStatus,updateVideo,deleteVideo,getAllVideos,getSingleVideo,getLikedVideos};


// import { asyncHandler } from "../utils/asyncHandler.js";
// import { apiError } from "../utils/apiError.js";
// import { Video } from "../models/Video.model.js";
// import { uploadOnCloud } from "../utils/fileUpload.cloudnary.js";
// import { apiResponce } from "../utils/apiResponce.js";
// import mongoose from "mongoose";

// const uploadVideo = asyncHandler(async (req, res) => {
//     const { title, description } = req.body;
//     const videoFile = req.files.videoFile?.[0];
//     const thumbNailFile = req.files.thumbNailFile?.[0];

//     if (!videoFile || !thumbNailFile) {
//         throw new apiError(400, "Please upload all files");
//     }
//     if (!title || !description) {
//         throw new apiError(400, "Please provide title and description");
//     }

//     const videoUrl = await uploadOnCloud(videoFile.path, "video");
//     const thumbNailUrl = await uploadOnCloud(thumbNailFile.path);

//     if (!videoUrl) {
//         throw new apiError(500, "Failed to upload files to cloud");
//     }

//     const video = new Video({
//         videoFile: videoUrl.url,
//         thumbnail: thumbNailUrl.url,
//         title,
//         description,
//         duration: videoUrl.duration,
//         owner: req.user._id
//     });

//     await video.save();

//     res.status(201).json(new apiResponce(200, video, "Video uploaded successfully"));
// });

// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     if (!videoId) {
//         throw new apiError(400, "Video ID is required");
//     }

//     const video = await Video.findById(videoId);

//     if (!video) {
//         throw new apiError(404, "Video not found");
//     }

//     res.status(200).json(new apiResponce(200, video, "Video fetched successfully"));
// });

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;
//     const thumbNailFile = req.files.thumbNailFile?.[0];

//     if (!thumbNailFile) {
//         throw new apiError(400, "Please upload thumbnail file");
//     }

//     if (!videoId) {
//         throw new apiError(400, "Video ID is required");
//     }

//     const thumbNailUrl = await uploadOnCloud(thumbNailFile.path, "thumbnail");

//     if (!thumbNailUrl) {
//         throw new apiError(500, "Failed to upload thumbnail to cloud");
//     }

//     const video = await Video.findByIdAndUpdate(
//         videoId,
//         { $set: { thumbnail: thumbNailUrl.url } },
//         { new: true }
//     );

//     if (!video) {
//         throw new apiError(404, "Video not found");
//     }

//     res.status(200).json(new apiResponce(200, video, "Video updated successfully"));
// });

// const deleteVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     if (!videoId) {
//         throw new apiError(400, "Video ID is required");
//     }

//     const video = await Video.findByIdAndDelete(videoId);

//     if (!video) {
//         throw new apiError(404, "Video not found");
//     }

//     res.status(200).json(new apiResponce(200, null, "Video deleted successfully"));
// });

// const togglePublishStatus = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     if (!videoId) {
//         throw new apiError(400, "Video ID is required");
//     }

//     const video = await Video.findById(videoId);

//     if (!video) {
//         throw new apiError(404, "Video not found");
//     }

//     video.isPublished = !video.isPublished;
//     await video.save();

//     res.status(200).json(new apiResponce(200, video, "Video publish status toggled successfully"));
// });

// const getAllVideos = asyncHandler(async (req, res) => {
//     const {
//         page = 1,
//         limit = 10,
//         query = "",
//         sortBy = "createdAt",
//         sortType = "desc",
//         userId
//     } = req.body;

//     if (!page || !limit || !userId) {
//         throw new apiError(400, "Page, limit and userId are required");
//     }

//     const matchStage = {
//         owner: new mongoose.Types.ObjectId(userId),
//         isPublished: true,
//         title: { $regex: query, $options: "i" }
//     };

//     const sortStage = {
//         [sortBy]: sortType === "asc" ? 1 : -1
//     };

//     const aggregate = Video.aggregate([
//         { $match: matchStage },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "owner",
//                 foreignField: "_id",
//                 as: "ownerDetails"
//             }
//         },
//         { $unwind: "$ownerDetails" },
//         { $sort: sortStage }
//     ]);

//     const options = {
//         page: parseInt(page),
//         limit: parseInt(limit)
//     };

//     const result = await Video.aggregatePaginate(aggregate, options);

//     res.status(200).json(new apiResponce(200, result, "Videos fetched successfully"));
// });

// export {
//     uploadVideo,
//     getVideoById,
//     togglePublishStatus,
//     updateVideo,
//     deleteVideo,
//     getAllVideos
// };
