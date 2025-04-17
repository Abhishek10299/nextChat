import { connectToDb } from "@/lib/mongodb";
import { authOptions } from "@/lib/options";
import FriendRequest from "@/model/FriendRequest";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export default async function POST(request:NextRequest) {
    try {
        const session=await getServerSession(authOptions);
        if(!session||!session.user){
            return NextResponse.json(
                {
                    success: false,
                    message: "Not Authenticated",
                  },
                  {
                    status: 401,
                  }
            )
        }
    
        await connectToDb()
        const requests=await FriendRequest.find({
            $or:[{sender:session.user._id},
                {receiver:session.user._id}
            ]
        }).populate('sender receiver')
    
        return NextResponse.json(
            {
                success: true,
                message: requests,
              },
              {
                status: 200,
              }
        )
    } catch (error) {
        
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }


}