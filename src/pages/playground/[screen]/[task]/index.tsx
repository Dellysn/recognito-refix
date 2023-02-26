import { OCRGround } from "@/features/playground/ocr-ground";
import { OCRResult } from "@/features/playground/ocr-result";
import { animated, useTransition } from "@react-spring/web";
import { useRouter } from "next/router";

const TaskPage = () => {
  const router = useRouter();
  const { screen, task } = router.query;
  const pages = [
    {
      name: "job-list",
      component: <OCRGround taskId={task as string} />,
    },
    {
      name: "completed-job-list",
      component: <OCRResult taskId={task as string} />,
    },
  ];

  const transition = useTransition(screen, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  return (
    <div className="mx-auto flex max-w-[768px] flex-col gap-4 rounded-xl bg-slate-800 p-8">
      {transition((style, item) => {
        const Page = pages.find((page) => page.name === item)?.component;
        return <animated.div style={style}>{Page && Page}</animated.div>;
      })}
    </div>
  );
};

export default TaskPage;
