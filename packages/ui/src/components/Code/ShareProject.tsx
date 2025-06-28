"use client";
import { Button } from "@workspace/ui/components/button";
import { FiCopy } from "react-icons/fi";
import { useParams } from "next/navigation.js";
import axios from "axios";

interface ShareProjectProps {
  setSharedDialogBox: React.Dispatch<React.SetStateAction<boolean>>;
  setShareURL: React.Dispatch<React.SetStateAction<string | null>>;
}

const getShareURL = async (projectId: string|undefined,setShareURL:React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/project/generate_share_link/`,{
            projectId
        })
        if(response.status != 200) {
            setShareURL(null);
            return;
        }
        setShareURL(response.data.data)
    } catch (error) {
        console.error(error)
    }
};

function ShareProjectButton({
  setSharedDialogBox,
  setShareURL,
}: ShareProjectProps) {
    const {project} = useParams();
    if(!project) {
        return <div>
            Please provide project id
        </div>
    }
    const projectId = typeof project ==='string' ? project : project[0]
  return (
    <Button
      className="bg-blue-700 text-white hover:bg-blue-600 cursor-pointer"
      onClick={() => {
        getShareURL(projectId,setShareURL)
        setSharedDialogBox(true)
      }}
    >
      Share Project
      <FiCopy />
    </Button>
  );
}

export default ShareProjectButton;
