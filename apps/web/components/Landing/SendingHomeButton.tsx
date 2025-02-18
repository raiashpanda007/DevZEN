"use client"
import React from 'react'
import { Button } from '@workspace/ui/components/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
function SendingHomeButton() {
    const {status} = useSession();
    const router = useRouter();
  return (
    <div className="h-32 w-full flex justify-center items center">
        <Button variant={"default"} className="font-semibold" onClick={() => router.push( status === "authenticated" ? "/home" : "/api/auth/signin")}>
          {" "}
          {status === "authenticated" ? "START NOW":"LOGIN"}{" "}
        </Button>
      </div>
  )
}

export default SendingHomeButton