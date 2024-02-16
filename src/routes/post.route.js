// Importing necessary modules
import express from 'express'
import isAuthenticated from "../middleware/auth.js"
// Importing controllers
import { createPost, getPosts, updatePost, deletePost } from '../controllers/Poat.controller.js'
// Initializing express router
const router = express.Router();



// Route for creating a post
router.post('/createpost', isAuthenticated, createPost);
// Route for getting posts
router.get('/getpost', isAuthenticated, getPosts);
// Route for updating a post
router.put('/update/:id', isAuthenticated, updatePost);
// Route for deleting a post
router.delete('/delete/:id', isAuthenticated, deletePost);

// Exporting the router
export default router;  
