import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, LanguageCode, ExamType, Question } from '../types';
import { locales } from '../locales';
import { MessageSquare, X, Send, Sparkles, AlertCircle, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface AIChatPanelProps {
  language: LanguageCode;
  currentExam: ExamType;
  username: string;
  onRecordPractice?: (exam: ExamType, subject: string, isCorrect: boolean) => void;
}

export default function AIChatPanel({ language, currentExam, username, onRecordPractice }: AIChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // For storing dynamic user responses to AI-generated questions in chat
  // Map of messageId -> chosenIndex
  const [answeredMap, setAnsweredMap] = useState<Record<string, { selectedIndex: number; isSubmitted: boolean }>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = locales[language] || locales.en;

  // Initialize with greeting if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_msg',
          role: 'model',
          content: t.aiChatHelpInitial,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [language, messages.length, t.aiChatHelpInitial]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    if (!customText) {
      setInputText('');
    }
    setErrorText(null);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build brief chat history for context
      const historyContext = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: historyContext,
          currentExam,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Server received non-successful response');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        content: data.reply || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPractice: data.suggestedPractice || undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Network anomaly. Cannot reach AI Studymates.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectOptionForGenerated = (messageId: string, index: number) => {
    setAnsweredMap(prev => ({
      ...prev,
      [messageId]: { ...(prev[messageId] || {}), selectedIndex: index, isSubmitted: false }
    }));
  };

  const submitOptionForGenerated = (messageId: string, question: Question) => {
    const answered = answeredMap[messageId];
    if (!answered || answered.selectedIndex === undefined) return;

    setAnsweredMap(prev => ({
      ...prev,
      [messageId]: { ...prev[messageId], isSubmitted: true }
    }));

    const isCorrect = answered.selectedIndex === question.correctIndex;
    if (onRecordPractice) {
      onRecordPractice(question.exam, question.subject, isCorrect);
    }
  };

  const quickSuggestionTriggers = [
    { label: t.chatQuickExplainCalc, query: "Explain the Derivative Power Rule in Calculus with a small step-by-step example." },
    { label: t.chatQuickIeltsWriting, query: "What are the key points to remember about tenses when describing trends in IELTS Writing Task 1 vs IELTS Writing Task 2?" },
    { label: t.chatQuickGivePractice, query: `Give me a mock practice question for ${currentExam} on a core syllabus topic.` }
  ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <motion.button
          id="chat-toggle-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 cursor-pointer transition-all border border-indigo-500/30"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="hidden md:inline text-sm font-semibold pr-1">{t.aiChatTitle}</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
        </motion.button>
      </div>

      {/* Floating Chat Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-pane-root"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[500px] h-[70vh] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {t.aiChatTitle}
                    <span className="text-[10px] bg-slate-700 text-indigo-300 font-mono px-1.5 py-0.5 rounded uppercase">
                      Gemini Online
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Syllabus Mentor for {currentExam}
                  </p>
                </div>
              </div>
              <button
                id="close-chat-btn"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
                aria-label="Close Chat Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions Chips bar */}
            {messages.length <= 1 && (
              <div className="bg-slate-800/50 p-3 border-b border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
                {quickSuggestionTriggers.map((chip, idx) => (
                  <button
                    key={idx}
                    id={`quick-chip-${idx}`}
                    onClick={() => handleSendMessage(chip.query)}
                    className="flex-shrink-0 bg-slate-800 border border-slate-700 hover:bg-indigo-950 hover:border-indigo-800 text-slate-300 hover:text-indigo-200 text-xs px-3 py-1.5 rounded-full transition cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
              {messages.map((msg) => {
                const isModel = msg.role === 'model';
                const hasPractice = msg.suggestedPractice;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isModel ? 'items-start' : 'items-end'} space-y-1.5`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 shadow-sm leading-relaxed whitespace-pre-line ${
                        isModel
                          ? 'bg-slate-800 text-slate-100 hover:bg-slate-800/90'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Rendering Dynamic AI-Generated practice task */}
                    {isModel && hasPractice && (
                      <div className="w-[95%] bg-slate-850 border border-slate-700 rounded-xl p-4 mt-2 mb-2 shadow space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                          <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                            {hasPractice.exam} • {hasPractice.subject}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Topic: {hasPractice.topic}
                          </span>
                        </div>

                        {hasPractice.passage && (
                          <div className="bg-slate-900/50 border-l-2 border-indigo-500 p-2.5 rounded text-xs text-slate-300 italic max-h-[120px] overflow-y-auto">
                            {hasPractice.passage}
                          </div>
                        )}

                        <p className="font-semibold text-xs leading-normal text-slate-100">
                          {hasPractice.text}
                        </p>

                        {/* MCQ options selection grid */}
                        <div className="space-y-1.5">
                          {hasPractice.options.map((opt, oIdx) => {
                            const ansInfo = answeredMap[msg.id];
                            const isChosen = ansInfo?.selectedIndex === oIdx;
                            const isSubmitted = ansInfo?.isSubmitted;
                            const isCorrectAnswer = oIdx === hasPractice.correctIndex;

                            let optStyle = 'border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300';
                            if (isChosen) {
                              optStyle = 'border-indigo-500 bg-indigo-950/45 text-white';
                            }
                            if (isSubmitted) {
                              if (isCorrectAnswer) {
                                optStyle = 'border-emerald-500 bg-emerald-950/20 text-emerald-200';
                              } else if (isChosen) {
                                optStyle = 'border-rose-500 bg-rose-950/20 text-rose-300';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isSubmitted}
                                onClick={() => selectOptionForGenerated(msg.id, oIdx)}
                                className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors flex items-start gap-2 ${optStyle}`}
                              >
                                <span className="bg-slate-900 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Submit validation bar */}
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Difficulty: {hasPractice.difficulty}
                          </span>

                          <AnimatePresence mode="wait">
                            {!answeredMap[msg.id]?.isSubmitted ? (
                              <button
                                disabled={answeredMap[msg.id]?.selectedIndex === undefined}
                                onClick={() => submitOptionForGenerated(msg.id, hasPractice)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-white transition cursor-pointer ${
                                  answeredMap[msg.id]?.selectedIndex !== undefined
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                {t.verifyAnswer}
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs">
                                {answeredMap[msg.id]?.selectedIndex === hasPractice.correctIndex ? (
                                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Correct!
                                  </span>
                                ) : (
                                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> Wrong
                                  </span>
                                )}
                              </div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Interactive explanation request inside chat */}
                        {answeredMap[msg.id]?.isSubmitted &&
                          answeredMap[msg.id]?.selectedIndex !== hasPractice.correctIndex && (
                            <button
                              onClick={() => {
                                handleSendMessage(
                                  `Why is option "${
                                    hasPractice.options[hasPractice.correctIndex]
                                  }" correct in this problem instead of my choice "${
                                    hasPractice.options[answeredMap[msg.id]!.selectedIndex]
                                  }"? Please explain.`
                                );
                              }}
                              className="w-full text-center py-1 bg-slate-900 rounded-lg text-[10px] text-indigo-400 hover:text-indigo-300 hover:bg-slate-950 font-semibold cursor-pointer border border-slate-700/60"
                            >
                              💡 Ask AI to explain this mistake
                            </button>
                          )}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-500 font-mono">
                      {isModel ? 'Mentor' : username || t.guestUser} • {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Bot typing state indicator */}
              {isLoading && (
                <div className="flex flex-col items-start space-y-1.5">
                  <div className="bg-slate-800 text-slate-100 rounded-xl px-4 py-3 shadow flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs text-slate-400 italic">Thinking...</span>
                  </div>
                </div>
              )}

              {/* Error boundary feedback */}
              {errorText && (
                <div className="bg-rose-950/30 border border-rose-800 rounded-xl p-3.5 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Error loading Gemini</span>
                    <p>{errorText}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form layout */}
            <form
              id="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2 items-center"
            >
              <input
                id="chat-text-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.aiChatPlaceholder}
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder-slate-500"
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`p-2.5 rounded-xl text-white transition flex-shrink-0 flex items-center justify-center cursor-pointer ${
                  inputText.trim() && !isLoading
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow shadow-indigo-500/10'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
                aria-label="Send Message to Study Mentor"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
