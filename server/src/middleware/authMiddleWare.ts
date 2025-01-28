import type { NextFunction, Request, Response } from "express";
import User from "../models/userSchema";
import type { IUser } from "./../../../client/src/constant/interfaces";

interface AuthRequest extends Request {
	userId?: string;
}
const checkAuthorization = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.headers.authorization?.split(" ")[1]; // Remove 'Bearer ' prefix
		const userId = req.query.userId || req.body.userId;

		// if (!userId?.trim()) {
		// 	return res.status(400).json({ error: "UserId is missing" });
		// }

		if (!token) {
			return res.status(401).json({ error: "Authorization token is missing" });
		}

		// Find user in database
		const getUserFromDB: IUser | null = await User.findById(userId);
		if (!getUserFromDB) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if token exists in the user's stored tokens
		const validToken = getUserFromDB.tokens.find(
			(item) => item.token === token,
		);
		if (!validToken) {
			return res.status(401).json({ error: "Authorization token is invalid" });
		}

		// attach user id
		// req.userId = getUserFromDB._id.toString();
		next();
	} catch (error) {
		console.error("Auth Middleware Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export default checkAuthorization;
