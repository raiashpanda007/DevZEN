import { Button } from "@workspace/ui/components/button";
import { IoMdSend } from "react-icons/io";
import { MdAttachFile } from "react-icons/md";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
interface ChatInputProps {
  isDisabled: boolean;
  chatId: string;
}
function ChatInput({ isDisabled = true }: ChatInputProps) {
  return (
    <div className=" w-full h-1/6 flex items-center justify-evenly border bg-transparent">
      <Textarea
        className="w-4/5 h-1/2 "
        disabled={isDisabled}
        placeholder="Type your question or task... Ashna will Edit, Review, or Build 🚀"
      />
      <div className=" flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" disabled={isDisabled}>
                <MdAttachFile />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add project File</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={isDisabled}
                className="bg-[#f26307] hover:bg-[#f26310]">
                <IoMdSend />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ChatInput;
