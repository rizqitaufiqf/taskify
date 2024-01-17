"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";

export const CardModal = () => {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOpen = useCardModal((state) => state.onOpen);
  const onClose = useCardModal((state) => state.onClose);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>Modal</DialogContent>
    </Dialog>
  );
};
