import React, { useState } from 'react';
import { Directory, File, sortDir, sortFile } from "./FileStructure.js";
import { getIcon } from "./Icons.js";

interface FileTreeProps {
  rootDir: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}

export const FileTree = (props: FileTreeProps) => {
  return <SubTree directory={props.rootDir} {...props} />;
};

interface SubTreeProps {
  directory: Directory;
  selectedFile: File | undefined;
  onSelect: (file: File) => void;
}

const SubTree = ({ directory, selectedFile, onSelect }: SubTreeProps) => {
  return (
    <div>
      {directory.dirs.sort(sortDir).map((dir) => (
        <DirDiv key={dir.id} directory={dir} selectedFile={selectedFile} onSelect={onSelect} />
      ))}
      {directory.files.sort(sortFile).map((file) => (
        <FileDiv key={file.id} file={file} selectedFile={selectedFile} onClick={() => onSelect(file)} />
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
  return (
    <div
      className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-800 ${isSelected ? 'bg-gray-800' : ''}`}
      style={{ paddingLeft: file.depth * 16 }}
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
  let defaultOpen = selectedFile ? isChildSelected(directory, selectedFile) : false;
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
      {open && <SubTree directory={directory} selectedFile={selectedFile} onSelect={onSelect} />}
    </>
  );
};

const isChildSelected = (directory: Directory, selectedFile: File) => {
  let res = false;
  function isChild(dir: Directory, file: File) {
    if (selectedFile.parentId === dir.id) {
      res = true;
      return;
    }
    if (selectedFile.parentId === '0') {
      res = false;
      return;
    }
    dir.dirs.forEach((item) => isChild(item, file));
  }
  isChild(directory, selectedFile);
  return res;
};

const FileIcon = ({ extension, name }: { name?: string; extension?: string }) => {
  let icon = getIcon(extension || "", name || "");
  return <span className="flex w-8 h-8 justify-center items-center">{icon}</span>;
};
