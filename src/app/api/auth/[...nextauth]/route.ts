import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions) // NextAuth is handler that takes options
export { handler as GET, handler as POST }; 