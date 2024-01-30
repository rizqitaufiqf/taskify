"use server";

import { DeleteBoardSchema } from "@/actions/delete-board/schema";
import { InputType, ReturnType } from "@/actions/delete-board/types";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { ACTION, Board, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id } = data;

  const isPro = await checkSubscription();

  let deletedData: Board;

  try {
    deletedData = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    !isPro && (await decreaseAvailableCount());

    await createAuditLog({
      entityTitle: deletedData.title,
      entityId: deletedData.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to delete board.",
    };
  }

  // revalidatePath(`/organization/${orgId}`);
  // redirect(`/organization/${orgId}`);
  return { data: deletedData };
};

export const deleteBoard = createSafeAction(DeleteBoardSchema, handler);
