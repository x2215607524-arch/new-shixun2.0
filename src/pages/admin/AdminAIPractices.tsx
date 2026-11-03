import React, { useState } from "react";
import { 
  Star, Users, CheckCircle, Clock, ArrowRight, Search, Filter, 
  Plus, Edit, Trash2, RefreshCw, Play, Check, Database, 
  Building, Shield, AlertCircle, Sparkles, ChevronDown, 
  Bookmark, ArrowUp, GitCommit, Eye, ThumbsUp, X, CheckSquare, Square
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

interface PracticeItem {
  id: number;
  name: string;
  category: "教学助手" | "编程辅助" | "语言学习" | "系统模板";
  tags: string[];
  status: "已上架" | "已下架" | "草稿";
  usageCount: number;
  favoriteCount: number;
  versionCount: number;
  author: string;
  updateTime: string;
  isPinned: boolean;
  isRecommended: boolean;
}

const initialPractices: PracticeItem[] = [
  {
    id: 1,
    name: "AI出题与智能评阅实践",
    category: "教学助手",
    tags: ["大模型", "出题", "试卷打分"],
    status: "已上架",
    usageCount: 4520,
    favoriteCount: 890,
    versionCount: 3,
    author: "张旭东 教授",
    updateTime: "2026-05-20",
    isPinned: true,
    isRecommended: true
  },
  {
    id: 2,
    name: "Python代码自动补全与重构",
    category: "编程辅助",
    tags: ["代码生成", "单元测试", "AST分析"],
    status: "已上架",
    usageCount: 3890,
    favoriteCount: 720,
    versionCount: 2,
    author: "系统管理员",
    updateTime: "2026-05-21",
    isPinned: false,
    isRecommended: true
  },
  {
    id: 3,
    name: "英语多轮口语对话陪练",
    category: "语言学习",
    tags: ["语音转写", "口语练习", "实时对话"],
    status: "已上架",
    usageCount: 2140,
    favoriteCount: 450,
    versionCount: 4,
    author: "李瑞 讲师",
    updateTime: "2026-05-18",
    isPinned: false,
    isRecommended: false
  },
  {
    id: 4,
    name: "高考试卷智能分析模版",
    category: "系统模板",
    tags: ["RAG检索", "试卷分析", "多路合并"],
    status: "草稿",
    usageCount: 1950,
    favoriteCount: 210,
    versionCount: 1,
    author: "王强 教授",
    updateTime: "2026-05-15",
    isPinned: false,
    isRecommended: false
  }
];

interface ApprovalRequest {
  id: number;
  name: string;
  category: string;
  tags: string[];
  creator: string;
  submitTime: string;
  status: "待审核" | "审核中" | "已通过" | "已驳回";
  rejectionReason?: string;
  steps: string[];
}

const initialListingApprovals: ApprovalRequest[] = [
  {
    id: 101,
    name: "C++数据结构算法可视化辅助",
    category: "编程辅助",
    tags: ["C++", "链表树", "图论可视化"],
    creator: "李教授",
    submitTime: "2026-05-26 14:00",
    status: "待审核",
    steps: ["上传拓扑代码结构", "推理渲染算法流程", "自动补充关键逻辑注释"]
  },
  {
    id: 102,
    name: "考研政治智能刷题模版",
    category: "教学助手",
    tags: ["知识问答", "智能纠错", "政治大纲"],
    creator: "陈明 助教",
    submitTime: "2026-05-25 10:15",
    status: "审核中",
    steps: ["识别考研政治章节意图", "抽取高频核心主干题库", "给出高分标答对比"]
  }
];

interface PublicUpgradeRequest {
  id: number;
  name: string;
  tenantName: string;
  category: string;
  creator: string;
  submitTime: string;
  status: "待评估" | "已公开" | "已拒绝";
  scoreCompleteness?: number;
  scoreUtility?: number;
  scoreStandard?: number;
}

const initialPublicApprovals: PublicUpgradeRequest[] = [
  {
    id: 201,
    name: "基于RAG的学术期刊分类实践",
    tenantName: "北京大学信息学院",
    category: "教学助手",
    creator: "张旭东 教授",
    submitTime: "2026-05-24 11:30",
    status: "待评估"
  },
  {
    id: 202,
    name: "云原生容器网络排障大模型模板",
    tenantName: "清华大学计算机系",
    category: "编程辅助",
    creator: "王强 教授",
    submitTime: "2026-05-23 09:00",
    status: "待评估"
  }
];

interface VersionRecord {
  version: string;
  updateTime: string;
  notes: string;
  changes: string[];
  systemPrompt: string;
}

const practiceVersions: Record<number, VersionRecord[]> = {
  1: [
    {
      version: "v2.0",
      updateTime: "2026-05-20 14:45",
      notes: "升级DeepSeek大模型推理链路，大幅减少高并发大题量推理的等待时延，并补充智能评分反馈细则。",
      changes: [
        "+ 新增 DeepSeek-R1 推理框架自动绑定",
        "+ 引入 QPS 限制动态熔断提示词",
        "- 移除了 GPT-3.5 降级推理机制"
      ],
      systemPrompt: "You are an advanced AI teacher assistant specializing in automatically synthesizing comprehensive exam papers based on the provided curriculum and scoring benchmarks."
    },
    {
      version: "v1.1",
      updateTime: "2026-05-02 11:30",
      notes: "完善了试卷评估主观题的召回精度，并自动标记可能存在幻觉的高干扰性答案选项。",
      changes: [
        "+ 引入 混合检索 RAG 对齐机制",
        "+ 增加了 多项选择题 高度相似干扰项生成"
      ],
      systemPrompt: "You are an AI teacher assistant. Generate simple single and multiple choice questions based on standard educational guidelines."
    },
    {
      version: "v1.0",
      updateTime: "2026-04-15 09:00",
      notes: "首次发布，包含基本的单选题和填空题生成，绑定计算机网络大纲知识库。",
      changes: [
        "+ 初始发布基本教学出题模板"
      ],
      systemPrompt: "Generate simple exam questions."
    }
  ]
};

export default function AdminAIPractices() {
  const [activeTab, setActiveTab] = useState<"listing_approval" | "list_manage" | "version_manage" | "public_approval">("listing_approval");

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // =========================================================================
  // Tab 1: 最佳实践上架审核
  // =========================================================================
  const [listingApprovals, setListingApprovals] = useState<ApprovalRequest[]>(initialListingApprovals);
  const [reviewingRequest, setReviewingRequest] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [checkCompleteness, setCheckCompleteness] = useState(true);
  const [checkUtility, setCheckUtility] = useState(true);
  const [checkStandard, setCheckStandard] = useState(true);

  const handleApproveListing = (id: number) => {
    setListingApprovals(listingApprovals.map(req => {
      if (req.id === id) {
        return { ...req, status: "已通过" };
      }
      return req;
    }));
    setReviewingRequest(null);
    showToast("审核通过！该最佳实践已成功发布到商店供全平台可见。");
  };

  const handleRejectListing = (id: number) => {
    if (!rejectReason.trim()) {
      showToast("驳回必须填写驳回原因", "error");
      return;
    }
    setListingApprovals(listingApprovals.map(req => {
      if (req.id === id) {
        return { ...req, status: "已驳回", rejectionReason: rejectReason };
      }
      return req;
    }));
    setReviewingRequest(null);
    setShowRejectForm(false);
    setRejectReason("");
    showToast("已驳回申请，审核意见已成功推送到开发者工作区。");
  };

  // =========================================================================
  // Tab 2: 最佳实践列表管理
  // =========================================================================
  const [practices, setPractices] = useState<PracticeItem[]>(initialPractices);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPracticeIds, setSelectedPracticeIds] = useState<number[]>([]);

  // Category selection list matching dataset mockup tab switcher
  const categories = ["All", "教学助手", "编程辅助", "语言学习", "系统模板"];

  const handleToggleSelectAll = () => {
    if (selectedPracticeIds.length === practices.length) {
      setSelectedPracticeIds([]);
    } else {
      setSelectedPracticeIds(practices.map(p => p.id));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    if (selectedPracticeIds.includes(id)) {
      setSelectedPracticeIds(selectedPracticeIds.filter(pid => pid !== id));
    } else {
      setSelectedPracticeIds([...selectedPracticeIds, id]);
    }
  };

  const handleBulkTakeDown = () => {
    if (selectedPracticeIds.length === 0) return;
    setPractices(practices.map(p => {
      if (selectedPracticeIds.includes(p.id)) {
        return { ...p, status: "已下架" };
      }
      return p;
    }));
    setSelectedPracticeIds([]);
    showToast("批量下架成功！所有选定最佳实践已撤下商店列表。");
  };

  const handleToggleStatus = (id: number) => {
    setPractices(practices.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "已上架" ? "已下架" : "已上架";
        return { ...p, status: nextStatus };
      }
      return p;
    }));
    showToast("状态更新成功！");
  };

  const handleTogglePin = (id: number) => {
    setPractices(practices.map(p => {
      if (p.id === id) {
        return { ...p, isPinned: !p.isPinned };
      }
      return p;
    }));
    showToast("置顶管理更新成功！");
  };

  const filteredPractices = practices.filter(p => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // =========================================================================
  // Tab 3: 最佳实践版本管理
  // =========================================================================
  const [selectedPracticeForVer, setSelectedPracticeForVer] = useState<number>(1);
  const activeVersions = practiceVersions[selectedPracticeForVer] || [];
  
  const [comparingVerIndex, setComparingVerIndex] = useState<number | null>(null);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const handleTriggerRollback = (verStr: string) => {
    showToast(`版本回滚成功！正在将活动环境恢复到历史 ${verStr} 的稳定体系。`);
  };

  // =========================================================================
  // Tab 4: 最佳实践公开审核
  // =========================================================================
  const [publicApprovals, setPublicApprovals] = useState<PublicUpgradeRequest[]>(initialPublicApprovals);
  const [reviewingPublic, setReviewingPublic] = useState<PublicUpgradeRequest | null>(null);
  
  // Scorecard values (1-100 sliders)
  const [scoreCompleteness, setScoreCompleteness] = useState(90);
  const [scoreUtility, setScoreUtility] = useState(85);
  const [scoreStandard, setScoreStandard] = useState(88);

  const handleApprovePublic = (id: number) => {
    setPublicApprovals(publicApprovals.map(req => {
      if (req.id === id) {
        return { 
          ...req, 
          status: "已公开",
          scoreCompleteness,
          scoreUtility,
          scoreStandard
        };
      }
      return req;
    }));
    setReviewingPublic(null);
    showToast("平台级公开授权成功！该实践已归入全平台公共推荐库。");
  };

  const handleRejectPublic = (id: number) => {
    setPublicApprovals(publicApprovals.map(req => {
      if (req.id === id) {
        return { ...req, status: "已拒绝" };
      }
      return req;
    }));
    setReviewingPublic(null);
    showToast("已驳回该公开升级申请。");
  };

  return (
    <div className="space-y-6 min-h-full">
      {/* Toast notifications */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[14px] font-medium text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Title Header without white background */}
      <div className="pb-1">
        <h1 className="text-xl font-bold text-neutral-900">最佳实践库管理</h1>
        <p className="text-sm text-neutral-500 mt-1">管理教师和学生上传的AI应用商店申请，审核平台级公开申请，批量下架，并处理历史版本的比对与安全回滚</p>
      </div>

      {/* Unified Module Container with white background */}
      <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-sm space-y-6">
        
        {/* Top flat tabs referencing the dataset homepage style */}
        <div className="flex items-center gap-8 border-b border-neutral-200/60 pb-3 shrink-0">
          <button 
            onClick={() => setActiveTab("listing_approval")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "listing_approval" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            最佳实践上架审核
            {activeTab === "listing_approval" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("list_manage")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "list_manage" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            最佳实践列表管理
            {activeTab === "list_manage" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("version_manage")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "version_manage" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            最佳实践版本管理
            {activeTab === "version_manage" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("public_approval")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "public_approval" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            最佳实践公开审核
            {activeTab === "public_approval" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. 最佳实践上架审核 Tab Content */}
        {/* ========================================================================= */}
        {activeTab === "listing_approval" && (
          <div className="space-y-6">
            {/* List Table with custom styled headers matching teacher question managers */}
            <div className="overflow-x-auto border border-neutral-100 rounded-xl">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 font-medium">应用名称</th>
                    <th className="p-4 font-medium">分类</th>
                    <th className="p-4 font-medium">申请人</th>
                    <th className="p-4 font-medium">提交时间</th>
                    <th className="p-4 font-medium">状态</th>
                    <th className="p-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {listingApprovals.map(req => (
                    <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors text-[13px]">
                      <td className="p-4 font-semibold text-neutral-800">{req.name}</td>
                      <td className="p-4 text-neutral-600">
                        <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded text-[11px]">{req.category}</span>
                      </td>
                      <td className="p-4 text-neutral-600">{req.creator}</td>
                      <td className="p-4 text-neutral-500">{req.submitTime}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium",
                          req.status === "待审核" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          req.status === "审核中" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          req.status === "已通过" ? "bg-green-50 text-green-600 border-green-200" :
                          "bg-rose-50 text-rose-600 border-rose-200"
                        )}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {req.status === "已通过" || req.status === "已驳回" ? (
                          <span className="text-neutral-400 italic text-[12px]">已完成审核</span>
                        ) : (
                          <button 
                            onClick={() => setReviewingRequest(req)}
                            className="bg-[#fff2e8] hover:bg-[#ffe8d6] text-[#fa541c] text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer border border-[#ffbb96]/45"
                          >
                            前往审核
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Review Drawer Modal */}
            {reviewingRequest && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in">
                <div className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300">
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                    <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#fa541c]" />
                      <span>最佳实践上架审核面板</span>
                    </h3>
                    <button onClick={() => setReviewingRequest(null)} className="text-neutral-400 hover:text-neutral-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic details */}
                    <div className="space-y-2 bg-neutral-50/40 p-4 rounded-xl border border-neutral-100">
                      <span className="text-[10px] bg-neutral-100 text-neutral-500 rounded px-1.5 py-0.2 border border-neutral-200">{reviewingRequest.category}</span>
                      <h4 className="text-sm font-bold text-neutral-800 pt-1">{reviewingRequest.name}</h4>
                      <p className="text-[11px] text-neutral-500 mt-1">提请公开人: {reviewingRequest.creator} • 提交时间: {reviewingRequest.submitTime}</p>
                    </div>

                    {/* Step flows */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">实践编排步骤流</span>
                      <div className="space-y-2">
                        {reviewingRequest.steps.map((st, i) => (
                          <div key={i} className="flex gap-2.5 items-start text-xs text-neutral-700 bg-white border border-neutral-200/80 rounded p-2.5 shadow-sm">
                            <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                            <span className="pt-0.5 leading-relaxed">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dimensions checkpoint Checklist */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">审核合规度指标核验</span>
                      
                      {/* Check 1 */}
                      <div 
                        onClick={() => setCheckCompleteness(!checkCompleteness)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 bg-neutral-50/20",
                          checkCompleteness ? "border-[#fa541c] bg-[#fff2e8]/15" : "border-neutral-200"
                        )}
                      >
                        <button type="button" className={cn("w-4 h-4 rounded border flex items-center justify-center mt-0.5", checkCompleteness ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                          {checkCompleteness && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div>
                          <span className="text-xs font-bold text-neutral-800">内容完整性 (步骤及提示词清晰规范)</span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">要求多节点组合流顺序合理，步骤完整度高，附有操作提示信息说明。</p>
                        </div>
                      </div>

                      {/* Check 2 */}
                      <div 
                        onClick={() => setCheckUtility(!checkUtility)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 bg-neutral-50/20",
                          checkUtility ? "border-[#fa541c] bg-[#fff2e8]/15" : "border-neutral-200"
                        )}
                      >
                        <button type="button" className={cn("w-4 h-4 rounded border flex items-center justify-center mt-0.5", checkUtility ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                          {checkUtility && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div>
                          <span className="text-xs font-bold text-neutral-800">高实用性 (解决实训实际场景需求)</span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">符合真实教学、出题或代码编译排错场景，具备极高复用度与工程参考价值。</p>
                        </div>
                      </div>

                      {/* Check 3 */}
                      <div 
                        onClick={() => setCheckStandard(!checkStandard)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 bg-neutral-50/20",
                          checkStandard ? "border-[#fa541c] bg-[#fff2e8]/15" : "border-neutral-200"
                        )}
                      >
                        <button type="button" className={cn("w-4 h-4 rounded border flex items-center justify-center mt-0.5", checkStandard ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                          {checkStandard && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div>
                          <span className="text-xs font-bold text-neutral-800">格式规范性 (术语与标签分门别类)</span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">名称统一规范，标签划分恰如其分，不含有违规和乱码符号。</p>
                        </div>
                      </div>
                    </div>

                    {/* Reject form toggles */}
                    {showRejectForm && (
                      <div className="space-y-2 pt-2 animate-slide-up">
                        <label className="text-[11px] font-bold text-rose-600 block">驳回审核意见书 (必填)</label>
                        <textarea 
                          rows={3}
                          placeholder="请输入具体的驳回修改建议，协助开发者完成调整..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full border border-neutral-200 rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 resize-none font-medium"
                        />
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                    {showRejectForm ? (
                      <>
                        <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-50 cursor-pointer">返回</button>
                        <button onClick={() => handleRejectListing(reviewingRequest.id)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">确认驳回</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setShowRejectForm(true)} className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-50 cursor-pointer">驳回申请</button>
                        <button onClick={() => handleApproveListing(reviewingRequest.id)} className="px-4 py-2 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">通过审核并上架</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. 最佳实践列表管理 Tab Content */}
        {/* ========================================================================= */}
        {activeTab === "list_manage" && (
          <div className="space-y-6">
            {/* Filters Toolbar styled EXACTLY like dataset filter bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-5">
                {/* Category Pills Switcher */}
                <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-200/60">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200 cursor-pointer", categoryFilter === cat ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat === "All" ? "全部" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {/* Search bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="搜索最佳实践名称/作者" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-8"
                  />
                </div>

                <button 
                  onClick={() => alert("教师及学生端方可发起新建最佳实践，管理员在运营端享有完全管理和审核权限。")}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 h-8 text-[13px] shadow-sm shrink-0 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Plus className="w-4 h-4" /> 新建实践
                </button>
              </div>
            </div>

            {/* Bulk Actions Panel (visible when items are selected) */}
            {selectedPracticeIds.length > 0 && (
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600 font-medium">已选择 <span className="font-bold text-[#fa541c]">{selectedPracticeIds.length}</span> 项最佳实践</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleBulkTakeDown}
                    className="bg-white border border-neutral-300 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3.5 py-1 rounded text-xs font-bold transition-all cursor-pointer"
                  >
                    批量下架
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedPracticeIds([]);
                      showToast("已清空选中！");
                    }}
                    className="bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-100 px-3.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer"
                  >
                    取消选择
                  </button>
                </div>
              </div>
            )}

            {/* Cards Grid layout styled EXACTLY like the dataset page mockup cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPractices.map(item => {
                const isSelected = selectedPracticeIds.includes(item.id);
                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col hover:-translate-y-1 relative">
                    {/* Checkbox select on card top left */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelectRow(item.id);
                      }}
                      className="absolute top-4 left-4 z-10 w-4 h-4 rounded border flex items-center justify-center transition-all bg-white border-neutral-300 text-white cursor-pointer"
                    >
                      {isSelected ? (
                        <div className="w-full h-full bg-[#fa541c] border-[#fa541c] rounded flex items-center justify-center text-[10px] font-bold text-white">✓</div>
                      ) : (
                        <div className="w-full h-full rounded hover:border-[#fa541c]" />
                      )}
                    </button>
                    
                    {/* Status Peach Badge in top right */}
                    <div className="absolute top-0 right-0 bg-[#fff2e8] text-[#fa541c] text-[10px] font-bold px-2.5 py-1 rounded-bl-lg">
                      {item.status}
                    </div>

                    <div className="p-6 pl-12 flex-1 relative">
                      <div className="flex items-start gap-4">
                        {/* Circle icon container */}
                        <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0 text-[#fa541c]">
                          <Bookmark className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-[15px] text-neutral-800 truncate group-hover:text-[#fa541c] transition-colors">{item.name}</h3>
                            {item.isPinned && (
                              <span className="bg-[#fff2e8] border border-[#ffbb96] text-[#fa541c] rounded px-1.5 py-0.2 text-[8px] font-bold">置顶</span>
                            )}
                          </div>
                          <p className="text-[12px] text-neutral-400 mt-1 leading-normal">作者: {item.author}</p>
                        </div>
                      </div>

                      {/* Tag list */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-neutral-50 text-neutral-600 rounded text-[11px] border border-neutral-200">
                          {item.category}
                        </span>
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[11px] border border-neutral-200">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats grid */}
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px] bg-neutral-50/50 rounded-lg py-2 border border-neutral-100/50">
                        <div>
                          <div className="text-neutral-400 text-[10px]">使用人次</div>
                          <div className="font-medium text-neutral-700 mt-0.5 flex items-center justify-center gap-1">
                            <Users className="w-3 h-3 text-neutral-400" /> {item.usageCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-400 text-[10px]">收藏量</div>
                          <div className="font-medium text-neutral-700 mt-0.5 flex items-center justify-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-neutral-400" /> {item.favoriteCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-400 text-[10px]">版本数</div>
                          <div className="font-medium text-neutral-700 mt-0.5">{item.versionCount}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions on Hover */}
                    <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between">
                      <div className="text-[12px] text-neutral-400">更新于 {item.updateTime}</div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Pin */}
                        <button 
                          onClick={() => handleTogglePin(item.id)}
                          className={cn(
                            "p-1.5 rounded transition-colors cursor-pointer",
                            item.isPinned ? "text-[#fa541c] hover:bg-orange-50" : "text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50"
                          )} 
                          title={item.isPinned ? "取消置顶" : "置顶实践"}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        {/* Take down / Put on */}
                        <button 
                          onClick={() => handleToggleStatus(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors cursor-pointer" 
                          title={item.status === "已上架" ? "下架" : "上架"}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Delete */}
                        <button 
                          onClick={() => {
                            if (confirm("确定要删除该已发布的最佳实践吗？")) {
                              setPractices(practices.filter(p => p.id !== item.id));
                              showToast("删除成功！");
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer" 
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. 最佳实践版本管理 Tab Content */}
        {/* ========================================================================= */}
        {activeTab === "version_manage" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
            {/* Left list: Best practice selection */}
            <div className="lg:col-span-4 border border-neutral-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                <span className="font-bold text-neutral-800 text-xs tracking-wider uppercase">选择最佳实践项目</span>
                <Bookmark className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="divide-y divide-neutral-100">
                {practices.map(p => {
                  const isActive = p.id === selectedPracticeForVer;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedPracticeForVer(p.id);
                        setComparingVerIndex(null);
                      }}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex flex-col gap-2 relative",
                        isActive ? "bg-[#fff2e8]/45 border-l-4 border-[#fa541c]" : ""
                      )}
                    >
                      <span className={cn("text-xs font-bold leading-normal", isActive ? "text-[#fa541c]" : "text-neutral-800")}>{p.name}</span>
                      <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-1">
                        <span>分类: {p.category}</span>
                        <span className="text-[#fa541c] font-black">{p.versionCount} 个修订版本</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right details: version logs history timeline */}
            <div className="lg:col-span-8 bg-white border border-neutral-100 rounded-xl p-6 space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="text-sm font-bold text-neutral-800">修订版本迭代履历 & 对比控制</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">系统保存每次发布日志，支持在云端进行主提示词（System Prompt）比对及安全一键回滚。</p>
              </div>

              {activeVersions.length > 0 ? (
                <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-100">
                  {activeVersions.map((rec, idx) => {
                    const isNewest = idx === 0;
                    return (
                      <div key={rec.version} className="relative space-y-2 animate-slide-up">
                        {/* Timeline bubble */}
                        <div className={cn(
                          "absolute left-[-22px] top-1.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-white z-10",
                          isNewest ? "border-[#fa541c] ring-4 ring-[#fa541c]/10" : "border-neutral-300"
                        )} />

                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-neutral-800">{rec.version}</span>
                              <span className="text-[11px] text-neutral-400 font-semibold">{rec.updateTime}</span>
                              {isNewest && (
                                <span className="bg-green-50 border border-green-200 text-green-600 rounded px-1.5 py-0.2 text-[8px] font-bold">在线最新</span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed font-medium">{rec.notes}</p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Version comparison button */}
                            {idx < activeVersions.length - 1 && (
                              <button 
                                onClick={() => {
                                  setComparingVerIndex(idx);
                                  setShowDiffModal(true);
                                }}
                                className="bg-[#fff2e8]/45 hover:bg-[#fff2e8] text-[#fa541c] text-[10px] font-bold px-2 py-1.5 border border-[#ffbb96]/30 rounded cursor-pointer"
                              >
                                比对下版
                              </button>
                            )}
                            
                            {/* Rollback button */}
                            {!isNewest && (
                              <button 
                                onClick={() => handleTriggerRollback(rec.version)}
                                className="bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-50 text-[10px] font-bold px-2 py-1.5 rounded cursor-pointer"
                              >
                                回滚至此
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Diff changes logs */}
                        <div className="flex flex-col gap-1 pl-1 pt-1">
                          {rec.changes.map((chg, cidx) => (
                            <span 
                              key={cidx} 
                              className={cn(
                                "text-[10px] font-mono",
                                chg.startsWith("+") ? "text-emerald-600 font-bold" : 
                                chg.startsWith("-") ? "text-rose-600 font-bold" : "text-neutral-500"
                              )}
                            >
                              {chg}
                            </span>
                          ))}
                        </div>

                        <div className="border-b border-neutral-100 pb-4"></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">暂无历史版本记录信息。</p>
              )}
            </div>

            {/* Visual Diffs Modal */}
            {showDiffModal && comparingVerIndex !== null && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl border border-neutral-100 max-w-2xl w-full p-6 animate-scale-up space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                    <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-1">
                      <span>版本对比:</span>
                      <span className="text-rose-600 font-mono text-xs">{activeVersions[comparingVerIndex + 1]?.version}</span>
                      <span className="text-neutral-300">→</span>
                      <span className="text-emerald-600 font-mono text-xs">{activeVersions[comparingVerIndex]?.version}</span>
                    </h4>
                    <button onClick={() => setShowDiffModal(false)} className="text-neutral-400 hover:text-neutral-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* System Prompt Code Diff Block */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">System Prompt 提示词差异对比</span>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Old version prompt */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded px-1.5 py-0.5">
                          旧版 {activeVersions[comparingVerIndex + 1]?.version}
                        </span>
                        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg font-mono text-[10px] text-neutral-400 min-h-[120px] max-h-[160px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                          {activeVersions[comparingVerIndex + 1]?.systemPrompt}
                        </div>
                      </div>

                      {/* New version prompt */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
                          新版 {activeVersions[comparingVerIndex]?.version}
                        </span>
                        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg font-mono text-[10px] text-green-400 min-h-[120px] max-h-[160px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                          {activeVersions[comparingVerIndex]?.systemPrompt}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-3 flex justify-end">
                    <button 
                      onClick={() => setShowDiffModal(false)}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-sm"
                    >
                      我已知晓
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. 最佳实践公开审核 Tab Content */}
        {/* ========================================================================= */}
        {activeTab === "public_approval" && (
          <div className="space-y-6">
            {/* List upgrade requests */}
            <div className="overflow-x-auto border border-neutral-100 rounded-xl">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 font-medium">应用名称</th>
                    <th className="p-4 font-medium">提交租户</th>
                    <th className="p-4 font-medium">分类</th>
                    <th className="p-4 font-medium">原作者</th>
                    <th className="p-4 font-medium">提请时间</th>
                    <th className="p-4 font-medium">公开状态</th>
                    <th className="p-4 font-medium text-right">评估</th>
                  </tr>
                </thead>
                <tbody>
                  {publicApprovals.map(req => (
                    <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors text-[13px]">
                      <td className="p-4 font-semibold text-neutral-800">{req.name}</td>
                      <td className="p-4 text-neutral-600 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-neutral-400" /> {req.tenantName}
                      </td>
                      <td className="p-4 text-neutral-600">{req.category}</td>
                      <td className="p-4 text-neutral-600">{req.creator}</td>
                      <td className="p-4 text-neutral-500">{req.submitTime}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium",
                          req.status === "待评估" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          req.status === "已公开" ? "bg-green-50 text-green-600 border-green-200" :
                          "bg-rose-50 text-rose-600 border-rose-200"
                        )}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {req.status === "已公开" ? (
                          <div className="flex flex-col items-end gap-1 text-[10px] text-neutral-400 leading-normal">
                            <span>得分: {((req.scoreCompleteness! + req.scoreUtility! + req.scoreStandard!) / 3).toFixed(1)}</span>
                            <span className="text-emerald-500 font-bold">全平台可用</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setReviewingPublic(req)}
                            className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer shadow-sm"
                          >
                            评估详情
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Public Upgrade Request Evaluation Drawer */}
            {reviewingPublic && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in">
                <div className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300">
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                    <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#fa541c]" />
                      <span>全平台公开资格评估审核</span>
                    </h3>
                    <button onClick={() => setReviewingPublic(null)} className="text-neutral-400 hover:text-neutral-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic details */}
                    <div className="space-y-2 bg-neutral-50/40 p-4 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-neutral-400" />
                        <span className="text-[11px] font-bold text-neutral-600">{reviewingPublic.tenantName} 提请升级</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-800 pt-1">{reviewingPublic.name}</h4>
                      <p className="text-[11px] text-neutral-500 mt-1">分类: {reviewingPublic.category} • 原创者: {reviewingPublic.creator}</p>
                    </div>

                    {/* Quality Evaluation Sliders Scorecard */}
                    <div className="space-y-6 pt-2">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">平台公开准入打分评估</span>

                      {/* Dimension 1: Completeness */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-neutral-700">
                          <span>内容及配图完整度得分 (Completeness)</span>
                          <span className="text-[#fa541c] font-black">{scoreCompleteness}分</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-normal pb-1">评估是否有清晰的教学指引步骤图，配图说明是否足够清晰，利于全平台极低门槛复用。</p>
                        <input 
                          type="range"
                          min="1"
                          max="100"
                          value={scoreCompleteness}
                          onChange={(e) => setScoreCompleteness(parseInt(e.target.value))}
                          className="w-full h-1 accent-[#fa541c] bg-neutral-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Dimension 2: Utility */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-neutral-700">
                          <span>教学解决实际问题能力得分 (Utility)</span>
                          <span className="text-[#fa541c] font-black">{scoreUtility}分</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-normal pb-1">是否能真正解决跨学科AI实验的组织编排，课后智能打分准确无幻觉，应用价值是否普适。</p>
                        <input 
                          type="range"
                          min="1"
                          max="100"
                          value={scoreUtility}
                          onChange={(e) => setScoreUtility(parseInt(e.target.value))}
                          className="w-full h-1 accent-[#fa541c] bg-neutral-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Dimension 3: Standard */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-neutral-700">
                          <span>术语与排版格式规范度得分 (Standardization)</span>
                          <span className="text-[#fa541c] font-black">{scoreStandard}分</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-normal pb-1">排版、语言、中英文标点是否完全遵循翼实训平台大模型发布规范。</p>
                        <input 
                          type="range"
                          min="1"
                          max="100"
                          value={scoreStandard}
                          onChange={(e) => setScoreStandard(parseInt(e.target.value))}
                          className="w-full h-1 accent-[#fa541c] bg-neutral-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Calculated Average */}
                    <div className="p-4 bg-[#fff2e8]/45 border border-[#ffbb96]/45 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700">最终综合评估得分 (平均):</span>
                      <span className="text-2xl font-black text-[#fa541c]">
                        {((scoreCompleteness + scoreUtility + scoreStandard) / 3).toFixed(1)}分
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                    <button onClick={() => handleRejectPublic(reviewingPublic.id)} className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-50 cursor-pointer">拒绝公开并打回</button>
                    <button onClick={() => handleApprovePublic(reviewingPublic.id)} className="px-4 py-2 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">同意公开升级(全平台可用)</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
