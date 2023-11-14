import * as dotenv from "dotenv";
import mongoose, { Document, Model } from "mongoose";
dotenv.config();

// Define the IUser interface for the User model
interface ILikes extends Document {
  postId: string;
  likes: string[];
}

// creating schema
const postSchema = new mongoose.Schema<ILikes>({
  postId: String,
  likes: [String],
});

// now we need to create the collection
const Like: Model<ILikes> = mongoose.model<ILikes>("Like", postSchema);

export default Like;
