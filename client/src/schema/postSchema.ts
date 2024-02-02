import mongoose, { Document, Model } from "mongoose";

// Define the IUser interface for the User model
interface IPost extends Document {
  file: string;
  userId: string;
  tags: string[];
  caption: string[];
  location: string[];
  createdAt: Date;
  userAvatar: string;
  likes: string[];
}

// creating schema
const postSchema = new mongoose.Schema<IPost>({
  file: String,
  userId: {
    type: String,
    required: true,
  },
  tags: [String],
  caption: [String],
  location: [String],
  createdAt: {
    type: Date,
  },
  userAvatar: String,
  likes: [String],
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
