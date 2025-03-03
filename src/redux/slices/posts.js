import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js"

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {
    const response = await axios.get('/posts')
    return response.data
})

export const fetchTags = createAsyncThunk('/tags/fetchTags', async () => {
    const response = await axios.get('/tags')
    return response.data
})

export const fetchRemovePost = createAsyncThunk('/tags/fetchRemovePost', async (id) => 
    axios.delete(`/posts/${id}`)
)

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'succeeded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'succeeded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },

        // Удаление статей
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
        }
    }
})

export const postsReducer = postsSlice.reducer;