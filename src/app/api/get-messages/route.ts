import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
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
    const userId = new mongoose.Types.ObjectId(user._id) // now the userId will convert to the mongoose object
    try {
        // now we need the messages of the user. But if we pass all the messages in The messaeges Array[] we can't modify the return by
        // our choice. So we can USE AGGREGATION PIPELINE.
        // we'll create a document for each message
        
        const user = await UserModel.aggregate([
            // 1st Pipeline: [$match the User based oon _id]
            {
                $match: { $id: userId }, 
            }, 
            // 2nd Pipeline: [Unwind The Arrays] it'll open The messages Array into objects and all will contain same userId
            {
            
                $unwind: '$messages' // on which parameter unwind is applicable
            }, 
            // 3rd Pipeline: Now we have the document. We can use methods like $sort
            {
                $sort: {'messages.createdAt': -1} // sort the documents by created date of the message in ascending order
            }, 
            // 4th Pipeline: $group the documents and send it
            {
                $group: {_id: '$_id', messages: {$push: '$messages'}}
            }
            
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false, 
                    message: "User NOT FOUND"
                }, { status: 401 }
            )
        }

        return Response.json(
            {
                success: true, 
                message: user[0].messages
            }, { status: 200 }
        )
    } catch (error) {
        console.log("Error in Getting Messages", error);
        return Response.json(
            {
                success: false, 
                message: "Error in Getting Messages"
            }, {status: 500}
        )
    }
}