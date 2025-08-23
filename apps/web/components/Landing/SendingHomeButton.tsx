"use client"
import React from 'react'
import { Button } from '@workspace/ui/components/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { loadinghandler } from '@/store/Loader'

function SendingHomeButton() {
    const {status} = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
  return (
    <div className="h-32 w-full flex justify-center items center">
        <Button
          variant={"default"}
          className="font-semibold"
          onClick={async () => {
            try {
              dispatch(loadinghandler({ isLoading: true, message: "Redirecting..." }));
              router.push(status === "authenticated" ? "/home" : "/api/auth/signin");
              dispatch(loadinghandler({ isLoading: false, message: "" }));
            } catch(error) {
              dispatch(loadinghandler({ isLoading: false, message: "" }));
              throw error;
            }
          }}
        >
          {" "}
          {status === "authenticated" ? "START NOW":"LOGIN"}{" "}
        </Button>
      </div>
  )
}

export default SendingHomeButton