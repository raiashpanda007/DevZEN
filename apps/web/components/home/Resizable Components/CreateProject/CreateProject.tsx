"use client"
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
import { Button } from "@workspace/ui/components/button";
import CreateProjectCard from "./CreateProjectCard";
import { FiPlus } from "react-icons/fi";
import { Template } from "@workspace/types";

function CreateProjectDialog() {
  const [projectName, setProjectName] = useState<string | null>('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Control dialog close

  const handleCreateProject = () => {
    setError(null); // Reset previous errors

    if (!projectName || projectName.trim() === "") {
      setError("Please enter a project name");
      return;
    }
    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    // If validation passes, close the dialog
    setIsSubmitting(true);
  };

  return (
    <AlertDialog open={isSubmitting ? false : undefined}> 
      <AlertDialogTrigger asChild className="px-2">
        <Button className="w-full flex items-center space-x-3" variant="ghost">
          Create Project <FiPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a New App</AlertDialogTitle>
          <AlertDialogDescription>
            Create your new app by selecting a template
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CreateProjectCard setProjectName={setProjectName} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
        <AlertDialogFooter>
          {error && <p className="text-red-500">{error}</p>}
          <AlertDialogCancel onClick={() => setIsSubmitting(false)}>Cancel</AlertDialogCancel>
          <Button onClick={handleCreateProject}>Create</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateProjectDialog;
