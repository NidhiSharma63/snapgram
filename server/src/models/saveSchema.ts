import mongoose, { Document, Model } from "mongoose";

// Define the IUser interface for the User model
interface ISaves extends Document {
  userId: string;
  postId: string[];
}

// creating schema
const saveSchema = new mongoose.Schema<ISaves>({
  postId: [String],
  userId: String,
});

// now we need to create the collection
const Save: Model<ISaves> = mongoose.model<ISaves>("Save", saveSchema);

export default Save;
