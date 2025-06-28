"use client"

import { Button } from "@workspace/ui/components/button";
import { Play } from "lucide-react";
const Run = () => {
  return (
    <Button className="bg-green-600 flex">
      Run <Play />
    </Button>
  );
};

export default Run;
