// nextAuthh dependant on options

import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials", 
            name: "Credentials", 
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any) : Promise<any>{
                await dbConnect() 
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier.email}, 
                            {username: credentials.identifier.username}
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with This Email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please Verify Your Account First")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password) // we don't need identifier here
                    if (isPasswordCorrect) {
                        return user; 
                    } else {
                        throw new Error("Incorrect Password")
                    }
                    

                } catch (error : any) {
                    throw new Error(error)
                }
              }
        })
    ],
    callbacks: {
        // we're storing the informations of user in token to reduce the databasea query
        // the db is queried once then it stores the data in the token. And from token it stores to session for the frontend.
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified 
                token.isAcceptingMessages = user.isAcceptingMessages; 
                token.username = user.username;   
            }
            return token // now the above fields are included in the token and returned
        }, 
        async session({session, token}) {
            if (token) {
                session.user._id = token._id;   
                session.user.isVerified = token.isVerified; 
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username              
            }
            return session
        }
    },

    pages: {
        signIn: 'sign-in' // nextauth will handle the designing of the page itself
    }, 
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET, 

}