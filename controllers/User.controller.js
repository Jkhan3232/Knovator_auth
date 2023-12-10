import { asyncHandler } from "../utils/AsyncHendaler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import passport from "passport";
import jwt from "jsonwebtoken";

// Registration route
const register = asyncHandler(async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if any required field is missing
        if ([email, username, password].some((field) => !field?.trim())) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if user with the same email or username already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        // Create a new user
        const user = await User.create({
            email,
            password,
            username: username,
        });

        // Fetch the created user without the password field
        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new ApiError(
                500,
                "Something went wrong while registering the user"
            );
        }

        // Respond with the created user
        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        console.error(error);
        // Use throw to propagate the error to the error handling middleware
        throw new ApiError(501, "Internal Server Error");
    }
});

// Login route
const login = (req, res, next) => {
    try {
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                // User not found or invalid credentials
                return res
                    .status(401)
                    .json(new ApiError(401, "Invalid email or password"));
            }
            // Generate a JWT token and set it in a cookie
            const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
                expiresIn: "10m",
            });
            res.cookie("token", token, { httpOnly: true });
            // Respond with the token and user details
            return res.json({ token, user });
        })(req, res, next);
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
// Get user details route
const getMe = asyncHandler(async (req, res) => {
    try {
        const token = req.cookies.token || "";
        // Check if a valid token exists
        if (token) {
            // Respond with a success message
            return res
                .status(200)
                .json(new ApiResponse(200, req.user, "User details retrieved successfully"));
        } else {
            throw new ApiError(401, "Login first");
        }
    } catch (error) {
        // Throw ApiError for consistent error handling
        throw new ApiError(404, "Login first", error);
    }
});

// Logout route
const logout = asyncHandler(async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token");
        // Respond with a success message
        return res
            .status(200)
            .json(new ApiResponse(200, null, "User logged out successfully"));
    } catch (error) {
        console.error("Error logging out user:", error);
        // Throw ApiError for consistent error handling
        throw new ApiError(500, "Internal server error");
    }
});

// Export endpoints
export { register, login, getMe, logout };
