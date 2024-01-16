"use client";

import { ListHeader } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header";
import { ListWithCards } from "@/utils/types/list-with-cards.type";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListItem = ({ data, index }: ListItemProps) => {
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader data={data} />
      </div>
    </li>
  );
};
