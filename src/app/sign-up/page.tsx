'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SignUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  // loader state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 300)
  const { toast } = useToast()
  // to redirect users after a successful form submission
  // dynamic routing: update the URL based on the username ex: /profile/{username}
  const router = useRouter()
  // zod implementaiton: 
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema), // zodResolver needs a Schema
    defaultValues: {
      username: '', 
      email: '', 
      password: ''
    }
  })

  // use the check-username route (GET request)
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) { // first time debouoncedUsername will be false 
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          // log this response
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse> // send the error message of ApiResponse Type. So you get the error message in ApiResponse format.
          setUsernameMessage(
            axiosError.response?.data?.message ?? "Error Checking Username"
          )
        } finally {
          // if we don't write this part in finally we've to write this code in try and catch both.
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  // onSubmit method, passed with handleSubmit
  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    // first activate the loading state
    setIsSubmitting(true) // set a loader in frontend while in loading state
    try {
      // hit the sign-up route with the data
      const response = await axios.post<ApiResponse>('/api/sign-up', data) // .post is used for creating and sending new data to the server
      // if we're getting the response send a toast message to the user
      if (response.status === 200 || response.status === 201) {
        toast({
          title: 'Success', 
          description: response.data.message || "User Registered Successfully" // optional success message
        })
        router.replace(`/verify/${username}`) // router.replace prevents the user to from navigating back to sign-up page which is useful here
        // Now in this page (route) we'll request the verification code to the user which have been sent to the user 
        // after successful sign-up

      } else {
        toast({
          title: 'Error', 
          description: 'Something Went Wrong. Please Try Again'
        })
      }
    } catch (error) {
      console.error("Error in onSubmit: ", error)
      const axiosError = error as AxiosError<ApiResponse> 
      let errorMsg = axiosError.response?.data.message
      toast({
        title: 'Sign Up Failed', 
        description: errorMsg, 
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false) // stop the loading
    }
  } 
  return (
    // outside div
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign Up to start your anonymous adventure</p>
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
            name="username"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} 
                  onChange={(e) => {
                    field.onChange(e)
                    setUsername(e.target.value)
                    // handling the setUsername seperately cause 
                    // we are debouncing and making a api request between some times so it should be handled seperately
                  }}
                  />
                </FormControl>
                  {/* FormDescription can be added for more user friendliness */}
                <FormMessage />
              </FormItem>
            )}
            />

            <FormField
            name="email"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field}  
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
            <Button type="submit" disabled={isSubmitting}>
              {/* Starting the Javascript */}
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                  </>
                ) : ('Sign Up')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p >
              Already a member? {' '} 
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign In
              </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page             