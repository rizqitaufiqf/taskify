import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";
import { HelpCircle, User2 } from "lucide-react";

export const BoardList = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center text-lg font-semibold text-neutral-700">
        <User2 className="mr-2 h-6 w-6" /> Your Board
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <FormPopover sideOffset={10} side="right">
          <div
            role="button"
            className="relative flex aspect-video h-full w-full flex-col items-center justify-center gap-y-1 rounded-sm bg-muted transition hover:opacity-75"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">5 remaining</span>
            <Hint
              description="Free Workspaces can have up to 5 boards. For unlimited boards, upgrade to a paid plan."
              sideOffset={40}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};
