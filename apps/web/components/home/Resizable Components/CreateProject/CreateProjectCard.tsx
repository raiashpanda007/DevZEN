import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Search from "./Search";
function CreateProjectCard() {
  return (
    <div>
      <Input placeholder="Project Name" className="w-full" />
      <Label>Select template</Label>
      <Search/>
    </div>
  );
}

export default CreateProjectCard;
