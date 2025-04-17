

import { Button } from "@workspace/ui/components/button";
import { HiOutlineArrowDownTray } from "react-icons/hi2";




export function DownloadProjectButton() {
  

  return (
    <Button variant={"ghost"}  className="shrink-0 z-40 cursor-pointer" size="icon">
        <HiOutlineArrowDownTray className="text-sm sm:text-base"/>
    </Button>
  );
}
