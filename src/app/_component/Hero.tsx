"use client"

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
     const { isSignedIn } = useUser();
  return (

<section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center h-[100vh]">
  <div className="p-8 md:p-12 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
        Make Your Todo List
      </h2>

      <p className="hidden text-gray-500 md:mt-4 md:block">
      Stay organized and boost productivity with our simple, intuitive to-do list. Add, edit, and manage tasks effortlessly—anytime, anywhere!
      </p>

      <div className="mt-4 md:mt-8">
        <Link
          href={`${isSignedIn? "/todo-list" : "/sign-in" }`}
         className='py-2 px-8 border shadow-sm rounded-full text-xl text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white duration-200 ease-in-out '
        >
          Get Started Today
        </Link>
      </div>
    </div>
  </div>

  <Image src='/hero.jpeg' alt={'hero image'} width={400} height={400}  className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"/>
</section>
  )
}

export default Hero