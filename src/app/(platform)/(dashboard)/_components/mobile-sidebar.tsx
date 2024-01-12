"use client";

import { Sidebar } from "@/app/(platform)/(dashboard)/_components/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // const isOpen = useMobileSidebar((state) => state.isOpen);
  // const onOpen = useMobileSidebar((state) => state.onOpen);
  // const onClose = useMobileSidebar((state) => state.onClose);
  const { isOpen, onOpen, onClose } = useMobileSidebar();

  // this for handle hydration error (YT video 2:50:00) https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) return null;

  return (
    <>
      <Button
        onClick={onOpen}
        className="mr-2 block md:hidden"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-mobile-sidebar-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};
