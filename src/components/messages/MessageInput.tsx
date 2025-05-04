import { FormControl, FormItem, FormMessage } from "../ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Send } from "lucide-react";
import util from "tweetnacl-util";
import { User } from "next-auth";
import { toast } from "sonner";
import nacl from "tweetnacl";
import { z } from "zod";

import { sendMessageSchema } from "@/schema/sendMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessageInput({
  receiverId,
  publicKey,
}: {
  receiverId: string;
  publicKey: string;
}) {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const user: User = session?.user as User;
  const username = user?.username || "";

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { receiverId: "", message: "", nonce: "" },
  });

  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    setLoading(true);
    try {
      data.receiverId = receiverId;

      const keydata = localStorage.getItem("privateKeys");
      if (!keydata) throw new Error("Private key not found in localStorage");

      const parsedData = JSON.parse(keydata);
      const privateKey = util.decodeBase64(parsedData[username]);
      const therePublicKey = util.decodeBase64(publicKey);
      const sharedKey = nacl.box.before(therePublicKey, privateKey);

      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      const encrypted = nacl.box.after(
        util.decodeUTF8(data.message),
        nonce,
        sharedKey
      );
      data.message = util.encodeBase64(encrypted);
      const encodedNonce = util.encodeBase64(nonce);
      data.nonce = encodedNonce;

      const result = await axios.post("/api/chat/send-message", data);

      console.log(result.data);
      form.reset(); // clear input after sending
    } catch (error) {
      console.error("Error in sending message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Failed to send message.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2 border-t p-4"
      >
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1"
              {...form.register("message")}
              disabled={loading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button
          className="h-12 w-12"
          type="submit"
          variant="ghost"
          size="icon"
          disabled={loading}
        >
          <Send className="text-lg" />
        </Button>
      </form>
    </FormProvider>
  );
}
