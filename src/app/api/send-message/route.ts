import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User.model"

export async function POST(request:Request) {
    await dbConnect(); 
    
    // as it's handling anonymous messages. We don't need the user to be Logged In mandatorily
    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false, 
                    message: "User NOT FOUND"
                }, { status: 404 }
            )
        }

        // is User Accepting The messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false, 
                    message: "User Currently Not Accepting Messages"
                }, { status: 403 } // forbidden status
            )
        }

        const newMessage = { content, createdAt: new Date() }  
        user.message.push(newMessage as Message) // Asserting As Message to ensure the given parameters are of certain type
        await user.save()
        return Response.json(
            {
                success: true, 
                message: "Message Sent Successfully"
            }, { status: 200 } // forbidden status
        )

    } catch (error) {
        return Response.json(
            {
                success: false, 
                message: "Error while Sending Message. Try"
            }, {status: 500}
        )
    }
}