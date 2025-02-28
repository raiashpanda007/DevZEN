import React from "react";
import { Button } from "@workspace/ui/components/button";
import { FiPlus } from "react-icons/fi";
function CreateProject() {
  return (
    <div>
      <Button className="w-full" variant="secondary">
        <div className="flex items-center space-x-3 opacity-50">
          Create Project <FiPlus className=""/>
        </div>
      </Button>
    </div>
  );
}

export default CreateProject;
