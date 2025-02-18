"use client"
import React from 'react'
import { Button } from "@workspace/ui/components/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

function Resizable({children}:{children:React.ReactNode}) {

  const [currentSize, setCurrentSize] = useState(20);
  return (
    <div className="font-sans relative top-24 w-full h-[calc(100%-96px)] flex">
      <Button className="absolute rounded-lg" variant={"ghost"} onClick={()=>{
        setCurrentSize(currentSize === 0 ? 20 : 0 );
      }}>
        <FiMenu />
      </Button>
      <ResizablePanelGroup direction="horizontal" className="h-full border" style={{ minWidth: "20%" }}>
        <ResizablePanel
          className={`h-full ${currentSize === 0 ? "hidden" : ""}`}
          defaultSize={20} 
          minSize={0} 
          maxSize={20} 
          onResize={(size) => setCurrentSize(size)}
          
          
        >
          <div className="h-full relative top-10">hi there</div>
        </ResizablePanel>
        <ResizableHandle className="h-full" withHandle />
        <ResizablePanel className="h-full flex items-center">
            {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Resizable