import { useEffect, useRef, useState } from "react";
import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import CompetitionRegistration from "./CompetitionRegistration";
import CompetitionDetail from "./CompetitionDetail";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  Search, 
  Calendar, 
  ChevronRight, 
  Compass, 
  CheckCircle,
  X,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/competition.css";

export interface Competition {
  id: string;
  name: string;
  type: "AI算法" | "大模型" | "云原生" | "安全运维" | "公有云" | "私有云";
  category: "ai" | "cloud";
  status: "进行中" | "未开始" | "已结束";
  time: string;
  participants: number;
  prize: string;
  sponsor: string;
  desc: string;
  difficulty: "入门" | "中阶" | "高阶";
  rules: string[];
  rewards: { rank: string; prize: string }[];
}

const competitions: Competition[] = [
  {
    id: "comp-101",
    name: "DeepSeek-R1 大模型垂直领域微调算法挑战赛",
    type: "大模型",
    category: "ai",
    status: "进行中",
    time: "2026-05-01 至 2026-06-15",
    participants: 3420,
    prize: "￥120,000",
    sponsor: "翼云智能科技有限公司",
    desc: "本赛事旨在通过行业领域特有问答及逻辑数据，对开源 DeepSeek-R1 模型进行高效参数微调（如 LoRA/QLoRA/Full-FT），在医疗咨询与司法常识两大专业问答指标中突破模型边界。",
    difficulty: "高阶",
    rules: [
      "参赛团队需提交训练脚本、适配器权重（LoRA）及微调前后的系统评测结果。",
      "禁止人工干预标注测试集数据，一经发现取消参赛资格。",
      "性能评估以推理速度、语义相似度得分（BLEU/ROUGE）及行业专家盲审为准。"
    ],
    rewards: [
      { rank: "第一名 (1支队伍)", prize: "￥60,000 + 荣誉证书 + 直通大厂面试" },
      { rank: "第二名 (2支队伍)", prize: "￥20,000 + 荣誉证书" },
      { rank: "优秀奖 (5支队伍)", prize: "￥4,000 + 荣誉证书" }
    ]
  },
  {
    id: "comp-102",
    name: "多云架构高可用部署与故障恢复对抗赛",
    type: "云原生",
    category: "cloud",
    status: "未开始",
    time: "2026-06-20 至 2026-07-30",
    participants: 1280,
    prize: "￥80,000",
    sponsor: "华为云算力部",
    desc: "模拟企业级大规模异地多活及云原生混合部署场景。参赛选手需要快速完成K8s跨云集群联邦搭建，设计完善的高可用网关，并在系统被注入突发性故障的10分钟内实现无感主备切换与自愈恢复。",
    difficulty: "高阶",
    rules: [
      "比赛统一在实训沙箱环境进行，资源额度配额受限。",
      "网络高可用保障率需达到 99.99%，任何请求丢失均扣分。",
      "编写自动化故障响应脚本，根据自愈恢复的响应时效与稳定性评分。"
    ],
    rewards: [
      { rank: "特等奖 (1支队伍)", prize: "￥40,000 + 华为云实训绿卡" },
      { rank: "一等奖 (2支队伍)", prize: "￥15,000" },
      { rank: "极客精神奖 (3支队伍)", prize: "￥5,000" }
    ]
  },
  {
    id: "comp-103",
    name: "企业级网络安全渗透与红蓝防攻防对抗赛",
    type: "安全运维",
    category: "cloud",
    status: "进行中",
    time: "2026-05-15 至 2026-06-20",
    participants: 2150,
    prize: "￥50,000",
    sponsor: "腾讯安全防护实验室",
    desc: "基于真实企业内网拓铺，通过虚拟局域网靶场提供红蓝对决沙盒。红队实施限时多漏洞链渗透，蓝队编写自动化防护与监测规则阻断扫描攻击，考察系统运维安全综合底座能力。",
    difficulty: "中阶",
    rules: [
      "严格遵循竞赛红线，禁止对裁判系统及公共基础设施发起拒绝服务攻击（DDoS）。",
      "以捕获靶机上的特定 FLAG 字符串为得分判定依据。",
      "蓝队必须提交完整的安全审计日志与攻击防御架构分析报告。"
    ],
    rewards: [
      { rank: "卓越红蓝星 (1名)", prize: "￥25,000" },
      { rank: "优秀防守团队 (2名)", prize: "￥10,000" },
      { rank: "技术突破奖 (1名)", prize: "￥5,000" }
    ]
  },
  {
    id: "comp-104",
    name: "Stable Diffusion XL 商业海报创意设计挑战赛",
    type: "AI算法",
    category: "ai",
    status: "已结束",
    time: "2026-03-10 至 2026-04-20",
    participants: 4890,
    prize: "￥30,000",
    sponsor: "视觉中国版权中心",
    desc: "利用 SD-XL 模型与 ControlNet 条件引导技术，根据给定品牌提示词与结构图定制出商业级高拟真平面视觉海报。完美考核参赛者对Prompt工程、微调LoRA模型以及图层融合技术的掌控。",
    difficulty: "入门",
    rules: [
      "所有海报设计图生成过程必须开源对应的工作流 json 与种子数，确保结果可复现。",
      "作品严禁抄袭已有商标，模型生成内容需遵循版权许可协议。",
      "评分指标包含视觉创意力 40%、技术应用难度 30%、商业转化契合度 30%。"
    ],
    rewards: [
      { rank: "至尊创意金奖 (1名)", prize: "￥15,000 + 视觉中国约稿作者绿卡" },
      { rank: "银奖 (2名)", prize: "￥5,000" },
      { rank: "铜奖 (5名)", prize: "￥1,000" }
    ]
  },
  {
    id: "comp-105",
    name: "基于 Dify 搭建企业级智能体 Agent 应用大赛",
    type: "大模型",
    category: "ai",
    status: "进行中",
    time: "2026-05-10 至 2026-06-25",
    participants: 1940,
    prize: "￥60,000",
    sponsor: "Dify 开源社区",
    desc: "使用 Dify 无代码/低代码流程图编排工具，连接企业自建向量知识库（RAG）和一系列API工具插件，开发出一款能在网页端交互、自动执行客户接待、意图分析及后台录单的行业大模型 Agent 应用。",
    difficulty: "中阶",
    rules: [
      "智能体应至少包含 3 个以上的自定义 Tool 接口调用与条件路由分支。",
      "意图识别率与流程卡死纠错响应度需通过沙箱测试集高强度的自动化压测。",
      "评委组将评估其创新性、技术架构完整性及落地商用价值得分。"
    ],
    rewards: [
      { rank: "最佳 Agent 奖 (1名)", prize: "￥30,000" },
      { rank: "行业应用创新奖 (2名)", prize: "￥10,000" },
      { rank: "优秀开发者荣誉", prize: "Dify 官方全额奖学金与勋章" }
    ]
  }
];

type CompetitionTableRow = {
  id: string;
  name: string;
  session?: string;
  venue?: string;
  status: "进行中" | "已结束";
  startTime: string;
  endTime: string;
  candidateStatus: "未交卷" | "已交卷" | "未登录";
  score: number;
  canViewPaper?: boolean;
};

const aiCompetitionRows: CompetitionTableRow[] = [
  { id: "ai-table-1", name: "竞赛", session: "肖菲-test", venue: "--", status: "进行中", startTime: "2025-07-02 16:07", endTime: "--", candidateStatus: "未交卷", score: 0 },
  { id: "ai-table-2", name: "111", session: "11", venue: "--", status: "已结束", startTime: "2025-06-19 17:59", endTime: "2025-06-19 18:08", candidateStatus: "已交卷", score: 0, canViewPaper: true },
  { id: "ai-table-3", name: "容器", session: "容器", venue: "--", status: "已结束", startTime: "2024-08-22 15:54", endTime: "2024-08-26 16:47", candidateStatus: "未登录", score: 0, canViewPaper: true },
];

const cloudCompetitionRows: CompetitionTableRow[] = [
  { id: "cloud-table-1", name: "2025年上海职工职业技能系列竞赛暨中国技协职业技能竞赛——云计算技能大赛上海选拔赛", status: "已结束", startTime: "2025-10-29 17:04", endTime: "2025-10-29 19:03", candidateStatus: "已交卷", score: 0 },
  { id: "cloud-table-2", name: "test-6", status: "已结束", startTime: "2025-07-16 16:24", endTime: "2025-07-16 23:20", candidateStatus: "已交卷", score: 0 },
  { id: "cloud-table-3", name: "test-5", status: "已结束", startTime: "2025-07-16 14:00", endTime: "2025-07-16 18:57", candidateStatus: "已交卷", score: 0 },
  { id: "cloud-table-4", name: "私有云竞赛-肖菲菲验证6", status: "已结束", startTime: "2025-07-11 10:07", endTime: "2025-07-11 18:03", candidateStatus: "已交卷", score: 0 },
];


export default function CompetitionList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "ai" | "cloud">("all");
  const [activeStatus, setActiveStatus] = useState<"all" | "ongoing" | "upcoming" | "ended">("all");
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const isRegistrationPage = !!useMatch("/competition/:competitionId/register");
  const listScrollPosition = useRef(0);
  const detailCompetition = competitions.find(comp => comp.id === competitionId);

  useEffect(() => {
    window.scrollTo({ top: competitionId ? 0 : listScrollPosition.current, behavior: "instant" });
  }, [competitionId, isRegistrationPage]);

  const rememberListPosition = () => { listScrollPosition.current = window.scrollY; };
  const [registeredComps, setRegisteredComps] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem("competition-registrations") || "[]");
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
    } catch {
      return [];
    }
  });

  // Filters logic
  const filteredCompetitions = competitions.filter((comp) => {
    // 1. Search Query
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = comp.name.toLowerCase().includes(query) ||
                          comp.type.toLowerCase().includes(query) ||
                          comp.sponsor.toLowerCase().includes(query);
    
    // 2. Category Tab
    const matchesCategory = activeCategory === "all" || comp.category === activeCategory;
    
    // 3. Status Tab
    const matchesStatus = 
      activeStatus === "all" ||
      (activeStatus === "ongoing" && comp.status === "进行中") ||
      (activeStatus === "upcoming" && comp.status === "未开始") ||
      (activeStatus === "ended" && comp.status === "已结束");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const referenceRows = activeCategory === "ai" ? aiCompetitionRows : cloudCompetitionRows;
  const filteredReferenceRows = referenceRows.filter(row => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [row.name, row.session, row.venue].some(value => value?.toLowerCase().includes(query));
    const matchesStatus = activeStatus === "all" ||
      (activeStatus === "ongoing" && row.status === "进行中") ||
      (activeStatus === "ended" && row.status === "已结束");
    return matchesSearch && matchesStatus;
  });
  const visibleCompetitionCount = activeCategory === "all" ? filteredCompetitions.length : filteredReferenceRows.length;

  const handleRegister = (comp: Competition) => {
    if (comp.status === "已结束" || registeredComps.includes(comp.id)) return;
    if (!competitionId) rememberListPosition();
    navigate(`/competition/${comp.id}/register`);
  };

  const completeRegistration = (comp: Competition) => {
    setRegisteredComps(prev => {
      const next = prev.includes(comp.id) ? prev : [...prev, comp.id];
      try { sessionStorage.setItem("competition-registrations", JSON.stringify(next)); } catch { /* Keep the current page usable if storage is unavailable. */ }
      return next;
    });
  };

  const scrollToCompetitions = () => document.getElementById("competition-list")?.scrollIntoView({ behavior: "smooth" });
  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveStatus("all");
  };

  return (
    <div className="competition-page min-h-screen pb-12 md:pb-20">
      {isRegistrationPage && detailCompetition ? (
        <CompetitionRegistration competition={detailCompetition} isRegistered={registeredComps.includes(detailCompetition.id)} onSubmit={() => completeRegistration(detailCompetition)} />
      ) : competitionId ? (
        <CompetitionDetail competition={detailCompetition} isRegistered={registeredComps.includes(competitionId)} onRegister={handleRegister} />
      ) : (<>
      <section className="competition-hero">
        <img aria-hidden="true" alt="" src={`${import.meta.env.BASE_URL}images/competition-hero-landscape.svg`} className="competition-hero-scene" />
        <div className="competition-hero-content relative mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#b86c46] sm:text-sm">
            <span className="h-px w-6 bg-[#eeb18b]" /> 智云竞赛 · 为热爱而挑战 <span className="h-px w-6 bg-[#eeb18b]" />
          </div>
          <h1 className="text-[#30251f]">让每一份实力，<br className="sm:hidden" /><span className="competition-gradient-text">都有高光时刻</span></h1>
          <p className="mx-auto mt-5 max-w-[580px] text-sm leading-7 text-[#977d6d] sm:text-base">在真实挑战中突破边界，与优秀的你一起，让热爱成为实力。</p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Button onClick={() => { resetFilters(); scrollToCompetitions(); }} className="competition-primary competition-skew-button h-12 px-8 text-[15px] font-semibold text-white"><span className="competition-skew-label">即刻开启挑战 <ArrowRight className="size-4" /></span></Button>
          </div>
          <div className="mt-6 flex justify-center gap-4 text-[11px] text-[#a08677] sm:gap-6 sm:text-xs">
            {["真实企业命题", "专属实训环境", "专业赛事评审"].map(item => <span key={item} className="flex items-center gap-1.5"><CheckCircle className="size-3.5 text-[#ed9b6d]" />{item}</span>)}
          </div>
        </div>
      </section>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="competition-stats" role="group" aria-label="赛事数据概览">
          {[
            { label: "精选实战赛事", value: competitions.length, unit: "场" },
            { label: "赛事火热进行", value: competitions.filter(comp => comp.status === "进行中").length, unit: "场" },
            { label: "累计参赛人数", value: competitions.reduce((sum, comp) => sum + comp.participants, 0).toLocaleString(), unit: "人" },
          ].map((metric, index) => (
            <div key={metric.label} className={cn("competition-stat text-center", index > 0 && "sm:border-l sm:border-[#f0e4dc]")}>
              <p className="text-[28px] font-bold leading-none tracking-tight tabular-nums text-[#594031] sm:text-[36px]">{metric.value}<span className="ml-1.5 text-xs font-normal text-[#a38b7d]">{metric.unit}</span></p>
              <p className="mt-3 text-xs text-[#a38b7d] sm:text-sm">{metric.label}</p>
            </div>
          ))}
        </div>

        <section id="competition-list" className="scroll-mt-24">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.22em] text-[#d99a72]">EXPLORE CHALLENGES</p>
              <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-[#392b24]">发现你的下一场<span className="text-[#f3743f]">挑战</span></h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500">选择感兴趣的赛道，用实战检验所学。</p>
            </div>
            <span aria-live="polite" className="text-sm text-slate-500">共 <span className="font-semibold text-slate-900">{visibleCompetitionCount}</span> 场赛事</span>
          </div>

          <div className="mb-6 rounded-2xl border border-[#f2e8e0] bg-white p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-wrap gap-2" role="group" aria-label="赛事赛道">
                {[
                  { value: "all" as const, label: "全部赛道" },
                  { value: "ai" as const, label: "人工智能竞赛" },
                  { value: "cloud" as const, label: "云计算竞赛" },
                ].map(category => (
                  <button key={category.value} onClick={() => setActiveCategory(category.value)} aria-pressed={activeCategory === category.value}
                    className={cn("competition-skew-button px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors", activeCategory === category.value ? "competition-primary text-white" : "text-slate-500 hover:bg-orange-50 hover:text-slate-800")}><span className="competition-skew-label">{category.label}</span></button>
                ))}
              </div>
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input type="search" aria-label="搜索竞赛" placeholder="搜索竞赛名称、分类或赞助方" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-[#fffcfa] pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4" role="group" aria-label="赛事状态">
              <span className="mr-1 text-xs text-slate-500">赛事状态</span>
              {[
                { value: "all" as const, label: "全部" },
                { value: "ongoing" as const, label: "进行中" },
                { value: "upcoming" as const, label: "未开始" },
                { value: "ended" as const, label: "已结束" },
              ].map(status => (
                <button key={status.value} onClick={() => setActiveStatus(status.value)} aria-pressed={activeStatus === status.value}
                  className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", activeStatus === status.value ? "bg-[#fff0e5] text-[#db6835]" : "text-slate-500 hover:bg-orange-50")}>{status.label}</button>
              ))}
              {(searchQuery || activeCategory !== "all" || activeStatus !== "all") && <button onClick={resetFilters} className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-[#fa541c]"><X className="size-3.5" /> 重置筛选</button>}
            </div>
          </div>

          {(activeCategory === "all" ? filteredCompetitions.length === 0 : filteredReferenceRows.length === 0) ? (
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-5 py-14 text-center">
              <Compass className="mb-4 size-12 text-orange-200" />
              <h3 className="font-semibold text-slate-800">没有找到符合条件的赛事</h3>
              <p className="mt-2 text-sm text-slate-500">试试其他关键词，或重新选择赛道与状态。</p>
              <Button variant="outline" onClick={resetFilters} className="mt-5">重置筛选</Button>
            </div>
          ) : activeCategory !== "all" ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm text-slate-600">
                  <thead className="bg-[#fffaf7] text-slate-500">
                    <tr>
                      <th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">竞赛名称</th>
                      {activeCategory === "ai" && <><th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">场次名称</th><th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">考场</th><th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">场次状态</th></>}
                      {activeCategory === "cloud" && <th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">进行状态</th>}
                      <th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">开始时间</th>
                      <th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">结束时间</th>
                      <th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">考生状态</th>
                      <th className="border-b border-r border-slate-200 px-4 py-4 font-semibold">考试成绩</th>
                      <th className="border-b border-slate-200 px-4 py-4 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferenceRows.map(row => (
                      <tr key={row.id} className="transition-colors hover:bg-orange-50/40">
                        <td className="max-w-[360px] border-b border-r border-slate-200 px-4 py-4 leading-7 text-slate-700">{row.name}</td>
                        {activeCategory === "ai" && <><td className="border-b border-r border-slate-200 px-4 py-4">{row.session}</td><td className="border-b border-r border-slate-200 px-4 py-4">{row.venue}</td><td className="border-b border-r border-slate-200 px-4 py-4">{row.status}</td></>}
                        {activeCategory === "cloud" && <td className="border-b border-r border-slate-200 px-4 py-4">{row.status}</td>}
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-4">{row.startTime}</td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-4">{row.endTime}</td>
                        <td className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-4">{row.candidateStatus}</td>
                        <td className="border-b border-r border-slate-200 px-4 py-4 tabular-nums">{row.score}</td>
                        <td className="whitespace-nowrap border-b border-slate-200 px-4 py-4">
                          <button className="font-semibold text-[#fa541c] transition-colors hover:text-[#d4380d]">开始竞赛</button>
                          {row.canViewPaper && <><span className="mx-2 text-slate-200">|</span><button className="font-semibold text-[#fa541c] transition-colors hover:text-[#d4380d]">查看试卷</button></>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-5">
              {filteredCompetitions.map(comp => {
                const isRegistered = registeredComps.includes(comp.id);
                return (
                  <article key={comp.id} className="competition-card group min-w-0 rounded-[20px] border border-[#f0e5dd] bg-white">
                    <Link to={`/competition/${comp.id}`} onClick={rememberListPosition} aria-label={`查看${comp.name}详情`} className="competition-cover" data-category={comp.category} data-ended={comp.status === "已结束"}>
                      <img src={`${import.meta.env.BASE_URL}images/covers/competition-${comp.id}-vivid.webp`} alt="" aria-hidden="true" className="competition-cover-art" />
                      <span className="competition-cover-caption relative z-10">
                        <span className="competition-cover-headline">{comp.type === "安全运维" ? "以攻促防" : comp.type === "云原生" ? "云上竞技" : comp.type === "AI算法" ? "创意无限" : "智创未来"}</span>
                        <span className="competition-cover-subline">{comp.type === "安全运维" ? "守护安全" : comp.type === "云原生" ? "技术进阶" : comp.type === "AI算法" ? "智造未来" : "向新而行"}</span>
                      </span>
                    </Link>
                    <div className="competition-card-content min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 sm:flex-nowrap sm:gap-4">
                        <h3 className="min-w-0 text-base font-bold leading-[1.5] text-[#3f3028] sm:text-xl">
                          <Link to={`/competition/${comp.id}`} onClick={rememberListPosition} className="line-clamp-2 text-left transition-colors hover:text-[#fa541c]">{comp.name}</Link>
                        </h3>
                        <span className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", comp.status === "进行中" ? "bg-[#fff1e7] text-[#df6632]" : comp.status === "未开始" ? "bg-amber-50 text-[#b17a4e]" : "bg-slate-100 text-[#9b8e85]")}><span className="size-1.5 rounded-full bg-current" />{comp.status}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className={cn("rounded-md px-2 py-1", comp.category === "ai" ? "bg-[#fff3e8] text-[#c9753f]" : "bg-[#fff0eb] text-[#bd775d]")}>{comp.type}</span>
                        <span className="rounded-md bg-slate-50 px-2 py-1 text-slate-500">{comp.difficulty}</span>
                        <span className="ml-1 hidden text-slate-500 sm:inline">主办方：{comp.sponsor}</span>
                      </div>
                      <p className="competition-card-description mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{comp.desc}</p>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-slate-500 sm:text-xs">
                        <p className="flex items-start gap-2"><Calendar className="size-3.5 shrink-0 text-[#b8a496]" /><span>{comp.time}</span></p>
                        <p className="flex items-center gap-2"><Users className="size-3.5 shrink-0 text-[#b8a496]" /><span>{(comp.participants + (isRegistered ? 1 : 0)).toLocaleString()} 队参与</span></p>
                      </div>
                    </div>
                    <div className="competition-card-footer flex flex-wrap items-center justify-between gap-3 border-t border-[#f5ede7] pt-3">
                      <div className="flex flex-wrap items-baseline gap-x-2"><span className="text-[11px] text-slate-500 sm:text-xs">总奖金池</span><span className="text-xl font-bold tabular-nums text-[#fa541c] sm:text-2xl">{comp.prize}</span></div>
                      <div className="flex items-center gap-2">
                        <Link to={`/competition/${comp.id}`} onClick={rememberListPosition} className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-slate-600 hover:bg-orange-50 sm:h-10 sm:px-3 sm:text-sm">赛事详情 <ChevronRight className="size-3.5" /></Link>
                        <Button disabled={comp.status === "已结束" || isRegistered} onClick={() => handleRegister(comp)}
                          className={cn("competition-register h-9 px-5 text-xs sm:h-10 sm:px-7 sm:text-sm", isRegistered ? "bg-orange-50 text-orange-600 disabled:opacity-100" : comp.status === "已结束" ? "bg-slate-100 text-slate-400 disabled:opacity-100" : "competition-primary text-white")}>
                          <span className="competition-register-label">{isRegistered ? <><UserCheck className="size-4" />已报名</> : comp.status === "已结束" ? "已结束" : "立即报名"}</span>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      </>)}


    </div>
  );
}
