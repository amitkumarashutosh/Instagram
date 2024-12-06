import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    const isUserExist = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (isUserExist) {
      return res.status(401).json({
        message: "Try different email or username",
        success: false,
      });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const populatePosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        userData,
      });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (_, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .status(200)
      .json({ message: "Logout successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const avatar = req.file;
    let cloudResponse;

    if (avatar) {
      const fileUri = getDataUri(avatar);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (avatar) user.avatar = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
        success: false,
      });
    }

    return res.status(200).json({ success: true, suggestedUsers });
  } catch (error) {
    console.log(error);
  }
};

const followOrUnfollow = async (req, res) => {
  const userId = req.id;
  const followingId = req.params.id;

  if (followingId === userId) {
    return res.status(400).json({
      message: "You cannot follow/unfollow yourself",
      success: false,
    });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(followingId);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(followingId);

    if (isFollowing) {
      //unfollow
      await Promise.all([
        User.updateOne({ _id: userId }, { $pull: { following: followingId } }),
        User.updateOne({ _id: followingId }, { $pull: { followers: userId } }),
      ]);

      return res
        .status(200)
        .json({ success: true, message: "Unfollowed successfully" });
    } else {
      //follow
      await Promise.all([
        User.updateOne({ _id: userId }, { $push: { following: followingId } }),
        User.updateOne({ _id: followingId }, { $push: { followers: userId } }),
      ]);

      return res
        .status(200)
        .json({ success: true, message: "Followed successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
};
