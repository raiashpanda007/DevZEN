"use client"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import type { ProjectItem } from "@workspace/types"


function ProjectsItem({name="ashwin" , template="NEXT_JS_TURBO",id}:ProjectItem) {
  const templateImg = useSelector((state:RootState) => state.templates.filter((t) => t.id === template)[0]?.image)
  const router = useRouter()

  return (
    <div className="flex h-20 items-center border mx-1 rounded-md shadow-md my-2 cursor-pointer hover:dark:bg-gray-800 hover:bg-slate-300" onClick={() => router.push(`/projects/${id}`)}>
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
        <p className="text-sm">Template: {template}</p>
      </div>
    </div>
  )
}

export default ProjectsItem