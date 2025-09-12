"use client";
import { FiMenu } from "react-icons/fi";
import ChatsSidebar from "@/components/Chats/ChatsSidebar";
import ChatSection from "@/components/Chats/ChatSection";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

function Page() {
  const [isSidebarOpen, setSidebar] = useState<boolean>(true);
  return (
    <div className="relative flex w-full h-full">
      <ChatSection isSidebarOpen={isSidebarOpen} />
      <ChatsSidebar isSidebarOpen={isSidebarOpen} selectedChatID="" />
      <Button
        className="absolute top-2 right-5"
        variant={"ghost"}
        onClick={() => setSidebar((prev) => !prev)}
      >
        <FiMenu />
      </Button>
    </div>
  );
}

export default Page;
