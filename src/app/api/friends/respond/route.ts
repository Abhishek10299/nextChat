import { connectToDb } from "@/lib/mongodb";
import { authOptions } from "@/lib/options";
import FriendRequest from "@/model/FriendRequest";
import User from "@/model/User";
import { getServerSession } from "next-auth";
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

    const { requestId, action } = await request.json();
    await connectToDb();

    const req = await FriendRequest.findById(requestId);
    if (!req) {
      return NextResponse.json(
        {
          success: false,
          message: "Request not found",
        },
        {
          status: 404,
        }
      );
    }

    if (action === "accept") {
      await User.findByIdAndUpdate(req.sender, {
        $addToSet: { friends: req.receiver },
      });
      await User.findByIdAndUpdate(req.receiver, {
        $addToSet: { friends: req.sender },
      });

      req.status = "accepted";
    } else {
      req.status = "rejected";
    }

    await req.save();

    return NextResponse.json(
      {
        success: true,
        message: req.status,
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
        message: "Request not found",
      },
      {
        status: 404,
      }
    );
  }
}
