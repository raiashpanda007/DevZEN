"use client"
import { Button } from "@workspace/ui/components/button";
import { FiTrash2 } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { useRouter } from "next/navigation";
interface ChatListItemProps {
  id: string;
  name: string;
  mode: string;
  isSelected: boolean;
}

function ChatListItem({
  id = "1",
  name = "First chat",
  mode = "Agent",
  isSelected = true,
}: ChatListItemProps) {
  const router = useRouter();
  const baseClasses =
    "flex border rounded-md my-2 px-2 py-2 cursor-pointer items-center transition-colors duration-200 ease-in-out";

  const hoverFocusClasses =
    "hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300";

  const selectedClasses =
    "bg-gray-700 border-indigo-300 shadow-sm transform scale-[1.002]";

  const combined = `${baseClasses} ${hoverFocusClasses} ${isSelected ? selectedClasses : ""}`;

  return (
    <div
      role="button"
      aria-selected={isSelected}
      tabIndex={0}
      className={combined}
      onClick={()=>router.push(`/home/${id}`)}

    >
      <div className="w-5/6">
        <h1 className="font-sans font-bold text-lg">{name}</h1>
        <h4 className="font-sans font-semibold text-sm opacity-50">{mode}</h4>
      </div>
      <div className="w-1/6 flex items-center justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"secondary"} className="w-1/2 h-2/3">
              <FiTrash2 className="text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ChatListItem;
