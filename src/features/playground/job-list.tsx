/* eslint-disable @next/next/no-img-element */
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const PlaygroundJobList = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const { isLoading, data } = useQuery(
    ["jobs"],
    async () => axios.get("/api/tasks"),
    {
      refetchInterval: 1000,
    }
  );
  const router = useRouter();
  const dynamicRoute = router.query?.screen;

  return (
    <div className="my-4 flex  flex-col gap-4 sm:min-w-[400px]">
      <p className="text-lg text-gray-400">{data?.data?.length} jobs</p>
      <ul className="flex max-h-[450px] flex-col gap-4 overflow-y-scroll">
        {isLoading ? (
          <div>
            <Loader />
          </div>
        ) : (
          data?.data?.map((item: any) => (
            <li
              key={item._id}
              onClick={() => {
                setTaskId(item.id);
              }}
            >
              <Link
                href={`/playground/${dynamicRoute}/${item.id}`}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-800 p-4 transition duration-300 ease-in-out hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white active:bg-slate-700 active:text-white",
                  taskId === item.id && "bg-slate-700 text-white"
                )}
              >
                {" "}
                <div className="flex items-center gap-4">
                  <div className="flex flex-nowrap items-center gap-1">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-md ",
                        item.status === "completed"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      )}
                    ></div>
                    <p className="text-sm">{item.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
