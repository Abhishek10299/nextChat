import { authOptions } from "@/lib/options";
import FriendRequest from "@/model/FriendRequest";
import Users from "@/model/User";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
    const senderid = user._id;

    const { receiverid } = await request.json();

    const req = await FriendRequest.findOne({
      $or: [
        { sender: senderid, receiver: receiverid },
        { sender: receiverid, receiver: senderid },
      ],
      status: { $in: ["accepted", "pending"] },
    });

    if (!req) {
      return NextResponse.json(
        { success: true, message:"none" },
        { status: 200 }
      );
    }

    console.log(req.status)

    return NextResponse.json(
      { success: true, message: req.status },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "failded to get request" },
      { status: 500 }
    );
  }
}
