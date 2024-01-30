"use server";

import { CreateListSchema } from "@/actions/create-list/schema";
import { InputType, ReturnType } from "@/actions/create-list/types";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE, List } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, boardId } = data;
  let list: List;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });
    if (!board) return { error: "Board not found" };

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = lastList ? lastList.position + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        boardId,
        position: newPosition,
      },
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to create list.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const createList = createSafeAction(CreateListSchema, handler);
