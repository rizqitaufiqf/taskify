"use server";

import { CopyCardSchema } from "@/actions/copy-card/schema";
import { InputType, ReturnType } from "@/actions/copy-card/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId } = data;

  let card: Card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) return { error: "Card not found" };

    const lastCard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId,
      },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = lastCard ? lastCard.position + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - copy`,
        description: cardToCopy.description,
        position: newPosition,
        listId: cardToCopy.listId,
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to copy card.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCardSchema, handler);
