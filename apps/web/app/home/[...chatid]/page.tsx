"use client";
import { FiMenu } from "react-icons/fi";
import ChatsSidebar from "@/components/Chats/ChatsSidebar";
import ChatSection from "@/components/Chats/ChatSection";
import { useParams } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";

function Page() {
  const { chatid } = useParams();
  const [isSidebarOpen, setSidebar] = useState<boolean>(true);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const socket = useSocket();
  useEffect(() => {
    if (!chatid || !chatid[0]) {
      setSelectedChatId("");
      return;
    }
    setSelectedChatId(chatid[0]);
  });
  return (
    <div className="relative flex w-full h-full">
      <ChatSection isSidebarOpen={isSidebarOpen} />
      <ChatsSidebar isSidebarOpen={isSidebarOpen} selectedChatID={selectedChatId}/>
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
