import { ActivityList } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/activity-list";
import { Info } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";
import { Suspense } from "react";

const ActivityPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
