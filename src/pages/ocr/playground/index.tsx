import { Navbar } from "@/components/layouts";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menu";
import { CompleteJobList } from "@/features/playground/completed-job-list";
import { PlaygroundJobList } from "@/features/playground/job-list";
import { MainPlayground } from "@/features/playground/main";
import { MenubarArrow } from "@radix-ui/react-menubar";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CreateMultipleTasks } from "../../../features/tasks/create-multiple-tasks";
import { CreateSingleTask } from "../../../features/tasks/create-single-task";

const Playground = () => {
  const { data: userSession } = useSession();
  const router = useRouter();
  const [openSingleModal, setOpenSingleModal] = useState(false);
  const [openMultipleModal, setOpenMultipleModal] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const mutation = useMutation(
    async (data: any) => {
      await axios.post("/api/tasks/add", data);
    },
    {
      onSuccess: (data) => {
        console.log("success", data);
      },
    }
  );
  const { data, error, isLoading } = useQuery(["ocr"], () =>
    axios.get("/api/tasks")
  );

  useEffect(() => {
    if (!userSession?.user) {
      void router.push("/");
    }
  }, [!userSession?.user]);
  console.log(taskId);

  return (
    <>
      <div
        className="flex  min-h-screen  flex-col
     bg-slate-900 text-white
      "
      >
        <Navbar />
        <div className="flex h-screen  w-screen items-center justify-between   pt-11 ">
          <div
            className="h-full w-80  gap-4  border-r-2 border-gray-300
         px-4 text-white
        "
          >
            <div className="flex flex-col justify-center py-4">
              <div className="flex">
                {" "}
                <button
                  className="flex items-center justify-center gap-4 rounded-md rounded-tr-none rounded-br-none bg-[#2e026d] px-4 py-2 text-white
              transition duration-300
              ease-in-out hover:bg-[#2e026d]
              hover:text-white focus:bg-[#2e026d]
              focus:text-white active:bg-[#2e026d] active:text-white
            "
                  onClick={() => {
                    mutation.mutate({
                      file: "test",
                      status: "test",
                      name: "test",
                    });
                  }}
                >
                  <PlusCircle />
                  <span className="text-xs">
                    {mutation.isLoading ? "loading..." : "create new job"}
                  </span>
                </button>
                <Menubar className="rounded-tl-none rounded-bl-none border-r-0 border-t-0 border-b-0 bg-[#2e026d]">
                  <MenubarMenu>
                    <MenubarTrigger className=" focus:bg-[#2e026d] data-[state=open]:bg-[#2e026d] ">
                      <ChevronDown />
                    </MenubarTrigger>
                    <MenubarContent className="bg-[#2e026d]  text-white">
                      <MenubarArrow />
                      <MenubarItem
                        onClick={() => {
                          setOpenSingleModal(true);
                        }}
                      >
                        Create a single task
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        onClick={() => {
                          setOpenMultipleModal(true);
                        }}
                      >
                        Create multiple tasks
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
              <PlaygroundJobList
                setTaskId={(id) => {
                  setTaskId(id);
                }}
                taskId={taskId as string}
              />
            </div>
          </div>
          <div className="flex h-full max-h-[1200px] w-full flex-initial flex-col  gap-12 overflow-y-scroll p-4 text-xs text-white ">
            {mutation.isLoading ? (
              <div>loading...</div>
            ) : (
              <MainPlayground taskId={taskId as string} />
            )}
          </div>
          <div
            className="h-full w-80  gap-4  border-r-2 border-l
         border-gray-300 px-4 text-white 
        "
          >
            <div className="flex flex-col justify-center py-4">
              <CompleteJobList />
            </div>
          </div>
        </div>
      </div>
      <CreateSingleTask
        openSingleModal={openSingleModal}
        setOpenSingleModal={setOpenSingleModal}
      />
      <CreateMultipleTasks
        openMultipleModal={openMultipleModal}
        setOpenMultipleModal={setOpenMultipleModal}
      />
    </>
  );
};

export default Playground;
