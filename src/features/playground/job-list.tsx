/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const PlaygroundJobList = ({
  setTaskId,
  taskId,
}: {
  setTaskId(id: string): void;
  taskId: string;
}) => {
  const { isLoading, data } = useQuery(["jobs"], async () =>
    axios.get("/api/tasks")
  );
  return (
    <div className="my-4 flex  flex-col gap-4">
      <p className="text-sm text-gray-400">
        {isLoading ? "loading..." : data?.data.length} jobs
      </p>
      <ul className="flex max-h-[450px] flex-col gap-4 overflow-y-scroll">
        {isLoading ? (
          <div>loading...</div>
        ) : (
          data?.data?.map((item: any) => (
            <li
              key={item._id}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-800 p-4 transition duration-300 ease-in-out hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white active:bg-slate-700 active:text-white",
                taskId === item.id && "bg-slate-700 text-white"
              )}
              onClick={() => {
                setTaskId(item.id);
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">{item.name}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-gray-400">2h ago</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
