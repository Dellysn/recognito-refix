/* eslint-disable @next/next/no-img-element */
import { ImageEditor } from "@/components/external";
import { cn } from "@/lib/helpers";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Cog } from "lucide-react";
import { useEffect, useState } from "react";
import { createScheduler, createWorker } from "tesseract.js";

export const MainPlayground = ({ taskId }: { taskId: string }) => {
  const { data: tasks, isLoading }: UseQueryResult<AxiosResponse<any, any>> =
    useQuery(
      ["tasks", taskId],
      async () => taskId !== null && axios.get(`/api/tasks/${taskId}`)
    );
  const [logs, setLogs] = useState<
    {
      status: "recognizing text" | "loaded language eng";
      progress: number;
      userJobId: number;
    }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  async function handleTextRecognition() {
    try {
      setIsProcessing(true);
      const worker = await createWorker({
        logger: (m) => setLogs((l) => [...l, m]),
      });
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const scheduler = createScheduler();
      scheduler.addWorker(worker);

      for (let i = 0; i < tasks?.data.files.length; i++) {
        const image = tasks?.data.files[i];
        let index = i;
        setImageIndex(
          tasks?.data.files.findIndex((file: string) => file === image) + 1
        );
        const { data } = await scheduler.addJob("recognize", image);
        index = i;

        console.log("handleTextRecognition", data, index);
        if (i === tasks?.data.files.length - 1) setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
      console.log(error);
    }
  }
  useEffect(() => {
    setLogs([]);
  }, []);

  return (
    <div className="mx-auto flex w-[700px] max-w-[768px] flex-col items-center  gap-4 rounded-xl ">
      {!taskId ? (
        <div>
          <h1>Task not found</h1>
          <p className="text-base">
            Select a task from the sidebar to get started.
          </p>
        </div>
      ) : (
        <div className=" flex w-full flex-col gap-8 p-4">
          <div className="flex flex-col gap-4 rounded-xl bg-slate-800 p-8">
            <h1 className="font-mono text-lg leading-tight">
              {tasks?.data.name}
            </h1>

            <div className="item-center flex justify-between">
              <div className="flex items-center gap-4 text-base">
                <div
                  className={cn(
                    "h-6 w-6 rounded-md ",
                    tasks?.data.status === "completed"
                      ? "bg-green-400"
                      : "bg-gray-400"
                  )}
                ></div>{" "}
                <p className="text-sm first-letter:uppercase">
                  {tasks?.data.status}
                </p>
              </div>

              <button
                className="flex items-center justify-center gap-4 rounded-md rounded-tr-none rounded-br-none bg-[#2e026d] px-4 py-2 text-white
              transition duration-300
              ease-in-out hover:bg-[#2e026d]
              hover:text-white focus:bg-[#2e026d]
              focus:text-white active:bg-[#2e026d] active:text-white"
                onClick={handleTextRecognition}
              >
                <div className="flex items-center gap-4 text-base">
                  <Cog size={24} />
                  <p className="text-sm">
                    {isProcessing
                      ? `Processing ${imageIndex}/${tasks?.data.files.length}`
                      : "Start Text Recognition"}
                  </p>
                </div>
              </button>
            </div>
            <div className={`flex  flex-wrap items-center gap-4 `}>
              {isLoading ? (
                <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4 shadow">
                  <div className="flex animate-pulse space-x-4">
                    <div className="h-10 w-10 rounded-full bg-slate-700"></div>
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 rounded bg-slate-700"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2 h-2 rounded bg-slate-700"></div>
                          <div className="col-span-1 h-2 rounded bg-slate-700"></div>
                        </div>
                        <div className="h-2 rounded bg-slate-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                tasks?.data.files.map((image: string, index: number) => (
                  <div
                    className="relative max-h-[250px] max-w-[250px] overflow-hidden  
                    rounded-md p-4 shadow-slate-400 transition-all  duration-300
                  "
                    key={index}
                  >
                    <img className="object-cover" src={image} alt="image" />
                    <div
                      className="absolute inset-0  z-10 h-full
                  w-full bg-slate-800 bg-opacity-30  hover:shadow-xl "
                    >
                      <div className="flex h-full flex-col items-center justify-center">
                        <p>
                          {imageIndex ===
                            tasks?.data.files.findIndex(
                              (file: string) => file === image
                            ) +
                              1 && isProcessing
                            ? "Processing..."
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <ImageEditor />
          <div className="flex flex-col gap-4 rounded-xl bg-slate-800 p-8">
            <p className="text-base">Logs</p>

            {taskId === tasks?.data.id && (
              <div className="p-xl flex max-h-[400px] flex-col gap-4 overflow-y-scroll rounded-xl bg-black font-mono">
                {logs.map((item) => (
                  <p key={item.userJobId}>
                    {/* status, progress, userJobId */}
                    <span
                      className="uppercase
                  text-[#00ff00] "
                    >
                      {item?.userJobId}
                    </span>{" "}
                    <span
                      className="
                  text-red-400
                    "
                    >
                      {item?.status}
                    </span>{" "}
                    <span
                      className="
                  text-purple-400
                    "
                    >
                      {item?.progress}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
