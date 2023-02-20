import { Dropzone } from "@/components/external";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/menu/modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

export function CreateSingleTask({ openSingleModal, setOpenSingleModal }: any) {
  const generateRandomTaskName = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `Task ${randomString}`;
  };
  const randomName = generateRandomTaskName();
  const [taskDetails, setTaskDetails] = useState<{
    name: string;
    file:
      | {
          name: string;
          path: string;
          size: number;
          type: string;
        }[]
      | null;
  }>({
    name: randomName,
    file: [],
  });

  const mutation = useMutation(async (data: any) => {
    await axios.post("/api/tasks/add", data, {
      headers: { "content-type": "multipart/form-data" },
    });
  });

  function handleSubmitTask() {
    if (taskDetails.name && taskDetails.file?.length > 0) {
      const formData = new FormData();
      formData.append("name", taskDetails.name);
      taskDetails?.file.forEach((file) => {
        formData.append("file", file);
      });
      mutation.mutate(formData);
      if (mutation.isSuccess) {
        setTaskDetails({
          name: randomName,
          file: [],
        });
      }
    } else {
      alert("Please fill all the fields");
    }
  }

  return (
    <Dialog
      open={!!openSingleModal}
      onOpenChange={(state) => {
        setOpenSingleModal(state);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a single task</DialogTitle>
          <DialogDescription>
            <p className="text-base">
              create a single task by uploading a file
            </p>
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={taskDetails.name}
              className="rounded-md border border-gray-300 px-4 py-2"
              onChange={(e) => {
                setTaskDetails({
                  ...taskDetails,
                  name: e.target.value,
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="file">File</label>
            <Dropzone
              onDrop={(file) => {
                setTaskDetails({
                  ...taskDetails,
                  file: file.concat(taskDetails.file || []),
                });
              }}
            />
            <div>
              {taskDetails.file && taskDetails.file.length > 0 && (
                <div className="flex w-full flex-wrap justify-evenly">
                  {taskDetails.file.map((file: any) => (
                    <div
                      className="relative flex flex-col items-center justify-center gap-4"
                      key={file.name}
                      role="button"
                    >
                      <div className="rounded-full bg-slate-800">
                        <X
                          className="absolute top-0 right-0 block"
                          size={16}
                          onClick={() => {
                            setTaskDetails({
                              ...taskDetails,
                              file: taskDetails?.file.filter(
                                (f) => f.name !== file.name
                              ),
                            });
                          }}
                        />
                      </div>

                      <img
                        className="h-10 w-10 rounded-md bg-gray-300"
                        alt={file.name}
                        src={URL.createObjectURL(file)}
                      />
                      <p className="text-sm">
                        {file.name.slice(0, 10) + "..."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="flex items-center justify-center gap-4 rounded-md rounded-tr-none rounded-br-none bg-[#2e026d] px-4 py-2 text-white  transition duration-300 ease-in-out hover:bg-[#2e026d] hover:text-white focus:bg-[#2e026d] focus:text-white active:bg-[#2e026d] active:text-white"
            onClick={handleSubmitTask}
          >
            <PlusCircle />
            <span>create</span>
            {mutation.isLoading && (
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
