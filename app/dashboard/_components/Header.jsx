"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'


function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);


  return (
    <div className='flex p-4 items-center justify-between bg-black shadow-sm'>
      <Image src={"/images/logo.png"} width={150} height={100} alt="Logo" />
      <ul className='hidden md:flex gap-6'>
        <li className={`text-white text-bold text-lg hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == '/dashboard/how-it-works' && ' font-bold'}
            `}>Home</li>
        <li className={`text-white text-bold text-lg hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == '/dashboard' && 'font-bold'}
            `}>Dashboard</li>
        <li className={`text-white text-bold text-lg hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == '/dashboard/questions' && ' font-bold'}
            `}>Questions</li>
        <li className={`text-white text-bold text-lg hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == '/dashboard/upgrade' && ' font-bold'}
            `}>Upgrade</li>

      </ul>
      <UserButton />
    </div>
  )
}

export default Header
