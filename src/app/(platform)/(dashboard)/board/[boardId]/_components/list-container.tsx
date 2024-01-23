"use client";

import { updateCardOrder } from "@/actions/update-card-order";
import { updateListOrder } from "@/actions/update-list-order";
import { ListForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import { ListItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/utils/types/list-with-cards.type";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  // Make a copy of the original array
  const result = [...list];
  // Remove an element from the original position
  const [removedElement] = result.splice(startIndex, 1);
  // Insert the removed element at the new position
  result.splice(endIndex, 0, removedElement);

  // Return the modified array
  return result;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("list reordered successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("card reordered successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // user move a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, position: index }),
      );

      setOrderedData(items);
      void executeUpdateListOrder({ items, boardId });
    }

    // user move a card
    if (type === "card") {
      const newOrderedData = [...orderedData];

      // source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId,
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId,
      );

      if (!sourceList || !destList) return;

      // check is cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check is cards exists on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      // moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );

        reorderCards.forEach((card, index) => (card.position = index));

        sourceList.cards = reorderCards;

        setOrderedData(newOrderedData);
        void executeUpdateCardOrder({ items: reorderCards, boardId });

        // user move a card from one list to another list
      } else {
        // remove card from the source list
        const [moveCard] = sourceList.cards.splice(source.index, 1);

        // assign the card to the destination list
        moveCard.listId = destination.droppableId;

        // add the card to the destination list
        destList.cards.splice(destination.index, 0, moveCard);

        sourceList.cards.forEach((card, index) => (card.position = index));

        // update the order for each card in the destination list
        destList.cards.forEach((card, index) => (card.position = index));

        setOrderedData(newOrderedData);
        void executeUpdateCardOrder({ items: destList.cards, boardId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-x-3"
          >
            {orderedData.map((list, index) => (
              <ListItem data={list} key={list.id} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex w-1 shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
