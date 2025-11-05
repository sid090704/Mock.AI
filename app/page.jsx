"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function Home() {
  const router = useRouter(); 
  return (
    <body className='bg-blue-50'>
      <div>
        <h2>Home Page</h2>
        <Button
        onClick={()=>router.replace('/dashboard')} >Dashboard</Button>
      </div>

    </body>
  )
}

export default Home
