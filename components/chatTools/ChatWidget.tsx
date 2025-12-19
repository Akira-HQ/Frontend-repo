"use client";
import React, { useState } from "react";
import Button from "../Button";
import { BsChatDots } from "react-icons/bs";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LandingChat } from "./ChatWindow";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && <LandingChat />}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-2xl py-2 text-2xl"
      >
        <IoChatbubbleOutline size={28} />
      </Button>
    </div>
  );
};

export default ChatWidget;
