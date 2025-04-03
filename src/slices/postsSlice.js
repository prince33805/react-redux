import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/posts";

export const fetchPosts = createAsyncThunk("/", async () => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
});

export const createPost = createAsyncThunk("posts/createPost", async (postData) => {
    const response = await axios.post(API_URL, postData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
});

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return id;
});

const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [] },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload.posts;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(post => post.id !== action.payload);
            });
    },
});

export default postsSlice.reducer;
