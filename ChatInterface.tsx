
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSend }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    onSend(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center space-x-4 bg-slate-50/50">
        <div className="relative">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
            AI
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Knowledge Assistant</h3>
          <p className="text-xs text-slate-400 font-medium flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            Online & Policy Aware
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-3xl flex items-center justify-center animate-bounce">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="max-w-xs">
              <h4 className="text-lg font-bold text-slate-800">Welcome to Self-Service Portal</h4>
              <p className="text-sm text-slate-500 mt-2">Ask me anything about IndiaSportsHub benefits, vacation policies, or remote work guidelines.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              {['How many vacation days do I get?', 'Can I work from a coffee shop?', 'What is the process for parental leave?', 'How do I claim health benefits?'].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] space-y-2`}>
                <div 
                  className={`px-5 py-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
                
                {msg.category && (
                  <div className="flex items-center space-x-2">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 px-2 py-0.5 bg-indigo-50 rounded">
                      {msg.category}
                    </span>
                  </div>
                )}

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Verified Citations:</p>
                    <div className="space-y-1.5">
                      {msg.citations.map((cite, i) => (
                        <div key={i} className="flex space-x-2 bg-white border border-slate-100 p-2 rounded-lg text-[11px] text-slate-500 italic shadow-sm leading-snug">
                          <span className="text-indigo-400 font-bold shrink-0">“</span>
                          <span>{cite}</span>
                          <span className="text-indigo-400 font-bold shrink-0">”</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about IndiaSportsHub policies..."
            className="flex-1 px-5 py-3.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
          IndiaSportsHub Assistant uses AI backed by verified policy documents.
        </p>
      </div>
    </div>
  );
};
