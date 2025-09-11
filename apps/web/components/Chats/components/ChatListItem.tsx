import { Button } from "@workspace/ui/components/button";
import { FiMenu } from "react-icons/fi";
interface ChatListItemProps {
  id: string;
  name: string;
  mode: string;
}

function ChatListItem({
  id = "1",
  name = "First chat",
  mode = "Agent",
}: ChatListItemProps) {
  return (
    <div className="flex border rounded-md my-2 px-2 py-5 cursor-pointer">
      <div className="w-5/6">
        <h1 className="font-sans font-bold text-lg">{name}</h1>
        <h4 className="font-sans font-semibold text-sm opacity-50">{mode}</h4>
      </div>
      <div className="w-1/6 flex items-center justify-center">
        <Button variant={"secondary"} className="w-1/2 h-1/2">
            <FiMenu/>
        </Button>
      </div>
    </div>
  );
}

export default ChatListItem;
