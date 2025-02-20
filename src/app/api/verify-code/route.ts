import {z} from 'zod'; 
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User.model';
import { usernameValidation } from '@/schemas/signUpSchema'; // import the user name validation schema

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username) // gets the unencoded version of encoded version URI
        const user = await UserModel.findOne({
            username: decodedUsername
        })
        if (!user) {
            return Response.json({
                success: false, 
                message: "User not found"
            })
        }
        // check for the validation of the code with expiry
        const isCodeValid = user.verifyCode === code // true/false value
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date() // expiry date must be greater than the now date
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save(); 
            return Response.json({
                success: true, 
                message: "Account Verified Successfully"
            }, {status: 200})
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false, 
                message: "Verification Code is Expired. Please sign up again to get a new code"
            }, {status: 400})   
        } else {
            return Response.json({
                success: false, 
                message: "Verificaiton Code is Invalid"
            })
        }
    } catch (error) {
        console.error("Error verifying Username", error)
        return Response.json({
            success: false, 
            message: "Error verifying Username"
        }, {status: 500})
    }
}