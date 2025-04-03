import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, deletePost } from '../slices/postsSlice';
import { Link } from 'react-router-dom';
import { createPost } from '../slices/postsSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts } = useSelector((state) => state.posts);
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Extract username from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        setUsername(payload.username); // Assuming token contains { username: "john_doe" }
      } catch (e) {
        console.error('Invalid token:', e);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    window.location.reload(); // Reload page (or navigate to login)
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Title and content are required!');

    try {
      await dispatch(createPost({ title, content, author: username })).unwrap();
      dispatch(fetchPosts()); // Refresh posts
      setTitle('');
      setContent(''); // Clear form
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <div>
          {username ? (
            <>
              <span className="mr-4 text-gray-700">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="mr-4 text-gray-700">
                Please login to see all posts
              </span>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
      {username && (
        <form onSubmit={handleCreatePost} className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold">Create New Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 my-2"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 my-2"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </form>
      )}

      {posts.map((post) => (
        <div key={post.id} className="border p-4 mt-2">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p>{post.content}</p>
          <p className="text-sm text-gray-600">Author: {post.author}</p>

          {post.author === username && (
            <button
              onClick={() => dispatch(deletePost(post.id))}
              className="bg-red-500 text-white px-4 py-1 mt-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Posts;
