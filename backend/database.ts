import mongoose from "npm:mongoose";

const connectDB = async () => {
    try {
        const uri = Deno.env.get("MONGODB_URI");
        if (!uri) {
            throw new Error("MONGODB_URI environment variable is not set");
        }

        await mongoose.connect(uri);
        
        console.log("Connected to Database!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectDB;