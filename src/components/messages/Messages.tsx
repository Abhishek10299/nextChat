"use client";

import React, { useEffect, useState, useCallback } from "react";
import Message from "./Message";
import { useSession } from "next-auth/react";
import axios from "axios";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import { getSocket } from "@/config/socket"; // Make sure path is correct

interface EncryptedMessage {
  _id: string;
  sender: string;
  receiver: string;
  contentEncrypted: string;
  nonce: string;
}

export default function Messages({
  receiverId,
  publicKey,
}: {
  receiverId: string;
  publicKey: string;
}) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<
    { id: string; text: string; isOwnMessage: boolean }[]
  >([]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.post("/api/chat/get-messages", { receiverId });
      const encryptedMessages: EncryptedMessage[] = res.data.messages;

      const keydata = localStorage.getItem("privateKeys");
      if (!keydata || !session?.user) return;

      const privateKey = util.decodeBase64(
        JSON.parse(keydata)[session.user.username!]
      );
      const theirPublicKey = util.decodeBase64(publicKey);
      const sharedKey = nacl.box.before(theirPublicKey, privateKey);

      const decrypted = encryptedMessages.map((msg) => {
        const nonce = util.decodeBase64(msg.nonce);
        const encrypted = util.decodeBase64(msg.contentEncrypted);
        const decryptedMessage = nacl.box.open.after(
          encrypted,
          nonce,
          sharedKey
        );
        const text = decryptedMessage
          ? util.encodeUTF8(decryptedMessage)
          : "[Decryption failed]";
        return {
          id: msg._id,
          text,
          isOwnMessage: msg.sender === session.user._id,
        };
      });

      setMessages(decrypted);
    } catch (error) {
      console.error("Failed to fetch or decrypt messages:", error);
    }
  }, [receiverId, publicKey, session]);

  useEffect(() => {
    fetchMessages();

    const socket = getSocket();
    socket.connect();

    const handleNewMessage = ({ to, from }: { to: string; from: string }) => {
      const currentUserId = (session?.user as any)?._id;
      if (!currentUserId) return;

      if (
        (to === currentUserId && from === receiverId) ||
        (from === currentUserId && to === receiverId)
      ) {
        fetchMessages();
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [fetchMessages, receiverId, session]);

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
      {messages.map((msg) => (
        <Message key={msg.id} text={msg.text} isOwnMessage={msg.isOwnMessage} />
      ))}
    </div>
  );
}
