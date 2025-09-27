import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Path from "path";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// const uploadOnCloud = async (localPath) => {
//   try {
//     console.log("localPath::--->", localPath);

//     const absolutePath = path.resolve(localPath); // ✅ Convert to absolute path
//     console.log("Absolute Path:", absolutePath);

//     if (!fs.existsSync(absolutePath)) {
//       console.error("File not found:", absolutePath);
//       return null;
//     }

//     const response = await cloudinary.uploader.upload(absolutePath, {
//       resource_type: "auto",
//     });

//     // Delete the local file
//     fs.unlinkSync(absolutePath);

//     return response;
//   } catch (error) {
//     console.error("Cloudinary upload failed:", error);
//     if (localPath && fs.existsSync(localPath)) {
//       fs.unlinkSync(localPath);
//     }
//     return null;
//   }
// };

// export { uploadOnCloud };
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });
const uploadOnCloud = async (localPath, resourceType = "image") => {
  try {
    const absolutePath = Path.resolve(localPath);
    if (!fs.existsSync(absolutePath)) {
      console.error("File not found:", absolutePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: resourceType,
    });

    fs.unlinkSync(absolutePath);
    if (!response || !response.secure_url) {
      console.error("Upload failed, no secure URL returned.");
      return null;
    }

    return {
      url: response.secure_url,
      duration: resourceType === "video" ? Math.floor(response.duration || 0) : undefined
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    if (localPath && fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return null;
  }
};


export { uploadOnCloud };