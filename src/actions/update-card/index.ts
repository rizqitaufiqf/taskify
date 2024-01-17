"use server";

import { UpdateCardSchema } from "@/actions/update-card/schema";
import { InputType, ReturnType } from "@/actions/update-card/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";
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
