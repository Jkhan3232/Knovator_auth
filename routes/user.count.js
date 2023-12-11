import express from 'express';
import passport from 'passport';
import Post from '../models/post.model.js';
const router = express.Router();
import isAuthenticated from "../middleware/auth.js"

// router.use(passport.authenticate('local', { session: false }));


// Task 5: Retrieve posts using latitude and longitude
router.get('/geo', isAuthenticated, async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        const posts = await Post.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: 10000, // in meters (adjust as needed)
                },
            },
        });
        res.json({ posts });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Task 5: Show the count of active and inactive posts in the dashboard
router.get('/post-count', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId, "sdlkas");
        const activePostCount = await Post.countDocuments({ createdBy: userId, active: true });
        const inactivePostCount = await Post.countDocuments({ createdBy: userId, active: false });

        res.json({ activePostCount, inactivePostCount });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching post counts' });
    }
});


export default router