"use client";

import { createBoard } from "@/actions/create-board";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { X } from "lucide-react";
import React from "react";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "center" | "start" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    void execute({ title });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Create board
        </div>
        <PopoverClose asChild>
          <Button
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form className="space-y-4" action={onSubmit}>
          <div className="space-y-4">
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
