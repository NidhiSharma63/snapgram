import mongoose, { Document } from "mongoose";

// Define the IUser interface for the User model
interface IPost extends Document {
  file: string[];
  userId: string;
  tags: string[];
  caption: string[];
  location: string;
  createdAt: Date;
  userAvatar: string;
  likes: string[];
}

// creating schema
const PostSchema = new mongoose.Schema<IPost>({
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

export default mongoose.models?.Post || mongoose.model<IPost>("Post", PostSchema);

// export default Post;
