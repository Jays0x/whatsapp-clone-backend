import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    verificationCode: {
        type: Number,
    },
    verificationExpiryDate: {
        type: Date,
    },
    // role: {
    //     type: String,
    //     enum: ['admin', 'user'],
    //     default: 'user'
    // },
    isActive: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);


export default models.User || model('User', userSchema);
