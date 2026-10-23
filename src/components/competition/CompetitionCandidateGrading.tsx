import React, { useState } from "react";
import { ChevronDown, FileText, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompetitionCandidate, CompetitionOperationData, competitionScore } from "./competitionOperations";
import { competitionDrawerStyles as styles } from "./competitionDrawerStyles";

interface Props {
  candidate: CompetitionCandidate;
  data: CompetitionOperationData;
  onNotify: (message: string) => void;
}

type CheckResult = NonNullable<CompetitionCandidate["checkResults"]>[number];
const hasResult = (result?: CheckResult) => Boolean(result && (result.result.trim() || result.score != null));
const badgeClass = "rounded-[4px] border px-1.5 py-0.5 text-[11px] whitespace-nowrap";

export default function CompetitionCandidateGrading({ candidate, data, onNotify }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState("");
  const score = competitionScore(candidate, data);
  // Request types are templates; grade the environment and configured request checks.
  const checks = data.checks.filter(check => check.category !== "request");
  const resultByCheck = new Map(candidate.checkResults?.map(result => [result.checkId, result]));
  const returnedCount = checks.filter(check => hasResult(resultByCheck.get(check.id))).length;
  const buildDetailRecords = (check: CompetitionOperationData["checks"][number]) =>
    ["14:48:13", "14:46:13", "14:44:13", "14:42:13", "14:40:17"].map((time, index) => ({
      serialNum: "0",
      checkItemName: check.name,
      scoreEventId: `scoreevent${String(index + 1).padStart(2, "0")}x7k9m2p4q6`,
      cloudCompetitionRecordId: candidate.id,
      competitionCheckItemId: check.id,
      score: resultByCheck.get(check.id)?.score ?? 0,
      message: `${check.name}(历史得分)`,
      data: JSON.stringify({ success: false }),
      eventTime: `2026-10-22 ${time}`,
    }));

  return (
    <section aria-label={`${candidate.name}的批阅内容`} className="min-w-0 space-y-4">
      <section aria-label="考生与得分概览" className={styles.card}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <h3 className="font-semibold text-neutral-800">{candidate.name}</h3>
            <span className="break-all text-neutral-500">账号：{candidate.account}</span>
            <span className={cn(badgeClass, candidate.status === "已交卷" ? "border-green-200 bg-green-50 text-green-600" : candidate.status === "竞赛中" ? "border-blue-200 bg-blue-50 text-blue-600" : "border-neutral-200 bg-neutral-50 text-neutral-500")}>{candidate.status}</span>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            <span role="status" className="text-[11px] tabular-nums text-neutral-400">{refreshedAt && `更新于 ${refreshedAt}`}</span>
            <button type="button" onClick={() => { setRefreshedAt(new Date().toLocaleTimeString("zh-CN", { hour12: false })); onNotify("批阅信息已刷新"); }} className={cn(styles.secondary, "inline-flex items-center gap-1.5")}><RefreshCw className="size-3.5" />刷新</button>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-4 p-4">
          <div><dt className="mb-2 text-xs text-neutral-500">总得分</dt><dd className="flex flex-wrap items-baseline gap-1.5"><span className="text-xl font-semibold tabular-nums text-neutral-800">{score.total}</span><span className="text-xs tabular-nums text-neutral-400">/ {score.maximum} 分</span></dd></div>
          <div><dt className="mb-2 text-xs text-neutral-500">固定得分</dt><dd className="flex items-baseline gap-1.5"><span className="text-xl font-semibold tabular-nums text-neutral-800">{score.fixed ?? "--"}</span><span className="text-xs text-neutral-400">分</span></dd></div>
          <div><dt className="mb-2 text-xs text-neutral-500">浮动得分</dt><dd className="flex items-baseline gap-1.5"><span className="text-xl font-semibold tabular-nums text-neutral-800">{score.floating ?? "--"}</span><span className="text-xs text-neutral-400">分</span></dd></div>
        </dl>
      </section>

      <section aria-label="检查项评阅" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <h3 className="font-semibold text-neutral-800">检查项明细<span className="ml-2 font-normal text-neutral-400">共 {checks.length} 项</span></h3>
          <p className="tabular-nums text-neutral-400">已返回 {returnedCount} / {checks.length} 项</p>
        </div>
        <div className={styles.table}>
          <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-xs">
            <caption className="sr-only">{candidate.name}的检查项、执行结果与得分</caption>
            <colgroup><col className="w-14" /><col /><col className="w-28" /><col className="w-24" /><col className="w-28" /></colgroup>
            <thead><tr className={styles.tableHeader}>{["序号", "检查项", "结果", "得分", "操作"].map(label => <th key={label} scope="col" className="p-3 font-medium">{label}</th>)}</tr></thead>
            <tbody>
              {checks.map((check, index) => {
                const result = resultByCheck.get(check.id);
                const returned = hasResult(result);
                const expanded = expandedId === check.id;
                const detailId = `grading-result-${candidate.id}-${check.id}`;
                return <React.Fragment key={check.id}>
                  <tr className={styles.tableRow}>
                    <td className={cn(styles.tableCell, "tabular-nums")}>{String(index + 1).padStart(2, "0")}</td>
                    <th scope="row" className={cn(styles.tableCell, "break-words text-left font-normal leading-5")}>
                      {check.name}{check.category === "custom" && <span className={cn(badgeClass, "ml-2 inline-block border-neutral-200 bg-neutral-50 align-middle text-neutral-500")}>模拟请求</span>}
                    </th>
                    <td className={styles.tableCell}><span className={cn(badgeClass, returned ? "border-blue-200 bg-blue-50 text-blue-600" : "border-neutral-200 bg-neutral-50 text-neutral-500")}>{returned ? "已返回" : "暂无结果"}</span></td>
                    <td className={cn(styles.tableCell, "tabular-nums")}>{result?.score ?? "--"}</td>
                    <td className={styles.tableCell}><button type="button" aria-label={`查看${check.name}详情`} aria-expanded={expanded} aria-controls={expanded ? detailId : undefined} onClick={() => setExpandedId(expanded ? null : check.id)} className={cn(styles.action, "inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400")}>{expanded ? "收起详情" : "查看详情"}<ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} /></button></td>
                  </tr>
                  {expanded && <tr className="border-b border-neutral-100 last:border-0"><td colSpan={5} className="bg-neutral-50/50 p-4">
                    <section id={detailId} aria-label={`${check.name}的检查详情`}>
                      <div className={cn(styles.card, "min-w-0 p-4")}>
                        <h4 className="mb-3 text-xs font-semibold text-neutral-800">查看详情</h4>
                        <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-all rounded-[4px] border border-neutral-100 bg-[#e5e7eb] p-3 font-mono text-xs leading-6 text-neutral-600">{buildDetailRecords(check).map(record => JSON.stringify(record)).join("\n")}</pre>
                      </div>
                    </section>
                  </td></tr>}
                </React.Fragment>;
              })}
              {!checks.length && <tr><td colSpan={5} className="py-14 text-center text-xs text-neutral-400"><FileText className="mx-auto mb-3 size-8 text-neutral-300" />暂无检查项</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
