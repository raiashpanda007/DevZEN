"use client";

import { useEffect, useState } from "react";
import ChatInput from "./components/ChatInput";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useParams } from "next/navigation";
import Message from "./components/Message";
interface ChatSectionProps {
  isSidebarOpen: boolean;
}
function ChatSection({ isSidebarOpen }: ChatSectionProps) {
  const [chatId, setChatId] = useState<string>("");
  const { chatid } = useParams();
  useEffect(() => {
    if (!chatid || !chatid[0]) {
      setChatId("");
      return;
    }
    setChatId(chatid[0] as string);
  }, [chatid]);
  return (
    <div
      className={
        isSidebarOpen
          ? `w-3/4 h-full border  flex flex-col`
          : `w-full h-full border  flex flex-col`
      }
    >
      {chatId ? (
        <ScrollArea className="w-full h-5/6 flex flex-col gap-2">
        </ScrollArea>
      ) : (
        <ScrollArea className="w-full h-5/6 flex flex-col items-center justify-center p-6 gap-6 overflow-auto">
          <header className="text-center">
            <h1 className="text-4xl font-extrabold m-2 font-mono">
              🚀 Welcome to <span className="text-[#F26307]">DevZEN</span>
            </h1>
            <p className="text-2xl font-semibold text-gray-600">
              Your all-in-one cloud IDE + AI coding partner.
            </p>
          </header>

          <section className="w-full max-w-4xl flex justify-evenly mt-4">
            <div className="bg-white rounded-lg w-1/3 shadow-sm p-4 flex flex-col items-start">
              <div className="text-2xl">🆕</div>
              <h3 className="mt-2 font-bold dark:text-gray-600">
                Create a Project
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Click "Create Project" on the right and spin up a fresh
                workspace.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 w-1/3 flex flex-col items-start">
              <div className="text-2xl">💬</div>
              <h3 className="mt-2 font-bold dark:text-gray-600">
                Start a Chat
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Hit the "+" icon to create a new chat session and keep context
                per project.
              </p>
            </div>
          </section>
          <h3 className="text-center my-3">
            Meet{" "}
            <span className="text-[#F26307] font-bold text-2xl">Ashna</span>{" "}
            Your AI assistant that adapts to how you code.
          </h3>

          <section className="w-full max-w-4xl mt-4">
            <h4 className="font-bold mb-3">💡 What Makes Ashna Special</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-[#fff8f0] to-[#fff1e6] border border-[#F6C79A] shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#FEEBD3] ring-1 ring-[#F6C79A] flex items-center justify-center text-2xl">
                  🛠
                </div>
                <div>
                  <h5 className="font-semibold text-[#C15A00]">Edit Mode</h5>
                  <p className="text-sm text-[#5b5b5b] mt-1">
                    Make multi-file edits, add or remove small features, and fix
                    bugs across your codebase — all in one go, without noisy
                    inline suggestions. Ashna keeps it focused and safe.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-[#f7fff6] to-[#ecfff0] border border-[#BBEFD6] shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#ecfdf5] ring-1 ring-[#9AE6B4] flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h5 className="font-semibold text-[#0f7a50]">Agent Mode</h5>
                  <p className="text-sm text-[#5b5b5b] mt-1">
                    Autonomously scaffold features, run tasks, and wire things
                    up end-to-end — let Ashna handle repetitive work while you
                    oversee the design.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl p-4 bg-gradient-to-br from-[#fff9f4] to-[#fff6ea] border border-[#FDE2A8] shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#fff7ed] ring-1 ring-[#F6C79A] flex items-center justify-center text-2xl">
                  🧐
                </div>
                <div>
                  <h5 className="font-semibold text-[#A04A07]">Review Mode</h5>
                  <p className="text-sm text-[#5b5b5b] mt-1">
                    In-depth explanations, code quality checks, and actionable
                    improvement notes — clear, non-technical summaries plus
                    concrete next steps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="w-full max-w-4xl mt-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-300 p-4 rounded">
              <p className="text-sm text-black opacity-75">
                <strong>💬 Pro Tip:</strong> Keep your chat focused on one
                project at a time — Ashna learns context as you go, so the more
                focused your session, the smarter the suggestions.
              </p>
            </div>
          </aside>

          <section className="w-full max-w-4xl mt-4">
            <h4 className="font-bold mb-2">⚡ Why DevZEN?</h4>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
              <li>
                <strong>Real-Time Collaboration</strong> – Share sessions and
                work together live.
              </li>
              <li>
                <strong>Context-Aware AI</strong> – Ashna doesn’t just answer;
                she understands your codebase.
              </li>
              <li>
                <strong>Simple & Fast</strong> – Zero setup, just code and ship.
              </li>
            </ul>
          </section>
        </ScrollArea>
      )}

      <ChatInput isDisabled={!chatId} />
    </div>
  );
}

export default ChatSection;
