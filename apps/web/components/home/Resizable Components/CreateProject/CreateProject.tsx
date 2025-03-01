import React from "react";

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
import { Button } from "@workspace/ui/components/button";
import CreateProjectCard from "./CreateProjectCard";
import { FiPlus } from "react-icons/fi";
function CreateProject() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="px-2">
        <Button
          className="w-full  flex items-center space-x-3 "
          variant="ghost"
        >
          Create Project <FiPlus className="" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a New App</AlertDialogTitle>
          <AlertDialogDescription>
            Create your new app by selecting a template
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CreateProjectCard />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateProject;
