import mongoose, { Schema, models, model } from "mongoose";
import User from "./User";

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  contentEncrypted: string;
  timestamp: Date;
}

 export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  lastUpdated: Date;
}

const ChatSchema = new Schema<IChat>({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      contentEncrypted: {
        type: String,
        required: [true, "content is require"],
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

const Chat = models?.Chat || model("Chat", ChatSchema);
export default Chat;
