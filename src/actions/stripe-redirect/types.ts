import { StripeRedirectSchema } from "@/actions/stripe-redirect/schema";
import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export type InputType = z.infer<typeof StripeRedirectSchema>;
export type ReturnType = ActionState<InputType, string>;
