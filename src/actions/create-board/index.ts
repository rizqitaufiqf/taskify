"use server";

import { CreateBoardSchema } from "@/actions/create-board/schema";
import { InputType, ReturnType } from "@/actions/create-board/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  if (!userId)
    return {
      error: "Unauthorized",
    };

  const { title } = data;
  let board: Board;

  try {
    board = await db.board.create({
      data: {
        title,
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Internal Server Error",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);
