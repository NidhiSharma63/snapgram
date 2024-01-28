// creating a start function that will connect to database and run the server
import mongoose from "mongoose";

const connectDB = async (uri: string): Promise<typeof mongoose> => {
  return mongoose.connect(uri, {});
};
const connectToMongoDB = async () => {
  try {
    await connectDB(process.env.VITE_MONGODB_URI || "");
    console.log("connected to monogodb");
  } catch (error) {
    console.log("::error::", error);
  }
};

export { connectToMongoDB };
