import mongoose, { Schema, Document } from "mongoose";
// Document is needed as we're using typescript

// datatype of messages.
export interface Message extends Document{
    content: string; 
    createdAt: Date; 
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Date, 
        required: true, 
        default: Date.now
    }
})
 
export interface User extends Document{
    username: string; 
    email: string; 
    password: string; 
    verifyCode: string;
    verifyCodeExpiry: Date; 
    isVerified: boolean; 
    isAcceptingMessage: boolean; 
    message: Message[] 
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String, 
        required: [true, "Username is Required!"],
        trim: true, 
        unique: true
    }, 
    email: {
        type: String, 
        required: [true, "Email is Required"], 
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email Address"]
    }, 
    password: {
        type: String, 
        required: [true, "Password is Required"]
    },
    verifyCode: {
        type: String, 
        required: [true, "Verification Code is Required"]
    }, 
    verifyCodeExpiry: {
        type: Date, 
        required: [true, "Verification code Expiry is Required"], 
        default: Date.now
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    isAcceptingMessage: {
        type: Boolean, 
        default: true,
    },
    message: [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel; 