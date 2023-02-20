import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/menu/modal";
import { PlusCircle } from "lucide-react";

export function CreateMultipleTasks({
  openMultipleModal,
  setOpenMultipleModal,
}: any) {
  return (
    <Dialog
      open={!!openMultipleModal}
      onOpenChange={(state) => {
        setOpenMultipleModal(state);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create multiple tasks by uploading a multiple files
          </DialogTitle>
          <DialogDescription>
            <p className="text-base">
              create a single task by uploading a file
            </p>
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Collection Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="rounded-md border border-gray-300 px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="file">File</label>
            <p className="text-xs">You can upload multiple files</p>
            <input
              type="file"
              name="file"
              id="file"
              className="rounded-md border border-gray-300 px-4 py-2"
            />
          </div>

          <button className="flex items-center justify-center gap-4 rounded-md rounded-tr-none rounded-br-none bg-[#2e026d] px-4 py-2 text-white  transition duration-300 ease-in-out hover:bg-[#2e026d] hover:text-white focus:bg-[#2e026d] focus:text-white active:bg-[#2e026d] active:text-white">
            <PlusCircle />
            <span>create</span>
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
