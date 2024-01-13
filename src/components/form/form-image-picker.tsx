"use client";

import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

interface FormImagePickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormImagePicker = ({}: FormImagePickerProps) => {
  const random = Math.floor(Math.random() * defaultImages.length);
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>(
    defaultImages[random],
  );
  const [isLoading, setIsLoading] = useState(true);
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectImageId, setSelectImageId] = useState(null);

  useEffect(() => {
    return () => {
      const fetchImage = async () => {
        try {
          const result = await unsplash.photos.getRandom({
            collectionIds: ["317099"],
            count: 9,
          });

          if (result && result.response) {
            const resultImages = result.response as Array<Record<string, any>>;
            setImages(resultImages);
          } else {
            console.log("Failed to fetch images");
          }
        } catch (e) {
          console.log(e);
          setImages(defaultImages[random]);
        } finally {
          setIsLoading(false);
        }
      };

      void fetchImage();
    };
  }, [random]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-2 grid grid-cols-3 gap-2">
        {images?.map((image) => (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-video cursor-pointer bg-muted transition hover:opacity-75",
              pending && "cursor-auto opacity-50 hover:opacity-50",
            )}
            onClick={() => {
              if (pending) return;
              setSelectImageId(image.id);
            }}
          >
            <Image
              src={image.urls.thumb}
              alt="unsplash image"
              className="rounded-sm object-cover"
              fill
            />
          </div>
        ))}
      </div>
    </div>
  );
};
