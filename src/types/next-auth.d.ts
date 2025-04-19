import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email?: string;
    profilePicture?:string;
    publicKey?: string;
    friends?: mongoose.Types.ObjectId[];
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      email?: string;
      profilePicture?:string;
      publicKey?: string;
      friends?: mongoose.Types.ObjectId[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    profilePicture?:string;
    email?: string;
    publicKey?: string;
    friends?: mongoose.Types.ObjectId[];
  }
}
