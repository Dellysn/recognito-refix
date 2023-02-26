import { CreateSingleTask } from "@/features/tasks/create-single-task";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PlaygroundPage = () => {
  const { data: userSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!userSession?.user) {
      router.push("/");
    }
  }, [!userSession?.user]);

  const openSingleModalFromQuery =
    router.asPath.split("#")[1] === "create-job" ? true : false;
  useEffect(() => {
    console.log(openSingleModalFromQuery);
  }, []);
  return (
    <>
      <CreateSingleTask openSingleModal={openSingleModalFromQuery} />
    </>
  );
};

export default PlaygroundPage;
