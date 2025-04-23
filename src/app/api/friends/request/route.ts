import { connectToDb } from "@/lib/mongodb";
import { authOptions } from "@/lib/options";
import FriendRequest from "@/model/FriendRequest";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

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
    const { receiverId } = await request.json();
    const senderid = user._id;
    await connectToDb();

    const req = await FriendRequest.findOne({
      $or: [
        { sender: senderid, receiver: receiverId },
        { sender: receiverId, receiver: senderid },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if(req){
      return NextResponse.json(
        { success: false, message:"Friend request already sent" },
        { status: 200 }
      );
    }

    await FriendRequest.create({
      sender: user._id,
      receiver: receiverId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Friend request sent",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in sending friend request",
      },
      {
        status: 500,
      }
    );
  }
}
