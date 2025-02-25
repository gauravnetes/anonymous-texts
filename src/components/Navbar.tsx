'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react' // can't take direct data from 
// useSession as it's a method (hook)
import { User } from "next-auth"
import { Button } from '@react-email/components'
const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User // we've to fetch user from session as the session contains the user details. so have to use session?.user not data?.user 

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb=0' href="#">Mystery Message</a>
            {
                session ? (
                    <>
                        <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                        <Button className='w-full md:w-auto' onClick={() => signOut()}>Log out</Button>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>Log in</Button>
                    </Link>
                )
                
            }
        </div>
    </nav>
  )
}

export default Navbar
