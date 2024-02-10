import mongoose, { Document } from "mongoose";

// Define the IUser interface for the User model
interface ILikes extends Document {
  postId: string[];
  userId: string;
}

// creating schema
const postSchema = new mongoose.Schema<ILikes>({
  userId: String,
  postId: [String],
});

// now we need to create the collection

export default mongoose.models?.Like || mongoose.model<ILikes>("Like", postSchema);
