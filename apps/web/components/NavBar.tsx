"use client";

import ThemeStore from "./ThemeStore";
import LoginButton from "@workspace/ui/components/Login";
import { Button } from "@workspace/ui/components/button";
import { FiGithub } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadinghandler } from "@/store/Loader";

const NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <nav className="z-10 h-24 w-full flex justify-between items-center  border fixed backdrop-blur-md">
      <div className="w-5/6 flex items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={async () => {
            try {
              dispatch(
                loadinghandler({ isLoading: true, message: "Loading..." })
              );
              router.push("/home");
            } catch (error) {
              console.error("Error :: ", error);
              dispatch(loadinghandler({ isLoading: false, message: "" }));
              throw error;
            }
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="sm:h-12 sm:w-12 h-8 w-8 rounded-full border"
          />
          <h1 className="text-2xl font-semibold ">DevZEN</h1>
        </div>
      </div>
      <div className="flex sm:w-1/6 items-center justify-between ">
        <Button
          variant={"ghost"}
          onClick={() =>
            router.push("https://github.com/raiashpanda007/DenZEN")
          }
        >
          {" "}
          <FiGithub />{" "}
        </Button>
        <LoginButton />
        <ThemeStore />
      </div>
    </nav>
  );
};
export default NavBar;
