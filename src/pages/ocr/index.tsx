import { Navbar } from "@/components/layouts";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const OcrPage = () => {
  const { data } = useSession();
  return (
    <div
      className="flex min-h-screen flex-col  gap-4
    bg-gradient-to-b from-[#2e026d] to-[#15162c]
      "
    >
      <Navbar />

      <div className="flex h-screen w-screen flex-col items-center justify-center   pt-11 ">
        <p className="text-center text-4xl font-bold text-white">
          Welcome, {data?.user?.name}
        </p>
        <p className="text-white">
          see your recent jobs
          <Link href="/ocr/playground"> here</Link>
          ...
        </p>
      </div>
    </div>
  );
};

export default OcrPage;
