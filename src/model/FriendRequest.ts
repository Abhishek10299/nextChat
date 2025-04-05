import mongoose, { model, models, Schema } from "mongoose";

export interface IFriendRequest extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const FriendRequest =
  models?.FriendRequest ||
  model<IFriendRequest>("FriendRequest", FriendRequestSchema);

export default FriendRequest;
