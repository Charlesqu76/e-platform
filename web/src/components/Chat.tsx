import { Button, Input } from "antd";
import React, { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { useRetailer } from "@/store/r";
import Sales from "./sales";
import { getAiData } from "@/fetch/retailer";
import { useCommonStore } from "@/store";

const LoadingIndicator = () => (
  <div className="flex justify-start ">
    <div className="bg-gray-100 rounded-lg p-1">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  </div>
);

const ChatInterface = () => {
  const { loading, messages, open, chatId } = useRetailer((state) => state);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        behavior: behavior,
        top: messagesRef.current.scrollHeight,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      scrollToBottom("auto");
    }
  }, [open]);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 transition-all"
        ref={messagesRef}
      >
        {messages.map(({ isAi, content, isLoading }, index) => (
          <div
            key={index}
            className={`flex ${isAi ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-lg p-4 ${
                isAi ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white"
              }`}
            >
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <>
                  {content && (
                    <Markdown
                      components={{
                        code: ({ children, node }) => {
                          try {
                            const jData = JSON.parse(children as string);
                            const { predicts = [] } = jData || {};
                            return <Sales data={predicts} />;
                          } catch {
                            return <code>{children}</code>;
                          }
                        },
                      }}
                    >
                      {content}
                    </Markdown>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <ChatBottom />
    </div>
  );
};

const ChatBottom = () => {
  const {
    loading,
    inputMessage,
    setInputMessage,
    setMessages,
    replaceMessage,
    setLoading,
    chatId,
  } = useRetailer((state) => state);
  const { userInfo } = useCommonStore((state) => state);

  const clickSend = async () => {
    if (!inputMessage.trim()) return;
    setLoading(true);
    setInputMessage("");
    try {
      setMessages({ role: "User", isAi: false, content: inputMessage });
      setMessages({
        role: "AI Agen",
        isAi: true,
        isLoading: true,
      });
      await getAiData({
        params: {
          chatId: chatId,
          id: (userInfo?.id || 1).toString(),
          question: inputMessage,
        },
        cb: (text: string, done: boolean) => {
          replaceMessage({
            role: "AI Agent",
            isAi: true,
            content: text,
          });
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t p-1 bg-white">
      <div className="flex space-x-4 items-center">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <Button
          type="primary"
          disabled={loading || !inputMessage?.trim()}
          loading={loading}
          onClick={clickSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
