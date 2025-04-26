import React, { useState } from "react";
import {
  UserCircleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

const PostCard = ({ post }) => {
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState({}); // track which videos are ready

  const ProfilePic = UserCircleIcon;
  const currentUser = {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
  };

  // determine file type
  const isVideoFile = (url) => url.match(/\.(mp4|mov|avi|webm)$/i);

  // prepare Lightbox slides
  const slides = (post.mediaIds || []).map((mediaId) => {
    const url = `${process.env.REACT_APP_API_URL}/posts/media/${mediaId}`;
    return isVideoFile(url)
      ? { type: "video", src: url }
      : { src: url };
  });

  const handleMediaClick = (index) => {
    setViewerIndex(index);
    setOpenViewer(true);
  };

  // renders either <img> or <video> with spinner
  const renderMedia = (mediaId, index) => {
    const url = `${process.env.REACT_APP_API_URL}/posts/media/${mediaId}`;
    const isVideo = isVideoFile(url);

    return (
      <div
        key={index}
        className="aspect-video w-full overflow-hidden rounded-md cursor-pointer relative"
        onClick={() => handleMediaClick(index)}
      >
        {isVideo ? (
          <>
            {/* spinner until video is fully buffered */}
            {!videoLoaded[index] && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <video
              src={url}
              className="w-full h-full object-cover rounded-md"
              muted
              controls
              preload="auto"
              onCanPlayThrough={() =>
                setVideoLoaded((prev) => ({ ...prev, [index]: true }))
              }
            />
          </>
        ) : (
          <img
            src={url}
            alt={`Post media ${index + 1}`}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
    );
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden max-h-screen min-h-screen">
      {currentUser.id === post.userId && (
        <Popover className="absolute top-2 right-2">
          <Popover.Button className="rounded-full hover:bg-gray-100 focus:outline-none">
            <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
          </Popover.Button>

          <Popover.Panel className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => alert(`Edit post ${post.id}`)}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              <PencilIcon className="h-5 w-5 text-gray-500" />
              Edit
            </button>
            <button
              onClick={() => alert(`Delete post ${post.id}`)}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <TrashIcon className="h-5 w-5 text-red-600" />
              Delete
            </button>
          </Popover.Panel>
        </Popover>
      )}

      <div className="p-4 flex flex-col">
        <div className="flex items-start gap-2 text-xs text-gray-500 mb-2">
          <ProfilePic className="h-10 w-10 text-gray-400" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{post.userId}</span>
            <span className="text-gray-400 text-[12px]">
              @{new Date(post.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-gray-800 text-lg mb-2 line-clamp-5">
          {post.description}
        </div>

        {post.mediaIds && post.mediaIds.length > 0 && (
          <div className="mb-2">
            {post.mediaIds.length === 1 && renderMedia(post.mediaIds[0], 0)}

            {post.mediaIds.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {post.mediaIds.slice(0, 2).map(renderMedia)}
              </div>
            )}

            {post.mediaIds.length === 3 && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {post.mediaIds.slice(0, 2).map(renderMedia)}
                </div>
                {renderMedia(post.mediaIds[2], 2)}
              </div>
            )}

            {post.mediaIds.length >= 4 && (
              <div className="grid grid-cols-2 gap-2">
                {post.mediaIds.slice(0, 4).map((id, idx) => (
                  <div key={idx} className="relative">
                    {renderMedia(id, idx)}
                    {idx === 3 && post.mediaIds.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          +{post.mediaIds.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox viewer */}
      {openViewer && (
        <Lightbox
          open={openViewer}
          close={() => setOpenViewer(false)}
          index={viewerIndex}
          slides={slides}
          plugins={[Video]}
          styles={{ container: { backgroundColor: "rgba(0,0,0,0.9)" } }}
        />
      )}
    </div>
  );
};

export default PostCard;
