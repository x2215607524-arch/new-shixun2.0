import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Plus, Upload, Globe, Search, Brain, HelpCircle, ChevronDown, ChevronUp, Trash2, X, ChevronLeft, ArrowLeft, Send, MessageSquare, Database, Sparkles, Check, Info, Layers, Loader2, Copy, XCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomSelect } from './TeacherProjects';


// Helper component for Rich Text Editor (Edit / Preview)
interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  isCollapsible?: boolean;
  onDelete?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = "",
  isCollapsible = false,
  onDelete
}) => {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border border-neutral-200 rounded overflow-hidden bg-white shadow-sm transition-all focus-within:border-[#fa541c]/50">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-neutral-50 px-4 py-2 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          {isCollapsible && (
            <button 
              type="button" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-neutral-400 hover:text-neutral-600 p-0.5"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
          <span className="text-[13px] font-bold text-neutral-800 flex items-center">
            {required && <span className="text-[#fa541c] mr-1">*</span>}
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button 
              type="button" 
              onClick={onDelete}
              className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors mr-2"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex bg-neutral-200/60 p-0.5 rounded text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setTab('edit')}
              className={cn("px-2.5 py-0.5 rounded-sm transition-colors", tab === 'edit' ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-700")}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={cn("px-2.5 py-0.5 rounded-sm transition-colors", tab === 'preview' ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-700")}
            >
              预览
            </button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar & Textarea */}
      {!isCollapsed && (
        <div>
          {tab === 'edit' ? (
            <div>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3.5 px-3 py-1.5 border-b border-neutral-100 bg-neutral-50/20 text-neutral-400">
                <button type="button" className="font-serif font-black hover:text-neutral-700 text-xs transition-colors">H</button>
                <button type="button" className="font-bold hover:text-neutral-700 text-xs transition-colors">B</button>
                <button type="button" className="italic hover:text-neutral-700 text-xs transition-colors">I</button>
                <button type="button" className="line-through hover:text-neutral-700 text-xs transition-colors">S</button>
                <div className="w-[1px] h-3.5 bg-neutral-200"></div>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">🔗</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">”</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">&lt;/&gt;</button>
                <div className="w-[1px] h-3.5 bg-neutral-200"></div>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">📋</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">🔢</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">☑️</button>
              </div>
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "请输入内容..."}
                className="w-full min-h-[90px] p-3 text-xs text-neutral-800 focus:outline-none resize-y"
              />
            </div>
          ) : (
            <div className="p-3 min-h-[90px] text-xs text-neutral-700 bg-neutral-50/10 whitespace-pre-wrap">
              {value || <span className="text-neutral-400 italic">暂无预览内容</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type DatasetSyncStatus = '同步中' | '同步成功' | '同步失败';
const AVAILABLE_DATASETS = [
  { name: 'house_prices_train.csv', size: '42.5 MB' },
  { name: 'house_prices_test.csv', size: '12.8 MB' },
  { name: 'house_prices_eval.csv', size: '15.4 MB' },
  { name: 'mnist_train.bin', size: '9.9 MB' },
  { name: 'mnist_test.bin', size: '1.6 MB' },
  { name: 'iris_dataset.csv', size: '4.5 KB' },
];

const getQuestionsForBank = (bankName: string, questionsList: any[]) => {
  // First, find questions in the user's questionsList that match this bank
  const userQuestions = questionsList.filter(q => q.bank === bankName);
  
  // Create default questions
  const defaultQuestions: any[] = [];
  
  if (bankName.includes('大模型') || bankName.includes('深度学习') || bankName.includes('人工智能') || bankName.includes('客观题') || bankName.includes('D-uni') || bankName.includes('机器学习')) {
    defaultQuestions.push(
      {
        id: 101,
        name: '零样本提示是指？',
        type: '单选题',
        options: [
          '不提供示例直接让模型完成任务',
          '提供大量示例让模型学习',
          '不给模型任何输入',
          '只使用数字示例'
        ],
        correct: 'A',
        analysis: '零样本提示（Zero-shot Prompting）是指直接向大模型描述任务要求，而不提供任何具体的事例或示范，让模型依靠其预训练的泛化能力直接完成任务。'
      },
      {
        id: 102,
        name: '以下哪项是大语言模型常见的局限性？',
        type: '单选题',
        options: [
          '可能产生幻觉',
          '无法处理文本',
          '不需要计算资源',
          '只有文字'
        ],
        correct: 'A',
        analysis: '大语言模型由于其自回归概率预测 of 机制，容易产生符合语法逻辑但内容完全不真实的“幻觉”现象，这是大模型当前面临的最主要局限性之一。'
      }
    );
  }
  
  // Add some specific deep learning questions
  if (bankName.includes('深度学习')) {
    defaultQuestions.push(
      {
        id: 201,
        name: '神经网络中激活函数的主要作用是提供非线性建模能力。',
        type: '判断题',
        options: ['正确', '错误'],
        correct: '正确',
        analysis: '激活函数为神经网络引入非线性映射。如果没有激活函数，无论网络叠加多少层，其输出始终是输入的线性组合，网络退化为单层感知机。'
      },
      {
        id: 202,
        name: '以下哪些方法常用于防止深度学习模型发生过拟合？',
        type: '多选题',
        options: [
          '使用 Dropout 丢弃法',
          '增加训练数据量',
          '采用 L1 或 L2 正则化项',
          '提高模型的复杂度'
        ],
        correct: 'A, B, C',
        analysis: '防止过拟合的常见方法包括增加数据、引入 L1/L2 正则项以及使用 Dropout。增加模型复杂度反而会加剧过拟合。'
      }
    );
  }

  // Add agent questions for D-uni bank
  if (bankName.includes('D-uni') || bankName.includes('智能体')) {
    defaultQuestions.push(
      {
        id: 301,
        name: '智能体与传统程序最本质的区别是什么？',
        type: '单选题',
        options: [
          '智能体具有自主性和自适应学习能力，能够感知环境并做出决策，而传统程序运行在预设逻辑中',
          '智能体运行速度比传统程序慢',
          '智能体不需要硬件运行环境',
          '传统程序不能连接互联网'
        ],
        correct: 'A',
        analysis: '自主性与自适应感知是智能体最显著的特征。'
      },
      {
        id: 302,
        name: '智能体的四个基本组成部分包括哪些？',
        type: '多选题',
        options: [
          '环境感知系统 (Sensors)',
          '决策规划系统 (Decision & Planning)',
          '执行动作系统 (Actuators)',
          '自我学习与知识库系统 (Knowledge & Learning)'
        ],
        correct: 'A, B, C, D',
        analysis: '感知、决策、执行以及学习共同构成了完整的智能体架构。'
      }
    );
  }

  // Fallback if no questions are matched
  if (userQuestions.length === 0 && defaultQuestions.length === 0) {
    defaultQuestions.push(
      {
        id: 401,
        name: '关于通用人工智能（AGI），以下描述中最准确的是？',
        type: '单选题',
        options: [
          '能够在人类表现出的任何智力任务中达到或超过人类水平的系统',
          '目前已经完全实现的下棋人工智能',
          '专门用于人脸识别的图像分类算法',
          '只能进行文本对话的聊天机器人'
        ],
        correct: 'A',
        analysis: '通用人工智能是指在各种认知任务中都达到人类智能水平的系统，目前仍处于研究探索阶段。'
      }
    );
  }

  // Combine and de-duplicate by name to ensure no duplicate titles
  const combined = [...userQuestions];
  defaultQuestions.forEach(dq => {
    if (!combined.some(uq => uq.name === dq.name)) {
      combined.push(dq);
    }
  });

  return combined;
};

const getQuestionOptions = (q: any) => {
  if (q.options && q.options.length > 0) return q.options;
  
  // Try to match specific titles
  if (q.name.includes('最本质的区别')) {
    return [
      '智能体具有自主性和自适应学习能力，能够感知环境并做出决策，而传统程序运行在预设逻辑中',
      '智能体运行速度比传统程序慢',
      '智能体不需要硬件运行环境',
      '传统程序不能连接互联网'
    ];
  }
  if (q.name.includes('四个基本组成部分')) {
    return [
      '环境感知系统 (Sensors)',
      '决策规划系统 (Decision & Planning)',
      '执行动作系统 (Actuators)',
      '自我学习与知识库系统 (Knowledge & Learning)'
    ];
  }
  if (q.name.includes('零样本提示')) {
    return [
      '不提供示例直接让模型完成任务',
      '提供大量示例让模型学习',
      '不给模型任何输入',
      '只使用数字示例'
    ];
  }
  if (q.name.includes('局限性')) {
    return [
      '可能产生幻觉',
      '无法处理文本',
      '不需要计算资源',
      '只有文字'
    ];
  }
  if (q.name.includes('激活函数的主要作用')) {
    return [
      '增加网络层数',
      '引入非线性因素，使网络能拟合复杂函数',
      '加速梯度下降的计算',
      '自动调节学习率'
    ];
  }
  if (q.name.includes('防止深度学习模型发生过拟合')) {
    return [
      '使用 Dropout 丢弃法',
      '增加训练数据量',
      '采用 L1 或 L2 正则化项',
      '提高模型的复杂度'
    ];
  }
  
  // Default fallback for single/multiple choice
  return [
    '选项 A - 这是当前题目的默认示例选项，供界面预览展示。',
    '选项 B - 这是当前题目的默认示例选项，供界面预览展示。',
    '选项 C - 这是当前题目的默认示例选项，供界面预览展示。',
    '选项 D - 这是当前题目的默认示例选项，供界面预览展示。'
  ];
};

const ALL_SYSTEM_TAGS = [
  '人工智能概述',
  '大模型应用场景分析',
  '机器学习基本概念与流程',
  '大语言模型技术',
  '人工智能导论',
  '智能体',
  '深度学习',
  '自动驾驶',
  '神经网络',
  '自然语言处理'
];

const SHIXUN_VM_SPECS = [
  { value: 'ecs.g6.large', label: '通用计算型 g6.large | 2核 8GB | 无GPU' },
  { value: 'ecs.g6.xlarge', label: '通用计算型 g6.xlarge | 4核 16GB | 无GPU' },
  { value: 'ecs.gn6i-c4g1.xlarge', label: 'GPU计算型 gn6i | 4核 16GB | T4 * 1 (16GB)' },
  { value: 'ecs.gn7i-c8g1.2xlarge', label: 'GPU计算型 gn7i | 8核 32GB | A10G * 1 (24GB)' }
];

const parseSubnet = (subnetStr: string) => {
  let standardStr = subnetStr;
  if (!subnetStr || !subnetStr.includes('.')) {
    standardStr = '192.168.1.0/24';
  } else {
    // extract IP range from string like 'subnet-default-a (192.168.1.0/24)'
    const match = subnetStr.match(/192\.168\.\d*\.\d*\/\d+/);
    if (match) {
      standardStr = match[0];
    }
  }

  const parts = standardStr.split(/[./]/);
  const octet3 = parts[2] ?? '1';
  const octet4 = parts[3] ?? '0';
  const mask = parts[4] || '24';
  return { octet3, octet4, mask };
};

export default function TeacherQuestions() {
  const location = useLocation();
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importBank, setImportBank] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState<any | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkpointQuestion, setCheckpointQuestion] = useState<any | null>(null);
  const [isCheckpointsModalOpen, setIsCheckpointsModalOpen] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState<any | null>(null);
  const [isCheckpointFormOpen, setIsCheckpointFormOpen] = useState(false);
  const [checkpointFormName, setCheckpointFormName] = useState('');
  const [checkpointFormContent, setCheckpointFormContent] = useState('');
  const [checkpointFormDesc, setCheckpointFormDesc] = useState('');
  const [checkpointFormRatio, setCheckpointFormRatio] = useState<number>(20);
  const [checkpoints, setCheckpoints] = useState<Record<number, any[]>>({
    4: [
      { id: '1', name: '依赖库配置检查', content: 'import torch; print(torch.__version__)', description: '检查主运行脚本是否包含必要的依赖库（如 PyTorch）', scoreRatio: 20 },
      { id: '2', name: '训练数据集路径校验', content: 'import os; assert os.path.exists("data")', description: '验证训练数据集的路径配置是否正确', scoreRatio: 20 },
      { id: '3', name: 'Epoch数超参检查', content: 'grep -E "epoch|batch_size" train.py', description: '检查模型训练部分的 Epoch 数与 Batch Size 设定', scoreRatio: 20 },
      { id: '4', name: '推理端口响应测试', content: 'curl http://localhost:8080/predict', description: '测试 API 端口是否能成功响应推理请求', scoreRatio: 20 },
      { id: '5', name: 'GPU加速可用性测试', content: 'nvidia-smi', description: '确认环境中的 GPU 资源可用性', scoreRatio: 20 }
    ]
  });

  // Make Public modal states
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [questionToApplyPublic, setQuestionToApplyPublic] = useState<any | null>(null);
  const [applyPublicRange, setApplyPublicRange] = useState<'租户' | '平台'>('租户');
  const [applyPublicReason, setApplyPublicReason] = useState('');
  const [isApplyingPublic, setIsApplyingPublic] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isBatchPublicOpen, setIsBatchPublicOpen] = useState(false);

  // Off-shelf modal states
  const [isOffShelfModalOpen, setIsOffShelfModalOpen] = useState(false);
  const [questionToOffShelf, setQuestionToOffShelf] = useState<any | null>(null);
  const [offShelfReason, setOffShelfReason] = useState('');

  // Click outside to close dropdowns
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  React.useEffect(() => {
    function handleQuestionTagClickOutside(event: MouseEvent) {
      if (questionTagDropdownRef.current && !questionTagDropdownRef.current.contains(event.target as Node)) {
        setIsQuestionTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleQuestionTagClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleQuestionTagClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleQuestionBankClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedSingle = singleQuestionBankDropdownRef.current && singleQuestionBankDropdownRef.current.contains(target);
      if (!clickedSingle) {
        setIsQuestionBankDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleQuestionBankClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleQuestionBankClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleQuestionDifficultyClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedSingle = singleQuestionDifficultyDropdownRef.current && singleQuestionDifficultyDropdownRef.current.contains(target);
      if (!clickedSingle) {
        setIsQuestionDifficultyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleQuestionDifficultyClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleQuestionDifficultyClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleShixunResourcePoolClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedSingle = shixunResourcePoolDropdownRef.current && shixunResourcePoolDropdownRef.current.contains(target);
      if (!clickedSingle) {
        setIsShixunResourcePoolDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleShixunResourcePoolClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleShixunResourcePoolClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleMoreActionsClickOutside(event: MouseEvent) {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target as Node)) {
        setIsMoreActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMoreActionsClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleMoreActionsClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleTemplateClickOutside(event: MouseEvent) {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setIsTemplateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleTemplateClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleTemplateClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleCopyBankClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedSingle = copyBankDropdownRef.current && copyBankDropdownRef.current.contains(target);
      if (!clickedSingle) {
        setIsCopyBankDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleCopyBankClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleCopyBankClickOutside);
    };
  }, []);

  // Question database states
  const [isBankListModalOpen, setIsBankListModalOpen] = useState(false);
  const [viewingBankDetail, setViewingBankDetail] = useState<any | null>(null);
  const [searchBankQuery, setSearchBankQuery] = useState('');
  const [isCreateBankOpen, setIsCreateBankOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [editingBank, setEditingBank] = useState<any | null>(null);
  const [editBankName, setEditBankName] = useState('');
  const [banksList, setBanksList] = useState([
    { id: 1, name: '人工智能通识D-uni', count: 124, category: 'AI技术', creator: 'Momodel', createdAt: '2025/11/20' },
    { id: 2, name: '深度学习基础题库', count: 86, category: 'AI技术', creator: 'Admin', createdAt: '2025/12/01' },
    { id: 3, name: '大语言模型进阶题库', count: 53, category: '自然语言处理', creator: 'Momodel', createdAt: '2026/02/15' },
    { id: 4, name: '机器学习算法精选', count: 98, category: '机器学习', creator: 'Teacher_Wang', createdAt: '2026/03/10' },
    { id: 5, name: '计算机视觉实战题库', count: 42, category: '计算机视觉', creator: 'Teacher_Li', createdAt: '2026/04/22' },
  ]);

  React.useEffect(() => {
    if (location.state?.openCreateQuestion) {
      setIsCreateModalOpen(true);
      // Clear location state to prevent reopening on refresh or back navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // AI Assistant states
  const [view, setView] = useState<'list' | 'ai' | 'bank-detail'>('list');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [importedIndexes, setImportedIndexes] = useState<number[]>([]);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'assistant',
      text: `你好！我是你的 AI 出题助手，专门为你生成符合要求的各类题目。无论是人工智能、计算机、数学、历史或其他领域，我都能根据你指定的主题、难度和题型，快速生成清晰准确的题目。

请按照以下题目「示例格式」输入试题内容要求，我会立即为你定制高质量的题目：
请生成主题为《人工智能通识》的试题。每道题需包含：

1. 题目（必填）：
2. 关键概念/知识点（选填）：
3. 难度（必填）：容易/较易/中等/较难/困难
4. 标签（选填）：
5. 题型分布与题量（必填）：例如 -> 单选题 1 题，多选题 1 题，判断题 1 题，填空题 1 题，简答题 1 题，实训题 1 题`
    }
  ]);

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let generatedQuestion = {
        name: '神经网络中激活函数的主要作用是提供非线性建模能力。',
        type: '单选题',
        bank: '人工智能通识D-uni',
        difficulty: '中等',
        tags: '深度学习, 激活函数',
        grading: '自动评分',
        options: ['增加网络层数', '引入非线性因素，使网络能拟合复杂函数', '加速梯度下降的计算', '自动调节学习率'],
        correct: 'B',
        analysis: '激活函数的主要目的就是在多层神经网络中引入非线性因素。如果没有激活函数，无论网络叠加多少层，其输出始终是输入的线性组合，只能解决线性可分问题。'
      };

      if (currentInput.includes('多选')) {
        generatedQuestion = {
          name: '以下哪些方法常用于防止深度学习模型发生过拟合？',
          type: '多选题',
          bank: '人工智能通识D-uni',
          difficulty: '困难',
          tags: '深度学习, 过拟合',
          grading: '自动评分',
          options: ['使用 Dropout 丢弃法', '增加训练数据量', '采用 L1 或 L2 正则化项', '提高模型的复杂度'],
          correct: 'A, B, C',
          analysis: '防止过拟合的常见方法包括增加数据、引入 L1/L2 正则项以及使用 Dropout 随机失活。增加模型复杂度反而会加剧过拟合。'
        };
      } else if (currentInput.includes('判断')) {
        generatedQuestion = {
          name: '在监督学习中，所有的算法都必须依赖手工标注的高质量标签数据。',
          type: '判断题',
          bank: '人工智能通识D-uni',
          difficulty: '容易',
          tags: '监督学习',
          grading: '自动评分',
          options: ['正确', '错误'],
          correct: '错误',
          analysis: '在弱监督学习或自监督学习中，并不一定需要大量人工标注的数据，故说法不绝对。'
        };
      }

      const assistantMsg = {
        sender: 'assistant',
        text: `✨ 出题助手已为您成功生成以下 **${generatedQuestion.type}**，点击下方的「导入试题库」即可直接导入管理系统中：`,
        questionCard: generatedQuestion
      };

      setMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  const handleImportQuestion = (card: any, msgIndex: number) => {
    if (importedIndexes.includes(msgIndex)) return;

    const newQuestion = {
      id: Date.now(),
      name: card.name,
      bank: card.bank,
      type: card.type,
      status: '启用',
      source: '人工智能',
      difficulty: card.difficulty,
      tags: card.tags,
      grading: card.grading,
      creator: 'Momodel',
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      scope: '平台',
      auditStatus: '已通过'
    };

    setQuestionsList([newQuestion, ...questionsList]);
    setImportedIndexes([...importedIndexes, msgIndex]);
  };

  const handleOpenCopyDrawer = (q: any) => {
    setCopyingQuestion(q);
    setCopyTargetBank(q.bank || '');
    setIsCopyDrawerOpen(true);
  };

  const handleCopyQuestionSubmit = () => {
    if (!copyTargetBank) {
      alert('请选择目标题库');
      return;
    }
    const newQuestion = {
      ...copyingQuestion,
      id: Date.now(),
      bank: copyTargetBank,
      name: `${copyingQuestion.name} (复制)`,
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
    };
    setQuestionsList([newQuestion, ...questionsList]);
    setIsCopyDrawerOpen(false);
    setCopyingQuestion(null);
    setCopyTargetBank('');
  };

  // Modal form states
  const [newQuestionType, setNewQuestionType] = useState('单选题');
  const [newQuestionBank, setNewQuestionBank] = useState('');
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  
  // Options state (default ABCD)
  const [options, setOptions] = useState([
    { id: 1, key: 'A', value: '' },
    { id: 2, key: 'B', value: '' },
    { id: 3, key: 'C', value: '' },
    { id: 4, key: 'D', value: '' },
  ]);

  // Correct answer states depending on question type
  const [correctAnswerSingle, setCorrectAnswerSingle] = useState('A');
  const [correctAnswerMultiple, setCorrectAnswerMultiple] = useState<string[]>([]);
  const [correctAnswerTrueFalse, setCorrectAnswerTrueFalse] = useState('正确');
  const [correctAnswerText, setCorrectAnswerText] = useState('');

  // Blanks and score items states for Fill-in-the-blank questions
  const [blanks, setBlanks] = useState<any[]>([
    { id: '1', name: '填空1', value: '', proportion: 50 },
    { id: '2', name: '填空2', value: '', proportion: 50 },
    { id: '3', name: '填空3', value: '', proportion: 0 },
    { id: '4', name: '填空4', value: '', proportion: 0 }
  ]);
  const [scoreItems, setScoreItems] = useState<any[]>([
    { id: '1', blankId: '1', keywords: ['13', 'hh'], ratio: 50 },
    { id: '2', blankId: '1', keywords: ['2.13', '2月13'], ratio: 50 },
    { id: '3', blankId: '3', keywords: [], ratio: 100 },
    { id: '4', blankId: '4', keywords: ['123', '123'], ratio: 100 }
  ]);
  const [draftKeywords, setDraftKeywords] = useState<{ [key: string]: string }>({});

  const [newQuestionAnalysis, setNewQuestionAnalysis] = useState('');
  const [newQuestionStatus, setNewQuestionStatus] = useState('启用');

  // Practical Question (实训题) specific states
  const [shixunDescription, setShixunDescription] = useState(`### 任务名称\n内容描述\n### 任务描述\n内容描述\n### 任务要求\n内容描述\n### 评分方式\n内容描述`);
  const [shixunAnswerType, setShixunAnswerType] = useState('线上环境答题');
  const [shixunDatasets, setShixunDatasets] = useState<string[]>([]);
  const [datasetSyncStatuses, setDatasetSyncStatuses] = useState<Record<string, DatasetSyncStatus>>({});
  const syncTimers = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const clearDatasetSync = () => {
    Object.values(syncTimers.current).forEach(clearTimeout);
    syncTimers.current = {};
  };
  React.useEffect(() => () => clearDatasetSync(), []);
  const retryDatasetSync = (name: string) => {
    clearTimeout(syncTimers.current[name]);
    setDatasetSyncStatuses(previous => ({ ...previous, [name]: '同步中' }));
    // Frontend simulation until a dataset synchronization API is available.
    syncTimers.current[name] = setTimeout(() => {
      setDatasetSyncStatuses(previous => ({ ...previous, [name]: '同步成功' }));
      delete syncTimers.current[name];
    }, 2000);
  };
  const removeDataset = (name: string) => {
    clearTimeout(syncTimers.current[name]);
    delete syncTimers.current[name];
    setShixunDatasets(previous => previous.filter(item => item !== name));
    setDatasetSyncStatuses(previous => { const next = { ...previous }; delete next[name]; return next; });
  };
  const [isDatasetDropdownOpen, setIsDatasetDropdownOpen] = useState(false);
  const [shixunOfflineFile, setShixunOfflineFile] = useState<string>('');
  const [shixunResourcePool, setShixunResourcePool] = useState('天翼云资源池1');

  // Project Environment configuration states for shixun
  const [shixunEnvType, setShixunEnvType] = useState<'容器' | '云主机'>('容器');
  const [shixunRepoMode, setShixunRepoMode] = useState<'manual' | 'upload'>('manual');
  const [shixunRepoUrl, setShixunRepoUrl] = useState('https://github.com/opencv/opencv.git');
  const [shixunCreationMethod, setShixunCreationMethod] = useState<'template' | 'custom'>('template');
  const [shixunTemplateValue, setShixunTemplateValue] = useState('通用模板');
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const templateDropdownRef = React.useRef<HTMLDivElement>(null);

  // Container custom config states
  const [shixunProjectSource, setShixunProjectSource] = useState<string>('');
  const [shixunCpuCores, setShixunCpuCores] = useState<string>('2');
  const [shixunMemoryGb, setShixunMemoryGb] = useState<string>('4');
  const [shixunGpuPower, setShixunGpuPower] = useState<string>('无');
  const [shixunGpuMem, setShixunGpuMem] = useState<string>('0');
  const [shixunGpuCards, setShixunGpuCards] = useState<string>('0');
  const [shixunGpuModel, setShixunGpuModel] = useState<string>('4090');
  const [shixunContainerImage, setShixunContainerImage] = useState<string>('ctyun-python:3.10-slim-cpu');
  const [shixunEnvVars, setShixunEnvVars] = useState<Array<{ id: number, key: string, value: string }>>([]);
  const [shixunStartCmd, setShixunStartCmd] = useState<string>('python main.py');
  const [shixunMultiInstance, setShixunMultiInstance] = useState<boolean>(false);
  // VM config states
  const [shixunVmCpu, setShixunVmCpu] = useState<string>('2');
  const [shixunVmMem, setShixunVmMem] = useState<string>('8');
  const [shixunVmGpuPower, setShixunVmGpuPower] = useState<string>('无');
  const [shixunVmGpuMem, setShixunVmGpuMem] = useState<string>('0');
  const [shixunVmGpuCards, setShixunVmGpuCards] = useState<string>('0');
  const [shixunVmGpuModel, setShixunVmGpuModel] = useState<string>('无');
  const [shixunVmSpec, setShixunVmSpec] = useState<string>('ecs.g6.large');
  const [shixunVmSpecType, setShixunVmSpecType] = useState<'spec' | 'custom'>('spec');
  const [shixunVmImage, setShixunVmImage] = useState<string>('Ubuntu Server 22.04 LTS');
  const [shixunVmStorageType, setShixunVmStorageType] = useState<string>('SSD');
  const [shixunVmStorageDataType, setShixunVmStorageDataType] = useState<string>('SSD');
  const [shixunVmSystemDisk, setShixunVmSystemDisk] = useState<string>('40');
  const [shixunVmDataDisk, setShixunVmDataDisk] = useState<string>('100');
  const [shixunVmVpc, setShixunVmVpc] = useState<string>('vpc-default');
  const [shixunVmSubnet, setShixunVmSubnet] = useState<string>('192.168.1.0/24');
  const [shixunVmVncType, setShixunVmVncType] = useState<'caddyvnc' | 'novnc'>('novnc');

  // Multi-instance states for shixun containers and VMs
  const [shixunContainers, setShixunContainers] = useState<any[]>([
    {
      id: 'c-default',
      cpuCores: '2',
      memoryGb: '4',
      gpuPower: '无',
      gpuMem: '0',
      gpuCards: '0',
      gpuModel: '4090',
      containerImage: 'ctyun-python:3.10-slim-cpu',
      envVars: [],
      startCmd: 'python main.py'
    }
  ]);
  const [activeShixunContainerIdx, setActiveShixunContainerIdx] = useState(0);

  const [shixunVms, setShixunVms] = useState<any[]>([
    {
      id: 'v-default',
      vmCpu: '2',
      vmMem: '8',
      vmGpuPower: '无',
      vmGpuMem: '0',
      vmGpuCards: '0',
      vmGpuModel: '无',
      vmSpec: 'ecs.g6.large',
      vmSpecType: 'spec',
      vmImage: 'Ubuntu Server 22.04 LTS',
      vmStorageType: 'SSD',
      vmStorageDataType: 'SSD',
      vmSystemDisk: '40',
      vmDataDisk: '100',
      vmVpc: 'vpc-default',
      vmSubnet: '192.168.1.0/24',
      vmVncType: 'novnc'
    }
  ]);
  const [activeShixunVmIdx, setActiveShixunVmIdx] = useState(0);

  const updateContainerField = (key: string, value: any) => {
    setShixunContainers(prev => prev.map((c, i) => i === activeShixunContainerIdx ? { ...c, [key]: value } : c));
  };

  const updateVmField = (key: string, value: any) => {
    setShixunVms(prev => prev.map((v, i) => i === activeShixunVmIdx ? { ...v, [key]: value } : v));
  };






  // Tag management
  const [tags, setTags] = useState<string[]>([
    '人工智能概述',
    '大模型应用场景分析',
    '机器学习基本概念与流程',
    '大语言模型技术',
    '人工智能导论'
  ]);
  const [tagInput, setTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [searchTagQuery, setSearchTagQuery] = useState('');
  const [isQuestionTagDropdownOpen, setIsQuestionTagDropdownOpen] = useState(false);
  const questionTagDropdownRef = React.useRef<HTMLDivElement>(null);
  const [isQuestionBankDropdownOpen, setIsQuestionBankDropdownOpen] = useState(false);
  const singleQuestionBankDropdownRef = React.useRef<HTMLDivElement>(null);
  const [isQuestionDifficultyDropdownOpen, setIsQuestionDifficultyDropdownOpen] = useState(false);
  const singleQuestionDifficultyDropdownRef = React.useRef<HTMLDivElement>(null);
  const [isShixunResourcePoolDropdownOpen, setIsShixunResourcePoolDropdownOpen] = useState(false);
  const shixunResourcePoolDropdownRef = React.useRef<HTMLDivElement>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const moreActionsRef = React.useRef<HTMLDivElement>(null);

  // Copy question states and refs
  const [isCopyDrawerOpen, setIsCopyDrawerOpen] = useState(false);
  const [copyingQuestion, setCopyingQuestion] = useState<any | null>(null);
  const [copyTargetBank, setCopyTargetBank] = useState('');
  const [isCopyBankDropdownOpen, setIsCopyBankDropdownOpen] = useState(false);
  const copyBankDropdownRef = React.useRef<HTMLDivElement>(null);

  const [questionsList, setQuestionsList] = useState([
    {
      id: 1,
      name: '智能体与传统程序最本质的区别是什么？',
      bank: '人工智能通识D-uni',
      type: '单选题',
      status: '停用',
      source: '人工智能',
      difficulty: '容易',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 14:45',
      scope: '私有',
      auditStatus: '未审核'
    },
    {
      id: 2,
      name: '智能体的四个基本组成部分包括哪些？',
      bank: '人工智能通识D-uni',
      type: '多选题',
      status: '启用',
      source: '人工智能',
      difficulty: '较易',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 14:45',
      scope: '租户',
      auditStatus: '已通过'
    },
    {
      id: 3,
      name: '大语言模型是__________是构建生成式各种应用的...',
      bank: '人工智能通识D-uni',
      type: '填空题',
      status: '启用',
      source: '人工出题',
      difficulty: '中等',
      tags: '',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 17:02',
      scope: '平台',
      auditStatus: '已通过'
    },
    {
      id: 4,
      name: '基于大模型的端到端自动驾驶系统开发',
      shixunDatasets: AVAILABLE_DATASETS.slice(0, 3).map(dataset => dataset.name),
      datasetSyncStatuses: { 'house_prices_train.csv': '同步中', 'house_prices_test.csv': '同步成功', 'house_prices_eval.csv': '同步失败' } as Record<string, DatasetSyncStatus>,
      bank: '人工智能通识D-uni',
      type: '实训题',
      status: '启用',
      source: '人工智能',
      difficulty: '困难',
      tags: '深度学习, 自动驾驶',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/16 11:20',
      scope: '私有',
      auditStatus: '未审核'
    },
    {
      id: 5,
      name: '房价预测模型训练与评估实训',
      bank: '人工智能通识D-uni',
      type: '实训题',
      status: '数据集同步中',
      source: '人工出题',
      difficulty: '中等',
      tags: '机器学习, 回归预测',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/11/02 10:00',
      scope: '私有',
      auditStatus: '未审核',
      shixunDatasets: ['house_prices_train.csv', 'house_prices_test.csv'],
      datasetSyncStatuses: { 'house_prices_train.csv': '同步中', 'house_prices_test.csv': '同步成功' } as Record<string, DatasetSyncStatus>,
    },
    {
      id: 6,
      name: '手写数字识别模型开发实训',
      bank: '人工智能通识D-uni',
      type: '实训题',
      status: '数据集同步失败',
      source: '人工出题',
      difficulty: '中等',
      tags: '深度学习, 图像识别',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/11/02 10:10',
      scope: '私有',
      auditStatus: '未审核',
      shixunDatasets: ['mnist_train.bin', 'mnist_test.bin'],
      datasetSyncStatuses: { 'mnist_train.bin': '同步失败', 'mnist_test.bin': '同步成功' } as Record<string, DatasetSyncStatus>,
    }
  ]);

  const filteredQuestions = questionsList.filter(q => 
    q.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleAddOption = () => {
    const nextKey = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: Date.now(), key: nextKey, value: '' }]);
  };

  const handleDeleteOption = (id: number) => {
    const filtered = options.filter(opt => opt.id !== id);
    const rekeyed = filtered.map((opt, index) => ({
      ...opt,
      key: String.fromCharCode(65 + index)
    }));
    setOptions(rekeyed);
  };

  const handleAddBlank = () => {
    const nextId = String(blanks.length + 1);
    const newBlank = {
      id: nextId,
      name: `填空${nextId}`,
      value: '',
      proportion: 0
    };
    setBlanks([...blanks, newBlank]);
    setScoreItems([
      ...scoreItems,
      { id: String(Date.now()), blankId: nextId, keywords: [], ratio: 100 }
    ]);
  };

  const handleAddKeywordTag = (itemId: string) => {
    const text = (draftKeywords[itemId] || '').trim();
    if (!text) return;
    setScoreItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const currentKeywords = Array.isArray(item.keywords) 
          ? item.keywords 
          : (typeof item.keywords === 'string' && item.keywords.trim() ? item.keywords.split(',').map(s => s.trim()) : []);
        return {
          ...item,
          keywords: [...currentKeywords, text]
        };
      }
      return item;
    }));
    setDraftKeywords(prev => ({ ...prev, [itemId]: '' }));
  };

  const handleRemoveKeywordTag = (itemId: string, indexToRemove: number) => {
    setScoreItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const currentKeywords = Array.isArray(item.keywords) 
          ? item.keywords 
          : (typeof item.keywords === 'string' && item.keywords.trim() ? item.keywords.split(',').map(s => s.trim()) : []);
        return {
          ...item,
          keywords: currentKeywords.filter((_, idx) => idx !== indexToRemove)
        };
      }
      return item;
    }));
  };

  const handleAddScoreItem = () => {
    const nextBlankNum = scoreItems.length + 1;
    const targetBlankId = String(nextBlankNum);

    if (!blanks.some(b => b.id === targetBlankId)) {
      setBlanks(prev => [
        ...prev,
        { id: targetBlankId, name: `填空${targetBlankId}`, value: '', proportion: 0 }
      ]);
    }

    setScoreItems(prev => [
      ...prev,
      { id: String(Date.now()), blankId: targetBlankId, keywords: [], ratio: 100 }
    ]);
  };

  const handleDeleteScoreItem = (id: string) => {
    if (scoreItems.length > 1) {
      setScoreItems(prev => prev.filter(si => si.id !== id));
    }
  };

  const handleDeleteBlank = (id: string) => {
    const filteredBlanks = blanks.filter(b => b.id !== id);
    const reindexedBlanks = filteredBlanks.map((b, index) => {
      const newId = String(index + 1);
      return {
        ...b,
        id: newId,
        name: `填空${newId}`
      };
    });

    const blankIdMapping: { [key: string]: string } = {};
    filteredBlanks.forEach((b, index) => {
      blankIdMapping[b.id] = String(index + 1);
    });

    const updatedScoreItems = scoreItems
      .filter(item => item.blankId !== id)
      .map(item => ({
        ...item,
        blankId: blankIdMapping[item.blankId] || item.blankId
      }));

    setBlanks(reindexedBlanks);
    setScoreItems(updatedScoreItems);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingQuestion(null);
    setNewQuestionBank('');
    setIsQuestionBankDropdownOpen(false);
    setIsQuestionDifficultyDropdownOpen(false);
    setNewQuestionDifficulty('');
    setNewQuestionBody('');
    setOptions([
      { id: 1, key: 'A', value: '' },
      { id: 2, key: 'B', value: '' },
      { id: 3, key: 'C', value: '' },
      { id: 4, key: 'D', value: '' },
    ]);
    setCorrectAnswerSingle('A');
    setCorrectAnswerMultiple([]);
    setCorrectAnswerTrueFalse('正确');
    setCorrectAnswerText('');
    setNewQuestionAnalysis('');
    setNewQuestionStatus('启用');
    setBlanks([
      { id: '1', name: '填空1', value: '', proportion: 50 },
      { id: '2', name: '填空2', value: '', proportion: 50 }
    ]);
    setScoreItems([
      { id: '1', blankId: '1', keywords: '', ratio: 100 },
      { id: '2', blankId: '2', keywords: '', ratio: 100 }
    ]);
    setShixunDescription(`### 任务名称\n内容描述\n### 任务描述\n内容描述\n### 任务要求\n内容描述\n### 评分方式\n内容描述`);
    setShixunAnswerType('线上环境答题');
    setShixunResourcePool('天翼云资源池1');
    setShixunDatasets([]);
    clearDatasetSync();
    setDatasetSyncStatuses({});
    setIsDatasetDropdownOpen(false);
    setShixunOfflineFile('');
    setShixunEnvType('容器');
    setShixunRepoMode('manual');
    setShixunRepoUrl('https://github.com/opencv/opencv.git');
    setShixunCreationMethod('template');
    setShixunTemplateValue('通用模板');
    setShixunProjectSource('');
    setShixunCpuCores('2');
    setShixunMemoryGb('4');
    setShixunGpuPower('10%');
    setShixunGpuMem('2GB');
    setShixunGpuCards('0');
    setShixunContainerImage('Ubuntu 22.04 + PyTorch 2.1 + CUDA 12.1');
    setShixunEnvVars([{ id: 1, key: '', value: '' }]);
    setShixunStartCmd('python main.py');
    setShixunMultiInstance(false);
    setShixunVmCpu('2');
    setShixunVmMem('8');
    setShixunVmGpuPower('无');
    setShixunVmGpuMem('0');
    setShixunVmGpuCards('0');
    setShixunVmGpuModel('无');
    setShixunVmSpec('ecs.g6.large');
    setShixunVmSpecType('spec');
    setShixunVmImage('Ubuntu Server 22.04 LTS');
    setShixunVmStorageType('SSD');
    setShixunVmStorageDataType('SSD');
    setShixunVmSystemDisk('40');
    setShixunVmDataDisk('100');
    setShixunVmVpc('vpc-default');
    setShixunVmSubnet('192.168.1.0/24');
    setShixunVmVncType('novnc');
    setShixunContainers([
      {
        id: 'c-default',
        cpuCores: '2',
        memoryGb: '4',
        gpuPower: '无',
        gpuMem: '0',
        gpuCards: '0',
        gpuModel: '4090',
        containerImage: 'ctyun-python:3.10-slim-cpu',
        envVars: [],
        startCmd: 'python main.py'
      }
    ]);
    setActiveShixunContainerIdx(0);
    setShixunVms([
      {
        id: 'v-default',
        vmCpu: '2',
        vmMem: '8',
        vmGpuPower: '无',
        vmGpuMem: '0',
        vmGpuCards: '0',
        vmGpuModel: '无',
        vmSpec: 'ecs.g6.large',
        vmSpecType: 'spec',
        vmImage: 'Ubuntu Server 22.04 LTS',
        vmStorageType: 'SSD',
        vmStorageDataType: 'SSD',
        vmSystemDisk: '40',
        vmDataDisk: '100',
        vmVpc: 'vpc-default',
        vmSubnet: '192.168.1.0/24',
        vmVncType: 'novnc'
      }
    ]);
    setActiveShixunVmIdx(0);
  };

  const handleEditQuestion = (q: any) => {
    clearDatasetSync();
    setShixunDatasets(q.shixunDatasets || []);
    setDatasetSyncStatuses(q.datasetSyncStatuses || Object.fromEntries((q.shixunDatasets || []).map((name: string) => [name, '同步成功'])));
    setIsDatasetDropdownOpen(false);
    setEditingQuestion(q);
    setNewQuestionBank(q.bank);
    setNewQuestionType(q.type);
    setNewQuestionDifficulty(q.difficulty);
    setNewQuestionStatus(q.status);
    setNewQuestionBody(q.name);
    if (q.tags) {
      setTags(q.tags.split(', '));
    } else {
      setTags([]);
    }
    if (q.type === '填空题') {
      setBlanks(q.blanks || [
        { id: '1', name: '填空1', value: '', proportion: 50 },
        { id: '2', name: '填空2', value: '', proportion: 50 }
      ]);
      setScoreItems(q.scoreItems || [
        { id: '1', blankId: '1', keywords: '', ratio: 100 },
        { id: '2', blankId: '2', keywords: '', ratio: 100 }
      ]);
    } else {
      setBlanks([
        { id: '1', name: '填空1', value: '', proportion: 50 },
        { id: '2', name: '填空2', value: '', proportion: 50 }
      ]);
      setScoreItems([
        { id: '1', blankId: '1', keywords: '', ratio: 100 },
        { id: '2', blankId: '2', keywords: '', ratio: 100 }
      ]);
    }
    if (q.type === '实训题') {
      setShixunDescription(q.shixunDescription || '### 任务名称\n内容描述\n### 任务描述\n内容描述\n### 任务要求\n内容描述\n### 评分方式\n内容描述');
      setShixunAnswerType(q.shixunAnswerType || '线上环境答题');
      setShixunResourcePool(q.shixunResourcePool || '天翼云资源池1');
      setShixunEnvType(q.shixunEnvType || '容器');
    }
    if (q.type === '简答题') {
      setCorrectAnswerText(q.correctAnswer || '');
    } else {
      setCorrectAnswerText('');
    }
    setIsCreateModalOpen(true);
  };

  const toggleQuestionStatus = (id: number) => {
    setQuestionsList(questionsList.map(q => {
      if (q.id === id) {
        return {
          ...q,
          status: q.status === '启用' ? '禁用' : '启用'
        };
      }
      return q;
    }));
  };

  const handleOpenApplyPublic = (q: any) => {
    setQuestionToApplyPublic(q);
    setApplyPublicRange('租户');
    setApplyPublicReason('');
    setIsApplyPublicModalOpen(true);
  };

  const handleOpenOffShelfQuestion = (q: any) => {
    setQuestionToOffShelf(q);
    setOffShelfReason('');
    setIsOffShelfModalOpen(true);
  };

  const handleOffShelfQuestion = () => {
    if (!offShelfReason.trim()) {
      alert('请填写下架说明！');
      return;
    }
    if (!questionToOffShelf) return;
    setQuestionsList(prev => prev.map(item => {
      if (item.id === questionToOffShelf.id) {
        return {
          ...item,
          status: '已下架'
        };
      }
      return item;
    }));
    alert(`试题 "${questionToOffShelf.name}" 已成功下架！`);
    setIsOffShelfModalOpen(false);
    setQuestionToOffShelf(null);
    setOffShelfReason('');
  };

  const handleReShelfQuestion = (q: any) => {
    setQuestionsList(prev => prev.map(item => {
      if (item.id === q.id) {
        return {
          ...item,
          status: '启用'
        };
      }
      return item;
    }));
    alert(`试题 "${q.name}" 已重新上架！`);
  };

  const handleSubmitApplyPublic = () => {
    if (!applyPublicReason.trim()) {
      alert('请填写申请说明！');
      return;
    }
    setIsApplyingPublic(true);
    setTimeout(() => {
      setIsApplyingPublic(false);
      setIsApplyPublicModalOpen(false);
      setQuestionsList(prev => prev.map(item => {
        if (item.id === questionToApplyPublic.id) {
          return {
            ...item,
            scope: applyPublicRange,
            auditStatus: '未审核'
          };
        }
        return item;
      }));
      alert('已成功提交公开申请！');
    }, 1000);
  };

  const handleOpenCheckpoints = (q: any) => {
    setCheckpointQuestion(q);
    setIsCheckpointsModalOpen(true);
    setIsCheckpointFormOpen(false);
    setEditingCheckpoint(null);
    setCheckpointFormName('');
    setCheckpointFormContent('');
    setCheckpointFormDesc('');
    setCheckpointFormRatio(20);
  };

  const handleSaveCheckpoint = () => {
    if (!checkpointQuestion) return;
    if (!checkpointFormName.trim()) {
      alert('请输入检查项名称！');
      return;
    }
    const qId = checkpointQuestion.id;
    const currentList = checkpoints[qId] || [];

    if (editingCheckpoint) {
      // Edit
      const updatedList = currentList.map(item => 
        item.id === editingCheckpoint.id 
          ? { 
              ...item, 
              name: checkpointFormName.trim(), 
              content: checkpointFormContent.trim(), 
              description: checkpointFormDesc.trim(), 
              scoreRatio: Number(checkpointFormRatio) || 0 
            } 
          : item
      );
      setCheckpoints({
        ...checkpoints,
        [qId]: updatedList
      });
    } else {
      // Create
      const newItem = {
        id: Date.now().toString(),
        name: checkpointFormName.trim(),
        content: checkpointFormContent.trim(),
        description: checkpointFormDesc.trim(),
        scoreRatio: Number(checkpointFormRatio) || 0
      };
      setCheckpoints({
        ...checkpoints,
        [qId]: [...currentList, newItem]
      });
    }
    setIsCheckpointFormOpen(false);
    setEditingCheckpoint(null);
  };

  const handleDeleteCheckpoint = (itemId: string) => {
    if (!checkpointQuestion) return;
    if (confirm('确定要删除该检查项吗？')) {
      const qId = checkpointQuestion.id;
      const currentList = checkpoints[qId] || [];
      const updatedList = currentList.filter(item => item.id !== itemId);
      setCheckpoints({
        ...checkpoints,
        [qId]: updatedList
      });
    }
  };

  const handleSaveQuestion = () => {
    const finalTitle = newQuestionBody;

    if (!newQuestionBody.trim()) {
      alert('请输入题目内容！');
      return;
    }

    if (newQuestionType === '填空题') {
      const totalProportion = blanks.reduce((sum, b) => sum + (b.proportion || 0), 0);
      if (totalProportion !== 100) {
        alert('得分占比的总和必须为 100%！当前总占比为 ' + totalProportion + '%');
        return;
      }

      const emptyBlank = blanks.find(b => !b.value.trim());
      if (emptyBlank) {
        alert(`请输入${emptyBlank.name}的正确答案！`);
        return;
      }

      const emptyKeyword = scoreItems.find(item => !item.keywords.trim());
      if (emptyKeyword) {
        const correspondingBlank = blanks.find(b => b.id === emptyKeyword.blankId);
        alert(`请填写对应于${correspondingBlank?.name || '填空'}的得分关键词！`);
        return;
      }
    }

    if (newQuestionType === '简答题') {
      if (!correctAnswerText.trim()) {
        alert('请输入检查脚本的配置内容！');
        return;
      }
    }

    if (!newQuestionBank) {
      alert('请选择所属题库！');
      return;
    }

    if (editingQuestion) {
      setQuestionsList(questionsList.map(q => {
        if (q.id === editingQuestion.id) {
          return {
            ...q,
            name: finalTitle,
            bank: newQuestionBank,
            type: newQuestionType,
            status: newQuestionStatus,
            difficulty: newQuestionDifficulty || '中等',
            tags: tags.slice(0, 2).join(', ') || '',
            updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
            blanks: newQuestionType === '填空题' ? blanks : undefined,
            scoreItems: newQuestionType === '填空题' ? scoreItems : undefined,
            correctAnswer: newQuestionType === '简答题' ? correctAnswerText : undefined,
            shixunDescription: newQuestionType === '实训题' ? shixunDescription : undefined,
            shixunDatasets: newQuestionType === '实训题' ? [...shixunDatasets] : undefined,
            datasetSyncStatuses: newQuestionType === '实训题' ? { ...datasetSyncStatuses } : undefined,
            shixunAnswerType: newQuestionType === '实训题' ? shixunAnswerType : undefined,
            shixunResourcePool: newQuestionType === '实训题' ? shixunResourcePool : undefined,
            shixunEnvType: newQuestionType === '实训题' ? shixunEnvType : undefined,
          };
        }
        return q;
      }));
    } else {
      const newQuestion = {
        id: Date.now(),
        name: finalTitle,
        bank: newQuestionBank,
        type: newQuestionType,
        status: newQuestionStatus,
        source: '人工出题',
        difficulty: newQuestionDifficulty || '中等',
        tags: tags.slice(0, 2).join(', ') || '智能体',
        grading: '自动评分',
        creator: 'Momodel',
        updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
        scope: '私有',
        auditStatus: '未审核',
        blanks: newQuestionType === '填空题' ? blanks : undefined,
        scoreItems: newQuestionType === '填空题' ? scoreItems : undefined,
        correctAnswer: newQuestionType === '简答题' ? correctAnswerText : undefined,
        shixunDescription: newQuestionType === '实训题' ? shixunDescription : undefined,
        shixunDatasets: newQuestionType === '实训题' ? [...shixunDatasets] : undefined,
        datasetSyncStatuses: newQuestionType === '实训题' ? { ...datasetSyncStatuses } : undefined,
        shixunAnswerType: newQuestionType === '实训题' ? shixunAnswerType : undefined,
        shixunResourcePool: newQuestionType === '实训题' ? shixunResourcePool : undefined,
        shixunEnvType: newQuestionType === '实训题' ? shixunEnvType : undefined,
      };
      setQuestionsList([newQuestion, ...questionsList]);
    }

    handleCloseCreateModal();
  };

  const questionTypes = ['单选题', '多选题', '判断题', '填空题', '简答题', '实训题'];
  const filteredTags = tags.filter(tag => tag.toLowerCase().includes(searchTagQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      {view === 'list' ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
            <div className="flex items-end gap-4">
              <h1 className="text-xl font-bold text-neutral-900">试题管理</h1>
              <p className="text-sm text-neutral-500 mb-0.5">新建试题、仅展示公开或您个人题库内试题，试题“启用”后可用于组卷</p>
            </div>
          </div>

          {/* Table and Toolbar unified module */}
          <div className="bg-white rounded border border-neutral-border overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入要搜索的内容"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0">
                  <Plus className="w-3.5 h-3.5" /> 新建试题
                </Button>
                <Button onClick={() => setView('ai')} variant="outline" className="flex items-center h-9 px-4 border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] bg-white rounded-[4px] text-xs font-medium cursor-pointer shadow-sm">
                  智能出题
                </Button>
                <Button onClick={() => setIsBankListModalOpen(true)} variant="outline" className="flex items-center h-9 px-4 border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-[#fff2e8]/30 transition-all cursor-pointer bg-white rounded-[4px] text-xs font-medium shadow-sm">
                  题库管理
                </Button>
                <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="flex items-center h-9 px-4 border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-[#fff2e8]/30 transition-all cursor-pointer bg-white rounded-[4px] text-xs font-medium shadow-sm">
                  导入
                </Button>
                <Button onClick={() => setIsBatchPublicOpen(true)} variant="outline" className="flex items-center h-9 px-4 border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-[#fff2e8]/30 transition-all cursor-pointer bg-white rounded-[4px] text-xs font-medium shadow-sm">
                  批量公开
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="pl-6 pr-3 py-3.5 font-medium w-12 text-left">
                      <button 
                        type="button"
                        onClick={() => toggleSelectAll(selectedQuestions.length !== filteredQuestions.length || filteredQuestions.length === 0)}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                          selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0
                            ? "bg-[#fa541c] border-[#fa541c] text-white"
                            : "border-neutral-300 hover:border-[#fa541c] bg-white"
                        )}
                      >
                        {selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">试题名称</th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">所属题库 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">题型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">来源</th>
                    <th className="px-3 py-3.5 font-medium text-left">难度</th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">标签 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">创建人</th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">更新时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">试题范围 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="px-3 py-3.5 font-medium text-left">
                      <div className="flex items-center gap-1.5">审核状态 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q, index) => (
                    <tr key={q.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredQuestions.length - 1 && "border-b-0")}>
                      <td className="pl-6 pr-3 py-3 text-left">
                        <button 
                          type="button"
                          onClick={() => toggleSelect(q.id)}
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                            selectedQuestions.includes(q.id)
                              ? "bg-[#fa541c] border-[#fa541c] text-white"
                              : "border-neutral-300 hover:border-[#fa541c] bg-white"
                          )}
                        >
                          {selectedQuestions.includes(q.id) && <span className="text-[10px] font-bold">✓</span>}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-neutral-800 max-w-[160px] truncate" title={q.name}>{q.name}</div>
                      </td>
                      <td className="px-3 py-3 text-neutral-600">
                        <div className="max-w-[130px] truncate" title={q.bank}>{q.bank}</div>
                      </td>
                      <td className="px-3 py-3 text-neutral-800">{q.type}</td>
                      <td className="px-3 py-3">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium", 
                          q.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : 
                          q.status === '数据集同步中' ? "bg-blue-50 text-blue-600 border-blue-200" :
                          q.status === '数据集同步失败' ? "bg-red-50 text-red-500 border-red-200" :
                          q.status === '已下架' ? "bg-neutral-100 text-neutral-600 border-neutral-200" :
                          "bg-neutral-50 text-neutral-500 border-neutral-200"
                        )}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-neutral-600">{q.source}</td>
                      <td className="px-3 py-3 text-neutral-600">{q.difficulty}</td>
                      <td className="px-3 py-3 text-neutral-600">
                        <div className="max-w-[100px] truncate" title={q.tags || '-'}>{q.tags || '-'}</div>
                      </td>
                      <td className="px-3 py-3 text-neutral-600">{q.creator}</td>
                      <td className="px-3 py-3 text-neutral-500 text-[12px]">{q.updateTime}</td>
                      <td className="px-3 py-3">
                        {q.scope === '私有' && (
                          <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded text-[12px] text-neutral-600">私有</span>
                        )}
                        {q.scope === '租户' && (
                          <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[12px] text-blue-600">租户</span>
                        )}
                        {q.scope === '平台' && (
                          <span className="px-2 py-0.5 bg-[#fff2e8] border border-[#ffbb96] rounded text-[12px] text-[#fa541c]">平台</span>
                        )}
                        {!['私有', '租户', '平台'].includes(q.scope) && (
                          <span className="px-2 py-0.5 bg-[#fff2e8] border border-[#ffbb96] rounded text-[12px] text-[#fa541c]">{q.scope}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {q.auditStatus === '已通过' ? (
                          <span className="text-green-600">已通过</span>
                        ) : q.auditStatus === '未审核' ? (
                          <span className="text-amber-500">未审核</span>
                        ) : (
                          <span className="text-neutral-500">{q.auditStatus}</span>
                        )}
                      </td>
                      <td className="pl-3 pr-6 py-3">
                        <div className="flex items-center gap-2.5">
                          {(() => {
                            // Gather all available actions for this row
                            const isLastFew = index >= filteredQuestions.length - 2 && index >= 1;
                            const rowActions = [
                              { label: '详情', onClick: () => setViewingQuestion(q), isDanger: false },
                              { label: '编辑', onClick: () => handleEditQuestion(q), isDanger: false },
                            ];
                            
                            if (q.status === '启用') {
                              rowActions.push({ label: '公开', onClick: () => handleOpenApplyPublic(q), isDanger: false });
                            }
                            
                            if (q.status === '已下架') {
                              rowActions.push({ label: '重新上架', onClick: () => handleReShelfQuestion(q), isDanger: false });
                            } else {
                              rowActions.push({ label: '下架', onClick: () => handleOpenOffShelfQuestion(q), isDanger: false });
                            }

                            if (q.type === '实训题') {
                              rowActions.push({ label: '检查项', onClick: () => handleOpenCheckpoints(q), isDanger: false });
                            }
                            
                            rowActions.push({ 
                              label: q.status === '启用' ? '停用' : '启用', 
                              onClick: () => toggleQuestionStatus(q.id), 
                              isDanger: false 
                            });
                            
                            rowActions.push({ 
                              label: '复制', 
                              onClick: () => handleOpenCopyDrawer(q), 
                              isDanger: false 
                            });
                            
                            rowActions.push({ 
                              label: '删除', 
                              onClick: () => setQuestionsList(questionsList.filter(item => item.id !== q.id)), 
                              isDanger: true 
                            });

                            const visibleActions = rowActions.slice(0, 2);
                            const dropdownActions = rowActions.slice(2);

                            return (
                              <>
                                {visibleActions.map((act) => (
                                  <button
                                    key={act.label}
                                    type="button"
                                    onClick={act.onClick}
                                    className={cn(
                                      "text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap",
                                      act.isDanger && "text-red-500 hover:text-red-700"
                                    )}
                                  >
                                    {act.label}
                                  </button>
                                ))}

                                {dropdownActions.length > 0 && (
                                  <div className="relative inline-block">
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdownId(activeDropdownId === q.id ? null : q.id);
                                      }}
                                      className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap"
                                    >
                                      <span>更多</span>
                                      <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-neutral-405", activeDropdownId === q.id && "rotate-180")} />
                                    </button>
                                    
                                    {activeDropdownId === q.id && (
                                      <div 
                                        className={cn(
                                          "absolute right-0 w-20 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[60] overflow-hidden py-1 animate-in fade-in duration-150",
                                          isLastFew 
                                            ? "bottom-full mb-1.5 slide-in-from-bottom-1" 
                                            : "top-full mt-1.5 slide-in-from-top-1"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {dropdownActions.map((act) => (
                                          <button 
                                            key={act.label}
                                            type="button"
                                            onClick={() => {
                                              act.onClick();
                                              setActiveDropdownId(null);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs transition-colors bg-transparent border-0 cursor-pointer block font-medium text-neutral-700 hover:bg-orange-50/40 hover:text-[#fa541c]"
                                          >
                                            {act.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-end px-6 py-4 gap-4 border-t border-neutral-border/30">
              <span className="text-[13px] text-neutral-500">共 {filteredQuestions.length} 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm">&gt;</Button>
              </div>
              <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600">
                <option>10 条/页</option>
                <option>20 条/页</option>
                <option>50 条/页</option>
              </select>
            </div>
          </div>
        </>
      ) : view === 'bank-detail' ? (
        /* 题库详情界面 (橙色主题, 参考作业详情留白) */
        <div className="animate-fade-in -mx-6 -mt-6 min-h-[calc(100vh-56px)] bg-[#f5f7fa] pb-12 text-left">
          {/* Inject style for floating animation */}
          <style>{`
            @keyframes float {
              0% { transform: translateY(0px) rotate(12deg); }
              50% { transform: translateY(-10px) rotate(10deg); }
              100% { transform: translateY(0px) rotate(12deg); }
            }
            .style-floating-element {
              animation: float 4s ease-in-out infinite;
            }
          `}</style>
          
          {/* Top orange gradient banner */}
          <div className="relative bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#fa541c] pt-6 pb-16 text-white select-none overflow-hidden shrink-0">
            {/* Background circular decorations referencing assignment preview */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full"></div>
              <div className="absolute -right-10 top-10 w-[300px] h-[300px] border-[2px] border-white/10 rounded-full"></div>
            </div>

            {/* 3D Glassmorphic Cube/Sphere floats on the right side */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 overflow-visible pointer-events-none hidden md:block">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Glow circle */}
                <div className="absolute w-40 h-40 rounded-full bg-white/20 blur-xl animate-pulse"></div>
                {/* Rotating Outer Rings */}
                <div className="absolute w-36 h-36 border border-white/20 rounded-full animate-[spin_12s_linear_infinite] border-dashed"></div>
                <div className="absolute w-28 h-28 border border-white/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                {/* Inner floating cube/sphere */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-white/30 to-white/15 backdrop-blur-md border border-white/45 shadow-2xl rotate-12 flex items-center justify-center style-floating-element">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-[#fa541c] to-[#ff7875] opacity-85 shadow-sm transform -rotate-12 border border-white/25"></div>
                </div>
                {/* Secondary floating dots */}
                <div className="absolute top-6 right-6 w-5 h-5 rounded-full bg-[#ff7875] opacity-75 blur-[1px] animate-[float_3s_ease-in-out_infinite_alternate]"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-white opacity-60 blur-[0.5px] animate-[float_5s_ease-in-out_infinite_alternate]"></div>
              </div>
            </div>

            {/* Content info (centered & aligned horizontally with the card container) */}
            <div className="max-w-5xl mx-auto px-6 w-full relative z-10 flex flex-col">
              {/* Breadcrumbs - Line 1: back button link inline */}
              <div className="flex items-center gap-2 text-[12px] text-white/70 mb-4 font-medium tracking-wider">
                <button 
                  onClick={() => {
                    setView('list');
                    setViewingBankDetail(null);
                  }} 
                  className="hover:text-white transition-colors flex items-center gap-1 font-bold border-0 bg-transparent p-0 cursor-pointer text-white/70"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> 题库管理
                </button>
              </div>
              
              {/* Big Title - Line 2 */}
              <h1 className="text-[28px] font-bold mb-4 tracking-wider leading-tight">
                {viewingBankDetail?.name || '人工智能通识E-大模型技术进阶'}
              </h1>

              {/* Creator info - Line 3 */}
              <div className="flex items-center gap-6 text-[13px] text-white/90">
                <span>创建人：{viewingBankDetail?.creator || 'Momodel'}</span>
              </div>
            </div>
          </div>

          {/* Main Card Container (styled with exact shadow and borders of assignment detail card) */}
          <div className="max-w-5xl mx-auto px-6 relative z-10 -mt-8 pb-20">
            <div className="bg-white rounded-t-xl rounded-b-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 min-h-[400px] border border-neutral-100">
              {(() => {
                const bankQuestions = getQuestionsForBank(viewingBankDetail?.name || '', questionsList);
                const groupedQuestions: { [key: string]: any[] } = {};
                
                // Group them by type
                bankQuestions.forEach(q => {
                  if (!groupedQuestions[q.type]) {
                    groupedQuestions[q.type] = [];
                  }
                  groupedQuestions[q.type].push(q);
                });

                // Calculate global index offsets for group headers
                let currentGlobalIndex = 1;
                const groupsInfo = Object.entries(groupedQuestions).map(([type, list]) => {
                  const startIdx = currentGlobalIndex;
                  const endIdx = currentGlobalIndex + list.length - 1;
                  currentGlobalIndex += list.length;
                  return {
                    type,
                    list,
                    startIdx,
                    endIdx,
                    totalPoints: list.length * 20
                  };
                });

                if (groupsInfo.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 text-sm gap-2">
                      <Database className="w-12 h-12 stroke-[1.2] text-neutral-300 animate-pulse" />
                      <span>该题库内暂无可用试题</span>
                    </div>
                  );
                }

                return (
                  <div className="space-y-10">
                    {groupsInfo.map((group) => (
                      <div key={group.type} className="animate-slide-up">
                        {/* Group Header */}
                        <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3.5 mb-6 text-left">
                          <div className="w-5.5 h-5.5 rounded-full bg-orange-50 border border-orange-100 text-[#fa541c] flex items-center justify-center flex-shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="text-[14px] font-bold text-neutral-800">
                            {group.type}
                          </span>
                          <span className="text-[12px] text-neutral-400 font-medium">
                            {group.startIdx === group.endIdx 
                              ? `(第 ${group.startIdx} 题，每题 20 分，共 20 分)`
                              : `(第 ${group.startIdx}-${group.endIdx} 题，每题 20 分，共 ${group.totalPoints} 分)`
                            }
                          </span>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-8 pl-1">
                          {group.list.map((q, qIndex) => {
                            const number = group.startIdx + qIndex;
                            const isChoice = ['单选题', '多选题'].includes(q.type);
                            
                            return (
                              <div key={q.id || qIndex} className="text-left space-y-3.5">
                                {/* Question Title */}
                                <h4 className="text-[14px] font-bold text-neutral-800 leading-snug">
                                  {number}、{q.name}
                                </h4>

                                {/* Options (For single & multiple choices) */}
                                {isChoice && (
                                  <div className="space-y-3 pl-5">
                                    {getQuestionOptions(q).map((optText: string, optIdx: number) => {
                                      const letter = String.fromCharCode(65 + optIdx);
                                      return (
                                        <div key={letter} className="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed font-semibold">
                                          <span className="font-bold text-neutral-400 w-4 select-none shrink-0">{letter}</span>
                                          <span>{optText}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Underline for fill-in-the-blank or basic placeholder for other types */}
                                {q.type === '填空题' && (
                                  <div className="pl-5 text-xs text-neutral-400 italic">
                                    （答题栏：______________________________________）
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        /* AI出题助手界面 */
        <div className="h-[calc(100vh-56px)] flex flex-col bg-white overflow-hidden animate-fade-in -mx-6 -my-6">
          {/* 顶部通栏标题栏 */}
          <div className="h-14 border-b border-neutral-200/60 flex items-center justify-between px-6 bg-white flex-shrink-0 relative">
            {/* 顶部左侧返回智能出题 */}
            <button 
              onClick={() => setView('list')} 
              className="flex items-center gap-1.5 text-xs text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent px-1 py-1.5 z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> 返回智能出题
            </button>
            
            <div className="w-28"></div> 
          </div>

          <div className="flex flex-1 min-h-0">
            {/* 左侧侧边栏 */}
            <div className="w-64 border-r border-neutral-100 flex flex-col bg-neutral-50/20">
              {/* 新建对话按钮 */}
              <div className="p-4 border-b border-neutral-100">
                <button 
                  onClick={() => {
                    setMessages([
                      {
                        sender: 'assistant',
                        text: `你好！我是你的 AI 出题助手，专门为你生成符合要求的各类题目。无论是人工智能、计算机、数学、历史或其他领域，我都能根据你指定的主题、难度和题型，快速生成清晰准确的题目。
  
  请按照以下题目「示例格式」输入试题内容要求，我会立即为你定制高质量的题目：
  请生成主题为《人工智能通识》的试题。每道题需包含：
  
  1. 题目（必填）：
  2. 关键概念/知识点（选填）：
  3. 难度（必填）：容易/较易/中等/较难/困难
  4. 标签（选填）：
  5. 题型分布与题量（必填）：例如 -> 单选题 1 题，多选题 1 题，判断题 1 题，填空题 1 题，简答题 1 题，实训题 1 题`
                      }
                    ]);
                    setImportedIndexes([]);
                  }}
                  className="w-full bg-white border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 新建对话
                </button>
              </div>

              {/* 对话列表 */}
              <div className="flex-1 overflow-y-auto">
                <div className="mx-3 mt-3 bg-[#fff2e8] text-[#fa541c] flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>新的对话</span>
                </div>
              </div>

              {/* 侧边栏底部 */}
              <div className="p-4 border-t border-neutral-100 text-[11px] text-neutral-400 font-medium">
                © 出题助手 2026
              </div>
            </div>

            {/* 右侧主对话视窗 */}
            <div className="flex-1 flex flex-col bg-white">
              {/* 气泡对话框滚动区域 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-neutral-50/10 flex flex-col">
                <h2 className="text-sm font-bold text-neutral-800 pb-3 border-b border-neutral-100 mb-2">新的对话</h2>
                
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex gap-3 max-w-[85%] animate-fade-in",
                      msg.sender === 'user' ? "ml-auto justify-end self-end" : "justify-start self-start"
                    )}
                  >
                    {/* AI头像 */}
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-[#fff2e8] border border-[#ffbb96] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#fa541c]" />
                      </div>
                    )}

                    {/* 消息气泡 */}
                    <div 
                      className={cn(
                        "p-4 rounded-2xl shadow-sm text-xs leading-relaxed transition-all",
                        msg.sender === 'user' 
                          ? "bg-[#fa541c] text-white rounded-tr-none" 
                          : "bg-white border border-neutral-200/80 text-neutral-800 rounded-tl-none space-y-4"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* AI生成的试题展示卡片 */}
                      {msg.sender === 'assistant' && msg.questionCard && (
                        <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-neutral-50/50 w-full max-w-[520px] transition-all animate-slide-up">
                          {/* 题卡头部 */}
                          <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] rounded text-[10px] font-bold">
                              {msg.questionCard.type}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium bg-white px-2 py-0.5 rounded border border-neutral-100">
                              难度: {msg.questionCard.difficulty}
                            </span>
                          </div>
                          
                          {/* 题卡正文 */}
                          <div className="p-4 space-y-3.5">
                            <h4 className="text-xs font-bold text-neutral-800 leading-snug">{msg.questionCard.name}</h4>
                            
                            {/* 选择题选项 */}
                            {msg.questionCard.options && (
                              <div className="space-y-2">
                                {msg.questionCard.options.map((opt: string, idx: number) => {
                                  const letter = String.fromCharCode(65 + idx);
                                  return (
                                    <div key={letter} className="flex items-start gap-2.5 text-xs text-neutral-700">
                                      <span className="font-bold text-neutral-500 bg-neutral-100/80 border border-neutral-200/60 rounded w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] shadow-sm">
                                        {letter}
                                      </span>
                                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* 细分割线 */}
                            <div className="border-t border-neutral-200/50 my-2"></div>

                            {/* 答案与深度解析栏 */}
                            <div className="bg-[#fff2e8]/40 border border-[#ffbb96]/40 rounded-xl p-3.5 space-y-2">
                              <div className="text-xs text-[#fa541c] font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                                <span>正确答案：</span>
                                <span className="px-2 py-0.5 bg-[#fa541c] text-white rounded text-[10px] font-bold shadow-sm">{msg.questionCard.correct}</span>
                              </div>
                              <div className="text-[11px] text-neutral-600 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-neutral-100">
                                <span className="font-bold text-neutral-700 block mb-1">解析：</span>
                                {msg.questionCard.analysis}
                              </div>
                            </div>
                          </div>

                          {/* 题卡保存按钮 */}
                          <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center">
                            <button
                              onClick={() => handleImportQuestion(msg.questionCard, index)}
                              disabled={importedIndexes.includes(index)}
                              className={cn(
                                "w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm cursor-pointer",
                                importedIndexes.includes(index)
                                  ? "bg-green-50 text-green-600 border border-green-200"
                                  : "bg-[#fa541c] hover:bg-[#e84a15] text-white"
                              )}
                            >
                              {importedIndexes.includes(index) ? (
                                <>✓ 已成功导入试题库</>
                              ) : (
                                <>
                                  <Database className="w-3.5 h-3.5 animate-bounce" /> 导入到试题库
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* AI正在输入动效 */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%] animate-fade-in self-start justify-start">
                    <div className="w-8 h-8 rounded-full bg-[#fff2e8] border border-[#ffbb96] flex items-center justify-center flex-shrink-0 animate-pulse shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#fa541c]" />
                    </div>
                    <div className="bg-white border border-neutral-200/80 rounded-2xl rounded-tl-none py-3.5 px-4 shadow-sm text-xs text-neutral-500 font-medium italic flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce delay-150"></span>
                        <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce delay-300"></span>
                      </div>
                      <span>出题助手正在智能生成试题中...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部交互输入区域 */}
              <div className="p-4 border-t border-neutral-100 bg-white">
                <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="请输入试题生成要求，如：生成主题为《深度学习》的试题，包含多选题。"
                    className="flex-1 bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none resize-none h-6 custom-scrollbar leading-relaxed"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage();
                      }
                    }}
                  />
                  <div className="text-[10px] text-neutral-400 font-mono select-none">
                    {chatInput.length}
                  </div>
                  <button
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim()}
                    className="text-[#fa541c] hover:text-[#e84a15] disabled:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建试题 Drawer (从界面右侧展示) */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={handleCloseCreateModal}
        >
          <div 
            className="bg-white w-full max-w-[840px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                {editingQuestion ? <Edit className="w-5 h-5 text-[#fa541c]" /> : <Plus className="w-5 h-5 text-[#fa541c]" />}
                {editingQuestion ? '编辑试题' : '新建试题'}
              </h2>
              <button 
                onClick={handleCloseCreateModal}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
              {/* Question Type Classification (Tabs) */}
              <div className="space-y-2">
                <div className="border-b border-neutral-200 flex gap-5 overflow-x-auto no-scrollbar">
                  {questionTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewQuestionType(type)}
                      className={cn(
                        "pb-2 text-[13px] font-medium transition-all relative whitespace-nowrap cursor-pointer -mb-[1px] border-b-2",
                        newQuestionType === type
                          ? "text-[#fa541c] font-bold border-[#fa541c]"
                          : "text-neutral-500 hover:text-neutral-800 border-transparent"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdowns (Belonging Bank, Difficulty) */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  所属题库 <span className="text-[#fa541c]">*</span>
                </label>
                <div ref={singleQuestionBankDropdownRef} className="relative w-full text-xs">
                  <div
                    onClick={() => setIsQuestionBankDropdownOpen(!isQuestionBankDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                      isQuestionBankDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(newQuestionBank ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {newQuestionBank || "请选择所属题库"}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isQuestionBankDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isQuestionBankDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setNewQuestionBank("");
                            setIsQuestionBankDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !newQuestionBank 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择所属题库</span>
                          {!newQuestionBank && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {banksList.map(bank => {
                          const isSelected = newQuestionBank === bank.name;
                          return (
                            <div
                              key={bank.id}
                              onClick={() => {
                                setNewQuestionBank(bank.name);
                                setIsQuestionBankDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{bank.name}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Difficulty */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  选择难度 <span className="text-[#fa541c]">*</span>
                </label>
                <div ref={singleQuestionDifficultyDropdownRef} className="relative w-full text-xs">
                  <div
                    onClick={() => setIsQuestionDifficultyDropdownOpen(!isQuestionDifficultyDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                      isQuestionDifficultyDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(newQuestionDifficulty ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {newQuestionDifficulty || "请选择试题难度"}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isQuestionDifficultyDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isQuestionDifficultyDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setNewQuestionDifficulty("");
                            setIsQuestionDifficultyDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !newQuestionDifficulty 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择试题难度</span>
                          {!newQuestionDifficulty && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {['容易', '较易', '中等', '较难', '困难'].map(diff => {
                          const isSelected = newQuestionDifficulty === diff;
                          return (
                            <div
                              key={diff}
                              onClick={() => {
                                setNewQuestionDifficulty(diff);
                                setIsQuestionDifficultyDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{diff}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Field */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  标签
                </label>
                <div ref={questionTagDropdownRef} className="relative w-full text-xs">
                  <div
                    onClick={() => setIsQuestionTagDropdownOpen(!isQuestionTagDropdownOpen)}
                    className={cn(
                      "min-h-[36px] w-full border border-neutral-200 rounded px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all text-neutral-700 bg-white cursor-pointer select-none",
                      isQuestionTagDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    {tags.length === 0 ? (
                      <span className="text-neutral-400 select-none">请选择标签</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 items-center w-full pr-8">
                        {tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-medium"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTags(tags.filter(t => t !== tag));
                              }}
                              className="hover:bg-black/10 rounded p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center border-0"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Right arrow */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                      <ChevronDown 
                        className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isQuestionTagDropdownOpen && "rotate-180")} 
                      />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isQuestionTagDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {ALL_SYSTEM_TAGS.map(tag => {
                          const isSelected = tags.includes(tag);
                          return (
                            <div
                              key={tag}
                              onClick={() => {
                                if (isSelected) {
                                  setTags(tags.filter(t => t !== tag));
                                } else {
                                  setTags([...tags, tag]);
                                }
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{tag}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Question Body Editor */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                  题目 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="w-full">
                  <RichTextEditor
                    label=""
                    value={newQuestionBody}
                    onChange={setNewQuestionBody}
                    placeholder="请输入题目正文..."
                  />
                </div>
              </div>

              {/* Answer Options ABCD (Show only for single and multiple selection) */}
              {newQuestionType === '单选题' ? (
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    答案选项 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="space-y-3.5 w-full">
                    {options.map((opt) => (
                      <RichTextEditor
                        key={opt.id}
                        label={`选项${opt.key}`}
                        value={opt.value}
                        onChange={(val) => {
                          setOptions(options.map(o => o.id === opt.id ? { ...o, value: val } : o));
                        }}
                        placeholder={`请输入选项${opt.key}的内容...`}
                        isCollapsible
                        onDelete={options.length > 2 ? () => handleDeleteOption(opt.id) : undefined}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded-[4px] hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                    >
                      <Plus className="w-3.5 h-3.5" /> 增加选项
                    </button>
                  </div>
                </div>
              ) : (
                (newQuestionType === '多选题') && (
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      答案选项 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="space-y-3.5 w-full">
                      {options.map((opt) => (
                        <RichTextEditor
                          key={opt.id}
                          label={`选项${opt.key}`}
                          value={opt.value}
                          onChange={(val) => {
                            setOptions(options.map(o => o.id === opt.id ? { ...o, value: val } : o));
                          }}
                          placeholder={`请输入选项${opt.key}的内容...`}
                          isCollapsible
                          onDelete={options.length > 2 ? () => handleDeleteOption(opt.id) : undefined}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded-[4px] hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                      >
                        <Plus className="w-3.5 h-3.5" /> 增加选项
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* Fill-in-the-blank (填空题) Fields */}
              {newQuestionType === '填空题' && (
                <div className="space-y-5 animate-slide-up">
                  {/* 试题答案 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      试题答案 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="space-y-3.5 w-full">
                      {blanks.map((blank) => (
                        <div key={blank.id} className="flex items-center gap-3 w-full bg-white border border-neutral-200 rounded p-2 focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all">
                          <span className="text-xs font-bold text-neutral-500 min-w-[50px] shrink-0 pl-1">{blank.name}</span>
                          <input
                            type="text"
                            value={blank.value}
                            onChange={(e) => {
                              setBlanks(blanks.map(b => b.id === blank.id ? { ...b, value: e.target.value } : b));
                            }}
                            placeholder={`请输入${blank.name}的正确答案`}
                            className="flex-1 bg-transparent border-0 outline-none text-xs text-neutral-700 placeholder:text-neutral-400"
                          />
                          {blanks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteBlank(blank.id)}
                              className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                              title="删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 得分关键词 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      得分关键词 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="space-y-3 w-full text-left">
                      <div className="border border-neutral-200 rounded overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-600 font-bold">
                              <th className="px-3 py-2.5 w-1/4">填空名称</th>
                              <th className="px-3 py-2.5 w-1/2">得分关键词</th>
                              <th className="px-3 py-2.5 w-1/4">得分比例</th>
                              <th className="px-3 py-2.5 w-16 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scoreItems.map((item) => {
                              const keywordsList: string[] = Array.isArray(item.keywords)
                                ? item.keywords
                                : (typeof item.keywords === 'string' && item.keywords.trim() ? item.keywords.split(',').map(s => s.trim()) : []);

                              return (
                                <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                                  {/* 填空名称 */}
                                  <td className="px-3 py-2">
                                    <div className="flex items-center border border-neutral-200 rounded px-2.5 py-1 bg-white focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all">
                                      <select
                                        value={item.blankId}
                                        onChange={(e) => {
                                          setScoreItems(scoreItems.map(si => si.id === item.id ? { ...si, blankId: e.target.value } : si));
                                        }}
                                        className="w-full bg-transparent text-xs text-neutral-700 outline-none border-0 cursor-pointer"
                                      >
                                        {blanks.map(b => (
                                          <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>

                                  {/* 得分关键词 */}
                                  <td className="px-3 py-2">
                                    <div className="flex flex-col gap-2 py-1">
                                      {keywordsList.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2">
                                          {keywordsList.map((kw, idx) => (
                                            <span
                                              key={idx}
                                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f0f2f5] text-xs text-neutral-700 font-medium shrink-0"
                                            >
                                              <span>{kw}</span>
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveKeywordTag(item.id, idx)}
                                                className="text-neutral-400 hover:text-[#fa541c] transition-colors border-0 bg-transparent p-0 cursor-pointer flex items-center justify-center ml-0.5 group"
                                              >
                                                <X className="w-3.5 h-3.5 stroke-[2.5] text-neutral-400 group-hover:text-[#fa541c] transition-colors" />
                                              </button>
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      <div className="w-full flex items-center border border-neutral-200 rounded-[6px] px-3 py-1 bg-white focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all">
                                        <input
                                          type="text"
                                          value={draftKeywords[item.id] || ''}
                                          onChange={(e) => setDraftKeywords({ ...draftKeywords, [item.id]: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              handleAddKeywordTag(item.id);
                                            }
                                          }}
                                          onBlur={() => handleAddKeywordTag(item.id)}
                                          placeholder="请输入内容，按回车"
                                          className="w-full bg-transparent border-0 outline-none text-xs text-neutral-700 placeholder:text-neutral-400"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  {/* 得分比例 */}
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-1 border border-neutral-200 rounded bg-white overflow-hidden max-w-[130px] focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setScoreItems(scoreItems.map(si => si.id === item.id ? { ...si, ratio: Math.max(0, Number(si.ratio || 0) - 10) } : si));
                                        }}
                                        className="w-8 h-7 text-neutral-500 hover:bg-neutral-100 hover:text-[#fa541c] font-bold border-r border-neutral-200 transition-colors cursor-pointer shrink-0"
                                      >
                                        -
                                      </button>
                                      <span className="flex-1 text-center font-bold text-xs select-none text-neutral-700">
                                        {item.ratio}%
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setScoreItems(scoreItems.map(si => si.id === item.id ? { ...si, ratio: Math.min(100, Number(si.ratio || 0) + 10) } : si));
                                        }}
                                        className="w-8 h-7 text-neutral-500 hover:bg-neutral-100 hover:text-[#fa541c] font-bold border-l border-neutral-200 transition-colors cursor-pointer shrink-0"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>

                                  {/* 操作 */}
                                  <td className="px-3 py-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteScoreItem(item.id)}
                                      className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer border-0 bg-transparent"
                                      title="删除得分项"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* 下方提示文字 */}
                      <div className="text-[12px] font-normal text-neutral-400 mt-2.5 leading-relaxed">
                        单个得分项匹配到一个关键词即可按照得分比例得分，单个填空按照匹配到得分项按照得分比例累加得分
                      </div>

                      {/* 添加得分项 */}
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handleAddScoreItem}
                          className="text-[#fa541c] hover:text-[#e84a15] text-xs font-bold border-0 bg-transparent p-0 cursor-pointer transition-colors flex items-center gap-1"
                        >
                          添加得分项
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 得分占比 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      得分占比 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="space-y-4 w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {blanks.map((b) => (
                          <div key={b.id} className="border border-neutral-200 rounded p-2.5 bg-white flex flex-col gap-1.5 shadow-sm">
                            <span className="text-xs font-bold text-neutral-600">{b.name} 占比</span>
                            <div className="flex items-center gap-1 border border-neutral-200 rounded bg-white overflow-hidden">
                              <button
                                type="button"
                                onClick={() => {
                                  setBlanks(blanks.map(blank => blank.id === b.id ? { ...blank, proportion: Math.max(0, blank.proportion - 5) } : blank));
                                }}
                                className="w-8 h-7 text-neutral-500 hover:bg-neutral-100 hover:text-[#fa541c] font-bold border-r border-neutral-200 transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-bold text-xs select-none">
                                {b.proportion}%
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setBlanks(blanks.map(blank => blank.id === b.id ? { ...blank, proportion: Math.min(100, blank.proportion + 5) } : blank));
                                }}
                                className="w-8 h-7 text-neutral-500 hover:bg-neutral-100 hover:text-[#fa541c] font-bold border-l border-neutral-200 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(() => {
                        const totalProportion = blanks.reduce((sum, b) => sum + (b.proportion || 0), 0);
                        const isCorrect = totalProportion === 100;
                        return (
                          <div className={cn(
                            "px-3 py-2 rounded text-xs flex items-center justify-between border",
                            isCorrect 
                              ? "bg-green-50 border-green-200 text-green-700 animate-fade-in" 
                              : "bg-amber-50 border-amber-200 text-amber-700 animate-fade-in"
                          )}>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold">当前总占比: {totalProportion}%</span>
                              <span>(必须为100%)</span>
                            </div>
                            {isCorrect ? (
                              <span className="font-bold text-green-700 flex items-center gap-1">✓ 占比正确</span>
                            ) : (
                              <span className="font-bold text-amber-700 flex items-center gap-1">⚠ 比例之和不等于100%</span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Practical Question (实训题) Fields */}
              {newQuestionType === '实训题' && (
                <div className="space-y-5 animate-slide-up">
                  
                  {/* 试题内容说明 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      内容说明 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="w-full">
                      <RichTextEditor
                        label=""
                        value={shixunDescription}
                        onChange={setShixunDescription}
                        placeholder="学生根据『试题内容说明』进行答题"
                      />
                    </div>
                  </div>

                  {/* 答题方式 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      答题方式 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="w-full space-y-4">
                      <div className="flex flex-wrap gap-6 items-center p-3.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl">
                        {[
                          { value: '线下做题，上传结果文件', label: '线下做题，上传结果文件' },
                          { value: '线上环境答题', label: '线上环境答题' }
                        ].map((item) => (
                          <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="radio"
                              name="shixunAnswerType"
                              value={item.value}
                              checked={shixunAnswerType === item.value}
                              onChange={() => setShixunAnswerType(item.value)}
                              className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">{item.label}</span>
                          </label>
                        ))}
                      </div>

                  </div>
                  </div>

                  {shixunAnswerType === '线上环境答题' && (
                    <>
                      {/* 选择资源池 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          选择资源池 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div ref={shixunResourcePoolDropdownRef} className="relative w-full text-xs">
                          <div
                            onClick={() => setIsShixunResourcePoolDropdownOpen(!isShixunResourcePoolDropdownOpen)}
                            className={cn(
                              "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                              isShixunResourcePoolDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                            )}
                          >
                            <span className={cn(shixunResourcePool ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                              {shixunResourcePool || "请选择资源池"}
                            </span>
                            <ChevronDown 
                              className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isShixunResourcePoolDropdownOpen && "rotate-180")} 
                            />
                          </div>

                          {/* Dropdown Menu */}
                          {isShixunResourcePoolDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                {['天翼云资源池1', 'k8s容器集群', 'Proxmox私有云资源池', 'Cloudpods虚拟化资源池', 'Ceph存储资源池'].map(pool => {
                                  const isSelected = shixunResourcePool === pool;
                                  return (
                                    <div
                                      key={pool}
                                      onClick={() => {
                                        setShixunResourcePool(pool);
                                        setIsShixunResourcePoolDropdownOpen(false);
                                      }}
                                      className={cn(
                                        "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                        isSelected 
                                          ? "bg-orange-50 text-[#fa541c] font-bold"
                                          : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                                      )}
                                    >
                                      <span>{pool}</span>
                                      {isSelected && (
                                        <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. 选择环境类型 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          选择环境类型 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          {[
                            { value: '容器', label: '容器' },
                            { value: '云主机', label: '云主机' }
                          ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer text-xs text-neutral-700">
                              <input
                                type="radio"
                                name="shixunEnvType"
                                value={opt.value}
                                checked={shixunEnvType === opt.value}
                                onChange={() => setShixunEnvType(opt.value as any)}
                                className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                              />
                              <span className="font-semibold">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 容器独有的配置: 源仓库地址 + 创建方式 */}
                      {shixunEnvType === '容器' && (
                        <>
                          {/* 3. 源仓库地址 */}
                          <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                            <label className="text-[13px] font-bold text-[#262626] text-right">
                              源仓库地址 <span className="text-[#fa541c]">*</span>
                            </label>
                            <div className="flex items-center gap-6 text-[13px]">
                              {[
                                { value: 'manual', label: '手动添加' },
                                { value: 'upload', label: '本地文件上传' }
                              ].map(opt => (
                                <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer text-xs text-neutral-700">
                                  <input
                                    type="radio"
                                    name="shixunRepoMode"
                                    value={opt.value}
                                    checked={shixunRepoMode === opt.value}
                                    onChange={() => {
                                      setShixunRepoMode(opt.value as any);
                                      setShixunRepoUrl(opt.value === 'manual' ? 'https://github.com/opencv/opencv.git' : '');
                                    }}
                                    className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                                  />
                                  <span className="font-semibold">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Mode-specific Controls (对齐右侧) */}
                          <div className="grid grid-cols-[100px_1fr] gap-4 animate-fade-in">
                            <div />
                            <div className="w-full">
                              {shixunRepoMode === 'manual' ? (
                                <input
                                  type="text"
                                  placeholder="请输入源仓库地址 (如: git@github.com:... 或 https://...)"
                                  value={shixunRepoUrl}
                                  onChange={(e) => setShixunRepoUrl(e.target.value)}
                                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] transition-all text-[#262626] font-mono bg-white"
                                />
                              ) : (
                                <div className="space-y-2.5 w-full">
                                  <input
                                    type="file"
                                    id="shixun-repo-file-upload"
                                    accept=".zip,.tar.gz,.tgz,.rar"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setShixunRepoUrl(file.name);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor="shixun-repo-file-upload"
                                    className="flex flex-col items-center justify-center border border-dashed border-neutral-300 hover:border-[#fa541c]/50 bg-neutral-50/10 hover:bg-neutral-50/30 rounded-[8px] p-6 cursor-pointer transition-all gap-2 text-center"
                                  >
                                    <Upload className="w-5 h-5 text-[#fa541c]" strokeWidth={1.5} />
                                    <span className="text-xs text-[#262626] font-bold">点击选择或拖拽源码文件上传</span>
                                    <span className="text-[10px] text-neutral-400 font-medium">单文件上限 100MB</span>
                                  </label>

                                  {shixunRepoUrl && (
                                    <div className="flex items-center justify-between text-[11px] text-green-700 bg-green-50 border border-green-200 px-3.5 py-2 rounded-[4px] font-bold animate-in fade-in duration-200">
                                      <span className="truncate flex items-center gap-1.5">
                                        <span>✓ 已就绪:</span>
                                        <span className="font-mono">{shixunRepoUrl}</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setShixunRepoUrl('')}
                                        className="text-neutral-400 hover:text-red-500 ml-2 cursor-pointer bg-transparent border-0 font-bold"
                                      >
                                        清除
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. 创建方式 */}
                          <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                            <label className="text-[13px] font-bold text-[#262626] text-right">
                              创建方式
                            </label>
                            <div className="flex items-center gap-6 text-[13px]">
                              {[
                                { value: 'template', label: '模板创建' },
                                { value: 'custom', label: '自定义' }
                              ].map(opt => (
                                <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer text-xs text-neutral-700">
                                  <input
                                    type="radio"
                                    name="shixunCreationMethod"
                                    value={opt.value}
                                    checked={shixunCreationMethod === opt.value}
                                    onChange={() => setShixunCreationMethod(opt.value as any)}
                                    className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                                  />
                                  <span className="font-semibold">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {shixunCreationMethod === 'template' && (
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                              <div />
                              <div ref={templateDropdownRef} className="relative w-full text-xs">
                                <div
                                  onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                                  className={cn(
                                    "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                                    isTemplateDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                                  )}
                                >
                                  <span className="text-neutral-700 font-medium">
                                    {shixunTemplateValue}
                                  </span>
                                  <ChevronDown 
                                    className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isTemplateDropdownOpen && "rotate-180")} 
                                  />
                                </div>

                                {/* Template Menu */}
                                {isTemplateDropdownOpen && (
                                  <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                      {[
                                        { value: '通用模板', label: '通用模板' },
                                        { value: 'AI模型开发模板', label: 'AI模型开发模板' },
                                        { value: '数据挖掘算法模板', label: '数据挖掘算法模板' },
                                        { value: 'Java微服务模板', label: 'Java微服务模板' }
                                      ].map(tmpl => {
                                        const isSelected = shixunTemplateValue === tmpl.value;
                                        return (
                                          <div
                                            key={tmpl.value}
                                            onClick={() => {
                                              setShixunTemplateValue(tmpl.value);
                                              setIsTemplateDropdownOpen(false);
                                            }}
                                            className={cn(
                                              "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                              isSelected 
                                                ? "bg-orange-50 text-[#fa541c] font-bold"
                                                : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                                            )}
                                          >
                                            <span>{tmpl.label}</span>
                                            {isSelected && (
                                              <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* 自定义/云主机的详细参数配置 (自定义 Details) */}
                      {(shixunEnvType === '云主机' || shixunCreationMethod === 'custom') && (
                        <div className="grid grid-cols-[100px_1fr] items-start gap-4 animate-fade-in">
                          <div />
                          <div className="w-full border border-neutral-200 rounded-[8px] p-5 bg-white space-y-6 shadow-sm">
                            
                            {/* Header (容器环境 or 云主机环境) */}
                            <div className="text-xs font-bold text-[#fa541c] border-b border-[#fa541c]/10 pb-3 flex items-center gap-1.5 justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#fa541c]" /> 
                                {shixunEnvType === '容器' ? '自定义容器环境配置' : '云主机环境配置'}
                              </span>
                            </div>

                            {/* 容器自定义配置 */}
                            {shixunEnvType === '容器' ? (
                              <div className="space-y-6 animate-fade-in text-left">
                                {/* Tab Row (容器1, 容器2...) */}
                                <div className="flex items-center justify-between border-b border-neutral-200 pb-px">
                                  <div className="flex gap-1 overflow-x-auto">
                                    {shixunContainers.map((c, idx) => (
                                      <div key={c.id} className="relative group flex items-center">
                                        <button
                                          type="button"
                                          onClick={() => setActiveShixunContainerIdx(idx)}
                                          className={cn(
                                            "px-5 py-2 text-xs font-bold rounded-t-[4px] transition-all cursor-pointer border border-b-0 border-neutral-200 flex items-center gap-2",
                                            activeShixunContainerIdx === idx
                                              ? "bg-[#fa541c] text-white border-[#fa541c] font-black"
                                              : "bg-white text-[#fa541c] border-[#fa541c]/50 hover:bg-orange-50/20"
                                          )}
                                        >
                                          <span>容器{idx + 1}</span>
                                          {shixunContainers.length > 1 && (
                                            <span
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const updated = shixunContainers.filter((_, i) => i !== idx);
                                                setShixunContainers(updated);
                                                setActiveShixunContainerIdx(prev => Math.max(0, prev - 1));
                                              }}
                                              className="hover:bg-black/10 rounded-full p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center ml-1"
                                            >
                                              <X className="w-2.5 h-2.5" />
                                            </span>
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newContainer = {
                                        id: 'c-' + Date.now(),
                                        cpuCores: '2',
                                        memoryGb: '4',
                                        gpuPower: '无',
                                        gpuMem: '0',
                                        gpuCards: '0',
                                        gpuModel: '4090',
                                        containerImage: 'ctyun-python:3.10-slim-cpu',
                                        envVars: [],
                                        startCmd: 'python main.py'
                                      };
                                      setShixunContainers([...shixunContainers, newContainer]);
                                      setActiveShixunContainerIdx(shixunContainers.length);
                                    }}
                                    className="text-[#fa541c] hover:text-[#e84a15] text-[13px] font-bold cursor-pointer flex items-center gap-1 bg-transparent border-0 rounded-[4px]"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>添加容器</span>
                                  </button>
                                </div>

                                {/* Tab Content */}
                                {shixunContainers[activeShixunContainerIdx] && (() => {
                                  const activeContainer = shixunContainers[activeShixunContainerIdx];
                                  return (
                                    <div className="space-y-6">
                                      {/* 选择镜像 */}
                                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <label className="text-[13px] font-bold text-[#262626] text-right">
                                          选择镜像 <span className="text-[#fa541c]">*</span>
                                        </label>
                                        <div className="relative w-full text-xs">
                                          <select
                                            value={activeContainer.containerImage || 'ctyun-python:3.10-slim-cpu'}
                                            onChange={(e) => updateContainerField('containerImage', e.target.value)}
                                            className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 cursor-pointer font-mono"
                                          >
                                            <option value="ctyun-python:3.10-slim-cpu">ctyun-python:3.10-slim-cpu</option>
                                            <option value="Ubuntu 22.04 + PyTorch 2.1 + CUDA 12.1">Ubuntu 22.04 + PyTorch 2.1 + CUDA 12.1 (深度学习推荐)</option>
                                            <option value="Ubuntu 20.04 + TensorFlow 2.15 + CUDA 12.0">Ubuntu 20.04 + TensorFlow 2.15 + CUDA 12.0</option>
                                            <option value="Python 3.10 Development Environment">Python 3.10 Development Environment (通用编程)</option>
                                            <option value="Node.js 18 + Frontend SDK">Node.js 18 + Frontend SDK</option>
                                          </select>
                                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                      </div>

                                      {/* 算力配置 Container */}
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[13px] font-bold text-[#262626]">
                                            算力配置 <span className="text-[#fa541c]">*</span>
                                          </span>
                                        </div>

                                        <div className="space-y-4">
                                          {/* CPU and Memory Row */}
                                          <div className="grid grid-cols-2 gap-6">
                                            <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                              <span className="text-[13px] text-neutral-500 pr-3 text-right">CPU</span>
                                              <input
                                                type="text"
                                                value={activeContainer.cpuCores || '2'}
                                                onChange={(e) => updateContainerField('cpuCores', e.target.value)}
                                                className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] bg-white"
                                              />
                                              <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">核</span>
                                            </div>

                                            <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                              <span className="text-[13px] text-neutral-500 pr-3 text-right">内存</span>
                                              <input
                                                type="text"
                                                value={activeContainer.memoryGb || '4'}
                                                onChange={(e) => updateContainerField('memoryGb', e.target.value)}
                                                className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] bg-white"
                                              />
                                              <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">GB</span>
                                            </div>
                                          </div>

                                          {/* GPU Model and count row */}
                                          <div className="grid grid-cols-2 gap-6">
                                            <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                              <span className="text-[13px] text-neutral-500 pr-3 text-right">GPU型号</span>
                                              <div className="relative w-full">
                                                <select
                                                  value={activeContainer.gpuModel || '4090'}
                                                  onChange={(e) => {
                                                    updateContainerField('gpuModel', e.target.value);
                                                    if (e.target.value === '无') {
                                                      updateContainerField('gpuCards', '0');
                                                      updateContainerField('gpuPower', '无');
                                                      updateContainerField('gpuMem', '0');
                                                    }
                                                  }}
                                                  className="w-full border border-neutral-200 rounded-[4px] px-3 py-1.5 text-[13px] appearance-none focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 cursor-pointer"
                                                >
                                                  <option value="4090">4090</option>
                                                  <option value="A100">A100</option>
                                                  <option value="T4">NVIDIA T4</option>
                                                  <option value="A10G">NVIDIA A10G</option>
                                                  <option value="无">无 GPU</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                              </div>
                                              <div />
                                            </div>

                                            <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                              <span className="text-[13px] text-neutral-500 pr-3 text-right">GPU</span>
                                              <input
                                                type="text"
                                                value={activeContainer.gpuCards || '0'}
                                                disabled={activeContainer.gpuModel === '无'}
                                                onChange={(e) => updateContainerField('gpuCards', e.target.value)}
                                                className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] bg-white disabled:bg-neutral-50"
                                              />
                                              <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">张</span>
                                            </div>
                                          </div>

                                          {/* GPU Power and VRAM */}
                                          <div className="grid grid-cols-2 gap-6">
                                            <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                              <span className="text-[13px] text-neutral-500 pr-3 text-right">算力</span>
                                              <div className="relative w-full">
                                                <select
                                                  value={activeContainer.gpuPower || '无'}
                                                  disabled={activeContainer.gpuModel === '无'}
                                                  onChange={(e) => updateContainerField('gpuPower', e.target.value)}
                                                  className="w-full border border-neutral-200 rounded-[4px] px-3 py-1.5 text-[13px] appearance-none focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 cursor-pointer disabled:bg-neutral-50"
                                                >
                                                  <option value="无">无</option>
                                                  <option value="10%">10%</option>
                                                  <option value="25%">25%</option>
                                                  <option value="50%">50%</option>
                                                  <option value="100%">100%</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                              </div>
                                              <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">%</span>
                                            </div>

                                            <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                              <span className="text-[13px] text-neutral-500 pr-3 text-right">显存</span>
                                              <input
                                                type="text"
                                                value={activeContainer.gpuMem || '0'}
                                                disabled={activeContainer.gpuModel === '无'}
                                                onChange={(e) => updateContainerField('gpuMem', e.target.value)}
                                                className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] bg-white disabled:bg-neutral-50"
                                              />
                                              <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">GB</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 环境变量配置 */}
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                                          <span className="text-[13px] font-bold text-[#262626]">
                                            环境变量配置 <span className="text-[#fa541c]">*</span>
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentVars = activeContainer.envVars || [];
                                              updateContainerField('envVars', [...currentVars, { id: Date.now(), key: '', value: '' }]);
                                            }}
                                            className="text-[#fa541c] hover:text-[#e84a15] text-xs font-bold bg-transparent border-0 cursor-pointer flex items-center gap-0.5 rounded-[4px]"
                                          >
                                            <Plus className="w-3.5 h-3.5" /> 添加变量
                                          </button>
                                        </div>

                                        <div className="space-y-2.5">
                                          {activeContainer.envVars && activeContainer.envVars.length > 0 ? (
                                            activeContainer.envVars.map((variable: any, vIdx: number) => (
                                              <div key={variable.id} className="flex gap-2 items-center">
                                                <input
                                                  type="text"
                                                  placeholder="key"
                                                  value={variable.key}
                                                  onChange={(e) => {
                                                    const updated = [...activeContainer.envVars];
                                                    updated[vIdx].key = e.target.value;
                                                    updateContainerField('envVars', updated);
                                                  }}
                                                  className="flex-1 text-[13px] border border-neutral-200 rounded px-3 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-[#262626] bg-white"
                                                />
                                                <span className="text-neutral-400 font-bold select-none">=</span>
                                                <input
                                                  type="text"
                                                  placeholder="Value"
                                                  value={variable.value}
                                                  onChange={(e) => {
                                                    const updated = [...activeContainer.envVars];
                                                    updated[vIdx].value = e.target.value;
                                                    updateContainerField('envVars', updated);
                                                  }}
                                                  className="flex-1 text-[13px] border border-neutral-200 rounded px-3 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-[#262626] bg-white"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const updated = activeContainer.envVars.filter((v: any) => v.id !== variable.id);
                                                    updateContainerField('envVars', updated);
                                                  }}
                                                  className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer border-0 bg-transparent flex items-center rounded-[4px]"
                                                >
                                                  <X className="w-4 h-4" />
                                                </button>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-xs text-neutral-400 italic pl-2">暂无环境变量</p>
                                          )}
                                        </div>
                                      </div>

                                      {/* 启动命令 */}
                                      <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                                        <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                                          启动命令 <span className="text-[#fa541c]">*</span>
                                        </label>
                                        <textarea
                                          placeholder="请输入"
                                          value={activeContainer.startCmd || ''}
                                          onChange={(e) => updateContainerField('startCmd', e.target.value)}
                                          className="w-full min-h-[80px] p-3 text-[13px] border border-neutral-200 rounded focus:outline-none focus:border-[#fa541c] resize-none leading-relaxed text-[#262626] font-mono bg-white"
                                        />
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              /* 云主机自定义配置 */
                              <div className="space-y-6 animate-fade-in text-left">
                                {/* Tab Row (云主机1, 云主机2...) */}
                                <div className="flex items-center justify-between border-b border-neutral-200 pb-px">
                                  <div className="flex gap-1 overflow-x-auto">
                                    {shixunVms.map((v, idx) => (
                                      <div key={v.id} className="relative group flex items-center">
                                        <button
                                          type="button"
                                          onClick={() => setActiveShixunVmIdx(idx)}
                                          className={cn(
                                            "px-5 py-2 text-xs font-bold rounded-t-[4px] transition-all cursor-pointer border border-b-0 border-neutral-200 flex items-center gap-2",
                                            activeShixunVmIdx === idx
                                              ? "bg-[#fa541c] text-white border-[#fa541c] font-black"
                                              : "bg-white text-[#fa541c] border-[#fa541c]/50 hover:bg-orange-50/20"
                                          )}
                                        >
                                          <span>云主机{idx + 1}</span>
                                          {shixunVms.length > 1 && (
                                            <span
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const updated = shixunVms.filter((_, i) => i !== idx);
                                                setShixunVms(updated);
                                                setActiveShixunVmIdx(prev => Math.max(0, prev - 1));
                                              }}
                                              className="hover:bg-black/10 rounded-full p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center ml-1"
                                            >
                                              <X className="w-2.5 h-2.5" />
                                            </span>
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newVm = {
                                        id: 'v-' + Date.now(),
                                        vmCpu: '2',
                                        vmMem: '8',
                                        vmGpuPower: '无',
                                        vmGpuMem: '0',
                                        vmGpuCards: '0',
                                        vmGpuModel: '无',
                                        vmSpec: 'ecs.g6.large',
                                        vmSpecType: 'spec',
                                        vmImage: 'Ubuntu Server 22.04 LTS',
                                        vmStorageType: 'SSD',
                                        vmStorageDataType: 'SSD',
                                        vmSystemDisk: '40',
                                        vmDataDisk: '100',
                                        vmVpc: 'vpc-default',
                                        vmSubnet: '192.168.1.0/24',
                                        vmVncType: 'novnc'
                                      };
                                      setShixunVms([...shixunVms, newVm]);
                                      setActiveShixunVmIdx(shixunVms.length);
                                    }}
                                    className="text-[#fa541c] hover:text-[#e84a15] text-[13px] font-bold cursor-pointer flex items-center gap-1 bg-transparent border-0 rounded-[4px]"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>添加云主机</span>
                                  </button>
                                </div>

                                {/* Tab Content */}
                                {shixunVms[activeShixunVmIdx] && (() => {
                                  const activeVm = shixunVms[activeShixunVmIdx];
                                  return (
                                    <div className="space-y-6 animate-fade-in text-left">
                                      {/* 选择镜像 */}
                                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <label className="text-[13px] font-bold text-[#262626] text-right">
                                          选择镜像 <span className="text-[#fa541c]">*</span>
                                        </label>
                                        <CustomSelect
                                          value={activeVm.vmImage}
                                          onChange={(val) => updateVmField('vmImage', val)}
                                          options={[
                                            { value: 'Ubuntu Server 22.04 LTS', label: 'Ubuntu Server 22.04 LTS (深度学习常用)' },
                                            { value: 'CentOS Stream 9 x86_64', label: 'CentOS Stream 9 x86_64' },
                                            { value: 'Windows Server 2022 Core', label: 'Windows Server 2022 Core (支持图形界面)' }
                                          ]}
                                          className="font-mono"
                                        />
                                      </div>

                                      {/* 算力配置 */}
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[13px] font-bold text-[#262626]">
                                            算力配置 <span className="text-[#fa541c]">*</span>
                                          </span>
                                          
                                          <div className="flex bg-neutral-100 rounded p-0.5 border border-neutral-200 max-w-max">
                                            {[
                                              { key: 'spec', label: '规格选择' },
                                              { key: 'custom', label: '自定义资源' }
                                            ].map(opt => (
                                              <button
                                                key={opt.key}
                                                type="button"
                                                onClick={() => updateVmField('vmSpecType', opt.key as any)}
                                                className={cn(
                                                  "px-3 py-1 text-center text-[11px] rounded-[4px] transition-all cursor-pointer font-bold border-0",
                                                  activeVm.vmSpecType === opt.key 
                                                    ? "bg-white text-[#fa541c] shadow-sm"
                                                    : "text-neutral-555 hover:text-neutral-800"
                                                )}
                                              >
                                                {opt.label}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {activeVm.vmSpecType === 'spec' ? (
                                          /* VM SPEC TYPE */
                                          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                            <label className="text-[13px] text-neutral-500 text-right">选择规格</label>
                                            <CustomSelect
                                              value={activeVm.vmSpec}
                                              onChange={(val) => {
                                                updateVmField('vmSpec', val);
                                                if (val === 'ecs.g6.large') {
                                                  updateVmField('vmCpu', '2');
                                                  updateVmField('vmMem', '8');
                                                  updateVmField('vmGpuModel', '无');
                                                  updateVmField('vmGpuCards', '0');
                                                } else if (val === 'ecs.g6.xlarge') {
                                                  updateVmField('vmCpu', '4');
                                                  updateVmField('vmMem', '16');
                                                  updateVmField('vmGpuModel', '无');
                                                  updateVmField('vmGpuCards', '0');
                                                } else if (val === 'ecs.gn6i-c4g1.xlarge') {
                                                  updateVmField('vmCpu', '4');
                                                  updateVmField('vmMem', '16');
                                                  updateVmField('vmGpuModel', 'T4');
                                                  updateVmField('vmGpuCards', '1');
                                                } else if (val === 'ecs.gn7i-c8g1.2xlarge') {
                                                  updateVmField('vmCpu', '8');
                                                  updateVmField('vmMem', '32');
                                                  updateVmField('vmGpuModel', 'A10G');
                                                  updateVmField('vmGpuCards', '1');
                                                }
                                              }}
                                              options={SHIXUN_VM_SPECS}
                                            />
                                          </div>
                                        ) : (
                                          /* CUSTOM CPU/MEM/GPU CONFIG */
                                          <div className="space-y-4">
                                            {/* CPU and Memory Row */}
                                            <div className="grid grid-cols-2 gap-6">
                                              <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                                <span className="text-[13px] text-neutral-500 text-right pr-3">CPU</span>
                                                <input
                                                  type="text"
                                                  placeholder="请输入"
                                                  value={activeVm.vmCpu || '2'}
                                                  onChange={(e) => updateVmField('vmCpu', e.target.value)}
                                                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] bg-white"
                                                />
                                                <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">核</span>
                                              </div>

                                              <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                                <span className="text-[13px] text-neutral-500 text-right pr-3">内存</span>
                                                <input
                                                  type="text"
                                                  placeholder="请输入"
                                                  value={activeVm.vmMem || '8'}
                                                  onChange={(e) => updateVmField('vmMem', e.target.value)}
                                                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] bg-white"
                                                />
                                                <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">GB</span>
                                              </div>
                                            </div>

                                            {/* GPU Model and count row */}
                                            <div className="grid grid-cols-2 gap-6">
                                              <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                                <span className="text-[13px] text-neutral-500 text-right pr-3">GPU型号</span>
                                                <CustomSelect
                                                  value={activeVm.vmGpuModel || '无'}
                                                  onChange={(val) => {
                                                    updateVmField('vmGpuModel', val);
                                                    if (val === '无') {
                                                      updateVmField('vmGpuCards', '0');
                                                    }
                                                  }}
                                                  options={[
                                                    { value: '4090', label: '4090' },
                                                    { value: 'A100', label: 'A100' },
                                                    { value: 'T4', label: 'NVIDIA T4' },
                                                    { value: 'A10G', label: 'NVIDIA A10G' },
                                                    { value: '无', label: '无 GPU' }
                                                  ]}
                                                />
                                                <div />
                                              </div>

                                              <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                                <span className="text-[13px] text-neutral-500 text-right pr-3">GPU</span>
                                                <input
                                                  type="text"
                                                  placeholder="请输入"
                                                  value={activeVm.vmGpuCards || '0'}
                                                  disabled={activeVm.vmGpuModel === '无'}
                                                  onChange={(e) => updateVmField('vmGpuCards', e.target.value)}
                                                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] disabled:bg-neutral-50 bg-white"
                                                />
                                                <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">张</span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* 存储配置 */}
                                      <div className="space-y-3">
                                        <span className="text-[13px] font-bold text-[#262626] block border-b border-neutral-100 pb-1.5">
                                          存储配置 <span className="text-[#fa541c]">*</span>
                                        </span>
                                        
                                        <div className="space-y-3.5 pl-4">
                                          {/* 系统盘 */}
                                          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                                            <span className="text-[13px] text-neutral-550 text-right">系统盘</span>
                                            <div className="flex items-center gap-6">
                                              <div className="flex items-center gap-2 flex-1">
                                                <span className="text-xs text-neutral-400 shrink-0">存储类型</span>
                                                <CustomSelect
                                                  value={activeVm.vmStorageType || 'SSD'}
                                                  onChange={(val) => updateVmField('vmStorageType', val)}
                                                  options={[
                                                    { value: 'SSD', label: 'SSD' },
                                                    { value: 'HDD', label: 'HDD' },
                                                    { value: 'ESSD', label: 'ESSD' }
                                                  ]}
                                                />
                                              </div>

                                              <div className="flex items-center gap-2 flex-1">
                                                <span className="text-xs text-neutral-400 shrink-0">大小</span>
                                                <input
                                                  type="text"
                                                  placeholder="输入大小"
                                                  value={activeVm.vmSystemDisk || '40'}
                                                  onChange={(e) => updateVmField('vmSystemDisk', e.target.value)}
                                                  className="w-full border border-neutral-200 rounded px-2.5 py-1.5 text-[13px] text-[#262626] bg-white"
                                                />
                                                <span className="text-[13px] text-[#262626] font-bold shrink-0">GB</span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* 数据盘 */}
                                          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                                            <span className="text-[13px] text-neutral-555 text-right">数据盘</span>
                                            <div className="flex items-center gap-6">
                                              <div className="flex items-center gap-2 flex-1">
                                                <span className="text-xs text-neutral-400 shrink-0">存储类型</span>
                                                <CustomSelect
                                                  value={activeVm.vmStorageDataType || 'SSD'}
                                                  onChange={(val) => updateVmField('vmStorageDataType', val)}
                                                  options={[
                                                    { value: 'SSD', label: 'SSD' },
                                                    { value: 'HDD', label: 'HDD' },
                                                    { value: 'ESSD', label: 'ESSD' }
                                                  ]}
                                                />
                                              </div>

                                              <div className="flex items-center gap-2 flex-1">
                                                <span className="text-xs text-neutral-400 shrink-0">大小</span>
                                                <input
                                                  type="text"
                                                  placeholder="输入大小"
                                                  value={activeVm.vmDataDisk || '100'}
                                                  onChange={(e) => updateVmField('vmDataDisk', e.target.value)}
                                                  className="w-full border border-neutral-200 rounded px-2.5 py-1.5 text-[13px] text-[#262626] bg-white"
                                                />
                                                <span className="text-[13px] text-[#262626] font-bold shrink-0">GB</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* 网络配置 */}
                                      <div className="space-y-3">
                                        <span className="text-[13px] font-bold text-[#262626] block border-b border-neutral-100 pb-1.5">
                                          网络配置 <span className="text-[#fa541c]">*</span>
                                        </span>

                                        <div className="space-y-3.5 pl-4">
                                          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                                            <span className="text-[13px] text-neutral-550 text-right">子网</span>
                                            
                                            <div className="flex items-center gap-1.5 text-[13px]">
                                              <input
                                                type="text"
                                                value="192"
                                                disabled
                                                className="w-12 text-center bg-neutral-50 border border-neutral-200 rounded py-1.5 text-[13px] text-neutral-500 cursor-not-allowed select-none focus:outline-none"
                                              />
                                              <span className="text-neutral-400 font-bold">.</span>
                                              
                                              <input
                                                type="text"
                                                value="168"
                                                disabled
                                                className="w-12 text-center bg-neutral-50 border border-neutral-200 rounded py-1.5 text-[13px] text-neutral-550 cursor-not-allowed select-none focus:outline-none"
                                              />
                                              <span className="text-neutral-400 font-bold">.</span>
                                              
                                              <input
                                                type="text"
                                                inputMode="numeric"
                                                aria-label="子网地址第三段"
                                                pattern="[0-9]{1,3}"
                                                required
                                                maxLength={3}
                                                value={(() => {
                                                  const { octet3 } = parseSubnet(activeVm.vmSubnet || '192.168.1.0/24');
                                                  return octet3;
                                                })()}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  if (!/^\d{0,3}$/.test(val) || Number(val) > 255) return;
                                                  const { octet4, mask } = parseSubnet(activeVm.vmSubnet || '192.168.1.0/24');
                                                  updateVmField('vmSubnet', `192.168.${val}.${octet4}/${mask}`);
                                                }}
                                                className="w-12 text-center bg-white border border-neutral-200 rounded py-1.5 text-[13px] text-[#262626] focus:outline-none focus:border-[#fa541c]"
                                              />
                                              <span className="text-neutral-400 font-bold">.</span>
                                              
                                              <input
                                                type="text"
                                                inputMode="numeric"
                                                aria-label="子网地址第四段"
                                                pattern="[0-9]{1,3}"
                                                required
                                                maxLength={3}
                                                value={parseSubnet(activeVm.vmSubnet || '192.168.1.0/24').octet4}
                                                onChange={event => {
                                                  const val = event.target.value;
                                                  if (!/^\d{0,3}$/.test(val) || Number(val) > 255) return;
                                                  const { octet3, mask } = parseSubnet(activeVm.vmSubnet || '192.168.1.0/24');
                                                  updateVmField('vmSubnet', `192.168.${octet3}.${val}/${mask}`);
                                                }}
                                                className="w-12 text-center bg-white border border-neutral-200 rounded py-1.5 text-[13px] text-[#262626] focus:outline-none focus:border-[#fa541c]"
                                              />
                                              <span className="text-neutral-400 font-bold">/</span>
                                              
                                              <select
                                                value={(() => {
                                                  const { mask } = parseSubnet(activeVm.vmSubnet || '192.168.1.0/24');
                                                  return mask;
                                                })()}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  const { octet3, octet4 } = parseSubnet(activeVm.vmSubnet || '192.168.1.0/24');
                                                  updateVmField('vmSubnet', `192.168.${octet3}.${octet4}/${val}`);
                                                }}
                                                className="px-2 py-1.5 border border-neutral-200 rounded text-[13px] text-[#262626] bg-white focus:outline-none focus:border-[#fa541c] disabled:bg-neutral-50 disabled:text-neutral-500 cursor-pointer min-w-[58px] text-center font-bold"
                                              >
                                                <option value="16">16</option>
                                                <option value="24">24</option>
                                                <option value="32">32</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* VNC类型 */}
                                      <div className="space-y-3">
                                        <span className="text-[13px] font-bold text-[#262626] block border-b border-neutral-100 pb-1.5">
                                          VNC类型 <span className="text-[#fa541c]">*</span>
                                        </span>

                                        <div className="flex items-center gap-6 text-[13px] pl-4">
                                          {[
                                            { value: 'caddyvnc', label: 'caddyvnc' },
                                            { value: 'novnc', label: 'novnc' }
                                          ].map(opt => (
                                            <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer">
                                              <input
                                                type="radio"
                                                name="shixunVmVncTypeRadio"
                                                value={opt.value}
                                                checked={(activeVm.vmVncType || 'novnc').toLowerCase() === opt.value.toLowerCase()}
                                                onChange={() => updateVmField('vmVncType', opt.value)}
                                                className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                                              />
                                              <span className="font-medium text-[#262626]">{opt.label}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}



                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {shixunAnswerType === '线下做题，上传结果文件' && (
                    <div className="grid grid-cols-[100px_1fr] items-start gap-4 animate-fade-in">
                      <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                        内容关联文件
                      </label>
                      <div className="w-full space-y-2.5">
                        <input
                          type="file"
                          id="shixun-offline-file-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setShixunOfflineFile(file.name);
                            }
                          }}
                        />
                        <label
                          htmlFor="shixun-offline-file-upload"
                          className="flex flex-col items-center justify-center border border-dashed border-neutral-300 hover:border-[#fa541c]/50 bg-neutral-50/10 hover:bg-neutral-50/30 rounded-[8px] p-6 cursor-pointer transition-all gap-2 text-center"
                        >
                          <Upload className="w-5 h-5 text-[#fa541c]" strokeWidth={1.5} />
                          <span className="text-xs text-[#262626] font-bold">点击选择或拖拽文件上传</span>
                          <span className="text-[10px] text-neutral-400 font-medium">单文件上限 100MB</span>
                        </label>

                        {shixunOfflineFile && (
                          <div className="flex items-center justify-between text-[11px] text-green-700 bg-green-50 border border-green-200 px-3.5 py-2 rounded-[4px] font-bold animate-in fade-in duration-200">
                            <span className="truncate flex items-center gap-1.5">
                              <span>✓ 已关联:</span>
                              <span className="font-mono">{shixunOfflineFile}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShixunOfflineFile('')}
                              className="text-neutral-400 hover:text-red-500 ml-2 cursor-pointer bg-transparent border-0 font-bold"
                            >
                              清除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 数据集选择 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-1">
                      数据集选择
                    </label>
                    <div className="w-full space-y-3">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDatasetDropdownOpen(!isDatasetDropdownOpen)}
                          className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                        >
                          <Plus className="w-3.5 h-3.5" /> 添加数据集
                        </button>

                        {isDatasetDropdownOpen && (
                          <div className="absolute z-10 w-[320px] mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto custom-scrollbar animate-fade-in left-1">
                            {AVAILABLE_DATASETS.map((ds) => {
                              const isSelected = shixunDatasets.includes(ds.name);
                              return (
                                <label
                                  key={ds.name}
                                  className="flex items-center justify-between px-3.5 py-2 hover:bg-neutral-50 cursor-pointer text-xs text-neutral-700 select-none"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        if (isSelected) {
                                          removeDataset(ds.name);
                                        } else {
                                          setShixunDatasets(previous => [...previous, ds.name]);
                                          retryDatasetSync(ds.name);
                                        }
                                      }}
                                      className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 rounded focus:ring-[#fa541c] cursor-pointer"
                                    />
                                    <span className="font-medium">{ds.name}</span>
                                  </div>
                                  <span className="text-[10px] text-neutral-400">{ds.size}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* 已选数据集展示 */}
                      {shixunDatasets.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <p className="text-xs text-neutral-500">已选择 {shixunDatasets.length} 个数据集</p>
                          {shixunDatasets.map((datasetName) => {
                            const dsInfo = AVAILABLE_DATASETS.find(d => d.name === datasetName) || { name: datasetName, size: '未知大小' };
                            const syncStatus = datasetSyncStatuses[datasetName] || '同步成功';
                            return (
                              <div key={datasetName} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50/40 border border-neutral-200 rounded-[6px]">
                                <div className="flex flex-wrap min-w-0 items-center gap-2 text-xs text-neutral-700">
                                  <Database className="w-4 h-4 shrink-0 text-[#fa541c]" />
                                  <span className="font-medium break-all">{dsInfo.name}</span>
                                  <span className="text-neutral-400 text-[10px]">({dsInfo.size})</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                <span role="status" className={cn('inline-flex items-center gap-1 text-[11px]', syncStatus === '同步中' ? 'text-blue-500' : syncStatus === '同步成功' ? 'text-green-600' : 'text-red-500')}>
                                  {syncStatus === '同步中' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : syncStatus === '同步成功' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}{syncStatus}
                                </span>
                                <button type="button" aria-label={`重试同步${datasetName}`} onClick={() => retryDatasetSync(datasetName)} className="inline-flex items-center gap-1 text-[11px] text-[#fa541c] hover:text-[#e84a15] cursor-pointer"><RefreshCw className="w-3.5 h-3.5" />同步重试</button>
                                <button
                                  type="button"
                                  aria-label={`移除${datasetName}`}
                                  onClick={() => removeDataset(datasetName)}
                                  className="text-neutral-400 hover:text-red-500 transition-colors text-xs font-bold p-1 cursor-pointer"
                                >
                                  ✕
                                </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}



              {/* Correct Answer */}
              {(newQuestionType === '单选题' || newQuestionType === '多选题' || newQuestionType === '判断题') && (
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    正确答案 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="p-4 bg-neutral-50/50 border border-neutral-200/60 rounded w-full">
                    {newQuestionType === '单选题' && (
                      <div className="flex flex-wrap gap-6 items-center">
                        {options.map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="radio"
                              name="correctAnswerSingle"
                              value={opt.key}
                              checked={correctAnswerSingle === opt.key}
                              onChange={() => setCorrectAnswerSingle(opt.key)}
                              className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">选项 {opt.key}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {newQuestionType === '多选题' && (
                      <div className="flex flex-wrap gap-6 items-center">
                        {options.map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="checkbox"
                              checked={correctAnswerMultiple.includes(opt.key)}
                              onChange={() => {
                                if (correctAnswerMultiple.includes(opt.key)) {
                                  setCorrectAnswerMultiple(correctAnswerMultiple.filter(k => k !== opt.key));
                                } else {
                                  setCorrectAnswerMultiple([...correctAnswerMultiple, opt.key]);
                                }
                              }}
                              className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 rounded focus:ring-[#fa541c] cursor-pointer bg-white"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">选项 {opt.key}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {newQuestionType === '判断题' && (
                      <div className="flex gap-6 items-center">
                        {['正确', '错误'].map((val) => (
                          <label key={val} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="radio"
                              name="correctAnswerTrueFalse"
                              value={val}
                              checked={correctAnswerTrueFalse === val}
                              onChange={() => setCorrectAnswerTrueFalse(val)}
                              className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">{val}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Check Script for 简答题 */}
              {newQuestionType === '简答题' && (
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    检查脚本 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="w-full">
                    <div className="relative border border-neutral-200 rounded overflow-hidden bg-white shadow-sm focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all w-full">
                      {/* Top Action Bar */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-50">
                        <span className="text-xs font-semibold text-neutral-500 font-mono">SCRIPT EDITOR</span>
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (e: any) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  const text = evt.target?.result as string;
                                  setCorrectAnswerText(text);
                                };
                                reader.readAsText(file);
                              }
                            };
                            input.click();
                          }}
                          className="text-[#fa541c] hover:text-[#e84a15] text-[11px] font-bold transition-colors cursor-pointer bg-transparent border-0 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> 加载文件
                        </button>
                      </div>

                      {/* Code Input Area with Gutter */}
                      <div className="flex min-h-[120px] bg-neutral-50/30 font-mono text-xs">
                        {/* Line Numbers Gutter */}
                        <div className="w-9 border-r border-neutral-200 bg-neutral-50 py-2.5 text-right pr-2 text-neutral-400 select-none flex flex-col leading-6">
                          {(() => {
                            const lines = correctAnswerText.split('\n');
                            return lines.map((_, i) => (
                              <span key={i}>{i + 1}</span>
                            ));
                          })()}
                        </div>
                        {/* Textarea */}
                        <textarea
                          value={correctAnswerText}
                          onChange={(e) => setCorrectAnswerText(e.target.value)}
                          placeholder="请输入配置内容"
                          className="flex-1 bg-transparent border-0 outline-none resize-y py-2.5 px-3 leading-6 text-neutral-700 font-mono h-32 focus:ring-0 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Answer Analysis */}
              {newQuestionType !== '实训题' && (
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    答案解析
                  </label>
                  <div className="w-full">
                    <RichTextEditor
                      label=""
                      value={newQuestionAnalysis}
                      onChange={setNewQuestionAnalysis}
                      placeholder="请输入详细的答案解析和解题思路..."
                    />
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  状态
                </label>
                <div className="flex gap-6 items-center w-full">
                  {[
                    { value: '启用', label: '启用', desc: '启用后可用于组卷' },
                    { value: '停用', label: '停用', desc: '停用后暂不可用' }
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                      <input
                        type="radio"
                        name="newQuestionStatus"
                        value={item.value}
                        checked={newQuestionStatus === item.value}
                        onChange={() => setNewQuestionStatus(item.value)}
                        className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                      />
                      <span className="group-hover:text-[#fa541c] transition-colors font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50">
              <Button 
                onClick={handleCloseCreateModal}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-colors rounded-[4px] cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveQuestion}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-[4px] shadow-sm cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 批量导入 Drawer (从右侧滑出) */}
      {isImportModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#fa541c]" />
                批量导入试题
              </h2>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-left">
              {/* 所属题库 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span> 所属题库
                </label>
                <div className="relative w-full">
                  <select
                    value={importBank}
                    onChange={(e) => setImportBank(e.target.value)}
                    className="w-full border border-neutral-200 rounded px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all cursor-pointer"
                  >
                    <option value="">请选择所属题库</option>
                    {banksList.map(bank => (
                      <option key={bank.id} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 本地文件上传 */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                  <span className="text-[#fa541c]">*</span> 本地文件
                </label>
                
                {/* Drag and Drop Zone */}
                <div 
                  onClick={() => {
                    if (isImporting) return;
                    setImportFileName('人工智能通识批量导入模板.xlsx');
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-[8px] p-8 flex flex-col items-center justify-center bg-neutral-50/30 transition-all cursor-pointer group text-center w-full",
                    importFileName
                      ? "border-[#fa541c] bg-[#fff2e8]/10"
                      : "border-neutral-200 hover:border-[#fa541c] hover:bg-neutral-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-[8px] flex items-center justify-center mb-3 shadow-sm transition-transform group-hover:scale-110",
                    importFileName ? "bg-[#fa541c] text-white" : "bg-neutral-100 text-neutral-400 group-hover:bg-[#fff2e8]/60 group-hover:text-[#fa541c]"
                  )}>
                    <Upload className="w-5 h-5" />
                  </div>
                  {importFileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-neutral-800">{importFileName}</p>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setImportFileName('');
                        }}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer border-0 bg-transparent font-medium"
                      >
                        清除并重新上传
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        将文件拖到此或 <span className="text-[#fa541c] hover:text-[#e84a15] font-semibold underline">点击上传</span>
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono">支持扩展名：.xlsx</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <div />
                <div className="border border-[#ffbb96] bg-[#fff2e8]/30 rounded-[8px] p-4 flex items-start gap-3 relative overflow-hidden w-full">
                  <span className="bg-[#fa541c] text-white px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                    Tips
                  </span>
                  <div className="flex-1 flex justify-between items-start gap-4">
                    <p className="text-[11px] text-neutral-600 leading-relaxed font-medium">
                      上传前请先按照 Excel 格式填写试题内容，仅支持单选题、多选题、判断题、填空题、简答题、实训题批量导入
                    </p>
                    <button
                      type="button"
                      onClick={() => alert('已为您成功触发模板下载！')}
                      className="text-[#fa541c] hover:text-[#e84a15] text-xs font-bold whitespace-nowrap hover:underline cursor-pointer flex items-center border-0 bg-transparent"
                    >
                      下载模板
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsImportModalOpen(false)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!importBank) {
                    alert('请选择所属题库！');
                    return;
                  }
                  if (!importFileName) {
                    alert('请上传需要导入的本地 Excel 文件！');
                    return;
                  }
                  setIsImporting(true);
                  setTimeout(() => {
                    const importedQ = {
                      id: Date.now(),
                      name: '深度学习中卷积层与池化层分别有什么关键作用？',
                      bank: importBank,
                      type: '简答题',
                      status: '启用',
                      source: '批量导入',
                      difficulty: '中等',
                      tags: '深度学习, 卷积神经网络',
                      grading: '人工评分',
                      creator: 'Momodel',
                      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
                      scope: '私有',
                      auditStatus: '未审核'
                    };
                    setQuestionsList([importedQ, ...questionsList]);
                    setIsImporting(false);
                    setIsImportModalOpen(false);
                    setImportFileName('');
                    alert('批量试题成功导入并追加到列表中！');
                  }, 1200);
                }}
                disabled={isImporting}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm cursor-pointer border-0"
              >
                {isImporting ? '导入中...' : '导入'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 查看试题 Drawer (从界面右侧展示，类似新建试题风格) */}
      {viewingQuestion && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setViewingQuestion(null)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] rounded-[4px] text-[11px] font-bold">
                  {viewingQuestion.type}
                </span>
                <h2 className="text-[15px] font-bold text-neutral-800">查看试题详情</h2>
              </div>
              <button 
                onClick={() => setViewingQuestion(null)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable View */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
              {/* Question Name / Title */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">试题标题：</label>
                <div className="text-sm font-bold text-neutral-800 border border-neutral-100 bg-neutral-50/30 rounded-[4px] p-3.5 leading-relaxed">
                  {viewingQuestion.name}
                </div>
              </div>

              {/* Grid: Bank, Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">所属题库</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-[4px] font-medium">{viewingQuestion.bank}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">难度级别</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-[4px] font-medium">{viewingQuestion.difficulty}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">关联标签：</label>
                <div className="flex flex-wrap gap-2">
                  {viewingQuestion.tags ? (
                    viewingQuestion.tags.split(', ').map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 bg-[#fff2e8] border border-[#ffbb96] rounded-[4px] text-xs text-[#fa541c] font-medium shadow-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic">暂无关联标签</span>
                  )}
                </div>
              </div>

              {/* Dynamic Options list (Mock items if none are listed) */}
              {['单选题', '多选题'].includes(viewingQuestion.type) && (
                <div className="space-y-2.5">
                  <label className="text-[13px] font-bold text-neutral-400">试题答案选项：</label>
                  <div className="space-y-2">
                    {[
                      { key: 'A', text: '自动搜索大语言模型的隐藏参数' },
                      { key: 'B', text: '结合外部知识库对生成结果进行事实增强' },
                      { key: 'C', text: '增加多模态数据输入通道' },
                      { key: 'D', text: '使用深度网络加速推理速度' },
                    ].map((opt) => (
                      <div key={opt.key} className="flex items-start gap-3 p-3 bg-neutral-50/50 border border-neutral-100 rounded-[4px]">
                        <span className="font-bold text-neutral-500 bg-white border border-neutral-200 rounded-[4px] w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                          {opt.key}
                        </span>
                        <span className="text-xs text-neutral-700 pt-0.5 leading-relaxed">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 得分关键词与规则配置 (填空题 / 简答题 / 实训题) */}
              {['填空题', '简答题', '实训题', '编程题'].includes(viewingQuestion.type) && (
                <div className="space-y-2.5">
                  <label className="text-[13px] font-bold text-neutral-400">得分关键词与规则配置：</label>
                  <div className="border border-neutral-200 rounded-[4px] overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-600 font-bold">
                          <th className="px-3.5 py-2.5 font-bold w-1/4">填空名称</th>
                          <th className="px-3.5 py-2.5 font-bold w-1/2">得分关键词</th>
                          <th className="px-3.5 py-2.5 text-center font-bold w-1/4">得分比例</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-700">
                        <tr className="hover:bg-neutral-50/30 transition-colors">
                          <td className="px-3.5 py-3 font-medium">
                            <input 
                              type="text" 
                              readOnly 
                              disabled 
                              value="填空 1" 
                              className="w-full border border-neutral-200/80 rounded-[4px] px-2.5 py-1 text-xs text-neutral-700 bg-neutral-50/80 cursor-not-allowed select-none font-medium"
                            />
                          </td>
                          <td className="px-3.5 py-3">
                            <div className="flex flex-wrap gap-1.5 p-1.5 bg-neutral-50/80 border border-neutral-200/80 rounded-[4px] cursor-not-allowed select-none">
                              <span className="px-2 py-0.5 rounded-[4px] bg-white border border-neutral-200 text-xs text-neutral-700 font-medium">Transformer</span>
                              <span className="px-2 py-0.5 rounded-[4px] bg-white border border-neutral-200 text-xs text-neutral-700 font-medium">Self-Attention</span>
                            </div>
                          </td>
                          <td className="px-3.5 py-3 text-center">
                            <input 
                              type="text" 
                              readOnly 
                              disabled 
                              value="100%" 
                              className="w-full text-center border border-neutral-200/80 rounded-[4px] px-2.5 py-1 text-xs text-neutral-700 bg-neutral-50/80 cursor-not-allowed select-none font-bold"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">
                  {viewingQuestion.type === '简答题' ? '检查脚本：' : '正确参考答案：'}
                </label>
                {viewingQuestion.type === '简答题' ? (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-[4px] p-4 font-mono text-xs text-neutral-700 whitespace-pre-wrap">
                    {viewingQuestion.correctAnswer || '无检查脚本'}
                  </div>
                ) : (
                  <div className="bg-[#fff2e8]/40 border border-[#ffbb96]/40 rounded-[4px] p-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#fa541c]"></span>
                    <span className="text-xs font-bold text-neutral-600">答案为：</span>
                    <span className="px-3 py-1 bg-[#fa541c] text-white rounded-[4px] text-xs font-bold shadow-sm">
                      {viewingQuestion.type === '单选题' ? 'B' : viewingQuestion.type === '多选题' ? 'A, B, C' : '正确'}
                    </span>
                  </div>
                )}
              </div>

              {/* Answer Analysis */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">答案深度解析：</label>
                <div className="p-4 bg-neutral-50/80 border border-neutral-100 rounded-[4px] text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  该题的关键考点在于大模型主流应用的结合点。通过结合结构化或非结构化外部知识库，利用事实注入和二次检索召回，能够从根本上缓解或避免大模型输出的“幻觉”现象，提升特定业务场景的准确性。
                </div>
              </div>

              {/* Audit Status & Creator Details */}
              <div className="border-t border-neutral-100 pt-4 grid grid-cols-2 gap-4 text-xs text-neutral-500">
                <p>创建人：<span className="text-neutral-700 font-semibold">{viewingQuestion.creator}</span></p>
                <p>更新时间：<span className="text-neutral-700 font-semibold">{viewingQuestion.updateTime}</span></p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end bg-neutral-50/50">
              <Button 
                onClick={() => setViewingQuestion(null)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-[4px] shadow-sm cursor-pointer"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 实训题检查项 Drawer (从右侧滑出) */}
      {isCheckpointsModalOpen && checkpointQuestion && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => {
            setIsCheckpointsModalOpen(false);
            setCheckpointQuestion(null);
          }}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                {isCheckpointFormOpen ? (editingCheckpoint ? '编辑检查项' : '新建检查项') : '实训题检查项配置'}
              </h2>
              <button 
                onClick={() => {
                  setIsCheckpointsModalOpen(false);
                  setCheckpointQuestion(null);
                }}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-left">
              {/* Question Name Info Box */}
              <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-[8px] p-4 flex flex-col gap-1 text-xs mb-2">
                <span className="text-neutral-400 block font-bold mb-0.5">关联试题名称</span>
                <span className="font-bold text-neutral-800 text-[13px]">{checkpointQuestion.name}</span>
              </div>

              {!isCheckpointFormOpen ? (
                // LIST/TABLE VIEW
                <div className="space-y-4 flex-1 flex flex-col min-h-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-neutral-800">检查项配置列表</span>
                    <Button 
                      onClick={() => {
                        setEditingCheckpoint(null);
                        setCheckpointFormName('');
                        setCheckpointFormContent('');
                        setCheckpointFormDesc('');
                        setCheckpointFormRatio(20);
                        setIsCheckpointFormOpen(true);
                      }}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-8 px-3.5 rounded-[4px] text-xs font-semibold cursor-pointer border-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新建
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-neutral-100 rounded-[8px] bg-white custom-scrollbar max-h-[380px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium sticky top-0 z-10">
                          <th className="p-3">检查项名称</th>
                          <th className="p-3">检查项内容</th>
                          <th className="p-3">检查项描述</th>
                          <th className="p-3 w-20 text-center">得分比例</th>
                          <th className="p-3 w-24 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                        {(checkpoints[checkpointQuestion.id] || []).map((cp) => (
                          <tr key={cp.id} className="hover:bg-neutral-50/30 transition-colors">
                            <td className="p-3 font-semibold text-neutral-850 max-w-[120px] truncate" title={cp.name}>
                              {cp.name}
                            </td>
                            <td className="p-3 max-w-[140px] truncate text-neutral-500 font-mono" title={cp.content}>
                              {cp.content}
                            </td>
                            <td className="p-3 max-w-[160px] truncate text-neutral-500" title={cp.description}>
                              {cp.description}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-neutral-800">
                              {cp.scoreRatio}%
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => {
                                    setEditingCheckpoint(cp);
                                    setCheckpointFormName(cp.name);
                                    setCheckpointFormContent(cp.content);
                                    setCheckpointFormDesc(cp.description);
                                    setCheckpointFormRatio(cp.scoreRatio);
                                    setIsCheckpointFormOpen(true);
                                  }}
                                  className="text-xs text-[#fa541c] hover:text-[#e84a15] transition-colors border-0 bg-transparent p-0 cursor-pointer font-semibold"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => handleDeleteCheckpoint(cp.id)}
                                  className="text-xs text-red-400 hover:text-red-600 transition-colors border-0 bg-transparent p-0 cursor-pointer font-semibold"
                                >
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {(checkpoints[checkpointQuestion.id] || []).length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-neutral-450 italic bg-neutral-50/10">
                              暂无检查项，请点击右上角“新建”进行添加
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // FORM VIEW (Style matches 新建试题 drawer layout: grid grid-cols-[100px_1fr] items-center gap-4)
                <div className="space-y-5 animate-slide-up text-left">
                  {/* Name field */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      检查项名称 <span className="text-[#fa541c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={checkpointFormName}
                      onChange={(e) => setCheckpointFormName(e.target.value)}
                      placeholder="如：依赖库配置检查"
                      className="w-full border border-neutral-200 rounded px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  {/* Content field */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      检查项内容 <span className="text-[#fa541c]">*</span>
                    </label>
                    <textarea
                      value={checkpointFormContent}
                      onChange={(e) => setCheckpointFormContent(e.target.value)}
                      placeholder="请输入检查命令或判定脚本内容..."
                      className="w-full border border-neutral-200 rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 transition-all placeholder:text-neutral-400 resize-none h-24 font-mono"
                    />
                  </div>

                  {/* Description field */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      检查项描述
                    </label>
                    <textarea
                      value={checkpointFormDesc}
                      onChange={(e) => setCheckpointFormDesc(e.target.value)}
                      placeholder="请输入关于此项检查的具体描述和评分指南..."
                      className="w-full border border-neutral-200 rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 transition-all placeholder:text-neutral-400 resize-none h-24"
                    />
                  </div>

                  {/* ScoreRatio field */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      得分比例 (%) <span className="text-[#fa541c]">*</span>
                    </label>
                    <input
                      type="number"
                      value={checkpointFormRatio}
                      onChange={(e) => setCheckpointFormRatio(Number(e.target.value))}
                      placeholder="如 20"
                      className="w-full border border-neutral-200 rounded px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 transition-all placeholder:text-neutral-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              {isCheckpointFormOpen ? (
                <>
                  <Button 
                    onClick={() => {
                      setIsCheckpointFormOpen(false);
                      setEditingCheckpoint(null);
                    }}
                    variant="outline"
                    className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleSaveCheckpoint}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm cursor-pointer border-0"
                  >
                    保存
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    setIsCheckpointsModalOpen(false);
                    setCheckpointQuestion(null);
                  }}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-[4px] shadow-sm cursor-pointer border-0"
                >
                  关闭
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 题库管理 Drawer (从右侧滑出) */}
      {isBankListModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => {
            setIsBankListModalOpen(false);
            setIsCreateBankOpen(false);
            setViewingBankDetail(null);
          }}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#fa541c]" />
                {viewingBankDetail ? `${viewingBankDetail.name} 详情` : "题库管理"}
              </h2>
              <button 
                onClick={() => {
                  setIsBankListModalOpen(false);
                  setIsCreateBankOpen(false);
                  setViewingBankDetail(null);
                }}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-5 text-left flex flex-col min-h-0">
              {viewingBankDetail ? (
              // BANK DETAIL VIEW
              <div className="space-y-4 flex-1 flex flex-col min-h-0 text-left">
                {/* Back Link */}
                <button
                  onClick={() => setViewingBankDetail(null)}
                  className="flex items-center gap-1 text-xs text-[#fa541c] hover:text-[#e84a15] transition-colors border-0 bg-transparent p-0 cursor-pointer font-bold mb-2 self-start"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> 返回题库列表
                </button>

                {/* Info Card Grid */}
                <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-[8px] p-4 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">创建人</span>
                    <span className="font-semibold text-neutral-700">{viewingBankDetail.creator}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">创建时间</span>
                    <span className="font-semibold text-neutral-700 font-mono">{viewingBankDetail.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">试题数量</span>
                    <span className="font-bold text-neutral-800 font-mono">
                      {questionsList.filter(q => q.bank === viewingBankDetail.name).length} 道
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="text-xs font-bold text-neutral-800 pt-2 border-b border-neutral-100 pb-1.5 flex justify-between items-center">
                  <span>关联试题列表</span>
                  <span className="text-[11px] text-neutral-400 font-normal">展示该题库下收录的试题</span>
                </div>

                <div className="w-full overflow-y-auto border border-neutral-100 rounded-[8px] bg-white custom-scrollbar max-h-[380px]">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium sticky top-0 z-10">
                        <th className="p-3">试题名称</th>
                        <th className="p-3 w-16 text-center">题型</th>
                        <th className="p-3 w-16 text-center">难度</th>
                        <th className="p-3 w-16 text-center">状态</th>
                        <th className="p-3 w-16 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {questionsList
                        .filter(q => q.bank === viewingBankDetail.name)
                        .map((q) => (
                          <tr key={q.id} className="hover:bg-neutral-50/30 transition-colors">
                            <td className="p-3 font-semibold text-neutral-800 max-w-[280px] truncate" title={q.name}>
                              {q.name}
                            </td>
                            <td className="p-3 text-center">{q.type}</td>
                            <td className="p-3 text-center text-neutral-500">{q.difficulty}</td>
                            <td className="p-3 text-center">
                              <span className={cn("px-1.5 py-0.5 text-[10px] rounded border font-medium", q.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>
                                {q.status}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  // Viewing a question details via our preview drawer
                                  setViewingQuestion(q);
                                  setIsBankListModalOpen(false);
                                }}
                                className="text-xs text-[#fa541c] hover:underline transition-colors border-0 bg-transparent p-0 cursor-pointer font-medium"
                              >
                                查看
                              </button>
                            </td>
                          </tr>
                        ))}
                      {questionsList.filter(q => q.bank === viewingBankDetail.name).length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-neutral-400">
                            该题库下暂无关联试题
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // BANK LIST VIEW
              <>
                {/* Sub-header / Toolbar */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="搜索题库名称..."
                      value={searchBankQuery}
                      onChange={(e) => setSearchBankQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-white border border-neutral-border rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400 h-8"
                    />
                  </div>
                  <Button 
                    onClick={() => setIsCreateBankOpen(!isCreateBankOpen)}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-8 px-3 rounded-[4px] text-xs font-semibold cursor-pointer"
                  >
                    {isCreateBankOpen ? '取消新建' : '新建题库'}
                  </Button>
                </div>

                {/* Create Bank Inline Form */}
                {isCreateBankOpen && (
                  <div className="bg-neutral-50 border border-neutral-200/60 rounded-[8px] p-4 mb-4 space-y-3 animate-slide-up text-left">
                    <div className="text-xs font-bold text-neutral-800">新建题库</div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 block">题库名称：</label>
                      <input
                        type="text"
                        placeholder="如：自然语言处理基础"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        className="w-full border border-neutral-200 rounded px-3 py-1.5 text-xs bg-white text-neutral-800 focus:outline-none focus:border-[#fa541c]"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button 
                        onClick={() => {
                          if (!newBankName.trim()) {
                            alert('请输入题库名称！');
                            return;
                          }
                          const newBank = {
                            id: Date.now(),
                            name: newBankName.trim(),
                            count: 0,
                            category: '其它',
                            creator: 'Momodel',
                            createdAt: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/')
                          };
                          setBanksList([...banksList, newBank]);
                          setNewBankName('');
                          setIsCreateBankOpen(false);
                        }}
                        className="border border-[#fa541c] text-[#fa541c] bg-transparent hover:bg-[#fff2e8] h-7 px-4 rounded-[4px] text-xs font-semibold shadow-sm cursor-pointer"
                      >
                        保存
                      </Button>
                    </div>
                  </div>
                )}

                <div className="w-full overflow-y-auto border border-neutral-100 rounded-[8px] bg-white custom-scrollbar max-h-[440px]">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium sticky top-0 z-10">
                        <th className="p-3">题库名称</th>
                        <th className="p-3 w-20 text-center">试题数量</th>
                        <th className="p-3">创建人</th>
                        <th className="p-3">创建时间</th>
                        <th className="p-3 w-24 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {banksList
                        .filter(b => b.name.toLowerCase().includes(searchBankQuery.trim().toLowerCase()))
                        .map((bank) => (
                          <tr key={bank.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-3 font-semibold text-neutral-800">{bank.name}</td>
                            <td className="p-3 text-center font-mono">{bank.count}</td>
                            <td className="p-3 text-neutral-500">{bank.creator}</td>
                            <td className="p-3 text-neutral-500 font-mono">{bank.createdAt}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => {
                                    setEditingBank(bank);
                                    setEditBankName(bank.name);
                                  }}
                                  className="text-xs text-[#fa541c] hover:text-[#e84a15] transition-colors border-0 bg-transparent p-0 cursor-pointer font-semibold"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`确定要删除题库「${bank.name}」吗？`)) {
                                      setBanksList(banksList.filter(item => item.id !== bank.id));
                                    }
                                  }}
                                  disabled={bank.name === '人工智能通识D-uni'}
                                  className={cn(
                                    "text-xs transition-colors border-0 bg-transparent p-0 cursor-pointer font-medium",
                                    bank.name === '人工智能通识D-uni'
                                      ? "text-neutral-300 cursor-not-allowed"
                                      : "text-neutral-400 hover:text-red-500"
                                  )}
                                >
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {banksList.filter(b => b.name.toLowerCase().includes(searchBankQuery.trim().toLowerCase())).length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-neutral-400">
                            暂无匹配的题库
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setIsBankListModalOpen(false);
                  setIsCreateBankOpen(false);
                  setViewingBankDetail(null);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-[4px] shadow-sm cursor-pointer border-0"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑题库 Modal */}
      {editingBank && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
          onClick={() => setEditingBank(null)}
        >
          <div 
            className="bg-white w-full max-w-[500px] rounded-[8px] shadow-2xl border border-neutral-100 p-6 flex flex-col relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2 border-l-4 border-[#fa541c] pl-2.5">
                <span className="text-[16px] font-bold text-neutral-800">编辑题库</span>
              </div>
              <button 
                onClick={() => setEditingBank(null)}
                className="text-neutral-400 hover:text-[#fa541c] p-1 rounded-full transition-colors cursor-pointer bg-transparent border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 题库名称：
                </label>
                <input
                  type="text"
                  value={editBankName}
                  onChange={(e) => setEditBankName(e.target.value)}
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-xs bg-white text-neutral-800 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-5">
              <Button 
                onClick={() => setEditingBank(null)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!editBankName.trim()) {
                    alert('请输入题库名称！');
                    return;
                  }
                  setBanksList(banksList.map(b => b.id === editingBank.id ? { ...b, name: editBankName.trim() } : b));
                  setEditingBank(null);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm cursor-pointer"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 申请公开试题 Modal (参考项目公开弹出层样式) */}
      {isApplyPublicModalOpen && questionToApplyPublic && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => !isApplyingPublic && setIsApplyPublicModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                申请公开试题
              </h2>
              <button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
                disabled={isApplyingPublic}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px] text-left">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">公开后可用于租户/平台组卷</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    提交申请后，超管将从 <strong>试题完整性、题干描述、答案解析、参考价值</strong> 四个维度进行审核。审核通过后将进入公共试题库。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">试题名称</label>
                  <input 
                    type="text" 
                    value={questionToApplyPublic.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                    公开范围 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有班级可见' },
                      { key: '平台', label: '平台级公开', desc: '全平台所有院校与租户可见' }
                    ].map(opt => (
                      <div 
                        key={opt.key}
                        onClick={() => setApplyPublicRange(opt.key as any)}
                        className={cn(
                          "border p-4 rounded cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyPublicRange === opt.key 
                            ? "border-[#fa541c] bg-[#fff5f0]/30"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        )}
                      >
                        <span className={cn("font-bold text-[13px]", applyPublicRange === opt.key ? "text-[#fa541c]" : "text-[#262626]")}>
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 leading-normal">{opt.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    申请说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={applyPublicReason}
                    onChange={(e) => setApplyPublicReason(e.target.value)}
                    placeholder="请描述该试题的申请公开原因及相关说明..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                disabled={isApplyingPublic}
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmitApplyPublic} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                disabled={isApplyingPublic}
              >
                {isApplyingPublic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    提交中...
                  </>
                ) : (
                  '提交审核申请'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 批量公开试题 Drawer */}
      {isBatchPublicOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsBatchPublicOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                批量公开试题
              </h2>
              <button 
                onClick={() => setIsBatchPublicOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px] text-left">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">公开后可用于租户/平台组卷</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    提交申请后，超管将从 <strong>试题完整性、题干描述、答案解析、参考价值</strong> 四个维度进行审核。审核通过后将进入公共试题库。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-1.5">已选试题</label>
                  <div className="w-full">
                    {selectedQuestions.length > 0 ? (
                      <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50/40 space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                        <div className="text-xs text-neutral-400 mb-1.5 font-bold">已选择 {selectedQuestions.length} 道试题：</div>
                        {selectedQuestions.map(id => {
                          const q = questionsList.find(item => item.id === id);
                          return (
                            <div key={id} className="text-xs text-neutral-700 flex items-center justify-between border-b border-neutral-100 pb-1.5 last:border-0 last:pb-0 font-medium">
                              <span className="truncate max-w-[450px]">{q ? q.name : `试题 ID: ${id}`}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedQuestions(selectedQuestions.filter(x => x !== id))}
                                className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-dashed border-red-200 bg-red-50/30 text-red-500 rounded-lg p-6 text-center text-xs font-bold">
                        ⚠️ 您尚未在列表中勾选任何试题，请先关闭此页并在列表中选择试题！
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                    公开范围 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有班级可见' },
                      { key: '平台', label: '平台级公开', desc: '全平台所有院校与租户可见' }
                    ].map(opt => (
                      <div 
                        key={opt.key}
                        onClick={() => setApplyPublicRange(opt.key as any)}
                        className={cn(
                          "border p-4 rounded cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyPublicRange === opt.key 
                            ? "border-[#fa541c] bg-[#fff5f0]/30"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        )}
                      >
                        <span className={cn("font-bold text-[13px]", applyPublicRange === opt.key ? "text-[#fa541c]" : "text-[#262626]")}>
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 leading-normal">{opt.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    申请说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={applyPublicReason}
                    onChange={(e) => setApplyPublicReason(e.target.value)}
                    placeholder="请描述申请公开原因及相关说明..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsBatchPublicOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (selectedQuestions.length === 0) {
                    alert('请先选择要公开的试题！');
                    return;
                  }
                  if (!applyPublicReason.trim()) {
                    alert('请填写申请说明！');
                    return;
                  }
                  setIsApplyingPublic(true);
                  setTimeout(() => {
                    setQuestionsList(questionsList.map(q => {
                      if (selectedQuestions.includes(q.id)) {
                        return {
                          ...q,
                          scope: applyPublicRange,
                          auditStatus: '已通过'
                        };
                      }
                      return q;
                    }));
                    setIsApplyingPublic(false);
                    setIsBatchPublicOpen(false);
                    setSelectedQuestions([]);
                    setApplyPublicReason('');
                    alert(`批量公开申请已提交！已成功将选中的 ${selectedQuestions.length} 道试题设置为【${applyPublicRange}级公开】。`);
                  }, 1200);
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                disabled={isApplyingPublic || selectedQuestions.length === 0}
              >
                {isApplyingPublic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    提交中...
                  </>
                ) : (
                  '提交审核申请'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 复制试题 Drawer */}
      {isCopyDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => {
            setIsCopyDrawerOpen(false);
            setCopyingQuestion(null);
            setCopyTargetBank('');
          }}
        >
          <div 
            className="bg-white w-full max-w-[500px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Copy className="w-5 h-5 text-[#fa541c]" />
                复制试题
              </h2>
              <button 
                onClick={() => {
                  setIsCopyDrawerOpen(false);
                  setCopyingQuestion(null);
                  setCopyTargetBank('');
                }}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-left">
              {/* Target Bank Dropdown */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  选择题库 <span className="text-[#fa541c]">*</span>
                </label>
                <div ref={copyBankDropdownRef} className="relative w-full text-xs">
                  <div
                    onClick={() => setIsCopyBankDropdownOpen(!isCopyBankDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                      isCopyBankDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(copyTargetBank ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {copyTargetBank || "请选择所属题库"}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isCopyBankDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isCopyBankDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setCopyTargetBank("");
                            setIsCopyBankDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !copyTargetBank 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择所属题库</span>
                          {!copyTargetBank && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {banksList.map(bank => {
                          const isSelected = copyTargetBank === bank.name;
                          return (
                            <div
                              key={bank.id}
                              onClick={() => {
                                setCopyTargetBank(bank.name);
                                setIsCopyBankDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{bank.name}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 shrink-0">
              <Button 
                onClick={() => {
                  setIsCopyDrawerOpen(false);
                  setCopyingQuestion(null);
                  setCopyTargetBank('');
                }}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-colors rounded-[4px] cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={handleCopyQuestionSubmit}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-[4px] shadow-sm cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 下架试题 Drawer (参考首页课程模块的下架) */}
      {isOffShelfModalOpen && questionToOffShelf && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsOffShelfModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                下架试题资源
              </h2>
              <button 
                onClick={() => setIsOffShelfModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px] text-left">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">下架后试题将暂不对平台师生公开组卷</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    下架试题后，该试题资源将从公共试题库和组卷候选列表中隐藏。已生成的历史试卷数据予以保留，但无法在新的作业或考试中引用该试题。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">试题名称</label>
                  <input 
                    type="text" 
                    value={questionToOffShelf.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-[4px] px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    下架说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={offShelfReason}
                    onChange={(e) => setOffShelfReason(e.target.value)}
                    placeholder="请简述下架该试题的具体原因及后续安排..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsOffShelfModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={handleOffShelfQuestion} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认下架
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
