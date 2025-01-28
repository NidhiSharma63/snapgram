import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isSeen: {
      type: Boolean,
      default: false, // Tracks whether the message has been seen
    },
    seenAt: {
      type: Date, // Tracks the exact time when the message was seen
      default: null,
    },
  },
);

export default mongoose.model("Chat", chatSchema);
