// Importing necessary modules and functions
import { Router } from "express";
import isAuthenticated from "../middleware/auth.js";
// Importing controllers
import {
  register,
  getMe,
  logout,
  login,
} from "../controllers/User.controller.js";
// Initializing express router
const router = Router();

// Route for user registration
router.route("/register").post(register);
// Route for user login
router.route("/login").post(login);
// Route for getting user details
router.route("/getme").get(isAuthenticated, getMe);
// Route for user logout
router.route("/logout").post(isAuthenticated, logout);

// Exporting the router
export default router;
