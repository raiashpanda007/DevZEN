import React from 'react'
import Resizable from '@/components/home/Resizable'
import verifyUser from '@/lib/Auth/verifyUser'
import { redirect } from 'next/navigation'
async function layout({children}:{children:React.ReactNode}) {
  const user = await verifyUser();
  if(!user){
    redirect(`${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/auth/signin`);
  }
  return (
    <>
    {children}
    </>
  )
}

export default layout