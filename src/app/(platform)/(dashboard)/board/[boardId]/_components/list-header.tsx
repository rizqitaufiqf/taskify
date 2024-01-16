import { updateList } from "@/actions/update-list";
import { ListOption } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-option";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`list "${data.title}" updated successfully.`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) disableEditing();

    void execute({ title, id, boardId });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") formRef.current?.requestSubmit();
  };
  useEventListener("keydown", onKeyDown);

  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form className="flex-1 px-[2px]" ref={formRef} action={handleSubmit}>
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormInput
            id="title"
            ref={inputRef}
            placeholder="Enter list title.."
            defaultValue={title}
            onBlur={onBlur}
            className="h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition hover:border-input focus:border-input focus:bg-white"
          />
          <button type="submit" hidden></button>
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium"
        >
          {title}
        </div>
      )}
      <ListOption data={data} onAddCard={onAddCard} />
    </div>
  );
};
