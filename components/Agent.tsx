"use client";

import Image from "next/image";
import React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}
const Agent = ({
  userId,
  userName,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const [isSpeacking, setIsSpeaking] = useState(false);
  const [currentCallStatus, setCurrentCallStatus] = useState<callStatus>(
    CallStatus.INACTIVE
  );
  const [messages, setMessages] = useState([]);
  const lastMessage = messages[messages.length - 1];
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avater.png"
              alt="Vapi Avatar"
              width={65}
              height={54}
              className="avatar-image"
            />
            {isSpeacking && <span className="animate-speak" />}
          </div>
          <h3>Ai interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/use-avatar.png"
              alt="User Avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-center w-full">
        {currentCallStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                currentCallStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span>
              {currentCallStatus === CallStatus.INACTIVE ||
              currentCallStatus === CallStatus.FINISHED
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
