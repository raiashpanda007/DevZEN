import React, { useState } from 'react';
import { Directory, File, sortDir, sortFile } from "@workspace/ui/components/Code/FileStructure";
import { getIcon } from "@workspace/ui/components/Code/Icons";

interface FileTreeProps {
  rootDir: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
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
}

const SubTree = (props: SubTreeProps) => {
  return (
    <div>
      {props.directory.dirs.sort(sortDir).map((dir) => (
        <React.Fragment key={dir.id}>
          <DirDiv directory={dir} selectedFile={props.selectedFile} onSelect={props.onSelect} />
        </React.Fragment>
      ))}
      {props.directory.files.sort(sortFile).map((file) => (
        <React.Fragment key={file.id}>
          <FileDiv file={file} selectedFile={props.selectedFile} onClick={() => props.onSelect(file)} />
        </React.Fragment>
      ))}
    </div>
  );
};

const FileDiv = ({ file, icon, selectedFile, onClick }: {
  file: File | Directory;
  icon?: string;
  selectedFile: File | undefined;
  onClick: () => void;
}) => {
  const isSelected = selectedFile && selectedFile.id === file.id;
  const depth = file.depth;
  const paddingLeft = Math.min(depth * 16, 64);

  return (
    <div
      style={{ paddingLeft: `${paddingLeft}px` }}
      className={`flex items-center cursor-pointer p-1 rounded-md
        ${isSelected ? "bg-gray-300 dark:bg-gray-800" : "bg-transparent"} 
        hover:bg-gray-200 dark:hover:bg-gray-700
        text-black dark:text-white
      `}
      onClick={onClick}
    >
      <FileIcon name={icon} extension={file.name.split('.').pop() || ""} />
      <span className="ml-1">{file.name}</span>
    </div>
  );
};

const DirDiv = ({ directory, selectedFile, onSelect }: {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
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
          if (!open) {
            onSelect(directory);
          }
          setOpen(!open);
        }}
      />
      {open ? (
        <SubTree directory={directory} selectedFile={selectedFile} onSelect={onSelect} />
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
    if (selectedFile.parentId === '0') {
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

const FileIcon = ({ extension, name }: { name?: string; extension?: string }) => {
  let icon = getIcon(extension || "", name || "");
  return (
    <span className="flex w-8 h-8 justify-center items-center">
      {icon}
    </span>
  );
};
