import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/helpers";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export const CompleteJobList = () => {
  const { data, error, isLoading }: UseQueryResult<AxiosResponse<any, any>> =
    useQuery(["completedJobs"], async () => {
      return await axios.get(`/api/tasks/get-completed-tasks`);
    });
  const completedTasks = data?.data?.data;
  const router = useRouter();

  const dynamicRoute = router.query.screen;
  return (
    <div className="my-4 flex  flex-col gap-4 sm:min-w-[400px]">
      <p className="text-sm text-gray-400">
        {isLoading ? <Loader /> : completedTasks?.length + " jobs "}
      </p>
      <ul className="flex max-h-[450px] flex-col gap-4 overflow-y-scroll">
        {completedTasks?.map((task: any) => {
          return (
            <li key={task._id}>
              <Link
                href={`/playground/${dynamicRoute}/${task.id}`}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-800 p-4 transition duration-300 ease-in-out hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white active:bg-slate-700 active:text-white"
                )}
              >
                {" "}
                <div className="flex items-center gap-4">
                  <p className="text-sm">{task.name}</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
