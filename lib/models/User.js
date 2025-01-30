import mongoose from 'mongoose';


/**
 * User Schema
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
    }
}, {
    timestamps: true,
})

export default mongoose.models.User || mongoose.model('User', userSchema);