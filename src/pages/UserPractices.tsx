import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, ChevronRight, ChevronDown, ChevronLeft, Play, Plus, ArrowLeft, ArrowRight, 
  Terminal, Code, Settings, Rocket, BookOpen, Clock, User, FileCode, CheckCircle2, 
  Bot, Send, Paperclip, LayoutDashboard, Database, Activity, Cpu, PlayCircle, FileText,
  History, Calendar, Info, Layers, Zap, Star, Sparkles, GitFork, Download, Tag, Heart, X, Copy, Users, Box, MessageSquare, ImageIcon, Edit3, Languages, Code2, LayoutGrid, Mic, LogOut, Ghost, FolderOpen, Sun, GitBranch, Maximize2, ChevronUp, Store, List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const techTypes = ["全部", "数据处理", "模型训练", "可视化", "对话交互", "代码开发", "图像生成"];
const scenarios = ["全部", "课程辅助", "项目开发", "考试测评", "内容创作", "日常办公"];
const sortOptions = ["按时间", "按热度", "按难度"];

const practices = [
  {
    id: 1,
    title: "项目汇报 PPT 生成",
    description: "基于大模型快速生成项目汇报PPT大纲与内容，适合各类课程期末汇报、项目结题展示等场景，大幅提升文档编写效率。",
    techTags: ["对话交互", "内容创作"],
    scenarioTags: ["课程辅助", "日常办公"],
    usageCount: 12500,
    image: "https://picsum.photos/seed/ppt/400/225",
    author: "AI助手",
    date: "2025-03-20",
    version: "V2.1.0",
    workflow: ["需求分析", "大纲生成", "任务拆分", "并行写作", "智能配图", "文档合并"],
    summary: "一键生成专业级PPT演示文稿，告别排版与构思烦恼，内置多种主流的学术、商业演示模板。",
    skills: ["文档解析能力", "PPT排版引擎", "图文排版大模型"]
  },
  {
    id: 2,
    title: "Python 爬虫数据清洗实战",
    description: "提供一套完整的Python数据清洗模板代码，包含缺失值处理、异常值检测、数据标准化等功能，适合数据分析相关课程作业。",
    techTags: ["数据处理", "代码开发"],
    scenarioTags: ["课程辅助", "项目开发"],
    usageCount: 8200,
    image: "https://picsum.photos/seed/data/400/225",
    author: "DataMaster",
    date: "2025-03-18",
    version: "V1.0.5",
    workflow: ["目标抓取", "动态加载处理", "反爬突破", "清洗规则配置", "质量校验", "数据存储"],
    summary: "针对复杂网页和非结构化数据，提供全自动化的沉浸式爬虫清洗工作流。",
    skills: ["BeautifulSoup解析", "Selenium自动化", "Pandas预处理"]
  },
  {
    id: 3,
    title: "YOLOv8 目标检测模型微调",
    description: "详细记录了如何使用自定义数据集对YOLOv8模型进行微调训练的完整流程，适合计算机视觉方向的毕业设计或实战项目。",
    techTags: ["模型训练", "可视化"],
    scenarioTags: ["项目开发"],
    usageCount: 5600,
    image: "https://picsum.photos/seed/yolo/400/225",
    author: "CV_Expert",
    date: "2025-03-15",
    version: "V3.2.0",
    workflow: ["数据标注", "格式转换", "超参调优", "环境编译", "断点训练", "模型推理"],
    summary: "快速实现在任意私有数据集上的 YOLOv8 训练与微调，自动管理GPU资源和训练状态。",
    skills: ["数据增强", "ONNX导出", "可视化验证"]
  },
  {
    id: 4,
    title: "基于 RAG 的智能问答系统",
    description: "结合LangChain和向量数据库，构建本地知识库问答系统。适合自然语言处理课程大作业或企业内部知识库搭建。",
    techTags: ["对话交互", "代码开发"],
    scenarioTags: ["项目开发", "课程辅助"],
    usageCount: 15300,
    image: "https://picsum.photos/seed/rag/400/225",
    author: "LLM_Builder",
    date: "2025-03-10",
    version: "V1.8.8",
    workflow: ["文档切片", "向量化编排", "近似搜索", "上下文注入", "提示词过滤", "回答生成"],
    summary: "企业级 RAG 问答管线搭建模板，降低了幻觉问题，增强了模型的信息准确性。",
    skills: ["向量数据库", "嵌入模型选择", "LangChain框架"]
  }
];

export default function UserPractices() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<'list' | 'detail' | 'builder'>(location.state?.showDetail ? 'detail' : 'list');
  const [selectedPractice, setSelectedPractice] = useState<any>(
    location.state?.practiceId ? practices.find(p => p.id === location.state.practiceId) || null : null
  );
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createStep, setCreateStep] = useState(1);
  const [createType, setCreateType] = useState('chat');

  const [selectedTech, setSelectedTech] = useState("全部");
  const [selectedScenario, setSelectedScenario] = useState("全部");
  const [sortBy, setSortBy] = useState("按时间");
  const [searchQuery, setSearchQuery] = useState("");

  const [builderInput, setBuilderInput] = useState("");
  const [activeBuilderTab, setActiveBuilderTab] = useState<'preview' | 'deploy'>('preview');

  useEffect(() => {
    if (location.state && (location.state as any).openChat) {
      setShowChat(true);
      // Clear the state so it doesn't reopen if the user refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.showDetail && location.state?.practiceId) {
      const practice = practices.find(p => p.id === location.state.practiceId);
      if (practice) {
        setSelectedPractice(practice);
        setView('detail');
      }
    }
  }, [location.state]);

  const filteredPractices = practices
    .filter(p => selectedTech === "全部" || p.techTags.includes(selectedTech))
    .filter(p => selectedScenario === "全部" || p.scenarioTags.includes(selectedScenario))
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "按时间") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "按热度") return b.usageCount - a.usageCount;
      if (sortBy === "按难度") {
        const diffMap: any = { "初阶": 1, "中阶": 2, "高阶": 3 };
        return (diffMap[(a as any).difficulty] || 1) - (diffMap[(b as any).difficulty] || 1);
      }
      return 0;
    });

  const formatUsageCount = (count: number) => {
    return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count.toString();
  };

  const handlePracticeClick = (practice: any) => {
    setSelectedPractice(practice);
    setView('detail');
  };

  // --- 1. LIST VIEW ---
  const renderListView = () => (
    <div className="flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-title">最佳实践</h1>
          <p className="text-neutral-body text-[14px] mt-1 font-medium">发现、应用、或构建高效的 AI 实战场景与解决方案</p>
        </div>
        <button 
          onClick={() => { setShowCreateModal(true); setCreateStep(1); }}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#fa541c] hover:bg-[#ff7a45] text-white px-5 py-2.5 rounded-[8px] font-medium transition-all text-[14px] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          创建最佳实践
        </button>
      </div>

      {/* Filters (1.3, 1.4) */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-20 flex items-center gap-1.5">技术类型：</span>
          <div className="flex flex-wrap gap-2">
            {techTypes.map((tech, i) => (
              <button 
                key={i}
                onClick={() => setSelectedTech(tech)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  selectedTech === tech 
                    ? "bg-[#fa541c] text-white" 
                    : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-20 flex items-center gap-1.5">业务场景：</span>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((scenario, i) => (
              <button 
                key={i}
                onClick={() => setSelectedScenario(scenario)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  selectedScenario === scenario 
                    ? "bg-[#fa541c] text-white" 
                    : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Sort (1.5) */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center bg-white rounded-full p-1 border border-neutral-border/50 shadow-sm">
          {sortOptions.map((sort) => (
            <button 
              key={sort}
              onClick={() => setSortBy(sort)}
              className={cn(
                "px-6 py-1.5 rounded-full text-[14px] transition-all font-medium",
                sortBy === sort 
                  ? "bg-neutral-title text-white shadow-md" 
                  : "text-neutral-body hover:text-neutral-title hover:bg-neutral-bg/50"
              )}
            >
              {sort}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption group-focus-within:text-[#fa541c] transition-colors" />
          <Input 
            placeholder="按最佳实践名称或描述搜索..." 
            className="pl-10 h-11 text-[14px] rounded-full border-neutral-border/50 bg-white focus-visible:ring-[#fa541c]/20 focus-visible:border-[#fa541c] shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid List (1.1, 1.2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPractices.map((practice, i) => (
          <div 
            key={i} 
            onClick={() => handlePracticeClick(practice)}
            className="bg-white rounded-[16px] p-5 border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer"
          >
            {/* Header: Icon and Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-[12px] overflow-hidden shrink-0 border border-neutral-border/60 shadow-sm">
                <img 
                  src={practice.image} 
                  alt={practice.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-[16px] font-bold text-neutral-title line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                {practice.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-[13px] text-neutral-caption mb-4 line-clamp-2 leading-relaxed flex-1">
              {practice.description}
            </p>
            
            {/* Tags (kept to preserve data but styled unobtrusively) */}
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {practice.techTags.slice(0, 1).map((tag: string, idx: number) => (
                <span key={`tech-${idx}`} className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[11px] rounded-md">
                  {tag}
                </span>
              ))}
              {practice.scenarioTags.slice(0, 1).map((tag: string, idx: number) => (
                <span key={`scene-${idx}`} className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[11px] rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between text-[13px] font-medium pt-1 mt-auto">
              <div className="flex items-center text-neutral-title">
                {practice.usageCount ? (
                  <span className="font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-neutral-caption" />
                    {formatUsageCount(practice.usageCount)} <span className="text-[12px] font-normal text-neutral-caption">次调用</span>
                  </span>
                ) : (
                  <span>免费</span>
                )}
              </div>
              <span className="text-neutral-caption group-hover:text-neutral-body transition-colors">@{practice.author}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-end p-4 gap-4 mt-8">
        <span className="text-[13px] text-neutral-500">共 {practices.length} 条</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]" disabled>&lt;</Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-[#fa541c] text-white border-[#fa541c]">1</Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">2</Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">3</Button>
          <span className="px-1 text-neutral-caption text-[13px]">...</span>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">&gt;</Button>
        </div>
        <div className="relative bg-white rounded-[6px]">
          <select className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm">
            <option className="bg-white">10 条/页</option>
            <option className="bg-white">20 条/页</option>
            <option className="bg-white">50 条/页</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );

  // --- 2. DETAIL VIEW (1.8 最佳实践详情页) ---
  const renderDetailView = () => {
    if (!selectedPractice) return null;
    return (
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar relative">
        {/* Detail Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-border/40 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-neutral-body hover:text-[#fa541c] transition-colors font-medium text-[15px]"
          >
            <ArrowLeft className="w-5 h-5" /> 返回列表
          </button>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-white border border-neutral-border shadow-sm rounded-lg px-3 py-1.5 cursor-pointer hover:bg-neutral-bg transition-colors">
               <GitFork className="w-4 h-4 text-neutral-caption" />
               <span className="text-[13px] font-medium text-neutral-title">Fork</span>
             </div>
             <div className="flex items-center gap-2 bg-white border border-neutral-border shadow-sm rounded-lg px-3 py-1.5 cursor-pointer hover:bg-neutral-bg transition-colors">
               <Download className="w-4 h-4 text-neutral-caption" />
               <span className="text-[13px] font-medium text-neutral-title">下载</span>
             </div>
             <div 
               onClick={() => {
                 setIsFavorited(!isFavorited);
                 alert(isFavorited ? "已取消收藏" : "收藏成功");
               }}
               className="flex items-center gap-2 bg-white border border-neutral-border shadow-sm rounded-lg px-3 py-1.5 cursor-pointer hover:bg-neutral-bg transition-colors"
             >
               <Star className={`w-4 h-4 ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-caption'}`} />
               <span className="text-[13px] font-medium text-neutral-title">{isFavorited ? '已收藏' : '收藏'}</span>
             </div>
             <div className="flex items-center gap-2 bg-neutral-bg border border-neutral-border rounded-lg px-3 py-1.5">
               <Tag className="w-3.5 h-3.5 text-neutral-caption" />
               <span className="text-[13px] font-medium text-neutral-caption">{selectedPractice.version}</span>
             </div>
             <button 
               onClick={() => setShowChat(true)}
               className="bg-gradient-to-r from-[#fa541c] to-[#ff7a45] text-white px-6 py-2 ml-1 rounded-lg font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
             >
              <Rocket className="w-4 h-4" /> 使用此最佳实践
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          {/* Top Info Area (顶部信息区) */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-neutral-border/50">
            <div className="flex items-start justify-between gap-8 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{selectedPractice.title}</h1>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[12px] font-bold border border-blue-100 shadow-sm">官方认证</span>
                </div>
                <p className="text-neutral-600 text-[16px] leading-relaxed max-w-4xl bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <span className="font-bold text-neutral-800 mr-2 flex items-center gap-1 inline-flex"><Sparkles className="w-4 h-4 text-yellow-500"/> 核心摘要:</span> 
                  {selectedPractice.summary} {selectedPractice.description}
                </p>
              </div>
              <div className="w-[300px] aspect-video rounded-xl overflow-hidden shadow-inner shrink-0 hidden lg:block">
                 <img src={selectedPractice.image} className="w-full h-full object-cover" alt="cover"/>
              </div>
            </div>

            {/* Workflow Area */}
            <div className="bg-neutral-bg/50 rounded-xl p-5 border border-dashed border-neutral-border">
              <h3 className="text-[14px] font-bold text-neutral-title mb-4 flex items-center gap-2">
                <WorkflowIcon className="w-4 h-4 text-[#fa541c]" /> 工作流说明
              </h3>
              <div className="flex items-center flex-wrap gap-y-4">
                {selectedPractice.workflow.map((step: string, index: number) => (
                  <React.Fragment key={index}>
                    <div className="bg-white border border-neutral-border px-4 py-2 rounded-lg text-[13px] font-medium text-neutral-title shadow-sm flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#fa541c]/10 text-[#fa541c] flex items-center justify-center text-[10px] font-bold">{index + 1}</div>
                      {step}
                    </div>
                    {index < selectedPractice.workflow.length - 1 && (
                      <div className="px-3 text-neutral-caption flex items-center"><ArrowRight className="w-4 h-4" /></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Main Content (左侧主内容区) */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Scene Markdown Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-border/50">
                <h2 className="text-xl font-bold text-neutral-title mb-6 border-b border-neutral-border/60 pb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" /> 场景介绍
                </h2>
                <div className="prose prose-sm md:prose-base max-w-none text-neutral-body">
                  <h3 className="text-neutral-title font-bold text-[18px]">1. 何时使用该实践？</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">
                    当您面临 <span className="font-semibold text-neutral-800">{selectedPractice.scenarioTags.join('、')}</span> 等情况，或者需要大量 <span className="font-semibold text-neutral-800">{selectedPractice.techTags.join('、')}</span> 相关工作时，此实践将帮助您大幅降低操作门槛与时间成本。
                  </p>
                  
                  <h3 className="text-neutral-title font-bold text-[18px] mt-8">2. 核心优势</h3>
                  <ul className="list-disc pl-5 mt-3 space-y-2 text-[15px]">
                    <li><span className="font-semibold text-neutral-700">开箱即用：</span>完整预配的运行环境与基础配置。</li>
                    <li><span className="font-semibold text-neutral-700">高质量输出：</span>内置多轮提词优化方案，显著提升AI生成质量。</li>
                    <li><span className="font-semibold text-neutral-700">兼容性强：</span>标准化的数据输入输出接口，支持快速集成。</li>
                  </ul>
                  
                  <h3 className="text-neutral-title font-bold text-[18px] mt-8">3. 快速接入指南</h3>
                  <div className="bg-neutral-900 rounded-xl p-5 mt-3 border border-neutral-800 shadow-inner">
                    <div className="flex items-center justify-between mb-3 border-b border-neutral-700 pb-2">
                      <span className="text-[12px] text-neutral-400 font-mono">终端 / Terminal</span>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                      </div>
                    </div>
                    <code className="text-[13px] font-mono text-emerald-400 whitespace-pre-wrap block leading-relaxed">
                      $ npm install @practice/core{'\n'}
                      $ practice-cli init --template {selectedPractice.id}
                    </code>
                  </div>
                </div>
              </div>

              {/* Contained Skills List */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-border/50">
                <h2 className="text-xl font-bold text-neutral-title mb-6 flex items-center gap-2">
                  <BoxIcon className="w-5 h-5 text-emerald-500" /> 依赖核心技能 (Skills)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedPractice.skills.map((skill: string, idx: number) => (
                    <div key={idx} onClick={() => setSelectedSkill(skill)} className="border border-neutral-200 rounded-xl p-4 flex items-center justify-between hover:border-[#fa541c] hover:shadow-md transition-all cursor-pointer group bg-neutral-50/50 hover:bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-neutral-800 group-hover:text-[#fa541c] transition-colors line-clamp-1">{skill}</div>
                          <div className="text-[12px] text-neutral-500 mt-0.5">内置自动化处理工具</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#fa541c]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stats Sidebar (右侧统计区) */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
              {/* Stats Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-border/50">
                <h3 className="text-[16px] font-bold text-neutral-title mb-5 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#fa541c]" /> 使用数据
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-neutral-border/30 pb-3">
                    <span className="text-[14px] text-neutral-body">累计使用次数</span>
                    <span className="text-[16px] font-bold text-neutral-title">{selectedPractice.usageCount.toLocaleString()} 次</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-border/30 pb-3">
                    <span className="text-[14px] text-neutral-body">月活调用量</span>
                    <span className="text-[16px] font-bold text-neutral-title">3,241 次</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[14px] text-neutral-body">综合评分</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-[16px] font-bold text-neutral-title">4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version & Dev Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-border/50">
                <h3 className="text-[16px] font-bold text-neutral-title mb-5 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" /> 元信息
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 border-b border-neutral-border/30 pb-3">
                    <span className="text-[12px] text-neutral-caption">版本信息</span>
                    <span className="text-[14px] font-semibold text-neutral-title flex items-center justify-between">
                      {selectedPractice.version}
                      <span className="text-[12px] font-normal text-blue-500 cursor-pointer hover:underline">更新记录</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-neutral-border/30 pb-3">
                    <span className="text-[12px] text-neutral-caption">创建人 / 开发者</span>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                        {selectedPractice.author.charAt(0)}
                      </div>
                      <span className="text-[14px] font-semibold text-neutral-title">{selectedPractice.author}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-neutral-caption">首次上线时间 & 更新时间</span>
                    <span className="text-[14px] font-medium text-neutral-title mt-1">{selectedPractice.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Detail Modal */}
        {selectedSkill && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedSkill(null)}></div>
            <div className="relative bg-[#f8f9fa] w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col font-sans">
              
              {/* Header */}
              <div className="bg-white p-6 border-b border-neutral-200 flex items-start justify-between shrink-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white text-xl font-bold">D</span>
                  </div>
                  <div>
                    <h2 className="text-[20px] font-bold text-neutral-900 leading-tight pr-4">
                      description: 将用户讲稿一键生成乔布斯风极简科技...
                    </h2>
                    <div className="text-[13px] text-neutral-500 font-mono mt-1">ppt-generator</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="w-10 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedSkill(null)} className="w-10 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200/60 rounded flex items-center gap-1.5 text-[12px] font-medium">
                    <Box className="w-3.5 h-3.5" /> v1.0.0
                  </span>
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-500 border border-orange-200/60 rounded flex items-center gap-1.5 text-[12px] font-medium">
                    <Zap className="w-3.5 h-3.5" /> 加速下载可用
                  </span>
                </div>
                
                <p className="text-[15px] text-neutral-700 leading-relaxed font-medium mb-3">
                  将用户讲稿一键生成乔布斯风极简科技感竖屏HTML演示稿。 当用户需要生成PPT、演示文稿、Slides、幻灯片，或要求科技风/极简风/乔布斯风格的演示时触发此技能。输出为单个可直接运行的HTML文件。
                </p>
                <div className="text-[13px] text-neutral-500 mb-6">
                  该技能数据来源于ClawHub，作者是 wwlyzzyorg，详情可查看 <a href="#" className="font-medium text-blue-500 hover:underline">ClawHub ↗</a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-neutral-100">
                    <Download className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-[22px] font-bold text-neutral-900">1.5 万</div>
                    <div className="text-[12px] text-neutral-400 font-medium">下载量</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-neutral-100">
                    <Star className="w-5 h-5 text-orange-400 mb-2" />
                    <div className="text-[22px] font-bold text-neutral-900">35</div>
                    <div className="text-[12px] text-neutral-400 font-medium">收藏</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-neutral-100">
                    <Users className="w-5 h-5 text-emerald-500 mb-2" />
                    <div className="text-[22px] font-bold text-neutral-900">977</div>
                    <div className="text-[12px] text-neutral-400 font-medium">安装量</div>
                  </div>
                </div>

                {/* Installation */}
                <div>
                  <h3 className="text-[16px] font-bold text-neutral-900 mb-4">安装方式</h3>
                  
                  <div className="flex bg-neutral-200/70 p-1 rounded-xl mb-6">
                    <button className="flex-1 py-2 bg-white rounded-lg shadow-sm text-center font-bold text-[14px] text-neutral-900 flex items-center justify-center gap-2">
                      <Bot className="w-4 h-4" /> 我是 Agent
                    </button>
                    <button className="flex-1 py-2 text-center font-medium text-neutral-500 text-[14px] flex items-center justify-center gap-2 hover:text-neutral-700 transition-colors">
                      <User className="w-4 h-4" /> 我是 Human
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[13px] text-neutral-500 mb-2">将此提示发送给你的Agent，以安装SkillHub CLI</div>
                      <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-5 text-[14px] text-neutral-700 leading-relaxed font-medium relative group">
                        <button className="absolute top-3 right-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-colors opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer z-10">
                          <Copy className="w-3.5 h-3.5" /> 复制
                        </button>
                        请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/skillhub.md 安装 SkillHub商店，但是只安装CLI，然后安装ppt-generator技能。<br/><br/>
                        若已安装，则直接安装ppt-generator技能。
                      </div>
                    </div>

                    <div>
                      <div className="text-[13px] text-neutral-500 mb-2">将此提示发送给你的Agent，以安装SkillHub CLI，并且优先采用 SkillHub 加速安装技能</div>
                      <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-5 text-[14px] text-neutral-700 leading-relaxed font-medium relative group">
                        <button className="absolute top-3 right-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-colors opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer z-10">
                          <Copy className="w-3.5 h-3.5" /> 复制
                        </button>
                        请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/skillhub.md 安装 SkillHub商店，但是只安装CLI，然后使用加速节点安装ppt-generator技能。<br/><br/>
                        若已安装，则直接使用加速节点安装ppt-generator技能。
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 3. BUILDER VIEW (1.7 创建新项目入口 - Skill Builder 交互区) ---
  const renderBuilderView = () => {
    return (
      <div className="fixed inset-0 z-[150] flex flex-col h-full bg-white font-sans w-full">
        {/* Top Header */}
        <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 bg-white shrink-0">
          {/* Left: Title & Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                 setView('list');
                 setActiveBuilderTab('preview');
              }}
              className="flex items-center justify-center p-1.5 hover:bg-neutral-100 rounded text-neutral-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-800 bg-neutral-100/50 px-3 py-1.5 rounded-lg border border-neutral-200/50">
              <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                 <img src="https://picsum.photos/seed/datavis/32/32" className="w-full h-full object-cover" alt="icon"/>
              </div>
              数据可视化技能
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-neutral-500">
               <button className="p-1.5 hover:bg-neutral-100 rounded"><History className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-neutral-100 rounded"><FolderOpen className="w-4 h-4" /></button>
            </div>
          </div>
          
          {/* Center/Right Tabs */}
          <div className="flex-1 flex justify-start items-end h-full ml-8 gap-1 pt-3">
             <div className={cn(
               "px-4 py-2 text-sm font-medium border-t-2 rounded-t-lg flex items-center gap-2 cursor-pointer transition-colors",
               activeBuilderTab === 'preview' ? "bg-white border-[#fa541c] text-neutral-900 border-x border-neutral-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]" : "bg-neutral-100 border-transparent text-neutral-500 hover:bg-neutral-200"
             )}
             onClick={() => setActiveBuilderTab('preview')}
             >
               <FileText className="w-4 h-4" /> 预览
             </div>
             {activeBuilderTab === 'deploy' && (
               <div className={cn(
                 "px-4 py-2 text-sm font-medium border-t-2 rounded-t-lg flex items-center gap-2 cursor-pointer transition-colors",
                 "bg-white border-[#fa541c] text-neutral-900 border-x border-neutral-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"
               )}>
                 <Rocket className="w-4 h-4" /> 部署
                 <X className="w-3.5 h-3.5 ml-2 hover:text-[#fa541c]" onClick={(e) => { e.stopPropagation(); setActiveBuilderTab('preview'); }} />
               </div>
             )}
             <button className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1 hover:bg-neutral-100 rounded-t-lg ml-1">
                <Plus className="w-4 h-4" /> 新标签页
             </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
             <button className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"><Sun className="w-4 h-4" /></button>
             <button className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"><GitBranch className="w-4 h-4" /></button>
             <button className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded"><Copy className="w-4 h-4" /></button>
             <button 
               onClick={() => setActiveBuilderTab('deploy')}
               className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-5 py-1.5 rounded-lg text-[13px] font-bold shadow-sm transition-colors ml-2"
             >
               部署
             </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden bg-neutral-50/30">
          {/* Left Chat Area */}
          <div className="w-[420px] flex flex-col border-r border-neutral-200 bg-white shadow-[2px_0_12px_rgba(0,0,0,0.02)] relative z-10 shrink-0">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
               {/* User Bubble */}
               <div className="flex justify-end">
                  <div className="bg-[#f0f0f0] text-neutral-800 px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] max-w-[85%] leading-relaxed">
                     帮我做一个信息图设计技能，支持输入数据，生成高质量数据可视化图表
                  </div>
               </div>
               
               {/* AI Bubble */}
               <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                     <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                     <div className="text-[14px] font-medium text-neutral-500 flex items-center gap-1.5">
                       <Sparkles className="w-3.5 h-3.5" /> 思考过程
                     </div>
                     <div className="text-[14px] text-neutral-800 leading-relaxed">
                       我来分析这个需求并创建信息图设计技能。
                     </div>
                     
                     <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <FileText className="w-3.5 h-3.5" /> 更新计划
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <Sparkles className="w-3.5 h-3.5" /> 思考过程
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <FileText className="w-3.5 h-3.5" /> 更新计划
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <Sparkles className="w-3.5 h-3.5" /> 思考过程
                       </div>
                     </div>
                     
                     <div className="text-[14px] text-neutral-800 mt-2">
                       现在开始创建技能文件，并执行：
                     </div>
                     
                     <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <Code className="w-3.5 h-3.5" /> 执行命令 mkdir -p /workspace/projects/infographic-designer/scripts...
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <FileText className="w-3.5 h-3.5" /> 创建文件 /workspace/projects/infographic-designer/SKILL.md
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <FileText className="w-3.5 h-3.5" /> 创建文件 /workspace/projects/infographic-designer/references/chart-types.md
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <FileText className="w-3.5 h-3.5" /> 创建文件 /workspace/projects/infographic-designer/scripts/generate_chart.py
                       </div>
                       <div className="flex items-center gap-2 text-[13px] text-neutral-600 bg-neutral-50 px-3 py-2 rounded border border-neutral-100">
                         <Sparkles className="w-3.5 h-3.5" /> 思考过程
                       </div>
                     </div>
                     
                     <div className="text-[14px] text-neutral-800 mt-2">
                       现在验证脚本并打包：
                     </div>
                     <div className="flex gap-2 items-center mt-2 p-2 border border-neutral-100 rounded-full w-fit">
                       <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-bounce"></div>
                       <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                       <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-neutral-100">
               <div className="border border-neutral-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all shadow-sm bg-white">
                  <textarea 
                    className="w-full min-h-[60px] max-h-[200px] p-3 text-[14px] outline-none resize-none placeholder:text-neutral-400"
                    placeholder="欢迎使用扣子编程，可以在此输入你的要求。"
                  />
                  <div className="flex items-center justify-between px-2 pb-2">
                     <div className="flex items-center gap-1">
                        <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"><Plus className="w-4 h-4"/></button>
                        <div className="text-[12px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded flex items-center gap-1 ml-1 cursor-pointer">
                           <Sparkles className="w-3 h-3" /> 自动 <ChevronDown className="w-3 h-3" />
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"><Mic className="w-4 h-4"/></button>
                       <button className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors">
                          <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                       </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Workspace */}
          <div className="flex-1 relative flex flex-col bg-white">
             {activeBuilderTab === 'preview' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 relative">
                   <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                   <Ghost className="w-12 h-12 text-neutral-300 mb-4" />
                   <h2 className="text-[16px] font-medium text-neutral-600 mb-8 z-10">技能正在生成中...</h2>
                   
                   <div className="space-y-4 z-10">
                      <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                         <div className="flex items-center gap-2 text-neutral-400">
                           <Search className="w-4 h-4" /> 快速检索代码内容
                         </div>
                         <div className="flex items-center gap-1">
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌘</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">F</kbd>
                           <span className="mx-1 text-neutral-300">/</span>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Ctrl</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">F</kbd>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                         <div className="flex items-center gap-2 text-neutral-400">
                           <List className="w-4 h-4" /> 切换文件目录可见性
                         </div>
                         <div className="flex items-center gap-1">
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌥</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">B</kbd>
                           <span className="mx-1 text-neutral-300">/</span>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Alt</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">B</kbd>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                         <div className="flex items-center gap-2 text-neutral-400">
                           <LayoutDashboard className="w-4 h-4" /> 切换底部面板可见性
                         </div>
                         <div className="flex items-center gap-1">
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌥</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">`</kbd>
                           <span className="mx-1 text-neutral-300">/</span>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Alt</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">`</kbd>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 text-[13px] justify-between w-[320px]">
                         <div className="flex items-center gap-2 text-neutral-400">
                           <Plus className="w-4 h-4" /> 打开新的默认标签页
                         </div>
                         <div className="flex items-center gap-1">
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">⌥</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">N</kbd>
                           <span className="mx-1 text-neutral-300">/</span>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">Alt</kbd>
                           <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-neutral-500 shadow-sm font-mono text-[11px]">N</kbd>
                         </div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center bg-white p-10 overflow-y-auto custom-scrollbar">
                   <div className="w-full flex justify-start mb-6">
                     <span className="text-[16px] font-bold text-neutral-800 border-b-2 border-neutral-800 pb-2">总览</span>
                   </div>
                   <div className="w-full max-w-[600px] flex flex-col gap-6 mt-4 pb-20">
                      <h2 className="text-[20px] font-bold text-neutral-900 text-center mb-2">开始部署你的项目吧</h2>
                      
                      <div className="flex flex-col gap-2">
                         <label className="text-[13px] font-bold text-neutral-700">部署版本</label>
                         <div className="border border-neutral-200 rounded-xl px-4 py-3 bg-white flex items-center justify-between cursor-pointer shadow-sm hover:border-neutral-300 transition-colors">
                            <div className="flex items-center gap-3">
                               <span className="text-[13px] font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">d690426</span>
                               <span className="text-[13px] text-neutral-600">feat: 创建信息图设计技能 infographic-designer</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-400">
                               <span className="text-[12px]">2 分钟前</span>
                               <ChevronDown className="w-4 h-4" />
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col gap-2">
                         <label className="text-[13px] font-bold text-neutral-700">
                           生产环境变量
                           <span className="block font-normal text-neutral-400 text-[12px] mt-0.5">查看、新增、修改或同步至生产环境的环境变量</span>
                         </label>
                         <div className="border border-neutral-200 rounded-xl px-4 py-3 bg-white flex items-center justify-between cursor-pointer shadow-sm hover:border-neutral-300 transition-colors mt-1">
                            <span className="text-[14px] text-neutral-800 font-medium">查看详情</span>
                            <ChevronRight className="w-4 h-4 text-neutral-400" />
                         </div>
                      </div>

                      <div className="border border-neutral-200 rounded-xl px-4 py-4 bg-white flex items-center justify-between shadow-sm">
                         <div className="flex items-center gap-2">
                           <span className="text-[14px] text-neutral-800 font-medium">加密部署</span>
                           <Info className="w-3.5 h-3.5 text-neutral-400" />
                         </div>
                         <div className="w-10 h-5 bg-neutral-200 rounded-full flex items-center px-0.5 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                         </div>
                      </div>

                      <button 
                         className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white py-3.5 rounded-xl text-[15px] font-bold shadow-md transition-colors mt-4"
                         onClick={() => {
                            alert('部署成功！');
                            setView('list');
                            setActiveBuilderTab('preview');
                         }}
                      >
                         开始部署
                      </button>
                   </div>
                </div>
             )}
             
             {/* Terminal Footer */}
             <div className="h-10 border-t border-neutral-200 flex items-center justify-between px-4 text-[12px] text-neutral-400 bg-white shrink-0 absolute bottom-0 left-0 right-0 z-10">
                <span className="font-bold text-neutral-800">终端</span>
                <div className="flex items-center gap-4">
                   <span>已使用 / 空间总容量: <strong className="text-neutral-700">248KB</strong> / 1.0GB</span>
                   <button className="px-2 py-0.5 border border-neutral-200 rounded text-neutral-600 hover:bg-neutral-50 transition-colors bg-white">清理</button>
                   <div className="flex items-center gap-3">
                     <button className="hover:text-neutral-700"><Plus className="w-3.5 h-3.5"/></button>
                     <button className="hover:text-neutral-700"><Maximize2 className="w-3.5 h-3.5"/></button>
                     <button className="hover:text-neutral-700"><ChevronUp className="w-3.5 h-3.5"/></button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 4. CHAT VIEW (Full screen overlay) ---
  const renderChatView = () => {
    const historyItems = [
      "根据主页描述设计理念",
      "解释图片内容",
      "设计十年简历",
      "写获奖感言"
    ];

    const suggestionPills = [
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
      <div className="fixed inset-0 z-[200] bg-white flex h-screen w-screen font-sans overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[260px] bg-[#f9f9f9] border-r border-neutral-200 flex flex-col shrink-0">
          <div className="h-16 flex items-center px-5 gap-2 text-[#fa541c] font-bold text-[18px]">
            <Layers className="w-5 h-5" /> 翼实训平台
          </div>
          <div className="px-5 py-3 text-[12px] text-neutral-400 font-medium">历史对话</div>
          <div className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
            {historyItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-neutral-200/50 cursor-pointer text-[13.5px] text-neutral-600 transition-colors">
                <MessageSquare className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-neutral-500">
            <button className="flex items-center gap-2 text-[13px] hover:text-neutral-800 transition-colors">
              <Info className="w-4 h-4" /> 关于翼实训平台
            </button>
            <button className="p-1.5 hover:bg-neutral-200 rounded-md transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Main Area */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header */}
          <div className="h-14 border-b border-neutral-100 flex items-center justify-center relative shrink-0">
            <button 
              onClick={() => setShowChat(false)}
              className="absolute left-4 p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[15px] text-neutral-800">使用最佳实践</span>
              <span className="text-[11px] text-neutral-400">通过对话运行与体验</span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto flex flex-col relative custom-scrollbar">
            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-[800px] mx-auto w-full mt-[-8vh]">
              <h2 className="text-[32px] font-medium text-neutral-900 mb-10 tracking-wide">下午好！有新的工作安排吗？</h2>
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {suggestionPills.map((pill, i) => (
                  <button 
                    key={i} 
                    className="bg-neutral-50 border border-neutral-100 hover:border-orange-200 hover:bg-orange-50 hover:text-[#fa541c] text-neutral-600 px-5 py-2.5 rounded-full text-[14px] transition-all whitespace-nowrap"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Container */}
            <div className="w-full max-w-[850px] mx-auto p-4 pb-8 shrink-0 relative bg-white">
              <div className="border border-blue-100 hover:border-blue-300 focus-within:border-blue-400 focus-within:shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)] rounded-[24px] bg-white transition-all flex flex-col overflow-hidden">
                <textarea 
                  className="w-full resize-none outline-none min-h-[70px] px-5 pt-4 text-[15px] text-neutral-800 placeholder:text-neutral-400 bg-transparent"
                  placeholder="发消息或输入'/'选择技能"
                  value={builderInput}
                  onChange={(e) => setBuilderInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      if (e.nativeEvent.isComposing) return;
                      e.preventDefault();
                      if (builderInput.trim()) {
                        setShowChat(false);
                        navigate('/practice-chat');
                      }
                    }
                  }}
                />
                
                {/* Tools Bar */}
                <div className="px-4 pb-3 pt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar text-neutral-500">
                    <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors group">
                      <Paperclip className="w-[18px] h-[18px] group-hover:text-neutral-800" />
                    </button>
                    <div className="w-[1px] h-4 bg-neutral-200 mx-1 shrink-0"></div>
                    
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <Zap className="w-4 h-4 group-hover:text-orange-500" /> 快速
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <ImageIcon className="w-4 h-4 group-hover:text-blue-500" /> 图像生成
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <Edit3 className="w-4 h-4 group-hover:text-emerald-500" /> 帮我写作
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <Languages className="w-4 h-4 group-hover:text-purple-500" /> 翻译
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <Code2 className="w-4 h-4 group-hover:text-rose-500" /> 编程
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <Search className="w-4 h-4 group-hover:text-indigo-500" /> 深入研究
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-[13px] font-medium whitespace-nowrap group">
                      <LayoutGrid className="w-4 h-4 group-hover:text-neutral-800" /> 更多
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 pl-2 shrink-0">
                    <button className="p-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800 rounded-full transition-colors flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (builderInput.trim()) {
                          setShowChat(false);
                          navigate('/practice-chat');
                        }
                      }}
                      className={cn(
                        "p-2 rounded-full transition-colors flex items-center justify-center",
                        builderInput.trim() ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  };

  const renderCreateModal = () => {
    if (!showCreateModal) return null;
    
    return (
      <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[640px] flex flex-col max-h-[90vh] overflow-hidden relative">
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
            <h2 className="text-[20px] font-bold text-neutral-900">创建最佳实践</h2>
            <button onClick={() => setShowCreateModal(false)} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-neutral-50/30">
            {createStep === 1 ? (
              <div className="flex flex-col gap-4">
                <div 
                  onClick={() => {
                    setShowCreateModal(false);
                    navigate('/practice-chat');
                  }}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-start gap-5 cursor-pointer hover:border-[#fa541c] hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Plus className="w-7 h-7" />
                  </div>
                  <div className="flex-1 mt-1">
                    <h3 className="text-[17px] font-bold text-neutral-900 mb-1.5 group-hover:text-[#fa541c] transition-colors">对话创建</h3>
                    <p className="text-[14px] text-neutral-500 leading-relaxed">根据需求从零搭建专属的智能对话、业务流程或数据处理管道</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-start gap-5 cursor-pointer hover:border-[#fa541c] hover:shadow-md transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Store className="w-7 h-7" />
                  </div>
                  <div className="flex-1 mt-1">
                    <h3 className="text-[17px] font-bold text-neutral-900 mb-1.5 group-hover:text-[#fa541c] transition-colors">从模板创建</h3>
                    <p className="text-[14px] text-neutral-500 leading-relaxed">探索并添加经过专家验证的预置最佳实践模板，即刻开启使用</p>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-start gap-5 cursor-pointer hover:border-[#fa541c] hover:shadow-md transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileCode className="w-7 h-7" />
                  </div>
                  <div className="flex-1 mt-1">
                    <h3 className="text-[17px] font-bold text-neutral-900 mb-1.5 group-hover:text-[#fa541c] transition-colors">导入配置</h3>
                    <p className="text-[14px] text-neutral-500 leading-relaxed">快速恢复历史流程结构，或导入第三方提供的配置文件</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCreateStep(1)}
                    className="flex items-center gap-1 text-[#fa541c] hover:text-[#e84a15] text-[14px] font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> 返回选择方式
                  </button>
                </div>

                <div className="space-y-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-neutral-600 font-bold mb-2 flex items-center gap-1">
                        <span className="text-red-500">*</span> 最佳实践名称
                      </label>
                      <input type="text" placeholder="请输入名称..." className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-[13px] text-neutral-600 font-bold mb-2 flex items-center gap-1">标题</label>
                      <input type="text" placeholder="请输入标题..." className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 flex items-center gap-1">
                      <span className="text-red-500">*</span> 业务场景
                    </label>
                    <input type="text" placeholder="描述适用的业务场景..." className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[13px] text-neutral-600 font-bold mb-2 flex items-center gap-1">分类</label>
                      <select className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all text-neutral-600">
                        <option value="">选择分类...</option>
                        <option value="data">数据处理</option>
                        <option value="model">模型训练</option>
                        <option value="viz">可视化</option>
                        <option value="chat">对话交互</option>
                        <option value="code">代码开发</option>
                        <option value="image">图像生成</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] text-neutral-600 font-bold mb-2 flex items-center gap-1">难度</label>
                      <select className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all text-neutral-600">
                        <option value="low">初阶</option>
                        <option value="mid">中阶</option>
                        <option value="high">高阶</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 flex items-center gap-1">适用场景</label>
                    <input type="text" placeholder="适用场景标签，用逗号分隔..." className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all" />
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 block">描述</label>
                    <textarea placeholder="最佳实践的简要描述..." className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] resize-none bg-neutral-50/50 transition-all" />
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 block">详细步骤</label>
                    <textarea placeholder="记录解决问题的方法和经验，以及详细操作步骤..." className="w-full h-24 px-3 py-2 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] resize-none bg-neutral-50/50 transition-all" />
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 block">代码示例</label>
                    <textarea placeholder="输入代码段..." className="w-full h-24 px-3 py-2 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] resize-none bg-neutral-50/50 font-mono transition-all" />
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 block">参考资源</label>
                    <input type="text" placeholder="相关文档链接、教程链接..." className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] outline-none text-[13px] bg-neutral-50/50 transition-all" />
                  </div>

                  <div>
                    <label className="text-[13px] text-neutral-600 font-bold mb-2 block">附件上传</label>
                    <div className="border border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center bg-neutral-50/50 hover:bg-neutral-100 transition-colors cursor-pointer group">
                      <Download className="w-6 h-6 text-neutral-400 mb-2 group-hover:text-[#fa541c] transition-colors" />
                      <span className="text-[13px] text-neutral-600 font-medium group-hover:text-[#fa541c] transition-colors">点击或拖拽文件到此处上传</span>
                      <span className="text-[11px] text-neutral-400 mt-1">支持 .pdf, .docx, .zip, 最大 50MB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {createStep === 2 && (
            <div className="p-5 border-t border-neutral-100 bg-white">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white border border-neutral-200 text-neutral-600 h-11 rounded-xl text-[14px] font-medium hover:bg-neutral-50 transition-all"
                >
                  保存为私有草稿
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white border border-neutral-200 text-[#fa541c] h-11 rounded-xl text-[14px] font-medium hover:bg-orange-50 transition-all"
                >
                  保存并申请公开
                </button>
                <button 
                  onClick={() => {
                    setShowCreateModal(false);
                    navigate('/practice-chat');
                  }}
                  className="flex-[1.2] bg-[#fa541c] hover:bg-[#e84a15] text-white h-11 rounded-xl text-[14px] font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-4 h-4" /> 对话生成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {view === 'list' && renderListView()}
      {view === 'detail' && renderDetailView()}
      {view === 'builder' && renderBuilderView()}
      {showChat && renderChatView()}
      {renderCreateModal()}
    </div>
  );
}

// Icon helper components
function WorkflowIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="8" x="3" y="3" rx="2" /><path d="M7 11v4a2 2 0 0 0 2 2h4" /><rect width="8" height="8" x="13" y="13" rx="2" /></svg>;
}

function BoxIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
}
