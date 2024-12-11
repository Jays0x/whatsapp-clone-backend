import mongoose from "mongoose"

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'whatsapp'
        })
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message)
        process.exit(1)
    }
};