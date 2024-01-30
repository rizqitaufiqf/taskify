import { BoardList } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/board-list";
import { Info } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";
import { Suspense } from "react";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="mb-20 w-full">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
