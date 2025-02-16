"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {FiSun , FiMoon} from "react-icons/fi"
const ThemeStore = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const changeTheme = () =>{
    if(theme === "dark"){
      setTheme("light")
    }else{
      setTheme("dark")
    }
  }
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button variant={"ghost"} onClick={changeTheme}>
        {theme === "dark" ? < FiSun /> : <FiMoon />}
      </Button>
    </div>
  );
}

export default ThemeStore;
