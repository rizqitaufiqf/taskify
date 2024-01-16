import { CopyListSchema } from "@/actions/copy-list/schema";
import { ActionState } from "@/lib/create-safe-action";
import { List } from "@prisma/client";
import { z } from "zod";

export type InputType = z.infer<typeof CopyListSchema>;
export type ReturnType = ActionState<InputType, List>;
