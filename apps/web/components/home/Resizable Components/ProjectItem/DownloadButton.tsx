import { Button } from "@workspace/ui/components/button";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { loadinghandler } from "@/store/Loader";
import { saveAs } from "file-saver";
import axios from "axios";

interface DownloadButtonProps {
  id: string;
  name: string;
}

export function DownloadProjectButton({ id, name }: DownloadButtonProps) {
  const dispatch = useDispatch();

  const downloadProject = async (id: string) => {
    try {
      dispatch(
        loadinghandler({
          isLoading: true,
          message: "Downloading you project ... ",
        })
      );
      const baseURl = process.env.NEXT_PUBLIC_BASE_HTTP_URL || "";
      const response = await axios.post(
        `${baseURl}/project/download`,
        { projectId: id },
        { withCredentials: true }
      );
      const url = response.data.data;
      if (!url) {
        dispatch(loadinghandler({ isLoading: false }));
        console.error("Url not recieved");
        return;
      }
      console.log("URL Recieved ::", url);

      const downloadFile = await axios.get(url, { responseType: "blob" });
      saveAs(downloadFile.data, `${name}.zip`);

      console.log("Downloaded file name :: ", name);
      dispatch(loadinghandler({ isLoading: false }));
    } catch (error) {
      console.error("Unable to donwload the project", error);
    }
  };

  return (
    <Button
      variant={"ghost"}
      className="shrink-0 z-40 cursor-pointer"
      size="icon"
      onClick={() => downloadProject(id)}
    >
      <HiOutlineArrowDownTray className="text-sm sm:text-base" />
    </Button>
  );
}
