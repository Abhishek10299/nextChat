import { authOptions } from "@/lib/options";
import FriendRequest from "@/model/FriendRequest";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        if(!session||!session.user){
            return NextResponse.json({
                success: false,
                message: "Not Authenticated",
                },
            {
                status: 401,
            })
        }
        const user:User= session.user as User
        const senderid=user._id;
        
        const {receiverid}=await request.json()

        const req= await FriendRequest.findOne({$and:[{senderid},{receiverid}]})
        if(!req){
            return NextResponse.json({success:false,message:"NotSend"},{status:200})
        }

        return NextResponse.json({success:false,message:req.status},{status:200})
        
    } catch (error) {
        
    }
}