"use client";
import React from "react";
import CodeEditor from "@/components/Code/CodeEditor";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter,useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadinghandler } from "@/store/Loader";
const verifyUser = async (projectId: string,shareStatusCode:string | null ,shareStatus:boolean|null) => {
  try {
    const body = shareStatus&&shareStatusCode ? {projectId,shareStatus,shareStatusCode}:{projectId}
    console.log(body);
    const verifyProject = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/project/verify_project/`,
      body
    );
    if (verifyProject.status === 401 || !verifyProject.data.data) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export default function Page() {
  const { project } = useParams();
  const shareStatus = (useSearchParams().get('share') === "true")
  const shareStatusCode = useSearchParams().get('shareid')
  const router = useRouter();
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(true);
  const verifyFunc = async (project: string) => {
    const result = await verifyUser(project,shareStatusCode,shareStatus,);
    setVerified(result);
  };

  
  useEffect(() => {
    if(!project || !project[0]) return
    verifyFunc(project[0]);
  }, [project]);
  return (
    <div className="relative h-[calc(100% - 96px)] top-24 w-full overflow-hidden">
      {verified ? (
        <CodeEditor />
      ) : (
        <div className="flex items-center justify-center h-full w-full  from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-md mx-auto mt-10  text-center p-8 bg-white dark:bg-transparent rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You are not authorized to work on this project. Please use a
                valid share link or contact the project owner for access.
              </p>
            </div>
            <div className="space-y-3">
             
              <button
                onClick={async () => {
                  try {
                    // show loader
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (dispatch as any)(loadinghandler({ isLoading: true, message: "Redirecting..." }));
                    router.push("/home/");
                  }
                  catch(error){
                    console.log("Error :: ", error)
                    dispatch(loadinghandler({isLoading:false,message:""}))
                  }
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
