"use server";

import { UpdateCardOrderSchema } from "@/actions/update-card-order/schema";
import { InputType, ReturnType } from "@/actions/update-card-order/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { items, boardId } = data;
  let cards: Card[];

  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          position: card.position,
          listId: card.listId,
        },
      }),
    );

    cards = await db.$transaction(transaction);
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to reorder card.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: cards };
};
export const updateCardOrder = createSafeAction(UpdateCardOrderSchema, handler);
