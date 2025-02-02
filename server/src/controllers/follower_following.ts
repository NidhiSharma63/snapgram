import type { NextFunction, Request, Response } from "express";

import User from "../models/userSchema";

const addFollower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, followerId } = req.body;
    const user = await User.findOne({ _id: userId });
    const followingUser = await User.findOne({ _id: followerId });

    if(!user || !followingUser) {
      throw new Error("User not found");
    }

    if (user && followingUser) {

      // if following user is not in the followers list of user
      // then add the following user to the followers list
      if(user.followers.map(id => id.toString()).includes(followerId.toString())) {
        return res.status(201).json(user);
      }
      user.followers.push(followerId);
      // update the following list of the user who followed
      followingUser.followings.push(userId);
      await user.save();
      await followingUser.save();
      res.status(201).json(user);
    }
  } catch (error) {
    next(error);
  }
}

const removeFollower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, followerId } = req.body;
    const user = await User.findOne({ _id: userId });
    const followingUser = await User.findOne({ _id: followerId });

    if (!user || !followingUser) {
      throw new Error("User not found");
    }

    if (!user.followers.map(id => id.toString()).includes(followerId.toString())) {
      return res.status(201).json(user);
    }

    user.followers = user.followers.filter((id) => id.toString() !== followerId.toString());
    followingUser.followings = followingUser.followings.filter((id) => id.toString() !== userId.toString());

    await user.save();
    await followingUser.save();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export { addFollower, removeFollower };
