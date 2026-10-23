import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Minus, Plus, RefreshCw, Search, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CompetitionCheckForm from "./CompetitionCheckForm";
import CompetitionCandidateGrading from "./CompetitionCandidateGrading";
import { competitionDrawerStyles as styles } from "./competitionDrawerStyles";
import { CheckCategory, CompetitionCandidate, CompetitionCheck, CompetitionOperationData, CompetitionOperationMode, OperationCompetition, competitionScore, configureCompetitionCheck, validateCompetitionCheck } from "./competitionOperations";

interface Props {
  target: { competition: OperationCompetition; mode: CompetitionOperationMode } | null;
  data: CompetitionOperationData | null;
  onChange: (data: CompetitionOperationData) => void;
  onClose: () => void;
  onNotify: (message: string) => void;
}

const titles = { grading: "批阅管理", checks: "检查项", scoring: "分值配比", proctor: "监考信息", results: "竞赛成绩" };
const categories: { key: CheckCategory; label: string }[] = [
  { key: "environment", label: "环境检查项" }, { key: "request", label: "模拟请求类型" }, { key: "custom", label: "自定义模拟请求检查项" }
];
const actionClass = styles.action;
const secondaryClass = styles.secondary;
const primaryClass = styles.primary;
const inputClass = styles.input;
const cellClass = styles.tableCell;
const now = () => new Date().toLocaleString("sv-SE");

const referenceScoreEvents = [
  ["浮动得分-安全性扣分", "__安全性扣分没有问题", 0, "2026-10-22 14:41:15"],
  ["浮动得分-mysql数据库", "__不存在不合规的mysql数据库实例", 0, "2026-10-22 14:41:13"],
  ["浮动得分-弹性ip成本", "__没有过多的弹性ip", 0, "2026-10-22 14:41:13"],
  ["浮动得分-云硬盘成本分", "云硬盘成本分", 0, "2026-10-22 14:41:13"],
  ["浮动得分-负载均衡器", "__没有负载均衡器费用", 0, "2026-10-22 14:41:13"],
  ["浮动得分-ecs成本", "ECS实例成本分", 0, "2026-10-22 14:41:13"],
  ["功能完成-业务程序", "功能完成-业务程序(历史得分)", 0, "2026-10-22 14:41:13"],
  ["功能完成-对象存储", "功能完成-对象存储(历史得分)", 0, "2026-10-22 14:41:13"],
  ["浮动得分-安全性扣分", "__安全性扣分没有问题", 0, "2026-10-22 14:40:17"],
  ["mysql-子网络由表", "mysql-子网络由表(历史得分)", 0, "2026-10-22 14:40:17"],
  ["弹性伸缩配置和私有镜像", "弹性伸缩配置和私有镜像(历史得分)", 0, "2026-10-22 14:40:16"],
  ["mysql-数据库备份任务检查", "mysql-数据库备份任务检查(历史得分)", 0, "2026-10-22 14:40:15"],
] as const;

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative w-60 max-w-full"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input aria-label={placeholder} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cn(styles.input, "pl-9 pr-4 h-9")} /></div>;
}

function Pagination({ total, page, size, onPage, onSize }: { total: number; page: number; size: number; onPage: (page: number) => void; onSize: (size: number) => void }) {
  const count = Math.max(1, Math.ceil(total / size));
  return <div className="flex flex-wrap items-center justify-end gap-4 pt-4 text-[13px] text-neutral-500">
    <span>共 {total} 条</span><div className="flex items-center gap-2">
      <Button aria-label="抽屉上一页" variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)} className="h-7 w-7 p-0 rounded-sm"><ChevronLeft className="w-3.5 h-3.5" /></Button>
      {Array.from({ length: count }, (_, i) => i + 1).filter(p => p === 1 || p === count || Math.abs(p - page) <= 1).map((p, i, pages) => <React.Fragment key={p}>{i > 0 && p - pages[i - 1] > 1 && <span>…</span>}<Button aria-label={`抽屉第${p}页`} aria-current={page === p ? "page" : undefined} variant="outline" size="sm" onClick={() => onPage(p)} className={cn("h-7 w-7 p-0 rounded-sm", page === p && "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#e84a15] hover:text-white")}>{p}</Button></React.Fragment>)}
      <Button aria-label="抽屉下一页" variant="outline" size="sm" disabled={page >= count} onClick={() => onPage(page + 1)} className="h-7 w-7 p-0 rounded-sm"><ChevronRight className="w-3.5 h-3.5" /></Button>
    </div><select aria-label="抽屉每页条数" value={size} onChange={e => onSize(Number(e.target.value))} className="border border-neutral-200 rounded-[4px] px-2 py-1 h-7 bg-white focus:outline-none focus:border-[#fa541c]">{[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} 条/页</option>)}</select>
  </div>;
}

function EmptyRow({ columns, label = "暂无相关记录" }: { columns: number; label?: string }) {
  return <tr><td colSpan={columns} className="py-14 text-center text-neutral-400 text-[13px]"><FileText className="w-8 h-8 mx-auto mb-3 text-neutral-300" />{label}</td></tr>;
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "blue" }) {
  return <span className={cn("px-1.5 py-0.5 rounded-[4px] text-[11px] border whitespace-nowrap", tone === "green" ? "bg-green-50 text-green-600 border-green-200" : tone === "blue" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>{children}</span>;
}

function exportCandidates(competition: OperationCompetition, data: CompetitionOperationData, rows: CompetitionCandidate[]) {
  const cells = (value: unknown) => {
    const text = String(value ?? "");
    return `"${(/^[=+@-]/.test(text) ? "'" : "") + text.replace(/"/g, '""')}"`;
  };
  const content = [["账号", "姓名", "云账号", "环境状态", "开始时间", "结束时间", "状态", "固定得分", "浮动得分", "总分"], ...rows.map(row => {
    const score = competitionScore(row, data);
    return [row.account, row.name, row.cloudAccount, row.environment, row.startAt, row.endAt, row.status, score.fixed ?? "", score.floating ?? "", score.total];
  })].map(row => row.map(cells).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url; link.download = `${competition.name}_考生数据.csv`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function CompetitionOperationsDrawer({ target, data, onChange, onClose, onNotify }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [category, setCategory] = useState<CheckCategory>("environment");
  const [monitorTab, setMonitorTab] = useState("overview");
  const [selected, setSelected] = useState<string[]>([]);
  const [totals, setTotals] = useState(["40", "60"]);
  const [error, setError] = useState("");
  const [checkEditor, setCheckEditor] = useState<CompetitionCheck | null>(null);
  const [checkDetail, setCheckDetail] = useState<CompetitionCheck | null>(null);
  const [candidatePanel, setCandidatePanel] = useState<{ id: string; kind: "grade" | "events" | "result" } | null>(null);
  const [extensionTargets, setExtensionTargets] = useState<string[] | null>(null);
  const [extensionMinutes, setExtensionMinutes] = useState("30");
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; run: () => void } | null>(null);
  const [rowMenu, setRowMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const [refreshAt, setRefreshAt] = useState("");

  useEffect(() => {
    setSearch(""); setPage(1); setCategory("environment"); setMonitorTab("overview"); setSelected([]); setError("");
    setCheckEditor(null); setCheckDetail(null); setCandidatePanel(null); setExtensionTargets(null); setConfirmation(null); setRowMenu(null);
    if (target && data) setTotals([String(data.fixedTotal), String(data.floatingTotal)]);
    setRefreshAt(new Date().toLocaleTimeString("zh-CN", { hour12: false }));
  }, [target?.competition.id, target?.mode]);

  useEffect(() => {
    if (!target) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (confirmation) setConfirmation(null);
        else if (rowMenu) setRowMenu(null);
        else onClose();
      }
      if (event.key === "Tab") {
        const scope = drawerRef.current?.querySelector<HTMLElement>('[role="alertdialog"]') || drawerRef.current;
        const nodes = Array.from<HTMLElement>(scope?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]') || []).filter(node => node.getClientRects().length > 0);
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === drawerRef.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === drawerRef.current)) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); previousFocus?.isConnected && previousFocus.focus(); };
  }, [!!target, !!confirmation, !!rowMenu]);

  useEffect(() => {
    if (!rowMenu) return;
    const close = (event: Event) => {
      if (menuRef.current?.contains(event.target as Node) || (event.target instanceof Element && event.target.closest("[data-candidate-actions]"))) return;
      setRowMenu(null);
    };
    document.addEventListener("pointerdown", close); window.addEventListener("resize", close); window.addEventListener("scroll", close, true);
    return () => { document.removeEventListener("pointerdown", close); window.removeEventListener("resize", close); window.removeEventListener("scroll", close, true); };
  }, [rowMenu]);

  if (!target || !data) return null;
  const { competition, mode } = target;
  const activeCandidate = data.candidates.find(row => row.id === candidatePanel?.id);
  const isCandidateGrading = candidatePanel?.kind === "grade" && !!activeCandidate;
  const activeMenuCandidate = data.candidates.find(row => row.id === rowMenu?.id);
  const term = search.trim().toLowerCase();
  const filteredCandidates = data.candidates.filter(row => row.name.toLowerCase().includes(term) || row.account.toLowerCase().includes(term));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredCandidates.length / size)));
  const candidates = filteredCandidates.slice((currentPage - 1) * size, currentPage * size);
  const filteredChecks = data.checks.filter(item => item.category === category && item.name.toLowerCase().includes(search.trim().toLowerCase()));
  const checkPage = Math.min(page, Math.max(1, Math.ceil(filteredChecks.length / size)));
  const checks = filteredChecks.slice((checkPage - 1) * size, checkPage * size);
  const categoryLabel = categories.find(item => item.key === category)!.label;
  const isSubpage = !!(checkEditor || checkDetail || candidatePanel || extensionTargets);
  const subformId = checkEditor ? "competition-check-form" : extensionTargets ? "competition-extension-form" : null;
  const backToList = () => { setCheckEditor(null); setCheckDetail(null); setCandidatePanel(null); setExtensionTargets(null); setError(""); };
  const updateCandidates = (ids: string[], patch: Partial<CompetitionCandidate>) => onChange({ ...data, candidates: data.candidates.map(row => ids.includes(row.id) ? { ...row, ...patch } : row) });
  const openCandidate = (candidate: CompetitionCandidate, kind: "grade" | "events" | "result") => {
    setRowMenu(null); setCandidatePanel({ id: candidate.id, kind }); setError("");
  };
  const initializeEnvironment = (ids: string[]) => {
    setConfirmation({ title: "初始化环境", message: `将为 ${ids.length} 位考生初始化竞赛环境，是否继续？`, run: () => {
      onChange({ ...data, candidates: data.candidates.map(row => ids.includes(row.id) ? { ...row, environment: "运行中", cloudAccount: row.cloudAccount || `cloud-${row.account.toLowerCase()}` } : row) }); onNotify("环境初始化完成");
    } });
  };
  const cleanEnvironment = (ids: string[]) => {
    setConfirmation({ title: "清理环境", message: `确定清理 ${ids.length} 位考生的竞赛环境吗？环境将关闭，已保存的成绩和批阅记录将保留。`, run: () => { updateCandidates(ids, { environment: "已清理", cloudAccount: "" }); onNotify("环境已清理"); } });
  };
  const beginExtend = (ids: string[]) => { setRowMenu(null); setExtensionMinutes("30"); setExtensionTargets(ids); setError(""); };
  const handleExport = () => { exportCandidates(competition, data, filteredCandidates); onNotify("考生数据已导出"); };
  const setPageSize = (value: number) => { setSize(value); setPage(1); };
  const saveCheck = (event: React.FormEvent) => {
    event.preventDefault(); if (!checkEditor) return;
    const validationError = validateCompetitionCheck(checkEditor);
    if (validationError) { setError(validationError); return; }
    const saved = { ...checkEditor, name: checkEditor.name.trim(), description: checkEditor.description.trim(), content: checkEditor.content.trim(), scoreExpression: checkEditor.scoreExpression?.trim(), updatedAt: now() };
    const exists = data.checks.some(item => item.id === saved.id);
    onChange({ ...data, checks: exists ? data.checks.map(item => item.id === saved.id ? saved : item) : [saved, ...data.checks] });
    setSearch(""); setPage(1); backToList(); onNotify(exists ? "检查项已更新" : "检查项已新建");
  };
  const saveTotals = (event: React.FormEvent) => {
    event.preventDefault(); const [fixedTotal, floatingTotal] = totals.map(Number);
    if (totals.some(value => !value.trim()) || [fixedTotal, floatingTotal].some(value => !Number.isFinite(value) || value < 0 || value > 10000)) { setError("请输入 0 至 10000 之间的分值"); return; }
    onChange({ ...data, fixedTotal, floatingTotal }); onNotify("分值配比已保存"); onClose();
  };
  const tableWrapper = styles.table;
  const tableHeader = styles.tableHeader;
  const rowClass = styles.tableRow;

  const renderChecksTable = (readOnly = false) => <>
    <div className={tableWrapper}><table className="w-full text-left border-collapse whitespace-nowrap min-w-[760px]"><thead><tr className={tableHeader}>
      {[categoryLabel, `${categoryLabel}内容`, `${categoryLabel}描述`, "更新时间", ...(readOnly ? [] : ["操作"])].map(label => <th key={label} className="p-3 font-medium">{label}</th>)}
    </tr></thead><tbody>{checks.length === 0 ? <EmptyRow columns={readOnly ? 4 : 5} label="暂无符合条件的检查项" /> : checks.map(item => <tr key={item.id} className={rowClass}>
      <td className={cellClass}>{item.name}</td><td className={cellClass}><button className={actionClass} onClick={() => setCheckDetail(item)}>详情查看</button></td><td className={cellClass}><span className="block max-w-[280px] truncate" title={item.description}>{item.description}</span></td>
      <td className={cellClass}><div>{item.updatedAt.split(" ")[0]}</div><div className="text-neutral-400 mt-1">{item.updatedAt.split(" ")[1]}</div></td>
      {!readOnly && <td className={cellClass}><div className="flex gap-3"><button className={actionClass} onClick={() => { setError(""); setCheckEditor(configureCompetitionCheck(item)); }}>编辑</button><button className="text-red-500 hover:text-red-600 text-xs font-semibold cursor-pointer" onClick={() => setConfirmation({ title: "删除检查项", message: `确定删除「${item.name}」吗？`, run: () => { onChange({ ...data, checks: data.checks.filter(check => check.id !== item.id) }); onNotify("检查项已删除"); } })}>删除</button></div></td>}
    </tr>)}</tbody></table></div>
    <Pagination total={filteredChecks.length} page={checkPage} size={size} onPage={setPage} onSize={setPageSize} />
  </>;

  return createPortal(<div className={styles.overlay} onClick={onClose}>
    <div ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={isCandidateGrading ? "批阅考生" : titles[mode]} className={cn(styles.panel, mode === "scoring" ? "max-w-[680px]" : "max-w-[1100px]")} onClick={e => e.stopPropagation()}>
      <header className={styles.header}>
        <h2 className={styles.title}>{candidatePanel?.kind === "grade" ? "批阅考生" : titles[mode]}</h2>
        <div className="flex items-center gap-3">{mode === "proctor" && <Button variant="outline" onClick={() => { setRefreshAt(new Date().toLocaleTimeString("zh-CN", { hour12: false })); onNotify("监考信息已刷新"); }} className={`${secondaryClass} gap-1.5`}><RefreshCw className="w-3.5 h-3.5" />刷新</Button>}<button aria-label="关闭竞赛抽屉" onClick={onClose} className={styles.close}><X className="w-4 h-4" /></button></div>
      </header>
      <div className={styles.body}>
        {isCandidateGrading ? <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <button type="button" className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-neutral-600 transition-colors hover:text-[#fa541c]" onClick={backToList}><ArrowLeft className="size-3.5" />返回批阅列表</button>
          <span aria-hidden="true" className="h-3 w-px bg-neutral-300" />
          <p className="min-w-0 flex-1 truncate text-xs text-neutral-500" title={competition.name}>{competition.name}</p>
        </div> : <>
          <p className="text-xs text-neutral-500 truncate" title={competition.name}>{competition.name}</p>
          {isSubpage && <button className="flex items-center gap-1.5 text-neutral-500 hover:text-[#fa541c] text-xs cursor-pointer" onClick={backToList}><ArrowLeft className="w-3.5 h-3.5" />返回{titles[mode]}列表</button>}
        </>}

        {candidatePanel && activeCandidate ? candidatePanel.kind === "grade" ? <CompetitionCandidateGrading candidate={activeCandidate} data={data} onNotify={onNotify} /> : <div className="space-y-5">
          <div className="border border-neutral-200 rounded-[4px] overflow-hidden"><div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 font-semibold">{candidatePanel.kind === "events" ? "得分事件" : "竞赛结果"} · {activeCandidate.name}</div>
            <div className="p-4 grid grid-cols-2 gap-3 text-xs text-neutral-600"><div>账号：{activeCandidate.account}</div><div>姓名：{activeCandidate.name}</div><div>状态：{activeCandidate.status}</div><div>当前得分：<span className="text-[#fa541c] font-semibold">{competitionScore(activeCandidate, data).total} / {competitionScore(activeCandidate, data).maximum}</span></div></div>
          </div>
          {candidatePanel.kind === "events" && <div className={tableWrapper}>
            <table className="w-full min-w-[860px] table-fixed border-collapse text-left whitespace-nowrap">
              <caption className="sr-only">{activeCandidate.name}的得分事件</caption>
              <colgroup><col className="w-[36%]" /><col className="w-[36%]" /><col className="w-[9%]" /><col className="w-[19%]" /></colgroup>
              <thead><tr className={tableHeader}>{["检查项名称", "得分事件", "分值", "时间"].map(label => <th key={label} scope="col" className="p-3 font-medium">{label}</th>)}</tr></thead>
              <tbody>{referenceScoreEvents.map(([checkName, eventName, value, time], index) => <tr key={`${checkName}-${time}-${index}`} className={rowClass}>
                <td className={`${cellClass} whitespace-normal break-words leading-5`}>{checkName}</td>
                <td className={`${cellClass} whitespace-normal break-words leading-5`}>{eventName}</td>
                <td className={`${cellClass} tabular-nums`}>{value}</td>
                <td className={`${cellClass} tabular-nums`}>{time}</td>
              </tr>)}</tbody>
            </table>
          </div>}
          {candidatePanel.kind === "result" && <div className="space-y-4"><div className="grid grid-cols-3 gap-4">{[["固定得分", competitionScore(activeCandidate, data).fixed ?? "--"], ["浮动得分", competitionScore(activeCandidate, data).floating ?? "--"], ["总得分", competitionScore(activeCandidate, data).total]].map(([label, score]) => <div key={label} className="border border-neutral-200 rounded-[4px] p-4"><p className="text-xs text-neutral-500 mb-2">{label}</p><p className="font-semibold text-xl">{score}</p></div>)}</div><div className="border border-neutral-200 rounded-[4px] p-4 space-y-3 text-neutral-600"><p>提交文件：{activeCandidate.file || "暂无提交文件"}</p><p>评测报告：{activeCandidate.report || "暂无评测报告"}</p></div><button className={actionClass} onClick={() => setCandidatePanel({ id: activeCandidate.id, kind: "events" })}>查看得分事件</button></div>}
        </div> : checkEditor ? <CompetitionCheckForm value={checkEditor} isEditing={data.checks.some(item => item.id === checkEditor.id)} error={error} onChange={value => { setCheckEditor(value); setError(""); }} onSubmit={saveCheck} /> : checkDetail ? <div className="border border-neutral-200 rounded-[4px] overflow-hidden"><h3 className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 font-semibold">{checkDetail.name}</h3><div className="p-4 space-y-4"><p className="text-neutral-500">{checkDetail.description}</p><pre className="whitespace-pre-wrap break-words rounded bg-neutral-50 border border-neutral-100 p-4 text-xs leading-6 text-neutral-700 font-mono">{checkDetail.content}</pre><p className="text-xs text-neutral-400">更新时间：{checkDetail.updatedAt}</p></div></div>
        : extensionTargets ? <form id="competition-extension-form" className="max-w-[680px] space-y-5" onSubmit={event => {
          event.preventDefault(); const minutes = Number(extensionMinutes);
          if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) { setError("延时需为 1 至 180 分钟的整数"); return; }
          onChange({ ...data, candidates: data.candidates.map(row => {
            if (!extensionTargets.includes(row.id)) return row;
            const end = new Date(row.endAt.length === 10 ? `${row.endAt}T23:59:00` : row.endAt.replace(" ", "T"));
            return { ...row, extension: row.extension + minutes, endAt: Number.isNaN(end.getTime()) ? row.endAt : new Date(end.getTime() + minutes * 60000).toLocaleString("sv-SE").slice(0, 16) };
          }) }); backToList(); onNotify(`已为 ${extensionTargets.length} 位考生延时 ${minutes} 分钟`);
        }}><h3 className="font-semibold">竞赛延时</h3><p className="text-xs text-neutral-500">已选择 {extensionTargets.length} 位考生，结束时间将顺延。</p><label className={styles.field}><span className={styles.label}>延时时长（分钟）</span><input required type="number" min="1" max="180" step="1" value={extensionMinutes} onChange={e => setExtensionMinutes(e.target.value)} className={inputClass} /></label>{error && <p role="alert" className="text-red-500 text-xs">{error}</p>}</form>
        : mode === "scoring" ? <form id="competition-score-totals" onSubmit={saveTotals} className="space-y-5">
          {["固定判分总分", "浮动判分总分"].map((label, index) => <label key={label} className={styles.field}><span className={styles.label}>{label}</span><div className="flex items-center gap-2"><div className="flex border border-neutral-200 rounded-[4px] overflow-hidden h-9"><button type="button" aria-label={`减少${label}`} className="px-3 bg-neutral-50 border-r border-neutral-200 hover:text-[#fa541c] cursor-pointer disabled:opacity-40" disabled={Number(totals[index]) <= 0} onClick={() => setTotals(prev => prev.map((value, i) => i === index ? String(Math.max(0, (Number(value) || 0) - 1)) : value))}><Minus className="w-3.5 h-3.5" /></button><input required aria-label={label} type="number" min="0" max="10000" step="0.01" value={totals[index]} onChange={e => { setTotals(prev => prev.map((value, i) => i === index ? e.target.value : value)); setError(""); }} className="w-32 text-center outline-none text-[13px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" /><button type="button" aria-label={`增加${label}`} className="px-3 bg-neutral-50 border-l border-neutral-200 hover:text-[#fa541c] cursor-pointer disabled:opacity-40" disabled={Number(totals[index]) >= 10000} onClick={() => setTotals(prev => prev.map((value, i) => i === index ? String(Math.min(10000, (Number(value) || 0) + 1)) : value))}><Plus className="w-3.5 h-3.5" /></button></div><span>分</span></div></label>)}
          <p className="text-red-500 text-xs">* 输入为 0 时不进行分值转换</p>{error && <p role="alert" className="text-red-500 text-xs">{error}</p>}
        </form>
        : mode === "checks" ? <div className="space-y-4"><div className="flex flex-wrap items-center gap-3 justify-between"><div className="flex flex-wrap items-center gap-3"><div role="tablist" aria-label="检查项分类" className={cn(styles.tabList, "overflow-x-auto max-w-full")}>{categories.map(item => <button key={item.key} role="tab" aria-selected={category === item.key} onClick={() => { setCategory(item.key); setSearch(""); setPage(1); }} className={cn(styles.tab, category === item.key ? styles.activeTab : styles.inactiveTab)}>{item.label}</button>)}</div><SearchInput value={search} onChange={value => { setSearch(value); setPage(1); }} placeholder={`请输入${categoryLabel}名称`} /></div><Button className={primaryClass} onClick={() => { setError(""); setCheckEditor(configureCompetitionCheck({ id: `check-${Date.now()}`, category, name: "", description: "", content: "", updatedAt: "" })); }}><Plus className="w-3.5 h-3.5" />新建{categoryLabel}</Button></div>{renderChecksTable()}</div>
        : mode === "grading" || mode === "results" ? <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><SearchInput value={search} onChange={value => { setSearch(value); setPage(1); }} placeholder="请输入姓名或账号" />{mode === "results" && <Button variant="outline" onClick={handleExport} className={secondaryClass}><Download className="w-3.5 h-3.5" />导出成绩</Button>}</div>
          <div className={tableWrapper}><table className="w-full text-left whitespace-nowrap min-w-[800px]"><thead><tr className={tableHeader}>{["账号", "姓名", "固定得分", "浮动得分", "得分/总分", "操作"].map(label => <th key={label} className="p-3 font-medium">{label}</th>)}</tr></thead><tbody>{!candidates.length ? <EmptyRow columns={6} label="暂无符合条件的考生" /> : candidates.map(candidate => { const score = competitionScore(candidate, data); return <tr key={candidate.id} className={rowClass}><td className={cellClass}>{candidate.account}</td><td className={cellClass}>{candidate.name}</td><td className={cellClass}>{score.fixed ?? "--"}</td><td className={cellClass}>{score.floating ?? "--"}</td><td className={cellClass}><span className="text-neutral-800">{score.total}</span> / {score.maximum}</td><td className={cellClass}><div className="flex gap-3">{mode === "grading" ? <button className={actionClass} onClick={() => openCandidate(candidate, "grade")}>批阅</button> : <button className={actionClass} onClick={() => openCandidate(candidate, "result")}>查看结果</button>}<span className="text-neutral-200">|</span><button className={actionClass} onClick={() => openCandidate(candidate, "events")}>得分事件</button></div></td></tr>; })}</tbody></table></div><Pagination total={filteredCandidates.length} page={currentPage} size={size} onPage={setPage} onSize={setPageSize} />
        </div>
        : mode === "proctor" && <div className="space-y-5">
          <div role="tablist" aria-label="监考信息分类" className={cn(styles.tabList, "overflow-x-auto")}>{[{ key: "overview", label: "公有云竞赛总览" }, { key: "content", label: "公有云竞赛内容" }, { key: "notice", label: "公有云竞赛须知" }].map(tab => <button key={tab.key} role="tab" aria-selected={monitorTab === tab.key} onClick={() => { setMonitorTab(tab.key); setSearch(""); setPage(1); }} className={cn(styles.tab, monitorTab === tab.key ? styles.activeTab : styles.inactiveTab)}>{tab.label}</button>)}</div>
          {monitorTab === "overview" ? <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"><div className="border border-neutral-200 rounded-[4px] bg-white overflow-hidden"><h3 className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-neutral-500" />竞赛信息</h3><div className="p-4 grid grid-cols-2 gap-3.5 text-xs"><div className="col-span-2"><p className="text-neutral-400 text-[11px] mb-1">竞赛名称</p><p className="text-neutral-800 font-semibold">{competition.name}</p></div><div><p className="text-neutral-400 text-[11px] mb-1">竞赛周期</p><p className="text-neutral-700 leading-5">{competition.duration}</p></div><div><p className="text-neutral-400 text-[11px] mb-1">竞赛状态</p><Badge tone={competition.status === "进行中" ? "green" : "neutral"}>{competition.status}</Badge></div></div></div>
              <div className="border border-neutral-200 rounded-[4px] bg-white overflow-hidden"><h3 className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-neutral-500" />考生信息</h3><div className="p-4 grid grid-cols-3 gap-3">{[
                { label: "未登录", count: data.candidates.filter(row => row.status === "未登录").length, color: "bg-neutral-50 border-neutral-200 text-neutral-500" },
                { label: "已登录", count: data.candidates.filter(row => row.status !== "未登录").length, color: "bg-blue-50/45 border-blue-100 text-blue-600" },
                { label: "已交卷", count: data.candidates.filter(row => row.status === "已交卷").length, color: "bg-emerald-50/45 border-emerald-100 text-emerald-600" }
              ].map(stat => <div key={stat.label} className={`border rounded-[4px] p-3 text-center ${stat.color}`}><p className="text-[11px] font-semibold whitespace-nowrap">{stat.label}</p><p className="text-2xl font-bold font-mono mt-2">{stat.count}<span className="text-[11px] font-normal ml-1">人</span></p></div>)}</div><p className="px-4 pb-3 text-[11px] text-neutral-400 text-right">更新于 {refreshAt}</p></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3"><SearchInput value={search} onChange={value => { setSearch(value); setPage(1); }} placeholder="输入姓名或账号搜索" /><div className="flex flex-wrap items-center gap-2"><Button variant="outline" className={secondaryClass} disabled={!selected.length} onClick={() => beginExtend(selected)}>延时{selected.length ? `（${selected.length}）` : ""}</Button><Button variant="outline" className={secondaryClass} disabled={!data.candidates.length} onClick={() => initializeEnvironment(selected.length ? selected : data.candidates.map(row => row.id))}>初始化环境</Button><Button variant="outline" className={secondaryClass} disabled={!data.candidates.length} onClick={() => cleanEnvironment(selected.length ? selected : data.candidates.map(row => row.id))}>清理环境</Button><Button variant="outline" className={secondaryClass} onClick={handleExport}><Download className="w-3.5 h-3.5" />导出</Button></div></div>
            <div className={tableWrapper}><table className="w-full text-left whitespace-nowrap min-w-[960px]"><thead><tr className={tableHeader}><th className="p-3"><input aria-label="选择本页全部考生" type="checkbox" checked={candidates.length > 0 && candidates.every(row => selected.includes(row.id))} onChange={e => setSelected(prev => e.target.checked ? [...new Set([...prev, ...candidates.map(row => row.id)])] : prev.filter(id => !candidates.some(row => row.id === id)))} className="accent-[#fa541c]" /></th>{["账号", "姓名", "云账号", "环境状态", "开始时间", "结束时间", "状态", "操作"].map(label => <th key={label} className="p-3 font-medium">{label}</th>)}</tr></thead><tbody>{!candidates.length ? <EmptyRow columns={9} label="暂无符合条件的考生" /> : candidates.map(candidate => <tr key={candidate.id} className={rowClass}><td className="p-3"><input aria-label={`选择${candidate.name}`} type="checkbox" checked={selected.includes(candidate.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev, candidate.id] : prev.filter(id => id !== candidate.id))} className="accent-[#fa541c]" /></td><td className={cellClass}>{candidate.account}</td><td className={cellClass}>{candidate.name}</td><td className={cellClass}><span className="max-w-24 block truncate" title={candidate.cloudAccount}>{candidate.cloudAccount || "—"}</span></td><td className={cellClass}><Badge tone={candidate.environment === "运行中" ? "blue" : "neutral"}>{candidate.environment}</Badge></td><td className={cellClass}>{candidate.startAt}</td><td className={cellClass}><div>{candidate.endAt}</div>{candidate.extension > 0 && <p className="text-[10px] text-[#fa541c] mt-1">已延时 {candidate.extension} 分钟</p>}</td><td className={cellClass}><Badge tone={candidate.status === "已交卷" ? "green" : candidate.status === "竞赛中" ? "blue" : "neutral"}>{candidate.status}</Badge></td><td className={cellClass}><div className="flex items-center gap-2.5"><button className={actionClass} onClick={() => openCandidate(candidate, "result")}>查看结果</button><button className={actionClass} onClick={() => beginExtend([candidate.id])}>延时</button><button data-candidate-actions aria-label={`${candidate.name}的更多操作`} aria-haspopup="menu" aria-expanded={rowMenu?.id === candidate.id} className={`${actionClass} flex items-center gap-0.5`} onClick={e => { if (rowMenu?.id === candidate.id) { setRowMenu(null); return; } const rect = e.currentTarget.getBoundingClientRect(); setRowMenu({ id: candidate.id, left: Math.max(8, rect.right - 132), top: Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - 112)) }); }}>更多<ChevronDown className="w-3 h-3 text-neutral-400" /></button></div></td></tr>)}</tbody></table></div>
            <Pagination total={filteredCandidates.length} page={currentPage} size={size} onPage={setPage} onSize={setPageSize} />
          </div> : monitorTab === "content" ? <div className="space-y-4"><div className="border border-neutral-200 rounded-[4px] p-4 space-y-2 text-neutral-600"><h3 className="font-semibold text-neutral-800">竞赛任务</h3><p className="leading-6">{competition.description || "暂无竞赛任务说明"}</p><p className="text-xs text-neutral-400">文件格式：{competition.ruleFiles} · 每日最多提交 {competition.ruleMaxSubmissions} 次 · 算力配额：{competition.ruleGpu}</p></div><div role="tablist" aria-label="竞赛内容分类" className={cn(styles.tabList, "overflow-x-auto")}>{categories.map(item => <button role="tab" aria-selected={category === item.key} key={item.key} className={cn(styles.tab, category === item.key ? styles.activeTab : styles.inactiveTab)} onClick={() => { setCategory(item.key); setPage(1); }}>{item.label}</button>)}</div>{renderChecksTable(true)}</div>
          : <div className="border border-neutral-200 rounded-[4px] overflow-hidden"><h3 className="bg-neutral-50/50 px-4 py-3 border-b border-neutral-200 font-bold">竞赛纪律与规范要求</h3><div className="p-4 space-y-3 text-neutral-600 leading-6"><p>1. 请按竞赛时间进入环境，提前确认账号、网络及所需资源可用。</p><p>2. 参赛形式：{competition.format}。请使用本人账号参加竞赛。</p><p>3. 提交文件格式为 {competition.ruleFiles}，每日最多提交 {competition.ruleMaxSubmissions} 次。</p><p>4. 严禁替考、抄袭、攻击其他参赛者环境或使用未经许可的资源。</p><p>5. 如遇环境异常，请及时联系运营人员；竞赛结束前完成提交并确认结果。</p></div></div>}
        </div>}
      </div>
      <footer className={styles.footer}>
        <Button type="button" variant="outline" onClick={subformId ? backToList : onClose} className={secondaryClass}>{subformId || mode === "scoring" ? "取消" : "关闭"}</Button>
        {subformId ? <Button type="submit" form={subformId} className={primaryClass}>{checkEditor ? "保存检查项" : "确认延时"}</Button> : mode === "scoring" && <Button type="submit" form="competition-score-totals" className={primaryClass}>确认</Button>}
      </footer>
      {rowMenu && activeMenuCandidate && createPortal(<div ref={menuRef} role="menu" aria-label="考生更多操作" className="fixed w-[132px] bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[220] py-1" style={{ left: rowMenu.left, top: rowMenu.top }}>{[
        { label: "初始化环境", run: () => initializeEnvironment([activeMenuCandidate.id]) }, { label: "清理环境", run: () => cleanEnvironment([activeMenuCandidate.id]) }, { label: "得分事件", run: () => openCandidate(activeMenuCandidate, "events") }
      ].map(action => <button role="menuitem" key={action.label} className="block text-left w-full px-3 py-1.5 text-xs text-neutral-700 hover:bg-orange-50/40 hover:text-[#fa541c] cursor-pointer" onClick={() => { setRowMenu(null); action.run(); }}>{action.label}</button>)}</div>, document.body)}
      {confirmation && <div className="absolute inset-0 z-[230] bg-black/30 flex items-center justify-center p-6" onClick={() => setConfirmation(null)}><div role="alertdialog" aria-modal="true" aria-label={confirmation.title} className="bg-white rounded-[4px] shadow-xl w-full max-w-[420px]" onClick={e => e.stopPropagation()}><h3 className={cn(styles.header, styles.title)}>{confirmation.title}</h3><p className="p-6 text-neutral-600 text-[13px] leading-6">{confirmation.message}</p><div className={styles.footer}><Button variant="outline" className={secondaryClass} onClick={() => setConfirmation(null)}>取消</Button><Button className={primaryClass} onClick={() => { confirmation.run(); setConfirmation(null); }}>确认</Button></div></div></div>}
    </div>
  </div>, document.body);
}
