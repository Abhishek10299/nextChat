import { connectToDb } from "@/lib/mongodb";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import nacl from "tweetnacl";
import util from "tweetnacl-util";

export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey),
  };
}

export async function POST(request: NextRequest) {
  await connectToDb();

  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
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

    const { publicKey, privateKey } = generateKeyPair();

    await User.create({ username, email, password, publicKey, privateKey });

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
