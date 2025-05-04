import { connectToDb } from "@/lib/mongodb";
import { authOptions } from "@/lib/options";
import User from "@/model/User";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    await connectToDb();

    const currentUserId = session.user._id;

    const user = await User.findById(currentUserId)
      .populate({
        path: "friends",
        select: "_id username profilePicture publicKey"
      });

    if (!user || user.friends.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You have no friends",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: user.friends,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in getting friends",
      },
      { status: 500 }
    );
  }
}
