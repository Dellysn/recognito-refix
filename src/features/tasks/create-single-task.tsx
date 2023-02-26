/* eslint-disable @next/next/no-img-element */
import { Dropzone } from "@/components/external";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/menu/modal";
import { File } from "@/lib/multer";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function CreateSingleTask({ openSingleModal }: any) {
  const generateRandomTaskName = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `Task ${randomString}`;
  };
  const router = useRouter();
  const [randomTaskName, setRandomTaskName] = useState(
    generateRandomTaskName()
  );
  useEffect(() => {
    if (openSingleModal) {
      setRandomTaskName(generateRandomTaskName());
    }
  }, [openSingleModal]);
  const [taskDetails, setTaskDetails] = useState<{
    name: string;
    files: File[];
  }>({
    name: randomTaskName,
    files: [],
  });

  const mutation = useMutation(
    async (data: any) => {
      return await axios.post("/api/tasks/add", data, {
        headers: { "content-type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        alert("job created successfully");
        setTaskDetails({
          name: randomTaskName,
          files: [],
        });
        router.push({
          query: {
            ...router.query,
          },
          hash: null,
        });
      },
      onError: (error: unknown) => alert(error.response.data.error.toString()),
    }
  );

  function handleSubmitTask() {
    if (taskDetails.name && taskDetails.files?.length > 0) {
      const formData = new FormData();
      formData.append("name", taskDetails.name);
      taskDetails?.files?.forEach((file) => {
        console.log(file);
        formData.append("file", file[0] as unknown as Blob);
      });

      mutation.mutate(formData);
    } else {
      alert("Please fill all the fields");
    }
  }

  return (
    <Dialog
      open={openSingleModal}
      onOpenChange={() => {
        router.push({
          query: {
            ...router.query,
          },
          hash: null,
        });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
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
                  files: [...taskDetails.files, file as unknown as File],
                });
              }}
            />
            <div>
              {taskDetails.files && taskDetails.files.length > 0 && (
                <div className="flex w-full flex-wrap justify-evenly">
                  {taskDetails.files.map((file: any) => (
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
                              files: taskDetails?.files.filter(
                                (f) => f.name !== file.name
                              ),
                            });
                          }}
                        />
                      </div>

                      <img
                        className="h-10 w-10 rounded-md bg-gray-300"
                        alt={file.name}
                        src={URL.createObjectURL(file[0])}
                      />
                      <p className="text-sm">
                        {file[0].name.slice(0, 10) + "..."}
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
