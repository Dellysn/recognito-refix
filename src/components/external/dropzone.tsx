/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/helpers";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export const Dropzone = ({ onDrop }: DropzoneProps) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-4",
        isDragActive ? "bg-gray-100" : "bg-white",
        isDragAccept ? "border-green-400" : "",
        isDragReject ? "border-red-400" : "",
        isFocused ? "ring-2 ring-blue-400" : ""
      )}
    >
      <input {...getInputProps()} />
      <p className="text-base">Drag and drop your files here</p>
      <p className="text-sm text-gray-400">or</p>
      <button className="text-sm text-gray-400">Browse</button>
    </div>
  );
};
