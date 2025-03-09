"use client"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"


interface UserProjectsProps {
    name:string
    templateId:string   
}
function ProjectsItem({name="ashwin" , templateId="NEXT_JS_TURBO"}:UserProjectsProps) {
  const templateImg = useSelector((state:RootState) => state.templates.filter((template) => template.id === templateId)[0]?.image)

  return (
    <div className="flex h-20 items-center border mx-1 rounded-md shadow-md my-2">
      <img
  src={templateImg}
  alt="Template"
  className={
    templateImg === "next.svg"
      ? "w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full border"
      : "w-10 sm:w-12 h-10 sm:h-12 rounded-full border"
  }
/>

      <div className="p-2">
        <h1 className="text-lg font-semibold">{name}</h1>
        <p className="text-sm">Template: {templateId}</p>
      </div>
    </div>
  )
}

export default ProjectsItem