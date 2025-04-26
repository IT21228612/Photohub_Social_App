import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { XCircleIcon } from "@heroicons/react/24/solid";

const CreatePostModal = ({ closeModal, setPosts }) => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // sample user
  const currentUser = {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Selected Files:", selectedFiles); // Debugging step

    // Append new files to the existing ones
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    // Generate previews for the files
    const previews = selectedFiles.map((file) => {
      console.log("Generating preview for file:", file); // Debugging step
      if (file.type.startsWith("image/")) {
        return { type: "image", url: URL.createObjectURL(file) }; // For images
      } else if (file.type.startsWith("video/")) {
        return { type: "video", url: URL.createObjectURL(file) }; // For videos
      }
      return null; // In case of unsupported file types
    });

    console.log("Generated Previews:", previews); // Debugging step
    setFilePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleDeleteFile = (fileIndex) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...filePreviews];

    // Remove file and preview by index
    updatedFiles.splice(fileIndex, 1);
    updatedPreviews.splice(fileIndex, 1);

    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      Swal.fire("Validation", "Description is required.", "warning");
      return;
    }

    setIsLoading(true);
    const payload = new FormData();
    payload.append("userId", currentUser.id);
    payload.append("description", description);
    files.forEach((file) => payload.append("files", file));

    try {
      const { data: newPost } = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/create`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Add to wall
      setPosts((prev) => [newPost, ...prev]);

      Swal.fire("Success", "Post created!", "success");
      closeModal();
      setDescription("");
      setFiles([]);
      setFilePreviews([]);
    } catch (err) {
      console.error("Create post error", err);
      Swal.fire("Error", "Could not create post.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-8 rounded-lg w-11/12 max-w-4xl max-h-[95vh] overflow-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Media files</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="block w-full text-sm"
            />
            {files.length > 0 && (
              <p className="mt-1 text-xs text-gray-600">Total of {files.length} file(s) selected</p>
            )}

            <div className="mt-4">
              <p>File Previews:</p>
              {filePreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      {/* Image Preview */}
                      {preview && preview.type === "image" && (
                        <img
                          src={preview.url}
                          alt={`preview-${index}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      )}

                      {/* Video Preview */}
                      {preview && preview.type === "video" && (
                        <video
                          src={preview.url}
                          controls
                          className="w-full h-32 object-cover rounded-md"
                        />
                      )}

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                        className="absolute top-1 right-1 text-white bg-black p-1 rounded-full hover:bg-gray-700"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No previews available.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
