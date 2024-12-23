import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Successfully connected to database ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};
