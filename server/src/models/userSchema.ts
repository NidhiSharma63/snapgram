import * as dotenv from "dotenv";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import mongoose, { Document, Model } from "mongoose";
dotenv.config();

// Define the IUser interface for the User model
interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  avtar: string;
  tokens: string[];
  bio: string;
  generateAuthToken: () => Promise<string>;
}

// creating schema
const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tokens: {
    type: [String], // Initialize as an empty array
    default: [],
  },
  avtar: String,
  bio: String,
});

// create a token
userSchema.methods.generateAuthToken = async function () {
  try {
    const secretKey = process.env.SECRET_KEY || "defaultSecret";
    const genToken = jwt.sign({ id: this._id.toString() }, secretKey);
    this.tokens = this.tokens.concat(genToken);
    await this.save();
    return genToken;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new Error("JWT signing error: " + error.message);
    } else {
      throw error; // rethrow other errors
    }
  }
};

// now we need to create the collection
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
