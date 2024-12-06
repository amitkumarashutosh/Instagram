import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost:null
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    deletePosts: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    setSelectedPost:(state,action)=>{
      state.selectedPost=action.payload
    }
  },
});

export const { setPosts, deletePosts ,setSelectedPost} = postSlice.actions;

export default postSlice.reducer;
