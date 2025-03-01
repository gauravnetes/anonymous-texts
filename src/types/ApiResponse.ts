import { Message } from "@/models/User.model";


export interface ApiResponse{
    success: boolean; 
    message: string; 
    isAcceptingMessage: boolean; 
    messages?: Array<Message>  // sends the array of messages to the user
}

