"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Plus,
  X,
  Send,
  Mic,
  Paperclip,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Trash2,
  Clock,
  Heart,
  Zap,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeSymptomsAI } from "./actions";
import Link from "next/link";
import { HealixLogo } from "@/components/ui/HealixLogo";

const commonSymptoms = [
  "Fever", "Cough", "Headache", "Chest Pain", "Fatigue",
  "Nausea", "Shortness of Breath", "Sore Throat", "Dizziness",
];

type MessageType = "user" | "ai" | "thinking";
type ResultType = { action: string; service: string; type: "emergency" | "doctor" | "rest" };

interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  symptoms?: string[];
  result?: ResultType;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
}

const initialHistory: ChatSession[] = [
  {
    id: "s1",
    title: "Chest Pain & Fatigue",
    messages: [],
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "s2",
    title: "Fever + Sore Throat",
    messages: [],
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: "s3",
    title: "Recurring Headache",
    messages: [],
    timestamp: new Date(Date.now() - 259200000),
  },
];

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(d: Date) {
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000 / 60 / 60 / 24;
  if (diff < 1) return "Today";
  if (diff < 2) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function AICheckPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>(initialHistory);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const newChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setSelectedSymptoms([]);
    setInputValue("");
  };

  const loadSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setSelectedSymptoms([]);
  };

  const addSymptom = (sym: string) => {
    const trimmed = sym.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms((p) => [...p, trimmed]);
    }
    setInputValue("");
    setShowChips(false);
  };

  const removeSymptom = (sym: string) => {
    setSelectedSymptoms((p) => p.filter((s) => s !== sym));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addSymptom(inputValue.trim());
      } else if (selectedSymptoms.length > 0) {
        handleAnalyze();
      }
    }
    if (e.key === "Escape") setShowChips(false);
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 && !inputValue.trim()) return;

    const symptomsToAnalyze =
      inputValue.trim()
        ? [...selectedSymptoms, inputValue.trim()]
        : selectedSymptoms;

    if (symptomsToAnalyze.length === 0) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: `I'm experiencing: ${symptomsToAnalyze.join(", ")}`,
      symptoms: symptomsToAnalyze,
      timestamp: new Date(),
    };

    const thinkingMsg: ChatMessage = {
      id: Date.now().toString() + "-thinking",
      type: "thinking",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setSelectedSymptoms([]);
    setInputValue("");
    setAnalyzing(true);

    try {
      const response = await analyzeSymptomsAI(symptomsToAnalyze);
      const result = response?.result as ResultType | undefined;

      const aiMsg: ChatMessage = {
        id: Date.now().toString() + "-ai",
        type: "ai",
        content: result?.action || "I was unable to process your symptoms. Please try again.",
        result: result,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.type !== "thinking");
        const updated = [...filtered, aiMsg];
        // Persist session
        const sessionTitle = symptomsToAnalyze.slice(0, 2).join(" & ");
        if (activeSessionId) {
          setSessions((s) =>
            s.map((sess) =>
              sess.id === activeSessionId ? { ...sess, messages: updated } : sess
            )
          );
        } else {
          const newSession: ChatSession = {
            id: Date.now().toString(),
            title: sessionTitle,
            messages: updated,
            timestamp: new Date(),
          };
          setSessions((s) => [newSession, ...s]);
          setActiveSessionId(newSession.id);
        }
        return updated;
      });
    } catch {
      const errMsg: ChatMessage = {
        id: Date.now().toString() + "-err",
        type: "ai",
        content: "I couldn't reach the AI service. Please rest and consult a doctor if symptoms worsen.",
        result: { type: "rest", action: "Rest and consult a doctor.", service: "Home Care & Pharmacy" },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev.filter((m) => m.type !== "thinking"), errMsg]);
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((s) => s.filter((sess) => sess.id !== id));
    if (activeSessionId === id) newChat();
  };

  const isEmptyChat = messages.length === 0;

  return (
    <div className="ai-chat-root">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="ai-sidebar"
          >
            <div className="ai-sidebar-inner">
              {/* Logo + New Chat */}
              <div className="ai-sidebar-header">
                <Link href="/" className="ai-brand">
                <HealixLogo size={28} showRing={false} />
                <span className="ai-brand-name">Healix AI</span>
              </Link>
                <button onClick={newChat} className="ai-new-chat-btn" title="New chat">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button onClick={newChat} className="ai-new-chat-full">
                <MessageSquare className="h-4 w-4" />
                New Symptom Check
              </button>

              {/* History */}
              <div className="ai-history-label">Recent</div>
              <div className="ai-history-list">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => loadSession(sess)}
                    className={`ai-history-item ${activeSessionId === sess.id ? "active" : ""}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="ai-history-title">{sess.title}</span>
                    <span className="ai-history-date">{formatDate(sess.timestamp)}</span>
                    <button
                      onClick={(e) => deleteSession(sess.id, e)}
                      className="ai-history-del"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="ai-sidebar-footer">
                <div className="ai-user-row">
                  <div className="ai-user-avatar">H</div>
                  <div className="ai-user-info">
                    <p className="ai-user-name">Healix User</p>
                    <p className="ai-user-plan">Free Plan</p>
                  </div>
                  <MoreHorizontal className="h-4 w-4 opacity-40" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="ai-sidebar-toggle"
        style={{ left: sidebarOpen ? 268 : 12 }}
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Main Chat */}
      <main className="ai-main">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <div className="ai-model-badge">
              <Sparkles className="h-3 w-3" />
              Healix AI · Gemini
            </div>
          </div>
          <div className="ai-chat-header-right">
            <Link href="/" className="ai-back-link">← Back to Healix</Link>
          </div>
        </div>

        {/* Messages Area */}
        <div className="ai-messages-area">
          {isEmptyChat ? (
            <div className="ai-welcome">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="ai-welcome-logo"
              >
                <HealixLogo size={64} />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ai-welcome-title"
              >
                How can I help you today?
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="ai-welcome-sub"
              >
                Describe your symptoms and I&apos;ll provide an AI-powered health assessment.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="ai-suggestion-grid"
              >
                {[
                  { icon: <Heart className="h-4 w-4" />, text: "I have chest pain and fatigue" },
                  { icon: <Activity className="h-4 w-4" />, text: "Fever and sore throat since yesterday" },
                  { icon: <Zap className="h-4 w-4" />, text: "Severe headache with dizziness" },
                  { icon: <Clock className="h-4 w-4" />, text: "Persistent cough for 3 days" },
                ].map((s) => (
                  <button
                    key={s.text}
                    onClick={() => {
                      setInputValue(s.text);
                      inputRef.current?.focus();
                    }}
                    className="ai-suggestion-card"
                  >
                    <span className="ai-suggestion-icon">{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="ai-messages-list">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`ai-message-row ${msg.type}`}
                  >
                    {msg.type !== "user" && (
                      <div className="ai-avatar">
                      <HealixLogo size={32} showRing={false} />
                    </div>
                    )}
                    <div className={`ai-bubble ${msg.type}`}>
                      {msg.type === "thinking" ? (
                        <div className="ai-typing">
                          <span /><span /><span />
                        </div>
                      ) : msg.type === "user" ? (
                        <div>
                          <p className="ai-bubble-text">{msg.content}</p>
                          {msg.symptoms && (
                            <div className="ai-symptom-pills">
                              {msg.symptoms.map((s) => (
                                <span key={s} className="ai-symptom-pill">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {msg.result && (
                            <div className={`ai-result-badge ${msg.result.type}`}>
                              {msg.result.type === "emergency" && <AlertTriangle className="h-4 w-4" />}
                              {msg.result.type === "doctor" && <Stethoscope className="h-4 w-4" />}
                              {msg.result.type === "rest" && <CheckCircle className="h-4 w-4" />}
                              <span>
                                {msg.result.type === "emergency" ? "Emergency" :
                                  msg.result.type === "doctor" ? "See a Doctor" : "Rest & Recover"}
                              </span>
                            </div>
                          )}
                          <p className="ai-bubble-text">{msg.content}</p>
                          {msg.result && (
                            <div className="ai-result-footer">
                              <span className="ai-result-service">
                                Recommended: <strong>{msg.result.service}</strong>
                              </span>
                              <div className="ai-result-actions">
                                {msg.result.type === "emergency" ? (
                                  <Link href="/shesecure" className="ai-action-btn danger">
                                    Emergency SOS →
                                  </Link>
                                ) : (
                                  <Link href="/care" className="ai-action-btn primary">
                                    Book {msg.result.service} →
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.type !== "thinking" && (
                        <p className="ai-timestamp">{formatTime(msg.timestamp)}</p>
                      )}
                    </div>
                    {msg.type === "user" && (
                      <div className="ai-avatar user">U</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="ai-input-area">
          {/* Selected symptoms chips */}
          <AnimatePresence>
            {selectedSymptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="ai-selected-chips"
              >
                {selectedSymptoms.map((s) => (
                  <span key={s} className="ai-chip">
                    {s}
                    <button onClick={() => removeSymptom(s)} className="ai-chip-remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Common symptoms dropdown */}
          <AnimatePresence>
            {showChips && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="ai-chips-panel"
              >
                <p className="ai-chips-label">Common symptoms</p>
                <div className="ai-chips-grid">
                  {commonSymptoms.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => addSymptom(sym)}
                      className={`ai-chip-btn ${selectedSymptoms.includes(sym) ? "active" : ""}`}
                    >
                      <Plus className="h-3 w-3" /> {sym}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Box */}
          <div className="ai-input-box">
            <button
              onClick={() => setShowChips((v) => !v)}
              className="ai-input-icon-btn"
              title="Browse symptoms"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedSymptoms.length > 0
                  ? "Add another symptom or press Enter to analyze…"
                  : "Describe your symptoms… (e.g. 'I have a fever and sore throat')"
              }
              className="ai-input-field"
              disabled={analyzing}
            />
            <button className="ai-input-icon-btn" title="Voice input">
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (selectedSymptoms.length === 0 && !inputValue.trim())}
              className="ai-send-btn"
              title="Analyze"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <p className="ai-disclaimer">
            Healix AI provides guidance only — not a substitute for professional medical advice.
          </p>
        </div>
      </main>
    </div>
  );
}
