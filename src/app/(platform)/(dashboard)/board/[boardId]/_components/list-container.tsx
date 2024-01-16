"use client";

import { ListForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import { ListItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";
import { ListWithCards } from "@/utils/types/list-with-cards.type";
import { useEffect, useState } from "react";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex h-full gap-x-3">
      {orderedData.map((list, index) => (
        <ListItem data={list} key={list.id} index={index} />
      ))}
      <ListForm />
      <div className="flex w-1 shrink-0" />;
    </ol>
  );
};
