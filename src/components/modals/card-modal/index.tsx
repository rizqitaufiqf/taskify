"use client";

import { CardModalHeader } from "@/components/modals/card-modal/header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/utils/types/list-with-cards.type";
import { useQuery } from "@tanstack/react-query";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOpen = useCardModal((state) => state.onOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? (
          <CardModalHeader.Skeleton />
        ) : (
          <CardModalHeader data={cardData} />
        )}
      </DialogContent>
    </Dialog>
  );
};
