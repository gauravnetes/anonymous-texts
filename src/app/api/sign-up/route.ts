import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username, 
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false, 
                message: "Username is Already Taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false, 
                    message: "User With this Email Already Exists"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword; 
                existingUserByEmail.verifyCode = verifyCode; 
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        } else {
            // The User have came for the first Time => Register
            // if we didn't get existingUserByEmail then the user have came here for the first time. 
            // first hash the password
            // then
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()  // Date() is stored as an object in the expiryDate. so we can modify this object even if it's const
                      
            expiryDate.setHours(expiryDate.getHours() + 1) 

            const newUser = new UserModel({
                    username, 
                    email,  
                    password: hashedPassword,  
                    verifyCode,
                    verifyCodeExpiry: expiryDate,  
                    isVerified: false,  
                    isAcceptingMessage: true,
                    message: []
            })

            await newUser.save()
        }

        // user is saved. Now send the Verification Email
        const emailResponse = await sendVerificationEmail(
            email, 
            username, 
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false, 
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true, 
            message: "User Registered Successfully, Please Verify your Email"
        }, { status: 201 })

    } catch (error: any) {
        console.error("Error Registering User", error)
        return Response.json(
            {
                success: false, 
                message: "Error Registering The User"
            }, 
            {
                status: 500, 
            }
        )
    }
}
