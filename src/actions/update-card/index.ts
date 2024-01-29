"use server";

import { UpdateCardSchema } from "@/actions/update-card/schema";
import { InputType, ReturnType } from "@/actions/update-card/types";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ACTION, Card, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId, ...values } = data;
  let card: Card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        ...values,
      },
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to update board.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};
export const updateCard = createSafeAction(UpdateCardSchema, handler);
