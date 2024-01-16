import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created successfully.`);
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") disableEditing();
    };
    useOnClickOutside(formRef, () => disableEditing());
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e,
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      void execute({ title, listId, boardId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 space-y-4 px-1 py-0.5"
        >
          <FormTextarea
            ref={ref}
            id="title"
            onKeyDown={onTextareaKeyDown}
            errors={fieldErrors}
            placeholder="Enter a title for this card..."
          />
          <input hidden id="listId" value={listId} name="listId" />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} variant="ghost" size="sm">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="px-2 pt-2">
        <Button
          onClick={enableEditing}
          className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground"
          variant="ghost"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add a Card
        </Button>
      </div>
    );
  },
);

CardForm.displayName = "CardForm";
