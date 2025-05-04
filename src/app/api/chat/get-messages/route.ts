import { connectToDb } from "@/lib/mongodb";
import { authOptions } from "@/lib/options";
import Chat from "@/model/Chat";
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
          status: 401, // Unauthorized
        }
      );
    }
    const senderId = session.user._id;
    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { success: false, message: "Missing receiverId" },
        { status: 400 } // Bad Request
      );
    }

    await connectToDb();

    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    }).lean();

    if (!chat) {
      return NextResponse.json(
        { success: true, messages: [] },
        { status: 200 } // OK
      );
    }

    if (Array.isArray(chat)) {
      return NextResponse.json(
        {
          success: true,
          messages: [],
        },
        { status: 500 } // Internal Server Error (this case should not happen)
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: chat.messages || [],
      },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}
