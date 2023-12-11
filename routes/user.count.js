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

        // Log the indexes
        Post.collection.getIndexes({ full: true })
            .then(indexes => {
                // console.log("indexes:", indexes);
            })
            .catch(console.error);

        // Recreate the index
        await Post.collection.dropIndex('geoLocation_2dsphere');
        await Post.collection.createIndex({ geoLocation: '2dsphere' });

        // Check the data
        const Posts = await Post.findOne({});
        // console.log('geoLocation:', samplePost.geoLocation);

        // Query with $geoNear
        const post = await Post.find({
            geoLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })
        res.json({ Posts, post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
});



// Task 5: Show the count of active and inactive posts in the dashboard
router.get('/post-count', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(userId, "sdlkas");
        const activePostCount = await Post.countDocuments({ createdBy: userId, active: true });
        const inactivePostCount = await Post.countDocuments({ createdBy: userId, active: false });

        res.json({ activePostCount, inactivePostCount });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching post counts' });
    }
});


export default router