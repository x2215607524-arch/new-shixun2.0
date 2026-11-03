import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, Info, Download, ArrowLeft, 
  Paperclip, Zap, Image as ImageIcon, PenTool, 
  Languages, Code, Search, Grid, Mic, Send
} from "lucide-react";

export default function PracticeChat() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const historyChats = [
    "根据主页描述设计理念",
    "解释图片内容",
    "设计十年简历",
    "写获奖感言"
  ];

  const suggestions = [
    "写一份亮眼的季度工作总结",
    "鸡蛋颜色越深越有营养吗？",
    "分享一些冬季主题的小手工创意",
    "生成独一无二的新年贺图",
    "生成国风桌面壁纸",
    "为什么许多经典动画人物都戴着手套？",
    "为什么一首歌的高潮部分叫做副歌？",
    "深色和浅色蔬菜营养有区别吗？",
    "有哪些特别下饭的情景喜剧？"
  ];

  return (
    <div className="flex h-screen w-full bg-[#fafafa] font-sans">
      {/* Left Sidebar */}
      <div className="w-[260px] bg-[#f5f5f5] border-r border-neutral-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-[60px] flex items-center px-6 border-b border-transparent">
          <div className="flex items-center gap-2 text-[#fa541c] font-bold text-[16px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" fillOpacity="0.2"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            翼实训平台
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="text-[12px] text-neutral-400 mb-3 px-2">历史对话</div>
          <div className="flex flex-col gap-1">
            {historyChats.map((chat, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 px-2 py-2.5 hover:bg-neutral-200/50 rounded-lg cursor-pointer text-[13px] text-neutral-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="truncate">{chat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-200 flex justify-between items-center text-neutral-500">
          <button className="flex items-center gap-2 text-[13px] hover:text-neutral-800 transition-colors">
            <Info className="w-4 h-4" />
            关于翼实训平台
          </button>
          <button className="hover:text-neutral-800 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-between px-6 border-b border-transparent shrink-0">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-[15px] font-bold text-neutral-800">创建最佳实践</h1>
            <span className="text-[12px] text-neutral-400">通过对话生成</span>
          </div>
          
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Chat Content / Welcome Screen */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
          <h2 className="text-[28px] font-bold text-neutral-800 mb-8">下午好！有新的工作安排吗？</h2>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-[800px]">
            {suggestions.map((suggestion, idx) => (
              <button 
                key={idx}
                className="px-5 py-2.5 bg-[#f8f9fa] hover:bg-neutral-100 border border-transparent hover:border-neutral-200 text-[14px] text-neutral-600 rounded-full transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 pt-0 w-full max-w-[800px] mx-auto">
          <div className="border border-neutral-200 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus-within:border-blue-400 transition-all flex flex-col relative overflow-hidden">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  if (e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  if (input.trim()) {
                    navigate('/skill-builder');
                  }
                }
              }}
              className="w-full min-h-[80px] max-h-[200px] p-4 pb-12 outline-none resize-none text-[15px] placeholder:text-neutral-400 bg-transparent"
              placeholder="发送消息或输入'/'选择技能"
            />
            
            {/* Input Tools */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-neutral-400">
                <button className="hover:text-neutral-700 transition-colors" title="附件">
                  <Paperclip className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-neutral-200"></div>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <Zap className="w-4 h-4" /> 快速
                </button>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <ImageIcon className="w-4 h-4" /> 图像生成
                </button>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <PenTool className="w-4 h-4" /> 帮我写作
                </button>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <Languages className="w-4 h-4" /> 翻译
                </button>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <Code className="w-4 h-4" /> 编程
                </button>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <Search className="w-4 h-4" /> 深入研究
                </button>
                <button className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors text-[13px]">
                  <Grid className="w-4 h-4" /> 更多
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (input.trim()) {
                      navigate('/skill-builder');
                    }
                  }}
                  disabled={!input.trim()}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                    input.trim() ? "bg-[#fa541c] text-white hover:bg-[#e64a19]" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center text-[12px] text-neutral-400 mt-3">
            内容由 AI 生成，请注意甄别
          </div>
        </div>
      </div>
    </div>
  );
}
