import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connection Established!");
  } catch (error) {
    console.log("Full Error Details:", error);
  }
};

export default connectDb;
