import { Info } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import { SubscriptionButton } from "@/app/(platform)/(dashboard)/organization/[organizationId]/billing/_components/subscription-button";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";

const BillingPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <SubscriptionButton isPro={isPro} />
    </div>
  );
};

export default BillingPage;
