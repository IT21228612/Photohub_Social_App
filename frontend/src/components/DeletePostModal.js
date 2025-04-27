import React, { useState, useEffect } from "react";

const DeletePostModal = ({ postId, userId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Cleanup: Re-enable scrolling when modal is closed
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${userId}/${postId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }
      onClose(); // Close the modal after a successful delete
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative z-60">
        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>

        {error && (
          <div className="text-red-600 mb-4 text-sm">
            <strong>Error: </strong> {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded-md ${
              loading ? "bg-gray-400" : "bg-red-600"
            }`}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
