import React, { useEffect, useRef, useState } from "react";
import { 
  Trophy, Users, Award, Clock, CheckCircle, AlertTriangle, Search, 
  Plus, Edit, Trash2, Shield, Calendar, BookOpen, ChevronRight, X,
  FileText, Sliders, Play, TrendingUp, BarChart2, Download, Filter, 
  AlertCircle, Settings, Check, RefreshCw, ChevronDown, ChevronLeft, Cloud,
  Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { competitionDrawerStyles as drawerStyles } from "@/components/competition/competitionDrawerStyles";
import CompetitionFormDrawer, { CompetitionFormValues } from "@/components/competition/CompetitionFormDrawer";
import CompetitionOperationsDrawer from "@/components/competition/CompetitionOperationsDrawer";
import CompetitionSelect from "@/components/competition/CompetitionSelect";
import { CompetitionOperationData, CompetitionOperationMode, createCompetitionOperationData } from "@/components/competition/competitionOperations";
import { useNavigate } from "react-router-dom";

// --- Types & Data Interfaces ---

interface Competition extends Partial<CompetitionFormValues> {
  id: string;
  name: string;
  type: string;
  status: "筹备中" | "报名中" | "进行中" | "已结束";
  duration: string;
  teamsCount: number;
  participants: number;
  description: string;
  format: string;
  ruleMaxSubmissions: number;
  ruleFiles: string;
  ruleGpu: string;
  evalMetric: string;
  visible: boolean;
  creator: string;
  createdAt: string;
}

interface ApplicationRequest {
  id: string;
  school: string;
  contestName: string;
  teacher: string;
  status: "待审核" | "已通过" | "已拒绝";
  submitDate: string;
  description: string;
  format: string;
  rules: string;
  scoring: string;
}

interface Team {
  id: string;
  name: string;
  captain: string;
  membersCount: number;
  school: string;
  submissions: number;
  status: "正常" | "已封禁";
  regDate: string;
}

interface LeaderboardRecord {
  id: string;
  teamId: string;
  teamName: string;
  school: string;
  score: number;
  time: string;
  file: string;
  codeReport: string;
}

interface CloudAccount {
  id: string;
  projectId: string;
  domainId: string;
  status: "使用中" | "使用完";
  platform: string;
  userAccount: string;
  createdAt: string;
  extraParams?: string;
}

const initialCloudAccounts: CloudAccount[] = [
  { id: "47c05bd37d4a9d68", projectId: "—", domainId: "—", status: "使用中", platform: "天翼云", userAccount: "gui3zsk1mbc1t6", createdAt: "2024-10-04 14:32:18" },
  { id: "3d87669486e96e12", projectId: "—", domainId: "—", status: "使用完", platform: "天翼云", userAccount: "—", createdAt: "2024-09-28 09:21:44" },
  { id: "3434e991d67215cf", projectId: "—", domainId: "—", status: "使用完", platform: "天翼云", userAccount: "—", createdAt: "2024-09-25 16:08:30" },
  { id: "b9d71fb7df10a369", projectId: "—", domainId: "—", status: "使用中", platform: "天翼云", userAccount: "0nllcrs6mamy82", createdAt: "2024-09-23 11:46:05" },
  { id: "ecc1979cbc3f2831", projectId: "—", domainId: "—", status: "使用完", platform: "天翼云", userAccount: "—", createdAt: "2024-09-20 10:14:26" },
  { id: "fd7e025fe86d517b", projectId: "—", domainId: "—", status: "使用完", platform: "天翼云", userAccount: "—", createdAt: "2024-09-18 13:52:09" },
  { id: "a38df514484db521", projectId: "—", domainId: "—", status: "使用中", platform: "天翼云", userAccount: "mqn6odcoco91z4", createdAt: "2024-09-16 08:40:33" },
  { id: "f8aa177a8d1f92ce", projectId: "—", domainId: "—", status: "使用完", platform: "天翼云", userAccount: "—", createdAt: "2024-09-12 17:25:48" },
];

// --- Date Time Helpers for Second Precision ---

function normalizeDateTimeString(dt?: string, defaultTime = "00:00:00") {
  if (!dt) return "";
  const trimmed = dt.trim().replace("T", " ");
  if (!trimmed) return "";
  if (trimmed.includes(" ")) {
    const [d, t = ""] = trimmed.split(" ");
    const parts = (t || defaultTime).split(":");
    const hh = (parts[0] || "00").padStart(2, "0");
    const mm = (parts[1] || "00").padStart(2, "0");
    const ss = (parts[2] || "00").padStart(2, "0");
    return `${d} ${hh}:${mm}:${ss}`;
  }
  return `${trimmed} ${defaultTime}`;
}

function getCurrentDateTimeSecond() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function renderDateTimeCell(dtStr?: string, defaultTime = "00:00:00") {
  if (!dtStr || dtStr === "—") return <span className="text-neutral-400">—</span>;
  const normalized = normalizeDateTimeString(dtStr, defaultTime);
  const [date, time] = normalized.split(" ");
  return (
    <div>
      <div>{date}</div>
      <div className="text-xs text-neutral-400 mt-1 font-mono">{time || defaultTime}</div>
    </div>
  );
}

// --- Initial Mock Database ---

const initialCompetitions: Competition[] = [
  { 
    id: "comp-1",
    visible: true, creator: "运营管理员", createdAt: "2026-02-12 14:30:00",
    name: "2026年智云杯大语言模型应用创新赛", 
    type: "大模型开发", 
    status: "进行中", 
    duration: "2026-03-01 09:00:00 至 2026-05-31 18:00:00", 
    teamsCount: 452, 
    participants: 1356, 
    description: "基于主流开源大语言模型，面向全国高校开展大模型应用创新与微调开发对抗，覆盖Agent框架开发、RAG语义重排调优等多维实战赛道。", 
    format: "团队赛 (最大5人)", 
    ruleMaxSubmissions: 5, 
    ruleFiles: "zip, ipynb", 
    ruleGpu: "100 GPU小时", 
    evalMetric: "Accuracy / F1-Score" 
  },
  { 
    id: "comp-2",
    visible: true, creator: "运营管理员", createdAt: "2026-03-01 09:20:00",
    name: "医疗影像肺部病灶分割挑战赛", 
    type: "计算机视觉", 
    status: "进行中", 
    duration: "2026-03-15 08:30:00 至 2026-04-30 18:00:00", 
    teamsCount: 320, 
    participants: 840, 
    description: "针对多模态医学图像，利用高维卷积神经网络与Transformer模型对典型肺部病灶进行高精度分割，比对重合度指标IoU。", 
    format: "个人赛 / 团队赛 (最大3人)", 
    ruleMaxSubmissions: 3, 
    ruleFiles: "tar.gz, py", 
    ruleGpu: "50 GPU小时", 
    evalMetric: "Mean IoU" 
  },
  { 
    id: "comp-3",
    visible: true, creator: "运营管理员", createdAt: "2025-11-15 10:00:00",
    name: "金融风控非平衡样本分类预测算法赛", 
    type: "机器学习", 
    status: "已结束", 
    duration: "2025-12-01 09:00:00 至 2026-02-28 20:00:00", 
    teamsCount: 890, 
    participants: 2200, 
    description: "通过海量金融交易流水，在高度不平衡的欺诈样本集中，设计高泛化性的机器学习分类器，精准识别潜在风险交易。", 
    format: "团队赛 (最大4人)", 
    ruleMaxSubmissions: 10, 
    ruleFiles: "csv", 
    ruleGpu: "不限", 
    evalMetric: "AUC / LogLoss" 
  },
  { 
    id: "comp-4",
    visible: true, creator: "运营管理员", createdAt: "2026-03-20 16:15:00",
    name: "智能客服多轮多意图对话评测赛", 
    type: "自然语言处理", 
    status: "报名中", 
    duration: "2026-04-01 10:00:00 至 2026-06-30 22:00:00", 
    teamsCount: 150, 
    participants: 450, 
    description: "参赛者需要设计并部署高并发、高准确率的多意图对话树提取与大模型编排链路，以通过极其苛刻的多轮人机交互压力测试。", 
    format: "团队赛 (最大3人)", 
    ruleMaxSubmissions: 5, 
    ruleFiles: "zip", 
    ruleGpu: "50 GPU小时", 
    evalMetric: "BLEU / ROUGE" 
  },
  { 
    id: "comp-5",
    visible: true, creator: "运营管理员", createdAt: "2026-05-18 11:40:00",
    name: "第三届网络安全云原生微服务渗透对抗赛", 
    type: "安全对抗", 
    status: "筹备中", 
    duration: "2026-07-01 09:00:00 至 2026-07-31 18:00:00", 
    teamsCount: 0, 
    participants: 0, 
    description: "本届赛事聚焦云原生微服务集群的边界防御与横向移动渗透。参赛队伍在沙箱中，需要快速找出多实例环境下的逻辑越权与依赖项漏洞并提交PoC并提报。", 
    format: "团队赛 (最大5人)", 
    ruleMaxSubmissions: 8, 
    ruleFiles: "zip, yaml", 
    ruleGpu: "100 GPU小时", 
    evalMetric: "得分与修复率" 
  }
];

const initialApplications: ApplicationRequest[] = [
  { 
    id: "req-1", 
    school: "清华大学软件学院", 
    contestName: "首届图神经网络链路预测挑战赛", 
    teacher: "陈立峰 教授", 
    status: "待审核", 
    submitDate: "2026-05-25", 
    description: "针对超大规模学术合作关系网络，开展链路预测理论及并行加速评测，面向全国计算机专业学生公开招募参赛队伍。", 
    format: "团队赛 (最大3人)", 
    rules: "每日最大提交3次，限制zip文件，分配40小时GPU配额", 
    scoring: "以AUC为评测指标，占80%，代码结构及查重占20%" 
  },
  { 
    id: "req-2", 
    school: "北京航空航天大学计算机学院", 
    contestName: "智能网联汽车分布式路径规划对抗赛", 
    teacher: "林海华 副教授", 
    status: "待审核", 
    submitDate: "2026-05-26", 
    description: "面向多车编队的分布式三维路径规划，验证复杂障碍物及窄通道场景下的实时碰撞避免与能效最优路径决策算法。", 
    format: "团队赛 (最大4人)", 
    rules: "每日最大提交5次，限制tar.gz文件，限制分配50小时GPU", 
    scoring: "以避障安全性（40%）、路径平滑度（30%）、执行耗时（30%）加权得分" 
  },
  { 
    id: "req-3", 
    school: "南京大学人工智能研究院", 
    contestName: "小样本高光谱图像农作物分类创新赛", 
    teacher: "王建勋 研究员", 
    status: "已通过", 
    submitDate: "2026-05-24", 
    description: "探索光谱波段空间注意力机制在农作物精准普查中的应用，重点考察模型在超小样本监督学习条件下的极值泛化能力。", 
    format: "个人赛 / 团队赛 (最大3人)", 
    rules: "每日最大提交5次，限制py格式文件，分配80小时GPU", 
    scoring: "F1-Score (宏平均)" 
  }
];

const initialTeams: Record<string, Team[]> = {
  "comp-1": [
    { id: "team-1-1", name: "绝地大模型队", captain: "张立明", membersCount: 5, school: "清华大学", submissions: 12, status: "正常", regDate: "2026-03-02" },
    { id: "team-1-2", name: "梯度下降终结者", captain: "李瑞丰", membersCount: 4, school: "北京大学", submissions: 9, status: "正常", regDate: "2026-03-05" },
    { id: "team-1-3", name: "PyTorch狂热粉", captain: "王梓轩", membersCount: 3, school: "上海交通大学", submissions: 15, status: "已封禁", regDate: "2026-03-08" },
    { id: "team-1-4", name: "大语言偏微分队", captain: "赵宇涵", membersCount: 3, school: "哈尔滨工业大学", submissions: 5, status: "正常", regDate: "2026-03-12" },
    { id: "team-1-5", name: "注意力机制矩阵群", captain: "刘斯琪", membersCount: 5, school: "浙江大学", submissions: 14, status: "正常", regDate: "2026-03-03" }
  ],
  "comp-2": [
    { id: "team-2-1", name: "影像切割大师", captain: "陈伟杰", membersCount: 3, school: "复旦大学医学院", submissions: 8, status: "正常", regDate: "2026-03-16" },
    { id: "team-2-2", name: "UNet终极进化", captain: "周诗雨", membersCount: 2, school: "华中科技大学", submissions: 11, status: "正常", regDate: "2026-03-18" },
    { id: "team-2-3", name: "影像超分辨率群", captain: "马骁", membersCount: 3, school: "四川大学", submissions: 4, status: "正常", regDate: "2026-03-20" }
  ],
  "comp-3": [
    { id: "team-3-1", name: "特征工程搬砖人", captain: "李栋", membersCount: 4, school: "南京大学", submissions: 22, status: "正常", regDate: "2025-12-05" },
    { id: "team-3-2", name: "随机森林防卫者", captain: "杨浩", membersCount: 3, school: "西安交通大学", submissions: 18, status: "正常", regDate: "2025-12-08" }
  ],
  "comp-4": [
    { id: "team-4-1", name: "意图理解先锋", captain: "沈涛", membersCount: 3, school: "同济大学", submissions: 2, status: "正常", regDate: "2026-04-05" }
  ]
};

const initialLeaderboards: Record<string, LeaderboardRecord[]> = {
  "comp-1": [
    { id: "rank-1-1", teamId: "team-1-1", teamName: "绝地大模型队", school: "清华大学", score: 0.9654, time: "2026-05-27 15:30:12", file: "submission_v12.zip", codeReport: "静态代码评估: 优秀, Pylint评分 9.6, 无安全注入风险" },
    { id: "rank-1-2", teamId: "team-1-5", teamName: "注意力机制矩阵群", school: "浙江大学", score: 0.9421, time: "2026-05-27 14:12:00", file: "submission_v8.zip", codeReport: "静态代码评估: 优秀, Pylint评分 9.4, 复杂度符合O(N)" },
    { id: "rank-1-3", teamId: "team-1-2", teamName: "梯度下降终结者", school: "北京大学", score: 0.9205, time: "2026-05-26 18:24:55", file: "model_opt.zip", codeReport: "静态代码评估: 良好, Pylint评分 8.8, 局部变量未使用警告" },
    { id: "rank-1-4", teamId: "team-1-4", teamName: "大语言偏微分队", school: "哈尔滨工业大学", score: 0.8934, time: "2026-05-25 10:15:30", file: "baseline.zip", codeReport: "静态代码评估: 中等, Pylint评分 7.5, 缺少类文档注释说明" }
  ],
  "comp-2": [
    { id: "rank-2-1", teamId: "team-2-1", teamName: "影像切割大师", school: "复旦大学医学院", score: 0.8845, time: "2026-04-29 23:45:10", file: "segmentation_cleansed.tar.gz", codeReport: "静态代码评估: 优秀, Pylint评分 9.5" },
    { id: "rank-2-2", teamId: "team-2-2", teamName: "UNet终极进化", school: "华中科技大学", score: 0.8521, time: "2026-04-28 12:10:05", file: "unet_resnet.tar.gz", codeReport: "静态代码评估: 优秀, Pylint评分 8.9" },
    { id: "rank-2-3", teamId: "team-2-3", teamName: "影像超分辨率群", school: "四川大学", score: 0.7932, time: "2026-04-25 16:30:00", file: "baseline_sr.tar.gz", codeReport: "静态代码评估: 良好, Pylint评分 8.1" }
  ],
  "comp-3": [
    { id: "rank-3-1", teamId: "team-3-1", teamName: "特征工程搬砖人", school: "南京大学", score: 0.9845, time: "2026-02-27 18:40:02", file: "xgboost_stacking.csv", codeReport: "静态代码评估: 优秀, Pylint 9.8" },
    { id: "rank-3-2", teamId: "team-3-2", teamName: "随机森林防卫者", school: "西安交通大学", score: 0.9423, time: "2026-02-26 20:15:00", file: "lightgbm_tuned.csv", codeReport: "静态代码评估: 良好, Pylint 8.5" }
  ],
  "comp-4": [
    { id: "rank-4-1", teamId: "team-4-1", teamName: "意图理解先锋", school: "同济大学", score: 0.6542, time: "2026-04-10 11:22:11", file: "intent_dialog.zip", codeReport: "静态代码评估: 良好, Pylint 8.0" }
  ]
};

interface CloudAccountFormValues {
  platform: string;
  account: string;
  password: string;
  extraParams: string;
  projectId: string;
  domainId: string;
}

function CloudAccountCreateDrawer({ mode = "create", initialAccount, onClose, onSave }: { mode?: "create" | "edit"; initialAccount?: CloudAccount | null; onClose: () => void; onSave: (values: CloudAccountFormValues) => void }) {
  const [platform, setPlatform] = useState(initialAccount?.platform || "");
  const [account, setAccount] = useState(initialAccount?.userAccount === "—" ? "" : initialAccount?.userAccount || "");
  const [password, setPassword] = useState("");
  const [extraParams, setExtraParams] = useState(initialAccount?.extraParams || "");
  const [projectId, setProjectId] = useState(initialAccount?.projectId === "—" ? "" : initialAccount?.projectId || "");
  const [domainId, setDomainId] = useState(initialAccount?.domainId === "—" ? "" : initialAccount?.domainId || "");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!platform) nextErrors.platform = "请选择云平台";
    if (!account.trim()) nextErrors.account = "请输入账号";
    if (!password) nextErrors.password = "请输入密码";
    if (platform === "华为云" && !projectId.trim()) nextErrors.projectId = "请输入项目ID";
    if (platform === "华为云" && !domainId.trim()) nextErrors.domainId = "请输入domainID";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ platform, account: account.trim(), password, extraParams: extraParams.trim(), projectId: projectId.trim(), domainId: domainId.trim() });
  };

  return createPortal(
    <div className={drawerStyles.overlay} onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="cloud-account-drawer-title"
        onSubmit={submit}
        onClick={event => event.stopPropagation()}
        className={cn(drawerStyles.panel, "max-w-[620px]")}
      >
        <div className={drawerStyles.header}>
          <h2 id="cloud-account-drawer-title" className={drawerStyles.title}>{mode === "edit" ? "编辑账号" : "新建账号"}</h2>
          <button type="button" aria-label={mode === "edit" ? "关闭编辑账号" : "关闭新建账号"} onClick={onClose} className={drawerStyles.close}><X className="w-4 h-4" /></button>
        </div>
        <div className={drawerStyles.body}>
          <div className="space-y-5 pt-1">
            <div className={drawerStyles.field}>
              <label htmlFor="cloud-platform" className={drawerStyles.label}><span className="text-[#fa541c] mr-1">*</span>云平台</label>
              <div>
                <CompetitionSelect
                  id="cloud-platform"
                  value={platform}
                  options={["天翼云", "华为云"]}
                  placeholder="请选择云平台"
                  aria-invalid={Boolean(errors.platform)}
                  onChange={value => {
                    setPlatform(value);
                    setErrors(previous => ({ ...previous, platform: "", projectId: "", domainId: "" }));
                  }}
                />
                {errors.platform && <p className="text-red-500 text-xs mt-1.5">{errors.platform}</p>}
              </div>
            </div>
            <div className={drawerStyles.field}>
              <label htmlFor="cloud-account" className={drawerStyles.label}><span className="text-[#fa541c] mr-1">*</span>账号</label>
              <div>
                <div className="relative">
                  <input id="cloud-account" maxLength={100} value={account} onChange={event => { setAccount(event.target.value); setErrors(previous => ({ ...previous, account: "" })); }} placeholder="请输入云账号" className={cn(drawerStyles.input, "pr-20")} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">{account.length} / 100</span>
                </div>
                {errors.account && <p className="text-red-500 text-xs mt-1.5">{errors.account}</p>}
              </div>
            </div>
            <div className={drawerStyles.field}>
              <label htmlFor="cloud-password" className={drawerStyles.label}><span className="text-[#fa541c] mr-1">*</span>密码</label>
              <div>
                <div className="relative">
                  <input id="cloud-password" type={showPassword ? "text" : "password"} value={password} onChange={event => { setPassword(event.target.value); setErrors(previous => ({ ...previous, password: "" })); }} placeholder="请输入密码" className={cn(drawerStyles.input, "pr-10")} />
                  <button type="button" aria-label={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword(value => !value)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
              </div>
            </div>
            {platform === "天翼云" && (
              <div className={drawerStyles.field}>
                <label htmlFor="cloud-extra-params" className={drawerStyles.label}>额外参数</label>
                <div className="relative">
                  <input id="cloud-extra-params" maxLength={200} value={extraParams} onChange={event => setExtraParams(event.target.value)} placeholder="请输入额外参数" className={cn(drawerStyles.input, "pr-20")} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">{extraParams.length} / 200</span>
                </div>
              </div>
            )}
            {platform === "华为云" && (
              <>
                <div className={drawerStyles.field}>
                  <label htmlFor="cloud-project-id" className={drawerStyles.label}><span className="text-[#fa541c] mr-1">*</span>项目ID</label>
                  <div>
                    <div className="relative">
                      <input id="cloud-project-id" maxLength={200} value={projectId} onChange={event => { setProjectId(event.target.value); setErrors(previous => ({ ...previous, projectId: "" })); }} placeholder="请输入项目ID" className={cn(drawerStyles.input, "pr-20")} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">{projectId.length} / 200</span>
                    </div>
                    {errors.projectId && <p className="text-red-500 text-xs mt-1.5">{errors.projectId}</p>}
                  </div>
                </div>
                <div className={drawerStyles.field}>
                  <label htmlFor="cloud-domain-id" className={drawerStyles.label}><span className="text-[#fa541c] mr-1">*</span>domainID</label>
                  <div>
                    <div className="relative">
                      <input id="cloud-domain-id" maxLength={200} value={domainId} onChange={event => { setDomainId(event.target.value); setErrors(previous => ({ ...previous, domainId: "" })); }} placeholder="请输入domainID" className={cn(drawerStyles.input, "pr-20")} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">{domainId.length} / 200</span>
                    </div>
                    {errors.domainId && <p className="text-red-500 text-xs mt-1.5">{errors.domainId}</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={drawerStyles.footer}>
          <Button type="button" variant="outline" onClick={onClose} className={drawerStyles.secondary}>取消</Button>
          <Button type="submit" className={drawerStyles.primary}>确认</Button>
        </div>
      </form>
    </div>,
    document.body
  );
}

function CloudAccountPanel({ onNotify }: { onNotify: (message: string) => void }) {
  const [accounts, setAccounts] = useState<CloudAccount[]>(initialCloudAccounts);
  const [keyword, setKeyword] = useState("");
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CloudAccount | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: "release" | "delete"; account: CloudAccount } | null>(null);
  const visibleAccounts = accounts.filter(account => account.id.toLowerCase().includes(keyword.trim().toLowerCase()));

  const createAccount = (values: CloudAccountFormValues) => {
    const accountId = `cloud-${Date.now().toString(36)}`;
    setAccounts(previous => [{
      id: accountId, projectId: values.platform === "华为云" ? values.projectId : "—", domainId: values.platform === "华为云" ? values.domainId : "—", status: "使用完",
      platform: values.platform, userAccount: values.account, createdAt: getCurrentDateTimeSecond()
    }, ...previous]);
    setKeyword("");
    setShowCreateDrawer(false);
    onNotify("云账号创建成功");
  };

  const editAccount = (values: CloudAccountFormValues) => {
    if (!editingAccount) return;
    setAccounts(previous => previous.map(item => item.id === editingAccount.id ? {
      ...item,
      platform: values.platform,
      userAccount: values.account,
      projectId: values.platform === "华为云" ? values.projectId : "—",
      domainId: values.platform === "华为云" ? values.domainId : "—",
      extraParams: values.platform === "天翼云" ? values.extraParams : ""
    } : item));
    setEditingAccount(null);
    onNotify("云账号信息已更新");
  };

  const deleteAccount = (account: CloudAccount) => {
    setAccounts(previous => previous.filter(item => item.id !== account.id));
    setConfirmAction(null);
    onNotify("云账号已删除");
  };

  const releaseAccount = (account: CloudAccount) => {
    setAccounts(previous => previous.map(item => item.id === account.id
      ? { ...item, status: "使用完", userAccount: "—" }
      : item));
    setConfirmAction(null);
    onNotify("账号已释放");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <h1 className="text-xl font-bold text-neutral-900">云账号</h1>
        <p className="text-sm text-neutral-500 mb-0.5">统一管理竞赛使用的云平台账号及分配状态</p>
      </div>
      <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              aria-label="输入云账号"
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder="请输入云账号"
              className="h-9 w-full border border-neutral-border rounded-full pl-9 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
            />
          </div>
          <Button onClick={() => setShowCreateDrawer(true)} className="h-9 px-5 rounded-[4px] bg-[#fa541c] hover:bg-[#e84a15] text-white text-sm font-semibold border-0 cursor-pointer self-end sm:self-auto">
            <Plus className="w-4 h-4" />新建
          </Button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1080px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-border text-[13px] text-neutral-600">
                {["云账号", "项目ID", "domainID", "使用状态", "平台", "使用账号", "创建时间", "操作"].map(label => (
                  <th key={label} className="px-5 py-3.5 font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleAccounts.map(account => (
                <tr key={account.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/40 text-[13px]">
                  <td className="px-5 py-4 text-neutral-700 font-medium"><span className="block max-w-[150px] truncate" title={account.id}>{account.id}</span></td>
                  <td className="px-5 py-4 text-neutral-500">{account.projectId}</td>
                  <td className="px-5 py-4 text-neutral-500">{account.domainId}</td>
                  <td className="px-5 py-4"><span className={cn("inline-flex px-2 py-0.5 rounded-[4px] border text-[12px]", account.status === "使用中" ? "bg-orange-50 text-orange-500 border-orange-200" : "bg-neutral-100 text-neutral-500 border-neutral-200")}>{account.status}</span></td>
                  <td className="px-5 py-4 text-neutral-700 font-medium">{account.platform}</td>
                  <td className="px-5 py-4 text-neutral-600"><span className="block max-w-[150px] truncate" title={account.userAccount}>{account.userAccount}</span></td>
                  <td className="px-5 py-4 text-neutral-500 font-mono text-xs">{account.createdAt}</td>
                  <td className="px-5 py-4"><div className="flex items-center gap-2.5">
                    <button onClick={() => setEditingAccount(account)} className="text-[#fa541c] hover:text-[#e84a15] font-semibold cursor-pointer">编辑</button>
                    <span className="text-neutral-200">|</span>
                    <button onClick={() => setConfirmAction({ type: "delete", account })} className="text-[#fa541c] hover:text-[#e84a15] font-semibold cursor-pointer">删除</button>
                    <span className="text-neutral-200">|</span>
                    <button disabled={account.status === "使用完"} onClick={() => setConfirmAction({ type: "release", account })} className="text-[#fa541c] hover:text-[#e84a15] disabled:text-[#ffbb96] disabled:cursor-not-allowed font-semibold cursor-pointer">释放账号</button>
                  </div></td>
                </tr>
              ))}
              {visibleAccounts.length === 0 && <tr><td colSpan={8} className="py-16 text-center text-sm text-neutral-400">暂无符合条件的云账号</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-neutral-border/30 text-right text-[13px] text-neutral-500">共 {visibleAccounts.length} 条</div>
      </div>
      {showCreateDrawer && <CloudAccountCreateDrawer onClose={() => setShowCreateDrawer(false)} onSave={createAccount} />}
      {editingAccount && <CloudAccountCreateDrawer mode="edit" initialAccount={editingAccount} onClose={() => setEditingAccount(null)} onSave={editAccount} />}
      {confirmAction && (
        <div className="fixed inset-0 z-[240] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left p-4" onClick={() => setConfirmAction(null)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="cloud-confirm-title" className="bg-white rounded-[8px] shadow-2xl w-full max-w-[460px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" onClick={event => event.stopPropagation()}>
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 id="cloud-confirm-title" className="text-[16px] font-bold text-[#262626]">{confirmAction.type === "release" ? "确认释放账号" : "确认删除账号"}</h2>
              <button type="button" aria-label="关闭确认弹窗" onClick={() => setConfirmAction(null)} className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex items-start gap-3 bg-white">
              <div className="w-5 h-5 rounded-full bg-[#f5a94f] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
              <div className="text-[14px] text-neutral-700 leading-6">
                {confirmAction.type === "release" ? (
                  <>请确认当前账号是否仍在使用中，是否确认释放 <span className="text-[#fa541c] font-medium break-all">{confirmAction.account.id}</span> 账号？</>
                ) : (
                  <>确定要删除云账号 <span className="text-[#fa541c] font-medium break-all">{confirmAction.account.id}</span> 吗？该操作不可撤销。</>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button type="button" variant="outline" onClick={() => setConfirmAction(null)} className={drawerStyles.secondary}>取消</Button>
              <Button type="button" onClick={() => confirmAction.type === "release" ? releaseAccount(confirmAction.account) : deleteAccount(confirmAction.account)} className={drawerStyles.primary}>确定</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCompetitionsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"cloud" | "competition">("competition");
  const [activeTab, setActiveTab] = useState<"overview" | "list" | "review" | "teams" | "scores">("list");

  // --- Dynamic State Managers ---
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
  const [applications, setApplications] = useState<ApplicationRequest[]>(initialApplications);
  const [teams, setTeams] = useState<Record<string, Team[]>>(initialTeams);
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardRecord[]>>(initialLeaderboards);

  // --- Filter & Search States ---
  const [compSearch, setCompSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionMenu, setActionMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scoreMode, setScoreMode] = useState<"grade" | "view">("view");
  const [managementDialog, setManagementDialog] = useState<{ id: string; mode: "cockpit" } | null>(null);
  const [operationsTarget, setOperationsTarget] = useState<{ id: string; mode: CompetitionOperationMode } | null>(null);
  const [operationsData, setOperationsData] = useState<Record<string, CompetitionOperationData>>({});

  useEffect(() => { setPage(1); setActionMenu(null); }, [compSearch, pageSize]);
  useEffect(() => {
    if (!actionMenu) return;
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && !(event.target instanceof Element && event.target.closest("[data-comp-actions]"))) setActionMenu(null);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setActionMenu(null); };
    const closeOnScroll = (event: Event) => {
      if (!menuRef.current?.contains(event.target as Node) && !(event.target instanceof Element && event.target.closest("[data-comp-actions]"))) setActionMenu(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", closeOnScroll);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", closeOnScroll);
      window.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [actionMenu]);

  // --- Dropdown Selector for Sub-tabs ---
  const [selectedCompId, setSelectedCompId] = useState("comp-1");

  // --- Create / Edit Drawer Sheet ---
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingCompId, setEditingCompId] = useState<string | null>(null);

  // --- Modals & Popovers ---
  const [selectedApp, setSelectedApp] = useState<ApplicationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectReasonInput, setShowRejectReasonInput] = useState(false);

  // Score Adjustment Modal States
  const [adjustingRecord, setAdjustingRecord] = useState<LeaderboardRecord | null>(null);
  const [adjustScoreVal, setAdjustScoreVal] = useState(0.5);

  // Dynamic Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- Event Handlers ---

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCreateDrawer = () => {
    setDrawerMode("create");
    setEditingCompId(null);
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (comp: Competition) => {
    setDrawerMode("edit");
    setEditingCompId(comp.id);
    setShowDrawer(true);
  };

  const handleSaveCompetition = (values: CompetitionFormValues) => {
    const startFormatted = normalizeDateTimeString(values.startAt, "09:00:00");
    const endFormatted = normalizeDateTimeString(values.endAt, "18:00:00");
    const fields = {
      ...values,
      startAt: startFormatted,
      endAt: endFormatted,
      duration: `${startFormatted} 至 ${endFormatted}`
    };
    if (drawerMode === "create") {
      const newId = `comp-${Date.now()}`;
      const newComp: Competition = {
        ...fields, id: newId, status: "筹备中", teamsCount: 0,
        format: "团队赛 (最大5人)", ruleMaxSubmissions: 5, ruleFiles: "zip",
        ruleGpu: "50 GPU小时", evalMetric: "Accuracy", visible: true,
        creator: "运营管理员", createdAt: getCurrentDateTimeSecond()
      };
      setCompetitions(previous => [newComp, ...previous]);
      setCompSearch("");
      setPage(1);
      setTeams(previous => ({ ...previous, [newId]: [] }));
      setLeaderboards(previous => ({ ...previous, [newId]: [] }));
      triggerToast(`成功创建竞赛：「${values.name}」`);
    } else if (editingCompId) {
      setCompetitions(previous => previous.map(comp => comp.id === editingCompId ? { ...comp, ...fields } : comp));
      triggerToast(`已保存竞赛：「${values.name}」`);
    }
    setShowDrawer(false);
  };

  const handleDeleteCompetition = (id: string, name: string) => {
    if (confirm(`确定要彻底删除该竞赛项目吗？「${name}」\n删除后将无法恢复其下的队伍及成绩记录！`)) {
      setCompetitions(competitions.filter(c => c.id !== id));
      setTeams(prev => { const next = { ...prev }; delete next[id]; return next; });
      setLeaderboards(prev => { const next = { ...prev }; delete next[id]; return next; });
      setOperationsData(prev => { const next = { ...prev }; delete next[id]; return next; });
      if (selectedCompId === id) setSelectedCompId(competitions.find(comp => comp.id !== id)?.id || "");
      triggerToast(`🗑️ 已彻底删除竞赛项目：「${name}」`);
    }
  };

  // Applications approval workflows
  const handleApproveRequest = (app: ApplicationRequest) => {
    // 1. Update request status to '已通过'
    setApplications(applications.map(a => a.id === app.id ? { ...a, status: "已通过" } : a));
    
    // 2. Automatically generate and append it to our Master Competitions array!
    const newCompId = `comp-${Date.now()}`;
    const newComp: Competition = {
      id: newCompId,
      name: app.contestName,
      type: "大模型开发", // default type matching typical GNN context
      status: "筹备中",
      duration: "2026-06-15 09:00:00 至 2026-08-15 18:00:00",
      teamsCount: 0,
      participants: 0,
      description: app.description,
      format: app.format,
      ruleMaxSubmissions: 5,
      ruleFiles: "zip",
      ruleGpu: "50 GPU小时",
      evalMetric: "AUC",
      visible: true, creator: app.teacher, createdAt: getCurrentDateTimeSecond()
    };

    setCompetitions([newComp, ...competitions]);
    setTeams(prev => ({ ...prev, [newCompId]: [] }));
    setLeaderboards(prev => ({ ...prev, [newCompId]: [] }));

    setSelectedApp(null);
    triggerToast(`✅ 审核通过！该校级赛事已成功升级并上架平台公开竞赛列表。`);
  };

  const handleRejectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !rejectReason.trim()) return;

    setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, status: "已拒绝" } : a));
    setSelectedApp(null);
    setRejectReason("");
    setShowRejectReasonInput(false);
    triggerToast(`❌ 竞赛公开申请已被拒绝，已反馈退回原因给对应老师。`);
  };

  // Team controls: Ban & Unban
  const handleToggleTeamBan = (teamId: string, currentStatus: Team["status"]) => {
    const nextStatus: Team["status"] = currentStatus === "正常" ? "已封禁" : "正常";
    const compTeams = teams[selectedCompId] || [];

    setTeams({
      ...teams,
      [selectedCompId]: compTeams.map(t => t.id === teamId ? { ...t, status: nextStatus } : t)
    });

    triggerToast(nextStatus === "已封禁" ? `🚫 已封禁该参赛队伍，终止其提交测试权限` : `✅ 已解除该队伍封禁，恢复其实验提交权限`);
  };

  // Leaderboard Score manually change & rank sort
  const handleOpenScoreAdjust = (record: LeaderboardRecord) => {
    setAdjustingRecord(record);
    setAdjustScoreVal(record.score);
  };

  const handleSaveAdjustedScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingRecord) return;

    const compLeaderboard = leaderboards[selectedCompId] || [];
    
    // Update score
    const updatedList = compLeaderboard.map(rec => 
      rec.id === adjustingRecord.id ? { ...rec, score: parseFloat(adjustScoreVal.toFixed(4)), time: "刚刚手动调整" } : rec
    );

    // Sort descending by score
    updatedList.sort((a, b) => b.score - a.score);

    setLeaderboards({
      ...leaderboards,
      [selectedCompId]: updatedList
    });

    setAdjustingRecord(null);
    triggerToast(`🏆 成绩调整成功！排行榜排名已根据新分数重新排列。`);
  };

  // Excel package data exporter simulator
  const handleSimulateExport = (datasetName: string) => {
    setIsExporting(true);
    triggerToast(`⏳ 正在准备并打包「${datasetName}」历史提交与分析报表...`);
    
    setTimeout(() => {
      setIsExporting(false);
      triggerToast(`📥 打包完毕！「${datasetName}_数据导出.xlsx」已下载至本地。`);
    }, 2000);
  };

  // Filters computed list
  const filteredCompetitions = competitions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(compSearch.toLowerCase()) || c.description.toLowerCase().includes(compSearch.toLowerCase());
    return matchesSearch;
  });

  const pageCount = Math.max(1, Math.ceil(filteredCompetitions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedCompetitions = filteredCompetitions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const actionClass = "text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap";
  const menuCompetition = competitions.find(comp => comp.id === actionMenu?.id);
  const dialogCompetition = competitions.find(comp => comp.id === managementDialog?.id);

  const operationCompetition = competitions.find(comp => comp.id === operationsTarget?.id);
  const openOperations = (comp: Competition, mode: CompetitionOperationMode) => {
    setActionMenu(null);
    setOperationsData(prev => prev[comp.id] ? prev : {
      ...prev,
      [comp.id]: createCompetitionOperationData(comp, (teams[comp.id] || []).map(team => {
        const record = leaderboards[comp.id]?.find(item => item.teamId === team.id);
        return { id: team.id, name: team.captain, file: record?.file, report: record?.codeReport };
      }))
    });
    setOperationsTarget({ id: comp.id, mode });
  };
  const openManagementDialog = (comp: Competition, mode: "checks" | "scoring" | "proctor" | "cockpit") => {
    setActionMenu(null);
    if (mode === "cockpit") navigate(`/admin/competitions/${comp.id}/cockpit`);
    else openOperations(comp, mode);
  };

  const handleCopyCompetition = (comp: Competition) => {
    const id = `comp-${Date.now()}`;
    setCompetitions(prev => [{ ...comp, id, name: `${comp.name}（副本）`, status: "筹备中", visible: false, teamsCount: 0, participants: 0, creator: "运营管理员", createdAt: getCurrentDateTimeSecond() }, ...prev]);
    setTeams(prev => ({ ...prev, [id]: [] }));
    setLeaderboards(prev => ({ ...prev, [id]: [] }));
    if (operationsData[comp.id]) setOperationsData(prev => ({ ...prev, [id]: { ...structuredClone(prev[comp.id]), candidates: [] } }));
    setCompSearch(""); setPage(1);
    triggerToast("竞赛已复制，副本默认隐藏并处于筹备中");
  };

  const resetCompetition = (comp: Competition) => {
    if (!window.confirm(`确定重置「${comp.name}」吗？将清空报名队伍及成绩，并恢复为隐藏、筹备中状态。`)) return;
    setCompetitions(prev => prev.map(item => item.id === comp.id ? { ...item, status: "筹备中", visible: false, teamsCount: 0, participants: 0 } : item));
    setTeams(prev => ({ ...prev, [comp.id]: [] }));
    setLeaderboards(prev => ({ ...prev, [comp.id]: [] }));
    setOperationsData(prev => prev[comp.id] ? { ...prev, [comp.id]: { ...prev[comp.id], candidates: [] } } : prev);
    triggerToast("竞赛已重置，规则配置已保留");
  };


  return (
    <div className="flex min-h-full w-full bg-[#f5f6f8] text-neutral-800 font-sans">
      <aside className="w-[200px] bg-white border-r border-neutral-border flex-shrink-0 min-h-full">
        <div className="p-5 border-b border-neutral-border">
          <h2 className="text-lg font-semibold text-neutral-title">竞赛管理</h2>
        </div>
        <nav className="p-4 space-y-1">
          <button
            type="button"
            onClick={() => { setActiveSection("cloud"); setActionMenu(null); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer border-0 text-left",
              activeSection === "cloud" ? "bg-[#fff2e8] text-[#fa541c] font-semibold" : "bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Cloud className="w-4 h-4 shrink-0" />
            <span>云账号</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("competition")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer border-0 text-left",
              activeSection === "competition" ? "bg-[#fff2e8] text-[#fa541c] font-semibold" : "bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>竞赛管理</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 min-w-0 overflow-auto p-6 flex flex-col custom-scrollbar relative">
        {toastMessage && (
          <div role="status" className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-800 text-xs font-bold animate-slide-up">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {activeSection === "cloud" && <CloudAccountPanel onNotify={triggerToast} />}

        <div className={activeSection === "competition" ? "contents" : "hidden"}>
        {activeTab !== "list" && <button onClick={() => setActiveTab("list")} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#fa541c] cursor-pointer mb-5 self-start"><ChevronLeft className="w-4 h-4" />返回竞赛列表</button>}

        {actionMenu && menuCompetition && createPortal(
          <div ref={menuRef} role="menu" aria-label="竞赛更多操作" className="fixed w-[132px] bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[60] overflow-y-auto py-1 max-h-[calc(100vh-16px)]" style={{ top: actionMenu.top, left: actionMenu.left }}>
            {[
              { label: "编辑竞赛", run: () => handleOpenEditDrawer(menuCompetition) },
              { label: "检查项", run: () => openManagementDialog(menuCompetition, "checks") },
              { label: "分值配比", run: () => openManagementDialog(menuCompetition, "scoring") },
              { label: "监考信息", run: () => openManagementDialog(menuCompetition, "proctor") },
              { label: "参赛队伍", run: () => { setSelectedCompId(menuCompetition.id); setActiveTab("teams"); } },
              { label: "复制", run: () => handleCopyCompetition(menuCompetition) },
              { label: menuCompetition.visible ? "隐藏" : "显示", run: () => { setCompetitions(prev => prev.map(comp => comp.id === menuCompetition.id ? { ...comp, visible: !comp.visible } : comp)); triggerToast(menuCompetition.visible ? "竞赛已隐藏" : "竞赛已显示"); } },
              { label: "驾驶舱", run: () => openManagementDialog(menuCompetition, "cockpit") },
              { label: "重置", danger: true, run: () => resetCompetition(menuCompetition) },
              { label: "删除", danger: true, run: () => handleDeleteCompetition(menuCompetition.id, menuCompetition.name) }
            ].map(action => <button key={action.label} role="menuitem" onClick={() => { setActionMenu(null); action.run(); }} className={cn("block w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer", action.danger ? "text-red-500 hover:bg-red-50" : "text-neutral-700 hover:bg-orange-50/40 hover:text-[#fa541c]")}>{action.label}</button>)}
          </div>, document.body
        )}

        <CompetitionOperationsDrawer
          target={operationsTarget && operationCompetition ? { competition: operationCompetition, mode: operationsTarget.mode } : null}
          data={operationsTarget ? operationsData[operationsTarget.id] || null : null}
          onChange={data => { if (operationsTarget) setOperationsData(prev => ({ ...prev, [operationsTarget.id]: data })); }}
          onClose={() => setOperationsTarget(null)}
          onNotify={triggerToast}
        />
        {managementDialog && dialogCompetition && (
          <div className={drawerStyles.overlay} onClick={() => setManagementDialog(null)}>
            <div role="dialog" aria-modal="true" aria-label="竞赛驾驶舱" className={cn(drawerStyles.panel, "max-w-[680px]")} onClick={event => event.stopPropagation()}>
              <div className={drawerStyles.header}><h2 className={drawerStyles.title}>竞赛驾驶舱</h2><button aria-label="关闭驾驶舱" onClick={() => setManagementDialog(null)} className={drawerStyles.close}><X className="w-4 h-4" /></button></div>
              <div className={drawerStyles.body}><p className="text-neutral-500">{dialogCompetition.name}</p><div className="grid grid-cols-2 gap-4">{[
                ["报名人数", dialogCompetition.participants.toLocaleString()], ["参赛队伍", dialogCompetition.teamsCount.toLocaleString()],
                ["已上榜队伍", (leaderboards[dialogCompetition.id]?.length || 0).toString()], ["最高得分", leaderboards[dialogCompetition.id]?.length ? Math.max(...leaderboards[dialogCompetition.id].map(record => record.score)).toFixed(4) : "—"]
              ].map(([label, value]) => <div key={label} className="bg-neutral-50 rounded border border-neutral-100 p-4"><p className="text-xs text-neutral-500 mb-2">{label}</p><p className="text-xl font-semibold text-neutral-800">{value}</p></div>)}</div><p className="text-neutral-500 text-xs">竞赛周期：{dialogCompetition.duration}</p></div>
              <div className={drawerStyles.footer}><Button variant="outline" className={drawerStyles.secondary} onClick={() => setManagementDialog(null)}>关闭</Button></div>
            </div>
          </div>
        )}

        {/* ==================== 1. 数据大盘 ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <BarChart2 className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>竞赛运营统计大盘</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                统计平台当前举办的公开赛事及校级创新竞赛的核心运营指标、参赛活跃度与算力分配配额开销统计。
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 shrink-0">
              {[
                { title: "公开赛事总量", value: "8 场", sub: "包含 3 场在办大模型创新赛", color: "text-[#fa541c]" },
                { title: "参赛注册总人次", value: "4,846 人", sub: "本月新增活跃 1,245 人", color: "text-emerald-500" },
                { title: "提报算法作品次数", value: "15,640 次", sub: "沙箱评测自动比对通过率 87%", color: "text-blue-500" },
                { title: "GPU累计算力消耗", value: "1,840 h", sub: "当前队列空闲，平均等待 12s", color: "text-purple-500" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider">{card.title}</span>
                  <div className="my-3">
                    <span className={cn("text-2.5xl font-black font-mono", card.color)}>{card.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-body">{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Charts and distributions mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Box 1: Popular categories */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                    <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-[#fa541c]" />
                      <span>热门赛事赛道分布比例</span>
                    </span>
                    <span className="text-[10px] text-neutral-caption font-bold">热门赛道占比统计</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { type: "大模型应用开发 (LLM Apps)", count: 2100, pct: "43%", color: "bg-[#fa541c]" },
                      { type: "计算机视觉与图像分割 (CV)", count: 1200, pct: "25%", color: "bg-emerald-500" },
                      { type: "经典非平衡样本分类 (ML)", count: 890, pct: "18%", color: "bg-blue-500" },
                      { type: "安全防御与云渗透 (CTF)", count: 656, pct: "14%", color: "bg-purple-500" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-neutral-body">
                          <span>{item.type}</span>
                          <span>{item.count}人 ({item.pct})</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-500", item.color)} style={{ width: item.pct }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-neutral-caption font-medium">数据基于 2026 年度统计导出，各赛道活跃比例实时同步。</span>
                  <button 
                    onClick={() => handleSimulateExport("平台整体竞赛数据统计大盘")}
                    disabled={isExporting}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出大盘数据报表</span>
                  </button>
                </div>
              </div>

              {/* Box 2: Quick Status Indicator overview */}
              <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                    <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>正在开展中赛事动态</span>
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {competitions.slice(0, 3).map((c, i) => (
                      <div key={i} className="flex justify-between items-start p-3 bg-neutral-50 rounded-lg border border-neutral-200/50">
                        <div className="space-y-1">
                          <span className="font-bold text-neutral-title block max-w-[180px] truncate">{c.name}</span>
                          <span className="text-[10px] text-neutral-caption block font-mono">{c.duration}</span>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-[4px] text-[9px] font-black border uppercase shrink-0 scale-90",
                          c.status === "进行中" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                          c.status === "报名中" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-neutral-50 border-neutral-200 text-neutral-500"
                        )}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab("list")}
                  className="w-full text-center text-[#fa541c] hover:text-[#e84a15] text-xs font-bold py-2 border border-[#ffbb96]/45 bg-[#fff2e8]/45 hover:bg-[#fff2e8] rounded-lg transition-colors cursor-pointer shrink-0 mt-4 block"
                >
                  查看完整竞赛列表 ➔
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 2. 竞赛列表与状态管理 ==================== */}
        {activeTab === "list" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4 mb-4">
              <h1 className="text-xl font-bold text-neutral-900">竞赛管理</h1>
              <p className="text-sm text-neutral-500 mb-0.5">统一管理竞赛信息、参赛报名与成绩，跟进赛事全流程</p>
            </div>
            <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
                <div className="flex items-center flex-wrap gap-3">
                  <div className="relative w-72 max-w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input aria-label="搜索竞赛" type="text" placeholder="搜索竞赛名称或描述" value={compSearch} onChange={e => setCompSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400" />
                  </div>
                </div>
                <Button onClick={handleOpenCreateDrawer} className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0 shrink-0 self-end lg:self-auto">
                  <Plus className="w-3.5 h-3.5" />新建竞赛
                </Button>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1100px]">
                  <thead><tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="pl-6 pr-3 py-3.5 font-medium">竞赛名称</th>
                    {["可见状态", "竞赛状态", "报名人数", "创建人", "开始时间", "结束时间", "创建时间"].map(label => <th key={label} className="px-3 py-3.5 font-medium">{label}</th>)}
                    <th className="pl-3 pr-6 py-3.5 font-medium sticky right-0 bg-[#fafafa]">操作</th>
                  </tr></thead>
                  <tbody>
                    {pagedCompetitions.length === 0 ? <tr><td colSpan={9} className="py-16 text-center text-sm text-neutral-400"><Search className="w-8 h-8 mx-auto mb-3 text-neutral-300" />暂无符合条件的竞赛</td></tr> : pagedCompetitions.map(comp => (
                      <tr key={comp.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                        <td className="pl-6 pr-3 py-4"><span className="text-neutral-800 font-medium block max-w-[260px] truncate" title={comp.name}>{comp.name}</span></td>
                        <td className="px-3 py-4"><span className={cn("px-2 py-0.5 text-[12px] rounded-[4px] border", comp.visible ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>{comp.visible ? "显示" : "隐藏"}</span></td>
                        <td className="px-3 py-4"><span className={cn("px-2 py-0.5 text-[12px] rounded-[4px] border", comp.status === "进行中" ? "bg-green-50 text-green-600 border-green-200" : comp.status === "报名中" ? "bg-blue-50 text-blue-600 border-blue-200" : comp.status === "筹备中" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-500 border-red-200")}>{comp.status}</span></td>
                        <td className="px-3 py-4 text-neutral-600">{comp.participants.toLocaleString()}</td>
                        <td className="px-3 py-4 text-neutral-600">{comp.creator}</td>
                        <td className="px-3 py-4 text-neutral-600">{renderDateTimeCell(comp.startAt || comp.duration.split(" 至 ")[0], "09:00:00")}</td>
                        <td className="px-3 py-4 text-neutral-600">{renderDateTimeCell(comp.endAt || comp.duration.split(" 至 ")[1], "18:00:00")}</td>
                        <td className="px-3 py-4 text-neutral-600">{renderDateTimeCell(comp.createdAt, "00:00:00")}</td>
                        <td className="pl-3 pr-6 py-4 sticky right-0 bg-white group-hover:bg-[#fdfdfd]">
                          <div className="flex items-center gap-2.5">
                            <button className={actionClass} onClick={() => openOperations(comp, "grading")}>批阅</button>
                            <button className={actionClass} onClick={() => openOperations(comp, "results")}>查看成绩</button>
                            <button data-comp-actions aria-label={`${comp.name}的更多操作`} aria-haspopup="menu" aria-expanded={actionMenu?.id === comp.id} className={`${actionClass} flex items-center gap-0.5`} onClick={event => {
                              if (actionMenu?.id === comp.id) { setActionMenu(null); return; }
                              const rect = event.currentTarget.getBoundingClientRect();
                              const height = 340;
                              setActionMenu({ id: comp.id, left: Math.max(8, rect.right - 132), top: Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - height - 8)) });
                            }}>更多<ChevronDown className={cn("w-3 h-3 text-neutral-400 transition-transform", actionMenu?.id === comp.id && "rotate-180")} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-end px-6 py-4 gap-4 border-t border-neutral-border/30">
                <span className="text-[13px] text-neutral-500">共 {filteredCompetitions.length} 条</span>
                <div className="flex items-center gap-2">
                  <Button aria-label="上一页" variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-white" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="w-3.5 h-3.5" /></Button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).filter(number => number === 1 || number === pageCount || Math.abs(number - currentPage) <= 1).map((number, index, numbers) => <React.Fragment key={number}>
                    {index > 0 && number - numbers[index - 1] > 1 && <span className="text-neutral-400 text-xs">…</span>}
                    <Button variant="outline" size="sm" aria-label={`第${number}页`} aria-current={currentPage === number ? "page" : undefined} onClick={() => setPage(number)} className={cn("h-7 w-7 p-0 rounded-sm", currentPage === number ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#e84a15] hover:text-white" : "bg-white")}>{number}</Button>
                  </React.Fragment>)}
                  <Button aria-label="下一页" variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-white" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight className="w-3.5 h-3.5" /></Button>
                </div>
                <select aria-label="每页条数" value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white">
                  {[10, 20, 50].map(size => <option key={size} value={size}>{size} 条/页</option>)}
                </select>
              </div>
            </div>

            {showDrawer && <CompetitionFormDrawer
              initialCompetition={drawerMode === "edit" ? competitions.find(comp => comp.id === editingCompId) || null : null}
              onClose={() => setShowDrawer(false)}
              onSave={handleSaveCompetition}
            />}

          </div>
        )}

        {/* ==================== 3. 公开申请审核 ==================== */}
        {activeTab === "review" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <Shield className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>公开赛事申请审核控制台</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                处理来自高校合作教师发起的“校级封闭赛/课程赛升级为平台公开竞赛”申请。通过升级的赛事将享受平台算力分发及高维自动排行榜。
              </p>
            </div>

            {/* List of pending items */}
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {applications.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-neutral-border text-neutral-400">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <span className="text-xs font-semibold">所有教师申请已审核处理完毕，状态清空！</span>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs space-y-4 relative overflow-hidden transition-all duration-200 hover:shadow-xs">
                    
                    {/* Status Badge background hint stripe */}
                    <div className={cn(
                      "absolute top-0 left-0 w-2 h-full",
                      app.status === "待审核" ? "bg-amber-500" :
                      app.status === "已通过" ? "bg-emerald-500" : "bg-red-500"
                    )} />

                    {/* App Row Header */}
                    <div className="flex justify-between items-start pl-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-neutral-title text-sm block">{app.contestName}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-[4px] text-[9px] font-black border uppercase tracking-wider",
                            app.status === "待审核" ? "bg-amber-50 border-amber-200 text-amber-600" :
                            app.status === "已通过" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"
                          )}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[10.5px] text-neutral-caption font-semibold mt-1">
                          <span>申请单位: {app.school}</span>
                          <span>主事申报人: {app.teacher}</span>
                          <span>提交时间: {app.submitDate}</span>
                        </div>
                      </div>
                      
                      {/* Review Main CTA action triggers */}
                      {app.status === "待审核" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-3xs"
                          >
                            审核公开申请
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-caption font-bold">审核流程已终结</span>
                      )}
                    </div>

                    {/* App Specs body */}
                    <div className="bg-neutral-50/50 p-4 rounded-lg text-xs space-y-3 pl-3 text-neutral-body border border-neutral-100">
                      <div>
                        <strong>💡 赛事详尽主旨背景：</strong>
                        <p className="mt-1 leading-relaxed text-[11px] font-semibold text-neutral-title">{app.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-100 text-[11px]">
                        <div><strong>赛制形式:</strong> {app.format}</div>
                        <div><strong>评测提交规则:</strong> {app.rules}</div>
                        <div><strong>计算评分标准:</strong> {app.scoring}</div>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* --- Open Requests Details Modal dialog --- */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs animate-fade-in p-4">
                <div className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Shield className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>审核公开竞赛升级申请</span>
                    </span>
                    <button 
                      onClick={() => { setSelectedApp(null); setShowRejectReasonInput(false); }}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-6 overflow-y-auto space-y-4 max-h-[420px] custom-scrollbar">
                    <div className="p-4 bg-[#fff2e8] border border-[#ffbb96]/45 rounded-lg space-y-2">
                      <div className="text-[11px] font-black text-[#fa541c]">升级后公开说明：</div>
                      <p className="text-[10.5px] leading-relaxed text-neutral-body font-medium">
                        一旦通过审核，该赛事将自动转换升级并**上架至平台公开竞赛列表中**。平台将向全国所有高校租户用户敞开注册报名，并由平台自动托管调度沙箱算力容器进行自动算法检测评测。
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div><strong>申请赛项:</strong> <span className="font-bold text-neutral-title">{selectedApp.contestName}</span></div>
                      <div><strong>发起单位:</strong> <span className="font-medium text-neutral-body">{selectedApp.school} - {selectedApp.teacher}</span></div>
                      <div><strong>考核主旨:</strong> <p className="text-neutral-body italic leading-relaxed font-medium bg-neutral-50 p-2.5 rounded border border-neutral-100">{selectedApp.description}</p></div>
                    </div>

                    {showRejectReasonInput && (
                      <div className="space-y-2 pt-2 border-t border-neutral-100 animate-slide-up">
                        <label className="font-bold text-neutral-700 block text-red-500">请输入回绝驳回原因：</label>
                        <textarea
                          rows={3}
                          required
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="说明驳回理由，如: 算力配额超限，请降低测试次数..."
                          className="w-full border border-neutral-200 rounded-lg p-2 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    {showRejectReasonInput ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowRejectReasonInput(false)}
                          className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                        >
                          返回
                        </button>
                        <button
                          type="button"
                          onClick={handleRejectRequest}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          确认拒绝申请
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowRejectReasonInput(true)}
                          className="bg-white hover:bg-red-50 text-red-500 font-bold px-4 py-2 border border-red-200 rounded-lg cursor-pointer transition-colors"
                        >
                          驳回申请
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(selectedApp)}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                        >
                          同意升级公开
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== 4. 参赛队伍管理 ==================== */}
        {activeTab === "teams" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header + Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <Users className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>参赛报名队伍名册</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  检索名册、筛选及监控队伍提交频次。对于违规刷分或脚本异常提报可直接拉黑封禁。
                </p>
              </div>

              {/* Contest selector mapping */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                <span>选择目标公开竞赛:</span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#fa541c]"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teams master list container */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4">队伍名称</th>
                      <th className="px-6 py-4">队长姓名</th>
                      <th className="px-6 py-4">队员结构</th>
                      <th className="px-6 py-4">所属院校</th>
                      <th className="px-6 py-4">沙箱累计提报</th>
                      <th className="px-6 py-4">队伍状态</th>
                      <th className="px-6 py-4">报名登记时间</th>
                      <th className="px-6 py-4 text-center">状态管理</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {(!teams[selectedCompId] || teams[selectedCompId].length === 0) ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <span>该赛事当前暂无注册或提报中的参赛队伍名录。</span>
                        </td>
                      </tr>
                    ) : (
                      teams[selectedCompId].map((team) => (
                        <tr key={team.id} className="hover:bg-neutral-50/30 transition-colors">
                          <td className="px-6 py-4 font-black text-neutral-title">{team.name}</td>
                          <td className="px-6 py-4 font-medium text-neutral-body">{team.captain}</td>
                          <td className="px-6 py-4 font-mono font-semibold text-neutral-body">{team.membersCount} 人结构</td>
                          <td className="px-6 py-4 font-medium text-neutral-body">{team.school}</td>
                          <td className="px-6 py-4 font-mono font-bold text-[#fa541c]">{team.submissions} 次</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded-[4px] text-[9.5px] font-black border uppercase tracking-wider",
                              team.status === "正常" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"
                            )}>
                              {team.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-caption font-semibold">{team.regDate}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleTeamBan(team.id, team.status)}
                              className={cn(
                                "text-xs font-bold px-3 py-1 border rounded-lg cursor-pointer transition-colors shadow-3xs",
                                team.status === "正常" 
                                  ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" 
                                  : "border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                              )}
                            >
                              {team.status === "正常" ? "封禁" : "恢复"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Counts bar */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>当前赛事登记队伍量: {teams[selectedCompId]?.length || 0} 支</span>
                <button
                  onClick={() => handleSimulateExport(`参赛队伍花名册_${selectedCompId}`)}
                  className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1 border border-neutral-200 rounded-lg shadow-3xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出队伍花名册</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 5. 成绩与排行榜 ==================== */}
        {activeTab === "scores" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header + Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <TrendingUp className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>{scoreMode === "grade" ? "竞赛作品批阅" : "竞赛成绩与排行榜"}</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  {scoreMode === "grade" ? "查看参赛作品与评测报告，完成批阅并调整得分。" : "查看参赛队伍的评测得分与排名。"}
                </p>
              </div>

              {/* Contest selector mapping */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                <span>选择目标公开竞赛:</span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#fa541c]"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leaderboard Table container */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4 w-20 text-center">名次</th>
                      <th className="px-6 py-4">参赛队名</th>
                      <th className="px-6 py-4">所属院校</th>
                      <th className="px-6 py-4">评测最高得分</th>
                      <th className="px-6 py-4">最终提交文件</th>
                      <th className="px-6 py-4">自动编译代码报告</th>
                      <th className="px-6 py-4">最后提报更新时间</th>
                      {scoreMode === "grade" && <th className="px-6 py-4 text-center">操作</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {(!leaderboards[selectedCompId] || leaderboards[selectedCompId].length === 0) ? (
                      <tr>
                        <td colSpan={scoreMode === "grade" ? 8 : 7} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <span>该赛事当前暂无成绩或算法提交排行榜数据。</span>
                        </td>
                      </tr>
                    ) : (
                      leaderboards[selectedCompId].map((rec, index) => (
                        <tr key={rec.id} className="hover:bg-neutral-50/30 transition-colors">
                          {/* Rank */}
                          <td className="px-6 py-4 text-center select-none">
                            <span className={cn(
                              "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10.5px] font-black font-mono shadow-3xs",
                              index === 0 ? "bg-amber-100 text-amber-600 font-bold" :
                              index === 1 ? "bg-slate-100 text-slate-600 font-bold" :
                              index === 2 ? "bg-orange-100 text-orange-600 font-bold" : "bg-neutral-100 text-neutral-500"
                            )}>
                              {index + 1}
                            </span>
                          </td>
                          {/* Team Name */}
                          <td className="px-6 py-4 font-black text-neutral-title">{rec.teamName}</td>
                          {/* School */}
                          <td className="px-6 py-4 font-medium text-neutral-body">{rec.school}</td>
                          {/* Score */}
                          <td className="px-6 py-4 font-mono font-bold text-[#fa541c] text-sm">
                            {rec.score}
                          </td>
                          {/* File download trigger */}
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-body">
                            <button
                              onClick={() => triggerToast(`📥 正在下载学生最终提交算法压缩包: ${rec.file}`)}
                              className="text-blue-500 hover:text-blue-700 font-medium hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                              title="点击模拟下载包"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{rec.file}</span>
                            </button>
                          </td>
                          {/* Static report snippet */}
                          <td className="px-6 py-4 max-w-[200px]">
                            <span className="text-[10.5px] text-neutral-caption block truncate" title={rec.codeReport}>
                              {rec.codeReport}
                            </span>
                          </td>
                          {/* Update Time */}
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-caption font-semibold">{rec.time}</td>
                          {/* Score Mod trigger */}
                          {scoreMode === "grade" && <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleOpenScoreAdjust(rec)}
                              className="text-xs font-bold text-neutral-title px-2.5 py-1 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors shadow-3xs"
                            >
                              批阅评分
                            </button>
                          </td>}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom statistics and download triggers */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>榜单显示当前前 {leaderboards[selectedCompId]?.length || 0} 支成绩最高的有效队伍</span>
                <button
                  onClick={() => handleSimulateExport(`竞赛成绩排行榜_${selectedCompId}`)}
                  className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1 border border-neutral-200 rounded-lg shadow-3xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出总成绩单EXCEL</span>
                </button>
              </div>

            </div>

            {/* --- Score Adjustment Dialog Modal --- */}
            {adjustingRecord && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSaveAdjustedScore} className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Sliders className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>人工修改比赛分值</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setAdjustingRecord(null)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4">
                    <div className="text-xs space-y-1.5">
                      <div><strong>修调队伍:</strong> <span className="font-bold text-neutral-title">{adjustingRecord.teamName} ({adjustingRecord.school})</span></div>
                      <div><strong>原评测得分:</strong> <span className="font-mono text-neutral-caption font-bold">{adjustingRecord.score}</span></div>
                    </div>

                    <div className="space-y-2 border-t border-neutral-100 pt-3">
                      <label className="font-bold text-neutral-700 block">新赋分得分分值：</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0.0}
                          max={1.0}
                          step={0.0001}
                          value={adjustScoreVal}
                          onChange={(e) => setAdjustScoreVal(parseFloat(e.target.value) || 0.0)}
                          className="flex-1 accent-[#fa541c] cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0.0}
                          max={1.0}
                          step={0.0001}
                          value={adjustScoreVal}
                          onChange={(e) => setAdjustScoreVal(parseFloat(e.target.value) || 0.0)}
                          className="w-20 border border-neutral-200 rounded px-2 py-1 text-center font-mono font-bold text-sm bg-neutral-50 text-neutral-800"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-caption block mt-1">※ 请确保录入的值在 0.0000 至 1.0000 范围区间。</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAdjustingRecord(null)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      保存微调值
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}
        </div>
      </div>
    </div>
  );
}
