"use client";
import ChatNewDialogBox from "./components/ChatNewDialogBox";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { FiSearch } from "react-icons/fi";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import ChatListItem from "./components/ChatListItem";
interface ChatSidebarProps {
  isSidebarOpen: boolean;
  selectedChatID:string;
}
interface ChatsData {
  id: string;
  name: string;
  mode: string;
}
function ChatsSidebar({ isSidebarOpen,selectedChatID }: ChatSidebarProps) {
  const [allChats, setAllChats] = useState<ChatsData[] | []>([]);
  const [selectedChat, setSelectedChat] = useState<ChatsData | null>(null);
  return (
    <div
      className={
        isSidebarOpen
          ? `w-1/4 h-full border flex flex-col rounded-s-lg `
          : `hidden h-full border border-red-500`
      }
    >
      <div className="h-1/6">
        <div className="relative top-1 mb-4">
          <ChatNewDialogBox />
        </div>
        <div className="grid grid-cols-[4fr_1fr] gap-2 items-center">
          <Input placeholder="Search Chats ... " className="w-full" />
          <Button className="opacity-70">
            <FiSearch className="text-sm" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-5/6 border-red-500">
      
        
      </ScrollArea>
    </div>
  );
}

export default ChatsSidebar;
