import { FaTimes } from "react-icons/fa"
import {Button} from "@workspace/ui/components/button";
import {Input} from "@workspace/ui/components/input";
function DialogBox({
  loaderState,
  type,
  setLoaderState,
  path
}: {
  loaderState: boolean;
  type: string | null;
  setLoaderState: React.Dispatch<React.SetStateAction<boolean>>;
  path: string;
}) {
  if (!loaderState) return null;
  let description = "";
  switch (type) {
    case "Create Directory":
      description = "Please enter the name of the new directory:";
      break;
    case "Create File":
      description = "Please enter the name of the new file:";
      break;
    case "Rename":
      description = "Please enter the new name:";
      break;
    case "Delete":
      description = "Are you sure you want to delete this item? This action cannot be undone.";
      break;

    default:
      description = "This is a dialog box.";
  }
  return (
    <div className="absolute h-full w-full bg-opacity-50 backdrop-blur-lg flex flex-col justify-center items-center z-[9999]">
      <div className="h-1/3 w-1/3">
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold ">{type}</h1>
            <Button
              variant="ghost"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => {
                setLoaderState(false);
              }}
            >
              <FaTimes className="text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{path}</p>
            {type === "Create Directory" || type === "Create File" || type === "Rename" ? (
              <Input
                type="text"
                placeholder={type === "Create Directory" ? "New Directory Name" : type === "Create File" ? "New File Name" : "New Name"}
                className="mt-4"
              />
            ) : null}
          </div>
          {type === "Delete" ? (
            <div className="mt-4 font-sans font-bold w-full flex justify-end" >
              <Button
                variant="destructive"
                onClick={() => {
                  
                  setLoaderState(false);
                }}
              >
                Confirm Delete
              </Button>
            </div>
          ) : (
            <div className="mt-4 font-sans font-bold">
              <Button
                onClick={() => {
                  // Handle create or rename action
                  setLoaderState(false);
                }}
              >
                Confirm
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DialogBox;
