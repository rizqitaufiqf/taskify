"use server";

import { CreateCardSchema } from "@/actions/create-card/schema";
import { InputType, ReturnType } from "@/actions/create-card/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Card } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, boardId, listId } = data;
  let card: Card;

  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });
    if (!list) return { error: "list not found" };

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const newPosition = lastCard ? lastCard.position + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        position: newPosition,
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to create card.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCardSchema, handler);
