import Posts from "../mongodb/models/posts.js";
import User from "../mongodb/models/user.js"

import * as dotenv from "dotenv";

import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);


const getAllPosts = async (req, res) => { };
const getPostsDetail = async (req, res) => { };

const createPosts = async (req, res) => {
    try {
        const { title, description, photo } = req.body;
        // start a new session 
        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findOne({ email }).session(session);
        if (!user) throw new Error("User not found");

        const photoUrl = await cloudinary.uploader.upload(photo);
        const newPost = await Posts.create({
            title, description, photo: photoUrl.url, creator: user._id
        });

        user.allPosts.push(newPost._id);
        await user.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: "Post created successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

};

const updatePosts = async (req, res) => { };
const deletePosts = async (req, res) => { };

export {
    getAllPosts, getPostsDetail, createPosts, updatePosts, deletePosts
}