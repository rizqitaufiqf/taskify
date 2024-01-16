import { CreateCardSchema } from "@/actions/create-card/schema";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";

export type InputType = z.infer<typeof CreateCardSchema>;
export type ReturnType = ActionState<InputType, Card>;
