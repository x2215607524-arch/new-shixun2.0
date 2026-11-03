import React, { useState } from "react";
import { 
  Code, Trophy, Database, Brain, CheckSquare, Users, BookOpen, FileText,
  Search, Shield, Activity, Cpu, CheckCircle, AlertTriangle, ArrowRight, 
  Settings, Play, Terminal, Plus, Trash2, Send, Sparkles, Sliders, 
  HelpCircle, RefreshCw, BarChart2, Check, ExternalLink, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data & Templates ---

const codeTemplates: Record<string, { code: string; language: string }> = {
  Python: {
    language: "Python",
    code: `def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)\n\n# Test call\nprint(calculate_average([10, 20, 30, 40]))`
  },
  Java: {
    language: "Java",
    code: `public class Solution {\n    public static double getAverage(int[] numbers) {\n        int sum = 0;\n        for (int num : numbers) {\n            sum += num;\n        }\n        return (double) sum / numbers.length;\n    }\n}`
  },
  JavaScript: {
    language: "JavaScript",
    code: `function calculateAverage(numbers) {\n    const sum = numbers.reduce((acc, curr) => acc + curr, 0);\n    return sum / numbers.length;\n}`
  },
  Go: {
    language: "Go",
    code: `package main\n\nfunc calculateAverage(numbers []float64) float64 {\n    sum := 0.0\n    for _, num := range numbers {\n        sum += num\n    }\n    return sum / float64(len(numbers))\n}`
  },
  SQL: {
    language: "SQL",
    code: `SELECT department_id, AVG(salary) as average_salary\nFROM employees\nGROUP BY department_id\nHAVING AVG(salary) > 5000;`
  }
};

const defaultAgents = [
  { id: "agt-001", name: "大语言模型出题管家", version: "v1.4", status: "运行中", calls: "14.2k", score: "4.8", release: "全量发布", model: "DeepSeek-R1", kb: "智云公共教学知识库", prompt: "你是一位资深的高校计算机教师，擅长根据指定知识点和难度生成题目..." },
  { id: "agt-002", name: "SQL 语法自动答疑大师", version: "v2.1", status: "运行中", calls: "28.5k", score: "4.9", release: "灰度发布", model: "Llama-3-70B", kb: "数据库系统概论大纲", prompt: "你专门解答数据库系统设计中的SQL编写问题，采用三步法教学模式解答..." },
  { id: "agt-003", name: "学术论文结构审稿助理", version: "v0.9", status: "测试中", calls: "1.8k", score: "4.5", release: "局部灰度", model: "ChatCompletions API", kb: "学术规范与写作规范库", prompt: "你是一名严格的学术期刊审稿人，协助学生挑出论文格式及论述漏洞..." }
];

export default function AdminAICenterPage() {
  const [activeMenu, setActiveMenu] = useState<"code" | "eval" | "rag" | "question" | "grading" | "agent" | "practice" | "courseware">("code");

  // Code Assistant States
  const [selectedLang, setSelectedLang] = useState("Python");
  const [codeContent, setCodeContent] = useState(codeTemplates.Python.code);
  const [codeTerminalLog, setCodeTerminalLog] = useState<string | null>(null);
  const [isTerminalLoading, setIsTerminalLoading] = useState(false);

  // RAG States
  const [ragQueries, setRagQueries] = useState<string>("");
  const [isRagSearching, setIsRagSearching] = useState(false);
  const [ragResult, setRagResult] = useState<any | null>(null);
  const [ragFiles, setRagFiles] = useState<string[]>([
    "大模型LoRA微调大纲-北京大学.pdf",
    "云原生微服务开发实训手册-清华大学.docx",
    "计算机网络教学实践说明书.md"
  ]);
  const [newRagFile, setNewRagFile] = useState("");

  // Question Assistant States
  const [qTopic, setQTopic] = useState("深度学习中的反向传播算法");
  const [qType, setQType] = useState("单选题");
  const [qDifficulty, setQDifficulty] = useState("中级");
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<any | null>(null);

  // Evaluation States
  const [showEvalReport, setShowEvalReport] = useState(false);

  // Grading States
  const [gradeAccuracy, setGradeAccuracy] = useState(60);
  const [gradeFormat, setGradeFormat] = useState(20);
  const [gradePerformance, setGradePerformance] = useState(20);
  const [gradingLogs, setGradingLogs] = useState<string[]>([]);
  const [isGrading, setIsGrading] = useState(false);

  // Agent States
  const [agents, setAgents] = useState(defaultAgents);
  const [selectedAgent, setSelectedAgent] = useState(defaultAgents[0]);
  const [agentChatInput, setAgentChatInput] = useState("");
  const [agentChatHistory, setAgentChatHistory] = useState<any[]>([
    { sender: "assistant", text: "你好！我是你的大语言模型出题管家，我已经关联了《智云公共教学知识库》，随时可以协助你进行教学题目生成、难度微调及大纲导出！" }
  ]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Courseware Assistant States
  const [coursewareTitle, setCoursewareTitle] = useState("大模型检索增强生成 (RAG) 核心技术");
  const [isGeneratingCourseware, setIsGeneratingCourseware] = useState(false);
  const [generatedCourseware, setGeneratedCourseware] = useState<any | null>(null);

  // --- Handlers ---

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCodeContent(codeTemplates[lang]?.code || "");
    setCodeTerminalLog(null);
  };

  const handleCodeAction = (actionType: "explain" | "complete" | "refactor" | "bug") => {
    setIsTerminalLoading(true);
    setCodeTerminalLog(null);
    setTimeout(() => {
      setIsTerminalLoading(false);
      if (actionType === "explain") {
        setCodeTerminalLog(
          `[AI 逐行逻辑解释] (${selectedLang})\n--------------------------------------------------\n` +
          `第 1 行: 定义了一个名为 calculate_average 的函数，它接收一个参数 numbers（表示数值序列）。\n` +
          `第 2 行: 初始化局部累加器 total = 0。\n` +
          `第 3-4 行: 开启 for 循环遍历 numbers，逐个将数值累加至 total 变量中。\n` +
          `第 5 行: 计算并返回 total 除以 numbers 长度的商（即平均值）。\n` +
          `第 7-8 行: 样例调用该函数，传入列表 [10, 20, 30, 40] 并打印输出 25.0。\n` +
          `--------------------------------------------------\n评估结果: 代码逻辑清晰，时间复杂度为 O(N)，属于优秀实践。`
        );
      } else if (actionType === "complete") {
        setCodeTerminalLog(
          `[AI 智能补全预测] (${selectedLang})\n--------------------------------------------------\n` +
          `# 补全建议：为该方法添加类型提示 (Type Hinting) 及异常边界保护 (预防空数组除零错误):\n\n` +
          `def calculate_average(numbers: list[float]) -> float:\n` +
          `    if not numbers:\n` +
          `        return 0.0\n` +
          `    total = float(sum(numbers))\n` +
          `    return total / len(numbers)\n\n` +
          `# 补全完成，代码已健壮化。`
        );
      } else if (actionType === "refactor") {
        setCodeTerminalLog(
          `[AI 代码重构建议] (${selectedLang})\n--------------------------------------------------\n` +
          `# 重构前:\n` +
          `# 手动循环累加，代码冗长且性能较慢。\n\n` +
          `# 重构后 (Pythonic 精简方式):\n` +
          `def calculate_average(numbers):\n` +
          `    return sum(numbers) / len(numbers) if numbers else 0.0\n\n` +
          `--------------------------------------------------\n重构优势: 充分利用 Python C 语言底层的内置 sum 方法，执行效率提升 200% 以上，代码更具可读性。`
        );
      } else {
        setCodeTerminalLog(
          `[AI 潜在 Bug 检测报告] (${selectedLang})\n--------------------------------------------------\n` +
          `检测出 1 个潜在的运行时危机：\n` +
          `⚠️ 零分危机 (ZeroDivisionError)：当传入空列表 \`calculate_average([])\` 时，\`len(numbers)\` 结果为 0，程序将抛出除零错误崩溃！\n\n` +
          `修复建议：在开头增加判空拦截：\n` +
          `if len(numbers) == 0: return 0.0\n` +
          `--------------------------------------------------\n检测评分: 安全级别「中高危」，已提供修复策略。`
        );
      }
    }, 800);
  };

  const handleRagSearch = () => {
    if (!ragQueries.trim()) return;
    setIsRagSearching(true);
    setRagResult(null);
    setTimeout(() => {
      setIsRagSearching(false);
      setRagResult({
        answer: "大模型参数高效微调 (PEFT) 领域中的 LoRA (Low-Rank Adaptation) 技术是通过向预训练模型中旁路注入两个低秩分解矩阵 A 和 B，仅训练这两个低秩矩阵来实现特定领域的微调。这在保持模型表现的同时减少了 99% 的训练参数，并防止了突出的灾难性遗忘。",
        citations: [
          { file: "大模型LoRA微调大纲-北京大学.pdf", line: "第 45 行", text: "LoRA 算法核心思想是将预训练层权重改变量 ΔW 表达为低秩乘积 B*A..." },
          { file: "云原生微服务开发实训手册-清华大学.docx", line: "第 102 行", text: "在高性能GPU算力受限下，推荐采用LoRA技术进行多租户算力配额控制..." }
        ],
        dbSource: "Milvus Vector DB Cluster",
        embedding: "BGE-M3 Multilingual (384维度)",
        strategy: "混合检索 (Dense+Sparse) + BGE-Reranker-Large 重排序"
      });
    }, 1000);
  };

  const handleGenerateQuestion = () => {
    if (!qTopic.trim()) return;
    setIsGeneratingQuestion(true);
    setGeneratedQuestion(null);
    setTimeout(() => {
      setIsGeneratingQuestion(false);
      setGeneratedQuestion({
        topic: qTopic,
        type: qType,
        difficulty: qDifficulty,
        title: qType === "单选题" 
          ? "在反向传播算法（Backpropagation）中，为什么在多层感知机中会出现梯度消失现象，其数学本质是什么？"
          : "反向传播在计算输出层各节点的误差梯度时，主要基于以下哪个核心数学法则？",
        options: qType === "单选题" ? [
          "A. 随着层数加深，激活函数（如Sigmoid）的导数小于0.25，通过链式法则连乘导致浅层梯度趋近于0",
          "B. 学习率设置过大，导致权重更新越过了局部最优解",
          "C. 隐藏层节点过多，导致全连接计算中特征信息严重退化",
          "D. 偏置项 (Bias) 未正确参与累加，导致输出归零"
        ] : undefined,
        correct: qType === "单选题" ? "A" : "链式法则 (Chain Rule)",
        analysis: "反向传播的数学基石是多元复合函数的微积分链式法则。在深度网络中，由于 Sigmoid 等激活函数的导数最大仅为 0.25，在长链连乘后，浅层权重收到的梯度会以指数级衰减，引发梯度消失问题。当前最优解是使用 ReLU 激活函数（其正数部分导数恒为 1）。"
      });
    }, 1200);
  };

  const handleSimulateGrading = () => {
    setIsGrading(true);
    setGradingLogs([]);
    const logs = [
      "🔄 1. 正在检索提交包: Standard_Python_Homework.zip ...",
      "📦 2. 正在提取并核验学生源码结构，共 1 个代码文件 ...",
      "🔍 3. 正在启动 Python 静态语法树静态检测与 Pylint 评估 ...",
      "⚡ 4. 正在拉起安全沙箱环境，准备注入 10 组系统测试用例 ...",
      "🧪 5. 用例 1-5 通过 (边界测试及压力测试全部通过) ...",
      "🧪 6. 用例 6-10 通过 (算法复杂度校验 O(N) 吻合要求) ...",
      "🤖 7. 正在调用 AI 判分大脑进行代码优雅度、异常拦截性评估 ...",
      "📝 8. 系统自动判分成功！正在导出综合评分报告 ..."
    ];
    
    logs.forEach((log, idx) => {
      setTimeout(() => {
        setGradingLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) {
          setIsGrading(false);
        }
      }, (idx + 1) * 350);
    });
  };

  const handleSendAgentChat = () => {
    if (!agentChatInput.trim()) return;
    const userMsg = { sender: "user", text: agentChatInput };
    setAgentChatHistory(prev => [...prev, userMsg]);
    const currentInput = agentChatInput.toLowerCase();
    setAgentChatInput("");
    setIsAgentTyping(true);

    setTimeout(() => {
      setIsAgentTyping(false);
      let reply = "";
      if (currentInput.includes("出题") || currentInput.includes("生成")) {
        reply = `好的，我已经根据你的指令调用了配置的 **${selectedAgent.model}** 模型，并从知识库中检索到了最新的教学参考。我为你生成了一道符合要求的深度学习试题：\n\n【单选题】下列关于过拟合防范中 L2 正则化的描述正确的是？\n选项 A: 它通过将权重绝对值之和加入损失函数来实现收缩\n选项 B: 它通过将权重平方和加入损失函数来实现收缩，使得权重普遍偏小且平滑\n选项 C: 它能产生稀疏解，使得很多权重归零\n选项 D: 它必须配合 Dropout 才能起到防范过拟合的作用\n\n正确答案：B\n\n你可以随时点击“保存”将其收录到《${selectedAgent.kb}》试题库中！`;
      } else {
        reply = `收到！作为你的 **${selectedAgent.name}**，我已经读取了你的教学配置。随时可以根据你的教学提纲，提供大纲拆解、试题生成、试卷批改意见等全套大模型能力支持！`;
      }
      setAgentChatHistory(prev => [...prev, { sender: "assistant", text: reply }]);
    }, 1000);
  };

  const handleGenerateCourseware = () => {
    if (!coursewareTitle.trim()) return;
    setIsGeneratingCourseware(true);
    setGeneratedCourseware(null);
    setTimeout(() => {
      setIsGeneratingCourseware(false);
      setGeneratedCourseware({
        title: coursewareTitle,
        slides: [
          {
            slide: 1,
            title: "第一页：生成式 AI 与大模型 RAG 技术概述",
            points: [
              "背景: 大语言模型 (LLM) 面临的局限性 - 知识时效性滞后、企业内部私有数据不可见、幻觉问题严重。",
              "RAG 的定义: 检索增强生成 (Retrieval-Augmented Generation)，在生成回答前先从外部知识库检索相关信息注入 Context。",
              "核心流程: 离线文档向量化存储 → 实时语义检索 → 混合召回与重排 → 大模型整合生成输出。"
            ]
          },
          {
            slide: 2,
            title: "第二页：RAG 核心技术之向量检索与重排策略",
            points: [
              "向量表征 (Embedding): 使用 BGE/M3E 模型将半结构化课件/文档切片，转化为 384/768 维稠密特征向量。",
              "向量数据库 (Vector DB): 存储并快速索引，采用 HNSW 索引实现毫秒级的余弦相似度 (Cosine) / 欧氏距离检索。",
              "混合检索与重排序 (Hybrid + Rerank): 融合关键字 BM25 检索与向量语义检索，利用 Reranker 模型重排，SLA 响应控制在 150ms 以内。"
            ]
          },
          {
            slide: 3,
            title: "第三页：企业级多租户 RAG 架构落地与实践",
            points: [
              "多租户隔离: 平台通过租户 ID 进行底层知识库 Collection 逻辑隔离，确保数据隐私安全合规。",
              "引用溯源: 每一个 AI 生成的论断都支持向学生透明追溯到对应知识库文档的具体行数与上下文内容。",
              "开发环境对接: 翼实训平台集成在线编辑器，学生可在实验沙箱中实时修改检索策略参数进行 RAG 调优实验。"
            ]
          }
        ]
      });
    }, 1200);
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800">
      
      {/* Left Sidebar Menu */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full">
        <div className="p-5 border-b border-neutral-border shrink-0">
          <h2 className="text-lg font-bold text-neutral-title flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#fa541c]" />
            <span>AI能力中心</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: "code", title: "AI代码助手", icon: Code },
            { id: "eval", title: "AI智能评测", icon: Trophy },
            { id: "rag", title: "RAG检索增强", icon: Database },
            { id: "question", title: "出题助手", icon: Brain },
            { id: "grading", title: "判分助手", icon: CheckSquare },
            { id: "agent", title: "智能体管理", icon: Users },
            { id: "practice", title: "最佳实践库", icon: BookOpen },
            { id: "courseware", title: "课件助手", icon: FileText }
          ].map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
                  isActive 
                    ? "bg-[#fff2e8] text-[#fa541c]" 
                    : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
                )}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-8 flex flex-col min-h-0 custom-scrollbar">
        
        {/* ==================== 1. AI代码助手 ==================== */}
        {activeMenu === "code" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <Code className="w-6 h-6 text-[#fa541c]" />
                <span>AI 代码助手</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                为全网各租户的 IDE 插件与 Web 实验环境提供代码自动补全、逐行解释、智能生成、代码重构及潜在 Bug 检测能力，支持多种主流编程语言。
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex flex-wrap gap-2.5 shrink-0">
              {Object.keys(codeTemplates).map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer",
                    selectedLang === lang 
                      ? "bg-[#fa541c] text-white border-[#fa541c] shadow-xs" 
                      : "bg-white text-neutral-body border-neutral-border hover:bg-neutral-bg"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Two Column Layout: Editor & AI Terminal */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
              
              {/* Left Side: Code Editor Container */}
              <div className="bg-white rounded-xl border border-neutral-border shadow-xs overflow-hidden flex flex-col h-[420px] xl:h-auto">
                {/* Editor Header */}
                <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs font-bold text-neutral-body ml-2 font-mono">zhiyun_workspace_main.{selectedLang === "Python" ? "py" : selectedLang === "Go" ? "go" : selectedLang === "SQL" ? "sql" : "java"}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#fa541c] bg-[#fff2e8] px-2 py-0.5 rounded border border-[#ffbb96]/45">{selectedLang}</span>
                </div>

                {/* Editor Textarea with line numbers */}
                <div className="flex-1 flex font-mono bg-neutral-950 text-white p-3 overflow-y-auto custom-scrollbar">
                  <div className="text-neutral-600 text-right pr-4 select-none border-r border-neutral-800 mr-3 text-xs leading-relaxed py-1 w-8">
                    {codeContent.split('\n').map((_, i) => <div key={i}>{i+1}</div>)}
                  </div>
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed font-mono py-1 whitespace-pre custom-scrollbar"
                  />
                </div>

                {/* Editor Bottom Actions */}
                <div className="p-4 border-t border-neutral-border bg-neutral-50/50 flex flex-wrap gap-2 shrink-0">
                  <button onClick={() => handleCodeAction("complete")} className="bg-white hover:bg-neutral-100 text-neutral-title text-xs font-bold px-3 py-2 border border-neutral-border rounded-lg transition-colors cursor-pointer shadow-3xs">自动补全</button>
                  <button onClick={() => handleCodeAction("explain")} className="bg-white hover:bg-neutral-100 text-neutral-title text-xs font-bold px-3 py-2 border border-neutral-border rounded-lg transition-colors cursor-pointer shadow-3xs">解释代码</button>
                  <button onClick={() => handleCodeAction("refactor")} className="bg-white hover:bg-neutral-100 text-neutral-title text-xs font-bold px-3 py-2 border border-neutral-border rounded-lg transition-colors cursor-pointer shadow-3xs">重构优化</button>
                  <button onClick={() => handleCodeAction("bug")} className="bg-[#fff2e8] hover:bg-[#ffe8d6] text-[#fa541c] text-xs font-bold px-3.5 py-2 border border-[#ffbb96]/45 rounded-lg transition-colors cursor-pointer shadow-3xs">Bug 检测</button>
                </div>
              </div>

              {/* Right Side: AI Assistant Response Output Terminal */}
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm overflow-hidden flex flex-col h-[400px] xl:h-auto">
                <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <Terminal className="w-4 h-4 text-[#fa541c]" />
                    <span>AI 编译器辅助控制台</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">STATUS: ONLINE</span>
                </div>

                <div className="flex-1 p-5 overflow-y-auto custom-scrollbar font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {isTerminalLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-neutral-400">
                      <RefreshCw className="w-7 h-7 text-[#fa541c] animate-spin" />
                      <span>正在调用大模型处理中...</span>
                    </div>
                  ) : codeTerminalLog ? (
                    codeTerminalLog
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 gap-2.5 p-4">
                      <Sparkles className="w-8 h-8 text-neutral-600 animate-pulse" />
                      <span className="max-w-xs">请点击左侧代码编辑器下方的操作按钮，AI 助手将实时在线评估、转换并输出反馈在此控制台中。</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 2. AI智能评测 ==================== */}
        {activeMenu === "eval" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#fa541c]" />
                <span>AI 智能评测中心</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                综合性智能评测能力集。通过自动评测（客观题秒批、代码沙箱测试用例运行）与辅助评测（大模型评估主观题并提供评分建议），生成雷达图并量化知识、实践与代码质量。
              </p>
            </div>

            {/* Summary statistics grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
              {[
                { title: "知识掌握度", val: "88 / 100", label: "理论考核评级 A", color: "text-[#fa541c]" },
                { title: "实践能力度", val: "92 / 100", label: "沙箱项目表现 卓越", color: "text-emerald-500" },
                { title: "代码质量分", val: "85 / 100", label: "静态分析合格率 98%", color: "text-blue-500" },
                { title: "学习态度值", val: "95 / 100", label: "高活跃行为分析", color: "text-indigo-500" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider">{card.title}</span>
                  <div className="my-2.5">
                    <span className={cn("text-2xl font-black", card.color)}>{card.val}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-body">{card.label}</span>
                </div>
              ))}
            </div>

            {/* Radar layout and Report Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
              
              {/* Left Column: Visual Radar Chart Simulation card */}
              <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-xs flex flex-col justify-between h-[360px] lg:h-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-sm font-bold text-neutral-title flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-[#fa541c]" />
                    <span>多维度核心能力图谱 (雷达评估)</span>
                  </span>
                  <span className="text-[11px] text-neutral-caption font-medium">更新时间: 2026/05/27</span>
                </div>

                {/* SVG Radar Simulation */}
                <div className="flex-1 flex items-center justify-center p-4 relative">
                  <svg className="w-48 h-48" viewBox="0 0 100 100">
                    {/* Pentagon backgrounds */}
                    <polygon points="50,5 95,38 78,90 22,90 5,38" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    <polygon points="50,20 84,45 71,80 29,80 16,45" fill="none" stroke="#f1f5f9" strokeWidth="0.5" fillOpacity="0.3" />
                    <polygon points="50,35 73,52 64,70 36,70 27,52" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    {/* Axis Lines */}
                    <line x1="50" y1="50" x2="50" y2="5" stroke="#cbd5e1" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="95" y2="38" stroke="#cbd5e1" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="78" y2="90" stroke="#cbd5e1" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="22" y2="90" stroke="#cbd5e1" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="5" y2="38" stroke="#cbd5e1" strokeWidth="0.5" />
                    {/* Active Radar Shape (Orange) */}
                    <polygon points="50,15 88,40 70,82 32,75 12,42" fill="#fa541c" fillOpacity="0.15" stroke="#fa541c" strokeWidth="1.5" />
                    {/* Data Points */}
                    <circle cx="50" cy="15" r="2.5" fill="#fa541c" />
                    <circle cx="88" cy="40" r="2.5" fill="#fa541c" />
                    <circle cx="70" cy="82" r="2.5" fill="#fa541c" />
                    <circle cx="32" cy="75" r="2.5" fill="#fa541c" />
                    <circle cx="12" cy="42" r="2.5" fill="#fa541c" />
                  </svg>
                  
                  {/* Floating labels */}
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">知识掌握度</span>
                  <span className="absolute top-1/3 right-2 text-[10px] font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">实践操作力</span>
                  <span className="absolute bottom-4 right-12 text-[10px] font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">代码健壮度</span>
                  <span className="absolute bottom-4 left-12 text-[10px] font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">态度出勤值</span>
                  <span className="absolute top-1/3 left-2 text-[10px] font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">算法优化度</span>
                </div>

                <button 
                  onClick={() => setShowEvalReport(true)}
                  className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer text-center shadow-sm shrink-0"
                >
                  智能生成个人综合评测报告
                </button>
              </div>

              {/* Right Column: Simulated interactive evaluation reports */}
              <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-xs overflow-y-auto custom-scrollbar h-[360px] lg:h-auto flex flex-col">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-4">评测报告分析工作台</span>
                
                {showEvalReport ? (
                  <div className="space-y-4 flex-1 animate-slide-up text-xs">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle className="w-4 h-4" />
                        <span>综合评估结论：已具备初级人工智能系统架构师水平</span>
                      </div>
                      <p className="text-[11px] text-neutral-body leading-relaxed">
                        该生在“实践项目设计”和“算法运行效率”维度展现出极高天赋，Pylint 静态代码评测均分在 9.2 以上，具备极强的模块工程能力。
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>薄弱环节突破提示：</span>
                      </div>
                      <p className="text-[11px] text-neutral-body leading-relaxed">
                        “知识掌握度”指标（理论答题）中，在“神经网络梯度消失/爆炸数学推导”及“Transformer自注意力极值约束”知识点错题率较高（45%），暴露出算法底层数学基石不稳的问题。
                      </p>
                    </div>

                    <div className="border border-neutral-border rounded-xl p-4 bg-neutral-50/30 space-y-2 flex-1">
                      <span className="font-bold text-neutral-title block">教学行动指导与改进意见：</span>
                      <ol className="space-y-1.5 text-[11px] text-neutral-body pl-3.5 list-decimal font-medium leading-relaxed">
                        <li>推荐修读大模型 PEFT 微调理论课（[ LoRA 与高效适配技术 ](file:///admin/ai/courses)），补全理论空档。</li>
                        <li>针对大语言模型，重点增加 Transformer 数学导数与归一化缩放因子物理意义测验。</li>
                        <li>实践部分可继续挑战高并发微服务电商案例。</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 gap-2">
                    <Sliders className="w-8 h-8 text-neutral-300 animate-bounce" />
                    <span className="text-xs">请点击左下方的“智能生成报告”按钮，AI 评测大脑将即刻完成行为与数据拟合，并在此显示精细评测分析。</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== 3. RAG检索增强 ==================== */}
        {activeMenu === "rag" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <Database className="w-6 h-6 text-[#fa541c]" />
                <span>RAG 检索增强引擎</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                基于开源向量数据库（Milvus）与混合检索策略构建的企业级/平台级知识检索增强引擎。提供文档解析向量化、多租户隔离以及精准引用溯源服务。
              </p>
            </div>

            {/* Split screen: left documents list, right query terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Left Column: Associated PDF/Word collection */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-xs flex flex-col h-[320px] lg:h-auto">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-3">知识库知识库Collection文档库</span>
                
                {/* Upload text input simulated */}
                <div className="flex gap-2 mb-4 shrink-0">
                  <input
                    type="text"
                    placeholder="输入新文档名称以模拟上传..."
                    value={newRagFile}
                    onChange={(e) => setNewRagFile(e.target.value)}
                    className="border border-neutral-200 rounded-lg px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                  />
                  <button
                    onClick={() => {
                      if (!newRagFile.trim()) return;
                      setRagFiles([...ragFiles, newRagFile.trim()]);
                      setNewRagFile("");
                    }}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    模拟解析
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {ragFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100/60 rounded-lg border border-neutral-200/50 text-xs transition-colors font-medium">
                      <div className="flex items-center gap-2 text-neutral-title max-w-[180px] truncate">
                        <FileText className="w-3.5 h-3.5 text-[#fa541c] shrink-0" />
                        <span title={file}>{file}</span>
                      </div>
                      <button
                        onClick={() => setRagFiles(ragFiles.filter(f => f !== file))}
                        className="text-neutral-400 hover:text-red-500 font-bold px-1 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Search Query Console */}
              <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-xs shrink-0 space-y-3">
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block">混合向量语义检索调优测试器</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="例如输入：什么是大模型中的 LoRA 技术？"
                      value={ragQueries}
                      onChange={(e) => setRagQueries(e.target.value)}
                      className="border border-neutral-200 rounded-lg px-4 py-2 text-xs flex-1 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                      onKeyDown={(e) => { if (e.key === "Enter") handleRagSearch(); }}
                    />
                    <button
                      onClick={handleRagSearch}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Search className="w-4 h-4" />
                      <span>检索并重排</span>
                    </button>
                  </div>
                </div>

                {/* RAG search response card */}
                <div className="bg-neutral-900 text-white rounded-xl border border-neutral-800 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
                  <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between shrink-0">
                    <span className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#fa541c]" />
                      <span>RAG 检索增强引擎响应日志</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap">
                    {isRagSearching ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3 text-neutral-400">
                        <RefreshCw className="w-7 h-7 text-[#fa541c] animate-spin" />
                        <span>正在进行 密集向量检索 & BGE-Reranker 大模型重排中...</span>
                      </div>
                    ) : ragResult ? (
                      <div className="space-y-4">
                        <div>
                          <span className="text-[#fa541c] font-bold block mb-1">🤖 [AI 检索整合回答]</span>
                          <p className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800 text-neutral-200">{ragResult.answer}</p>
                        </div>
                        <div className="border-t border-neutral-800 my-2"></div>
                        <div>
                          <span className="text-emerald-400 font-bold block mb-1">🔗 [引用溯源 (精确追溯至物理文件段数)]</span>
                          <div className="space-y-2">
                            {ragResult.citations.map((cite: any, i: number) => (
                              <div key={i} className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                                <div className="text-[11px] font-bold text-[#fa541c] flex items-center justify-between">
                                  <span>{cite.file} ({cite.line})</span>
                                  <span className="text-neutral-500 font-normal">Relevance: 0.94</span>
                                </div>
                                <p className="text-neutral-400 italic text-[11px]">“ {cite.text} ”</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-neutral-800 my-2"></div>
                        <div className="text-[11px] text-neutral-500 space-y-1">
                          <div><strong>向量底座引擎:</strong> {ragResult.dbSource} (隔离隔离隔离隔离)</div>
                          <div><strong>嵌入向量模型:</strong> {ragResult.embedding}</div>
                          <div><strong>多路召回策略:</strong> {ragResult.strategy}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 gap-2 p-4">
                        <Database className="w-8 h-8 text-neutral-700 animate-pulse" />
                        <span className="max-w-md">请输入上面的搜索检索词并点击“检索并重排”，系统将调用 RAG 多路检索策略并在沙箱中映射输出溯源结果。</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================== 4. 出题助手 ==================== */}
        {activeMenu === "question" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <Brain className="w-6 h-6 text-[#fa541c]" />
                <span>AI 出题助手</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                根据指定知识点、教学大纲、难度限制或题量分布要求，智能生成符合规范要求的高质量试题，支持一键保存并自动导入对应的题库Collection。
              </p>
            </div>

            {/* Questions generation panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Left Column: Option selectors */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-xs flex flex-col gap-4 shrink-0">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block">智能生成条件控制</span>
                
                {/* 1. Knowledge Point */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 考察知识点：
                  </label>
                  <input
                    type="text"
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    placeholder="输入知识点名称..."
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                  />
                </div>

                {/* 2. Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">题型选择：</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 font-medium transition-all"
                  >
                    <option value="单选题">单选题</option>
                    <option value="多选题">多选题</option>
                    <option value="判断题">判断题</option>
                    <option value="填空题">填空题</option>
                    <option value="简答题">简答题</option>
                    <option value="代码题">代码题</option>
                  </select>
                </div>

                {/* 3. Difficulty */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">难度评定：</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 font-medium transition-all"
                  >
                    <option value="初级">初级</option>
                    <option value="中级">中级</option>
                    <option value="高级">高级</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateQuestion}
                  disabled={isGeneratingQuestion}
                  className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI 智能生成题目</span>
                </button>
              </div>

              {/* Right Column: Output result visual card */}
              <div className="lg:col-span-2 bg-white p-6 border border-neutral-border rounded-xl shadow-xs overflow-y-auto custom-scrollbar h-[360px] lg:h-auto flex flex-col justify-between">
                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-4">试题预览与合规检测面板</span>
                  
                  {isGeneratingQuestion ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-neutral-400">
                      <RefreshCw className="w-8 h-8 text-[#fa541c] animate-spin" />
                      <span className="text-xs">出题助手大脑正在根据大纲拼合生成试题、选项及详细公式级解析...</span>
                    </div>
                  ) : generatedQuestion ? (
                    <div className="space-y-4 flex-1 animate-slide-up text-xs">
                      {/* Generated Card */}
                      <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-3xs">
                        <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between text-[11px] font-bold text-neutral-500">
                          <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96]/45 rounded uppercase tracking-wider">{generatedQuestion.type}</span>
                          <span>考察难度：{generatedQuestion.difficulty}</span>
                        </div>
                        
                        <div className="p-4 space-y-4">
                          <h4 className="font-bold text-neutral-title leading-relaxed text-xs">{generatedQuestion.title}</h4>
                          
                          {generatedQuestion.options && (
                            <div className="space-y-2">
                              {generatedQuestion.options.map((opt: string) => (
                                <div key={opt} className="flex gap-2.5 items-start text-[11px] text-neutral-body leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c] mt-1.5 shrink-0" />
                                  <span>{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="border-t border-neutral-200/50 my-2"></div>

                          <div className="p-3.5 bg-[#fff2e8]/10 border border-[#ffbb96]/30 rounded-xl space-y-2">
                            <div className="font-bold text-[#fa541c] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]" />
                              <span>正确答案：</span>
                              <span className="bg-[#fa541c] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-xs">{generatedQuestion.correct}</span>
                            </div>
                            <div className="text-[11px] text-neutral-body leading-relaxed bg-white p-2.5 rounded-lg border border-neutral-100">
                              <span className="font-bold text-neutral-700 block mb-1">大模型深度解析：</span>
                              {generatedQuestion.analysis}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 gap-2 p-4">
                      <Brain className="w-8 h-8 text-neutral-300 animate-pulse" />
                      <span className="text-xs">请在左侧设定生成参数，大模型出题助手将瞬间自动拼装完整的选择/代码试题与解析逻辑。</span>
                    </div>
                  )}
                </div>

                {generatedQuestion && (
                  <button 
                    onClick={() => {
                      alert("试题已自动过滤去重，并成功保存导入公共试题库！");
                      setGeneratedQuestion(null);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer text-center mt-4 shrink-0 shadow-sm"
                  >
                    确认无误，审核入库
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== 5. 判分助手 ==================== */}
        {activeMenu === "grading" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-[#fa541c]" />
                <span>AI 判分助手</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                综合判分平台，支持客观题自动批改、编程代码沙箱测试用例回归判分以及高价值主观题AI辅助评分（提供精准扣分点、重构优化建议与异议反馈机制）。
              </p>
            </div>

            {/* Split layout: Scoring weights sliders, response logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Left Column: Grade weights and configs */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-xs flex flex-col gap-4 shrink-0">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block">AI 判分核心规则权重微调</span>
                
                {/* Slider 1: Accuracy */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-700 font-bold">
                    <span>用例正确性权重：</span>
                    <span className="text-[#fa541c]">{gradeAccuracy}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={gradeAccuracy}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGradeAccuracy(val);
                      setGradeFormat(Math.floor((100 - val) / 2));
                      setGradePerformance(100 - val - Math.floor((100 - val) / 2));
                    }}
                    className="w-full accent-[#fa541c] cursor-pointer"
                  />
                </div>

                {/* Slider 2: Code Standard */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-700 font-bold">
                    <span>代码规范度权重：</span>
                    <span className="text-[#fa541c]">{gradeFormat}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={gradeFormat}
                    className="w-full accent-neutral-400 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Slider 3: Performance */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-700 font-bold">
                    <span>算法时空复杂度权重：</span>
                    <span className="text-[#fa541c]">{gradePerformance}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={gradePerformance}
                    className="w-full accent-neutral-400 cursor-not-allowed"
                    disabled
                  />
                </div>

                <button
                  onClick={handleSimulateGrading}
                  disabled={isGrading}
                  className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>启动模拟自动判分评估</span>
                </button>
              </div>

              {/* Right Column: Console showing progress */}
              <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
                  <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 flex items-center justify-between shrink-0">
                    <span className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#fa541c]" />
                      <span>沙箱测试用例判分沙箱控制台</span>
                    </span>
                    {isGrading && <span className="text-xs text-amber-500 font-mono animate-pulse">GRADING...</span>}
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap space-y-2">
                    {gradingLogs.map((log, i) => (
                      <div key={i} className="animate-fade-in">{log}</div>
                    ))}
                    {gradingLogs.length === 0 && !isGrading && (
                      <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 gap-2 p-4">
                        <CheckSquare className="w-8 h-8 text-neutral-700 animate-pulse" />
                        <span className="max-w-md">请在左侧微调评分模型分配比例，并点击“启动模拟自动判分”，在此查看测试集加载及AI判定异议结果日志。</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Report Simulation */}
                {gradingLogs.length === 8 && !isGrading && (
                  <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-xs animate-slide-up space-y-3 shrink-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-title">最终评定等级分：</span>
                      <span className="text-2xl font-black text-emerald-500">92 / 100 分 (A)</span>
                    </div>
                    <div className="h-[1px] bg-neutral-border"></div>
                    <div className="text-[11px] text-neutral-body leading-relaxed font-medium space-y-1">
                      <div><strong>扣分点判定:</strong> 格式规范性偏低扣 5 分 (变量命名不符合PEP8规范)；用例判定扣 3 分 (极大数边缘测试超时 50ms)。</div>
                      <div><strong>正确答案解析:</strong> 已安全下发异议自动核实，该评分扣减逻辑合理，已成功归档入库。</div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== 6. 智能体管理 ==================== */}
        {activeMenu === "agent" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <Users className="w-6 h-6 text-[#fa541c]" />
                <span>智能体全生命周期管理</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                平台级智能体管理后台。支持教学智能体在全网租户中的创建、知识库技能绑定、对话效果测试、灰度/全量发布，以及调用并发及满意度监控。
              </p>
            </div>

            {/* Split page: Left listing + simulator, right specs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Left Side: Agent card listing & config */}
              <div className="xl:col-span-1 flex flex-col gap-4 min-h-0">
                <div className="bg-white p-4 border border-neutral-border rounded-xl shadow-xs overflow-y-auto custom-scrollbar flex-1 space-y-3">
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block">运行中智能体矩阵</span>
                  
                  <div className="space-y-2">
                    {agents.map(agt => {
                      const isSel = selectedAgent.id === agt.id;
                      return (
                        <div
                          key={agt.id}
                          onClick={() => {
                            setSelectedAgent(agt);
                            setAgentChatHistory([{ sender: "assistant", text: `你好！我是你的${agt.name}，我已经关联了《${agt.kb}》，随时可以协助你进行教学题目生成、难度微调及大纲导出！` }]);
                          }}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-1.5",
                            isSel 
                              ? "border-[#fa541c] bg-[#fff2e8]/5 shadow-3xs" 
                              : "border-neutral-200 bg-white hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-title">{agt.name}</span>
                            <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-mono font-medium">{agt.version}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-neutral-caption font-medium">
                            <span>模型: {agt.model}</span>
                            <span>调用量: {agt.calls}</span>
                            <span className={cn(
                              "font-bold",
                              agt.release === "全量发布" ? "text-emerald-500" : "text-amber-500"
                            )}>{agt.release}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Center & Right Sides: Configs & dialog Simulator */}
              <div className="xl:col-span-2 flex flex-col gap-6 min-h-0">
                {/* Detail configuration details */}
                <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-xs space-y-4 shrink-0">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <span className="text-xs font-bold text-[#fa541c] uppercase tracking-wider flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      <span>智能体元数据配置：{selectedAgent.name}</span>
                    </span>
                    {/* Toggle Release Slider */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-neutral-700">发布状态：</span>
                      <button
                        onClick={() => {
                          const updated = agents.map(a => {
                            if (a.id === selectedAgent.id) {
                              const newRel = a.release === "全量发布" ? "灰度发布" : "全量发布";
                              setSelectedAgent({ ...a, release: newRel });
                              return { ...a, release: newRel };
                            }
                            return a;
                          });
                          setAgents(updated);
                        }}
                        className={cn(
                          "px-2.5 py-0.5 rounded font-bold text-[10px] cursor-pointer transition-all",
                          selectedAgent.release === "全量发布" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                        )}
                      >
                        {selectedAgent.release} (点击切换)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-neutral-body">
                    <div><strong>关联基础模型:</strong> <span className="text-neutral-title font-semibold">{selectedAgent.model}</span></div>
                    <div><strong>绑定本地知识库 Collection:</strong> <span className="text-neutral-title font-semibold">{selectedAgent.kb}</span></div>
                    <div className="md:col-span-2"><strong>系统 System Prompt 指示词:</strong> <p className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 text-neutral-700 mt-1 leading-normal font-mono text-[11px] max-h-16 overflow-y-auto">{selectedAgent.prompt}</p></div>
                  </div>
                </div>

                {/* Dialog simulator */}
                <div className="bg-white rounded-xl border border-neutral-border shadow-xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
                  {/* Simulator Header */}
                  <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-border flex justify-between items-center shrink-0">
                    <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#fa541c]" />
                      <span>智能体对话沙箱调优测试</span>
                    </span>
                    <span className="text-[10px] text-neutral-caption font-mono">CLIENT: SYSTEM_SANDBOX</span>
                  </div>

                  {/* Simulator chat feed */}
                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-neutral-50/20 text-xs leading-relaxed space-y-4 flex flex-col min-h-0">
                    {agentChatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-3 rounded-xl max-w-[85%] shadow-3xs text-[11px] leading-relaxed",
                          msg.sender === "user" 
                            ? "bg-[#fa541c] text-white self-end rounded-tr-none ml-auto" 
                            : "bg-white border border-neutral-200 text-neutral-800 self-start rounded-tl-none mr-auto space-y-2 whitespace-pre-wrap"
                        )}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {isAgentTyping && (
                      <div className="bg-white border border-neutral-200 rounded-xl py-2 px-3 shadow-3xs self-start rounded-tl-none mr-auto text-[11px] text-neutral-400 animate-pulse">
                        智能体思考中...
                      </div>
                    )}
                  </div>

                  {/* Simulator footer input */}
                  <div className="p-3.5 border-t border-neutral-border bg-white flex gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="发送调优指令（如：生成一道高阶大模型题目）..."
                      value={agentChatInput}
                      onChange={(e) => setAgentChatInput(e.target.value)}
                      className="border border-neutral-200 rounded-lg px-3.5 py-2 text-xs flex-1 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendAgentChat(); }}
                    />
                    <button
                      onClick={handleSendAgentChat}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 7. 最佳实践库 ==================== */}
        {activeMenu === "practice" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#fa541c]" />
                <span>AI 最佳实践库</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                收录并在全租户推广大模型集成、云原生高并发开发以及深度学习的平台级最佳实践模板与开发指南。
              </p>
            </div>

            {/* Grid of templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
              {[
                { title: "DeepSeek R1 本地私有化微调实践", desc: "详细讲解如何在由于隐私或安全要求而受限的本地硬件环境微调并部署DeepSeek R1模型。", category: "大模型", users: "12.5k", complexity: "高级", tags: ["LoRA", "vLLM", "DeepSeek"] },
                { title: "基于 Dify 搭建多Agent协作知识库", desc: "通过Dify及Milvus向量数据库快速构建支持多文档解析、语义检索和多Agent协同的企业知识库。", category: "知识库", users: "8.2k", complexity: "中级", tags: ["RAG", "Dify", "Agent"] },
                { title: "Spring Cloud Alibaba 云原生秒杀实践", desc: "模拟高并发抢购环境，集成Sentinel限流、Redis乐观锁Lua脚本抗压，是实训项目最佳架构参考。", category: "云原生", users: "16.4k", complexity: "中级", tags: ["SpringCloud", "K8s", "Redis"] },
                { title: "ResNet50 肺部CT影像分割全栈模板", desc: "使用 PyTorch 加载预训练 ResNet50/UNet 针对脱敏医学 DICOM 数据进行分割，带有极强学术示范意义。", category: "深度学习", users: "6.2k", complexity: "高级", tags: ["UNet", "医学AI", "PyTorch"] },
                { title: "智能中英文口语流畅度 Whispers-v3 API对接", desc: "通过Whisper流式音频评测API，完成口语读音纠错、重音偏移、语流卡顿分析，快速接入教学系统。", category: "语音分析", users: "4.8k", complexity: "中级", tags: ["Whisper", "音频API", "SLA"] },
                { title: "Kubernetes 就绪探针 Readiness 最佳配置", desc: "云原生运维必修实践。演示如何配置活性与存活探针保障高可用微服务无缝发布及水平动态扩展。", category: "系统运维", users: "9.2k", complexity: "初级", tags: ["K8s", "探针", "Docker"] }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-xs hover:border-[#fa541c]/50 transition-all flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#fa541c]">
                      <span>{item.category}</span>
                      <span className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">{item.complexity}</span>
                    </div>
                    <h3 className="text-xs font-bold text-neutral-title leading-snug">{item.title}</h3>
                    <p className="text-[11px] text-neutral-body leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map(t => (
                        <span key={t} className="bg-neutral-50 text-[10px] text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded font-mono font-medium">{t}</span>
                      ))}
                    </div>
                    <div className="h-[1px] bg-neutral-border"></div>
                    <div className="flex justify-between items-center text-[10px] text-neutral-caption font-semibold">
                      <span>使用人次: {item.users}</span>
                      <button className="text-[#fa541c] hover:underline flex items-center gap-1 text-[10px] font-bold cursor-pointer">
                        <span>阅读指南</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 8. 课件助手 ==================== */}
        {activeMenu === "courseware" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#fa541c]" />
                <span>AI 课件助手</span>
              </h1>
              <p className="text-sm text-neutral-body mt-1">
                辅助教师根据教学主题、专业方向，一键提取和生成结构化的高清 PPT / PDF 课件大纲，支持多级目录节点拆解和要点扩写。
              </p>
            </div>

            {/* Split layout: input panel, output outline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Left Column: controls */}
              <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-neutral-border shadow-xs flex flex-col gap-4 shrink-0">
                <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block">课件大纲参数配置</span>

                {/* 1. Theme title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 课件主题：
                  </label>
                  <input
                    type="text"
                    value={coursewareTitle}
                    onChange={(e) => setCoursewareTitle(e.target.value)}
                    placeholder="输入课件主题名称..."
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                  />
                </div>

                {/* 2. Style options */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">演示文稿风格：</label>
                  <select
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 font-medium transition-all"
                  >
                    <option>极客科技 (橙黑配色)</option>
                    <option>学术研究 (深蓝严肃)</option>
                    <option>清新极简 (淡灰优雅)</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateCourseware}
                  disabled={isGeneratingCourseware}
                  className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>一键生成多级课件大纲</span>
                </button>
              </div>

              {/* Right Column: Outline Presentation */}
              <div className="lg:col-span-2 bg-white p-6 border border-neutral-border rounded-xl shadow-xs overflow-y-auto custom-scrollbar h-[360px] lg:h-auto flex flex-col justify-between">
                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-bold text-neutral-caption uppercase tracking-wider block mb-4">多层级课件大纲生成区</span>

                  {isGeneratingCourseware ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-neutral-400">
                      <RefreshCw className="w-8 h-8 text-[#fa541c] animate-spin" />
                      <span className="text-xs">课件助手正在检索深度学习专业大纲并进行 PPT/PDF 页级大纲拆解中...</span>
                    </div>
                  ) : generatedCourseware ? (
                    <div className="space-y-5 flex-1 animate-slide-up">
                      <div className="p-4 bg-[#fff2e8]/20 border border-[#ffbb96]/45 rounded-xl">
                        <span className="text-[10px] font-bold text-[#fa541c] uppercase tracking-wider">PPT幻灯片主题大纲</span>
                        <h2 className="text-xs font-bold text-neutral-title mt-1">{generatedCourseware.title}</h2>
                      </div>

                      <div className="space-y-4">
                        {generatedCourseware.slides.map((slide: any) => (
                          <div key={slide.slide} className="border border-neutral-200 rounded-xl p-4 space-y-2 bg-neutral-50/30">
                            <span className="text-xs font-bold text-neutral-title block">{slide.title}</span>
                            <div className="space-y-1.5">
                              {slide.points.map((pt: string, i: number) => (
                                <div key={i} className="flex gap-2 items-start text-[11px] text-neutral-body leading-relaxed font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c] mt-1.5 shrink-0" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 gap-2 p-4">
                      <FileText className="w-8 h-8 text-neutral-300 animate-pulse" />
                      <span className="text-xs">在左侧设置课件主题，AI 将瞬间为您提供多页高清 PPT / PDF 节点大纲及多级大纲内容。</span>
                    </div>
                  )}
                </div>

                {generatedCourseware && (
                  <div className="flex gap-3 mt-4 shrink-0">
                    <button 
                      onClick={() => { alert("已成功导出为 PDF/Word 教案大纲！"); setGeneratedCourseware(null); }}
                      className="flex-1 bg-white hover:bg-neutral-100 text-neutral-title text-xs font-bold py-2 border border-neutral-border rounded-lg transition-colors cursor-pointer text-center shadow-3xs"
                    >
                      导出为 PDF 教案
                    </button>
                    <button 
                      onClick={() => { alert("已成功一键转化为多页 PPT 模板大纲并下发至教师工作台！"); setGeneratedCourseware(null); }}
                      className="flex-1 bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer text-center shadow-sm"
                    >
                      导出为 PPT 课件大纲
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
