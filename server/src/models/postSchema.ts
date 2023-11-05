import * as dotenv from "dotenv";
import mongoose, { Document, Model } from "mongoose";
dotenv.config();

// Define the IUser interface for the User model
interface IPost extends Document {
  content: string;
  userId: string;
  tags: string[];
  caption: string[];
  location: string[];
}

// creating schema
const postSchema = new mongoose.Schema<IPost>({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  tags: [String],
  caption: [String],
  location: [String],
});

// now we need to create the collection
const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default Post;
