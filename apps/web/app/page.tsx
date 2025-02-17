import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/Auth/auth_Config";
import { Button } from "@workspace/ui/components/button";




export default function Page() {
  const session = getServerSession(NEXT_AUTH_CONFIG);
  return (
    <div className="font-sans relative top-20 w-full h-[calc(100% - 80px) p-8">
      <div className=" flex flex-col items-center h-44 ">
        <div className="flex h-28 items-center">
          <img src="logo.png" alt="" className="h-full" />
          <h1 className="text-5xl font-bold">DevZEN</h1>
        </div>
        <p>
          <strong>Code</strong>, <strong>Collaborate</strong>, and{" "}
          <strong>Inovate</strong> — Welcome to{" "}
          <strong className="text-red-600">DevZEN</strong>, where development
          meets simplicity.
        </p>
      </div>
      <div className="h-32 w-full flex justify-center items center">
        <Button variant={'default'} className="font-semibold"> START NOW </Button>
      </div>
      
      <div className="flex sm:h-48 h-20 w-full space-x-9  ">
        <img
          src="CodeEditor.png"
          alt=""
          className="rounded-lg shadow-2xl animate-slideInFromBelow opacity-0 h-full"
        />
        <div className="sm:w-1/2 w-full animate-slideIn">
          <h1 className="text-3xl  font-bold">ZenCode Editor</h1>
          <p className="">
            <strong className="text-red-600 font-bold">ZenCode Editor</strong>{" "}
            is a powerful yet minimalistic online code editor designed to
            provide a smooth, focused, and distraction-free coding experience.
            Whether you're writing code, collaborating with a team, or
            experimenting with new ideas, ZenCode Editor ensures a seamless and
            efficient workflow. 
          </p>
        </div>
      </div>
      <div className="h-60 sm:h-20 w-full"></div>
      <div className="flex sm:justify-end  sm:h-48 h-20 w-full space-x-9  ">
        
        <div className="w-1/2 animate-slideIn">
          <h1 className="text-3xl  font-bold">Instant Coding, Zero Setup</h1>
          <p>
          Start coding in your favorite languages without the hassle of installations or configurations. <strong className="text-red-600 font-bold">DevZEN</strong>{" "} provides a seamless, browser-based experience so you can focus on building, not setting up.
          </p>
        </div>
        <img
          src="Code-Instant.png"
          alt=""
          className="rounded-lg shadow-2xl animate-slideInFromBelow opacity-0 h-full"
        />
      </div>
      
      
    </div>
  );
}
