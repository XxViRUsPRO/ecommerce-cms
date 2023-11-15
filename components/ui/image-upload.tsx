"use client";

import React, { useState } from "react";

import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, Plus, Trash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

type Message = {
  severity: "error" | "info";
  msg: string;
};

const messageVariants = {
  error: "text-red-500",
  info: "text-muted-foreground",
};

interface ImageUploadProps {
  category: string;
  value: string[];
  disabled: boolean;
  max?: number;
  maxSize?: number;
  onClose: () => void;
  onChange: (urls: string[]) => void;
}

// todo: split value into urls and files and handle them separately
const ImageUpload: React.FC<ImageUploadProps> = ({
  category,
  value,
  disabled,
  max = 1,
  onClose,
  onChange,
}) => {
  const [images, setImages] = useState<(string | File)[]>(value);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<Message>();
  const [uploading, setUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  return (
    <div className="h-full w-full flex flex-col space-y-3">
      <Progress
        value={progress}
        className="fixed inset-x-0 bottom-0 h-4 rounded-none border-t-2 border-primary"
      />
      <div
        className={cn(
          "flex-1 grid gap-2 p-2 border border-muted-2 rounded-md overflow-y-auto auto-rows-max relative",
          max > 1 ? "grid-cols-3" : "grid-cols-1"
        )}
      >
        {images.map((img, i) => {
          let url = "";
          if (img instanceof File) {
            url = URL.createObjectURL(img);
          } else {
            url = img;
          }

          return (
            <div
              key={i}
              className={cn(
                "rounded-md border-2 border-muted hover:border-muted-foreground transition-colors h-32 overflow-hidden cursor-pointer relative group",
                max === 1 && "h-full border-0"
              )}
              onClick={() => {
                setImages(images.filter((_, j) => j !== i));
              }}
            >
              <div className="absolute inset-0 flex justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full h-full flex justify-center items-center backdrop-blur-sm bg-white bg-opacity-10">
                  <Trash className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          );
        })}
        {max > images.length && (
          <div
            className="flex justify-center items-center rounded-md border-2 border-muted hover:border-muted-foreground transition-colors h-32 cursor-pointer aria-disabled:text-muted"
            aria-disabled={disabled || uploading}
            onClick={() => {
              if (disabled || uploading) return;
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.multiple = max > 1;
              input.hidden = true;
              input.click();

              input.onchange = async (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (!files || files.length + images.length > max) {
                  setMessage({
                    severity: "error",
                    msg: `Maximum ${max} images allowed.`,
                  });
                  setTimeout(() => setMessage(undefined), 3000);
                  return;
                }
                setImages([...images, ...Array.from(files)]);
              };
            }}
          >
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex justify-end items-center space-x-2">
        <div
          className={cn(
            "flex-1 flex items-center space-x-2",
            messageVariants[message?.severity || "info"]
          )}
        >
          <Info />
          <span className="text-sm">
            {message?.msg || "Images will be uploaded upon confirmation."}
          </span>
        </div>
        <Button
          disabled={disabled || uploading}
          onClick={async (e) => {
            e.preventDefault();
            setUploading(true);
            let urls: string[] = [];
            let files: File[] = [];
            for (const img of images) {
              if (img instanceof File) {
                files.push(img);
              } else {
                urls.push(img);
              }
            }
            if (files.length > 0) {
              for (const file of files) {
                const res = await edgestore.publicFiles.upload({
                  file,
                  input: {
                    category,
                  },
                  options: {
                    temporary: true,
                  },
                  onProgressChange: (progress) => {
                    setProgress((prev) => prev + progress / files.length);
                  },
                });
                urls.push(res.url);
              }
              toast.success("Images uploaded");
            }
            setUploading(false);
            onChange(urls);
            onClose();
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
