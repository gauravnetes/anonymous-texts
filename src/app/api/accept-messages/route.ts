import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions) // we got the session 
    const user : User = session?.user as User

    if(!session || !session.user) {
        return Response.json(
            {
                success: false, 
                message: "Not Authenticatedr"
            }, { status: 401 }
        )
    }

    const userId = user._id    
    const {acceptMessages} = await request.json() // the acceptMessage flag/toggle we get from the frontend and extract
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessage: acceptMessages}, 
            {new: true}
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false, 
                    message: "Failed to Update User Status to accept messages"
                }, {status: 401}
            )
        }

        return Response.json(
            {
                success: true, 
                message: "Message Acceptance Status Updated Successfully", 
                updatedUser // send the updated User also with the response
            }, {status: 200}
        )
    } catch (error) {
        console.log("Failed to Update User Status to accept messages");
        return Response.json(
            {
                success: false, 
                message: "Failed to Update User Status to accept messages"
            }, {status: 500}
        )
    }
}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions) // we got the session 
    const user : User = session?.user as User

    if(!session || !session.user) {
        return Response.json(
            {
                success: false, 
                message: "Not Authenticatedr"
            }, { status: 401 }
        )
    }

    const userId = user._id    

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false, 
                    message: "User Not Found"
                }, { status: 200 }
            ) 
        }
        return Response.json(
            {
                success: false, 
                isAcceptingMessages: foundUser.isAcceptingMessage
            }
        )
    } catch (error) {
        console.log("Error in Getting Message Acceptance Status", error);
        return Response.json(
            {
                success: false, 
                message: "Error in Getting Message Acceptance Status"
            }, {status: 500}
        )
    }
}