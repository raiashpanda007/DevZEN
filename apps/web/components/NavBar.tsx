"use client";

import ThemeStore from "./ThemeStore";
import LoginButton from "@workspace/ui/components/Login";
import { Button } from "@workspace/ui/components/button";
import { FiGithub } from "react-icons/fi";
import { useRouter } from "next/navigation";
const NavBar = () => {
    const router = useRouter();
  return (
    <nav className="z-10 h-24 w-full flex justify-between items-center  border fixed backdrop-blur-md">
      <div className="w-5/6 flex items-center">
        <img src="logo.png" alt="" className="sm:h-12 sm:w-12 h-8 w-8 rounded-full border" />
        <h1 className="text-2xl font-semibold ">DevZEN</h1>
      </div>
      <div className="flex sm:w-1/6 items-center justify-between ">
        <Button  variant={"ghost"} onClick={()=>router.push('https://github.com/raiashpanda007/DenZEN')}> <FiGithub/> </Button>
        <LoginButton/>
        <ThemeStore />
      </div>
    </nav>
  );
};
export default NavBar;
