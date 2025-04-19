import { connectToDb } from "@/lib/mongodb";
import User from "@/model/User";

import { NextResponse } from "next/server";


export async function GET(request: Request,{params}:{params:Promise<{username:string}>}) {

    try {

        const {username}=await params
        await connectToDb()

        const profile = await User.findOne({username}).select("-password -createdAt -updatedAt -publicKey -privateKey");
        
        
        if (!profile) {
            return NextResponse.json({success: false, message: "Profile not found"}, {status: 404});
        }
        return NextResponse.json({success: true, message: profile}, {status: 200});
    } catch (error) {
        
        console.error(error);
        return NextResponse.json({success: false, message: "An error occurred"}, {status: 500});
    }
  
}