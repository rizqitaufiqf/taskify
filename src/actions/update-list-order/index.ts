"use server";

import { UpdateListOrderSchema } from "@/actions/update-list-order/schema";
import { InputType, ReturnType } from "@/actions/update-list-order/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { List } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { items, boardId } = data;
  let lists: List[];

  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
        },
        data: {
          position: list.position,
        },
      }),
    );

    lists = await db.$transaction(transaction);
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to reorder list.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: lists };
};
export const updateListOrder = createSafeAction(UpdateListOrderSchema, handler);
