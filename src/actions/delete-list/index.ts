"use server";

import { DeleteListSchema } from "@/actions/delete-list/schema";
import { InputType, ReturnType } from "@/actions/delete-list/types";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE, List } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId } = data;

  let deletedList: List;

  try {
    deletedList = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });

    await createAuditLog({
      entityTitle: deletedList.title,
      entityId: deletedList.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to delete list.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: deletedList };
};

export const deleteList = createSafeAction(DeleteListSchema, handler);
