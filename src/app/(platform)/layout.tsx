import { ModalProvider } from "@/components/providers/modal-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

const PlatformLayout = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider>
      <Toaster />
      <ModalProvider />
      {children}
    </ClerkProvider>
  );
};

export default PlatformLayout;
