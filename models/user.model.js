// Importing necessary modules
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

// Defining the user schema
const userSchema = new Schema(
    {
        // Defining the username field
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        // Defining the email field
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        // Defining the password field
        password: {
            type: String,
            required: [true, 'Password is required']
        },
    },
    {
        timestamps: true
    }
)

// Pre-save hook to hash password if it's modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

// Method to check if the entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Exporting the User model
export const User = mongoose.model("User", userSchema)