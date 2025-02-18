import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/Auth/auth_Config";
import { Button } from "@workspace/ui/components/button";
import HomeCards from "@/components/Landing/Cards";
import SendingHomeButton from "@/components/Landing/SendingHomeButton";

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
      <SendingHomeButton />
      <HomeCards />
      
    </div>
  );
}
