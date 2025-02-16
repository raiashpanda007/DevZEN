"use client";

import ThemeStore from "./ThemeStore";
import LoginButton from "@workspace/ui/components/Login";
const NavBar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-4 border">
      <div className="flex items-center">
        <img src="logo.png" alt="" className="h-12 w-12 rounded-full border" />
        <h1 className="text-2xl font-semibold ml-4">DenZEN</h1>
      </div>
      <div className="flex items-center">
        <LoginButton/>
        <ThemeStore />
      </div>
    </nav>
  );
};
export default NavBar;
