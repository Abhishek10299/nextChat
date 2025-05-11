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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    await connectToDb();

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("_id username profilePicture");

    return NextResponse.json(
      {
        success: true,
        message: users,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "An error occurred during search" },
      { status: 500 }
    );
  }
}
