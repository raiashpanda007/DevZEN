"use client";
import ChatNewDialogBox from "./components/ChatNewDialogBox";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { FiSearch } from "react-icons/fi";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useState } from "react";
import ChatListItem from "./components/ChatListItem";
import axios from "axios";
interface ChatSidebarProps {
  isSidebarOpen: boolean;
  selectedChatID: string;
}
interface ChatsData {
  id: string;
  name: string;
  mode: "Agent" | "Edit" | "Review";
}
function ChatsSidebar({ isSidebarOpen, selectedChatID }: ChatSidebarProps) {
  const [allChats, setAllChats] = useState<ChatsData[] | []>([]);
  const [selectedChat, setSelectedChat] = useState<ChatsData | null>(null);

  const getAllChats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/chat`
      );
      setAllChats(response.data.data as ChatsData[]);
    } catch (error) {
      console.error(error);
      return;
    }
  };
  useEffect(() => {
    getAllChats();
  }, []);
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
        {allChats.map((chat) =>
          chat.id === selectedChatID ? (
            <ChatListItem
              id={chat.id}
              isSelected={true}
              mode={chat.mode}
              name={chat.name}
              key={chat.id}
            />
          ) : (
            <ChatListItem
              id={chat.id}
              isSelected={false}
              mode={chat.mode}
              name={chat.name}
              key={chat.id}
            />
          )
        )}
      </ScrollArea>
    </div>
  );
}

export default ChatsSidebar;
