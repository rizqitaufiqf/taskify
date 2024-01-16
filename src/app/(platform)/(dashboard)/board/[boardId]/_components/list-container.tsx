"use client";

import { ListForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import { ListWithCards } from "@/utils/types/list-with-cards.type";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      <div className="flex w-1 shrink-0" />;
    </ol>
  );
};
