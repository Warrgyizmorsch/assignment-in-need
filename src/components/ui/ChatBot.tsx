"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  isHtml?: boolean;
  hasDropdown?: boolean;
  dropdownSelected?: boolean;
  dropdownValue?: string;
}

const API_BASE = "https://love14-ain-chatbot.hf.space/api";
const WS_BASE = "wss://love14-ain-chatbot.hf.space/api/ws/chat";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isDanielTyping, setIsDanielTyping] = useState(false);

  const [sessionId, setSessionId] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const pendingBotQueueRef = useRef<string[]>([]);
  const isBotProcessingQueueRef = useRef<boolean>(false);
  const isUserTypingRef = useRef<boolean>(false);
  const userTypingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingSignalSentRef = useRef<boolean>(false);

  // Scroll to bottom of message list
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAdminTyping, isDanielTyping, scrollToBottom]);

  // Dropdown detection helper
  const isServicePrompt = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes("what type of service") ||
      lower.includes("service type") ||
      lower.includes("academic service")
    );
  };

  // Convert markdown links [text](url) to HTML <a>
  const parseLinks = (text: string) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    return text.replace(
      linkRegex,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #6a11cb; font-weight: 600; text-decoration: underline;">$1</a>'
    );
  };

  // Queue Processor
  const processBotQueue = useCallback(() => {
    if (
      isUserTypingRef.current ||
      pendingBotQueueRef.current.length === 0 ||
      isBotProcessingQueueRef.current
    ) {
      return;
    }

    isBotProcessingQueueRef.current = true;
    const rawText = pendingBotQueueRef.current.shift() || "";

    setIsDanielTyping(false);
    setIsAdminTyping(false);

    const hasLinks = /\[(.*?)\]\((.*?)\)/.test(rawText) || rawText.includes("<a href=");
    const formattedText = hasLinks ? parseLinks(rawText) : rawText;
    const isDropdownMsg = isServicePrompt(rawText);

    if (hasLinks) {
      // Instant render for links/HTML
      const newMsgId = `bot_${Date.now()}_${Math.random()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId,
          sender: "bot",
          text: formattedText,
          isHtml: true,
          hasDropdown: isDropdownMsg,
        },
      ]);

      isBotProcessingQueueRef.current = false;
      setTimeout(() => processBotQueue(), 300);
    } else {
      // Typewriter animation character by character
      const newMsgId = `bot_${Date.now()}_${Math.random()}`;
      let currentLength = 0;

      // Add empty message placeholder
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId,
          sender: "bot",
          text: "",
          isHtml: false,
          hasDropdown: false,
        },
      ]);

      const interval = setInterval(() => {
        currentLength++;
        if (currentLength <= rawText.length) {
          const sliceText = rawText.slice(0, currentLength);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMsgId ? { ...msg, text: sliceText } : msg
            )
          );
        } else {
          clearInterval(interval);
          // Update with final dropdown flag if needed
          if (isDropdownMsg) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === newMsgId ? { ...msg, hasDropdown: true } : msg
              )
            );
          }
          isBotProcessingQueueRef.current = false;
          setTimeout(() => processBotQueue(), 300);
        }
      }, 50);
    }
  }, []);

  // Connect WebSocket
  const connectWebSocket = useCallback((session: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_BASE}/${session}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("ChatBot WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "admin_typing") {
          setIsAdminTyping(!!data.is_typing);
          return;
        }
      } catch {
        // Not a JSON signal, standard string message from bot
      }

      pendingBotQueueRef.current.push(event.data);
      processBotQueue();
    };

    ws.onclose = () => {
      console.log("ChatBot WebSocket disconnected. Reconnecting in 3s...");
      setTimeout(() => {
        if (session) {
          connectWebSocket(session);
        }
      }, 3000);
    };

    ws.onerror = (err) => {
      console.warn("ChatBot WebSocket notification:", err);
    };
  }, [processBotQueue]);

  // Load chat history from backend
  const loadHistory = useCallback(async (session: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/chats/${session}`);
      if (res.ok) {
        const history = await res.json();
        if (Array.isArray(history) && history.length > 0) {
          const formattedHistory: ChatMessage[] = [];
          history.forEach((m: { sender?: string; message?: string }) => {
            if (!m.message) return;
            if (
              m.message.includes('"type":') &&
              (m.message.includes('"admin_typing"') || m.message.includes('"typing"'))
            ) {
              return;
            }

            const isUser = !!(
              m.sender && m.sender.toLowerCase().includes("user")
            );
            formattedHistory.push({
              id: `hist_${Math.random()}`,
              sender: isUser ? "user" : "bot",
              text: m.message,
              isHtml: m.message.includes("<a ") || m.message.includes("http"),
              hasDropdown: !isUser && isServicePrompt(m.message),
            });
          });

          if (formattedHistory.length > 0) {
            setMessages(formattedHistory);
          }
        }
      }
    } catch {
      console.log("No chat history found");
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let activeSession = localStorage.getItem("ain_chat_session");
    if (!activeSession) {
      activeSession = "user_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("ain_chat_session", activeSession);
    }
    setSessionId(activeSession);

    // Initial greeting default if no history
    setMessages([
      {
        id: "initial_welcome",
        sender: "bot",
        text: "Hi there! 👋 I'm Daniel. How can I help you today?",
      },
    ]);

    loadHistory(activeSession);
    connectWebSocket(activeSession);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket, loadHistory]);

  // Handle Input Changes & User Typing Signals
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    isUserTypingRef.current = true;

    if (!isTypingSignalSentRef.current) {
      isTypingSignalSentRef.current = true;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "typing", is_typing: true }));
      }
    }

    if (userTypingTimerRef.current) {
      clearTimeout(userTypingTimerRef.current);
    }

    userTypingTimerRef.current = setTimeout(() => {
      isUserTypingRef.current = false;
      isTypingSignalSentRef.current = false;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "typing", is_typing: false }));
      }
      processBotQueue();
    }, 2000);
  };

  // Send Message
  const sendMessage = (textToSend?: string) => {
    const msg = (textToSend || inputText).trim();
    if (!msg) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert("Reconnecting to server... Please try sending again in a moment.");
      return;
    }

    isUserTypingRef.current = false;
    if (userTypingTimerRef.current) {
      clearTimeout(userTypingTimerRef.current);
    }

    if (isTypingSignalSentRef.current) {
      isTypingSignalSentRef.current = false;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "typing", is_typing: false }));
      }
    }

    // Add user message to UI
    const userMsgObj: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: msg,
    };
    setMessages((prev) => [...prev, userMsgObj]);

    // Send to WS
    wsRef.current.send(msg);

    if (!textToSend) {
      setInputText("");
    }

    // Show bot typing indicator
    setIsDanielTyping(true);

    processBotQueue();
  };

  // Dropdown Selection Handler
  const handleDropdownSelect = (msgId: string, val: string) => {
    if (!val) return;

    // Disable dropdown for this message
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, dropdownSelected: true, dropdownValue: val } : m
      )
    );

    sendMessage(val);
  };

  // Refresh Chat Session
  const refreshChat = () => {
    localStorage.removeItem("ain_chat_session");
    const newSession = "user_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("ain_chat_session", newSession);
    setSessionId(newSession);

    setMessages([
      {
        id: "initial_welcome_refresh",
        sender: "bot",
        text: "Hi there! 👋 I'm Daniel. How can I help you today?",
      },
    ]);

    pendingBotQueueRef.current = [];
    isBotProcessingQueueRef.current = false;

    connectWebSocket(newSession);
  };

  return (
    <div id="ain-chat-widget" className="fixed bottom-[25px] right-[25px] z-[9999] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div
          id="ain-chat-box"
          className="flex flex-col w-[350px] sm:w-[380px] h-[520px] sm:h-[550px] bg-[#f9faff] rounded-[20px] shadow-2xl overflow-hidden mb-5 border border-white/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div
            id="ain-chat-header"
            className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white p-4 flex justify-between items-center shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-xs relative">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  <path d="M18 13.5v2.5a3.5 3.5 0 0 1-3.5 3.5h-1" />
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-base leading-tight">Daniel</h3>
                <p className="text-[11px] opacity-80 font-normal">Academic Expert</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {/* Refresh icon */}
              <button
                onClick={refreshChat}
                title="Refresh Conversation"
                className="hover:scale-110 transition-transform text-white opacity-80 hover:opacity-100 p-1 focus:outline-none"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.75a9.25 9.25 0 1 0 4.737 17.197l.643-1.355A7.75 7.75 0 1 1 12 4.25v2.5L16 4 12 1.25v1.5z" />
                </svg>
              </button>
              {/* Close icon */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="hover:scale-110 transition-transform text-white opacity-80 hover:opacity-100 p-1 focus:outline-none"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            id="ain-chat-messages"
            className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 text-sm text-[#333]"
          >
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <div
                  className={`flex items-start gap-2 w-full ${msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-[28px] h-[28px] rounded-full flex-shrink-0 bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center shadow-xs">
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                        <path d="M18 13.5v2.5a3.5 3.5 0 0 1-3.5 3.5h-1" />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] p-3 px-4 text-sm leading-relaxed ${msg.sender === "user"
                        ? "bg-[#6a11cb] text-white rounded-[18px] rounded-br-[4px]"
                        : "bg-white text-[#333] rounded-[18px] rounded-bl-[4px] shadow-xs"
                      }`}
                  >
                    {msg.isHtml ? (
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-[28px] h-[28px] rounded-full flex-shrink-0 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex items-center justify-center shadow-xs">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Dropdown Options if bot prompt requires dropdown */}
                {msg.sender === "bot" && msg.hasDropdown && (
                  <div className="self-start w-[82%] ml-[36px] -mt-1">
                    <select
                      disabled={msg.dropdownSelected}
                      value={msg.dropdownValue || ""}
                      onChange={(e) => handleDropdownSelect(msg.id, e.target.value)}
                      className="w-full p-2 px-3 rounded-xl border border-[#6a11cb] text-sm text-[#333] bg-white outline-none cursor-pointer shadow-xs focus:border-[#2575fc] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>
                        Select service...
                      </option>
                      <option value="Assignment">Assignment</option>
                      <option value="Dissertation">Dissertation</option>
                      <option value="Essay">Essay</option>
                      <option value="SOP">SOP</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Admin / Bot Typing Indicators */}
            {isAdminTyping && (
              <div className="flex items-start gap-2 w-full justify-start">
                <div className="w-[28px] h-[28px] rounded-full flex-shrink-0 bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center shadow-xs">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    <path d="M18 13.5v2.5a3.5 3.5 0 0 1-3.5 3.5h-1" />
                  </svg>
                </div>
                <div className="bg-white text-[#333] text-sm italic p-3 px-4 rounded-[18px] rounded-bl-[4px] shadow-xs">
                  Agent is typing...
                </div>
              </div>
            )}

            {isDanielTyping && !isAdminTyping && (
              <div className="flex items-start gap-2 w-full justify-start">
                <div className="w-[28px] h-[28px] rounded-full flex-shrink-0 bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] text-white flex items-center justify-center shadow-xs">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    <path d="M18 13.5v2.5a3.5 3.5 0 0 1-3.5 3.5h-1" />
                  </svg>
                </div>
                <div className="bg-white text-[#333] text-sm italic p-3 px-4 rounded-[18px] rounded-bl-[4px] shadow-xs">
                  Daniel is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            id="ain-chat-input-area"
            className="flex p-3 px-4 bg-white border-t border-gray-100 items-center gap-2"
          >
            <input
              type="text"
              id="ain-chat-input"
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 p-2.5 px-4 bg-[#f4f7f6] border-none rounded-full outline-none text-sm text-[#333] placeholder-gray-400 focus:ring-2 focus:ring-[#6a11cb]/20"
            />
            <button
              id="ain-chat-send"
              onClick={() => sendMessage()}
              className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 shadow-xs focus:outline-none"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          id="ain-chat-bubble"
          onClick={() => setIsOpen(true)}
          className="w-[62px] h-[62px] rounded-full cursor-pointer shadow-xl hover:shadow-2xl border-2 border-white/90 bg-gradient-to-tr from-[#6a11cb] via-[#4d38df] to-[#2575fc] text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none relative group shadow-purple-600/30"
          aria-label="Open Live Chat"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-40 animate-ping group-hover:animate-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              <path d="M18 13.5v2.5a3.5 3.5 0 0 1-3.5 3.5h-1" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" />
          </div>
        </button>
      )}
    </div>
  );
}
