import React from "react";
import ChatNewDialogBox from "./components/ChatNewDialogBox";
interface ChatSidebarProps {
  isSidebarOpen: boolean;
}
function ChatsSidebar({ isSidebarOpen }: ChatSidebarProps) {
  return (
    <div
      className={
        isSidebarOpen
          ? `w-1/4 h-full border flex flex-col rounded-s-lg`
          : `hidden h-full border border-red-500`
      }
    >
      <div className="relative top-2">
        <ChatNewDialogBox/>
      </div>
    </div>
  );
}

export default ChatsSidebar;
