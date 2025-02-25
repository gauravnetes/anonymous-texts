'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z  from 'zod'

function VerifyAccount() {
    const router = useRouter() // we can redirect the user using this
    const params = useParams<{username: string}>() // fetching the username from the params
    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema), // zodResolver needs a Schema
      })

    
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username, 
                code: data.code
            })

            toast({
                title: "Success", 
                description: response.data.message
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error("Verification with code failed", error)
            const axiosError = error as AxiosError<ApiResponse>; 
            let errorMessage = axiosError.response?.data.message

            toast({
                title: "Invalid Verification code", 
                description: errorMessage, 
                variant: "destructive"
            })
        }
    }
  return ( 
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    name="code"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input placeholder="code" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
        </div>
    </div>
  )
}

export default VerifyAccount
