"use client";
import { FaTimes } from "react-icons/fa";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import type { File } from "@workspace/types";
import { Type } from "@workspace/types";
import { Messages } from "@workspace/types";
import { useState } from "react";

function DialogBox({
  loaderState,
  type,
  setLoaderState,
  path,
  socket,
}: {
  loaderState: boolean;
  type: string | null;
  setLoaderState: React.Dispatch<React.SetStateAction<boolean>>;
  path: File | undefined;
  socket: WebSocket | null;
}) {
  if (!loaderState) return null;
  const [name, setName] = useState<string>("");

  const {
    MESSAGE_CREATE_FILE,
    MESSAGE_DELETE_FILE,
    MESSAGE_CREATE_FOLDER,
    MESSAGE_DELETE_FOLDER,
    MESSAGE_RENAME_FOLDER,
    MESSAGE_RENAME_FILE,
  } = Messages;

  const submitAction = (actionType: string, actionPath: File | undefined) => {
    console.log("Submitting action:", actionType, "for path:", actionPath);

    if (!actionType || !actionPath) {
      console.error("Missing action type or path—cannot proceed.");
      setLoaderState(false);
      return;
    }

    switch (actionType) {
      case "Create File": {
        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log("Creating file:", name, "in", actionPath.id);
          socket.send(
            JSON.stringify({
              type: MESSAGE_CREATE_FILE,
              payload: { name, path: actionPath.id },
            })
          );
        } else {
          console.error("Socket is not connected or path is undefined");
        }
        break;
      }

      case "Create Directory": {
        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log("Creating folder:", name, "in", actionPath.id);
          socket.send(
            JSON.stringify({
              type: MESSAGE_CREATE_FOLDER,
              payload: { name, path: actionPath.id },
            })
          );
        } else {
          console.error("Socket is not connected or path is undefined");
        }
        break;
      }

      case "Delete": {
        if (socket && socket.readyState === WebSocket.OPEN) {
          if (actionPath.type === Type.DIRECTORY) {
            console.log("Deleting folder:", actionPath.id);
            socket.send(
              JSON.stringify({
                type: MESSAGE_DELETE_FOLDER,
                payload: { path: actionPath.id },
              })
            );
          } else {
            console.log("Deleting file:", actionPath.id);
            socket.send(
              JSON.stringify({
                type: MESSAGE_DELETE_FILE,
                payload: { path: actionPath.id },
              })
            );
          }
        } else {
          console.error("Socket is not connected or path is undefined");
        }
        break;
      }

      case "Rename": {
        if (socket && socket.readyState === WebSocket.OPEN) {
          if (actionPath.type === Type.DIRECTORY) {
            console.log("Renaming folder from", actionPath.name, "to", name);
            socket.send(
              JSON.stringify({
                type: MESSAGE_RENAME_FOLDER,
                payload: { path: actionPath.path, name: name },
              })
            );
          } else {
            console.log("Renaming file from", actionPath.name, "to", name);
            socket.send(
              JSON.stringify({
                type: MESSAGE_RENAME_FILE,
                payload: { path: actionPath.path,  name },
              })
            );
          }
        } else {
          console.error("Socket is not connected or path is undefined");
        }
        break;
      }

      default: {
        console.error("Unknown action type:", actionType);
      }
    }

    setLoaderState(false);
  };

  return (
    <div className="absolute h-full w-full bg-opacity-50 backdrop-blur-lg flex flex-col justify-center items-center z-[9999]">
      <div className="h-1/3 w-1/3">
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{type}</h1>
            <Button
              variant="ghost"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setLoaderState(false)}
            >
              <FaTimes className="text-gray-600 dark:text-gray-400" />
            </Button>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{path?.path}</p>
            {(type === "Create Directory" ||
              type === "Create File" ||
              type === "Rename") && (
              <Input
                type="text"
                placeholder={
                  type === "Create Directory"
                    ? "New Directory Name"
                    : type === "Create File"
                    ? "New File Name"
                    : "New Name"
                }
                className="mt-4"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
              />
            )}
          </div>

          {type === "Delete" ? (
            <div className="mt-4 font-sans font-bold w-full flex justify-end">
              <Button
                variant="destructive"
                onClick={() => submitAction("Delete", path)}
              >
                Confirm Delete
              </Button>
            </div>
          ) : (
            <div className="mt-4 font-sans font-bold">
              <Button onClick={() => submitAction(type || "", path)}>
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
