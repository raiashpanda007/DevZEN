"use client";

import { Button } from "@workspace/ui/components/button";
import { MdSmartToy } from "react-icons/md";

const ChatWithAshna_Assistant = () => {
  return (
    <Button
      title="Chat with Ashna"
      aria-label="Chat with Ashna"
      className={
        "inline-flex items-center gap-3 px-3 py-1.5  bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transform transition-transform duration-150 ease-out"
      }
    >
      <span className="flex items-center gap-2">
        <span className="text-sm font-medium">Chat with</span>

        <span className="inline-flex items-center gap-2 bg-white bg-opacity-10 px-2 py-0.5 rounded-full">
          <span className="font-bold text-[#F26307]">Ashna</span>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white bg-opacity-20 rounded-full">
            <MdSmartToy className="text-[#F26307]" />
          </span>
        </span>
      </span>
    </Button>
  );
};

export default ChatWithAshna_Assistant;
