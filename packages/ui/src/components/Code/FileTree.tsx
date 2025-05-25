import React, { useState } from "react";
import {
  Directory,
  File,
  sortDir,
  sortFile,
} from "@workspace/ui/components/Code/FileStructure";
import { getIcon } from "@workspace/ui/components/Code/Icons";
import File_DirMoreOptions from "@workspace/ui/components/Code/DropDownButton";

interface FileTreeProps {
  rootDir: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
  socket:WebSocket | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeDialog: React.Dispatch<React.SetStateAction<string >>;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}

export const FileTree = (props: FileTreeProps) => {
  return (
    <div className="max-h-full overflow-y-auto text-black dark:text-white">
      <SubTree directory={props.rootDir} {...props} />
    </div>
  );
};

interface SubTreeProps {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
  socket: WebSocket | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeDialog: React.Dispatch<React.SetStateAction<string >>;
  setPath: React.Dispatch<React.SetStateAction<string>>;

}

const SubTree = (props: SubTreeProps) => {
  return (
    <div>
      {props.directory.dirs.sort(sortDir).map((dir) => (
        <React.Fragment key={dir.id}>
          <DirDiv
            directory={dir}
            selectedFile={props.selectedFile}
            onSelect={props.onSelect}
            socket={props.socket}
            dialogOpen={props.dialogOpen}
            setDialogOpen={props.setDialogOpen}
            setTypeDialog={props.setTypeDialog}
            setPath={props.setPath}
          />
        </React.Fragment>
      ))}
      {props.directory.files.sort(sortFile).map((file) => (
        <React.Fragment key={file.id}>
          <FileDiv
            file={file}
            selectedFile={props.selectedFile}
            onClick={() => props.onSelect(file)}
            socket ={props.socket}
            dialogOpen={props.dialogOpen}
            setDialogOpen={props.setDialogOpen}
            setTypeDialog={props.setTypeDialog}
            setPath={props.setPath}

          />
        </React.Fragment>
      ))}
    </div>
  );
};

const FileDiv = ({
  file,
  icon,
  selectedFile,
  onClick,
  socket,
  dialogOpen,
  setDialogOpen,
  setTypeDialog,
  setPath
}: {
  file: File | Directory;
  icon?: string;
  selectedFile: File | undefined;
  onClick: () => void;
  socket: WebSocket | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeDialog: React.Dispatch<React.SetStateAction<string >>;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const isSelected = selectedFile?.id === file.id;
  const depth = file.depth;
  const paddingLeft = Math.min(depth * 16, 64);

  return (
    <div
      style={{
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `12px`,
      }}
      className={`
        group
        relative
        flex
        w-full
        items-center
        cursor-pointer
        p-1
        rounded-md
        ${isSelected ? "bg-gray-300 dark:bg-gray-800" : "bg-transparent"}
        hover:bg-gray-200 dark:hover:bg-gray-700
        text-black dark:text-white
      `}
    >
      <div className="flex items-center min-w-0 flex-1 overflow-hidden" onClick={onClick}>
        <FileIcon
          name={icon}
          extension={file.name.split(".").pop() || ""}
        />
        <span className="ml-1 truncate">{file.name}</span>
      </div>

      <div
        className="
          absolute
          right-[12px]
          top-1/2
          -translate-y-1/2
          invisible
          group-hover:visible
        "
      >
        <File_DirMoreOptions directory={selectedFile} socket={socket} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} setDialogType={setTypeDialog} setPath={setPath}/>
      </div>
    </div>
  );
};

const DirDiv = ({
  directory,
  selectedFile,
  onSelect,
  socket,
  dialogOpen,
  setDialogOpen,
  setTypeDialog,
  setPath
}: {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
  socket: WebSocket | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeDialog: React.Dispatch<React.SetStateAction<string >>;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}) => {
  let defaultOpen = false;
  if (selectedFile) defaultOpen = isChildSelected(directory, selectedFile);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <FileDiv
        file={directory}
        icon={open ? "openDirectory" : "closedDirectory"}
        selectedFile={selectedFile}
        onClick={() => {
          console.log("Clicked on: ", directory.name);
          if (!open) {
            onSelect(directory);
          }
          setOpen(!open);
        }}
        socket = {socket}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setTypeDialog={setTypeDialog}
        setPath={setPath}
      />
      {open ? (
        <SubTree
          directory={directory}
          selectedFile={selectedFile}
          onSelect={onSelect}
          socket = {socket}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          setTypeDialog={setTypeDialog}
          setPath={setPath}
        />
      ) : null}
    </>
  );
};

const isChildSelected = (directory: Directory, selectedFile: File) => {
  let res: boolean = false;

  function isChild(dir: Directory, file: File) {
    if (selectedFile.parentId === dir.id) {
      res = true;
      return;
    }
    if (selectedFile.parentId === "0") {
      res = false;
      return;
    }
    dir.dirs.forEach((item) => {
      isChild(item, file);
    });
  }

  isChild(directory, selectedFile);
  return res;
};

const FileIcon = ({
  extension,
  name,
}: {
  name?: string;
  extension?: string;
}) => {
  let icon = getIcon(extension || "", name || "");
  return (
    <span className="flex w-8 h-8 justify-center items-center">{icon}</span>
  );
};
