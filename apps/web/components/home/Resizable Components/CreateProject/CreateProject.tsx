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
import axios from "axios";
import { useRouter } from "next/navigation";

function CreateProjectDialog() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState<string | null>("");
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >();
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async () => {
    setError(null); 

    if (!projectName || projectName.length <= 1) {
      setError("Please enter a project name");
      return;
    }
    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }
    try {
      dispatch(
        loadinghandler({
          isLoading: true,
          message: "Creating your new app and setting up environment...",
        })
      );
      const response = await axios.post(
        `http://localhost:3000/api/project/`,
        {
          name: projectName,
          template: selectedTemplate,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(loadinghandler({ isLoading: false, message: "" }));
        router.push(`/projects/${response.data.data.id}`);
      } 
        dispatch(loadinghandler({ isLoading: false, message: "" }));
        setError(response.data.message);
      
    } catch (error) {
      dispatch(loadinghandler({ isLoading: false, message: ""
      }));
      setError(
        "An error occurred while creating your project. Please try again."
      );
    }

    // Dispatch loading state
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
