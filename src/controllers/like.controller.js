import { Like } from "../models/like.model.js";
import { Video } from "../models/Video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";

const LikeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Check refresh token from cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  // 2. Find user using refreshToken
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "Invalid refresh token");
  }

  const userId = user._id;

  // 3. Validate video ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid video ID");
  }

  // 4. Check if video exists
  const video = await Video.findById(id);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  // 5. Check if the video is already liked by this user
  const existingLike = await Like.findOne({ video: id, likedBy: userId });

  if (existingLike) {
    // If liked already, remove the like (unlike)
    await Like.deleteOne({ _id: existingLike._id });
    video.likesCount = Math.max(0, video.likesCount - 1); // avoid negative
    await video.save();

    return res
      .status(200)
      .json(new apiResponce(200, { videoId: id, likesCount: video.likesCount }, "Video unliked"));
  } else {
    // If not liked yet, add a new like
    await Like.create({ video: id, likedBy: userId });
    video.likesCount = (video.likesCount || 0) + 1;
    await video.save();

    return res
      .status(200)
      .json(new apiResponce(200, { videoId: id, likesCount: video.likesCount }, "Video liked"));
  }
});
//add comment


const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  const videoId = id;
  // console.log(comment);

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  const newComment = await Comment.create({
    comment: comment,
    video: videoId,
    owner: user,
  });

  return res.status(201).json(
    new apiResponce(201, newComment, "Comment added successfully")
  );
});

//show all comments of a video
const getComments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  const comments = await Comment.find({ video: id })
    .populate("owner", "fullName avatar") // Get name & profile pic
    .select("comment owner createdAt");

  return res.status(200).json(
    new apiResponce(200, comments, "Comments fetched successfully")
  );
});

//subscribe

const Subscribe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Get refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  // 2. Find user
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }

  // 3. Find the video and extract the channel owner
  const video = await Video.findById(id).populate("owner");
  if (!video || !video.owner) {
    throw new apiError(404, "Channel not found");
  }

  const channelId = video.owner._id;
  console.log(`Channel ID: ${channelId}, User ID: ${user._id}`);


  // 4. Check if already subscribed
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: user._id,
  });

  if (existingSubscription) {
    // 🔄 Unsubscribe
    await Subscription.deleteOne({ _id: existingSubscription._id });
    return res
      .status(200)
      .json(new apiResponce(200, null, "Unsubscribed successfully"));
  } else {

    if (channelId == user._id.toString()) {
      throw new apiError(400, "You cannot subscribe to your own channel");
    }
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: user._id,
    });

    return res
      .status(201)
      .json(new apiResponce(201, newSubscription, "Subscribed successfully"));
  }
});

const subscriptions = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }
  const subscriptions = await Subscription.find({ subscriber: user._id })
    .populate("channel", "fullName avatar")
    .select("channel");
  return res.status(200).json(
    new apiResponce(200, subscriptions, "Subscriptions fetched successfully")
  );

}
);

const getSubscribedVideos = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }
  const subscriptions = await Subscription.find({ subscriber: user._id })
    .populate("channel", "fullName avatar")
    .select("channel");
  const channelIds = subscriptions.map(sub => sub.channel);
  const videos = await Video.find({ owner: { $in: channelIds } })
    .populate("owner", "fullName avatar")
    .sort({ createdAt: -1 }) // Sort by newest first
    .select("title description thumbnailUrl likesCount createdAt");
  return res.status(200).json(
    new apiResponce(200, videos, "Subscribed videos fetched successfully")
  );
});
//playList create

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // 1. Get refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  // 2. Find user
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }

  // 3. Create playlist
  const newPlaylist = await Playlist.create({
    name,
    description,
    owner: user._id,
  });

  return res.status(201).json(
    new apiResponce(201, newPlaylist, "Playlist created successfully")
  );
})

//add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { id, playlistId } = req.params; // ✅ Match route param names
  const Id = id;
  const PlaylistId = playlistId;

console.log(`Adding video ${Id} to playlist ${PlaylistId}`);

  // 1. Get refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  // 2. Find user by refresh token
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }

  // 3. Find video
  const video = await Video.findById(Id);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  // 4. Find playlist and verify ownership (optional)
  const playlist = await Playlist.findById(PlaylistId);
  if (!playlist) {
    throw new apiError(404, "Playlist not found");
  }

  // Optional: Make sure the playlist belongs to the authenticated user
  if (String(playlist.owner) !== String(user._id)) {
    throw new apiError(403, "You do not have access to this playlist");
  }

  // 5. Check if video already in playlist
  if (playlist.videos.includes(Id)) {
    throw new apiError(400, "Video already exists in playlist");
  }

  // 6. Add video to playlist
  playlist.videos.push(Id);
  const updatedPlaylist = await playlist.save();

  return res.status(201).json(
    new apiResponce(201, updatedPlaylist, "Video added to playlist successfully")
  );
});

//getplayListVideo
const getPlaylistVideos = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  console.log(`Fetching videos for playlist ${playlistId}`);
  

  // 1. Get refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  // 2. Find user by refresh token
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }

  // 3. Find playlist
  const playlist = await Playlist.findById(playlistId)
    .populate("videos", "title description thumbnail likesCount createdAt")
    .populate("owner", "fullName avatar");

  if (!playlist) {
    throw new apiError(404, "Playlist not found");
  }

  // Optional: Make sure the playlist belongs to the authenticated user
  if (String(playlist.owner._id) !== String(user._id)) {
    throw new apiError(403, "You do not have access to this playlist");
  }

  return res.status(200).json(
    new apiResponce(200, playlist.videos, "Playlist videos fetched successfully")
  );
})

//getall playlists of a user
const getAllPlaylists = asyncHandler(async (req, res) => {
  // 1. Get refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refresh token provided");
  }

  // 2. Find user by refresh token
  const user = await User.findOne({ refreshToken }).select("_id");
  if (!user) {
    throw new apiError(401, "User not found");
  }

  // 3. Find all playlists of the user
  const playlists = await Playlist.find({ owner: user._id })

  return res.status(200).json(
    new apiResponce(200, playlists, "Playlists fetched successfully")
  );
});


export { LikeVideo, addComment, getComments, Subscribe, subscriptions, getSubscribedVideos, createPlaylist, addVideoToPlaylist, getPlaylistVideos , getAllPlaylists };

