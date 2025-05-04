import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.string(),
  message: z.string(),
  nonce: z.string(),
});
