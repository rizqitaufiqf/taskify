"use client";

import { FormErrors } from "@/components/form/form-errors";
import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

interface FormImagePickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormImagePicker = ({ id, errors }: FormImagePickerProps) => {
  const random = Math.floor(Math.random() * defaultImages.length);
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>(
    defaultImages[random],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectImageId, setSelectImageId] = useState(null);

  useEffect(() => {
    return () => {
      const fetchImage = async () => {
        try {
          // NOTE: comment code below for dev, to make not request to Unsplash
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
          // End of comment
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
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="unsplash image"
              className="rounded-sm object-cover"
              fill
            />
            {selectImageId === image.id && (
              <div className="absolute inset-y-0 flex h-full w-full items-center justify-center bg-black/30">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="absolute bottom-0 w-full truncate bg-black/50 p-1 text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
