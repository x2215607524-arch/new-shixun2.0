import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Bookmark, Share2, Edit3, CheckCircle2 } from "lucide-react";
import AIKnowledgeTree from "@/components/AIKnowledgeTree";

const KnowledgeCard: React.FC<{ card: any }> = ({ card }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="relative w-full h-[320px] group perspective-1000" onClick={() => setFlipped(!flipped)}>
      <div className={`w-full h-full duration-500 transition-all [transform-style:preserve-3d] cursor-pointer ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute p-6 w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center [backface-visibility:hidden] hover:shadow-md hover:border-[#fa541c]/50 transition-all">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/80 to-white/10 backdrop-blur-lg border border-white/60 shadow-[0_8px_32px_rgba(250,84,28,0.1)] flex items-center justify-center text-3xl mb-6">
             {card.icon}
           </div>
           <h3 className="text-xl font-bold text-slate-900 text-center mb-4">{card.title}</h3>
           <div className="flex gap-2 justify-center mb-6">
             {card.tags.map((tag: string) => (
               <span key={tag} className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded">{tag}</span>
             ))}
           </div>
           <div className="mt-auto flex items-center text-[#fa541c] text-sm font-medium">点击翻转查看解析 <ArrowRight className="w-4 h-4 ml-1" /></div>
        </div>
        {/* Back */}
        <div className="absolute p-6 w-full h-full bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-lg flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] text-left">
           <div className="flex justify-between items-start mb-4">
             <h4 className="font-bold text-lg text-slate-900">{card.title}</h4>
             <span className="text-2xl">{card.icon}</span>
           </div>
           <div className="text-sm text-slate-600 mb-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             <div className="mb-3"><span className="text-[#fa541c] font-bold mr-1 block mb-1">核心定义：</span>{card.desc}</div>
             <div className="mb-3"><span className="text-blue-600 font-bold mr-1 block mb-1">关键要点：</span>{card.points}</div>
             <div><span className="text-green-600 font-bold mr-1 block mb-1">关联知识点：</span>{card.relations}</div>
           </div>
           <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-slate-500">
             <div className="flex gap-1.5">
               <button className="p-1.5 bg-white border border-slate-100 hover:border-[#fa541c] hover:bg-[#fa541c]/5 hover:text-[#fa541c] rounded-full transition-all" title="收藏" onClick={e=>{e.stopPropagation()}}><Bookmark className="w-3.5 h-3.5"/></button>
               <button className="p-1.5 bg-white border border-slate-100 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500 rounded-full transition-all" title="添加笔记" onClick={e=>{e.stopPropagation()}}><Edit3 className="w-3.5 h-3.5"/></button>
               <button className="p-1.5 bg-white border border-slate-100 hover:border-green-500 hover:bg-green-50 hover:text-green-500 rounded-full transition-all" title="分享" onClick={e=>{e.stopPropagation()}}><Share2 className="w-3.5 h-3.5"/></button>
             </div>
             <button className="text-xs bg-[#fa541c] text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#d4380d] transition-colors" onClick={e=>{e.stopPropagation()}}><CheckCircle2 className="w-3.5 h-3.5"/>已掌握</button>
           </div>
        </div>
      </div>
    </div>
  );
};
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";

export default function UserOverview() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding modal every time user enters the home page after login
    if (isLoggedIn) {
      // User requested to hide onboarding persona for now
      // setShowOnboarding(true);
    }
  }, [isLoggedIn]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      {/* 1. Banner Module (Light Theme with Mouse Follow, Full Screen) */}
      <div 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative bg-[#f8fafc] overflow-hidden border-b border-slate-200 flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-[80px]"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50"></div>
        
        {/* Mouse Follow Glow */}
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-[#fa541c]/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50/50 backdrop-blur-md border border-blue-100 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-white/80 to-white/20 backdrop-blur-lg border border-white/50 shadow-sm rounded-md text-base">🚀</span> 
            <span className="bg-gradient-to-r from-[#fa541c] to-[#ff9c6e] bg-clip-text text-transparent font-bold">
              {isLoggedIn ? '欢迎回来，cosmos' : '新一代翼实训平台'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            {isLoggedIn ? (
              <>继续你的<span className="text-[#fa541c]">学习之旅</span></>
            ) : (
              <>探索 <span className="text-[#fa541c]">AI</span>，从这里开始</>
            )}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl">
            从理论基础到工程落地，系统化提升AI核心竞争力，助力企业与个人实现技术跃迁
          </p>
          
          <div className="w-full max-w-3xl relative mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-2 flex items-center border border-white/60">
            <div className="pl-4 pr-2">
              <Bot className="w-8 h-8 text-[#fa541c]" strokeWidth={2} />
            </div>
            <input 
              type="text" 
              placeholder="有什么想学的？问我吧..." 
              className="flex-1 h-14 bg-transparent border-none focus:outline-none text-slate-700 placeholder-slate-400 text-lg"
            />
            <button className="bg-[#fa541c] hover:bg-[#ff7a45] px-8 py-4 rounded-xl text-white font-medium transition-colors flex items-center gap-2 text-lg shadow-md shadow-[#fa541c]/20">
              提问 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {["推荐Python入门课程", "DeepSeek怎么部署", "RAG是什么", "Agent开发教程", "大模型微调"].map((tag, i) => (
              <span key={i} className="px-5 py-2 rounded-full bg-white/60 backdrop-blur-md text-slate-600 text-sm hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-white cursor-pointer transition-all border border-slate-200 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. Platform Data Overview */}
        <div className="mb-16">
          {isLoggedIn ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { unit: "小时", label: "累计学习", value: "128" },
                { unit: "门", label: "完成课程", value: "12" },
                { unit: "个", label: "完成实验", value: "34" },
                { unit: "项", label: "获得成就", value: "5" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-5xl font-bold mb-2 tracking-tight text-[#fa541c]">{stat.value}</div>
                  <div className="text-sm flex items-center gap-1">
                    <span className="text-slate-400">{stat.unit}</span>
                    <span className="text-slate-500">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
              {[
                { label: "精品课程", value: "1,234" },
                { label: "实战项目", value: "5,678" },
                { label: "注册用户", value: "98k+" },
                { label: "合作企业", value: "500+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4">
                  <div className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-[#fa541c]">{stat.value}</div>
                  <div className="text-sm md:text-base text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. AI Knowledge Tree (Full Screen White Background) */}
      <div className="w-full bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIKnowledgeTree isLoggedIn={isLoggedIn} />
        </div>
      </div>

      {/* 4. Your Skill Matrix */}
      {isLoggedIn && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">你的技能矩阵</h2>
            <div className="text-sm text-slate-500">
              综合能力评估：<span className="text-[#fa541c] font-bold text-lg">35%</span> (入门阶段)
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Python", level: "基础", progress: 65, color: "bg-[#2563eb]" },
              { title: "数据分析", level: "入门", progress: 42, color: "bg-[#10b981]" },
              { title: "机器学习", level: "入门", progress: 15, color: "bg-[#f59e0b]" },
              { title: "深度学习", level: "未开始", progress: 0, color: "bg-[#64748b]" },
            ].map((skill, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">{skill.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">{skill.level}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-500">掌握度</span>
                  <span className="font-bold text-slate-700">{skill.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${skill.color}`} 
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* 5. Enterprise Training Plan (Full Screen White Background) */}
      {isLoggedIn && (
      <div className="w-full bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">培训计划</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">必修课进度</span>
              <div className="w-48 bg-slate-100 rounded-full h-2">
                <div className="bg-[#fa541c] h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-sm font-bold text-[#fa541c]">60%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "企业级数据分析实战", status: "已完成", progress: 100, color: "bg-[#10b981]", icon: "📊" },
              { title: "机器学习在风控中的应用", status: "进行中", progress: 45, color: "bg-[#3b82f6]", icon: "🛡️" },
              { title: "大模型私有化部署", status: "未开始", progress: 0, color: "bg-[#64748b]", icon: "🚀" },
              { title: "AI辅助编程提效", status: "未开始", progress: 0, color: "bg-[#64748b]", icon: "💻" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col">
                <div className={`h-24 ${item.color} flex items-center justify-center text-4xl`}>
                  {item.icon}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-4 line-clamp-2">{item.title}</h3>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs mb-2">
                      <span className={item.progress === 100 ? "text-green-600 font-medium" : "text-slate-500"}>{item.status}</span>
                      <span className="text-slate-700 font-medium">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${item.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* 6. AI Knowledge Cards */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-2xl font-bold text-slate-900">AI 知识卡片</h2>
            </div>
            {isLoggedIn && (
              <Button variant="ghost" className="text-slate-500 hover:text-[#fa541c]">
                查看更多 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
          <p className="text-slate-500 mb-6 text-sm">快速了解AI核心概念，5分钟掌握一个知识点</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "什么是 RAG?", desc: "检索增强生成 (RAG) 是一种结合外部知识库和大模型的技术，让AI能回答训练数据之外的问题。", points: "结合检索模块和生成模块；减少大模型幻觉问题；提升专业领域回答准确性。", relations: "向量数据库, 词嵌入, 提示词工程", tags: ["大模型", "3分钟"], icon: "🧠", active: false },
              { title: "AI Agent 是什么?", desc: "AI Agent (智能体) 是能自主感知环境、做出决策并执行行动的AI系统，是当前AI应用的热门方向。", points: "具备记忆机制(Memory)；支持规划(Planning)和工具使用(Tools)；可独立完成复杂任务。", relations: "AutoGPT, ReAct框架, MCP协议", tags: ["Agent", "5分钟"], icon: "🤖", active: true },
              { title: "LoRA 微调原理", desc: "LoRA是一种高效的大模型微调方法，只需训练少量参数就能让模型适应特定任务，大幅降低训练成本。", points: "低秩矩阵近似；冻结预训练模型参数；插拔式的轻量级模块。", relations: "PEFT, Transformer架构, 预训练模型", tags: ["微调", "4分钟"], icon: "⚡", active: false },
              { title: "向量数据库入门", desc: "向量数据库专门存储和检索高维向量，是RAG系统的核心组件，让语义搜索成为可能。", points: "支持高维近似最近邻(ANN)搜索；计算余弦相似度等距离；支持海量数据极速检索。", relations: "RAG, Word2Vec, 语义搜索", tags: ["数据库", "5分钟"], icon: "📊", active: false },
              { title: "MCP 协议是什么?", desc: "Model Context Protocol (MCP) 是Anthropic推出的开放协议，让AI模型能安全地连接外部工具和数据源。", points: "统一上下文协议标准；简化服务端与模型通信；提升安全性与拓展性。", relations: "Anthropic, API集成, Agent工具", tags: ["协议", "3分钟"], icon: "🔧", active: false },
              { title: "Prompt Engineering", desc: "提示词工程是与大模型高效沟通的艺术，掌握它能让AI输出更精准、更符合你期望的内容。", points: "结构化提示词；提供Few-shot示例；让模型思考(Chain of Thought)。", relations: "少样本学习, CoT, 大模型交互", tags: ["技巧", "4分钟"], icon: "🎯", active: false },
            ].map((card, i) => (
              <KnowledgeCard key={i} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* 5.1 Recommended for You */}
      <div className="w-full bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{isLoggedIn ? '为你推荐' : '精选课程推荐'}</h2>
            {isLoggedIn && (
              <Button variant="ghost" className="text-slate-500 hover:text-[#fa541c]">
                换一批 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Python 核心编程", desc: "零基础掌握Python，开启编程之路", tags: ["基础", "编程"], collections: "1.2k", students: "12.5k", color: "bg-[#2563eb]", icon: "🐍" },
              { title: "机器学习实战", desc: "深入浅出核心算法与应用场景", tags: ["AI", "算法"], collections: "2.5k", students: "8.2k", color: "bg-[#7c3aed]", icon: "🤖" },
              { title: "深度学习进阶", desc: "神经网络模型原理与PyTorch实践", tags: ["进阶", "模型"], collections: "3.8k", students: "6.4k", color: "bg-[#e11d48]", icon: "🧠" },
              { title: "大模型应用开发", desc: "从Prompt Engineering到Agent构建", tags: ["前沿", "LLM"], collections: "5.1k", students: "15.1k", color: "bg-[#059669]", icon: "🚀" },
            ].map((course, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col">
                <div className={`h-32 ${course.color} flex items-center justify-center text-5xl`}>
                  {course.icon}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-1">{course.desc}</p>
                  <div className="flex gap-2 mb-4">
                    {course.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-amber-500 font-medium">⭐ {course.collections} 收藏</span>
                    <span className="flex items-center gap-1">👥 {course.students} 学习</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5.2 Job Practical Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{isLoggedIn ? '最佳实践案例展示' : '最佳实践案例展示'}</h2>
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
               {["教学场景", "竞赛场景", "企业实战"].map(tab => (
                 <button key={tab} className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === '教学场景' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>
               ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[
              { title: "DeepSeek R1 本地私有化部署指南", desc: "详细讲解如何在由于隐私或安全要求而受限的本地环境部署DeepSeek R1。覆盖依赖安装、硬件配置、推理服务搭建及基于vLLM的推理加速全流程。", difficulty: "高阶", category: "人工智能", scene: "企业实战", users: "12.5k", collections: "3.2k", rating: "4.9", tags: ["大模型", "私有化部署", "vLLM"], color: "bg-[#6366f1]", icon: "🚀" },
              { title: "基于 Dify 搭建企业级智能知识库", desc: "通过Dify及向量数据库快速构建支持多文档解析、语义检索和RAG生成的企业知识库系统。解决企业内部文档搜索痛点。", difficulty: "中阶", category: "人工智能", scene: "企业实战", users: "8.2k", collections: "2.8k", rating: "4.8", tags: ["RAG", "Dify", "知识库"], color: "bg-[#10b981]", icon: "📚" },
              { title: "大模型微调 (LoRA) 性能优化技巧", desc: "使用LoRA等参数高效微调方法对Llama-3进行定制化训练。介绍显存管理、数据集预处理以及评估指标。", difficulty: "高阶", category: "人工智能", scene: "教学场景", users: "6.4k", collections: "1.5k", rating: "4.7", tags: ["LoRA", "微调优化"], color: "bg-[#f59e0b]", icon: "⚡" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row group">
                <div className={`w-full md:w-48 h-32 md:h-auto ${item.color} flex items-center justify-center text-5xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <div className="p-6 flex flex-col flex-1 relative bg-white z-10 w-full">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-4">
                    <h3 className="font-bold text-slate-900 text-xl">{item.title}</h3>
                    <div className="flex gap-2">
                       <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md border border-blue-100">{item.scene}</span>
                       <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-md border border-orange-100">{item.difficulty}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 md:line-clamp-none">{item.desc}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                     <span className="text-xs text-slate-400">标签：</span>
                     {item.tags.map(tag => (
                        <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{tag}</span>
                     ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-slate-100 w-full">
                    <div className="flex items-center gap-4 text-slate-500">
                       <span className="flex items-center gap-1"><span className="text-amber-500">⭐</span> {item.collections} 收藏</span>
                       <span className="flex items-center gap-1">👥 {item.users} 使用</span>
                    </div>
                    <Button size="sm" className="bg-white text-[#fa541c] border border-[#fa541c] hover:bg-[#fa541c] hover:text-white transition-colors">
                      一键应用
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Registration Guidance */}
      {!isLoggedIn && (
      <div className="w-full bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fa541c] rounded-[24px] p-12 text-center text-white relative overflow-hidden shadow-lg">
            {/* Texture/Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">开启你的AI学习之旅</h2>
              <p className="text-white/90 mb-8 text-lg">
                注册即可获得免费试学课程，完善学习画像还可解锁个性化学习路径
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button className="bg-white text-[#fa541c] hover:bg-slate-50 rounded-lg px-8 py-6 text-lg font-bold shadow-md">
                  立即注册
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-lg px-8 py-6 text-lg font-medium bg-transparent">
                  了解更多
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
      
      {/* 8. Footer */}
      <Footer />
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding} 
      />
    </div>
  );
}
