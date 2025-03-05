"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { FiMenu } from "react-icons/fi";
import SearchInput from "./Resizable Components/Search";
import CreateProject from "./Resizable Components/CreateProject/CreateProject";

function Resizable({ children }: { children: React.ReactNode }) {
  const [currentSize, setCurrentSize] = useState(20);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
      if (window.innerWidth < 768) setCurrentSize(30);
      else setCurrentSize(20);
    };
    
    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="font-sans relative top-24 w-full h-[calc(100%-96px)] flex">
      {/* Toggle Button */}
      <Button
        className="absolute rounded-lg z-10"
        variant={"ghost"}
        onClick={() => setCurrentSize(currentSize === 0 ? (isMobile ? 30 : 20) : 0)}
      >
        <FiMenu />
      </Button>

      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border"
        style={{ minWidth: isMobile ? "30%" : "20%" }}
      >
        {/* Sidebar */}
        <ResizablePanel
          className={`h-full ${currentSize === 0 ? "hidden" : ""}`}
          defaultSize={isMobile ? 30 : 20}
          minSize={isMobile ? 30 : 0}
          maxSize={isMobile ? 30 : 20}
          onResize={(size) => setCurrentSize(size)}
        >
          <div className="h-full relative top-10">
            <div className="h-1/6 border flex flex-col justify-center">
              <SearchInput />
              <CreateProject />
            </div>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="h-full" />

        {/* Main Content */}
        <ResizablePanel className="h-full flex items-center">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default Resizable;
