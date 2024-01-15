"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

interface BoardOptionProps {
  id: string;
}

export const BoardOption = ({ id }: BoardOptionProps) => {
  const { orgId } = useAuth();
  const router = useRouter();
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ToastInfo, setToastInfo] = useLocalStorage<Record<string, any>>(
    "toast-info",
    {},
  );

  const { execute, isLoading } = useAction(deleteBoard, {
    onSuccess: (data) => {
      setToastInfo({
        success: `Board "${data.title}" deleted successfully.`,
      });
      router.push(`/organization/${orgId}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = () => {
    void execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
