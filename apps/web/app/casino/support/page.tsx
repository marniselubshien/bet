"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Headphones, Send, Paperclip, CheckCircle2, 
  HelpCircle, ShieldCheck, Clock, Check, Sparkles, RefreshCw, 
  X, MessageSquare, AlertCircle, FileText, ChevronRight
} from "lucide-react";

interface SupportMessage {
  id: string;
  sender: "agent" | "user" | "system";
  senderName?: string;
  text: string;
  time: string;
  attachment?: string;
  isQuickOption?: boolean;
}

const QUICK_TOPICS = [
  { id: "deposit", label: "💸 Deposit / UTR Issue", query: "My UPI deposit is not reflecting in my balance." },
  { id: "withdraw", label: "⚡ Withdrawal Status", query: "When will my UPI withdrawal be credited to my bank?" },
  { id: "bonus", label: "🎁 Claim Daily ₹100 Bonus", query: "How do I claim my daily VIP free money bonus?" },
  { id: "account", label: "🔐 2FA & Password Reset", query: "I need help updating my account security / 2FA." },
  { id: "fairness", label: "🎮 Provably Fair Verification", query: "How do I verify the SHA-256 hash of my previous round?" },
];

export default function SupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "m-1",
      sender: "system",
      text: "🔒 You are connected to 24/7 Encrypted Priority Support · Ticket #7X-8492",
      time: "Just now",
    },
    {
      id: "m-2",
      sender: "agent",
      senderName: "Priya (Senior Specialist)",
      text: "Hello! Welcome to 7X PASA Live Support. 👋 I'm Priya, your assigned account representative.",
      time: "Just now",
    },
    {
      id: "m-3",
      sender: "agent",
      senderName: "Priya (Senior Specialist)",
      text: "How can I assist you today? Feel free to tap one of the quick topics below or describe your issue directly.",
      time: "Just now",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAgentReply = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    if (q.includes("deposit") || q.includes("utr") || q.includes("paytm") || q.includes("gpay") || q.includes("phonepe") || q.includes("not reflecting")) {
      return "I can help verify your deposit immediately! Please reply with your 12-digit UTR / Transaction Reference Number from your UPI app receipt (or attach a screenshot). Our automated banking node verifies and credits accounts in under 2 minutes. 💳";
    }
    if (q.includes("withdraw") || q.includes("cashout") || q.includes("payout") || q.includes("bank")) {
      return "All UPI withdrawals are queued automatically through our high-speed banking gateways. Average payout time is 3 to 15 minutes. If your withdrawal is pending, please confirm your registered UPI ID and we will expedite the gateway queue! ⚡";
    }
    if (q.includes("bonus") || q.includes("free") || q.includes("faucet") || q.includes("rakeback") || q.includes("vip")) {
      return "You can claim your daily ₹100.00 refill directly in the Bonuses tab every 24 hours! Additionally, your account accumulates VIP Rakeback on every wager on Originals and Slots. Would you like me to check your eligible rakeback balance? 🎁";
    }
    if (q.includes("2fa") || q.includes("password") || q.includes("login") || q.includes("security") || q.includes("account")) {
      return "Account security is our top priority. For password reset or two-factor authentication adjustments, please ensure your registered email is verified. I can generate a secure one-time verification link for you. 🔐";
    }
    if (q.includes("fair") || q.includes("hash") || q.includes("provably") || q.includes("seed") || q.includes("rigged")) {
      return "All 7X PASA Originals (Dice, Mines, Limbo, Crash, Coinflip, Plinko) are 100% Provably Fair. Each outcome is deterministically derived from a combination of the server seed and your client seed via SHA-256 hashing. You can verify every round hash directly under 'Game History'. 🎯";
    }
    return "Thank you for providing the details! I have logged this with our senior technical desk. Let me pull up your account records right now. Could you also share your registered User ID (UID) or the relevant round/transaction ID?";
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text && !attachedFile) return;

    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: text || "Uploaded payment receipt verification slip.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment: attachedFile || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setAttachedFile(null);

    // Simulate Agent Typing and Response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyText = getAgentReply(text);
      const agentMsg: SupportMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "agent",
        senderName: "Priya (Senior Specialist)",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 850);
  };

  const handleAttachReceipt = () => {
    setAttachedFile("UTR_Payment_Slip_9381.png");
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "m-reset-1",
        sender: "system",
        text: "🔄 New Support Session Started · Ticket #7X-8493",
        time: "Just now",
      },
      {
        id: "m-reset-2",
        sender: "agent",
        senderName: "Priya (Senior Specialist)",
        text: "Hello! How can I assist you with your 7X PASA account?",
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="w-full flex flex-col pt-2 pb-6 px-3.5 select-none text-[#8F9BAC]">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#161E33]">
        <Link 
          href="/casino" 
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8F9BAC] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Casino</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFaqModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8F9BAC] hover:text-white text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>FAQs</span>
          </button>
          <button
            onClick={handleClearChat}
            className="p-1 rounded-lg bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#303E60] text-[#8F9BAC] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
            title="Start New Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Support Agent Hero Status Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#121729] to-[#0B0F1C] border border-[#1E2740] p-3.5 mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#0A0D18] flex items-center justify-center text-white">
                <Headphones className="w-5 h-5 text-[#C4B5FD]" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0F1C] shadow-[0_0_8px_#10B981]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold text-slate-100 tracking-tight">24/7 Live Support</h1>
              <span className="text-[9px] font-extrabold bg-[#7C3AED]/20 border border-[#7C3AED]/35 text-[#C4B5FD] px-1.5 py-0.2 rounded-full">
                VERIFIED
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#8F9BAC] mt-0.5">
              Priya · Senior VIP Specialist
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online Now · Avg. Reply &lt; 1 min</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-sans font-bold text-[#556585] bg-[#0A0D18] border border-[#1A2238] px-2 py-0.5 rounded-md">
            Ticket #8492
          </span>
          <span className="text-[9px] text-[#4E5C78]">Priority Desk</span>
        </div>
      </div>

      {/* Quick Help Topics Horizontal Bar */}
      <div className="mb-3">
        <div className="text-[10.5px] font-bold text-[#556585] uppercase tracking-wider mb-1.5 pl-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#A78BFA]" />
          <span>Quick Assistance Topics</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSend(topic.query)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#141928] to-[#0E121E] border border-[#1F273E] hover:border-[#384870] hover:text-white text-[11px] font-medium text-[#8F9BAC] whitespace-nowrap transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed Container */}
      <div className="rounded-2xl bg-[#090C16] border border-[#161E33] p-3 mb-3 flex flex-col gap-2.5 h-[370px] overflow-y-auto shadow-inner">
        {messages.map((m) => {
          if (m.sender === "system") {
            return (
              <div key={m.id} className="w-full my-1 flex justify-center">
                <span className="text-[10px] font-medium text-[#556585] bg-[#0D111E] border border-[#161E33] px-3 py-1 rounded-full text-center">
                  {m.text}
                </span>
              </div>
            );
          }

          const isUser = m.sender === "user";

          return (
            <div 
              key={m.id} 
              className={`flex flex-col max-w-[85%] text-xs ${
                isUser ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              {!isUser && (
                <div className="flex items-center gap-1.5 mb-1 pl-1">
                  <div className="w-4 h-4 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-[9px] text-[#C4B5FD] font-bold">
                    P
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">{m.senderName || "Support Specialist"}</span>
                  <span className="text-[9px] text-[#556585]">{m.time}</span>
                </div>
              )}

              <div 
                className={`p-3 rounded-2xl shadow-sm ${
                  isUser 
                    ? "bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] text-white rounded-tr-xs border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35)]" 
                    : "bg-gradient-to-b from-[#131728] to-[#0D101C] border border-[#1E2740] text-slate-100 rounded-tl-xs leading-relaxed"
                }`}
              >
                <p className="text-xs leading-relaxed">{m.text}</p>
                {m.attachment && (
                  <div className="mt-2 p-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2 text-[10px] text-emerald-300">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="font-sans">{m.attachment}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto" />
                  </div>
                )}
              </div>

              {isUser && (
                <span className="text-[9px] text-[#556585] mt-1 pr-1 font-sans">{m.time}</span>
              )}
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="mr-auto flex items-center gap-2 p-2 rounded-xl bg-[#131728] border border-[#1E2740] text-xs text-[#8F9BAC]">
            <div className="w-4 h-4 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-[9px] text-[#C4B5FD] font-bold">
              P
            </div>
            <span className="text-[11px] text-[#8F9BAC]">Priya is typing...</span>
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Pill (if selected) */}
      {attachedFile && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-[#131828] border border-[#7C3AED]/40 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <Paperclip className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span className="text-[11px] font-sans">{attachedFile}</span>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
          </div>
          <button 
            onClick={() => setAttachedFile(null)}
            className="text-[#64748B] hover:text-white bg-transparent border-none cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Support Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
        className="flex items-center gap-2 bg-[#0C101C] border border-[#1A2238] rounded-2xl p-1.5 shadow-md focus-within:border-[#7C3AED] transition-colors"
      >
        <button
          type="button"
          onClick={handleAttachReceipt}
          className="p-2 rounded-xl text-[#7E8B9F] hover:text-white hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
          title="Attach Deposit Receipt / UTR Slip"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your issue or paste 12-digit UTR..."
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-100 placeholder:text-[#556585]"
        />

        <button
          type="submit"
          className="p-2.5 rounded-xl bg-gradient-to-b from-[#7C3AED] to-[#5F27CD] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white border-t border-white/20 shadow-[0_2px_8px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 transition-all cursor-pointer border-none shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Alternative Support Channels */}
      <div className="mt-3 pt-3 border-t border-[#141A2B] flex items-center justify-between text-[10.5px]">
        <a 
          href="https://t.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#8F9BAC] hover:text-white transition-colors"
        >
          <span className="text-[#38BDF8]">✈️</span>
          <span>Telegram: <strong className="text-slate-200">@Pasa7xOfficial</strong></span>
        </a>
        <a 
          href="mailto:support@7xpasa.com" 
          className="flex items-center gap-1 text-[#8F9BAC] hover:text-white transition-colors"
        >
          <span>✉️</span>
          <span>support@7xpasa.com</span>
        </a>
      </div>

      {/* FAQs Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
          <div className="w-full max-w-[380px] bg-[#0E1220] border border-[#1C253B] rounded-2xl p-5 shadow-2xl relative">
            <button 
              onClick={() => setShowFaqModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#556585] hover:text-white cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Frequently Asked Questions</h3>
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
              <div className="p-2.5 rounded-xl bg-[#131728] border border-[#1E2740]">
                <p className="font-bold text-white mb-1">How fast are UPI withdrawals?</p>
                <p className="text-[11px] text-[#8F9BAC] leading-relaxed">
                  Automated within 3 to 15 minutes. Check that your UPI VPA handle is correct before submitting.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#131728] border border-[#1E2740]">
                <p className="font-bold text-white mb-1">Deposit deducted but not in game?</p>
                <p className="text-[11px] text-[#8F9BAC] leading-relaxed">
                  UPI banking gateways take 1-3 minutes. Paste your 12-digit UTR in this chat for immediate verification.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#131728] border border-[#1E2740]">
                <p className="font-bold text-white mb-1">Are games Provably Fair?</p>
                <p className="text-[11px] text-[#8F9BAC] leading-relaxed">
                  Yes, every bet outcome uses SHA-256 cryptographic seeds you can inspect in Game History.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFaqModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-b from-[#181D2E] to-[#101422] text-slate-200 hover:text-white border border-[#222A40] text-xs font-bold cursor-pointer"
            >
              Back to Support Chat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
