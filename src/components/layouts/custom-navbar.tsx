import { LogIn, LogOut, PlusCircle } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export function Navbar({}) {
  const { data } = useSession();
  const router = useRouter();
  const handleLogout = () => {
    signOut({
      redirect: true,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLogin = () => {
    signIn("google")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav
      className="fixed z-50 flex w-full items-center justify-between border-b border-gray-300 bg-gradient-to-b  
      from-[#2e026d] to-[#15162c] px-4 py-2
      "
    >
      <div className="flex items-center justify-center gap-4">
        <svg
          viewBox="0 -48 256 256"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMid"
          className="h-8 w-8"
        >
          <g>
            <path
              d="M26.5234742,66.6177453 L70.8724138,111.612738 C83.6512291,124.608309 104.590755,124.608309 117.368817,111.612738 L152.483277,75.900694 C157.530379,70.7677181 165.798714,70.7677181 170.845816,75.900694 L188.241231,93.5926434 L143.999691,138.696692 C130.255258,152.675191 112.214843,159.555686 94.1744284,159.555686 C76.1340131,159.555686 58.0938993,152.56606 44.3489395,138.587561 L0,93.5926434 L26.5234742,66.6177453 Z"
              fill="#F06332"
            />
            <path
              d="M211.650871,20.9684206 L256.000036,66.0723181 L229.369163,93.1561213 L185.019997,48.0526002 C172.134309,34.9472962 151.409282,34.9472962 138.523594,48.0526002 L103.409886,83.7641174 C98.3627849,88.8970177 90.0944496,88.8970177 85.0473481,83.7641174 L67.6513305,66.0723181 L112.000345,20.9684206 C139.489964,-6.98947353 184.161252,-6.98947353 211.650871,20.9684206 L211.650871,20.9684206 Z"
              fill="#029D74"
            />
          </g>
        </svg>
        <h6 className="text-xl font-extrabold tracking-tight text-white ">
          Recognito
        </h6>
      </div>
      <div className="fixed left-0 top-0 flex h-full flex-col flex-wrap items-center justify-center  gap-4 bg-[#2e026d] p-4 sm:static sm:flex-row sm:bg-transparent sm:p-0">
        <Link href="/playground/job-list">Recents Jobs</Link>
        <Link href="/playground/completed-job-list">Completed Jobs</Link>
        {data?.user ? (
          <button
            className="flex items-center justify-center gap-4 rounded-md bg-slate-100 px-4 py-2 text-[#2e026d]
              transition duration-300
              ease-in-out hover:bg-slate-100 
            "
            onClick={() => {
              router.push({
                hash: "#create-job",
              });
            }}
          >
            <PlusCircle />
            <span className="text-sm">create new job</span>
          </button>
        ) : null}
        {data?.user ? (
          <button
            className="flex items-center justify-center gap-4 rounded-md bg-slate-100 px-4 py-2 text-[#2e026d]"
            onClick={() => {
              handleLogout();
            }}
          >
            <div className="flex items-center gap-4">
              <Image
                src={data.user.image as string}
                width={25}
                height={25}
                alt={data.user.name as string}
                className="rounded-full shadow-md"
              />
              <span>Sign out</span>
              <LogOut size={16} />
            </div>
          </button>
        ) : (
          <button
            className="flex items-center justify-center gap-4 rounded-md bg-slate-100 px-4 py-1 text-white"
            onClick={() => handleLogin()}
          >
            <div className="flex items-center gap-4 text-[#2e026d] ">
              <span>Sign in</span>
              <LogIn size={16} />
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}
