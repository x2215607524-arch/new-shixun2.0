import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Box, Cloud, Code2, Database, HardDrive, Network, Radar, ShieldCheck } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar as RadarArea, RadarChart, ResponsiveContainer } from "recharts";
import "@/styles/competition-cockpit.css";
import "@/styles/competition-cockpit-responsive.css";

const ranking = [
  ["6", "刘巍", "中国电信股份有限公司上海分公司", "67.96"],
  ["7", "王家阳", "国泰海通证券股份有限公司", "66.2721"],
  ["8", "向超美", "太平洋健康保险股份有限公司", "65.9482"],
  ["9", "周诚", "上海国际港务（集团）股份有限公司振东集装箱码头分公司", "64.7284"],
  ["10", "蔡闻哲", "上海中远海运资讯科技有限公司", "64.361"],
  ["11", "金晨奥", "上海国际港务（集团）股份有限公司振东集装箱码头分公司", "63.8841"],
  ["12", "张星文", "中银国际证券股份有限公司", "63.1355"],
];

const scoringRows = [
  ["张广宁", "13552", "0", "0", "0", "0", "+122", "13552"],
  ["戴淳瑜", "50212", "-100", "0", "0", "0", "+206", "50112"],
  ["周诚", "33208", "0", "0", "-20", "-160", "+84", "33028"],
  ["李兆恩", "36264", "0", "0", "-5676", "-1400", "+224", "29188"],
  ["郑磊皓", "2247", "-1221", "-1891", "-1137", "2417", "-1840", "1402"],
  ["何丽娜", "1245", "-1936", "1108", "-1973", "3157", "-939", "1402"],
  ["宁亚楠", "1837", "-640", "2260", "-1182", "2064", "-937", "1402"],
];

const radarData = [
  { subject: "性能", value: 82 }, { subject: "安全性", value: 70 }, { subject: "功能完成", value: 88 },
  { subject: "卓越运营", value: 58 }, { subject: "成本控制", value: 78 }, { subject: "可靠性", value: 72 },
];

const capabilityItems = [
  [Cloud, "负载均衡"], [Radar, "私有镜像"], [HardDrive, "弹性伸缩"], [Network, "云监控"],
  [Activity, "日志收集"], [Code2, "高可用"], [Database, "对象存储"], [Box, "业务程序"],
] as const;

function CyberPanel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`cockpit-panel ${className}`}><div className="cockpit-panel-title"><span />{title}<i /></div>{children}</section>;
}

export default function CompetitionCockpit() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  useEffect(() => { const timer = window.setInterval(() => setTime(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  const clock = time.toLocaleString("sv-SE").replace("T", " ");

  return <main className="competition-cockpit">
    <div className="cockpit-grid" aria-hidden="true" />
    <header className="cockpit-header">
      <button onClick={() => navigate("/admin/competitions")} className="cockpit-back"><ArrowLeft />返回首页</button>
      <h1>2023年上海职工职业技能系列竞赛-云计算竞赛</h1>
      <time>{clock}</time>
    </header>

    <div className="cockpit-body">
      <section className="cockpit-intro">
        <div className="cockpit-tabs"><b>当前赛事</b><span>初赛数据</span></div>
        <CyberPanel title="赛事项目介绍">
          <p>云计算技术作为当前信息技术领域的核心驱动力之一，对于上海数字化转型升级具有重要意义。通过推广云计算技术，可以有效提升企业数据处理效率、降低运营成本，并为企业创新提供强大的技术支持。云计算应用场景的创新也是推动产业发展的重要途径，可以催生出更多新业态、新模式。</p>
        </CyberPanel>
      </section>

      <section className="cockpit-kpis">
        {[["4534", "初赛参加人数"], ["65", "初赛参加公司"], ["252", "复赛参加人数"], ["36", "复赛参加公司"]].map(([value, label]) => <div className="cockpit-kpi" key={label}><strong>{value}<small>{label.includes("人数") ? "人" : "个"}</small></strong><span>{label}</span></div>)}
      </section>

      <section className="cockpit-left">
        <div className="cockpit-timers">
          <div><h2>考试倒计时</h2><p><span>已</span><span>结</span><span>束</span></p></div>
          <div><h2>考试持续时长</h2><p><span>已</span><span>结</span><span>束</span></p></div>
        </div>
        <CyberPanel title="复赛实时排名情况" className="cockpit-ranking">
          <div className="cockpit-podium">
            {[["5454", "王海英", "北京某互联科技有限公司", "gold"], ["5454", "周校民", "北京某教育科技有限公司", "violet"], ["5454", "郑子墨", "北京博睿汇志咨询顾问有限公司", "blue"]].map(([score, name, company, tone], index) => <article key={name} className={`podium-card ${tone}`}><b>{score}<small>分</small></b><em>No.{index + 1}</em><h3>{name}</h3><p>{company}</p></article>)}
          </div>
          <div className="cockpit-table ranking-table"><div className="cockpit-tr"><b>排名</b><b>姓名</b><b>单位</b><b>最终得分</b></div>{ranking.map(row => <div className="cockpit-tr" key={row[0]}>{row.map((cell, i) => <span key={i}>{cell}</span>)}</div>)}</div>
        </CyberPanel>
      </section>

      <section className="cockpit-score-panel">
        <section className="candidate-detail-module">
          <div className="cockpit-panel-title"><span />考生得分点判定<i /></div>
          <div className="cockpit-candidate">
          <img src={`${import.meta.env.BASE_URL}images/competition-cockpit-candidate.png`} alt="参赛选手范大" />
          <div className="candidate-copy"><h2>范大 <strong>45082</strong><small>分</small></h2><p>上海建工羿云科技有限公司</p><div className="candidate-metrics"><span>计算成本 <b>0</b></span><span>存储成本 <b>0</b></span><span>网络成本 <b>0</b></span><span>安全性扣分 <b>0</b></span><span>业务处理 <b>45082</b></span></div></div>
          <div className="cockpit-radar"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData}><PolarGrid stroke="#456a79" /><PolarAngleAxis dataKey="subject" tick={{ fill: "#a9c4cf", fontSize: 11 }} /><RadarArea dataKey="value" stroke="#31e4ed" fill="#18cad4" fillOpacity={0.55} /></RadarChart></ResponsiveContainer></div>
          </div>
          <div className="cockpit-capabilities">{capabilityItems.map(([Icon, label]) => <div key={label}><Icon /><span>{label}</span></div>)}</div>
        </section>
        <div className="cockpit-table score-table"><div className="cockpit-tr"><b>考生姓名</b><b>业务处理</b><b>安全性扣分</b><b>网络成本</b><b>存储成本</b><b>计算成本</b><b>得分趋势</b><b>最终得分</b></div>{scoringRows.map(row => <div className="cockpit-tr" key={row[0]}>{row.map((cell, i) => <span key={i} className={i === 6 ? "trend" : i === 7 ? "final" : ""}>{i === 6 && "⬆ "}{cell}</span>)}</div>)}</div>
      </section>
    </div>
  </main>;
}
