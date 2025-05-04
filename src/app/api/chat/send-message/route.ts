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
          status: 401,
        }
      );
    }

    const senderId = session?.user._id;
    const { receiverId, message,nonce } = await request.json();

    if (!receiverId || !message || !nonce) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await connectToDb();

    let conversation = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Chat.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = {
      sender: senderId,
      receiver: receiverId,
      contentEncrypted: message,
      nonce,
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    return NextResponse.json({
      success: true,
      message: "Message sent",
      chat: conversation,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
