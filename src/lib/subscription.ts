import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

const DAY_IN_MS = 84_400_000;

export const checkSubscription = async (): Promise<boolean> => {
  const { orgId } = auth();
  if (!orgId) return false;

  const orgSubscription = await db.orgSubscription.findUnique({
    where: {
      orgId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd &&
    orgSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
};
