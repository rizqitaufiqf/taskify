"use server";

import { UpdateListSchema } from "@/actions/update-list/schema";
import { InputType, ReturnType } from "@/actions/update-list/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { List } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, id, boardId } = data;
  let list: List;

  try {
    list = await db.list.update({
      data: {
        title,
      },
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to update list.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateListSchema, handler);
