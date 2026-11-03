import React, { useState, useEffect } from "react";
import { 
  Database, LayoutGrid, List, Search, Filter, ArrowUpRight, CheckCircle, 
  AlertTriangle, Clock, X, Info, Download, Trash2, Edit, Eye, EyeOff, Play, 
  BarChart2, RefreshCw, Layers, ShieldCheck, Terminal, BookOpen, Cpu, 
  HelpCircle, Server, FileText, Check, Copy, AlertCircle, RefreshCcw, Send,
  BookmarkCheck, PlusCircle, CheckSquare, Square, ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---

interface ResourceOutline {
  title: string;
  duration?: string;
  description?: string;
}

interface TenantReference {
  tenantName: string;
  logo: string;
  referencedAt: string;
  activeStudents: number;
}

interface PublicResource {
  id: string;
  name: string;
  type: "course" | "project" | "dataset" | "practice" | "ai_capacity";
  logo: string;
  description: string;
  creator: string;
  creatorRole: string;
  fileSize: string;
  referencesCount: number;
  downloadsCount: number;
  status: "已上架" | "已下架";
  takeDownReason?: string;
  takeDownDate?: string;
  createdAt: string;
  dependencies: string[];
  outline: ResourceOutline[];
  references: TenantReference[];
}

// --- Initial Mock Data ---

const initialResources: PublicResource[] = [
  {
    id: "RES-2026-001",
    name: "Python数据分析与大模型实战课程",
    type: "course",
    logo: "🐍",
    description: "全面讲解 NumPy, Pandas 数据处理，并配合 DeepSeek API 接入开发简单智能数据看板的实训课程包。",
    creator: "张瑞林 副教授",
    creatorRole: "复旦大学计算机系",
    fileSize: "85.4 MB",
    referencesCount: 42,
    downloadsCount: 1204,
    status: "已上架",
    createdAt: "2026-01-15",
    dependencies: ["Python 3.10+", "Pandas 2.1.0", "JupyterLab"],
    outline: [
      { title: "第一章: Python数据科学与Pandas开发底蕴", duration: "2小时", description: "掌握 DataFrame 核心操作与海量 CSV 高性能读取技巧。" },
      { title: "第二章: Matplotlib 与 Seaborn 精美图像绘制", duration: "3小时", description: "学习折线图、直方图以及多轴复合图表的绘制。" },
      { title: "第三章: 智云 API 挂载与大模型交互基础", duration: "4小时", description: "编写首个 ChatCompletion 大模型本地对话分析工具。" }
    ],
    references: [
      { tenantName: "北京大学信息学院", logo: "🎓", referencedAt: "2026-02-01", activeStudents: 340 },
      { tenantName: "清华大学计算机系", logo: "🏛️", referencedAt: "2026-02-15", activeStudents: 520 },
      { tenantName: "复旦大学软件学院", logo: "🛡️", referencedAt: "2026-03-01", activeStudents: 280 }
    ]
  },
  {
    id: "RES-2026-002",
    name: "MNIST手写数字高维分类基准数据集",
    type: "dataset",
    logo: "🔢",
    description: "包含 60,000 张训练图像和 10,000 张测试图像的标准 MNIST 数据集，采用 IDX 二进制高维格式压缩封装。",
    creator: "平台系统管理员",
    creatorRole: "智云运营超管",
    fileSize: "11.6 MB",
    referencesCount: 98,
    downloadsCount: 4520,
    status: "已上架",
    createdAt: "2026-01-10",
    dependencies: [" IDX Reader", "TensorFlow 2.x / PyTorch 2.x"],
    outline: [
      { title: "文件 1: train-images-idx3-ubyte.gz (训练图片)", duration: "60000张", description: "手写体灰度图像高维数据矩阵二进制文件。" },
      { title: "文件 2: train-labels-idx1-ubyte.gz (训练标签)", duration: "60000个", description: "0-9手写体图片对应的分类数字真实标签。" }
    ],
    references: [
      { tenantName: "北京大学信息学院", logo: "🎓", referencedAt: "2026-01-20", activeStudents: 410 },
      { tenantName: "清华大学计算机系", logo: "🏛️", referencedAt: "2026-02-10", activeStudents: 680 },
      { tenantName: "西安交通大学AI实验班", logo: "🤖", referencedAt: "2026-02-28", activeStudents: 120 }
    ]
  },
  {
    id: "RES-2026-003",
    name: "大语言模型分布式微调最佳实践",
    type: "practice",
    logo: "🏆",
    description: "内置分布式微调 Megatron-LM 与 DeepSpeed 混合架构最佳配置脚本，指导多机多卡 GPU 分布式实训环境高效运作。",
    creator: "李教授",
    creatorRole: "清华大学计算机系",
    fileSize: "15.2 MB",
    referencesCount: 24,
    downloadsCount: 450,
    status: "已上架",
    createdAt: "2026-02-28",
    dependencies: ["Megatron-LM v0.4.0", "DeepSpeed 0.12.3", "PyTorch 2.2"],
    outline: [
      { title: "步骤 1: Megatron-LM 分布式框架环境配置", duration: "20分钟", description: "设定主从节点网络拓扑，连通多机多卡训练通信管道。" },
      { title: "步骤 2: DeepSpeed 混合精度与 Zero 显存优化", duration: "1.5小时", description: "设定 Zero-3 策略参数，将大模型权重与梯度高效分片挂载。" },
      { title: "步骤 3: 启动分布式训练脚本核验与吞吐量监控", duration: "30分钟", description: "监控多节点吞吐指标，完成 70B 模型分布式微调最佳实践调试。" }
    ],
    references: [
      { tenantName: "清华大学计算机系", logo: "🏛️", referencedAt: "2026-03-01", activeStudents: 210 },
      { tenantName: "哈尔滨工业大学计算学部", logo: "🛸", referencedAt: "2026-03-10", activeStudents: 180 }
    ]
  },
  {
    id: "RES-2026-004",
    name: "云原生高并发 K8s 拓扑实训项目",
    type: "project",
    logo: "🐳",
    description: "内置三节点 K8s 集群实训配置文件，挂载 Prometheus + Grafana 动态网络监控与弹性扩缩容拓扑。",
    creator: "张经理",
    creatorRole: "百度智能云研发部",
    fileSize: "142 MB",
    referencesCount: 15,
    downloadsCount: 320,
    status: "已上架",
    createdAt: "2026-03-05",
    dependencies: ["Docker 24+", "Kubernetes 1.28", "Helm 3"],
    outline: [
      { title: "阶段 1: 部署多微服务集群 Master 核心节点", duration: "30分钟", description: "执行 kubeadm init 并建立 Pod flannel 网络覆盖。" },
      { title: "阶段 2: 注入模拟突发高负载流量并触发扩容", duration: "1小时", description: "测试 HPA 弹性组件在 QPS 突增时自动拉起新 Replica。" }
    ],
    references: [
      { tenantName: "哈尔滨工业大学计算学部", logo: "🛸", referencedAt: "2026-03-15", activeStudents: 150 },
      { tenantName: "百度智能云研发部", logo: "☁️", referencedAt: "2026-03-20", activeStudents: 80 }
    ]
  },
  {
    id: "RES-2026-005",
    name: "大模型 RAG 向量重排检索数据集",
    type: "dataset",
    logo: "🗂️",
    description: "包含 50,000 条中文问答 high 维向量数据，支持 Milvus 向量库直接导入及 BGE-Reranker 检索性能测试评估。",
    creator: "刘松林 教授",
    creatorRole: "哈尔滨工业大学计算学部",
    fileSize: "285 MB",
    referencesCount: 18,
    downloadsCount: 520,
    status: "已上架",
    createdAt: "2026-03-12",
    dependencies: ["Milvus 2.4", "PyMilvus SDK"],
    outline: [
      { title: "数据集 1: raw_corpus.json (知识语料原始段落)", duration: "50000段", description: "用于大模型外挂知识库切片的中文清洗纯文本语料。" },
      { title: "数据集 2: dense_embeddings.npy (向量特征文件)", duration: "1024维", description: "基于 bge-large-zh 生成的高维多维向量二进制矩阵。" }
    ],
    references: [
      { tenantName: "北京大学信息学院", logo: "🎓", referencedAt: "2026-03-20", activeStudents: 190 },
      { tenantName: "哈尔滨工业大学计算学部", logo: "🛸", referencedAt: "2026-03-25", activeStudents: 220 }
    ]
  },
  {
    id: "RES-2026-006",
    name: "通用中英文口语发音流畅度智能评估能力",
    type: "ai_capacity",
    logo: "🎙️",
    description: "对外挂载标准的高吞吐量流式音频语音发音评测接口，支持识别音素错漏、重音偏移、语速卡顿等多维度多模态指标。",
    creator: "吴教授",
    creatorRole: "南京大学外国语学院",
    fileSize: "42 KB",
    referencesCount: 12,
    downloadsCount: 210,
    status: "已上架",
    createdAt: "2026-04-01",
    dependencies: ["Whisper-v3 API", "SLA 150ms", "JSON Payload"],
    outline: [
      { title: "接口规格", duration: "POST", description: "POST /api/v1/speech/eval (Payload: audio_file, target_text)" },
      { title: "吞吐量限制", duration: "50 QPS", description: "单租户默认并发数 50 QPS, 可按需配额扩增" }
    ],
    references: [
      { tenantName: "南京大学信息学院", logo: "🎓", referencedAt: "2026-04-10", activeStudents: 140 }
    ]
  }
];

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "course" | "project" | "dataset" | "practice" | "ai_capacity">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Dynamic Databases ---
  const [resources, setResources] = useState<PublicResource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "popularity" | "size">("popularity");

  // Interactive controls
  const [selectedResource, setSelectedResource] = useState<PublicResource | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  // Use / Deploy sandbox test
  const [showUseModal, setShowUseModal] = useState(false);
  const [deployStep, setDeployStep] = useState<"idle" | "pulling" | "mounting" | "checking" | "success">("idle");
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  
  // Take down reject modal
  const [showTakeDownModal, setShowTakeDownModal] = useState(false);
  const [takeDownReason, setTakeDownReason] = useState("技术栈版本过时");
  const [customTakeDownReason, setCustomTakeDownReason] = useState("");
  const [takeDownSuggestion, setTakeDownSuggestion] = useState("");
  const [takeDownNotifyEmail, setTakeDownNotifyEmail] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Handlers ---

  // Sandbox deploy simulation
  const handleSimulateSandboxDeploy = (r: PublicResource) => {
    setDeployStep("pulling");
    setDeployLogs([]);
    
    const logs = [
      `[info] 智云 Sandbox-Broker 初始化拉取资源 ID: ${r.id}...`,
      `[Docker] 正在寻找符合 "${r.dependencies[0]}" 的标准容器镜像基础镜像...`,
      `[Docker] 基础运行沙箱环境拉取成功: SHA256 matches verified.`,
      `[MinIO] 正在云端网关物理挂载资源数据包: [${r.fileSize}] 载入中...`,
      `[MinIO] 块挂载成功！已在 /mnt/zhiyun_public_assets 挂载点建立硬链接。`,
      `[health] 注入模拟请求进行 API 健康校验，等待状态码 200 OK...`,
      `[success] API 校验成功！延迟 12ms。资源依赖项 [${r.dependencies.slice(1).join(", ")}] 完全匹配。`,
      `[Sandbox] 恭喜！平台超管专属测试沙箱实例部署完毕，已为您提供热运行调试入口。`
    ];

    logs.forEach((log, i) => {
      setTimeout(() => {
        setDeployLogs(prev => [...prev, log]);
        if (i === 2) setDeployStep("mounting");
        if (i === 5) setDeployStep("checking");
        if (i === 7) setDeployStep("success");
      }, (i + 1) * 700);
    });
  };

  // Confirm take down reject
  const handleConfirmTakeDown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    const finalReason = takeDownReason === "其他原因" ? customTakeDownReason : takeDownReason;

    setResources(resources.map(res => {
      if (res.id === selectedResource.id) {
        return {
          ...res,
          status: "已下架",
          takeDownReason: finalReason || "运营维护下架",
          takeDownDate: new Date().toISOString().split("T")[0]
        };
      }
      return res;
    }));

    setShowTakeDownModal(false);
    triggerToast(`🗑️ 成功将资源「${selectedResource.name}」驳回并强制下架，全平台已对师生隐藏`);
  };

  // Re-publish take down resource
  const handleRepublishResource = (r: PublicResource) => {
    setResources(resources.map(res => {
      if (res.id === r.id) {
        return {
          ...res,
          status: "已上架",
          takeDownReason: undefined,
          takeDownDate: undefined
        };
      }
      return res;
    }));
    triggerToast(`🎉 成功将资源「${r.name}」重新上架，资源即时对全平台恢复可见`);
  };

  // --- Real-time sorting and filtering ---
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || r.type === activeTab;
    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    if (sortBy === "createdAt") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "popularity") return b.referencesCount - a.referencesCount;
    if (sortBy === "size") {
      // rough size parsing
      const parseSize = (s: string) => {
        const val = parseFloat(s);
        if (s.includes("GB")) return val * 1024;
        return val;
      };
      return parseSize(b.fileSize) - parseSize(a.fileSize);
    }
    return 0;
  });

  // KPI summaries
  const totalAssets = resources.filter(r => r.status === "已上架").length;
  const totalReferences = resources.filter(r => r.status === "已上架").reduce((acc, r) => acc + r.referencesCount, 0);
  const totalDownloads = resources.filter(r => r.status === "已上架").reduce((acc, r) => acc + r.downloadsCount, 0);

  return (
    <div className="flex-1 bg-[#f5f6f8] flex flex-col min-h-0 text-neutral-800 font-sans p-6 space-y-6">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3.5 border border-neutral-800 text-xs font-bold animate-slide-up select-none">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-black text-neutral-title flex items-center gap-2.5">
            <Database className="w-6 h-6 text-[#fa541c]" />
            <span>翼实训平台运营端 - 公共实训资源控制台</span>
          </h1>
          <p className="text-xs text-neutral-caption mt-1">
            超级管理员对实训平台中所有已审核通过的课程、项目、数据集、最佳实践、ai能力执行集中管控、在线结构化查看、沙箱部署以及违规驳回下架。
          </p>
        </div>

        <span className="text-[10px] text-neutral-caption font-semibold pr-3 hidden sm:inline bg-white px-3 py-1.5 border border-neutral-200 rounded-lg shadow-3xs">
          🛡️ 公共资源沙箱隔离引擎: 热备在线
        </span>
      </div>

      {/* KPI stats & Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0 select-none">
        {/* Statistics Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "在架公共实训资源", val: totalAssets, desc: "覆盖五类资源格式", icon: Layers, color: "text-[#fa541c]" },
            { title: "高校租户引用总量", val: `${totalReferences} 次`, desc: "已被引入实训班级", icon: BookmarkCheck, color: "text-emerald-600" },
            { title: "环境部署可用性", val: "99.85 %", desc: "今日测试挂载成功率", icon: ShieldCheck, color: "text-blue-600" },
            { title: "运营总下载热度", val: `${totalDownloads} 次`, desc: "课件/数据集提取总量", icon: Download, color: "text-purple-600" }
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex justify-between items-center opacity-85">
                <span className="text-[10px] font-black uppercase tracking-wider">{card.title}</span>
                <card.icon className="w-4 h-4 text-neutral-caption" />
              </div>
              <div className="my-2.5">
                <span className={cn("text-2xl font-black font-mono leading-none", card.color)}>{card.val}</span>
              </div>
              <span className="text-[10px] text-neutral-caption font-semibold">{card.desc}</span>
            </div>
          ))}
        </div>

        {/* Small SVG Category Distribution (Col 1) */}
        <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5 max-w-[130px]">
            <span className="text-[10px] font-black text-neutral-caption uppercase tracking-wider block">资源品类引用分布</span>
            <div className="space-y-1 text-[9px] font-bold text-neutral-body leading-none">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#fa541c] rounded-xs" /><span>课程资源 30%</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-xs" /><span>实训项目 25%</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-xs" /><span>数据集 20%</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-indigo-500 rounded-xs" /><span>最佳实践 15%</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-purple-500 rounded-xs" /><span>AI能力 10%</span></div>
            </div>
          </div>
          
          {/* Simple circular gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-neutral-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#fa541c]" strokeWidth="4.2" strokeDasharray="30, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-emerald-500" strokeWidth="4.2" strokeDasharray="25, 100" strokeDashoffset="-30" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-500" strokeWidth="4.2" strokeDasharray="20, 100" strokeDashoffset="-55" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-indigo-500" strokeWidth="4.2" strokeDasharray="15, 100" strokeDashoffset="-75" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-purple-500" strokeWidth="4.2" strokeDasharray="10, 100" strokeDashoffset="-90" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Tab Category Navigation */}
      <div className="bg-white rounded-xl border border-neutral-border shadow-3xs p-1 select-none shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: "all", title: "全部已审公共资源", icon: LayoutGrid },
            { id: "course", title: "课程", icon: BookOpen, badge: resources.filter(r => r.type === "course" && r.status === "已上架").length },
            { id: "project", title: "项目", icon: Layers, badge: resources.filter(r => r.type === "project" && r.status === "已上架").length },
            { id: "dataset", title: "数据集", icon: Database, badge: resources.filter(r => r.type === "dataset" && r.status === "已上架").length },
            { id: "practice", title: "最佳实践", icon: ThumbsUp, badge: resources.filter(r => r.type === "practice" && r.status === "已上架").length },
            { id: "ai_capacity", title: "ai能力", icon: Cpu, badge: resources.filter(r => r.type === "ai_capacity" && r.status === "已上架").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-0",
                activeTab === tab.id 
                  ? "bg-[#fff2e8] text-[#fa541c]" 
                  : "text-neutral-body hover:bg-neutral-50 hover:text-neutral-title"
              )}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.title}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full scale-90 bg-[#fa541c] text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View Mode layout toggler */}
        <div className="flex items-center gap-1 pr-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded cursor-pointer transition-colors border-0 bg-transparent", viewMode === "grid" ? "bg-neutral-100 text-[#fa541c]" : "text-neutral-caption hover:text-neutral-body")}
            title="卡片网格大图展示"
          >
            <LayoutGrid className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-1.5 rounded cursor-pointer transition-colors border-0 bg-transparent", viewMode === "list" ? "bg-neutral-100 text-[#fa541c]" : "text-neutral-caption hover:text-neutral-body")}
            title="紧凑名录表格展示"
          >
            <List className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between select-none shrink-0">
        
        {/* Search */}
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索公共资源名称、编号、作者姓名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-body w-full md:w-auto justify-end">
          <span>资源排序权重:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-neutral-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-[#fa541c] text-neutral-title"
          >
            <option value="popularity">按全平台租户引用热度</option>
            <option value="createdAt">按最新通过审核上架时间</option>
            <option value="size">按物理资源存储大小排行</option>
          </select>
        </div>

      </div>

      {/* ==================== 1. GRID CARDS VIEW MODE ==================== */}
      {viewMode === "grid" && (
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 min-h-[300px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {filteredResources.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border p-16 text-center text-neutral-400 font-semibold select-none">
                <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <span>没有检索到匹配当前品类和筛选的已审核公共资源。</span>
              </div>
            ) : (
              filteredResources.map((r) => {
                const isDown = r.status === "已下架";
                return (
                  <div 
                    key={r.id}
                    className={cn(
                      "bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-3xs transition-all duration-200 relative group",
                      isDown 
                        ? "border-neutral-200 bg-neutral-50/40 text-neutral-400 opacity-75" 
                        : "border-neutral-border hover:border-[#ffbb96] hover:shadow-2xs"
                    )}
                  >
                    {/* Status Badge Tag */}
                    <span className={cn(
                      "absolute top-4 right-4 px-2 py-0.5 rounded text-[9.5px] font-black border uppercase tracking-wider select-none",
                      isDown ? "bg-neutral-100 border-neutral-300 text-neutral-500" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                    )}>
                      {r.status}
                    </span>

                    {/* Logo & Info */}
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-xl select-none shrink-0 shadow-3xs">
                          {r.logo}
                        </span>
                        <div className="min-w-0 pr-12">
                          <h3 
                            onClick={() => { setSelectedResource(r); setShowDetailDrawer(true); }}
                            className={cn(
                              "font-black text-xs leading-snug truncate cursor-pointer hover:underline block",
                              isDown ? "text-neutral-body" : "text-neutral-title hover:text-[#fa541c]"
                            )}
                            title="点击查看资源完整结构"
                          >
                            {r.name}
                          </h3>
                          <span className="text-[10px] text-neutral-caption font-mono font-bold block mt-0.5">
                            ID: {r.id} · 体积: {r.fileSize}
                          </span>
                        </div>
                      </div>

                      <p className={cn(
                        "text-[11px] leading-relaxed line-clamp-3 font-semibold",
                        isDown ? "text-neutral-caption" : "text-neutral-body"
                      )}>
                        {r.description}
                      </p>

                      {/* Dependencies chips */}
                      <div className="flex flex-wrap gap-1">
                        {r.dependencies.map((dep, i) => (
                          <span key={i} className="bg-neutral-50 text-neutral-caption border border-neutral-200/50 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata & CTA Action buttons */}
                    <div className="border-t border-neutral-100/80 pt-4 mt-5 space-y-4">
                      
                      {/* Meta counters */}
                      <div className="flex justify-between items-center text-[10.5px] font-bold text-neutral-caption">
                        <span>提供人: <span className="font-bold text-neutral-title">{r.creator}</span></span>
                        <div className="flex items-center gap-2 font-mono">
                          <span>引用: <span className="font-bold text-neutral-title">{r.referencesCount}次</span></span>
                          <span>下载: <span className="font-bold text-neutral-title">{r.downloadsCount}次</span></span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-2">
                        {/* View detail */}
                        <button
                          onClick={() => { setSelectedResource(r); setShowDetailDrawer(true); }}
                          className="bg-neutral-50 hover:bg-neutral-100 text-neutral-title font-bold px-3 py-1.8 border border-neutral-200 rounded-lg flex-1 cursor-pointer transition-colors text-center flex items-center justify-center gap-1 shadow-3xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>查看大纲</span>
                        </button>

                        {/* Sandbox Use */}
                        <button
                          onClick={() => { setSelectedResource(r); setDeployStep("idle"); setDeployLogs([]); setShowUseModal(true); }}
                          disabled={isDown}
                          className={cn(
                            "font-bold px-3 py-1.8 rounded-lg flex-1 cursor-pointer transition-colors text-center flex items-center justify-center gap-1 shadow-3xs",
                            isDown 
                              ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                              : "bg-white hover:bg-neutral-50 text-neutral-title border border-neutral-200"
                          )}
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-500" />
                          <span>测试部署</span>
                        </button>

                        {/* Take down / Re-publish */}
                        {isDown ? (
                          <button
                            onClick={() => handleRepublishResource(r)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-black px-3.5 py-1.8 border border-emerald-200 rounded-lg flex-1 cursor-pointer transition-colors text-center flex items-center justify-center gap-1 shadow-3xs"
                          >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            <span>重新上架</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { setSelectedResource(r); setTakeDownReason("技术栈版本过时"); setCustomTakeDownReason(""); setTakeDownSuggestion(""); setShowTakeDownModal(true); }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-black px-3.5 py-1.8 border border-rose-200 rounded-lg flex-1 cursor-pointer transition-colors text-center flex items-center justify-center gap-1 shadow-3xs"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>驳回下架</span>
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>
      )}

      {/* ==================== 2. COMPACT LIST VIEW MODE ==================== */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-grow flex flex-col min-h-[300px]">
          <div className="overflow-x-auto flex-grow custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11px] text-neutral-600 font-black uppercase tracking-wider select-none">
                  <th className="px-6 py-4">资源编号与标志</th>
                  <th className="px-6 py-4">已审核公共资源名称</th>
                  <th className="px-6 py-4">上传创建人</th>
                  <th className="px-6 py-4">存储容量大小</th>
                  <th className="px-6 py-4">全网累计引用次数</th>
                  <th className="px-6 py-4">累计下载量</th>
                  <th className="px-6 py-4">上架启用日期</th>
                  <th className="px-6 py-4 text-center">状态</th>
                  <th className="px-6 py-4 text-center">管控指令</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-sans">
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-neutral-400 font-semibold select-none">
                      <AlertCircle className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                      <span>未检索到匹配的已审核公共资源列表项。</span>
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((r) => {
                    const isDown = r.status === "已下架";
                    return (
                      <tr key={r.id} className={cn(
                        "hover:bg-neutral-50/10 transition-colors",
                        isDown ? "bg-neutral-50/30 text-neutral-400" : ""
                      )}>
                        
                        {/* ID & Logo */}
                        <td className="px-6 py-4 font-mono font-bold text-neutral-body">
                          <div className="flex items-center gap-2">
                            <span className="text-base select-none">{r.logo}</span>
                            <span>{r.id}</span>
                          </div>
                        </td>

                        {/* Name & Type tag */}
                        <td className="px-6 py-4 max-w-[240px]">
                          <div className="space-y-1 min-w-0">
                            <span 
                              onClick={() => { setSelectedResource(r); setShowDetailDrawer(true); }}
                              className={cn(
                                "font-black block truncate cursor-pointer hover:underline",
                                isDown ? "text-neutral-body" : "text-neutral-title hover:text-[#fa541c]"
                              )}
                              title={r.name}
                            >
                              {r.name}
                            </span>
                            <span className="text-[10px] font-semibold text-neutral-caption block">
                              类型: <span className="font-bold text-[#fa541c]">
                                {r.type === 'course' ? '课程' : 
                                 r.type === 'project' ? '项目' : 
                                 r.type === 'dataset' ? '数据集' : 
                                 r.type === 'practice' ? '最佳实践' : 'ai能力'}
                              </span>
                            </span>
                          </div>
                        </td>

                        {/* Creator */}
                        <td className="px-6 py-4">
                          <div className="space-y-0.5 font-bold">
                            <span className="text-neutral-title block">{r.creator}</span>
                            <span className="text-[10px] text-neutral-caption block font-normal">{r.creatorRole}</span>
                          </div>
                        </td>

                        {/* File size */}
                        <td className="px-6 py-4 font-mono font-bold text-neutral-body">
                          {r.fileSize}
                        </td>

                        {/* References count */}
                        <td className="px-6 py-4 font-mono font-black text-neutral-title">
                          {r.referencesCount} 次
                        </td>

                        {/* Downloads */}
                        <td className="px-6 py-4 font-mono font-bold text-neutral-caption">
                          {r.downloadsCount} 次
                        </td>

                        {/* Created at */}
                        <td className="px-6 py-4 font-mono text-[11px] text-neutral-caption font-semibold">
                          {r.createdAt}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider",
                            isDown ? "bg-neutral-100 border-neutral-300 text-neutral-500" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                          )}>
                            {r.status}
                          </span>
                        </td>

                        {/* Command CTA */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3 font-black">
                            <button
                              onClick={() => { setSelectedResource(r); setShowDetailDrawer(true); }}
                              className="text-neutral-500 hover:text-neutral-900 cursor-pointer flex items-center gap-0.5"
                              title="预览资源大纲结构"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>查看</span>
                            </button>
                            
                            <button
                              onClick={() => { setSelectedResource(r); setDeployStep("idle"); setDeployLogs([]); setShowUseModal(true); }}
                              disabled={isDown}
                              className={cn(
                                "flex items-center gap-0.5 cursor-pointer",
                                isDown ? "text-neutral-300 cursor-not-allowed" : "text-emerald-600 hover:text-emerald-800"
                              )}
                              title="沙箱热测试与引用名录"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>测试</span>
                            </button>

                            {isDown ? (
                              <button
                                onClick={() => handleRepublishResource(r)}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5"
                                title="重新发布对全平台可见"
                              >
                                <RefreshCcw className="w-3.5 h-3.5" />
                                <span>上架</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => { setSelectedResource(r); setTakeDownReason("技术栈版本过时"); setCustomTakeDownReason(""); setTakeDownSuggestion(""); setShowTakeDownModal(true); }}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer flex items-center gap-0.5"
                                title="违规驳回并强制隐藏下架"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>下架</span>
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-neutral-50 px-6 py-3.5 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
            <span>共有已审资源: {resources.length} 项 / 在架: {totalAssets} 项</span>
            <span className="text-[10px] text-neutral-caption font-medium pr-2">驳回下架后该资源对学生及高校教务自动物理隐藏不可搜索</span>
          </div>
        </div>
      )}

      {/* ==================== 3. DETAIL DRAWER (查看预览结构抽屉) ==================== */}
      {showDetailDrawer && selectedResource && (
        <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end bg-black/35 backdrop-blur-3xs animate-fade-in select-none">
          <div className="flex-1" onClick={() => setShowDetailDrawer(false)}></div>
          
          <div className="w-full max-w-[550px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left text-xs">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2.5xl leading-none">{selectedResource.logo}</span>
                <div>
                  <h2 className="text-base font-black text-neutral-title leading-tight">{selectedResource.name}</h2>
                  <span className="text-[10.5px] font-mono text-neutral-caption block mt-1 font-bold">
                    Unique Resource ID: {selectedResource.id}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowDetailDrawer(false)}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-neutral-body font-semibold">
              
              {/* Description info */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-[#fa541c] uppercase tracking-wider block">资源内容概要简介</span>
                <p className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl leading-relaxed text-neutral-title font-semibold">
                  {selectedResource.description}
                </p>
              </div>

              {/* Creator details */}
              <div className="space-y-3">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">
                  公共上传作者授信证明
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 space-y-1">
                    <span className="text-[10px] text-neutral-caption block">授信提供人：</span>
                    <span className="font-bold text-neutral-title text-xs block">{selectedResource.creator}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 space-y-1">
                    <span className="text-[10px] text-neutral-caption block">所属教学组织/单位：</span>
                    <span className="font-bold text-neutral-title text-xs block truncate" title={selectedResource.creatorRole}>
                      {selectedResource.creatorRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dependencies required */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-[#fa541c] uppercase tracking-wider block">实训依赖运行包/环境</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResource.dependencies.map((dep, i) => (
                    <span key={i} className="bg-neutral-100 text-neutral-title border border-neutral-200 px-2.5 py-1 rounded-lg font-bold font-mono">
                      ✓ {dep}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outline / Structure nodes */}
              <div className="space-y-3">
                <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2 flex justify-between items-center">
                  <span>结构化内容大纲章节目录 ({selectedResource.outline.length}项)</span>
                  <span className="text-[10px] text-neutral-caption font-mono">物理存储: {selectedResource.fileSize}</span>
                </h3>

                <div className="space-y-3">
                  {selectedResource.outline.map((out, idx) => (
                    <div key={idx} className="p-3.5 bg-neutral-50/50 border border-neutral-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-neutral-title">
                        <span>{out.title}</span>
                        <span className="font-mono text-[#fa541c] text-[10.5px] bg-[#fff2e8] px-1.5 py-0.2 rounded scale-90">{out.duration}</span>
                      </div>
                      <p className="text-[10.5px] text-neutral-body leading-relaxed font-semibold">
                        {out.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-border flex gap-3 shrink-0 select-none">
              <button
                onClick={() => { setShowDetailDrawer(false); setDeployStep("idle"); setDeployLogs([]); setShowUseModal(true); }}
                disabled={selectedResource.status === "已下架"}
                className={cn(
                  "font-bold px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors shadow-3xs text-center flex items-center justify-center gap-1 text-white",
                  selectedResource.status === "已下架"
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-[#fa541c] hover:bg-[#e84a15]"
                )}
              >
                <Play className="w-4 h-4" />
                <span>拉起测试沙箱</span>
              </button>
              
              <button
                onClick={() => setShowDetailDrawer(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold border border-neutral-200 px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors text-center shadow-3xs"
              >
                关闭预览
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. USE / SANDBOX TEST MODAL (【使用】一键沙箱部署测试与引用大盘) */}
      {showUseModal && selectedResource && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in text-xs font-sans select-none">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col h-[520px]">
            
            {/* Header */}
            <div className="bg-[#fff2e8] px-6 py-4 border-b border-[#ffbb96]/45 flex items-center justify-between shrink-0 text-[#fa541c]">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 animate-pulse" />
                <span className="font-black text-sm">公共资源测试部署与引用看板</span>
              </div>
              <button 
                onClick={() => setShowUseModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body scroll */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar text-neutral-body">
              
              {/* Tenant References Listing */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-neutral-caption uppercase tracking-wider block">当前引用本资源的高校租户一览</span>
                <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/20">
                  {selectedResource.references.map((ref, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-[11px] font-semibold bg-white">
                      <div className="flex items-center gap-2">
                        <span>{ref.logo}</span>
                        <span className="text-neutral-title font-bold">{ref.tenantName}</span>
                      </div>
                      <div className="flex gap-4 font-mono text-[10px] text-neutral-caption">
                        <span>引用: {ref.referencedAt}</span>
                        <span>活跃学生: <span className="font-bold text-neutral-title">{ref.activeStudents}名</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sandbox Deploy Test Console */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-black text-[#fa541c] uppercase tracking-wider block flex justify-between items-center">
                  <span>超级管理员沙箱热部署隔离环境校验</span>
                  {deployStep === "success" && (
                    <span className="bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-1.5 py-0.2 rounded scale-90 uppercase">健康合格</span>
                  )}
                </span>

                {deployStep === "idle" ? (
                  <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col items-center justify-center gap-3.5 text-center select-none">
                    <Terminal className="w-9 h-9 text-neutral-400" />
                    <div className="space-y-1">
                      <span className="text-neutral-title font-bold block text-xs">执行一键沙箱化部署核验</span>
                      <p className="text-[10px] text-neutral-caption font-semibold leading-relaxed max-w-[280px]">
                        点击拉起后，系统将建立虚拟隔离沙箱，热挂载该资源包并执行编译校验，用于管理员对优质件的可用性健康抽检。
                      </p>
                    </div>
                    <button
                      onClick={() => handleSimulateSandboxDeploy(selectedResource)}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-[11px] font-black px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-3xs flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>一键拉起沙箱测试部署</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-neutral-900 text-[#22c55e] rounded-xl border border-neutral-800 font-mono text-[10px] leading-relaxed h-[180px] overflow-y-auto flex flex-col justify-between custom-scrollbar shadow-inner">
                    <div className="space-y-1 flex-grow">
                      {deployLogs.map((log, idx) => (
                        <p key={idx} className={cn(
                          "whitespace-pre-wrap font-mono",
                          log.includes("[success]") ? "text-emerald-400 font-bold" :
                          log.includes("[info]") ? "text-neutral-400" : "text-[#22c55e]"
                        )}>
                          {log}
                        </p>
                      ))}
                    </div>

                    {/* Progress loader */}
                    {deployStep !== "success" && (
                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800 mt-2 shrink-0">
                        <RefreshCw className="w-3 h-3 animate-spin text-[#fa541c]" />
                        <span className="text-[9.5px] text-[#fa541c] font-bold">
                          {deployStep === "pulling" ? "正在Docker拉取基础依赖..." :
                           deployStep === "mounting" ? "正在从MinIO挂载二进制物理卷..." :
                           "正在对 API 注入心跳测试参数..."}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              {deployStep === "success" && (
                <button
                  onClick={() => {
                    setShowUseModal(false);
                    triggerToast(`📢 已经将资源「${selectedResource.name}」在沙箱部署健康检测合格结果广播下发`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 border-0 rounded-lg cursor-pointer transition-colors shadow-3xs"
                >
                  检测通过，确认归档
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setShowUseModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-200 rounded-lg cursor-pointer transition-colors shadow-3xs"
              >
                退出测试
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. TAKE DOWN REJECT MODAL (驳回整改下架弹窗) */}
      {showTakeDownModal && selectedResource && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in text-xs font-sans select-none">
          <form onSubmit={handleConfirmTakeDown} className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center gap-2 text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-bounce" />
              <span className="font-black text-sm">驳回审核并强制下架资源</span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-neutral-body font-semibold">
              <p className="leading-relaxed font-bold text-neutral-title">
                🚨 确定要驳回并强制下架资源「<span className="text-[#fa541c]">{selectedResource.name}</span>」吗？
              </p>
              
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg text-[10.5px] text-rose-800 leading-relaxed font-medium">
                下架后，该资源将立即从所有高校和学生端搜索列表隐藏。已引用的租户仍旧保留历史数据，但无法开启新的实训项目。
              </div>

              {/* Take down Reason */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-neutral-700 block">选择强制下架的主要因由分类：</label>
                <select
                  value={takeDownReason}
                  onChange={(e) => setTakeDownReason(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500 bg-white font-bold text-neutral-title"
                >
                  <option value="技术栈版本过时">资源包引用的依赖软件版本过旧已废弃</option>
                  <option value="数据集包含违规敏感内容">课件或数据集被举报含有政治敏感/违禁内容</option>
                  <option value="质量抽检不合格">资源内容存在严重抄袭或排版粗糙漏洞多</option>
                  <option value="资源所有者版权争议">收到原作者版权主张或合规使用纠纷</option>
                  <option value="其他原因">其他非常规下架整改因素（在下方补充）</option>
                </select>
              </div>

              {/* Custom reason input */}
              {takeDownReason === "其他原因" && (
                <div className="space-y-1.5 animate-slide-up">
                  <label className="font-bold text-neutral-700 block">补充具体的下架原因说明：</label>
                  <input
                    type="text"
                    required
                    value={customTakeDownReason}
                    onChange={(e) => setCustomTakeDownReason(e.target.value)}
                    placeholder="输入具体文字细节..."
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500 bg-white font-medium"
                  />
                </div>
              )}

              {/* Rectification Suggestion text box */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700 block">下发给作者的修改/整改建议意见：</label>
                <textarea
                  value={takeDownSuggestion}
                  onChange={(e) => setTakeDownSuggestion(e.target.value)}
                  required
                  placeholder="请输入整改建议意见，例如: 请升级LoRA加速微调库至v2.4以解决API不匹配..."
                  rows={3}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500 bg-white font-medium text-neutral-title placeholder-neutral-400"
                />
              </div>

              {/* Email notify checkbox */}
              <button
                type="button"
                onClick={() => setTakeDownNotifyEmail(!takeDownNotifyEmail)}
                className="flex items-center gap-2 text-[10.5px] font-bold text-neutral-caption cursor-pointer bg-transparent border-0"
              >
                {takeDownNotifyEmail ? (
                  <CheckSquare className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-300 shrink-0" />
                )}
                <span>自动发送驳回整改短信及邮件至原作者邮箱 ({selectedResource.creator})</span>
              </button>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowTakeDownModal(false)}
                className="bg-white hover:bg-neutral-100 text-neutral-body font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
              >
                放弃下架
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                确认下架驳回
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
