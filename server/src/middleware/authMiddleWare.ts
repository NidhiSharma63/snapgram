import { NextFunction, Request, Response } from "express";
import User from "../models/userSchema";

const checkAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    let userId = req.body.userId;
    if (req.query.userId) {
      userId = req.query.userId;
    }

    if (!userId || !userId?.trim()) {
      throw new Error("UserId is Missing");
    }
    if (!token) {
      throw new Error("Authorization token is Missing");
    }

    const getUserFromDB = await User.findOne({ _id: userId });
    if (getUserFromDB === null) {
      throw new Error("User not found");
    }
    const validToken = getUserFromDB.tokens.filter((item) => item.token !== token);
    if (!validToken) {
      throw new Error("Authorization token is invalid");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkAuthorization;
