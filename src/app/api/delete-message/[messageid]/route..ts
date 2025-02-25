import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request:Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid
    await dbConnect(); 

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

    // const userId = user._id // if we take userId like this, as it was converted toString() it will cause issue if we use Agg. pipeline
    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id}, 
            {$pull: {message: {_id: messageId}}}
        )
        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false, 
                    message: "Message Not Found or Already Deleted"
                }, 
                {status: 404}
            )
        }

        return Response.json(
            {
                success: true, 
                message: "Message Deleted"
            }, {status: 200}
        )
    } catch (error) {
        console.log("Error in Delete Message Route: ", error)
        return Response.json(
            {
                success: false, 
                message: "Error Deleting Message"
            }, {status: 500}
        )
    }
    
}