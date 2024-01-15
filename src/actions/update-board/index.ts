"use server";

import { UpdateBoardSchema } from "@/actions/update-board/schema";
import { InputType, ReturnType } from "@/actions/update-board/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, id } = data;
  let board: Board;

  try {
    board = await db.board.update({
      data: {
        title,
      },
      where: {
        id,
        orgId,
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to update board.",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoardSchema, handler);
