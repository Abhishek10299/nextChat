import { connectToDb } from "@/lib/mongodb";
import { authOptions } from "@/lib/options";
import FriendRequest from "@/model/FriendRequest";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }
    const user: User = session.user as User;

    await connectToDb();
    const requests = await FriendRequest.find({
      receiver: user._id,
      status: "pending",
    }).populate("sender", "username profilePicture");

    return NextResponse.json(
      {
        success: true,
        message: requests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
