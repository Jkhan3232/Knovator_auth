import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    active: { type: Boolean, default: true },

    geoLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            default: [null, null],
        },
    },

},
    {
        timestamps: true
    }
);

PostSchema.index({ geoLocation: '2dsphere' });
const Post = mongoose.model("Post", PostSchema);


export default Post;