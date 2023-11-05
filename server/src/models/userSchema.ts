import * as dotenv from "dotenv";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import mongoose, { Document, Model } from "mongoose";
dotenv.config();

interface IUserSchema {
  email: {
    type: string;
    required: boolean;
    unique: boolean;
  };
  password: {
    type: string;
    required: boolean;
  };
  userName: {
    type: string;
    required: boolean;
  };
  avtar: string;
  token?: string;
  bio?: string;
}

// creating schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  token: String,
  avtar: String,
});

// Define the IUser interface for the User model
interface IUser extends Document {
  email: {
    type: string;
    required: boolean;
    unique: boolean;
  };
  password: {
    type: string;
    required: boolean;
  };
  userName: {
    type: string;
    required: boolean;
  };
  avtar: string;
  token?: string;
  bio?: string;
}

// Define the UserModel type
type UserModel = Model<IUser>;

// create a token
userSchema.methods.generateAuthToken = async function () {
  try {
    const secretKey = process.env.SECRET_KEY || "defaultSecret";
    const genToken = jwt.sign({ id: this._id.toString() }, secretKey);
    this.token = genToken;
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

// // Apply the uniqueValidator plugin to the userSchema
// userSchema.plugin(uniqueValidator, {
//   message: "{PATH} already exists.", // {PATH} will be replaced with the field name, i.e., "Email"
// });

// now we need to create collection

const User: UserModel = mongoose.model<IUser, UserModel>("User", userSchema);

module.exports = User;
