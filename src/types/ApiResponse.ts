import { IMessage } from "@/model/Chat";

export interface ApiResponse {
  success: boolean;
  message: string;
  messages?: Array<IMessage>;
}
