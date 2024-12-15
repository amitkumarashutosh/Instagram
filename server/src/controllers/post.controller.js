import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res
        .status(400)
        .json({ message: "Image required", success: false });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username avatar" })
      .populate([
        {
          path: "comments",
          sort: { createdAt: -1 },
          populate: {
            path: "author",
            select: "username avatar",
          },
        },
      ]);
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, avatar",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, avatar",
        },
      });

    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();

    const user = await User.findById(userId).select("username avatar");
    const postOwnerId = post.author.toString();
    if (postOwnerId) {
      const notification = {
        type: "like",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    await post.updateOne({ $pull: { likes: userId } });
    await post.save();

    const user = await User.findById(userId).select("username avatar");
    const postOwnerId = post.author.toString();
    if (postOwnerId) {
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was dislike",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    const { text } = req.body;
    if (!text) {
      return res
        .status(400)
        .json({ message: "Text is required", success: false });
    }

    let comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    comment = await Comment.findById(comment._id).populate({
      path: "author",
      select: "username avatar",
    });

    post.comments.push(comment._id);
    await post.save();

    return res
      .status(201)
      .json({ message: "Comment added", comment, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const getPostComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username, avatar"
    );

    if (!comments) {
      return res
        .staus(404)
        .json({ message: "No comments found for this post", success: false });
    }

    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    if (userId !== post.author.toString()) {
      return res.status(401).json({ message: "Unauthorized ", success: false });
    }

    //delete post
    await Post.findByIdAndDelete(post._id);

    //delete post from user
    const user = await User.findById(userId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    user.save();

    //delete assocaited comments of post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ message: "Post deleted", success: true });
  } catch (error) {
    console.log(error);
  }
};

const bookmarkPost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    const user = User.findById(userId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      user.save();

      return res
        .status(401)
        .json({ message: "Post removed from bookmark", success: false });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      user.save();

      return res.status(200).json({ message: "Post bookmark", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  getPostComment,
  deletePost,
  bookmarkPost,
};
