'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SignUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {
  const { toast } = useToast()
  // to redirect users after a successful form submission
  // dynamic routing: update the URL based on the username ex: /profile/{username}
  const router = useRouter()
  // zod implementaiton: 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema), // zodResolver needs a Schema
    defaultValues: {
      identifier: '', 
      password: ''
    }
  })

  // onSubmit method, passed with handleSubmit
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    // first activate the loading state
    const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier, 
        password: data.password
    })  

    if (result?.error) {
        toast({
            title: "Login Failed",
            description: "Incorrect Username or Password", 
            variant: "destructive"
        }) 
    } else {
        toast({
            title: "Error",
            description: result?.error, 
            variant: "destructive"
        })
    }

    if (result?.url) {
        router.replace('/dashboard')
    }
  } 
  return (
    // outside div
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        {/* Form start Here */}
        {/* 1. First destructure the form */}
        {/* 2. then hendle the onSubmit method use the handleSubmit method of the form and send the
        onSubmit */}
        {/* 3. In the FormField give the fields 
        control
        username, email, password => which values are passed in the 
        form */}
        {/* 4. render the FrmItem, we get a callback named "field" and it collects the form data and transfers it later on*/}
        <Form {...form}>
          {/* handleSubmit will call onSubmit(data) where data contains all the validated form input values 
          Prevents validation if submission fails*/}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
            name="identifier"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Email / Username</FormLabel>
                <FormControl>
                  <Input placeholder="email / username" {...field}  
                  />
                </FormControl>
                  {/* FormDescription can be added for more user friendliness */}
                <FormMessage />
              </FormItem>
            )}
            />

            <FormField
            name="password"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field}  
                  />
                </FormControl>
                  {/* FormDescription can be added for more user friendliness */}
                <FormMessage />
              </FormItem>
            )}
            />

            {/* Button for Form Submission */}
            <Button type="submit">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p >
              Don't have an Account? {' '} 
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign Up
              </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page             