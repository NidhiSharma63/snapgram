import * as dotenv from "dotenv";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import mongoose, { type Document, type Model } from "mongoose";
dotenv.config();

// Define the IUser interface for the User model
interface IUser extends Document {
	email: string;
	password: string;
	username: string;
	avatar: string;
	tokens: { token: string; uniqueBrowserId: string }[];
	bio: string;
	generateAuthToken: (uniqueBrowserId: string) => Promise<string>;
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
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
			uniqueBrowserId: {
				type: String,
				required: true,
			},
		},
	],
	avatar: String,
	bio: String,
});
userSchema.methods.generateAuthToken = async function (
	uniqueBrowserId: string,
) {
	try {
		const secretKey = process.env.SECRET_KEY || "defaultSecret";
		const genToken = jwt.sign({ id: this._id.toString() }, secretKey);
		this.tokens = [...this.tokens, { token: genToken, uniqueBrowserId }];
		await this.save();
		return genToken;
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			throw new Error(`JWT signing error: ${error.message}`);
		} 
	}
};
// now we need to create the collection
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
