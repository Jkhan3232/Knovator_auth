// Import necessary modules and dependencies
import Post from '../models/post.model.js';
import { asyncHandler } from '../utils/AsyncHendaler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';



// Middleware for creating a new post
const createPost = asyncHandler(async (req, res) => {
    try {
        // Extract required information from the request body
        const { title, body, address } = req.body;

        // Generate random latitude and longitude values
        const latitude = Math.random() * 180 - 90;
        const longitude = Math.random() * 360 - 180;

        const createdBy = req.user._id;

        // Create a new post instance
        const newPost = new Post({
            title,
            body,
            createdBy,
            geoLocation: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
        });

        // Save the new post to the database
        const post = await newPost.save();

        // Respond with a success message and the created post
        return res.status(201).json(new ApiResponse(200, post, 'Post created successfully'));
    } catch (err) {
        // Handle errors and respond with an appropriate error message and status code
        console.error(err);
        return res.status(err.statusCode || 500).json(new ApiError(err.message, err.statusCode || 500));
    }
});
// Middleware for retrieving posts for a specific user
const getPosts = asyncHandler(async (req, res) => {
    try {
        // Extract the user ID from the request
        const createdBy = req.user._id;

        // Retrieve posts created by the specified user
        const posts = await Post.find({ createdBy });

        // Check if posts were found
        if (!posts || posts.length === 0) {
            return res.status(404).json(new ApiError(404, null, 'No posts found for the user'));
        }

        // Respond with the retrieved posts
        return res.status(200).json(new ApiResponse(200, posts, 'Posts retrieved successfully'));
    } catch (err) {
        // Handle errors and respond with an appropriate error message and status code
        console.error(err);
        return res.status(err.statusCode || 500).json(new ApiError(err.message, err.statusCode || 500));
    }
});

// Middleware for updating an existing post
const updatePost = asyncHandler(async (req, res) => {
    try {
        // Extract information from the request body and parameters
        const { title, body } = req.body;
        const postId = req.params.id;
        const createdBy = req.user._id;

        // Find and update the specified post
        const post = await Post.findOneAndUpdate(
            { _id: postId, createdBy },
            { title, body },
            { new: true }
        );

        // Check if the post was found and updated
        if (!post) {
            return res.status(404).json(new ApiError(404, null, 'Post not found'));
        }

        // Respond with the updated post
        return res.status(200).json(new ApiResponse(200, post, 'Post updated successfully'));
    } catch (err) {
        // Handle errors and respond with an appropriate error message and status code
        console.error(err);
        return res.status(err.statusCode || 500).json(new ApiError(err.message, err.statusCode || 500));
    }
});

// Middleware for deleting an existing post
const deletePost = asyncHandler(async (req, res) => {
    try {
        // Extract information from the request parameters
        const postId = req.params.id;
        const createdBy = req.user._id;

        // Find and delete the specified post
        const post = await Post.findOneAndDelete({ _id: postId, createdBy });

        // Check if the post was found and deleted
        if (!post) {
            return res.status(404).json(new ApiError(404, null, 'Post not found'));
        }

        // Respond with a deletied post
        return res.status(200).json(new ApiResponse(200, post, 'Post deleted successfully'));
    } catch (err) {
        // Handle errors and respond with an appropriate error message and status code
        console.error(err);
        return res.status(err.statusCode || 500).json(new ApiError(err.message, err.statusCode || 500));
    }
});

// Export the middleware functions for use in routes
export {
    createPost,
    getPosts,
    updatePost,
    deletePost,
};

