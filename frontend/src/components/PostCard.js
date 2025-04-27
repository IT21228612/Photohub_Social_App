import React, { useState } from "react";
import {
  UserCircleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css"; // core CSS only
import DeletePostModal from "./DeletePostModal"; // Import DeletePostModal
import EditPostModal from "./EditPostModal"; // Import EditPostModal (new)

const PostCard = ({ post, fetchPosts }) => {
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for Edit Modal

  const ProfilePic = UserCircleIcon;
  const currentUser = {
    id: "user123", // This should be dynamically passed or from context
    name: "John Doe",
    email: "john@example.com",
  };

  const isVideoFile = (url) => url.match(/\.(mp4|mov|avi|webm)$/i);

  const slides = (post.mediaIds || []).map((mediaId) => {
    const url = `${process.env.REACT_APP_API_URL}/posts/media/${mediaId}`;
    if (isVideoFile(url)) {
      return {
        type: "video",
        sources: [{ src: url, type: "video/mp4" }],
      };
    }
    return { src: url };
  });

  const handleMediaClick = (idx) => {
    setViewerIndex(idx);
    setOpenViewer(true);
  };

  const renderThumb = (mediaId, idx) => {
    const url = `${process.env.REACT_APP_API_URL}/posts/media/${mediaId}`;
    const video = isVideoFile(url);

    return (
      <div
        key={idx}
        className="aspect-video w-full overflow-hidden rounded-md cursor-pointer relative"
        onClick={() => handleMediaClick(idx)}
      >
        {video ? (
          <>
            <video
              src={url}
              className="w-full h-full object-cover rounded-md"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
              <PlayIcon className="h-12 w-12 text-white" />
            </div>
          </>
        ) : (
          <img
            src={url}
            alt={`media ${idx + 1}`}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
    );
  };

  const skillArray = post.skill ? post.skill.split(",") : [];

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      {currentUser.id === post.userId && (
        <Popover className="absolute top-2 right-2">
          {({ close }) => (
            <>
              <Popover.Button className="rounded-full hover:bg-gray-100 focus:outline-none">
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
              </Popover.Button>
              <Popover.Panel className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowEditModal(true); // Open Edit Modal
                    close(); // Close the popover
                  }}
                >
                  <PencilIcon className="h-5 w-5 text-gray-500" /> Edit
                </button>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setShowDeleteModal(true); // Open Delete Modal
                    close(); // Close the popover
                  }}
                >
                  <TrashIcon className="h-5 w-5 text-red-600" /> Delete
                </button>
              </Popover.Panel>
            </>
          )}
        </Popover>
      )}

      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <ProfilePic className="h-10 w-10 text-gray-400" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{post.userId}</span>
            <span className="text-gray-400 text-[12px]">
              {new Date(post.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-gray-800 text-lg font-semibold mb-2">
          {post.title}
        </div>

        {/* Skills as tags */}
        {skillArray.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-2">
              {skillArray.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div
          className={`text-gray-800 text-sm mb-2 ${!isExpanded ? "line-clamp-5" : ""}`}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {post.description}
        </div>

        {/* See More / Show Less */}
        {post.description.length > 100 && (
          <div className="text-left">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-sm"
            >
              {isExpanded ? "Show Less" : "See More"}
            </button>
          </div>
        )}

        {/* Media Thumbnails */}
        {post.mediaIds && post.mediaIds.length > 0 && (
          <div className="grid gap-2 mb-2">
            <div
              className={`grid gap-2 ${post.mediaIds.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {post.mediaIds.slice(0, 4).map((id, i) => (
                <div
                  key={i}
                  className="relative cursor-pointer"
                  onClick={() => handleMediaClick(i)}
                >
                  {renderThumb(id, i)}
                  {i === 3 && post.mediaIds.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                      <span className="text-white text-5xl font-semibold">
                        +{post.mediaIds.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Viewer */}
      {openViewer && (
        <Lightbox
          open={openViewer}
          close={() => setOpenViewer(false)}
          index={viewerIndex}
          slides={slides}
          plugins={[Video, Zoom]}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            scrollToZoom: true,
          }}
          styles={{ container: { backgroundColor: "rgba(0,0,0,0.9)" } }}
        />
      )}

      {/* Delete Post Modal */}
      {showDeleteModal && (
        <DeletePostModal
          postId={post.id}
          userId={currentUser.id}
          onClose={() => setShowDeleteModal(false)}
          fetchPosts={fetchPosts} //
        />
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          postId={post.id}  // Pass only postId
          userId={currentUser.id}  // Pass currentUserId
          onClose={() => setShowEditModal(false)}
          fetchPosts={fetchPosts} //
        />
      )}
    </div>
  );
};

export default PostCard;
