"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    const {isSignedIn} =useUser();
  return (
    <header className='flex justify-between items-center shadow-lg sm:px-16 py-5 px-2 '>
        <Link href="/"> <h2 className='font-semibold text-blue-400 sm:text-4xl text-3xl'>Logo</h2></Link>
        {
            isSignedIn ? (
                <UserButton/>
            ):(
                <Link href="/sign-in">
                <button className='py-2 px-8 border shadow-sm rounded-full text-xl text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white duration-200 ease-in-out '>
                    Login
                </button>
                </Link>
            )
        }
    </header>
  )
}

export default Header