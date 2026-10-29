export type CompetitionOperationMode = "grading" | "checks" | "scoring" | "proctor" | "results";
export type CheckCategory = "environment" | "request" | "custom";

export interface OperationCompetition {
  id: string;
  name: string;
  duration: string;
  status: string;
  description: string;
  format: string;
  creator: string;
  createdAt: string;
  ruleFiles: string;
  ruleMaxSubmissions: number;
  ruleGpu: string;
}

export interface CompetitionCheck {
  id: string;
  category: CheckCategory;
  name: string;
  description: string;
  content: string;
  updatedAt: string;
  scoringType?: "fixed" | "floating";
  executionTimes?: { id: string; startAfterMinutes: number; frequency: number }[];
  scoreExpression?: string;
  dynamicParameterFile?: { name: string; size: number; file: File };
}

export function configureCompetitionCheck(check: CompetitionCheck): CompetitionCheck {
  if (check.category === "custom") return { ...check };
  return {
    ...check,
    scoringType: check.scoringType ?? "fixed",
    executionTimes: check.executionTimes?.map(time => ({ ...time })) ?? [{ id: crypto.randomUUID(), startAfterMinutes: 1, frequency: 1 }],
    scoreExpression: check.scoreExpression ?? ""
  };
}

export function validateCompetitionCheck(check: CompetitionCheck): string {
  if (![check.name, check.description, check.content].every(value => value.trim())) return "请填写完整的名称、描述和内容";
  if (check.name.length > 100 || check.description.length > 1000) return "名称最多 100 字，描述最多 1000 字";
  if (check.category === "custom") return "";
  if (check.scoringType !== "fixed" && check.scoringType !== "floating") return "请选择判分类型";
  if (!check.executionTimes?.length) return "请至少添加一条执行时间";
  if (check.executionTimes.some(time => !Number.isSafeInteger(time.startAfterMinutes) || time.startAfterMinutes < 0 || !Number.isSafeInteger(time.frequency) || time.frequency < 0)) return "开始时间和执行频率或间隔须为非负整数";
  if (!check.scoreExpression?.trim()) return "请填写得分表达式";
  const file = check.dynamicParameterFile;
  if (file && (!/\.(txt|csv)$/i.test(file.name) || file.size > 200 * 1024 * 1024)) return "动态参数文件仅支持 txt/csv 格式，大小须在 200M 以内";
  return "";
}

export interface ScoreEvent {
  id: string;
  time: string;
  fixed: number;
  floating: number;
  total: number;
  comment: string;
}

export interface CompetitionCandidate {
  id: string;
  account: string;
  name: string;
  phone: string;
  userGroup: string;
  cloudAccount: string;
  environment: "未开始" | "运行中" | "已关闭" | "已清理";
  status: "未登录" | "竞赛中" | "已交卷";
  startAt: string;
  endAt: string;
  extension: number;
  fixed: number | null;
  floating: number | null;
  events: ScoreEvent[];
  file: string;
  report: string;
  checkResults?: { checkId: string; score: number | null; result: string; executedAt?: string }[];
}

export interface CompetitionOperationData {
  candidates: CompetitionCandidate[];
  checks: CompetitionCheck[];
  fixedTotal: number;
  floatingTotal: number;
}

export function createCompetitionOperationData(
  competition: OperationCompetition,
  roster: { id: string; name: string; file?: string; report?: string }[]
): CompetitionOperationData {
  const [start, end] = competition.duration.split(" 至 ");
  const environmentChecks = [
    ["零信任服务应用检查", "确认零信任服务已启用，应用访问策略配置正确。"],
    ["负载均衡器-后端", "检查后端服务器组、监听端口与健康检查状态。"],
    ["负载均衡器", "检查负载均衡实例、监听协议和转发规则。"],
    ["浮动得分-负载均衡器", "根据负载均衡资源使用情况进行浮动评分。"],
    ["浮动得分-弹性IP成本", "根据弹性IP使用情况核算资源成本得分。"],
    ["浮动得分-安全性扣分", "检查安全组开放范围及风险配置。"],
    ["浮动得分-云硬盘成本分", "根据云硬盘容量与使用情况核算成本得分。"]
  ];
  return {
    fixedTotal: 40,
    floatingTotal: 60,
    candidates: roster.map((person, index) => ({
      id: person.id,
      account: `CTYUN${competition.id.replace(/[^a-z0-9]/gi, "").slice(-6)}${String(index + 1).padStart(3, "0")}`,
      name: person.name,
      phone: `1838938${String(4485 + index).slice(-4)}`,
      userGroup: "测试用户",
      cloudAccount: "",
      environment: "未开始",
      status: person.file ? "已交卷" : "未登录",
      startAt: start || "—",
      endAt: end || "—",
      extension: 0,
      fixed: null,
      floating: null,
      events: [],
      file: person.file || "",
      report: person.report || ""
    })),
    checks: [
      ...environmentChecks.map(([name, content], index) => ({
        id: `${competition.id}-env-${index}`, category: "environment" as const,
        name, description: name, content, updatedAt: competition.createdAt
      })),
      { id: `${competition.id}-request-1`, category: "request", name: "HTTP 请求", description: "验证服务接口可用性", content: "协议：HTTP / HTTPS\n请求方法：GET、POST\n检查内容：响应状态码、响应内容、响应时间", updatedAt: competition.createdAt },
      { id: `${competition.id}-request-2`, category: "request", name: "TCP 连接", description: "验证服务端口连通性", content: "检查指定主机与服务端口是否可建立 TCP 连接。", updatedAt: competition.createdAt },
      { id: `${competition.id}-custom-1`, category: "custom", name: "负载均衡健康检查", description: "校验后端服务访问与响应", content: "请求类型：HTTP 请求\n请求路径：/health\n预期状态码：200", updatedAt: competition.createdAt }
    ]
  };
}

// A configured total of zero retains the original score instead of converting it.
export function competitionScore(candidate: Pick<CompetitionCandidate, "fixed" | "floating">, data: Pick<CompetitionOperationData, "fixedTotal" | "floatingTotal">) {
  const convert = (raw: number | null, total: number) => raw === null ? null : Number((total === 0 ? raw : raw * total / 100).toFixed(2));
  const fixed = convert(candidate.fixed, data.fixedTotal);
  const floating = convert(candidate.floating, data.floatingTotal);
  return {
    fixed, floating,
    total: Number(((fixed || 0) + (floating || 0)).toFixed(2)),
    maximum: (data.fixedTotal || 100) + (data.floatingTotal || 100)
  };
}
