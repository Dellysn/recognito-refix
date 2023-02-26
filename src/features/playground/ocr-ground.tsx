/* eslint-disable @next/next/no-img-element */
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/helpers";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Cog, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { createScheduler, createWorker } from "tesseract.js";

export const OCRGround = ({ taskId }: { taskId: string }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const router = useRouter();
  const { data, isLoading }: UseQueryResult<AxiosResponse<any, any>> = useQuery(
    ["tasks", taskId],
    async () => taskId !== null && axios.get(`/api/tasks/${taskId}`)
  );
  const tasks = data?.data;

  const [logs, setLogs] = useState<
    {
      status: "recognizing text" | "loaded language eng";
      progress: number;
      userJobId: number;
    }[]
  >([]);

  const deleteMutation = useMutation(
    async () => {
      return await axios.delete(`/api/tasks/${taskId}`);
    },
    {
      onSuccess: () => {
        alert("job deleted successfully");
        router.push({
          pathname: "/playground/job-list",
          hash: null,
        });
      },
      onError: (error: unknown) => alert(error.toString()),
    }
  );

  const savedResultsMutation = useMutation(
    async (data: any) => {
      return await axios.post(`/api/tasks/${taskId}/results`, data);
    },
    {
      onSuccess: () => {
        alert("job output saved successfully");
      },
      onError: (error: unknown) => alert(error.toString()),
    }
  );

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
  };

  const handleSaveResults = async () => {
    await savedResultsMutation.mutateAsync({
      results: results,
    });
  };

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

      for (let i = 0; i < tasks?.files.length; i++) {
        const image = tasks?.files[i];

        setImageIndex(
          tasks?.files.findIndex((file: string) => file === image) + 1
        );

        const { data } = await scheduler.addJob("recognize", image);

        setResults((r) => [...r, data.text]);

        if (i === tasks?.files.length - 1) {
          setIsProcessing(false);
          setImageIndex(0);
          setLogs([]);
        }
      }
      if (!isProcessing && results.length === tasks?.files.length) {
        await handleSaveResults();
      }
    } catch (error: unknown) {
      setIsProcessing(false);
      alert(error.toString());
    }
  }

  return (
    <div className="mx-auto flex w-[700px] max-w-[768px] flex-col items-center  gap-4 rounded-xl ">
      <div className="flex w-full items-center justify-between text-sm text-gray-400 ">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-4 rounded-md bg-slate-100 px-4 py-2 text-[#2e026d]
              transition duration-300
              ease-in-out hover:bg-slate-100"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            className=" rounded-md  px-2 py-1 text-red-400"
            onClick={handleDelete}
          >
            {deleteMutation.isLoading ? <Loader /> : <Trash size={14} />}
          </button>
          <div
            className={cn(
              "h-6 w-6 rounded-md ",
              tasks?.status === "completed" ? "bg-green-400" : "bg-gray-400"
            )}
          ></div>
          <h1 className="font-mono text-lg leading-tight">{tasks?.name}</h1>
        </div>
      </div>
      {!tasks && isLoading ? (
        <Loader />
      ) : (
        <div className=" flex w-full flex-col gap-8 ">
          <div className="flex flex-col gap-4 rounded-xl bg-slate-800 ">
            <div className="item-center flex justify-end gap-2">
              {tasks?.status === "completed" && (
                <button
                  onClick={() => router.push(`/playground/completed-job-list`)}
                  className="flex items-center justify-center gap-4 rounded-md bg-slate-100 px-4 py-2 text-[#2e026d]
              transition duration-300
              ease-in-out hover:bg-slate-100"
                >
                  View Results
                </button>
              )}
              <button
                className="flex items-center justify-center gap-4 rounded-md  bg-slate-100 px-4 py-2 text-[#2e026d]
              transition duration-300 ease-in-out active:text-white
              disabled:bg-gray-400 disabled:text-gray-300"
                onClick={handleTextRecognition}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-4 text-base">
                  <Cog
                    size={18}
                    className={isProcessing ? "animate-spin" : ""}
                  />
                  <p className="text-xs">
                    {isProcessing
                      ? `Processing ${imageIndex}/${tasks?.files.length}`
                      : tasks?.status === "completed"
                      ? "Run Job Again?"
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
                tasks?.files.map((image: string, index: number) => (
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
                            tasks?.files.findIndex(
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

          <div className="flex flex-col gap-4 rounded-xl bg-black p-3 ">
            <p className="w-full bg-[#2e026d] p-4 text-base">
              Progress Logs...{" "}
            </p>

            {taskId === tasks?.id && (
              <div className="p-xl flex max-h-[400px] flex-col gap-4 overflow-y-scroll rounded-xl bg-black font-mono">
                {logs.map((item) => (
                  <p key={item.userJobId}>
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
