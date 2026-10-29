import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Search, Settings, Trash2, ExternalLink, AlertTriangle, Code2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CompetitionSelect from "./CompetitionSelect";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { competitionDrawerStyles as styles } from "./competitionDrawerStyles";

type Pair = { id: string; label: string; value: string };
type ScriptGroup = { script: string; rows: Pair[] };
export interface CockpitConfig {
  id: string; competitionId: string; name: string; introduction: string; startAt: string; endAt: string;
  participation: Pair[]; ranking: Pair; scrollSpeed: number; flipSpeed: number;
  checkpoints: Pair[]; indicators: ScriptGroup; radar: ScriptGroup;
}
interface Competition { id: string; name: string; description: string; startAt?: string; endAt?: string }
const storageKey = "competition-cockpit-configs-v1";
const longNameSampleKey = "competition-cockpit-long-name-sample-v1";
const maxParticipationItems = 4;
const pair = (label = "", value = ""): Pair => ({ id: crypto.randomUUID(), label, value });
export function readCockpitConfigs(): CockpitConfig[] {
  try { const value = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
}
const makeConfig = (competition?: Competition): CockpitConfig => ({
  id: crypto.randomUUID(), competitionId: competition?.id || "", name: competition?.name || "",
  introduction: competition?.description || "", startAt: competition?.startAt || "", endAt: competition?.endAt || "",
  participation: [pair("初赛参加人数", "4534"), pair("初赛参加公司", "65"), pair("复赛参加人数", "252"), pair("复赛参加公司", "36")],
  ranking: pair("复赛实时排名情况", "totalScore"), scrollSpeed: 100, flipSpeed: 5000,
  checkpoints: [pair("1", "task1"), pair("2", "task2")],
  indicators: { script: "", rows: [pair("负载均衡", "elb")] }, radar: { script: "", rows: [pair("安全性", "ai")] },
});

export default function CockpitManagement({ competitions, onNotify }: { competitions: Competition[]; onNotify: (message: string) => void }) {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<CockpitConfig[]>(() => {
    const saved = readCockpitConfigs();
    const initial = localStorage.getItem(storageKey) ? saved : competitions.map(makeConfig);
    if (!localStorage.getItem(longNameSampleKey) && !initial.some(item => item.id === "cockpit-long-name-example") && competitions[0]) {
      initial.push({ ...makeConfig(competitions[0]), id: "cockpit-long-name-example", name: "2026年全国职业院校技能大赛暨产教融合创新实践挑战赛——人工智能与云计算技术应用综合能力竞赛上海赛区总决赛" });
    }
    return initial;
  });
  const [keyword, setKeyword] = useState("");
  const [draft, setDraft] = useState<CockpitConfig | null>(null);
  const [deleting, setDeleting] = useState<CockpitConfig | null>(null);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const drawerRef = useRef<HTMLFormElement>(null);
  const drawerOpen = !!draft;
  useEffect(() => {
    if (!drawerOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); setDraft(null); }
      if (event.key === "Tab") {
        const items = Array.from<HTMLElement>(drawerRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || []).filter(item => item.getClientRects().length);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === drawerRef.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); previousFocus?.focus(); };
  }, [drawerOpen]);
  const persist = (next: CockpitConfig[]) => {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); localStorage.setItem(longNameSampleKey, "1"); setConfigs(next); setStorageError(""); return true; }
    catch { setStorageError("保存失败，请检查浏览器存储空间后重试"); return false; }
  };
  const edit = (config: CockpitConfig) => { setDraft(structuredClone(config)); setError(""); };
  const update = <K extends keyof CockpitConfig>(key: K, value: CockpitConfig[K]) => setDraft(previous => previous ? { ...previous, [key]: value } : previous);
  const field = (label: string, children: React.ReactNode, required = true) => <div className="min-w-0 space-y-2.5"><div className="text-[13px] text-neutral-700 font-semibold">{label}{required && <span className="text-[#fa541c] ml-1">*</span>}</div><div className="min-w-0">{children}</div></div>;
  const section = (title: string, children: React.ReactNode) => {
    const info = title === "基本信息" ? ["01", "设置关联赛事、介绍与展示时间"] : title === "参赛情况" ? ["02", "配置参赛统计、实时排行与播放节奏"] : ["03", "关联检查项，设置指示灯与雷达图展示"];
    return <section className="bg-white border border-neutral-200 rounded-[8px] shadow-sm"><header className="px-5 sm:px-7 py-5 border-b border-neutral-100 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-orange-50 text-[#fa541c] text-xs font-bold tabular-nums">{info[0]}</span><div><h3 className="font-semibold text-[15px] text-neutral-900">{title}</h3><p className="text-xs text-neutral-400 mt-1">{info[1]}</p></div></header><div className="p-5 sm:p-7 space-y-6">{children}</div></section>;
  };
  const pairRows = (rows: Pair[], onChange: (rows: Pair[]) => void, labels: [string, string], options?: string[], maximum?: number) => <div className="space-y-3">
    <div className="border border-neutral-200 rounded-[6px] bg-white"><div className="hidden md:flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500 rounded-t-[6px]"><span className="w-6 shrink-0">序号</span><div className="grid grid-cols-2 gap-3 flex-1"><span>{labels[0]}</span><span>{labels[1].replace("请选择", "")}</span></div><span className="w-8 shrink-0 text-center">操作</span></div>{rows.map((row, index) => <div key={row.id} className="flex items-start gap-3 border-b last:border-b-0 border-neutral-100 px-4 py-3">
      <span className="w-6 shrink-0 pt-2.5 text-xs text-neutral-400 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-w-0">
        <input aria-label={`${labels[0]}${index + 1}`} maxLength={100} className={styles.input} placeholder={labels[0]} value={row.label} onChange={event => onChange(rows.map(item => item.id === row.id ? { ...item, label: event.target.value } : item))} />
        {options ? <CompetitionSelect id={`cockpit-check-${row.id}`} value={row.value} options={Array.from(new Set([...options, ...(row.value ? [row.value] : [])]))} placeholder={labels[1]} onChange={value => onChange(rows.map(item => item.id === row.id ? { ...item, value } : item))} /> : <input aria-label={`${labels[1]}${index + 1}`} maxLength={200} className={styles.input} placeholder={labels[1]} value={row.value} onChange={event => onChange(rows.map(item => item.id === row.id ? { ...item, value: event.target.value } : item))} />}
      </div><button type="button" aria-label={`删除${labels[0]}${index + 1}`} className="p-2 text-[#fa541c] hover:bg-orange-50 rounded cursor-pointer" onClick={() => onChange(rows.filter(item => item.id !== row.id))}><Trash2 size={16} /></button>
    </div>)}{!rows.length && <p className="py-6 text-center text-xs text-neutral-400">暂无配置，请添加</p>}</div>
    <button type="button" disabled={maximum !== undefined && rows.length >= maximum} className="h-9 w-full border border-dashed border-orange-200 rounded-[4px] text-[#fa541c] text-xs font-semibold enabled:hover:bg-orange-50/50 inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:text-[#ffbb96] disabled:cursor-not-allowed" onClick={() => { if (maximum === undefined || rows.length < maximum) onChange([...rows, pair()]); }}><Plus size={14} />添加{labels[0]}</button>
    {maximum !== undefined && <p className="text-xs text-neutral-400" aria-live="polite">最多配置 {maximum} 项统计，已配置 {rows.length}/{maximum} 项{rows.length >= maximum ? "，已达上限" : ""}</p>}
  </div>;
  const stepper = (key: "scrollSpeed" | "flipSpeed", value: number, step: number) => <div className="flex h-9 border border-neutral-200 rounded-[4px] overflow-hidden"><button type="button" aria-label={`减少${key === "scrollSpeed" ? "滚动速度" : "翻转速度"}`} className="px-4 bg-neutral-50 cursor-pointer" onClick={() => update(key, Math.max(1, value - step))}>−</button><input aria-label={key === "scrollSpeed" ? "滚动速度/毫秒" : "翻转速度/毫秒"} type="number" min={1} step={1} required className="w-full min-w-0 text-center outline-none text-[13px]" value={value || ""} onChange={event => update(key, Number(event.target.value))} /><button type="button" aria-label={`增加${key === "scrollSpeed" ? "滚动速度" : "翻转速度"}`} className="px-4 bg-neutral-50 cursor-pointer" onClick={() => update(key, value + step)}>+</button></div>;
  const scriptGroup = (key: "indicators" | "radar") => draft && <div className="space-y-4"><div className="rounded-[6px] border border-neutral-200 overflow-hidden focus-within:border-[#fa541c]"><div className="flex items-center gap-2 bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 text-xs text-neutral-500"><Code2 size={14} /><span>数据处理脚本</span></div><textarea aria-label={key === "indicators" ? "指示灯脚本" : "雷达图脚本"} rows={5} spellCheck={false} className="block w-full bg-[#fcfcfd] px-4 py-3 text-xs leading-6 font-mono text-neutral-700 outline-none resize-y placeholder:text-neutral-400" placeholder="请输入数据处理脚本" value={draft[key].script} onChange={event => update(key, { ...draft[key], script: event.target.value })} /></div>{pairRows(draft[key].rows, rows => update(key, { ...draft[key], rows }), [key === "indicators" ? "指示灯名称" : "雷达维度名称", "检查项键"])}</div>;
  const save = (event: React.FormEvent) => {
    event.preventDefault(); if (!draft) return;
    if (draft.participation.length > maxParticipationItems) { setError("参赛配置最多支持四项统计，请删除多余配置后保存"); return; }
    const allPairs = [...draft.participation, draft.ranking, ...draft.checkpoints, ...draft.indicators.rows, ...draft.radar.rows];
    if (!competitions.some(item => item.id === draft.competitionId) || !draft.introduction.trim() || !draft.startAt || !draft.endAt) { setError("请完整填写关联竞赛、赛事项目介绍与场次时间"); return; }
    if (draft.endAt <= draft.startAt) { setError("结束时间须晚于开始时间"); return; }
    if (![draft.scrollSpeed, draft.flipSpeed].every(value => Number.isSafeInteger(value) && value > 0)) { setError("滚动速度和翻转速度须为正整数毫秒"); return; }
    if (!draft.participation.length || !draft.checkpoints.length || !draft.indicators.rows.length || !draft.radar.rows.length || allPairs.some(row => !row.label.trim() || !row.value.trim())) { setError("请完整填写参赛配置、排名配置、检查项判分点、指示灯及雷达图配置"); return; }
    const saved = { ...draft, name: draft.name || competitions.find(item => item.id === draft.competitionId)!.name };
    if (persist(configs.some(item => item.id === saved.id) ? configs.map(item => item.id === saved.id ? saved : item) : [...configs, saved])) { setDraft(null); onNotify("驾驶舱配置已保存"); }
  };
  const configDrawer = draft ? createPortal(<div className={styles.overlay} onClick={() => setDraft(null)}>
    <form ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cockpit-config-title" onSubmit={save} className={styles.panel + " max-w-[1100px]"} onClick={event => event.stopPropagation()}>
    <header className={styles.header}><h2 id="cockpit-config-title" className={styles.title}>驾驶舱配置</h2><button type="button" aria-label="关闭驾驶舱配置" className={styles.close} onClick={() => setDraft(null)}><X className="w-4 h-4" /></button></header>
    <div className={styles.body}>
    <p className="text-xs text-neutral-500 leading-5 break-words">{draft.name || "创建驾驶舱，配置赛事数据与大屏展示内容"}</p>
    {section("基本信息", <>
      {field("关联竞赛", <CompetitionSelect id="cockpit-competition" value={draft.competitionId} options={competitions.map(item => item.id)} optionLabels={Object.fromEntries(competitions.map(item => [item.id, item.name]))} placeholder="请选择关联竞赛" onChange={id => { const competition = competitions.find(item => item.id === id); setDraft({ ...draft, competitionId: id, name: competition?.name || "", introduction: draft.introduction || competition?.description || "", startAt: draft.startAt || competition?.startAt || "", endAt: draft.endAt || competition?.endAt || "" }); }} />)}
      {field("赛事项目介绍", <div className="relative"><textarea aria-label="赛事项目介绍" required rows={3} maxLength={1000} className={styles.input + " pb-6 resize-y"} value={draft.introduction} onChange={event => update("introduction", event.target.value)} placeholder="请输入赛事项目介绍" /><span className="absolute bottom-2 right-3 text-xs text-neutral-400">{draft.introduction.length} / 1000</span></div>)}
      {field("场次时间", <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><DateTimePicker id="cockpit-start" label="开始时间" showSeconds value={draft.startAt} onChange={value => update("startAt", value)} placeholder="开始时间" /><DateTimePicker id="cockpit-end" label="结束时间" showSeconds value={draft.endAt} onChange={value => update("endAt", value)} placeholder="结束时间" /></div>)}
    </>)}
    {section("参赛情况", <>
      {field("参赛配置", pairRows(draft.participation, rows => update("participation", rows), ["统计名称", "统计值"], undefined, maxParticipationItems))}
      {field("实时排行配置", <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><input aria-label="排行名称" required className={styles.input} value={draft.ranking.label} onChange={event => update("ranking", { ...draft.ranking, label: event.target.value })} placeholder="排行名称" /><input aria-label="排行字段" required className={styles.input} value={draft.ranking.value} onChange={event => update("ranking", { ...draft.ranking, value: event.target.value })} placeholder="排行字段" /></div>)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[6px] border border-neutral-100 bg-neutral-50/60 p-4 sm:p-5">{field("滚动速度/毫秒", stepper("scrollSpeed", draft.scrollSpeed, 10))}{field("翻转速度/毫秒", stepper("flipSpeed", draft.flipSpeed, 500))}</div>
    </>)}
    {section("得分点判定", <>
      {field("检查项判分点", pairRows(draft.checkpoints, rows => update("checkpoints", rows), ["判分点名称", "请选择检查项"], ["task1", "task2", "task3"]))}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 border-t border-neutral-100 pt-6">{field("指示灯", scriptGroup("indicators"))}{field("雷达图", scriptGroup("radar"))}</div>
    </>)}
    {(error || storageError) && <p role="alert" className="text-red-500 text-sm">{error || storageError}</p>}
    </div>
    <footer className={styles.footer}><button type="button" className={styles.secondary} onClick={() => setDraft(null)}>取消</button><button type="submit" className={styles.primary + " inline-flex items-center gap-2"}><Save size={14} />保存配置</button></footer>
  </form></div>, document.body) : null;
  const visible = configs.filter(item => item.name.toLowerCase().includes(keyword.trim().toLowerCase()));
  return <div className="space-y-4">
    {configDrawer}
    <div className="flex flex-wrap items-end gap-4 mb-4"><h1 className="text-xl font-bold text-neutral-900">驾驶舱管理</h1><p className="text-sm text-neutral-500 mb-0.5">管理竞赛大屏，配置赛事信息与得分展示</p></div>
    <div className="bg-white border border-neutral-border rounded-[8px] overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
        <div className="flex items-center flex-wrap gap-3"><div className="relative w-72 max-w-full"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><input id="cockpit-search" aria-label="搜索驾驶舱" type="text" className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400" value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="搜索竞赛名称" /></div></div>
        <button type="button" className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0 shrink-0 self-end lg:self-auto" onClick={() => edit(makeConfig())}><Plus className="w-3.5 h-3.5" />新建驾驶舱</button>
      </div>
      <div className="p-6 space-y-6">
      {storageError && <p role="alert" className="text-sm text-red-500">{storageError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">{visible.map(config => <article key={config.id} className="border border-neutral-200 rounded-[8px] overflow-hidden hover:shadow-md transition-shadow">
        <button type="button" aria-label={`预览${config.name}`} className="block w-full aspect-video overflow-hidden bg-[#051c2b] cursor-pointer" onClick={() => { if (persist(configs)) navigate(`/admin/competitions/${config.competitionId}/cockpit?config=${config.id}`); }}><img src="/images/figma-cockpit-frame.jpg" alt="竞赛驾驶舱预览" className="w-full h-full object-cover" /></button>
        <div className="p-4"><h2 className="font-semibold text-sm leading-5 h-10 line-clamp-2 break-words" title={config.name}>{config.name}</h2><div className="flex justify-between items-center mt-4 text-xs"><button type="button" className={styles.action + " inline-flex gap-1 items-center"} onClick={() => edit(config)}><Settings size={14} />配置</button><div className="flex gap-4"><button type="button" className="text-neutral-500 hover:text-[#fa541c] inline-flex gap-1 items-center cursor-pointer" onClick={() => { if (persist(configs)) navigate(`/admin/competitions/${config.competitionId}/cockpit?config=${config.id}`); }}><ExternalLink size={14} />查看</button><button type="button" className={styles.action} onClick={() => setDeleting(config)}>删除</button></div></div></div>
      </article>)}<button type="button" className="min-h-[220px] rounded-[8px] border border-dashed border-neutral-300 hover:border-[#fa541c] hover:bg-orange-50/40 text-neutral-400 hover:text-[#fa541c] flex flex-col items-center justify-center gap-3 cursor-pointer" onClick={() => edit(makeConfig())}><Plus size={32} /><span className="text-sm">新建驾驶舱</span></button></div>
      {!visible.length && <p className="text-center text-sm text-neutral-400">{keyword.trim() ? "暂无符合条件的驾驶舱" : "暂无驾驶舱，点击新建开始配置"}</p>}
      <p className="text-xs text-neutral-400">共 {visible.length} 个驾驶舱</p>
      </div>
    </div>
    {deleting && <div className="fixed inset-0 z-[240] bg-black/45 flex items-center justify-center p-4" onClick={() => setDeleting(null)}><section role="alertdialog" aria-modal="true" aria-labelledby="cockpit-delete-title" className="w-full max-w-[460px] bg-white rounded-[8px] shadow-xl" onClick={event => event.stopPropagation()}><h2 id="cockpit-delete-title" className="px-6 py-4 border-b border-neutral-100 font-bold">删除驾驶舱</h2><div className="p-6 flex gap-3 text-sm leading-6"><AlertTriangle className="shrink-0 text-orange-400" size={22} /><p>确定删除“{deleting.name}”的驾驶舱配置吗？关联竞赛将保留。</p></div>{storageError && <p role="alert" className="px-6 text-red-500 text-sm">{storageError}</p>}<footer className="p-4 border-t border-neutral-100 flex justify-end gap-3"><button className={styles.secondary} onClick={() => setDeleting(null)}>取消</button><button className={styles.primary} onClick={() => { if (persist(configs.filter(item => item.id !== deleting.id))) { setDeleting(null); onNotify("驾驶舱已删除"); } }}>确定</button></footer></section></div>}
  </div>;
}
