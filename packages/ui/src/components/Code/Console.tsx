"use client"
import {Button} from "@workspace/ui/components/button";
import { Terminal } from "lucide-react";



interface ConsoleProps {
  setVisibleStatus:  React.Dispatch<React.SetStateAction<boolean>>
}
function Console({setVisibleStatus}:ConsoleProps) {

  return (
    <Button onClick={()=>setVisibleStatus((prev)=>!prev)}>
        Console <Terminal/>
    </Button>
  )
}

export default Console