import { Loader } from "@/components/ui/loader";
import { animated, useSpringRef, useTransition } from "@react-spring/web";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const OCRResult = ({ taskId }: { taskId: string }) => {
  const { data }: UseQueryResult<AxiosResponse<any, any>> = useQuery(
    ["completedJobs", taskId],
    async () => {
      return taskId && (await axios.get(`/api/tasks/${taskId}/results`));
    }
  );
  const tasks = data?.data;
  const router = useRouter();
  const [mouseOver, setMouseOver] = useState(false);
  const transition = useTransition(mouseOver, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const springRef = useSpringRef();
  const { copyToClipboard, copied } = useClipBoard();
  useEffect(() => {
    springRef.start();
  }, [mouseOver]);

  const deleteMutation = useMutation(
    async () => {
      return await axios.delete(`/api/tasks/${taskId}/results`);
    },
    {
      onSuccess: () => {
        alert("results deleted successfully");
        router.push({
          pathname: "/playground/completed-job-list",
          hash: null,
        });
      },
      onError: (error: unknown) => alert(error.toString()),
    }
  );

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
  };

  return (
    <div>
      <div className="mb-4 flex w-full items-center justify-between text-sm text-gray-400 sm:min-w-[500px] ">
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
          <h1 className="font-mono text-lg leading-tight text-white">
            {tasks?.result?.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tasks?.result?.results?.map((result: string, index: number) => {
          return (
            <div
              className=" relative rounded-md bg-slate-100 p-3 text-gray-900  shadow-sm"
              key={index}
              onMouseEnter={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
            >
              {transition(
                (style, item) =>
                  item && (
                    <animated.div style={style}>
                      <button
                        className="absolute top-2 right-2  rounded-md  bg-[#2e026d] px-4 py-2 text-white  transition duration-300 ease-in-out hover:bg-[#2e026d] hover:text-white focus:bg-[#2e026d] focus:text-white active:bg-[#2e026d] active:text-white  "
                        onClick={() => {
                          copyToClipboard(result);
                          if (copied) {
                            alert("Copied to clipboard");
                          }
                        }}
                      >
                        Copy
                      </button>{" "}
                    </animated.div>
                  )
              )}
              <p className="text-sm">{result}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const useClipBoard = () => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (copied) {
      timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [copied]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return { copyToClipboard, copied };
};
