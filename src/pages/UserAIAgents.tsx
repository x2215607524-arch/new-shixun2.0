import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  FileText, 
  Bot, 
  User, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserAIAgents() {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "你好！我是**数字员工**。我可以帮助你根据输入主题、难度、题型、知识点、题目数量，自动生成题目。请问有什么我可以帮你的？" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    if (!textToSend) setInput("");

    // Trigger typing state
    setIsTyping(true);

    // Simulate high-fidelity AI responses based on inputs
    setTimeout(() => {
      setIsTyping(false);
      let reply = "";

      if (text.includes("教案") || text.includes("教学")) {
        reply = `好的，我已经为您制定了一份详细的**《人工智能与机器学习实战》教学教案大纲**：

### 📚 课时设计：第 1 课 - 机器学习核心算法导论
* **课时时长**：45分钟
* **教学难点**：监督学习与无监督学习的本质差异
* **重点内容**：
  1. 机器学习的概念及其与传统算法的区别；
  2. 监督学习：线性回归与分类算法基础知识；
  3. 实训平台动手实验：部署首个线性回归预测模型。

我已经为您将此教学设计方案生成并导出至您的个人工作台中，可随时下载为 PDF/Markdown 格式。需要我为您继续生成具体的配套课堂作业题目吗？`;
      } else if (text.includes("趋势") || text.includes("数据") || text.includes("分析")) {
        reply = `根据最新的系统实训及学习数据分析，当前**整体数据趋势报告**如下：

1. **学习时长提升**：本周班级学生平均实训在线时长达到 **4.2小时**，比上周稳步增长 **18.5%**。
2. **高频易错考点**：AI大模型微调、提示词优化与知识检索（RAG）相关的题型错题率较高（平均错题率 **32.8%**）。
3. **实验通过状况**：Jupyter Notebook云实训关卡的平均首次运行成功率为 **84.5%**，代码审计能力评分显著提升。

针对高频易错部分，建议您可以在本周发布一次针对**提示词优化**的专项小测验。我可以立即帮您出一套相关的选择题与问答题，需要生成吗？`;
      } else {
        reply = `您好！我是您的专属**数字员工**。我已经收到了您的消息：“${text}”。

在当前翼实训平台的演示环境中，我会协助您快速完成**课程出题、智能教案设计、学生数据统计分析**等一系列繁杂的工作。

您可以尝试点击上方的快捷提示词，或者直接告诉我您的需求，例如：“帮我出一套机器学习的基础选择题”或“分析一下班级最新的错题情况”。`;
      }

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }, 1200);
  };

  const handleChipClick = (text: string) => {
    handleSend(text);
  };

  // Inline markdown bold text bolding helper
  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, lineIndex) => {
      // Bold syntax helper **text**
      const parts = line.split("**");
      const formattedLine = parts.map((part, partIndex) => {
        if (partIndex % 2 === 1) {
          return <strong key={partIndex} className="font-extrabold text-neutral-900">{part}</strong>;
        }
        return part;
      });

      return (
        <span key={lineIndex} className="block min-h-[1.2rem]">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] overflow-hidden select-none">
      
      {/* Left Chat Window Area */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] relative min-w-0">
        
        {/* Messages List Container */}
        <div className="flex-1 overflow-y-auto px-12 py-8 space-y-6 scrollbar-thin scrollbar-thumb-neutral-200">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";
            return (
              <div 
                key={index} 
                className={cn(
                  "flex gap-4 max-w-4xl w-full",
                  isAssistant ? "justify-start" : "justify-end ml-auto"
                )}
              >
                {/* Assistant styled Avatar */}
                {isAssistant && (
                  <div className="w-8 h-8 rounded-[8px] bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                )}

                {/* Message Bubble */}
                <div 
                  className={cn(
                    "rounded-[12px] p-4 text-[14.5px] leading-relaxed shadow-sm transition-all duration-200",
                    isAssistant 
                      ? "bg-white border border-neutral-100 text-neutral-title hover:shadow-md" 
                      : "bg-[#fa541c] text-white font-medium hover:bg-[#e64a19] hover:shadow-md"
                  )}
                  style={{ wordBreak: "break-word" }}
                >
                  {isAssistant ? renderMessageContent(msg.content) : msg.content}
                </div>

                {/* User styled Avatar */}
                {!isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm text-[12px] font-bold">
                    ME
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 max-w-4xl w-full justify-start">
              <div className="w-8 h-8 rounded-[8px] bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-neutral-100 text-neutral-caption rounded-[12px] px-5 py-3 text-[14px] flex items-center gap-2 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[12px] ml-1 text-neutral-caption">数字员工正在思考中...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Chips Container */}
        <div className="px-12 pb-6 pt-0 shrink-0 w-full max-w-5xl mx-auto flex flex-col">
          
          {/* Quick Action Suggestion Chips */}
          {messages.length === 1 && !isTyping && (
            <div className="flex flex-wrap gap-3 mb-5 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button 
                onClick={() => handleChipClick("需要我生成一份教学教案")} 
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-border rounded-full text-[13px] text-neutral-body hover:text-[#fa541c] hover:border-[#ffbb96] hover:bg-[#fff2e8] transition-all duration-200 shadow-sm hover:shadow active:scale-95 font-medium group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fa541c] group-hover:scale-110 transition-transform" />
                需要我生成一份教学教案
              </button>
              <button 
                onClick={() => handleChipClick("分析一下当前的数据趋势")} 
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-border rounded-full text-[13px] text-neutral-body hover:text-[#fa541c] hover:border-[#ffbb96] hover:bg-[#fff2e8] transition-all duration-200 shadow-sm hover:shadow active:scale-95 font-medium group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fa541c] group-hover:scale-110 transition-transform" />
                分析一下当前的数据趋势
              </button>
            </div>
          )}

          {/* Interactive Chat Box Container */}
          <div className="bg-white rounded-[16px] shadow-lg hover:shadow-xl border border-neutral-200/80 p-3 focus-within:border-[#fa541c] focus-within:ring-4 focus-within:ring-[#fa541c]/5 transition-all duration-300">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="与 数字员工 对话... (Shift + Enter 换行)"
              className="w-full h-[65px] resize-none outline-none border-none text-[14.5px] text-neutral-title placeholder:text-neutral-caption bg-transparent pl-2 pt-1 font-sans"
            />
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-caption hover:bg-neutral-50 hover:text-neutral-body transition-colors" title="添加附件">
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>
              </div>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "bg-[#fa541c] hover:bg-[#e64a19] text-white rounded-full h-9 px-5 flex items-center gap-1.5 text-[13px] font-semibold transition-all shadow active:scale-95 duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
                )}
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                发送
              </button>
            </div>
          </div>

          {/* Warning Disclaimer below input box */}
          <div className="text-center mt-3 text-[12px] text-neutral-caption tracking-wide">
            AI 生成内容仅供参考，请注意甄别信息准确性。
          </div>
        </div>

      </div>

      {/* Right Sidebar - Assistant Details & History */}
      <div className="w-[290px] bg-white border-l border-neutral-200/80 flex flex-col shrink-0 h-full relative">
        
        {/* Section 1: Helper Details */}
        <div className="p-6 border-b border-neutral-100">
          <h3 className="font-bold text-[14.5px] text-neutral-title mb-3">助手详情</h3>
          <p className="text-[13px] text-neutral-body leading-relaxed">
            根据输入主题、难度、题型、知识点、题目数量，自动生成题目。
          </p>
        </div>

        {/* Section 2: Usage History */}
        <div className="p-6 flex-1 overflow-y-auto scrollbar-thin">
          <h3 className="font-bold text-[14.5px] text-neutral-title mb-4">使用历史</h3>
          <div className="space-y-5">
            {[1, 2, 3].map((day) => (
              <div key={day} className="flex gap-3 cursor-pointer group">
                <div className="mt-1">
                  <MessageSquare className="w-4 h-4 text-neutral-caption group-hover:text-[#fa541c] transition-colors" />
                </div>
                <div>
                  <div className="text-[13px] text-neutral-title font-medium group-hover:text-[#fa541c] transition-colors line-clamp-1">
                    上一次关于学习工具的对话历史...
                  </div>
                  <div className="text-[11.5px] text-neutral-caption mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {day} 天前
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating anime cartoon character avatar inside the right panel bottom corner */}
        <div className="absolute bottom-4 right-4 z-20 group">
          <div className="w-14 h-14 rounded-full border-2 border-white bg-[#ffd6e7] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer flex items-center justify-center">
            <img 
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Aria&eyes=default&hair=longButNotTooLong&hairColor=2c1b18" 
              alt="Digital Employee Character Avatar" 
              className="w-full h-full object-cover scale-110 translate-y-[2px]" 
            />
          </div>
          {/* Subtle tooltip on hover */}
          <div className="absolute right-16 bottom-3 bg-neutral-title text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-md">
            我是数字员工，需要帮助吗？
          </div>
        </div>

      </div>

    </div>
  );
}
