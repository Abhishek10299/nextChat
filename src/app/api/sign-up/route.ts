import { connectToDb } from "@/lib/mongodb";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  await connectToDb();

  try {
    const { username, email, password, publicKey } = await request.json();
    if (!username || !email || !password || !publicKey) {
      return NextResponse.json(
        { success: false, message: "all fields are required" },
        {
          status: 400,
        }
      );
    }

    const exestingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (exestingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exist",
        },
        {
          status: 400,
        }
      );
    }


    const profilePicture = `https://avatar.iran.liara.run/username?username=${username}`;

    await User.create({ username, email, password, profilePicture ,publicKey});

    return NextResponse.json(
      {
        success: true,
        message: "User Registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "failed to Register",
      },
      { status: 500 }
    );
  }
}
