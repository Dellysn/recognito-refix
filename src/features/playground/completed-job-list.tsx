export const CompleteJobList = () => {
  return (
    <div className="my-4 flex  flex-col gap-4">
      <p className="text-sm text-gray-400">jobs</p>
      <ul className="flex max-h-[450px] flex-col gap-4 overflow-y-scroll">
        <li className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">Job Completed</div>
        </li>
      </ul>
    </div>
  );
};
