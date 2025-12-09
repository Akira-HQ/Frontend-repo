"use client";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import Button from "../Button";
import { BsChatDots } from "react-icons/bs";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-2xl py-2 text-2xl"
      >
        <BsChatDots size={32} />
      </Button>
    </div>
  );
};

export default ChatWidget;
