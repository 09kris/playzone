import React, { useState } from "react";
import axios from "axios";

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbNailFile, setThumbNailFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);

    if (videoFile) form.append("videoFile", videoFile);
    if (thumbNailFile) form.append("thumbNailFile", thumbNailFile);

    try {
      const response = await axios.post("http://localhost:8000/videos/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setIsError(false);
      setMessage(response.data?.message || "Video uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setIsError(true);
      setMessage(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Upload Video</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <label className="block text-sm text-gray-600">
        Video File:
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="w-full mt-1"
          required
        />
      </label>

      <label className="block text-sm text-gray-600">
        Thumbnail:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbNailFile(e.target.files[0])}
          className="w-full mt-1"
        />
      </label>

      

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default VideoUpload;
