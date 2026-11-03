import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Star, 
  Bell, 
  ArrowRight,
  Megaphone,
  Users,
  PlayCircle,
  Cpu,
  Layers,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  X,
  CheckCircle2,
  Lock,
  Terminal,
  Activity,
  AlertCircle,
  FileText,
  Trophy,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/home.css";

function HomeSectionHeading({ children, description }: { children: React.ReactNode; description: string }) {
  return <div className="home-section-heading">
    <h2>{children}</h2>
    <p className="home-section-description">{description}</p>
  </div>;
}


const CORE_FEATURES = [
  {
    id: "courses",
    title: "数字化课程",
    icon: BookOpen,
    badge: "教学资源保障",
    tagline: "新形态数字化课程体系，理论微课与实验环境一体化构建",
    description: "全面支撑教师构建“精品课程”、“金课”体系。支持交互式课件在线演练、实时教案挂载、学情数据多维追溯，打通教、学、练、评闭环。",
    highlights: ["集成 Markdown 与高级交互式教案", "支持富媒体、在线微课与在线PPT演示", "内置精品课、专业基础课多形态模板"],
    mockType: "courses",
  },
  {
    id: "practices",
    title: "最佳实践库",
    icon: Star,
    badge: "前沿产业对齐",
    tagline: "精选一线大厂与顶级高校真实生产场景，赋能深度实战",
    description: "整合当下最火热 of 行业落地项目。支持 LoRA 大模型微调演练、Dify 智能知识库搭建、全链路 DevOps 实战等，与现代产业需求无缝接轨。",
    highlights: ["囊括 DeepSeek、PyTorch、AI Agent 等核心技术", "提供详尽图文说明、源码工程与实验测试集", "每周同步更新最新前沿实践场景"],
    mockType: "practices",
  },
  {
    id: "exams",
    title: "防作弊考试",
    icon: FileText,
    badge: "评测公信防线",
    tagline: "智能实操评测系统，多重安全防线杜绝考试舞弊",
    description: "专为程序设计与实操类考核定制。具备摄像头防作弊抓图、浏览器切屏锁定监测、实操环境秒级抓图、高复原度虚拟机审计等安全屏障。",
    highlights: ["支持多摄像头、IP 锁定及浏览器限幅防作弊", "虚拟机运行状态秒级记录，防代码抄袭", "AI 智能自动评分，实操结果高精准判定"],
    mockType: "exams",
  },
  {
    id: "competitions",
    title: "高并发竞赛",
    icon: Trophy,
    badge: "万人级竞技场",
    tagline: "承载国家级/省部级数字技能大赛，万人级高并发支撑",
    description: "平台竞赛模块曾多次无故障承载万人规模的高规格赛事。具备秒级评测架构、多物理考点分布调度、大屏可视化实时多维排行榜（Leaderboard）。",
    highlights: ["支持万人高频提交，秒级容器资源拉起评测", "多维实时动态排行榜，选手排行随时追踪", "自动隔离攻击流量，护航国家级赛事公平"],
    mockType: "competitions",
  },
  {
    id: "quota",
    title: "算力调度管理",
    icon: Cpu,
    badge: "算力分配中枢",
    tagline: "异构算力精密管理调度，GPU/CPU 卡时精细配额",
    description: "为各类院校、企业租户提供弹性的算力精细化配置。管理员可按班级、学生、课程阶段，对卡时消耗、显存占用和并发卡数进行精密管控。",
    highlights: ["支持按租户、班级、项目动态配置算力配额", "GPU 资源余量、节点状态大盘实时展示", "余量自动报警与智能闲置容器回收机制"],
    mockType: "quota",
  },
  {
    id: "zero-trust",
    title: "数据安全零出域",
    icon: ShieldCheck,
    badge: "零信任数据沙箱",
    tagline: "首创数据沙箱物理隔离，数据集‘可用不可见，可算不可下’",
    description: "针对高保密性数据流通的极致防护方案。学生在沙箱内可对语料、机密数据集进行模型微调演练，但任何数据均无法复制、导出、下载，防泄漏审计。",
    highlights: ["保密文件数据物理沙箱隔离，防网络导出", "文本、命令、剪贴板多维防泄漏审计过滤", "核心机密资产可用不可见，可算不可下"],
    mockType: "zero-trust",
  }
];

const SUCCESS_CASES = [
  {
    id: "union",
    title: "全国总工会职工职业技能竞赛",
    badge: "国家级赛事",
    tagline: "31省精英职工同台竞技，系统可用性99.99%",
    image: "https://picsum.photos/seed/case1/800/500",
    color: "from-orange-500 to-red-600",
    stats: [
      { label: "覆盖省份", val: "31 个" },
      { label: "参赛职工", val: "10,000+ 人" },
      { label: "系统可用性", val: "99.99%" }
    ],
    detail: {
      overview: "作为全国职工技能竞技的最高殿堂，本届竞赛全面引入翼实训平台作为官方评测环境。大赛由全国总工会主办，聚焦新一代数据科学与智能运维技能。我们提供了全方位的算力支持与防作弊守护，确保全国赛区同步安全、公平展开。",
      metrics: [
        { label: "最高并发在线沙箱", val: "2,400+ 个" },
        { label: "实操自动化评测响应", val: "1.2 秒" },
        { label: "防作弊命令拦截审计", val: "450,000+ 次" }
      ],
      achievement: "“本次竞赛充分体现了平台在高并发、防作弊 and 自动化评测方面的硬核实力，获得了专家组和参赛选手的一致好评！” —— 大赛组委会致信感谢"
    }
  },
  {
    id: "women",
    title: "长三角女职工数字技能大赛",
    badge: "区域标杆赛事",
    tagline: "三省一市联动高频实操，沙箱平均3.5秒拉起",
    image: "https://picsum.photos/seed/case2/800/500",
    color: "from-pink-500 to-rose-600",
    stats: [
      { label: "联动省市", val: "3省1市" },
      { label: "精英选手", val: "500+ 人" },
      { label: "沙箱拉起耗时", val: "3.5 秒" }
    ],
    detail: {
      overview: "长三角女职工数字技能大赛旨在推动长三角一体化战略下数字技能巾帼英才的培养。平台在短时间内承载了高频次的 AI 实验环境拉起和评测交卷，并在比赛期间提供了毫秒级无延迟的动态大屏显示。",
      metrics: [
        { label: "沙箱平均拉起耗时", val: "3.5 秒" },
        { label: "大屏排行榜延迟", val: "0.2 秒" },
        { label: "答卷全量防雷同审查", val: "100%" }
      ],
      achievement: "“系统稳定如磐，3.5秒即时拉起开发容器的体验惊艳了全场，成功展示了长三角职工的数字风采。” —— 主办方总结词"
    }
  },
  {
    id: "edu",
    title: "教育部产学合作协同育人示范项目",
    badge: "高等教育育人示范",
    tagline: "对接100+所高校学科建设，落地50,000+学生培养",
    image: "https://picsum.photos/seed/case3/800/500",
    color: "from-amber-500 to-orange-600",
    stats: [
      { label: "合作高校", val: "100+ 所" },
      { label: "受益学生", val: "50,000+ 人" },
      { label: "落地案例项目", val: "1,200+ 个" }
    ],
    detail: {
      overview: "联合教育部产学合作协同育人机制，平台深度整合各大高校的人工智能、云计算和云原生开发方向课程。为高校师生提供企业级真实案例、标准环境以及免配置算力支持，成为产教融合、学科建设的典型案例。",
      metrics: [
        { label: "覆盖专业方向", val: "8 个" },
        { label: "教师联合教改项目", val: "150+ 个" },
        { label: "学生技能认证通过率", val: "92%" }
      ],
      achievement: "“翼实训平台的数字化课程与云沙箱技术，完美解决了我们实验课GPU环境安装难、管理难的瓶颈，是卓越工程师培养的利器。” —— 某985高校教务处长"
    }
  },
  {
    id: "unicorn",
    title: "头部大模型独角兽数据安全实操演练",
    badge: "零出域典型商业落地",
    tagline: "50TB级高价值语料物理沙箱隔离，0起敏感泄漏",
    image: "https://picsum.photos/seed/case4/800/500",
    color: "from-emerald-500 to-teal-600",
    stats: [
      { label: "安全审计数据", val: "50TB+ 敏感" },
      { label: "数据泄漏事件", val: "0 起" },
      { label: "审计指令溯源", val: "100%" }
    ],
    detail: {
      overview: "某头部大语言模型独角兽企业为确保微调训练过程中关键行业专有语料的绝对安全，采用智云首创的“数据安全零出域”零信任沙箱。学生与算法工程师可以在沙箱内完成多参数模型微调与数据加工，但所有敏感代码与高保密语料均不可流出、下载，保证资产绝对受控。",
      metrics: [
        { label: "敏感数据吞吐总量", val: "50TB+" },
        { label: "剪贴板敏感拦截数", val: "12,000+ 次" },
        { label: "水印防护覆盖率", val: "100%" }
      ],
      achievement: "“零出域沙箱极大释放了我们核心行业专有语料的安全价值，使得内部实验培训能够在严密的安全红线内高效完成。” —— 独角兽企业首席安全官"
    }
  }
];

const BUSINESS_SCENARIOS = [
  {
    id: "ai",
    title: "AI 大模型开发",
    icon: Brain,
    badge: "AI 算力中心",
    tagline: "零基础微调大语言模型，沉浸式 RAG 知识库调试沙箱",
    description: "面向生成式人工智能技术前沿，提供模型一键式部署、显卡按需挂载和超参数精细配置。学生可直观进行 LoRA 微调调试、矢量数据库挂载和 Agent 多智能体协作链路拓扑构建。",
    highlights: ["预置 DeepSeek、Llama3 等核心模型架构", "支持主流 PyTorch / CUDA 环境，一键微调", "内置智能 Agent 工作流图论拓扑调试器"],
    mockType: "ai"
  },
  {
    id: "cloud",
    title: "云计算虚拟化",
    icon: Layers,
    badge: "云原生工程实训",
    tagline: "异构物理资源动态调度，一键拉起 k8s 集群与高性能虚拟机",
    description: "全面对齐产业主流云原生开发。支持 Docker 容器秒级分配、多节点 Kubernetes 容器集群编排实践、物理主机 IP 隔离与分布式 Ceph 存储资源动态调配实验。",
    highlights: ["秒级拉起专属 Kubernetes 实验集群", "提供丰富 CentOS/Ubuntu 原生镜像与虚拟网卡", "支持高并发负载均衡与故障容器自动恢复测试"],
    mockType: "cloud"
  },
  {
    id: "security",
    title: "安全运维审计",
    icon: ShieldCheck,
    badge: "零信任数字盾牌",
    tagline: "堡垒机全网日志稽查，机密数据集‘可用不可见，可算不可下’",
    description: "致力于培养卓越的信息安全与网络防御工程师。内置零信任堡垒机沙箱，支持敏感网络协议阻断测试、SQL注入攻防演练以及高价值数据集防数据出域外泄的安全零审计隔离验证。",
    highlights: ["机密数据集物理沙箱物理级隔离防护", "堡垒机级指令命令/剪贴板全量拦截过滤", "实时高保真系统运行漏洞扫描与防火墙规则"],
    mockType: "security"
  }
];

const renderScenarioMockup = (mockType: string) => {
  switch (mockType) {
    case "ai":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between text-left font-sans">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-orange-500 font-bold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">DeepSeek-R1-Distill-7B</span>
              <span className="text-xs text-slate-500 font-mono">Tuning Loss: 0.12</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>LoRA Rank (r)</span>
                <span className="text-orange-500 font-bold font-mono">16</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[80%] h-full bg-orange-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>GPU Usage</span>
                <span className="text-emerald-400 font-bold font-mono">15.4 / 16 GB</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Epoch: 4/5 (Fine-tuning...)</span>
            <span className="text-emerald-400">✓ CUDA compilation: Success</span>
          </div>
        </div>
      );
    case "cloud":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl h-full flex flex-col justify-between text-left font-mono text-[10px] text-slate-400 leading-normal">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-sans text-xs">
            <span className="text-white font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Kubernetes Cluster Status
            </span>
            <span className="text-emerald-400 font-mono text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">HEALTHY</span>
          </div>
          <div className="space-y-1.5 overflow-hidden flex-1">
            <div className="flex items-center justify-between p-1 bg-slate-950 rounded">
              <span className="text-slate-200">pod/zhiyun-core-5f899-node1</span>
              <span className="text-emerald-400">RUNNING (CPU: 12%)</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-slate-950 rounded">
              <span className="text-slate-200">pod/zhiyun-mysql-8b71d-node2</span>
              <span className="text-emerald-400">RUNNING (RAM: 1.2G)</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-slate-950 rounded">
              <span className="text-slate-200">pod/zhiyun-sandbox-2c32a-node3</span>
              <span className="text-amber-400">INITIALIZING...</span>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-2 mt-2 flex items-center justify-between font-sans text-[9px] text-slate-500">
            <span>Nodes: compute-01, compute-02</span>
            <span>Network: Calico (VXLAN)</span>
          </div>
        </div>
      );
    case "security":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between text-left font-mono text-[10px] text-slate-400">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 font-sans text-xs">
            <span className="text-white font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              零信任堡垒机日志风控
            </span>
            <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">AUDIT ON</span>
          </div>
          <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 space-y-1.5 overflow-hidden max-h-[100px] leading-relaxed">
            <div className="text-yellow-500/80 font-bold">[SSH Alert] Root login attempted from 192.168.1.100.</div>
            <div className="text-red-400 font-bold bg-red-500/10 px-1 py-0.5 rounded border border-red-500/10">
              [Firewall Blocked] SCP outbound to external-server.com.
            </div>
            <div className="text-slate-600">[System Log] Outbound network channel blocked successfully.</div>
          </div>
          <div className="text-[9px] text-slate-500 text-center font-sans mt-2 pt-2 border-t border-slate-800/80">
            ✓ 敏感命令审计率: 100% · 数据零出域泄流拦截激活
          </div>
        </div>
      );
    default:
      return null;
  }
};

const renderFeatureMockup = (mockType: string) => {
  switch (mockType) {
    case "courses":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between font-sans">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs text-slate-500 font-mono break-all">zhiyun_course_syllabus.json</span>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">ACTIVE</span>
          </div>
          <div className="space-y-3 flex-1 text-left text-sm text-slate-300">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="font-bold text-slate-100 flex items-center gap-2 mb-1">
                <span className="text-orange-500">第一章:</span> 人工智能训练师基础
              </div>
              <div className="text-xs text-slate-500 pl-4">集成3门在线实验 · 包含4个视频课件</div>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-900">
              <div className="font-bold text-slate-400 flex items-center gap-2 mb-1">
                <span className="text-slate-600">第二章:</span> 深度神经网络实战
              </div>
              <div className="text-xs text-slate-600 pl-4">待发布课程章节</div>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-800 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">课程总学时:</span>
              <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">32 小时</span>
            </div>
            <span className="text-xs text-orange-500 font-bold">交互式课件已就绪</span>
          </div>
        </div>
      );
    case "practices":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between text-left font-sans">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-orange-500 font-bold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">大模型微调演练</span>
              <span className="text-xs text-slate-500 font-mono">V100 算力挂载</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">LoRA 参数高效微调实践</h4>
            <p className="text-xs text-slate-400 leading-relaxed">采用企业级行业专有语料集，演示对 DeepSeek-R1-Distill 进行 LoRA 架构轻量化微调，零基础掌握核心参数调节。</p>
          </div>
          
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 space-y-2.5 my-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Learning Rate (学习率)</span>
              <span className="text-orange-500 font-mono font-bold">2e-4</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-orange-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Epochs (微调轮数)</span>
              <span className="text-orange-500 font-mono font-bold">3 / 5</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Loss: 0.124</span>
            <span>显存占用: 14.8GB / 16GB</span>
          </div>
        </div>
      );
    case "exams":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between text-left font-sans relative overflow-hidden">
          {/* Watermark layer */}
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex flex-wrap gap-4 items-center justify-center text-xs text-white uppercase font-mono rotate-12">
            <div>ZHIYUN SECURE EXAM</div>
            <div>STUDENT ID: 20261014</div>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-white tracking-wide">防作弊实操评测系统</span>
            </div>
            <span className="text-[11px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">SECURE ACTIVE</span>
          </div>
          <div className="flex-1 flex gap-4 my-2 relative z-10">
            {/* Cam view mockup */}
            <div className="w-24 h-24 bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 px-1 py-0.5 rounded text-[8px] text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span> LIVE
              </div>
              <Users className="w-8 h-8 text-slate-600 mb-1" />
              <span className="text-[9px] text-slate-500 font-mono">学生摄像头</span>
            </div>
            {/* Sec Info */}
            <div className="flex-1 flex flex-col justify-center space-y-1.5">
              <div className="text-xs flex items-center justify-between">
                <span className="text-slate-500">倒计时:</span>
                <span className="text-white font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">01:45:20</span>
              </div>
              <div className="text-xs flex items-center justify-between">
                <span className="text-emerald-400 font-bold">0 / 3 次 (正常)</span>
              </div>
              <div className="text-xs flex items-center justify-between">
                <span className="text-slate-500">实操截取审查:</span>
                <span className="text-slate-400 font-mono text-[10px]">active_frame_42.png</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-500 font-mono text-center relative z-10">
            ✓ 虚拟机终端审计服务运行正常
          </div>
        </div>
      );
    case "competitions":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl h-full flex flex-col justify-between text-left font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              竞赛多维实时排行榜
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">LIVE UPDATE</span>
          </div>
          <div className="flex-1 space-y-1.5 my-2">
            {/* Rank Rows */}
            <div className="flex items-center justify-between p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs">
              <div className="flex items-center gap-3">
                <span className="font-black text-amber-500 w-4 text-center">1</span>
                <span className="font-bold text-white">浙江代表队</span>
              </div>
              <span className="font-mono text-amber-400 font-bold">985.42 pts</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg text-xs border border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-400 w-4 text-center">2</span>
                <span className="font-medium text-slate-300">江苏代表队</span>
              </div>
              <span className="font-mono text-slate-400 font-bold">962.10 pts</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg text-xs border border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-500 w-4 text-center">3</span>
                <span className="font-medium text-slate-300">上海代表队</span>
              </div>
              <span className="font-mono text-slate-500 font-bold">940.85 pts</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-600 text-center font-mono">
            系统并发处理速度: 450次提交/秒
          </div>
        </div>
      );
    case "quota":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between text-left font-sans">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-orange-500" />
                算力资源调度监控
              </span>
              <span className="text-xs text-orange-500 font-bold font-mono">GPU ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">支持对租户及算力卡时的细粒度按需分配与监控。</p>
          </div>
          
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {/* progress bar 1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">NVIDIA V100 GPU 算力卡时使用率</span>
                <span className="text-white font-mono font-bold">82.5%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[82.5%] h-full bg-gradient-to-r from-orange-400 to-[#fa541c] rounded-full"></div>
              </div>
            </div>
            {/* progress bar 2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">NVIDIA A100 GPU 算力卡时使用率</span>
                <span className="text-white font-mono font-bold">45.2%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[45.2%] h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3 mt-3">
            <span>在线挂载节点: 48 个</span>
            <span>回收挂载闲置容器: 5 个/时</span>
          </div>
        </div>
      );
    case "zero-trust":
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl h-full flex flex-col justify-between text-left font-sans relative overflow-hidden">
          {/* Watermark overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex flex-wrap gap-3 items-center justify-center text-[10px] text-orange-500 font-mono rotate-12">
            <div>DATA SECURE ZERO EXPORT</div>
            <div>AUDIT ENABLED</div>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">机密数据集零出域数据沙箱</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SECURED</span>
          </div>
          
          <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-2 my-2 relative z-10 leading-relaxed overflow-hidden max-h-[110px]">
            <div className="text-yellow-500/80 font-bold">[Security Notice] Private Dataset Loaded. Outbound channels disabled.</div>
            <div>$ scp model_weights.pt zhiyun-user@external-server.com:/tmp</div>
            <div className="text-red-400 font-bold bg-red-500/10 px-1 py-0.5 rounded border border-red-500/10 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              [Block Alert] command scp blocked. Outbound network violation.
            </div>
            <div className="text-slate-600">[Audit Logs] Outbound violation logged for student ID: 20261014.</div>
          </div>
          
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-500 text-center relative z-10">
            ✓ 数据可用不可见，可算不可下，审计全覆盖
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scenarios = ["人工智能", "网络仿真"];
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [activeFeature, setActiveFeature] = useState("courses");
  const [activeScenarioId, setActiveScenarioId] = useState("ai");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const slides = [
    {
      title: "",
      subtitle: "",
      image: "/images/banner2-yi.png",
      isStaticImage: true,
      link: "/user/courses"
    },
    {
      title: "掌握前沿 AI 技术",
      subtitle: "从理论基础到工程落地，全面提升 AI 核心竞争力",
      image: "/images/banner1.jpg",
      isStaticImage: false,
      badge: "全新版本发布"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const courses = [
      { title: "Python 核心编程", intro: "零基础掌握 Python，开启编程之路", image: "https://picsum.photos/seed/c1/600/400", tags: ["基础", "编程"] },
      { title: "机器学习实战", intro: "深入浅出核心算法与应用场景", image: "https://picsum.photos/seed/c2/600/400", tags: ["AI", "算法"] },
      { title: "深度学习进阶", intro: "神经网络模型原理与 PyTorch 实践", image: "https://picsum.photos/seed/c3/600/400", tags: ["进阶", "模型"] },
      { title: "自然语言处理 (NLP)", intro: "探索文本分析与大语言模型技术", image: "https://picsum.photos/seed/c4/600/400", tags: ["NLP", "前沿"] },
      { title: "计算机视觉 (CV)", intro: "图像处理、目标检测与识别技术", image: "https://picsum.photos/seed/c5/600/400", tags: ["CV", "实战"] }
    ];
  
    const announcements = [
      { date: "2025-03-18", title: "平台系统架构升级与维护通知", icon: Bell, isNew: true },
      { date: "2025-03-15", title: "AI 能力中心全新上线，支持异构算力调度", icon: Megaphone, isNew: true },
      { date: "2025-03-10", title: "新增 50 门前沿 AI 与云原生实战课程", icon: Bell, isNew: false }
    ];
  
    return (
      <div className="home-page flex flex-col min-h-full font-sans selection:bg-orange-100 selection:text-orange-900">
        
        {/* Hero Section - Light Luxury Style */}
        <div className="relative w-full aspect-[1024/346] min-h-[300px] md:min-h-[250px] max-h-[580px] overflow-hidden bg-[#fff5eb]">
          {slides.map((slide, index) => {
            const isCurrent = index === currentSlide;
            
            if (slide.isStaticImage) {
              return (
                <Link
                  key={index}
                  to={slide.link || "/user/courses"}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out block cursor-pointer",
                    isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${slide.image}`} 
                    alt="翼实训平台 · 智联云端，实践未来"
                    className="w-full h-full object-cover object-left md:object-center transition-all duration-500"
                  />
                </Link>
              );
            }

            return (
              <div 
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                  isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              >
                <img 
                  src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${slide.image}`} 
                  alt={slide.title} 
                  className="w-full h-full object-cover object-right md:object-center transition-all duration-500"
                />
                {/* Elegant Light Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#fff5eb]/90 via-[#fff5eb]/65 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col justify-center px-14 md:px-24 pb-8 md:pb-0 max-w-5xl">
                  {slide.badge && (
                    <div className="overflow-hidden mb-4 animate-fade-in-up">
                      <span className="inline-block py-1 px-3 rounded-full bg-[#fff2e8] border border-[#ffbb96] text-[#fa541c] text-sm font-medium tracking-wide">
                        {slide.badge}
                      </span>
                    </div>
                  )}
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4 leading-[1.15] animate-fade-in-up animation-delay-100">
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-xl text-slate-600 font-light max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
                    {slide.subtitle}
                  </p>
                  <div className="mt-6 flex items-center gap-3 animate-fade-in-up animation-delay-300">
                    <Link to="/user/ai/assistant" className="h-12 px-6 sm:h-14 sm:px-8 inline-flex items-center justify-center rounded-full brand-gradient-button text-white text-sm sm:text-base font-medium hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                      开始学习 <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Link>
                    <Link to="/login" className="h-12 px-6 sm:h-14 sm:px-8 inline-flex items-center justify-center rounded-full bg-white text-slate-900 text-sm sm:text-base font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                      了解更多
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Centered indicators and arrows on either side of the banner. */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`切换到第 ${index + 1} 张轮播图`}
                aria-current={index === currentSlide ? "true" : undefined}
                onClick={() => setCurrentSlide(index)}
                className="flex h-6 items-center justify-center"
              >
                <span className={cn(
                  "block h-1.5 rounded-full transition-all duration-500",
                  index === currentSlide ? "w-12 bg-slate-900" : "w-4 bg-slate-900/20 hover:bg-slate-900/40"
                )} />
              </button>
            ))}
          </div>
          <button
            aria-label="上一张轮播图"
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 size-9 md:size-12 rounded-full bg-white/60 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            aria-label="下一张轮播图"
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 size-9 md:size-12 rounded-full bg-white/60 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
  
        {/* Main Content Area */}
        <div className="w-full px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto py-10 md:py-12 lg:py-16 space-y-12 lg:space-y-16">
          
          {/* Course Browsing */}
          <section id="featured-courses" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">精选课程</h3>
                <p className="text-slate-500 text-base font-light leading-relaxed">系统化学习路径，从理论基础到核心技术</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
                 {scenarios.map(scenario => (
                   <button
                     key={scenario}
                     onClick={() => setActiveScenario(scenario)}
                     className={cn(
                       "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap",
                       activeScenario === scenario 
                         ? "brand-gradient-button text-white shadow-sm"
                         : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                     )}
                   >
                     {scenario}
                   </button>
                 ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {courses.slice(0, 4).map((course, i) => (
                <Link to="/user/courses" state={{ showDetail: true }} key={i} className="group block bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <PlayCircle className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {course.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-xs font-medium text-slate-700 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#fa541c] transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {course.intro}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
  
          {/* ==================== 1. 实训平台功能展示 ==================== */}
          <section id="platform-showcase" className="scroll-mt-24 bg-white rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100/80">
            <div className="max-w-3xl mb-6 md:mb-8 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                实训平台核心功能展示
              </h3>
              <p className="text-slate-500 text-base font-light leading-relaxed">
                全方位支撑新形态数字化实训，提供从课程制作、最佳实践、防作弊考试、竞技比赛到算力调度与安全隔离的一体化闭环保障。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
              {/* Left Selector List - 5 cols */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                {CORE_FEATURES.map((feat) => {
                  const isSelected = activeFeature === feat.id;
                  const Icon = feat.icon;
                  return (
                    <button
                      key={feat.id}
                      onClick={() => setActiveFeature(feat.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center gap-4 text-left border transition-all duration-300 group hover:-translate-y-0.5",
                        isSelected
                          ? "bg-[#fff2e8]/40 border-[#ffbb96]/60 shadow-sm"
                          : "bg-white border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center transition-colors flex-shrink-0",
                          isSelected
                            ? "brand-gradient-button text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700"
                        )}
                      >
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "font-bold text-sm tracking-wide transition-colors",
                            isSelected ? "text-[#fa541c]" : "text-slate-800"
                          )}
                        >
                          {feat.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate font-light">
                          {feat.tagline}
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-slate-400 transition-all",
                          isSelected ? "text-[#fa541c] translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Showcase Card - 7 cols */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-3xl p-5 sm:p-6 text-white relative overflow-hidden shadow-2xl border border-slate-800">
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#fa541c]/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3"></div>

                {CORE_FEATURES.map((feat) => {
                  if (feat.id !== activeFeature) return null;
                  return (
                    <div key={feat.id} className="h-full flex flex-col justify-between gap-6 animate-in fade-in duration-500 relative z-10 flex-1">
                      <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-orange-400 border border-white/5 uppercase tracking-wider">
                            {feat.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">ZHIYUN ENGINE V2.0</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white tracking-wide">
                          {feat.title} <span className="text-sm font-light text-slate-400 block mt-1">{feat.tagline}</span>
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                          {feat.description}
                        </p>
                      </div>

                      {/* Mock UI Rendering based on mockType */}
                      <div className="min-h-[210px] flex-shrink-0 [&>div]:h-auto [&>div]:min-h-[210px]">
                        {renderFeatureMockup(feat.mockType)}
                      </div>

                      {/* Bottom highlights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left pt-4 border-t border-slate-800/80">
                        {feat.highlights.map((high, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-slate-300 font-light">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{high}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ==================== 2. 成功案例展示 ==================== */}
          <section id="success-stories" className="home-section scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4 text-left">
              <HomeSectionHeading description="从高校课堂到全国赛场，让技术实力在真实挑战中绽放。">值得信赖的<span>成功案例</span></HomeSectionHeading>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 border border-slate-200 rounded-full px-4 py-2 bg-white flex-shrink-0 self-start md:self-auto shadow-sm">
                <Award className="w-4 h-4 text-amber-500" /> 国家权威赛事官方支持商
              </div>
            </div>

            {/* Grid layout - 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-left">
              {SUCCESS_CASES.map((item) => (
                <div
                  key={item.id}
                  className="home-case-card group"
                >
                  {/* Visual Top section */}
                  <div className="home-case-image relative overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors duration-500"></div>
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1.5 border border-white/10">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>

                    {/* Numeric stats section */}
                    <div className="grid grid-cols-3 gap-2 p-3 mt-4 mb-4 bg-slate-50/50 rounded-2xl">
                      {item.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="text-center px-1">
                          <div className="text-base lg:text-xl font-black text-slate-800 tracking-tight">
                            {stat.val}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 truncate">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => setSelectedCase(item)}
                      className="home-action home-case-action brand-gradient-button"
                    >
                      <span>查看案例详情 <ArrowRight className="w-4 h-4" /></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ==================== 业务场景展示模块 ==================== */}
          <section id="business-scenarios" className="scroll-mt-24 bg-white rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100/80">
            <div className="max-w-3xl mb-6 md:mb-8 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                实训平台业务场景展示
              </h3>
              <p className="text-slate-500 text-base font-light leading-relaxed">
                深度覆盖人工智能开发、云计算编排虚拟化和零信任安全运维审计三大业务场景，与企业真实生产无缝对接。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
              {/* Left Selector List - 5 cols */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                {BUSINESS_SCENARIOS.map((feat) => {
                  const isSelected = activeScenarioId === feat.id;
                  const Icon = feat.icon;
                  return (
                    <button
                      key={feat.id}
                      onClick={() => setActiveScenarioId(feat.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center gap-4 text-left border transition-all duration-300 group hover:-translate-y-0.5 cursor-pointer",
                        isSelected
                          ? "bg-[#fff2e8]/40 border-[#ffbb96]/60 shadow-sm"
                          : "bg-white border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center transition-colors flex-shrink-0",
                          isSelected
                            ? "brand-gradient-button text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700"
                        )}
                      >
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "font-bold text-sm tracking-wide transition-colors",
                            isSelected ? "text-[#fa541c]" : "text-slate-800"
                          )}
                        >
                          {feat.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate font-light">
                          {feat.tagline}
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-slate-400 transition-all",
                           isSelected ? "text-[#fa541c] translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Showcase Card - 7 cols */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-3xl p-5 sm:p-6 text-white relative overflow-hidden shadow-2xl border border-slate-800">
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#fa541c]/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3"></div>

                {BUSINESS_SCENARIOS.map((feat) => {
                  if (feat.id !== activeScenarioId) return null;
                  return (
                    <div key={feat.id} className="h-full flex flex-col justify-between gap-6 animate-in fade-in duration-500 relative z-10 flex-1">
                      <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between gap-4">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-orange-400 border border-white/5 uppercase tracking-wider">
                            {feat.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">ZHIYUN ENGINE V2.0</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white tracking-wide">
                          {feat.title} <span className="text-sm font-light text-slate-400 block mt-1">{feat.tagline}</span>
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                          {feat.description}
                        </p>
                      </div>

                      {/* Mock UI Rendering based on mockType */}
                      <div className="min-h-[180px] flex-shrink-0 [&>div]:h-auto [&>div]:min-h-[180px]">
                        {renderScenarioMockup(feat.mockType)}
                      </div>

                      {/* Bottom highlights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left pt-4 border-t border-slate-800/80">
                        {feat.highlights.map((high, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-slate-300 font-light">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{high}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ==================== 3. 成功案例交互弹窗 (Details Dialog) ==================== */}
          {selectedCase && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div 
                className="bg-white shadow-2xl rounded-3xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto flex flex-col border border-slate-100 animate-in slide-in-from-bottom-8 duration-300 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header image banner inside Modal */}
                <div className="relative aspect-[21/9] overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={selectedCase.image}
                    alt={selectedCase.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Close btn */}
                  <button 
                    onClick={() => setSelectedCase(null)}
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all z-20 border border-white/15"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="px-2.5 py-1 bg-[#fa541c] rounded-md text-[10px] font-bold text-white tracking-wide uppercase border border-orange-400/20 mb-2 inline-block">
                      {selectedCase.badge}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                      {selectedCase.title}
                    </h2>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
                  {/* Overview */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-[#fa541c] rounded-full inline-block"></span>
                      项目概况 / OVERVIEW
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {selectedCase.detail.overview}
                    </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-[#fa541c] rounded-full inline-block"></span>
                      核心技术指标 / METRICS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedCase.detail.metrics.map((metric: any, mIdx: number) => (
                        <div key={mIdx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                          <div className="text-lg font-black text-slate-800 tracking-tight">
                            {metric.val}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 truncate">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial / Impact */}
                  <div className="bg-orange-500/[0.04] border border-[#ffbb96]/30 rounded-2xl p-5 relative overflow-hidden">
                    {/* Decorative quote icon */}
                    <div className="absolute right-4 bottom-2 opacity-5 text-8xl font-serif text-[#fa541c] pointer-events-none select-none">
                      ”
                    </div>
                    <div className="relative z-10 flex gap-3 items-start">
                      <Award className="w-5 h-5 text-[#fa541c] flex-shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-[#fa541c] leading-relaxed font-medium italic">
                        {selectedCase.detail.achievement}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-6 border-t border-slate-100 flex justify-end flex-shrink-0">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="h-10 px-6 rounded-xl brand-gradient-button text-white text-xs font-semibold tracking-wide transition-colors"
                  >
                    关闭窗口
                  </button>
                </div>
              </div>
            </div>
          )}
  
          {/* Bottom Section: Announcements & Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            
            {/* Announcements */}
            <section className="lg:col-span-1 bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">平台公告</h3>
                <Link to="/user/center/messages" className="text-sm text-[#fa541c] font-medium hover:text-[#e84a15] transition-colors">
                  全部
                </Link>
              </div>
              <div className="space-y-5">
                {announcements.map((announcement, i) => (
                  <Link to="/user/center/messages" key={i} className="group flex gap-4 items-start">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors", announcement.isNew ? "bg-rose-50 text-rose-500 group-hover:bg-rose-100" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100")}>
                    <announcement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-slate-900 group-hover:text-[#fa541c] transition-colors line-clamp-2 mb-1">
                      {announcement.title}
                    </h4>
                    <span className="text-sm text-slate-400 font-mono">{announcement.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Platform Data */}
          <section
            id="platform-data"
            className="home-platform-data lg:col-span-2 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-[0_12px_36px_-16px_rgba(255,119,36,0.22)] border border-orange-100 relative isolate overflow-hidden flex flex-col justify-center"
          >
            <img
              aria-hidden="true"
              alt=""
              src={`${import.meta.env.BASE_URL}images/home-platform-data-tech-v2.webp`}
              className="home-platform-data-art"
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                    <span aria-hidden="true" className="h-6 w-1 rounded-full bg-[#fa541c]" />
                    平台运行数据
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base font-light">持续为您提供稳定、高效的实训环境</p>
                </div>
                <div aria-hidden="true" className="hidden sm:flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-[#fa541c]">
                  <Activity className="size-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {[
                  { value: "1,234", label: "精品课程" },
                  { value: "5,678", label: "实战项目" },
                  { value: "98k+", label: "注册用户" },
                  { value: "1,234", label: "当前在线", online: true },
                ].map((metric) => (
                  <div key={metric.label} className="min-w-0 rounded-2xl border border-white bg-white/90 px-3 py-5 text-center shadow-[0_6px_20px_rgba(255,143,51,0.08)]">
                    <div className={cn("text-3xl xl:text-4xl font-bold tracking-tight tabular-nums mb-3", metric.online ? "text-emerald-600" : "text-[#ef5015]")}>
                      {metric.value}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                      {metric.online && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.3)]" />}
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
