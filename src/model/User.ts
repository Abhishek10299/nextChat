import bcrypt from "bcryptjs";
import mongoose, { Schema, models, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  publicKey: string;
  privateKey: string;
  friends: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is require"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is require"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please use a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is require"],
    },
    publicKey: {
      type: String,
      required: [true, "public key is require"],
    },
    privateKey: {
      type: String,
      required: [true, "private key is require"],
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model("User", UserSchema);
export default User;
