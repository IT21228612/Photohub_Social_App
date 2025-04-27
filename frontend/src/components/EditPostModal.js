import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Select from "react-select";

const EditPostModal = ({ postId, userId, onClose, fetchPosts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);

  // Existing media on the server:
  const [existingMedia, setExistingMedia] = useState([]);
  // Track which existing media to delete:
  const [toBeDeletedMediaIds, setToBeDeletedMediaIds] = useState([]);

  // New uploads:
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/posts/${userId}/${postId}`
        );
        if (!res.ok) throw new Error("Failed to fetch post data");
        const data = await res.json();

        setTitle(data.title);
        setDescription(data.description);
        setSkills(
          data.skill
            ? data.skill.split(",").map((s) => ({ value: s, label: s }))
            : []
        );

        // Build existing media array:
        const media = await Promise.all(
          (data.mediaIds || []).map(async (filename) => {
            const r = await fetch(
              `${process.env.REACT_APP_API_URL}/posts/media/${filename}`
            );
            if (!r.ok) return null;
            const url = r.url;
            const type = filename.match(/\.(mp4)$/i) ? "video" : "image";
            return { filename, url, type };
          })
        );
        setExistingMedia(media.filter((m) => m));
      } catch (e) {
        setError(e.message);
      }
    };
    fetchPostData();
  }, [postId, userId]);

  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "";
    };
  }, []);

  // Handle new file selection
  const handleNewFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      type: file.type.startsWith("video/") ? "video" : "image",
      url: URL.createObjectURL(file),
    }));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  // Delete an existing media
  const deleteExistingMedia = (idx) => {
    const toDelete = existingMedia[idx].filename;
    setToBeDeletedMediaIds((prev) => [...prev, toDelete]);
    setExistingMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  // Delete a newly added file
  const deleteNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {

    // Validation checks for empty fields
  if (!title.trim()) {
    Swal.fire("Validation", "Title is required.", "warning");
    return;
  }

  if (!description.trim()) {
    Swal.fire("Validation", "Description is required.", "warning");
    return;
  }

  if (skills.length === 0) {
    Swal.fire("Validation", "At least one skill must be selected.", "warning");
    return;
  }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("userId", userId);
      form.append("title", title);
      form.append("description", description);
      form.append("postType", 0);
      form.append(
        "skill",
        skills.map((s) => s.value).join(",")
      );

      // Attach list of existing media filenames to delete
      toBeDeletedMediaIds.forEach((id) =>
        form.append("toBeDeletedMediaIds", id)
      );

      // Attach new files
      newFiles.forEach((file) => form.append("newFiles", file));

      await axios.put(
        `${process.env.REACT_APP_API_URL}/posts/${userId}/${postId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire("Success", "Post updated!", "success");

      fetchPosts();// refresh the posts in the wall
      onClose();// close the modal
    } catch (e) {
      setError(e.message);
      Swal.fire("Error", "Could not update post.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-11/12 max-w-4xl max-h-[95vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        {error && (
          <div className="text-red-600 mb-4 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* Left Column */}
          <div className="w-3/5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter post title"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter post description"
              />
            </div>
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <Select
                isMulti
                options={[
                  { value: "photography", label: "Photography" },
                  { value: "video-editing", label: "Video Editing" },
                  { value: "lighting", label: "Lighting" },
                  { value: "retouching", label: "Retouching" },
                  { value: "camera-gear", label: "Camera Gear" },
                  { value: "portraiture", label: "Portraiture" },
                  { value: "composition", label: "Composition" },
                  { value: "videography", label: "Videography" },
                ]}
                value={skills}
                onChange={setSkills}
                className="text-sm"
                placeholder="Select skills"
              />
            </div>

            {/* Existing Media */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">
                Existing Media
              </label>
              <div className="grid grid-cols-3 gap-2">
                {existingMedia.map((m, i) => (
                  <div key={m.filename} className="relative">
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        alt=""
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={m.url}
                        controls
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    <button
                      onClick={() => deleteExistingMedia(i)}
                      className="absolute top-1 right-1 text-white bg-black p-1 rounded-full hover:bg-gray-700"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-2/5 space-y-4">
            <label className="block text-sm font-medium mb-1">
              New Media Files
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleNewFileChange}
              className="block w-full text-sm"
            />
            <div className="mt-4">
              {newPreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {newPreviews.map((p, i) => (
                    <div key={i} className="relative">
                      {p.type === "image" ? (
                        <img
                          src={p.url}
                          alt=""
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ) : (
                        <video
                          src={p.url}
                          controls
                          className="w-full h-32 object-cover rounded-md"
                        />
                      )}
                      <button
                        onClick={() => deleteNewFile(i)}
                        className="absolute top-1 right-1 text-white bg-black p-1 rounded-full hover:bg-gray-700"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No new files selected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
