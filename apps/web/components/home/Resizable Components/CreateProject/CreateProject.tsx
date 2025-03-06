"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { loadinghandler } from "@/store/Loader";
import { Button } from "@workspace/ui/components/button";
import CreateProjectCard from "./CreateProjectCard";
import { FiPlus } from "react-icons/fi";
import { Template } from "@workspace/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

function CreateProjectDialog() {
  const loader = useSelector((state: RootState) => state.loader.isLoading);
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState<string | null>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = () => {
    setError(null); // Reset previous errors

    if (!projectName || projectName.length <= 1) {
      setError("Please enter a project name");
      return;
    }
    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    // Dispatch loading state
    dispatch(loadinghandler({ isLoading: true, message: "Creating your new app and setting up environment..." }));
  };

  return (
    <AlertDialog>
      {/* Button to trigger dialog */}
      <AlertDialogTrigger asChild>
        <Button className="w-full flex items-center space-x-3" variant="ghost">
          Create Project <FiPlus />
        </Button>
      </AlertDialogTrigger>

      {/* Dialog Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a New App</AlertDialogTitle>
          <AlertDialogDescription>
            Create your new app by selecting a template.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Project Input & Selection */}
        <CreateProjectCard
          setProjectName={setProjectName}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />

        {/* Footer Buttons */}
        <AlertDialogFooter>
          {error && <p className="text-red-500">{error}</p>}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleCreateProject}>Create</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateProjectDialog;
