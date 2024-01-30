"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

interface InfoProps {
  isPro: boolean;
}

export const Info = ({ isPro }: InfoProps) => {
  const { organization, isLoaded } = useOrganization();
  const toastInfo: null | Record<string, any> =
    useReadLocalStorage("toast-info");
  const [toastInfoLS, setToastInfoLS] = useLocalStorage<Record<string, any>>(
    "toast-info",
    toastInfo ?? {},
  );

  //show toast if there is any toast-info data in local storage
  useEffect(() => {
    if (toastInfoLS && (toastInfoLS.success || toastInfoLS.error)) {
      if (toastInfoLS.success) {
        toast.success(toastInfoLS.success);
      }
      if (toastInfoLS.error) {
        toast.error(toastInfoLS.error);
      }
      setToastInfoLS((prevToastInfoLS: Record<string, any>) => {
        if (Object.keys(prevToastInfoLS).length > 0) {
          return {};
        }
        return prevToastInfoLS;
      });
    }
  }, [toastInfoLS, setToastInfoLS]);

  if (!isLoaded) return <Info.Skeleton />;

  return (
    <div className="flex items-center gap-x-4">
      <div className="relative h-[60px] w-[60px]">
        <Image
          src={organization!.imageUrl}
          alt="organization"
          className="rounded-md object-cover"
          fill
        />
      </div>
      <div className="space-y-1">
        <p className="text-xl font-semibold">{organization!.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="mr-1 h-4 w-4" /> {isPro ? "Pro" : "Free"}
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-3">
      <div className="relative h-[60px] w-[60px]">
        <Skeleton className="absolute h-full w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center">
          <Skeleton className="mr-2 h-4 w-4" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  );
};
