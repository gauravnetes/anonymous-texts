import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string, 
    username: string, 
    verifyCode: string, 
) : Promise <ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: email, 
            subject: "Mystery Messages | Verification Code", 
            react: VerificationEmail({username, otp: verifyCode})
        })
        return { success: true, message: "Verification email sent Successfully"}
    } catch (emailError) {
        console.log("Error Sending Verification Email", emailError)
        return { success: false, message: "Failed To Send Verification Email"}
    }
}