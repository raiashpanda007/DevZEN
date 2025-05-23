import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { FiMoreHorizontal } from "react-icons/fi";
import type { Directory,File } from "@workspace/ui/components/Code/FileStructure";
function File_DirMoreOptions({directory}: {directory: Directory | File}) {
  const handleClick = () => {
    console.log("Clicked on: ", directory.path);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-5 shrink-0">
          <FiMoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleClick}>
            New Folder
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            New File
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Rename
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500">
            Delete
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default File_DirMoreOptions;
