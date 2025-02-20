import {z} from 'zod'; 
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User.model';
import { usernameValidation } from '@/schemas/signUpSchema'; // import the user name validation schema

const UsernameQuerySchema = z.object({
    username: usernameValidation // usename should fulfill the parameter of usernameValidation Schema
})

// let's build a functionality where we check the username if it fulfills the parameter of usernameValidation Schema 
// while user is typing the username in the input box. and gives the user messages like 
// "username must be of atleast 2 characters"

export async function GET(request: Request) {
    // check for what request the user is sending
    // used in older version of nextjs
    // if (request.method !== "GET") {
    //     return Response.json({
    //         success: false, 
    //         message: "Only GET Method is allowed"
    //     }, {status: 405})
    // }
    await dbConnect()
    // url design: localhost://3000/api/check-username-unique?username=gourav   // there could be more query parameters
    try { 
        // user will send username through query
        const { searchParams } = new URL(request.url) // handling the query and fetching the url through request.url
        // now fetch your needed query parameter frorm the searchParams from the number of queries
        const queryParam = {
            username: searchParams.get('username')
        }
        // fetched the username from the query parameter
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam) 
        console.log(result) // todo: remove

        // 1st case: if the result is not success, 
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [] // fetch all the errors of the username
            return Response.json({
                success: false, 
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invlid Query Parameter"
            }, {status: 400})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if (existingVerifiedUser) {
            return Response.json({
                success: false, 
                message: "username is already taken"
            }, {status: 400}) 
        }
        return Response.json({
            success: true, 
            message: "username is unique"
        }, {status: 200})

    } catch (error) {
        console.error("Error checking Username", error)
        return Response.json({
            success: false, 
            message: "Error checking username"
        }, {status: 500})
    }
}