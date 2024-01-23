"use server";

import { DeleteBoardSchema } from "@/actions/delete-board/schema";
import { InputType, ReturnType } from "@/actions/delete-board/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id } = data;

  let deletedData: Board;

  try {
    deletedData = await db.board.delete({
      where: {
        id,
        orgId,
      },
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
