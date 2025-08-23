"use client";
import React, { useState, useEffect, use } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { FiMenu } from "react-icons/fi";
import SearchInput from "./Resizable Components/Search";
import CreateProject from "./Resizable Components/CreateProject/CreateProject";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadinghandler } from "@/store/Loader";
import ProjectsItem from "./Resizable Components/ProjectItem/ProjectsItem";
import type { ProjectItem } from "@workspace/types";

function Resizable({ children }: { children: React.ReactNode }) {
  const [currentSize, setCurrentSize] = useState(20);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState([]);

  // Detect screen size
  const getUserProjects = async () =>{
    
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/project`,{withCredentials:true});
      if(res.data.statusCode === 401){
        try{
          dispatch(loadinghandler({ isLoading: true, message: "Redirecting to sign in..." }));
          router.push("/api/auth/signin");
        } catch (error) {
          dispatch(loadinghandler({ isLoading: false, message: "" }));
          console.error("Error  :: ", error);
          throw error
        }
      }
      if(res.data.statusCode === 200){
        setProjects(res.data.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        try{
          dispatch(loadinghandler({ isLoading: true, message: "Redirecting to sign up..." }));
          await router.push("/api/auth/signup");
        } catch(error) {
          dispatch(loadinghandler({ isLoading: false, message: "" }));
          console.error("Error :: ", error);
          throw error;
        }
      } else {
        console.error("Fetch error:", error);
      }
    }
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
      if (window.innerWidth < 768) setCurrentSize(50);
      else setCurrentSize(20);
    };
    
    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getUserProjects();
  }
  , []);

  return (
    <div className="font-sans relative top-24 w-full h-[calc(100%-96px)] flex z-1">
      <Button
        className="absolute rounded-lg z-10"
        variant={"ghost"}
        onClick={() => setCurrentSize(currentSize === 0 ? (isMobile ? 50 : 20) : 0)}
      >
        <FiMenu />
      </Button>

      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border"
        style={{ minWidth: isMobile ? "50%" : "20%" }}
      >
        {/* Sidebar */}
        <ResizablePanel
          className={`h-full ${currentSize === 0 ? "hidden" : ""}`}
          defaultSize={isMobile ? 50 : 20}
          minSize={isMobile ? 50 : 0}
          maxSize={isMobile ? 50 : 20}
          onResize={(size) => setCurrentSize(size)}
        >
          <div className="h-full relative top-10">
            <div className="h-1/6 border flex flex-col justify-center">
              <SearchInput />
              <CreateProject />
            </div>
            <div className="h-5/6 space-y-10">
              <ScrollArea className="h-[calc(100%-40px)] w-full ">
                {projects.map((project:ProjectItem) => (
                  <ProjectsItem key={project.id} name={project.name} template={project.template} id={project.id}/>
                ))}
              </ScrollArea>
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
