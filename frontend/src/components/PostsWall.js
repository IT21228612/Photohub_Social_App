import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import Create_LP_PostModal from "./Create_LP_PostModal"; // Import the new LP Post Modal
import { PlusIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import LP_PostCard from "./LP_PostCard";

const PostsWall = () => {
  const [posts, setPosts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLPModal, setShowLPModal] = useState(false); // New state for LP Post Modal

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts/all`)
      .then((res) => {
        // Sort posts by createdAt in descending order
        const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollButton(window.scrollY > 150);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto relative mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-0 right-0 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl transform hover:-translate-y-1 transition"
        >
          <PlusIcon className="h-6 w-6" />
          <span className="font-semibold">New Post</span>
        </button>
        
        {/* Share Progress Button */}
        <button
          onClick={() => setShowLPModal(true)} // Open the LP Post Modal
          className="absolute top-0 right-40 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow-xl transform hover:-translate-y-1 transition"
        >
          <PlusIcon className="h-6 w-6" />
          <span className="font-semibold">Share Progress</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pt-12">
        {posts.map((post) =>
          post.postType === 0 ? (
            <PostCard key={post.id} post={post} />
          ) : (
            <LP_PostCard key={post.id} post={post} />
          )
        )}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:-translate-y-1 transition"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}

      {/* Create Post Modal */}
      {showModal && (
        <CreatePostModal closeModal={() => setShowModal(false)} setPosts={setPosts} />
      )}

      {/* Create LP Post Modal */}
      {showLPModal && (
        <Create_LP_PostModal closeModal={() => setShowLPModal(false)} setPosts={setPosts} />
      )}
    </div>
  );
};

export default PostsWall;
