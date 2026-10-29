import React, { useEffect, useRef, useState } from "react";
import { CircleHelp, FileText, Plus, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompetitionCheck } from "./competitionOperations";
import { competitionDrawerStyles as styles } from "./competitionDrawerStyles";

interface Props {
  value: CompetitionCheck;
  isEditing: boolean;
  error: string;
  onChange: (value: CompetitionCheck) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function CompetitionCheckForm({ value, isEditing, error, onChange, onSubmit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [fileError, setFileError] = useState("");
  const isRequest = value.category === "request";
  const advanced = value.category !== "custom";
  const categoryLabel = isRequest ? "模拟请求类型" : value.category === "environment" ? "环境检查项" : "自定义模拟请求检查项";
  const contentLabel = isRequest ? "模拟请求生成和验证脚本" : advanced ? "环境检查项内容" : "检查内容";
  const times = value.executionTimes ?? [];
  const update = <K extends keyof CompetitionCheck>(key: K, next: CompetitionCheck[K]) => onChange({ ...value, [key]: next });
  const field = (id: string, label: string, children: React.ReactNode, required = true) => <div className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] gap-2 sm:gap-4 items-start">
    <label htmlFor={id} className={cn(styles.label, "sm:pt-2 sm:whitespace-nowrap")}>
      {required && <span className="text-[#fa541c] mr-1">*</span>}{label}
    </label><div className="min-w-0">{children}</div>
  </div>;

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  return <form id="competition-check-form" noValidate onSubmit={onSubmit} className="space-y-5 max-w-[860px]">
    <h3 className="font-semibold text-neutral-800">{isEditing ? "编辑" : "新建"}{categoryLabel}</h3>
    {field("competition-check-name", `${categoryLabel}名称`, <div className="relative">
      <input id="competition-check-name" required maxLength={100} className={cn(styles.input, "pr-20")} value={value.name} onChange={event => update("name", event.target.value)} placeholder={`请输入${categoryLabel}名称`} />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 tabular-nums pointer-events-none">{value.name.length} / 100</span>
    </div>)}
    {field("competition-check-description", `${categoryLabel}描述`, <div className="relative">
      <textarea id="competition-check-description" required maxLength={1000} rows={3} className={cn(styles.input, "block pb-6 resize-y")} value={value.description} onChange={event => update("description", event.target.value)} placeholder={`请输入${categoryLabel}描述`} />
      <span className="absolute right-3 bottom-2 text-[11px] text-neutral-400 tabular-nums pointer-events-none">{value.description.length} / 1000</span>
    </div>)}
    {field("competition-check-content", contentLabel, <div className="flex h-[280px] border border-neutral-200 rounded-[4px] overflow-hidden focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c]/25 transition-all">
      <div ref={gutterRef} aria-hidden="true" className="w-10 shrink-0 bg-neutral-50 border-r border-neutral-200 text-neutral-400 text-right py-3 pr-2.5 font-mono text-xs leading-6 overflow-hidden select-none">{Array.from({ length: Math.max(1, value.content.split("\n").length) }, (_, index) => <div key={index}>{index + 1}</div>)}</div>
      <textarea id="competition-check-content" required spellCheck={false} wrap="off" className="w-full min-w-0 p-3 resize-none outline-none font-mono text-xs leading-6 placeholder:text-neutral-400 text-neutral-700" value={value.content} onChange={event => update("content", event.target.value)} onScroll={event => { if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop; }} placeholder={`请输入${contentLabel}`} />
    </div>)}
    {isRequest && field("competition-check-file", "动态参数文件", <div className="space-y-2">
      <button id="competition-check-file" type="button" onClick={() => fileRef.current?.click()} className={cn(styles.secondary, "inline-flex items-center gap-2 px-4")}><Upload className="w-3.5 h-3.5" />上传文件</button>
      <input ref={fileRef} type="file" accept=".txt,.csv,text/plain,text/csv" aria-label="选择动态参数文件" className="hidden" onChange={event => {
        const file = event.target.files?.[0]; event.target.value = "";
        if (!file) return;
        if (!/\.(txt|csv)$/i.test(file.name) || file.size > 200 * 1024 * 1024) { setFileError("仅支持 txt/csv 格式文件，大小须在 200M 以内"); return; }
        setFileError(""); update("dynamicParameterFile", { name: file.name, size: file.size, file });
      }} />
      <p className="text-xs text-neutral-400 leading-5">支持txt/csv格式文件，大小200M以内</p>
      {value.dynamicParameterFile && <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-[4px] px-3 py-2 text-xs"><FileText className="w-3.5 h-3.5 text-[#fa541c] shrink-0" /><span className="truncate flex-1" title={value.dynamicParameterFile.name}>{value.dynamicParameterFile.name}</span><span className="text-neutral-400 shrink-0">{value.dynamicParameterFile.size < 1024 ? `${value.dynamicParameterFile.size} B` : `${(value.dynamicParameterFile.size / 1024).toFixed(1)} KB`}</span><button type="button" aria-label="移除动态参数文件" onClick={() => { update("dynamicParameterFile", undefined); setFileError(""); }} className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"><X className="w-3.5 h-3.5" /></button></div>}
      {fileError && <p role="alert" className="text-red-500 text-xs">{fileError}</p>}
    </div>, false)}
    {advanced && <>
      <div className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] gap-2 sm:gap-4 items-start">
        <span id="competition-check-scoring-label" className={cn(styles.label, "sm:pt-2 sm:whitespace-nowrap")}><span className="text-[#fa541c] mr-1">*</span>判分类型</span>
        <div role="radiogroup" aria-labelledby="competition-check-scoring-label" className="flex flex-wrap items-center gap-x-8 gap-y-3 min-h-9">{([{ key: "fixed", label: "固定判分", hint: "计入本场竞赛的固定得分。" }, { key: "floating", label: "浮动判分", hint: "计入本场竞赛的浮动得分。" }] as const).map(item => <label key={item.key} className={cn("inline-flex items-center gap-2 cursor-pointer", value.scoringType === item.key ? "text-[#fa541c] font-semibold" : "text-neutral-600")}>
          <input type="radio" name="competition-check-scoring" value={item.key} checked={value.scoringType === item.key} onChange={() => update("scoringType", item.key)} className="w-4 h-4 accent-[#fa541c] cursor-pointer" /><span>{item.label}</span><span tabIndex={0} aria-label={`${item.label}说明：${item.hint}`} title={item.hint}><CircleHelp className="w-3.5 h-3.5 text-neutral-400" /></span>
        </label>)}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] gap-2 sm:gap-4 items-start">
        <span id="competition-check-times-label" className={cn(styles.label, "sm:pt-2 sm:whitespace-nowrap")}><span className="text-[#fa541c] mr-1">*</span>执行时间</span>
        <section aria-labelledby="competition-check-times-label" className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3"><h4 className="text-[13px] font-semibold text-neutral-800">执行时间</h4><button type="button" className={cn(styles.primary, "px-4 inline-flex items-center gap-1.5")} onClick={() => update("executionTimes", [...times, { id: crypto.randomUUID(), startAfterMinutes: 1, frequency: 1 }])}><Plus className="w-3.5 h-3.5" />添加</button></div>
          <div className="space-y-2">{times.map((time, index) => <div key={time.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_56px] border border-neutral-200 rounded-[4px] overflow-hidden">
            <label className="p-3 space-y-2 text-xs text-neutral-600"><span className="block">竞赛开始后</span><input required aria-label={`第${index + 1}条开始执行时间`} type="number" min={0} step={1} value={Number.isNaN(time.startAfterMinutes) ? "" : time.startAfterMinutes} onChange={event => update("executionTimes", times.map(row => row.id === time.id ? { ...row, startAfterMinutes: event.target.value === "" ? NaN : Number(event.target.value) } : row))} className={cn(styles.input, "px-2 text-center")} /><span className="block">分钟开始执行</span></label>
            <label className="p-3 border-l border-neutral-200 flex flex-col justify-center gap-2 text-xs text-neutral-600"><input required aria-label={`第${index + 1}条${isRequest ? "执行频率" : "执行间隔"}`} type="number" min={0} step={1} value={Number.isNaN(time.frequency) ? "" : time.frequency} onChange={event => update("executionTimes", times.map(row => row.id === time.id ? { ...row, frequency: event.target.value === "" ? NaN : Number(event.target.value) } : row))} className={cn(styles.input, "px-2 text-center")} /><span>{isRequest ? "次/分钟" : "分钟/次"}</span></label>
            <div className="bg-neutral-50 border-l border-neutral-200 flex items-center justify-center"><button type="button" aria-label={`删除第${index + 1}条执行时间`} onClick={() => update("executionTimes", times.filter(row => row.id !== time.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button></div>
          </div>)}</div>
          {!times.length && <p className="text-xs text-neutral-400 py-3 text-center border border-dashed border-neutral-200 rounded-[4px]">暂无执行时间，请添加</p>}
          <p className="text-xs text-neutral-400 leading-5">如只需执行一次，将{isRequest ? "执行频率填写为 0 次/分钟" : "执行间隔填写为 0 分钟/次"}即可。</p>
        </section>
      </div>
      {field("competition-check-score", "得分", <textarea id="competition-check-score" required rows={3} value={value.scoreExpression ?? ""} onChange={event => update("scoreExpression", event.target.value)} className={cn(styles.input, "block resize-y font-mono leading-6")} placeholder={'支持 +、-、*、/、>、<、=、==、&、"、| 运算符'} />)}
    </>}
    {error && <p ref={errorRef} tabIndex={-1} role="alert" className="text-red-500 text-xs outline-none">{error}</p>}
  </form>;
}
