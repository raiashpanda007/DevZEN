"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import type { ProjectItem } from "@workspace/types";
import { DeleteProjectButton } from "./DeleteProjectButton";
import { DownloadProjectButton } from "./DownloadButton";
import { loadinghandler } from "@/store/Loader";
import axios from "axios";

function ProjectsItem({
  name = "ashwin",
  template = "NEXT_JS_TURBO",
  id,
}: ProjectItem) {
  const templateImg = useSelector(
    (state: RootState) => state.templates.find((t) => t.id === template)?.image
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const onClick = async () => {
    try {
      dispatch(
        loadinghandler({
          isLoading: true,
          message: "Spining up you k8s pod and setting up your domain",
        })
      );
      const startContainer = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_SERVER}/start`,
        { projectId: id }
      );

      console.log(startContainer.data);

      router.push(`/projects/${id}`);
    } catch (error) {
      console.error("Error in starting pod");
      dispatch(loadinghandler({ isLoading: false, message: "" }));
      throw error;
    }
  };

  return (
    <div className="flex h-20 items-center justify-between gap-2 w-full border mx-1 rounded-md shadow-md my-2 cursor-pointer hover:dark:bg-gray-800 hover:bg-slate-300 px-2 py-1">
      <div
        className="flex items-center gap-2 overflow-hidden min-w-0 basis-2/3 sm:basis-3/4"
        onClick={onClick}
      >
        <img
          src={templateImg && (templateImg.startsWith('/') ? templateImg : `/${templateImg}`)}
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
        <DownloadProjectButton id={id} name={name}/>
      </div>
    </div>
  );
}

export default ProjectsItem;
