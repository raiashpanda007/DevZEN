"use client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import axios from "axios";
import type { ProjectItem } from "@workspace/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

function ChatNewDialogBox() {
  const Modes = ["Agent", "Edit", "Review"];
  const ModeDetails = {
    Agent:
      "She goes full-stack ninja mode 🥷  building complete apps, cooking up architecture, and dropping big features like it's nothing.",

    Edit: "She is your code barber 💇  trimming bugs, patching features, or messing things up even more if you’re in the mood 😂.",

    Review:
      "She becomes your code teacher & roast master 👩‍🏫🔥  pointing out bugs, explaining why your code is sus, and suggesting how not to blow up prod.",
  };

  const [selectedMode, setSelectedMode] = useState<string>("Agent");
  const [chatName, setChatName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [allProject, setAllProjects] = useState<ProjectItem[] | []>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getUserProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/project`
      );
      console.log("Logging response", response);
      const data = response.data.data;
      console.log("Loggin data", data);
      setAllProjects(data as ProjectItem[]);
    } catch (error) {
      console.error("Error in fetching user projects for creating chat");
      return;
    }
  };
  useEffect(() => {
    getUserProjects();
  }, [selectedMode]);
  useEffect(() => {
    if (selectedMode === "Agent") {
      setSelectedProject("");
    }
  }, [selectedMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatName || (selectedMode !== "Agent" && !selectedProject)) {
      setError(
        "Please select a chat name or select a project if not selected Agent mode"
      );
  return;
    }
    setError("");
    console.log(
      "chatName :: ",
      chatName,
      "selectedMode :: ",
      selectedMode,
      "selected Project :: ",
      selectedProject
    );

  setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
  <DialogTrigger
          className="group flex items-center gap-2 transition-all duration-200 ease-in-out hover:bg-secondary active:scale-75
      sm:px-6 sm:py-3 sm:border sm:rounded-full
      w-full sm:w-auto
    "
        >
          <FaPlus className="text-base transition-colors duration-200 ease-in-out group-hover:text-secondary-foreground" />
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create a New Chat</DialogTitle>
              <DialogDescription>
                Create a new chat where you can select modes of{" "}
                <span className="font-semibold text-[#F26307] text-lg">
                  Ashna
                </span>
                .
                <br />
                Please be kind to her she is your partner so she might get angry,
                so won't helpful much when she is angry
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name of Chat</Label>
                <Input
                  placeholder="Please enter the name of the chat"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  Select Mode of{" "}
                  <span className="font-semibold text-[#F26307] text-lg">
                    Ashna
                  </span>
                </Label>
                <div className="flex">
                  <Select
                    value={selectedMode}
                    onValueChange={(mode) => setSelectedMode(mode)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Please select the project " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Modes</SelectLabel>
                        {Modes.map((mode) => (
                          <SelectItem value={mode} key={mode} children={mode} />
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="text-sm opacity-50 ml-2">
                    {ModeDetails[selectedMode as "Agent" | "Edit" | "Review"]}
                  </span>
                </div>
              </div>
              {selectedMode !== "Agent" && (
                <>
                  <Label>
                    Select the project in which you want to {selectedMode}
                  </Label>
                  {allProject.length != 0 ? (
                    <>
                      <Select
                        value={selectedProject}
                        onValueChange={(project) => setSelectedProject(project)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Modes</SelectLabel>
                            {allProject.map((project) => (
                              <SelectItem
                                value={project.id}
                                key={project.id}
                                children={project.name}
                              />
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <>
                      <div>
                        Please create a project in order to use {selectedMode}{" "}
                        mode
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <DialogFooter>
              {error && <div className="text-red-600 opacity-50 text-sm">{error}</div>}
              <Button type="submit">Create Chat</Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
}

export default ChatNewDialogBox;
