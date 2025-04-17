"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import type { ProjectItem } from "@workspace/types";
import { DeleteProjectButton } from "./DeleteProjectButton";
import { DownloadProjectButton } from "./DownloadButton";

function ProjectsItem({
  name = "ashwin",
  template = "NEXT_JS_TURBO",
  id,
}: ProjectItem) {
  const templateImg = useSelector(
    (state: RootState) => state.templates.find((t) => t.id === template)?.image
  );

  const router = useRouter();

  return (
    <div className="flex h-20 items-center justify-between gap-2 w-full border mx-1 rounded-md shadow-md my-2 cursor-pointer hover:dark:bg-gray-800 hover:bg-slate-300 px-2 py-1">
      
      <div
        className="flex items-center gap-2 overflow-hidden min-w-0 basis-2/3 sm:basis-3/4"
        onClick={() => router.push(`/projects/${id}`)}
      >
        <img
          src={templateImg}
          alt="Template"
          className={
            templateImg === "next.svg"
              ? "w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border"
              : "w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
          }
        />

        <div className="flex flex-col min-w-0">
          <h1 className="text-sm sm:text-base font-semibold truncate max-w-full">
            {name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-full">
            Template: {template}
          </p>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 basis-1/3 sm:basis-1/4 justify-end">
        <DeleteProjectButton projectId={id} />
        <DownloadProjectButton />
      </div>
    </div>
  );
}

export default ProjectsItem;
