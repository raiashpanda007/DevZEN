import React from "react";
import ChatInput from "./components/ChatInput";
interface ChatSectionProps {
  isSidebarOpen: boolean;
}
function ChatSection({ isSidebarOpen }: ChatSectionProps) {
  return (
    <div
      className={
        isSidebarOpen
          ? `w-3/4 h-full border  flex flex-col`
          : `w-full h-full border  flex flex-col`
      }
    >
      <div className="w-full h-5/6"></div>

      <ChatInput />
    </div>
  );
}

export default ChatSection;
