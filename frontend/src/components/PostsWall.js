import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const PostsWall = () => {
  const [posts, setPosts] = useState([]);

  const currentUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/all`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsWall;
