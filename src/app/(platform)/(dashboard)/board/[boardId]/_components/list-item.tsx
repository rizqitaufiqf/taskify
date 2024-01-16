import { CardForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-form";
import { CardItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-item";
import { ListHeader } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header";
import { cn } from "@/lib/utils";
import { ListWithCards } from "@/utils/types/list-with-cards.type";
import { ElementRef, useRef, useState } from "react";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListItem = ({ data, index }: ListItemProps) => {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader onAddCard={enableEditing} data={data} />
        <ol
          className={cn(
            "mx-1 flex flex-col gap-y-2 px-1 py-0.5",
            data.cards.length > 0 ? "mt-2" : "mt-0",
          )}
        >
          {data.cards.map((card, index) => (
            <CardItem index={index} data={card} key={card.id} />
          ))}
        </ol>
        <CardForm
          ref={textAreaRef}
          listId={data.id}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
          isEditing={isEditing}
        />
      </div>
    </li>
  );
};
