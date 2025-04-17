import { useRouter } from "next/navigation";
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
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { loadinghandler } from "@/store/Loader";
import { useDispatch } from "react-redux";

interface DeleteProjectButtonProps {
  projectId: string;
}

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  async function handleDeleteProject(projectId: string) {
    
    try {
      dispatch(
        loadinghandler({
          isLoading: true,
          message: "Deleting your project...",
        })
      );
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_HTTP_URL}/project`,
        {
          data: { projectId },
        }
      );
      if (response.status === 200) {
        console.log("Project deleted successfully");
      } else {
        console.error("Failed to delete project:", response.data);
      }
      dispatch(loadinghandler({ isLoading: false, message: "" }));
      window.location.reload()

      
    } catch (error) {
      console.error("Error deleting project:", error);
      dispatch(loadinghandler({ isLoading: false, message: "" }));
      router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/home`);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-slate-200 z-40 cursor-pointer"
        >
          <FiTrash2 className="text-red-400 text-sm sm:text-base" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            The Project will be permanently deleted. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDeleteProject(projectId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
