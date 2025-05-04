import mongoose, { Schema, models, model } from "mongoose";

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  contentEncrypted: string;
  nonce: string;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
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
      receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      contentEncrypted: {
        type: String,
        required: [true, "content is require"],
      },
      nonce: {
        type: String,
        require: [true, "Nonce is required"],
      },
    },
  ],
});

const Chat = models?.Chat || model("Chat", ChatSchema);
export default Chat;
