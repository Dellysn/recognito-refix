import { CreateSingleTask } from "@/features/tasks/create-single-task";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Navbar } from "./custom-navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const openSingleModalFromQuery =
    router.asPath.split("#")[1] === "create-job" ? true : false;
  const { data } = useSession();
  useEffect(() => {
    if (!data) {
      router.push("/");
    }
  }, [data]);
  return (
    <div
      className="flex  min-h-screen  flex-col
     bg-slate-900 text-white
      "
    >
      <Navbar />
      <div className="mt-4 flex  h-screen w-screen items-center   justify-between pt-11 ">
        <div className="flex h-full max-h-[1200px] w-full flex-initial flex-col  gap-12 overflow-y-scroll  text-xs text-white ">
          {children}
        </div>
        <CreateSingleTask openSingleModal={openSingleModalFromQuery} />
      </div>
    </div>
  );
};
