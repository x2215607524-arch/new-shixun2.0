import { useDismissActionMenu } from '@/lib/useDismissActionMenu';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, ChevronRight, ChevronDown, X, Power, Bot, Check,
  Code, PenTool, CheckCircle, BrainCircuit,
  Calendar, Clock, User,
  Bold, Italic, Type, List, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Link2, Maximize2, FileText,
  Users, Award, Trophy, ShieldCheck, RotateCw, Download, Trash2, RefreshCw, ArrowLeft, Eye, Info, XCircle, UploadCloud, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface MockPaper {
  name: string;
  count: number;
  method: string;
  types: string;
  score: number;
  creator: string;
}

const MOCK_PAPERS_PAGED: Record<number, MockPaper[]> = {
  1: [
    { name: '基础练习试卷1', count: 10, method: '随机抽题', types: '单选题、多选题', score: 50, creator: '李四' },
    { name: '基础练习试卷2', count: 15, method: '手动抽题', types: '填空题、简答题', score: 50, creator: '王五' },
    { name: '基础练习试卷3', count: 20, method: '随机抽题', types: '简答题、思考题', score: 100, creator: '张三' },
    { name: '基础练习试卷4', count: 30, method: '手动抽题', types: '编程题', score: 100, creator: '刘能' },
  ],
  2: [
    { name: '作业试卷1', count: 100, method: '随机抽题', types: '单选题、填空题、实训题、简答题', score: 100, creator: '张三' },
    { name: '作业试卷2', count: 2, method: '手动抽题', types: '实训题', score: 20, creator: '李四' },
    { name: '作业试卷3', count: 40, method: '随机抽题', types: '单选题、填空题、多选题、简答题、思考题、判断题', score: 40, creator: '王五' },
    { name: '作业试卷4', count: 4, method: '手动抽题', types: '实训题', score: 60, creator: '刘能' },
  ],
  3: [
    { name: '期末测试A卷', count: 50, method: '随机抽题', types: '单选题、填空题、多选题、编程题', score: 100, creator: '张三' },
    { name: '期末测试B卷', count: 50, method: '随机抽题', types: '单选题、填空题、多选题、编程题', score: 100, creator: '张三' },
    { name: 'Mo智能体开发试卷', count: 5, method: '手动抽题', types: '实训题', score: 100, creator: '李四' },
    { name: 'Python高级特性自测', count: 10, method: '随机抽题', types: '单选题、多选题、编程题', score: 100, creator: '王五' },
  ],
  4: [
    { name: '机器学习导论测试', count: 25, method: '随机抽题', types: '单选题、多选题、简答题', score: 100, creator: '王五' },
    { name: '深度学习神经网络测试', count: 30, method: '手动抽题', types: '单选题、简答题、思考题', score: 100, creator: '张三' },
    { name: '计算机视觉实战练习', count: 3, method: '手动抽题', types: '实训题', score: 60, creator: '李四' },
    { name: '自然语言处理实践作业', count: 5, method: '手动抽题', types: '实训题、编程题', score: 80, creator: '刘能' },
  ],
  5: [
    { name: '人工智能基础常识', count: 50, method: '随机抽题', types: '单选题、判断题', score: 100, creator: '刘能' },
    { name: '强化学习算法自测', count: 8, method: '手动抽题', types: '简答题、编程题', score: 100, creator: '张三' },
    { name: 'Mo模型部署操作题', count: 1, method: '手动抽题', types: '实训题', score: 100, creator: '李四' },
    { name: '大模型微调技巧练习', count: 12, method: '随机抽题', types: '单选题、多选题、思考题', score: 100, creator: '王五' },
  ]
};

const MOCK_AVAILABLE_CANDIDATES = [
  { id: 1001, account: 't03_liuwei', name: '2', phone: '18751836676', group: '测试用户' },
  { id: 1002, account: 't02_liuwei', name: '2', phone: '18751836675', group: '测试用户' },
  { id: 1003, account: 't01_liuwei', name: '2', phone: '18751836674', group: '测试用户' },
  { id: 1004, account: 'sqgjb_wsy', name: '王姝懿', phone: '18702931827', group: '测试用户' },
  { id: 1005, account: 'sqgjb_zmj', name: '赵梦姣', phone: '15332456648', group: '测试用户' },
  { id: 1006, account: 'sqgjb_hfy', name: '黄方瑜', phone: '17319923385', group: '测试用户' },
  { id: 1007, account: 'sqgjb_hj', name: '何杰', phone: '19929217900', group: '测试用户' },
  { id: 1008, account: 'sqgjb_zwt', name: '朱文涛', phone: '13385203356', group: '测试用户' }
];

interface PreviewQuestion {
  id: string;
  title: string;
  options?: string[];
  content?: string;
}

const mockPreviewQuestions: Record<'单选题' | '多选题' | '简答题' | '实训编程题', PreviewQuestion[]> = {
  '单选题': [
    { id: 'preview-s-1', title: '以下哪个选项是人工智能的核心要素？', options: ['A. 算力、算法、数据', 'B. 硬件、外设、网络', 'C. 显示器、显卡、内存', 'D. 键盘、鼠标、系统'] },
    { id: 'preview-s-2', title: '深度学习主要基于以下哪种数学架构？', options: ['A. 人工神经网络', 'B. 线性规划方程', 'C. 拓扑同构映射', 'D. 离散傅里叶变换'] },
    { id: 'preview-s-3', title: '在Python中，用于多维数组科学计算的核心库是：', options: ['A. NumPy', 'B. Matplotlib', 'C. requests', 'D. Django'] },
    { id: 'preview-s-4', title: '下列哪个模型不属于生成式人工智能（Generative AI）？', options: ['A. SVM分类器', 'B. Generative Adversarial Networks (GAN)', 'C. GPT-4', 'D. Stable Diffusion'] },
    { id: 'preview-s-5', title: '机器学习中“过拟合”通常是指：', options: ['A. 模型在训练集表现极好但在测试集表现较差', 'B. 模型完全无法收敛', 'C. 模型在测试集表现极好而在训练集表现一般', 'D. 模型算力要求太高无法运行'] },
    { id: 'preview-s-6', title: '梯度下降算法的核心作用是：', options: ['A. 最小化目标损失函数', 'B. 加大神经元偏差权重', 'C. 清理无用训练数据集', 'D. 提高训练数据读取速率'] },
    { id: 'preview-s-7', title: '在自然语言处理中，NLP的缩写是：', options: ['A. Natural Language Processing', 'B. Network Link Protocol', 'C. Next Line Program', 'D. Neural Linear Path'] },
    { id: 'preview-s-8', title: '卷积神经网络（CNN）常用于以下哪一领域的研究？', options: ['A. 计算机视觉与图像识别', 'B. 金融大数据曲线预测', 'C. 关系型数据库结构优化', 'D. 多线程系统调度分配'] },
    { id: 'preview-s-9', title: '大模型微调中常用的高效微调（PEFT）技术是：', options: ['A. LoRA (Low-Rank Adaptation)', 'B. Batch Normalization', 'C. Learning Rate Decay', 'D. Grid Search Tuning'] },
    { id: 'preview-s-10', title: '神经网络的隐藏层节点中起激活作用的非线性函数叫：', options: ['A. 激活函数 (Activation Function)', 'B. 归一化函数', 'C. 聚类核函数', 'D. 正则化权重'] }
  ],
  '多选题': [
    { id: 'preview-m-1', title: '以下哪些算法属于无监督学习算法？（多选）', options: ['A. K-means聚类算法', 'B. PCA主成分分析', 'C. 支持向量机SVM', 'D. 逻辑回归Logistic Regression'] },
    { id: 'preview-m-2', title: '深度学习常用的优化器包括以下哪些？（多选）', options: ['A. SGD', 'B. Adam', 'C. RMSprop', 'D. KMeans'] },
    { id: 'preview-m-3', title: '在大模型训练中，常用的评估指标包含以下哪些？（多选）', options: ['A. BLEU Score', 'B. ROUGE Score', 'C. Perplexity (PPL)', 'D. F1-Score'] },
    { id: 'preview-m-4', title: 'PyTorch框架的主要特点有：（多选）', options: ['A. 采用动态计算图设计', 'B. 与Python完美契合集成', 'C. 支持GPU算力加速', 'D. 完全不需要编写任何代码'] },
    { id: 'preview-m-5', title: '常见的卷积神经网络架构包括哪些？（多选）', options: ['A. ResNet', 'B. VGG', 'C. LeNet', 'D. ARIMA'] }
  ],
  '简答题': [
    { id: 'preview-e-1', title: '请简述在大语言模型（LLM）微调（Fine-tuning）中，为什么通常需要引入人类反馈强化学习（RLHF）阶段？它的核心作用是什么？' },
    { id: 'preview-e-2', title: '解释什么是残差连接（Residual Connection），以及它如何有效解决深度神经网络在训练过程中的梯度消失（Vanishing Gradient）问题？' }
  ],
  '实训编程题': [
    { 
      id: 'preview-c-1', 
      title: '【Python 实训】基于人工神经网络算法 of 图像分类实践',
      content: "一、实验主题\n基于人工神经网络算法 of 图像分类实践\n\n二、实验目的\n掌握有监督学习的基本概念与人工神经网络的核心原理；\n学会使用torchvision库加载手写数字数据集并进行数据预处理；\n学会运用pytorch构建卷积神经网络模型，掌握模型结构的设置方法；\n掌握运用交叉验证、网格搜索等技术实现模型调优，提升模型泛化能力；\n掌握运用准确率、精确率、召回率、F1-score指标评估模型性能的方法；\n能够处理神经网络训练过程中的结构设置、参数调优和防止过拟合等常见问题，提升对有监督学习任务的理解和实际问题分析能力。\n\n三、实验内容\n安装pytorch and torchvision，并导入torch、torchvision、matplotlib、sklearn库；\n运用torch and torchvision实现计算单元设置和数据预处理；\n运用pytorch构建循环神经网络模型，包括卷积层、池化层 and 全连接层；\n运用交叉验证、网格搜索技术实现卷积神经网络超参数调优，提升模型性能；\n运用准确率、精确率、召回率、F1-score指标评估模型性能；\n可视化展示最佳模型预测结果。"
    }
  ]
};

export default function TeacherExams({ embedded = false, scene = '人工智能' }: { embedded?: boolean; scene?: '人工智能' | '网络仿真' }) {
  const navigate = useNavigate();
  // Exams mock data
  const [exams, setExams] = useState([
    {
      id: 1,
      name: '机器学习技术与应用',
      status: '启用',
      sessionsCount: 6,
      enrolled: 21,
      creator: '管理员',
      createTime: '2099/02/28 00:00',
      sessions: [
        {
          id: 101,
          name: 'Python基础测试-第一场',
          type: '测试场次',
          location: '求实楼A201',
          status: '未开始',
          invigilator: '张建国',
          startTime: '2099/09/25 09:00',
          endTime: '2099/09/25 11:30',
          visibility: '显示'
        },
        {
          id: 102,
          name: 'Python核心测试-第二场',
          type: '测试场次',
          location: '天宝路C402',
          status: '进行中',
          invigilator: '李红卫',
          startTime: '2099/10/12 14:00',
          endTime: '2099/10/12 16:30',
          visibility: '显示'
        },
        {
          id: 103,
          name: '机器学习技术与应用期末考',
          type: '正式场次',
          location: '计算中心301',
          status: '已结束',
          invigilator: '王志坚',
          startTime: '2099/06/18 09:00',
          endTime: '2099/06/18 11:30',
          visibility: '显示'
        },
        {
          id: 104,
          name: '数据分析实战技能测试',
          type: '测试场次',
          location: '天宝路C402',
          status: '已结束',
          invigilator: '孙梅',
          startTime: '2099/05/20 14:00',
          endTime: '2099/05/20 16:00',
          visibility: '显示'
        },
        {
          id: 105,
          name: '天宝路正式模拟考试场次',
          type: '正式场次',
          location: '天宝路C402',
          status: '未开始',
          invigilator: '赵海涛',
          startTime: '2099/11/01 10:00',
          endTime: '2099/11/01 12:00',
          visibility: '隐藏'
        },
        {
          id: 106,
          name: '深度学习技术正式考',
          type: '正式场次',
          location: '信工楼501',
          status: '进行中',
          invigilator: '吴明',
          startTime: '2099/10/15 15:00',
          endTime: '2099/10/15 17:00',
          visibility: '显示'
        }
      ]
    },
    {
      id: 2,
      name: '深度学习与计算机视觉',
      status: '启用',
      sessionsCount: 3,
      enrolled: 18,
      creator: '管理员',
      createTime: '2099/03/12 00:00',
      sessions: [
        {
          id: 201,
          name: 'AI创新算法实践考核',
          type: '正式场次',
          location: '科教楼B104',
          status: '已结束',
          invigilator: '周建勋',
          startTime: '2099/04/10 09:00',
          endTime: '2099/04/10 11:30',
          visibility: '显示'
        },
        {
          id: 202,
          name: '大语言模型应用能力测试场',
          type: '测试场次',
          location: '求实楼B302',
          status: '进行中',
          invigilator: '郑涛',
          startTime: '2099/10/20 13:00',
          endTime: '2099/10/20 15:30',
          visibility: '显示'
        },
        {
          id: 203,
          name: '基础语法入门测试场次',
          type: '测试场次',
          location: '天宝路C402',
          status: '未开始',
          invigilator: '陈小红',
          startTime: '2099/12/01 09:00',
          endTime: '2099/12/01 10:30',
          visibility: '显示'
        }
      ]
    }
  ].flatMap(exam => [
    { ...exam, scene: '人工智能' },
    {
      ...exam, id: exam.id + 10000, scene: '网络仿真',
      name: exam.id === 1 ? '网络拓扑与路由交换综合考试' : '网络故障诊断实操考试',
      sessions: exam.sessions.map((session, index) => ({ ...session, id: session.id + 10000,
        name: `网络仿真${session.type} · 第${index + 1}场`, location: '网络仿真实训室' })),
    },
  ]));
  const sceneExams = exams.filter(exam => exam.scene === scene);

  const [examTab, setExamTab] = useState('all'); // all, active, draft
  const [expandedRow, setExpandedRow] = useState<number | null>(2);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: React.ReactNode;
    showCancel: boolean;
    onConfirm: () => void;
    type?: 'warning' | 'danger' | 'info';
    hideHeader?: boolean;
  }>({
    show: false,
    title: '',
    message: '',
    showCancel: true,
    onConfirm: () => {}
  });
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  useDismissActionMenu(setActiveDropdownId);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveDropdownId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Exam Form states
  const [examName, setExamName] = useState('');
  const [examRule, setExamRule] = useState('仅能提交1次');
  const [isExamRuleDropdownOpen, setIsExamRuleDropdownOpen] = useState(false);
  const examRuleDropdownRef = useRef<HTMLDivElement>(null);
  const [enrollCount, setEnrollCount] = useState(0);
  const [organizer, setOrganizer] = useState('');
  const [coOrganizer, setCoOrganizer] = useState('');
  const [intro, setIntro] = useState('');
  const [notice, setNotice] = useState('test');
   const [paperConfig, setPaperConfig] = useState('');
  const [showSelectPaperModal, setShowSelectPaperModal] = useState(false);
  const [paperModalPage, setPaperModalPage] = useState(1);
  const [tempSelectedPaper, setTempSelectedPaper] = useState('');

  // Add Session Drawer states
  const [isAddSessionDrawerOpen, setIsAddSessionDrawerOpen] = useState(false);
  const [targetExamId, setTargetExamId] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState('正式场次');
  const [sessionStartTime, setSessionStartTime] = useState('');
  const [sessionEndTime, setSessionEndTime] = useState('');
  const [sessionLocation, setSessionLocation] = useState('');
  const [sessionInvigilator, setSessionInvigilator] = useState('');
  const [isInvigilatorDropdownOpen, setIsInvigilatorDropdownOpen] = useState(false);

  // Details Drawer states
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsType, setDetailsType] = useState<'students' | 'scores' | 'scoring' | 'invigilation' | 'rank' | 'exam'>('students');
  const [detailsSession, setDetailsSession] = useState<any>(null);

  // Scoring Drawer states
  const [scoringType, setScoringType] = useState<'anonymous' | 'realname'>('anonymous');
  const [scoringTab, setScoringTab] = useState<'admin' | 'candidate'>('admin');
  const [scoringSearchInput, setScoringSearchInput] = useState('');
  const [scoringSearchQuery, setScoringSearchQuery] = useState('');

  // Manual assign grading task modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCount, setAssignCount] = useState(1);
  const [assignMarker, setAssignMarker] = useState('');
  const [isAssignMarkerDropdownOpen, setIsAssignMarkerDropdownOpen] = useState(false);
  const [selectedAssignCandidates, setSelectedAssignCandidates] = useState<string[]>([]);

  // Auto assign grading task modal state
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [autoAssignCount, setAutoAssignCount] = useState(1);
  const [autoAssignMarker, setAutoAssignMarker] = useState('');
  const [isAutoAssignMarkerDropdownOpen, setIsAutoAssignMarkerDropdownOpen] = useState(false);

  // Grader management modal states
  const [showChangeGraderModal, setShowChangeGraderModal] = useState(false);
  const [graderValue, setGraderValue] = useState('MS.df (teacherDF@sz)');
  const [graderDropdownOpen, setGraderDropdownOpen] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showGradingDetailsModal, setShowGradingDetailsModal] = useState(false);
  const [showImportScoresModal, setShowImportScoresModal] = useState(false);
  const [showCandidateGradingDetailsModal, setShowCandidateGradingDetailsModal] = useState(false);

  // Candidates Drawer states
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [candidateList, setCandidateList] = useState([
    { id: 1, account: 'liuwei', name: 'liuwei', phone: '18751836671', group: '测试用户' },
    { id: 2, account: 'zhangsan', name: '张三', phone: '13812345678', group: '人工智能一班' },
    { id: 3, account: 'lisi', name: '李四', phone: '13912345678', group: '数据科学二班' },
    { id: 4, account: 'wangwu', name: '王五', phone: '13512345678', group: '软件工程一班' }
  ]);
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
  const batchDropdownRef = useRef<HTMLDivElement>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddAccountsText, setQuickAddAccountsText] = useState('');
  const [showAddCandidatesModal, setShowAddCandidatesModal] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [selectedAddStudentIds, setSelectedAddStudentIds] = useState<number[]>([]);
  const [addCandidatesPage, setAddCandidatesPage] = useState(1);
  const [invigilationTab, setInvigilationTab] = useState<'overview' | 'content' | 'notice'>('overview');
  const [invigilationSearchQuery, setInvigilationSearchQuery] = useState('');
  const [selectedCheckpointQuestion, setSelectedCheckpointQuestion] = useState<any>(null);
  const [showEnvDetailsModal, setShowEnvDetailsModal] = useState(false);
  const [selectedStudentForEnv, setSelectedStudentForEnv] = useState<any>(null);
  const [showViewPaperModal, setShowViewPaperModal] = useState(false);
  const [selectedStudentForPaper, setSelectedStudentForPaper] = useState<any>(null);
  const [previewModeActive, setPreviewModeActive] = useState(false);
  const [previewQuestionType, setPreviewQuestionType] = useState<'单选题' | '多选题' | '简答题' | '实训编程题'>('单选题');
  const [previewQuestionIdx, setPreviewQuestionIdx] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  const [openMoreRow, setOpenMoreRow] = useState<string | null>(null);
  useDismissActionMenu(setOpenMoreRow);
  const [contentCurrentPage, setContentCurrentPage] = useState(1);
  const [contentPageSize, setContentPageSize] = useState(5);
  const [overviewCurrentPage, setOverviewCurrentPage] = useState(1);
  const [overviewPageSize, setOverviewPageSize] = useState(5);
  const [rankSearchQuery, setRankSearchQuery] = useState('');
  const [rankCurrentPage, setRankCurrentPage] = useState(1);
  const [rankPageSize, setRankPageSize] = useState(9);
  const getEarnedScore = (secId: string, studentScore: number) => {
    if (studentScore === 100) {
      if (secId === 'single') return 20;
      if (secId === 'multiple') return 20;
      if (secId === 'essay') return 20;
      if (secId === 'coding') return 40;
    }
    if (studentScore === 80) {
      if (secId === 'single') return 20;
      if (secId === 'multiple') return 20;
      if (secId === 'essay') return 15;
      if (secId === 'coding') return 25;
    }
    if (studentScore === 56) {
      if (secId === 'single') return 10;
      if (secId === 'multiple') return 10;
      if (secId === 'essay') return 11;
      if (secId === 'coding') return 25;
    }
    if (studentScore === 40) {
      if (secId === 'single') return 10;
      if (secId === 'multiple') return 10;
      if (secId === 'essay') return 10;
      if (secId === 'coding') return 10;
    }
    if (studentScore === 11) {
      if (secId === 'single') return 10;
      if (secId === 'multiple') return 0;
      if (secId === 'essay') return 1;
      if (secId === 'coding') return 0;
    }
    return 0;
  };

  const getDynamicPreviewQuestions = (studentScore: number) => {
    return [
      {
        id: 1,
        type: '单选题',
        title: '下列哪个 Python 数据类型是不可变的？',
        options: [
          { key: 'A', value: 'List (列表)' },
          { key: 'B', value: 'Dictionary (字典)' },
          { key: 'C', value: 'Tuple (元组)' },
          { key: 'D', value: 'Set (集合)' }
        ],
        answer: 'C',
        studentAnswer: studentScore > 11 ? 'C' : 'A',
        isCorrect: studentScore > 11,
        score: studentScore > 11 ? 10 : 0,
        maxScore: 10
      },
      {
        id: 2,
        type: '单选题',
        title: '在 Python 中，下列哪个关键字用于定义匿名函数？',
        options: [
          { key: 'A', value: 'def' },
          { key: 'B', value: 'lambda' },
          { key: 'C', value: 'class' },
          { key: 'D', value: 'func' }
        ],
        answer: 'B',
        studentAnswer: studentScore >= 80 ? 'B' : 'A',
        isCorrect: studentScore >= 80,
        score: studentScore >= 80 ? 10 : 0,
        maxScore: 10
      },
      {
        id: 3,
        type: '多选题',
        title: '以下哪些属于 Python 中的内置修饰器 (Decorator)？',
        options: [
          { key: 'A', value: '@property' },
          { key: 'B', value: '@staticmethod' },
          { key: 'C', value: '@classmethod' },
          { key: 'D', value: '@override' }
        ],
        answer: ['A', 'B', 'C'],
        studentAnswer: studentScore === 100 || studentScore === 80 || studentScore === 56 ? ['A', 'B', 'C'] : (studentScore === 11 ? ['A', 'B'] : []),
        isCorrect: studentScore === 100 || studentScore === 80 || studentScore === 56,
        score: (studentScore === 100 || studentScore === 80 || studentScore === 56) ? 10 : (studentScore === 11 ? 5 : 0),
        maxScore: 10
      },
      {
        id: 4,
        type: '多选题',
        title: '下列关于 Python 列表 (List) 和元组 (Tuple) 的说法，正确的有？',
        options: [
          { key: 'A', value: '列表是可变对象，元组是不可变对象' },
          { key: 'B', value: '列表和元组都支持切片操作' },
          { key: 'C', value: '列表和元组都可以作为字典的键' },
          { key: 'D', value: '元组的内存开销通常比列表小' }
        ],
        answer: ['A', 'B', 'D'],
        studentAnswer: studentScore === 100 || studentScore === 80 ? ['A', 'B', 'D'] : ['A', 'C'],
        isCorrect: studentScore === 100 || studentScore === 80,
        score: studentScore === 100 || studentScore === 80 ? 10 : 0,
        maxScore: 10
      },
      {
        id: 5,
        type: '简答题',
        title: '请简述 Python 中 is 和 == 的区别。',
        answerText: 'is 比较的是两个对象的物理内存地址是否相同（同一性），而 == 比较的是两个对象的值是否相等（相等性）。例如，a = [1, 2] 和 b = [1, 2]，a == b 为 True，但 a is b 为 False。',
        studentAnswerText: studentScore > 40
          ? 'is 比较的是两个对象的物理内存地址是否相同（同一性），而 == 比较的是两个对象的值是否相等（相等性）。例如，a = [1, 2] 和 b = [1, 2]，a == b 为 True，但 a is b 为 False。'
          : (studentScore === 40 ? 'is比较地址，==比较内容。' : '未作答'),
        isCorrect: studentScore > 40,
        score: studentScore === 100 ? 20 : (studentScore === 80 ? 15 : (studentScore === 56 ? 11 : (studentScore === 40 ? 10 : (studentScore === 11 ? 1 : 0)))),
        maxScore: 20
      },
      {
        id: 6,
        type: '实训编程题',
        title: '请编写一个 Python 函数，计算斐波那契数列的第 n 项。要求输入正整数 n，返回对应的斐波那契数，时间复杂度控制在 O(n)。',
        answerText: 'def fibonacci(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b',
        studentAnswerText: studentScore > 40
          ? 'def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b'
          : (studentScore === 40 ? 'def fibonacci(n):\n    # 递归法（时间复杂度较高）\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)' : '未作答'),
        isCorrect: studentScore > 40,
        score: studentScore === 100 ? 40 : (studentScore === 80 ? 25 : (studentScore === 56 ? 25 : (studentScore === 40 ? 10 : 0))),
        maxScore: 40
      }
    ];
  };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (examRuleDropdownRef.current && !examRuleDropdownRef.current.contains(event.target as Node)) {
        setIsExamRuleDropdownOpen(false);
      }
      if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target as Node)) {
        setIsBatchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setAddCandidatesPage(1);
  }, [addSearchQuery]);
  
  // AI Disable Config states
  const [disableAI, setDisableAI] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    qa: true, // true means completely disabled, false means partial/enabled depending on mode
    code: true,
    question: true,
    scoring: true
  });

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleCreate = () => {
    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? {
        ...e,
        name: examName || '未命名考试'
      } : e));
      showToast('编辑考试成功');
    } else {
      setExams([{
        id: Date.now(),
        name: examName || '未命名考试',
        scene,
        status: '草稿',
        sessionsCount: 0,
        enrolled: 0,
        creator: '当前用户',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16),
        sessions: []
      }, ...exams]);
      showToast('新建考试成功');
    }
    setIsCreateDrawerOpen(false);
    setEditingExam(null);
    setExamName('');
    setExamRule('仅能提交1次');
    setEnrollCount(0);
    setOrganizer('');
    setCoOrganizer('');
    setIntro('');
    setNotice('test');
    setPaperConfig('');
    setDisableAI(false);
    setShowSelectPaperModal(false);
    setPaperModalPage(1);
    setTempSelectedPaper('');
    setIsExamRuleDropdownOpen(false);
  };

  // Exam Actions
  const handleToggleExamStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === '启用' ? '草稿' : '启用';
    setExams(exams.map(e => e.id === id ? { ...e, status: newStatus } : e));
    showToast(`考试已${newStatus}`);
  };

  const handleDeleteExam = (id: number) => {
    if (window.confirm('确定要删除该考试吗？此操作不可恢复。')) {
      setExams(exams.filter(e => e.id !== id));
      showToast('考试已删除');
    }
  };

  const handleAddSession = (examId: number) => {
    setExams(exams.map(e => {
      if (e.id === examId) {
        return {
          ...e,
          sessionsCount: e.sessionsCount + 1,
          sessions: [
            ...e.sessions,
            {
              id: Date.now(),
              name: `新增测试场次${e.sessionsCount + 1}`,
              type: '测试场次',
              location: '未分配',
              status: '未开始',
              invigilator: '未指定',
              startTime: '--',
              endTime: '--',
              visibility: '隐藏'
            }
          ]
        };
      }
      return e;
    }));
    setExpandedRow(examId);
    showToast('已添加新场次');
  };

  const handleSaveSession = () => {
    if (!sessionName.trim()) {
      showToast('请输入场次名称', 'error');
      return;
    }
    if (!sessionStartTime || !sessionEndTime) {
      showToast('请选择场次时间', 'error');
      return;
    }
    if (!sessionInvigilator) {
      showToast('请选择监考老师', 'error');
      return;
    }

    setExams(exams.map(e => {
      if (e.id === targetExamId) {
        const isEditing = e.sessions.some(s => s.id === editingSessionId);
        return {
          ...e,
          sessions: isEditing
            ? e.sessions.map(s => s.id === editingSessionId ? {
                ...s,
                name: sessionName,
                type: sessionType,
                location: sessionLocation || '未分配考场',
                invigilator: sessionInvigilator,
                startTime: sessionStartTime.replace('T', ' '),
                endTime: sessionEndTime.replace('T', ' ')
              } : s)
            : [
                ...e.sessions,
                {
                  id: Date.now(),
                  name: sessionName,
                  type: sessionType,
                  location: sessionLocation || '未分配考场',
                  status: '未开始',
                  invigilator: sessionInvigilator,
                  startTime: sessionStartTime.replace('T', ' '),
                  endTime: sessionEndTime.replace('T', ' '),
                  visibility: '隐藏'
                }
              ],
          sessionsCount: isEditing ? e.sessionsCount : e.sessionsCount + 1
        };
      }
      return e;
    }));
    
    setExpandedRow(targetExamId);
    setIsAddSessionDrawerOpen(false);
    showToast(editingSessionId ? '场次修改成功！' : '场次添加成功！');
  };

  const handleMockNavigate = (action: string) => {
    showToast(`正在跳转至：${action}`, 'info');
  };

  // Session Actions
  const handleToggleSessionVisibility = (examId: number, sessionId: number, currentVisibility: string) => {
    const newVisibility = currentVisibility === '显示' ? '隐藏' : '显示';
    setExams(exams.map(e => {
      if (e.id === examId) {
        return {
          ...e,
          sessions: e.sessions.map(s => s.id === sessionId ? { ...s, visibility: newVisibility } : s)
        };
      }
      return e;
    }));
    showToast(`场次已${newVisibility}`);
  };

  const handleEndSession = (examId: number, sessionId: number) => {
    if (window.confirm('确定要结束该场考试吗？结束后学生将无法继续答题。')) {
      setExams(exams.map(e => {
        if (e.id === examId) {
          return {
            ...e,
            sessions: e.sessions.map(s => s.id === sessionId ? { ...s, status: '已结束' } : s)
          };
        }
        return e;
      }));
      showToast('考试已结束');
    }
  };

  const handleCopySession = (examId: number, session: any) => {
    setExams(exams.map(e => {
      if (e.id === examId) {
        return {
          ...e,
          sessionsCount: e.sessionsCount + 1,
          sessions: [
            ...e.sessions,
            { ...session, id: Date.now(), name: `${session.name} (副本)` }
          ]
        };
      }
      return e;
    }));
    showToast('场次复制成功');
  };

  const handleDeleteSession = (examId: number, sessionId: number) => {
    if (window.confirm('确定要删除该场次吗？此操作不可恢复。')) {
      setExams(exams.map(e => {
        if (e.id === examId) {
          return {
            ...e,
            sessionsCount: Math.max(0, e.sessionsCount - 1),
            sessions: e.sessions.filter(s => s.id !== sessionId)
          };
        }
        return e;
      }));
      showToast('场次已删除');
    }
  };

  const handleExamDetails = (exam: any) => {
    setDetailsSession(exam);
    setDetailsType('exam');
    setIsDetailsDrawerOpen(true);
  };

  const handleEditExam = (exam: any) => {
    setEditingExam(exam);
    setExamName(exam.name);
    setIsCreateDrawerOpen(true);
  };

  const handleConfirmDeleteExam = (exam: any) => {
    setConfirmModal({
      show: true,
      title: '删除考试确认',
      message: `确定要删除考试「${exam.name}」吗？删除后该考试下的所有场次、监考信息及学生答卷数据将永久丢失，此操作不可恢复。`,
      showCancel: true,
      onConfirm: () => {
        setExams(exams.filter(e => e.id !== exam.id));
        showToast('考试已成功删除');
      }
    });
  };

  const handleConfirmToggleExamStatus = (exam: any) => {
    const isEnabling = exam.status !== '启用';
    setConfirmModal({
      show: true,
      title: isEnabling ? '启用考试确认' : '停用考试确认',
      message: isEnabling 
        ? `确定要启用考试「${exam.name}」吗？启用后，系统将正式开放本考试的选课与场次关联，学生可准备参考。`
        : `确定要停用考试「${exam.name}」吗？停用后，所有关联场次将立即挂起，尚未提交答卷的学生将无法继续答题。`,
      showCancel: true,
      onConfirm: () => {
        setExams(exams.map(e => e.id === exam.id ? { ...e, status: isEnabling ? '启用' : '草稿' } : e));
        showToast(`考试已${isEnabling ? '启用' : '停用'}`);
      }
    });
  };

  const handleConfirmAddSession = (exam: any) => {
    setConfirmModal({
      show: true,
      title: '添加场次确认',
      message: `确定要在考试「${exam.name}」下追加一个新的考试场次吗？新建后您可以前往场次列表配置考场和监考教师。`,
      showCancel: true,
      onConfirm: () => {
        handleAddSession(exam.id);
      }
    });
  };

  const handleConfirmDeleteSession = (examId: number, session: any) => {
    setConfirmModal({
      show: true,
      title: '删除场次确认',
      message: `确定要删除场次「${session.name}」吗？此操作不可逆，已分配考生的准考信息也将一并清除。`,
      showCancel: true,
      onConfirm: () => {
        setExams(exams.map(e => {
          if (e.id === examId) {
            return {
              ...e,
              sessionsCount: Math.max(0, e.sessionsCount - 1),
              sessions: e.sessions.filter(s => s.id !== session.id)
            };
          }
          return e;
        }));
        showToast('场次已删除');
      }
    });
  };

  const handleConfirmCopySession = (examId: number, session: any) => {
    setConfirmModal({
      show: true,
      title: '复制场次确认',
      message: `确定要复制场次「${session.name}」吗？系统将自动创建该场次的一个克隆副本（副本名称包含 (副本) 后缀）。`,
      showCancel: true,
      onConfirm: () => {
        handleCopySession(examId, session);
      }
    });
  };

  const handleEditSession = (examId: number, session: any) => {
    setTargetExamId(examId);
    setEditingSessionId(session.id);
    setSessionName(session.name);
    setSessionType(session.type);
    setSessionStartTime(session.startTime.replace(' ', 'T'));
    setSessionEndTime(session.endTime.replace(' ', 'T'));
    setSessionLocation(session.location);
    setSessionInvigilator(session.invigilator);
    setIsInvigilatorDropdownOpen(false);
    setIsAddSessionDrawerOpen(true);
  };

  const handleSessionStudents = (session: any) => {
    setDetailsSession(session);
    setDetailsType('students');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionInvigilators = (session: any) => {
    setDetailsSession(session);
    setDetailsType('invigilation');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionScoring = (session: any) => {
    setDetailsSession(session);
    setDetailsType('scoring');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionScores = (session: any) => {
    setDetailsSession(session);
    setDetailsType('scores');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionPublish = (session: any) => {
    setConfirmModal({
      show: true,
      title: '公布成绩',
      message: (
        <span>
          确定公布考试<span className="text-[#fa541c] font-semibold">{session.name}</span>成绩？
        </span>
      ),
      showCancel: true,
      onConfirm: () => {
        showToast('成绩已成功公布！');
      }
    });
  };

  const handleSessionRank = (session: any) => {
    setDetailsSession(session);
    setDetailsType('rank');
    setIsDetailsDrawerOpen(true);
  };

  const getSessionActions = (examId: number, session: any) => {
    const actions: { label: string; onClick: () => void; isDanger?: boolean }[] = [];

    const onEdit = () => handleEditSession(examId, session);
    const onDelete = () => handleConfirmDeleteSession(examId, session);
    const onCopy = () => handleConfirmCopySession(examId, session);
    const onStudents = () => handleSessionStudents(session);
    const onInvigilators = () => handleSessionInvigilators(session);
    const onScoring = () => handleSessionScoring(session);
    const onToggleVisibility = () => handleToggleSessionVisibility(examId, session.id, session.visibility);
    const onStartExam = () => {
      setExams(exams.map(e => {
        if (e.id === examId) {
          return {
            ...e,
            sessions: e.sessions.map(s => s.id === session.id ? { ...s, status: '进行中' } : s)
          };
        }
        return e;
      }));
      showToast('考试已启动！', 'success');
    };
    const onEndExam = () => {
      setExams(exams.map(e => {
        if (e.id === examId) {
          return {
            ...e,
            sessions: e.sessions.map(s => s.id === session.id ? { ...s, status: '已结束' } : s)
          };
        }
        return e;
      }));
      showToast('考试已结束！', 'success');
    };
    const onScores = () => handleSessionScores(session);
    const onPublish = () => handleSessionPublish(session);
    const onRank = () => handleSessionRank(session);

    if (session.type === '测试场次') {
      if (session.status === '未开始') {
        // 编辑、删除、复制、考生名单、监考信息、批阅任务、开始考试、隐藏
        return [
          { label: '开始考试', onClick: onStartExam },
          { label: '考生名单', onClick: onStudents },
          { label: '编辑', onClick: onEdit },
          { label: '监考信息', onClick: onInvigilators },
          { label: '批阅任务', onClick: onScoring },
          { label: '复制', onClick: onCopy },
          { label: session.visibility === '显示' ? '隐藏' : '显示', onClick: onToggleVisibility },
          { label: '删除', onClick: onDelete, isDanger: true }
        ];
      } else if (session.status === '进行中') {
        // 编辑、复制、考生名单、监考信息、结束考试、隐藏
        return [
          { label: '结束考试', onClick: onEndExam },
          { label: '考生名单', onClick: onStudents },
          { label: '编辑', onClick: onEdit },
          { label: '监考信息', onClick: onInvigilators },
          { label: '复制', onClick: onCopy },
          { label: session.visibility === '显示' ? '隐藏' : '显示', onClick: onToggleVisibility }
        ];
      } else if (session.status === '已结束') {
        // 删除、复制、考生名单、监考信息、批阅任务、查看成绩、公布成绩、排行榜、隐藏
        return [
          { label: '查看成绩', onClick: onScores },
          { label: '公布成绩', onClick: onPublish },
          { label: '考生名单', onClick: onStudents },
          { label: '监考信息', onClick: onInvigilators },
          { label: '批阅任务', onClick: onScoring },
          { label: '排行榜', onClick: onRank },
          { label: '复制', onClick: onCopy },
          { label: session.visibility === '显示' ? '隐藏' : '显示', onClick: onToggleVisibility },
          { label: '删除', onClick: onDelete, isDanger: true }
        ];
      }
    } else { // 正式场次
      if (session.status === '未开始') {
        // 编辑、删除、复制、考生名单、监考信息、批阅任务、隐藏
        return [
          { label: '考生名单', onClick: onStudents },
          { label: '编辑', onClick: onEdit },
          { label: '监考信息', onClick: onInvigilators },
          { label: '批阅任务', onClick: onScoring },
          { label: '复制', onClick: onCopy },
          { label: session.visibility === '显示' ? '隐藏' : '显示', onClick: onToggleVisibility },
          { label: '删除', onClick: onDelete, isDanger: true }
        ];
      } else if (session.status === '进行中') {
        // 编辑、复制、考生名单、监考信息、批阅任务、隐藏
        return [
          { label: '考生名单', onClick: onStudents },
          { label: '编辑', onClick: onEdit },
          { label: '监考信息', onClick: onInvigilators },
          { label: '批阅任务', onClick: onScoring },
          { label: '复制', onClick: onCopy },
          { label: session.visibility === '显示' ? '隐藏' : '显示', onClick: onToggleVisibility }
        ];
      } else if (session.status === '已结束') {
        // 删除、复制、考生名单、监考信息、批阅任务、查看成绩、公布成绩、排行榜、隐藏
        return [
          { label: '查看成绩', onClick: onScores },
          { label: '公布成绩', onClick: onPublish },
          { label: '考生名单', onClick: onStudents },
          { label: '监考信息', onClick: onInvigilators },
          { label: '批阅任务', onClick: onScoring },
          { label: '排行榜', onClick: onRank },
          { label: '复制', onClick: onCopy },
          { label: session.visibility === '显示' ? '隐藏' : '显示', onClick: onToggleVisibility },
          { label: '删除', onClick: onDelete, isDanger: true }
        ];
      }
    }
    return [];
  };

  const filteredAvailableCandidates = MOCK_AVAILABLE_CANDIDATES.filter(candidate => {
    const query = addSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      candidate.account.toLowerCase().includes(query) ||
      candidate.name.toLowerCase().includes(query) ||
      candidate.group.toLowerCase().includes(query)
    );
  });

  return (
    <div className={cn("flex flex-col h-full text-left", embedded ? "p-5" : "p-6")}>
      
      {/* Top Actions - Spacing and alignment matching TeacherDatasets */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索考试名称..." 
              className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-9 bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsCreateDrawerOpen(true)}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 h-9 text-[13px] shadow-sm shrink-0 border-0 cursor-pointer font-bold flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> 新建考试
          </Button>
        </div>
      </div>

      {/* Content Area - Table Card Container Module & Standalone Pagination */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden gap-3">
        {/* Table Card Container */}
        <div className="bg-white border border-neutral-200/80 rounded-[8px] overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                <th className="p-4 font-medium w-[4%] text-center"></th>
                <th className="p-4 font-medium text-left w-[36%]">考试名称</th>
                <th className="p-4 font-medium text-left w-[8%]">考试状态</th>
                <th className="p-4 font-medium text-left w-[8%]">考试场次</th>
                <th className="p-4 font-medium text-left w-[8%]">报名人数</th>
                <th className="p-4 font-medium text-left w-[9%]">创建人</th>
                <th className="p-4 font-medium text-left w-[15%]">创建时间</th>
                <th className="p-4 font-medium text-left w-[12%]">操作</th>
              </tr>
            </thead>
            <tbody>
              {sceneExams.map(exam => (
                <React.Fragment key={exam.id}>
                  {/* Parent Row */}
                  <tr className={cn(
                    "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                    expandedRow === exam.id ? "bg-neutral-50/30" : ""
                  )}>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleRow(exam.id)}
                        className="text-neutral-400 hover:text-[#fa541c] transition-colors p-1 cursor-pointer bg-transparent border-0"
                      >
                        <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", expandedRow === exam.id && "transform rotate-90 text-[#fa541c]")} />
                      </button>
                    </td>
                    <td className="p-4 text-left">
                      <div className="text-neutral-800 font-medium max-w-[440px] truncate" title={exam.name}>
                        {exam.name}
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border font-medium",
                        exam.status === '启用' ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="p-4 text-left text-neutral-600">{exam.sessionsCount}</td>
                    <td className="p-4 text-left text-neutral-600">{exam.enrolled}</td>
                    <td className="p-4 text-left text-neutral-600">{exam.creator}</td>
                    <td className="p-4 text-left text-neutral-500 font-mono">{exam.createTime}</td>
                    <td className="p-4 text-left">
                      <div className="flex items-center gap-3">
                        {exam.status === '启用' ? (
                          <>
                            <button 
                              onClick={() => {
                                setTargetExamId(exam.id);
                                setEditingSessionId(null);
                                setSessionName('');
                                setSessionType('正式场次');
                                setSessionStartTime('');
                                setSessionEndTime('');
                                setSessionLocation('');
                                setSessionInvigilator('');
                                setIsInvigilatorDropdownOpen(false);
                                setIsAddSessionDrawerOpen(true);
                              }} 
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              添加场次
                            </button>
                            <button 
                              onClick={() => handleConfirmToggleExamStatus(exam)} 
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              取消启用
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEditExam(exam)} 
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              编辑
                            </button>
                            <button 
                              onClick={() => handleConfirmDeleteExam(exam)} 
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              删除
                            </button>
                            <button 
                              onClick={() => handleConfirmToggleExamStatus(exam)} 
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              启用
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Nested Sessions Table */}
                  {expandedRow === exam.id && (
                    <tr>
                      <td colSpan={8} className="p-0 bg-neutral-50/20">
                        <div className="p-6 pr-8 pl-16 w-full animate-in fade-in slide-in-from-top-2 duration-300 bg-neutral-50/30 border-b border-neutral-100">
                          <table className="w-full text-left border-collapse bg-white rounded border border-neutral-border/50">
                            <thead>
                              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[12px] text-neutral-500 font-medium">
                                <th className="p-3 text-left w-[200px]">场次名称</th>
                                <th className="p-3 text-left w-24">场次类型</th>
                                <th className="p-3 text-left w-28">考场</th>
                                <th className="p-3 text-left w-20">状态</th>
                                <th className="p-3 text-left w-24">监考老师</th>
                                <th className="p-3 text-left w-40">开始时间</th>
                                <th className="p-3 text-left w-40">结束时间</th>
                                <th className="p-3 text-left w-20">可见状态</th>
                                <th className="p-3 text-left w-[200px]">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exam.sessions.length > 0 ? exam.sessions.map(session => (
                                <tr key={session.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/30 text-[12px]">
                                  <td className="p-3 text-left text-neutral-700 font-medium">{session.name}</td>
                                  <td className="p-3 text-left">
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-[11px] border font-medium",
                                      session.type === '正式场次'
                                        ? "bg-orange-50 text-orange-600 border-orange-200"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    )}>
                                      {session.type}
                                    </span>
                                  </td>
                                  <td className="p-3 text-left text-neutral-600">{session.location}</td>
                                  <td className="p-3 text-left">
                                    <span className={cn(
                                      "px-2 py-0.5 text-[11px] rounded border font-medium",
                                      session.status === '进行中' && "bg-emerald-50 text-emerald-600 border-emerald-200",
                                      session.status === '未开始' && "bg-blue-50 text-blue-600 border-blue-200",
                                      session.status === '已结束' && "bg-neutral-50 text-neutral-500 border-neutral-200"
                                    )}>
                                      {session.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-left text-neutral-600">{session.invigilator}</td>
                                  <td className="p-3 text-left text-neutral-500 font-mono">{session.startTime}</td>
                                  <td className="p-3 text-left text-neutral-500 font-mono">{session.endTime}</td>
                                  <td className="p-3 text-left text-neutral-600">{session.visibility}</td>
                                  <td className="p-3 text-left">
                                    <div className="flex items-center gap-3">
                                      {(() => {
                                        const actions = getSessionActions(exam.id, session);
                                        const primaryActions = actions.slice(0, 2);
                                        const secondaryActions = actions.slice(2);
                                        return (
                                          <>
                                            {primaryActions.map((act, actIdx) => (
                                              <button
                                                key={actIdx}
                                                onClick={act.onClick}
                                                className={cn(
                                                  "font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]",
                                                  act.isDanger 
                                                    ? "text-red-500 hover:text-red-750" 
                                                    : "text-[#fa541c] hover:text-[#e84a15]"
                                                )}
                                              >
                                                {act.label}
                                              </button>
                                            ))}
                                            {secondaryActions.length > 0 && (
                                              <div className="relative" data-action-menu-open={activeDropdownId === `session-${session.id}`}>
                                                <button 
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdownId(activeDropdownId === `session-${session.id}` ? null : `session-${session.id}`);
                                                  }}
                                                  className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px] flex items-center gap-0.5"
                                                >
                                                  更多 <ChevronDown className="w-3 h-3" />
                                                </button>
                                                {activeDropdownId === `session-${session.id}` && (
                                                  <div className="absolute right-0 bottom-full mb-1.5 bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[120px] text-left animate-in fade-in slide-in-from-bottom-1 duration-150">
                                                    {secondaryActions.map((act, actIdx) => (
                                                      <button 
                                                        key={actIdx}
                                                        onClick={() => {
                                                          setActiveDropdownId(null);
                                                          act.onClick();
                                                        }}
                                                        className="w-full text-left px-3 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50"
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
                              )) : (
                                <tr>
                                  <td colSpan={9} className="p-6 text-center text-neutral-400 text-xs">
                                    暂无场次信息
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standalone Bottom Pagination Bar - Matching Dataset Module */}
      <div className="py-2 px-1 flex items-center justify-end gap-3 text-xs text-neutral-500 shrink-0 select-none">
        <span>共 {sceneExams.length} 条</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center hover:bg-neutral-50 cursor-pointer bg-white text-neutral-600">
            &lt;
          </button>
          <button className="w-7 h-7 bg-[#fa541c] text-white rounded font-bold flex items-center justify-center shadow-xs border-0">
            1
          </button>
          <button className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center hover:bg-neutral-50 cursor-pointer bg-white text-neutral-600">
            &gt;
          </button>
        </div>
        <select className="border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-600 bg-white focus:outline-none focus:border-[#fa541c]">
          <option value="10">10 条/页</option>
          <option value="20">20 条/页</option>
          <option value="50">50 条/页</option>
        </select>
      </div>
    </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[500] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-white px-6 py-3 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold text-neutral-800">{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Create Exam Drawer */}
      {isCreateDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsCreateDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10">
              <h2 className="text-[15px] font-bold text-neutral-850">新增考试配置</h2>
              <button 
                onClick={() => setIsCreateDrawerOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white relative">
              
              {/* Exam Name */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>考试名称
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 考试规则 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>考试规则
                </label>
                <div ref={examRuleDropdownRef} className="relative w-full text-[13px]">
                  <div 
                    onClick={() => setIsExamRuleDropdownOpen(!isExamRuleDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none border-neutral-200",
                      isExamRuleDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(examRule ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {examRule || '请选择考试规则'}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isExamRuleDropdownOpen && "rotate-180")} />
                  </div>
                  {/* Dropdown Menu */}
                  {isExamRuleDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setExamRule("");
                            setIsExamRuleDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !examRule 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择考试规则</span>
                          {!examRule && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {['仅能提交1次', '限时提交', '不允许二次提交', '无限次提交'].map((rule) => {
                          const isSelected = examRule === rule;
                          return (
                            <div
                              key={rule}
                              onClick={() => {
                                setExamRule(rule);
                                setIsExamRuleDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected ? "bg-orange-50 text-[#fa541c] font-bold" : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{rule}</span>
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

              {/* 报名人数 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  报名人数
                </label>
                <input 
                  type="number"
                  min={0}
                  value={enrollCount || ''}
                  onChange={(e) => setEnrollCount(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 主办方 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  主办方
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 协办方 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  协办方
                </label>
                <input
                  type="text"
                  value={coOrganizer}
                  onChange={(e) => setCoOrganizer(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 考试介绍 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  考试介绍
                </label>
                <input
                  type="text"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 考试须知 */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                  <span className="text-[#fa541c]">*</span>考试须知
                </label>
                <div className="border border-neutral-200 rounded overflow-hidden focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c]/25 transition-all flex flex-col bg-white">
                  {/* Rich Text Editor Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-neutral-100 bg-neutral-50/50 select-none">
                    <button type="button" title="加粗" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" title="斜体" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" title="文字颜色" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-0.5"><Type className="w-3.5 h-3.5" /><span className="text-[9px] border-b border-neutral-600 leading-none">A</span></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="标题" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-650 font-mono text-[11px] font-bold leading-none cursor-pointer border-0 bg-transparent flex items-center justify-center">H1</button>
                    <button type="button" title="无序列表" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-650 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><List className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="左对齐" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><AlignLeft className="w-3.5 h-3.5" /></button>
                    <button type="button" title="居中对齐" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><AlignCenter className="w-3.5 h-3.5" /></button>
                    <button type="button" title="右对齐" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><AlignRight className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="撤销" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Undo2 className="w-3.5 h-3.5" /></button>
                    <button type="button" title="重做" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Redo2 className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="插入链接" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Link2 className="w-3.5 h-3.5" /></button>
                    <button type="button" title="全屏" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent ml-auto flex items-center justify-center"><Maximize2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {/* Textarea */}
                  <textarea
                    value={notice}
                    onChange={(e) => setNotice(e.target.value)}
                    placeholder="请输入"
                    className="w-full h-24 border-0 rounded-b p-3 text-[13px] focus:outline-none transition-all text-[#262626] bg-white resize-none"
                  />
                </div>
              </div>

              {/* 试卷配置 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>试卷配置
                </label>
                <div className="flex items-center gap-3">
                  {paperConfig ? (
                    <span 
                      className="text-[#fa541c] hover:text-[#e84a15] font-semibold cursor-pointer hover:underline text-[13px]"
                      onClick={() => {
                        setTempSelectedPaper(paperConfig);
                        setShowSelectPaperModal(true);
                      }}
                    >
                      {paperConfig}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTempSelectedPaper(paperConfig);
                        setShowSelectPaperModal(true);
                      }}
                      className="text-[#fa541c] hover:text-[#e84a15] font-semibold bg-transparent border-0 cursor-pointer p-0 text-[13px] transition-colors"
                    >
                      请选择
                    </button>
                  )}
                </div>
              </div>



            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsCreateDrawerOpen(false)}
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleCreate}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                保存并配置场次
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Add Session Drawer */}
      {isAddSessionDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-[13px]"
          onClick={() => setIsAddSessionDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10">
              <h2 className="text-[15px] font-bold text-neutral-850">
                {editingSessionId ? '编辑场次配置' : '新增场次配置'}
              </h2>
              <button 
                onClick={() => setIsAddSessionDrawerOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white relative">
              {/* 场次名称 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>场次名称
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setSessionName(e.target.value);
                      }
                    }}
                    placeholder="请输入场次名称"
                    className="w-full border border-neutral-200 rounded px-3.5 py-2 pr-16 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626] bg-white font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-medium">
                    {sessionName.length} / 100
                  </span>
                </div>
              </div>

              {/* 场次类型 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>场次类型
                </label>
                <div className="flex items-center gap-6">
                  <div 
                    onClick={() => setSessionType('正式场次')}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    {sessionType === '正式场次' ? (
                      <div className="w-[18px] h-[18px] rounded-full border border-[#fa541c] flex items-center justify-center shrink-0">
                        <div className="w-[9px] h-[9px] rounded-full bg-[#fa541c]" />
                      </div>
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-neutral-300 shrink-0" />
                    )}
                    <span className={cn("text-[13px] transition-colors font-medium", sessionType === '正式场次' ? "text-[#fa541c]" : "text-neutral-600")}>正式场次</span>
                  </div>
                  <div 
                    onClick={() => setSessionType('测试场次')}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    {sessionType === '测试场次' ? (
                      <div className="w-[18px] h-[18px] rounded-full border border-[#fa541c] flex items-center justify-center shrink-0">
                        <div className="w-[9px] h-[9px] rounded-full bg-[#fa541c]" />
                      </div>
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-neutral-300 shrink-0" />
                    )}
                    <span className={cn("text-[13px] transition-colors font-medium", sessionType === '测试场次' ? "text-[#fa541c]" : "text-neutral-600")}>测试场次</span>
                  </div>
                </div>
              </div>

              {/* 场次时间 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>场次时间
                </label>
                <div className="flex items-center gap-2 text-[13px] w-full text-neutral-800">
                  <div className="flex-1">
                    <DateTimePicker 
                      value={sessionStartTime}
                      onChange={(val) => setSessionStartTime(val)}
                      placeholder="请选择开始时间"
                      className="text-[13px] w-full"
                      showPresets={false}
                      align="left"
                    />
                  </div>
                  <span className="text-neutral-400 font-medium">—</span>
                  <div className="flex-1">
                    <DateTimePicker 
                      value={sessionEndTime}
                      onChange={(val) => setSessionEndTime(val)}
                      placeholder="请选择结束时间"
                      className="text-[13px] w-full"
                      showPresets={false}
                    />
                  </div>
                </div>
              </div>

              {/* 考场 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  考场
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={sessionLocation}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setSessionLocation(e.target.value);
                      }
                    }}
                    placeholder="请输入考场"
                    className="w-full border border-neutral-200 rounded px-3.5 py-2 pr-16 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626] bg-white font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-medium">
                    {sessionLocation.length} / 100
                  </span>
                </div>
              </div>

              {/* 监考老师 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>监考老师
                </label>
                <div className="relative w-full text-[13px]">
                  <div 
                    onClick={() => setIsInvigilatorDropdownOpen(!isInvigilatorDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none border-neutral-200",
                      isInvigilatorDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(sessionInvigilator ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {sessionInvigilator || '请选择监考老师'}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isInvigilatorDropdownOpen && "rotate-180")} />
                  </div>
                  {isInvigilatorDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setSessionInvigilator("");
                            setIsInvigilatorDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !sessionInvigilator 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择监考老师</span>
                          {!sessionInvigilator && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {['张维老师', '李杰老师', '王莹老师', '陈晨老师'].map((teacher) => {
                          const isSelected = sessionInvigilator === teacher;
                          return (
                            <div
                              key={teacher}
                              onClick={() => {
                                setSessionInvigilator(teacher);
                                setIsInvigilatorDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected ? "bg-orange-50 text-[#fa541c] font-bold" : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{teacher}</span>
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
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsAddSessionDrawerOpen(false)}
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveSession}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                保存场次
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[450] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            {!confirmModal.hideHeader && (
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
                <h2 className="text-[16px] font-bold text-[#262626]">
                  {confirmModal.title}
                </h2>
                <button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} 
                  className="text-neutral-455 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className={cn("p-6 bg-white flex items-start gap-3", confirmModal.hideHeader && "pt-8 pb-4")}>
              {confirmModal.type === 'danger' ? (
                <div className="w-5.5 h-5.5 rounded-full bg-[#ff5b60] text-white flex items-center justify-center font-bold text-[14px] shrink-0 select-none mt-0.5">!</div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
              )}
              <div className={cn("text-neutral-750 leading-normal whitespace-pre-wrap font-medium", confirmModal.hideHeader ? "text-[15px]" : "text-[14px]")}>
                {confirmModal.message}
              </div>
            </div>

            {/* Footer */}
            <div className={cn("px-6 py-4 flex items-center justify-end gap-3 shrink-0", confirmModal.hideHeader ? "border-t-0 pt-2 pb-6 bg-white" : "border-t border-neutral-100 bg-neutral-50/50")}>
              {confirmModal.showCancel && (
                <Button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} 
                  variant="outline"
                  className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
                >
                  取消
                </Button>
              )}
              <Button 
                onClick={() => {
                  setConfirmModal(prev => ({ ...prev, show: false }));
                  confirmModal.onConfirm();
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择试卷 Modal */}
      {showSelectPaperModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left text-[13px]"
          onClick={() => {
            setPaperConfig(tempSelectedPaper);
            setShowSelectPaperModal(false);
          }}
        >
          <div 
            className="bg-white w-full max-w-[900px] max-h-[85vh] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#fa541c]" /> 选择试卷
              </h2>
              <button 
                onClick={() => {
                  setPaperConfig(tempSelectedPaper);
                  setShowSelectPaperModal(false);
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
              <div className="mb-4 flex justify-end">
                <Button 
                  onClick={() => {
                    navigate('/teacher/papers', { state: { openCreate: true } });
                  }}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold text-[12px] px-3.5 h-8 transition-colors shrink-0 border-0 cursor-pointer"
                >
                  新建试卷
                </Button>
              </div>
              <div className="bg-white rounded overflow-hidden border border-neutral-200">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                      <th className="p-4 font-medium w-[50px] text-center"></th>
                      <th className="p-4 font-medium text-left">试卷名称</th>
                      <th className="p-4 font-medium text-center w-[100px]">题目数量</th>
                      <th className="p-4 font-medium text-center w-[120px]">抽题方式</th>
                      <th className="p-4 font-medium text-left">包含题型</th>
                      <th className="p-4 font-medium text-center w-[100px]">试卷分数</th>
                      <th className="p-4 font-medium text-center w-[120px]">创建人</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(MOCK_PAPERS_PAGED[paperModalPage] || []).map((paper, i) => (
                      <tr 
                        key={i} 
                        className={cn(
                          "border-b border-neutral-100 hover:bg-neutral-50/30 cursor-pointer transition-colors text-[13px] text-neutral-700",
                          paperConfig === paper.name ? "bg-orange-50/10" : ""
                        )}
                        onClick={() => setPaperConfig(paper.name)}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="radio" 
                            name="paperSelect" 
                            checked={paperConfig === paper.name} 
                            onChange={() => setPaperConfig(paper.name)}
                            className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer accent-[#fa541c] mx-auto" 
                          />
                        </td>
                        <td className="p-4 text-left font-medium text-neutral-900">{paper.name}</td>
                        <td className="p-4 text-center">{paper.count}</td>
                        <td className="p-4 text-center">{paper.method}</td>
                        <td className="p-4 text-left text-neutral-600 max-w-[280px] truncate" title={paper.types}>{paper.types}</td>
                        <td className="p-4 text-center font-semibold text-neutral-850">{paper.score}</td>
                        <td className="p-4 text-center text-neutral-500">{paper.creator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Component */}
              <div className="flex items-center justify-end py-4 bg-transparent gap-4 mt-2 select-none">
                <span className="text-[13px] text-neutral-500 font-medium">共 20 条</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-[4px] bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700" 
                    disabled={paperModalPage === 1}
                    onClick={() => setPaperModalPage(p => Math.max(1, p - 1))}
                  >
                    &lt;
                  </Button>
                  {[1, 2, 3, 4, 5].map((pageNum) => (
                    <Button 
                      key={pageNum}
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "h-7 w-7 p-0 rounded-[4px] font-bold text-[12px]",
                        paperModalPage === pageNum 
                          ? "bg-[#fa541c] text-white border-[#fa541c]" 
                          : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                      )}
                      onClick={() => setPaperModalPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-[4px] bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700" 
                    disabled={paperModalPage === 5}
                    onClick={() => setPaperModalPage(p => Math.min(5, p + 1))}
                  >
                    &gt;
                  </Button>
                </div>
                <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c] text-neutral-600">
                  <option>10 条/页</option>
                  <option>20 条/页</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setPaperConfig(tempSelectedPaper);
                  setShowSelectPaperModal(false);
                }} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  setShowSelectPaperModal(false);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs border-0 cursor-pointer shadow-sm"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer (For Students list, Scores, Scoring, Invigilation, Rank) */}
      {isDetailsDrawerOpen && detailsSession && (
        <div 
          className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left text-[13px]"
          onClick={() => setIsDetailsDrawerOpen(false)}
        >
          <div 
            className={cn(
              "bg-white w-full h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative",
              (detailsType === 'invigilation' || detailsType === 'scoring') ? "max-w-[1100px]" : "max-w-[600px]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            {detailsType === 'scoring' ? (
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10 select-none">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-bold text-neutral-850 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-[#fa541c]" />
                    批阅任务
                  </h2>
                  <button
                    onClick={() => showToast('已成功刷新数据', 'success')}
                    className="border border-neutral-200 text-neutral-500 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 w-7 h-7 rounded-[4px] flex items-center justify-center cursor-pointer transition-colors bg-white"
                    title="刷新数据"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => setIsDetailsDrawerOpen(false)}
                  className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10">
                <h2 className="text-[15px] font-bold text-neutral-850 flex items-center gap-2">
                  {detailsType === 'students' && <Users className="w-5 h-5 text-[#fa541c]" />}
                  {detailsType === 'scores' && <Award className="w-5 h-5 text-[#fa541c]" />}
                  {detailsType === 'invigilation' && <ShieldCheck className="w-5 h-5 text-[#fa541c]" />}
                  {detailsType === 'rank' && <Trophy className="w-5 h-5 text-[#fa541c]" />}
                  {detailsType === 'exam' && <FileText className="w-5 h-5 text-[#fa541c]" />}
                  
                  {detailsType === 'students' && '考生名单详情'}
                  {detailsType === 'scores' && '查看成绩明细'}
                  {detailsType === 'invigilation' && '监考安排详情'}
                  {detailsType === 'rank' && '场次成绩排行榜'}
                  {detailsType === 'exam' && '考试详情面板'}
                </h2>
                <button 
                  onClick={() => setIsDetailsDrawerOpen(false)}
                  className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white relative">
              {detailsType === 'exam' ? (
                <div className="bg-orange-50/20 rounded-xl p-4 border border-orange-100/60 space-y-2">
                  <div className="text-[14px] font-bold text-neutral-800">考试名称：{detailsSession.name}</div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-neutral-600">
                    <div>考试状态：<span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold",
                      detailsSession.status === '启用' ? "bg-green-50 text-green-600 border border-green-200" : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                    )}>{detailsSession.status}</span></div>
                    <div>参考人数：<span className="text-neutral-900 font-semibold">{detailsSession.enrolled} 人</span></div>
                    <div>关联场次：<span className="text-neutral-900 font-semibold">{detailsSession.sessionsCount} 个场次</span></div>
                    <div>创建人员：<span className="text-neutral-800">{detailsSession.creator}</span></div>
                    <div className="col-span-2">创建时间：<span className="text-neutral-800">{detailsSession.createTime}</span></div>
                  </div>
                </div>
              ) : (
                detailsType !== 'students' && detailsType !== 'invigilation' && detailsType !== 'scores' && detailsType !== 'scoring' && detailsType !== 'rank' && (
                  <div className="bg-orange-50/20 rounded-xl p-4 border border-orange-100/60 space-y-2">
                    <div className="text-[14px] font-bold text-neutral-800">场次名称：{detailsSession.name}</div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs text-neutral-600">
                      <div>考试考场：<span className="text-neutral-900 font-semibold">{detailsSession.location}</span></div>
                      <div>主监考官：<span className="text-neutral-900 font-semibold">{detailsSession.invigilator}</span></div>
                      <div>考试状态：<span className="text-orange-600 font-semibold">{detailsSession.status}</span></div>
                      <div>参考时间：<span className="text-neutral-800">{detailsSession.startTime.slice(5)}</span></div>
                    </div>
                  </div>
                )
              )}

              {/* Conditional Content based on detailsType */}
              {detailsType === 'exam' && (
                <div className="space-y-4 text-xs">
                  {/* Detailed configuration section */}
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50/50 p-4 border-b border-neutral-200 font-bold text-neutral-800 text-sm">
                      考试基础配置信息
                    </div>
                    <div className="p-4 space-y-3.5 text-neutral-700 text-left">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">考试规则：</span>
                        <span className="text-neutral-800 font-semibold">仅能提交1次</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">关联试卷：</span>
                        <span className="text-[#fa541c] font-semibold">机器学习期末考试A卷</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">主办单位：</span>
                        <span className="text-neutral-800 font-semibold">教育部虚拟教研室</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">协办单位：</span>
                        <span className="text-neutral-800 font-semibold">深度学习工坊</span>
                      </div>
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-neutral-500">考试介绍：</span>
                        <span className="text-neutral-800 leading-relaxed bg-neutral-50 p-2.5 rounded border border-neutral-100">
                          针对机器学习及深度学习专业能力的综合性考核，涵盖了多元线性回归、卷积神经网络（CNN）、循环神经网络（RNN）等主流架构的原理题与动手编程实践题。
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-cheat and notice */}
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50/50 p-4 border-b border-neutral-200 font-bold text-neutral-800 text-sm">
                      考试须知与注意事项
                    </div>
                    <div className="p-4 text-left">
                      <div className="bg-orange-50/30 border border-orange-100 p-3.5 rounded text-neutral-800 leading-relaxed">
                        1. 请各位参考考生提前准备好考试环境，确保摄像头与音频输入输出设备运行良好。<br/>
                        2. 考中将自动启用摄像头轨迹检测与切屏警示拦截。<br/>
                        3. 超过 3 次切屏或检测到中途更换人员，系统将自动执行强制交卷，成绩按零分处理。
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailsType === 'students' && (
                <div className="space-y-4 text-[13px]">
                  {/* Top Bar with Search and Action Buttons */}
                  <div className="flex items-center justify-between gap-3 bg-white pb-1 select-none flex-nowrap w-full">
                    {/* Search Input */}
                    <div className="relative shrink-0">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="账号/姓名" 
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        className="w-48 pl-9 pr-4 py-1.5 text-xs border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-neutral-800 bg-white h-8"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
                      <Button
                        onClick={() => {
                          showToast('已刷新数据', 'success');
                        }}
                        variant="outline"
                        className="border border-neutral-200 text-neutral-500 rounded-[4px] h-8 w-8 p-0 flex items-center justify-center bg-white hover:bg-neutral-50 cursor-pointer shrink-0"
                        title="刷新"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </Button>

                      {/* Batch Action Dropdown */}
                      <div ref={batchDropdownRef} className="relative shrink-0 text-left">
                        <Button
                          onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                          className="bg-[#fa541c]/10 hover:bg-[#fa541c]/20 text-[#fa541c] rounded-[4px] h-8 px-3 text-xs border-0 cursor-pointer font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          <span>批量操作</span>
                          <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-[#fa541c]", isBatchDropdownOpen && "rotate-180")} />
                        </Button>
                        {isBatchDropdownOpen && (
                          <div className="absolute right-0 mt-1 w-28 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[160] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div
                              onClick={() => {
                                setIsBatchDropdownOpen(false);
                                showToast('批量导出成功，文件已开始下载', 'success');
                              }}
                              className="px-3 py-2 text-left text-xs text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900 cursor-pointer transition-colors"
                            >
                              批量导出
                            </div>
                            <div
                              onClick={() => {
                                setIsBatchDropdownOpen(false);
                                if (selectedStudentIds.length === 0) {
                                  showToast('请先勾选需要移除的考生', 'error');
                                  return;
                                }
                                setCandidateList(candidateList.filter(stu => !selectedStudentIds.includes(stu.id)));
                                setSelectedStudentIds([]);
                                showToast('批量移除成功！', 'success');
                              }}
                              className={cn(
                                "px-3 py-2 text-left text-xs transition-colors cursor-pointer",
                                selectedStudentIds.length > 0
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-neutral-300 cursor-not-allowed bg-neutral-50/20"
                              )}
                            >
                              批量移除 {selectedStudentIds.length > 0 && `(${selectedStudentIds.length})`}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => setShowQuickAddModal(true)}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-8 px-2.5 text-xs border-0 cursor-pointer font-bold shadow-sm shrink-0"
                      >
                        快速添加
                      </Button>
                      <Button
                        onClick={() => setShowAddCandidatesModal(true)}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-8 px-2.5 text-xs border-0 cursor-pointer font-bold shadow-sm shrink-0"
                      >
                        添加
                      </Button>
                    </div>
                  </div>

                  {/* Candidates Table */}
                  <div className="w-full overflow-y-auto border border-neutral-100 rounded-[8px] bg-white custom-scrollbar max-h-[380px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium sticky top-0 z-10 select-none">
                          <th className="p-3 w-10 text-center">
                            <input 
                              type="checkbox"
                              checked={candidateList.length > 0 && candidateList.every(stu => selectedStudentIds.includes(stu.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudentIds(candidateList.map(stu => stu.id));
                                } else {
                                  setSelectedStudentIds([]);
                                }
                              }}
                              className="w-3.5 h-3.5 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] accent-[#fa541c] cursor-pointer"
                            />
                          </th>
                          <th className="p-3">账号</th>
                          <th className="p-3">姓名</th>
                          <th className="p-3">手机号</th>
                          <th className="p-3">用户组</th>
                          <th className="p-3 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-700 bg-white">
                        {candidateList.filter(stu => 
                          stu.account.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          stu.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                        ).map((stu) => {
                          const isChecked = selectedStudentIds.includes(stu.id);
                          return (
                            <tr key={stu.id} className="hover:bg-neutral-50/50 transition-colors h-11">
                              <td className="p-3 text-center">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedStudentIds([...selectedStudentIds, stu.id]);
                                    } else {
                                      setSelectedStudentIds(selectedStudentIds.filter(id => id !== stu.id));
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] accent-[#fa541c] cursor-pointer"
                                />
                              </td>
                              <td className="p-3 font-semibold text-neutral-800 font-mono">{stu.account}</td>
                              <td className="p-3 text-neutral-700">{stu.name}</td>
                              <td className="p-3 text-neutral-500 font-mono">{stu.phone}</td>
                              <td className="p-3 text-neutral-500">{stu.group}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    setConfirmModal({
                                      show: true,
                                      title: '确认移除考生',
                                      message: `确定要从考生名单中移除考生 "${stu.name}" 吗？该操作不可撤销。`,
                                      showCancel: true,
                                      onConfirm: () => {
                                        setCandidateList(candidateList.filter(s => s.id !== stu.id));
                                        setSelectedStudentIds(selectedStudentIds.filter(id => id !== stu.id));
                                        showToast(`已成功移除考生: ${stu.name}`, 'success');
                                      }
                                    });
                                  }}
                                  className="text-[#fa541c] hover:text-[#e84a15] font-semibold cursor-pointer border-0 bg-transparent p-0 text-xs transition-colors"
                                >
                                  移除
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {candidateList.filter(stu => 
                          stu.account.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          stu.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-neutral-400">
                              暂无考生数据
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailsType === 'scores' && (
                <div className="space-y-4">

                  {/* 表格上方添加按钮:刷新、导出、团队成绩导出 */}
                  <div className="flex justify-end items-center gap-2 select-none">
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('已成功刷新成绩数据', 'success')}
                      className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 w-8 h-8 p-0 flex items-center justify-center rounded-[4px] cursor-pointer bg-white"
                      title="刷新"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('正在导出成绩表格...', 'success')}
                      className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-3.5 h-8 text-[12px] font-bold rounded-[4px] cursor-pointer bg-white"
                    >
                      导出
                    </Button>
                    <Button 
                      onClick={() => showToast('正在导出团队成绩表格...', 'success')}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-3.5 h-8 text-[12px] font-bold rounded-[4px] cursor-pointer shadow-sm border-0 transition-colors"
                    >
                      团队成绩导出
                    </Button>
                  </div>

                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                          <th className="p-3">姓名</th>
                          <th className="p-3">账号</th>
                          <th className="p-3">手机号</th>
                          <th className="p-3">用户组</th>
                          <th className="p-3">考卷得分</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                        {[
                          { name: '李四', score: 98, account: 'lisi01', phone: '13812345678', userGroup: '2026级AI一班' },
                          { name: '张三', score: 95, account: 'zhangsan02', phone: '13987654321', userGroup: '2026级AI一班' },
                          { name: '王五', score: 92, account: 'wangwu03', phone: '13700001111', userGroup: '2026级AI二班' },
                          { name: '赵六', score: 89, account: 'zhaoliu04', phone: '13611112222', userGroup: '2026级软件二班' },
                          { name: '周七', score: 88, account: 'zhouqi05', phone: '13522223333', userGroup: '2026级软件一班' },
                          { name: '周十', score: 85, account: 'zhoushi08', phone: '13255556666', userGroup: '2026级软件二班' },
                          { name: '吴十一', score: 79, account: 'wushiyi09', phone: '13166667777', userGroup: '2026级AI二班' },
                          { name: '钱八', score: 75, account: 'qianba06', phone: '13433334444', userGroup: '2026级计算机三班' },
                          { name: '郑十二', score: 68, account: 'zhengshier10', phone: '13077778888', userGroup: '2026级计算机一班' },
                          { name: '孙九', score: 60, account: 'sunjiu07', phone: '13344445555', userGroup: '2026级计算机一班' },
                        ].map((stu, i) => (
                          <tr key={i} className="hover:bg-neutral-50/50">
                            <td className="p-3 font-semibold text-neutral-900">{stu.name}</td>
                            <td className="p-3 text-neutral-500 font-mono">{stu.account}</td>
                            <td className="p-3 text-neutral-500 font-mono">{stu.phone}</td>
                            <td className="p-3 text-neutral-600">{stu.userGroup}</td>
                            <td className="p-3 font-bold text-[#fa541c]">{stu.score} 分</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer (Outside table, no border) */}
                  <div className="flex items-center justify-end pt-2 gap-4 bg-transparent select-none">
                    <span className="text-[13px] text-neutral-500">共 10 条</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&gt;</Button>
                    </div>
                    <div className="relative bg-white rounded-[6px]">
                      <select className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm">
                        <option className="bg-white">10 条/页</option>
                        <option className="bg-white">20 条/页</option>
                        <option className="bg-white">50 条/页</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailsType === 'scoring' && (
                <div className="space-y-5 flex flex-col h-full select-none text-[13px]">
                  {/* Top Info Cards matching Invigilation Style */}
                  <div className="grid grid-cols-2 gap-5 select-none text-[13px]">
                    {/* Left Card: 批阅进度统计 */}
                    <div className="border border-neutral-200 rounded-[8px] bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                      <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 flex items-center gap-1.5 shrink-0">
                        <Users className="w-4 h-4 text-blue-500" />
                        批阅进度统计
                      </div>
                      <div className="p-4 grid grid-cols-3 gap-3 flex-1 items-center">
                        <div className="bg-emerald-50/45 border border-emerald-100 rounded-lg p-3 text-center flex flex-col justify-between h-full">
                          <span className="text-[10px] text-emerald-600 font-bold">已分配批阅</span>
                          <span className="text-2xl font-bold text-emerald-600 font-mono mt-1">1 <span className="text-[11px] font-normal text-emerald-500">人</span></span>
                        </div>
                        <div className="bg-orange-50/45 border border-orange-100 rounded-lg p-3 text-center flex flex-col justify-between h-full">
                          <span className="text-[10px] text-orange-600 font-bold">待分配批阅</span>
                          <span className="text-2xl font-bold text-orange-600 font-mono mt-1">0 <span className="text-[11px] font-normal text-[#fa541c]">人</span></span>
                        </div>
                        <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-lg p-3 text-center flex flex-col justify-between h-full">
                          <span className="text-[10px] text-neutral-400 font-bold">未交卷/未参赛</span>
                          <span className="text-2xl font-bold text-neutral-500 font-mono mt-1">1 <span className="text-[11px] font-normal text-neutral-400">人</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Right Card: 批阅隐私设置 */}
                    <div className="border border-neutral-200 rounded-[8px] bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                      <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 flex items-center gap-1.5 shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[#fa541c]" />
                        批阅隐私设置
                      </div>
                      <div className="p-4 flex flex-col justify-center flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Anonymous Toggle Option */}
                          <div 
                            onClick={() => setScoringType('anonymous')}
                            className={cn(
                              "border rounded-[6px] p-2.5 flex items-center gap-2.5 cursor-pointer transition-all hover:bg-neutral-50 select-none text-[12px] font-semibold text-left",
                              scoringType === 'anonymous' 
                                ? "border-[#fa541c] bg-orange-50/20 text-[#fa541c]" 
                                : "border-neutral-200 text-neutral-500"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                              scoringType === 'anonymous' ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-350"
                            )}>
                              {scoringType === 'anonymous' && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold">匿名批阅</span>
                              <span className="text-[10px] text-neutral-400 font-normal">隐藏姓名和账号</span>
                            </div>
                          </div>

                          {/* Real-name Toggle Option */}
                          <div 
                            onClick={() => setScoringType('realname')}
                            className={cn(
                              "border rounded-[6px] p-2.5 flex items-center gap-2.5 cursor-pointer transition-all hover:bg-neutral-50 select-none text-[12px] font-semibold text-left",
                              scoringType === 'realname' 
                                ? "border-[#fa541c] bg-orange-50/20 text-[#fa541c]" 
                                : "border-neutral-200 text-neutral-500"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                              scoringType === 'realname' ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-350"
                            )}>
                              {scoringType === 'realname' && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold">实名批阅</span>
                              <span className="text-[10px] text-neutral-400 font-normal">显示姓名和账号</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title & Action Toolbar */}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-extrabold text-neutral-850">已分配的批阅任务</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast('已成功刷新批阅任务列表', 'success')}
                        className="border border-neutral-200 text-neutral-500 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 w-8 h-8 rounded-[4px] flex items-center justify-center cursor-pointer transition-colors bg-white"
                        title="刷新列表"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <Button
                        onClick={() => {
                          setConfirmModal({
                            show: true,
                            title: '移除批阅任务',
                            message: '确定移除批阅任务?',
                            showCancel: true,
                            type: 'danger',
                            onConfirm: () => {
                              showToast('正在执行移除批阅任务...', 'success');
                            }
                          });
                        }}
                        variant="outline"
                        className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 font-bold h-8 px-3 rounded-[4px] text-[12px] cursor-pointer bg-white transition-all"
                      >
                        移除批阅任务
                      </Button>
                      <Button
                        onClick={() => setShowAutoAssignModal(true)}
                        variant="outline"
                        className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 font-bold h-8 px-3 rounded-[4px] text-[12px] cursor-pointer bg-white transition-all"
                      >
                        自动分配批阅设置
                      </Button>
                      <Button
                        onClick={() => setShowAssignModal(true)}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-8 px-3.5 rounded-[4px] text-[12px] border-0 cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        分配批阅任务
                      </Button>
                    </div>
                  </div>

                  {/* Tabs header */}
                  <div className="border-b border-neutral-200 flex gap-5 overflow-x-auto no-scrollbar select-none bg-white pb-0 shrink-0 mt-3">
                    {[
                      { key: 'admin', name: '管理员视角' },
                      { key: 'candidate', name: '考生视角' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setScoringTab(tab.key as any)}
                        className={cn(
                          "pb-2 text-[13px] font-medium transition-all relative whitespace-nowrap cursor-pointer -mb-[1px] border-b-2 bg-transparent border-t-0 border-x-0",
                          scoringTab === tab.key 
                            ? "text-[#fa541c] font-bold border-[#fa541c]" 
                            : "text-neutral-500 hover:text-neutral-800 border-transparent"
                        )}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Tab contents (with 20px gap, using mt-5) */}
                  {scoringTab === 'admin' && (
                    <div className="space-y-4 mt-5">
                      <div className="w-full overflow-y-auto border border-neutral-150 rounded-[8px] bg-white custom-scrollbar max-h-[350px]">
                        <table className="w-full text-left border-collapse text-xs select-none">
                          <thead>
                            <tr className="border-b border-neutral-100 text-neutral-600 font-semibold sticky top-0 z-10 text-[13px] bg-neutral-50">
                              <th className="p-3 text-left bg-neutral-50">批阅账号</th>
                              <th className="p-3 text-left bg-neutral-50">批阅姓名</th>
                              <th className="p-3 text-left bg-neutral-50">分配人数</th>
                              <th className="p-3 text-left bg-neutral-50">批阅进度</th>
                              <th className="p-3 text-left bg-neutral-50 w-64">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                            {[
                              { account: 'sx_admin', name: 'sxAdmin', count: 1, done: 0 }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-neutral-50/40 transition-colors">
                                <td className="p-3 font-semibold text-neutral-600 font-mono">{row.account}</td>
                                <td className="p-3 font-medium text-neutral-850">{row.name}</td>
                                <td className="p-3 font-mono text-neutral-500">{row.count}</td>
                                <td className="p-3 font-mono text-neutral-605">
                                  {row.done}/{row.count}
                                </td>
                                <td className="p-3 text-left">
                                  <div className="flex items-center justify-start gap-3">
                                    <button 
                                      onClick={() => setShowChangeGraderModal(true)}
                                      className="text-[#fa541c] hover:text-[#e84a15] hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 text-xs"
                                    >
                                      更换批阅人
                                    </button>
                                    <button 
                                      onClick={() => setShowStudentsModal(true)}
                                      className="text-[#fa541c] hover:text-[#e84a15] hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 text-xs"
                                    >
                                      考生名单
                                    </button>
                                    <button 
                                      onClick={() => setShowGradingDetailsModal(true)}
                                      className="text-[#fa541c] hover:text-[#e84a15] hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 text-xs"
                                    >
                                      批阅详情
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {scoringTab === 'candidate' && (
                    <div className="space-y-4 mt-5">
                      {/* Candidate Perspective Filter Toolbar */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                              type="text"
                              value={scoringSearchInput}
                              onChange={(e) => {
                                setScoringSearchInput(e.target.value);
                                setScoringSearchQuery(e.target.value);
                              }}
                              placeholder="请输入账号/姓名"
                              className="pl-9 pr-4 py-1.5 text-xs border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-neutral-850 bg-white w-48 h-8"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setShowImportScoresModal(true)}
                            variant="outline"
                            className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 font-bold h-8 px-3 rounded-[4px] text-[12px] cursor-pointer bg-white transition-all flex items-center gap-1.5"
                          >
                            导入最终成绩
                          </Button>
                          <Button
                            onClick={() => showToast('已导出批阅成绩表格', 'success')}
                            variant="outline"
                            className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 font-bold h-8 px-3 rounded-[4px] text-[12px] cursor-pointer bg-white transition-all"
                          >
                            导出成绩
                          </Button>
                          <Button
                            onClick={() => showToast('已成功批量提交最终成绩', 'success')}
                            className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-8 px-3.5 rounded-[4px] text-[12px] border-0 cursor-pointer shadow-sm transition-colors"
                          >
                            批量提交最终分
                          </Button>
                        </div>
                      </div>

                      {/* Candidates List Table */}
                      <div className="w-full overflow-y-auto border border-neutral-150 rounded-[8px] bg-white custom-scrollbar max-h-[350px]">
                        <table className="w-full text-left border-collapse text-xs select-none">
                          <thead>
                            <tr className="border-b border-neutral-100 text-neutral-600 font-semibold sticky top-0 z-10 text-[13px] bg-neutral-50">
                              <th className="p-3 w-10 text-center bg-neutral-50">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-[#fa541c] border-neutral-350 rounded cursor-pointer accent-[#fa541c] mx-auto"
                                />
                              </th>
                              <th className="p-3 text-left bg-neutral-50">考生账号</th>
                              <th className="p-3 text-left bg-neutral-50">考生姓名</th>
                              <th className="p-3 text-left bg-neutral-50">考号</th>
                              <th className="p-3 text-left bg-neutral-50">批阅分数1</th>
                              <th className="p-3 text-left bg-neutral-50">最终得分</th>
                              <th className="p-3 text-left bg-neutral-50 w-32">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                            {[
                              { account: 'df0002', name: 'df0002', examNo: '202606250002', score1: '-', finalScore: '--' }
                            ].filter(s => {
                              const q = scoringSearchQuery.toLowerCase().trim();
                              if (!q) return true;
                              return s.account.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
                            }).map((student, idx) => (
                              <tr key={idx} className="hover:bg-neutral-50/40 text-neutral-700 bg-white transition-colors">
                                <td className="p-3 text-center">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#fa541c] border-neutral-350 rounded cursor-pointer accent-[#fa541c] mx-auto"
                                  />
                                </td>
                                <td className="p-3 font-semibold text-neutral-650 font-mono">{student.account}</td>
                                <td className="p-3 font-medium text-neutral-800">{student.name}</td>
                                <td className="p-3 font-mono text-neutral-500">{student.examNo}</td>
                                <td className="p-3 font-mono text-neutral-500">{student.score1}</td>
                                <td className="p-3 font-mono text-neutral-500">{student.finalScore}</td>
                                <td className="p-3 text-left">
                                  <button 
                                    onClick={() => setShowCandidateGradingDetailsModal(true)}
                                    className="text-[#fa541c] hover:text-[#e84a15] hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 text-xs"
                                  >
                                    批阅详情
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detailsType === 'invigilation' && (
                <div className="space-y-5 flex flex-col h-full -mt-2">
                  {/* Tabs Header */}
                  <div className="border-b border-neutral-200 flex gap-5 overflow-x-auto no-scrollbar select-none bg-white pb-0 shrink-0 sticky top-0 z-20">
                    {[
                      { key: 'overview', name: '考试总览' },
                      { key: 'content', name: '考试内容' },
                      { key: 'notice', name: '考试须知' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setInvigilationTab(tab.key as any)}
                        className={cn(
                          "pb-2 text-[13px] font-medium transition-all relative whitespace-nowrap cursor-pointer -mb-[1px] border-b-2 bg-transparent border-t-0 border-x-0",
                          invigilationTab === tab.key 
                            ? "text-[#fa541c] font-bold border-[#fa541c]" 
                            : "text-neutral-500 hover:text-neutral-800 border-transparent"
                        )}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  {invigilationTab === 'overview' && (
                    <div className="space-y-4 mt-5">
                      {/* Top Info Cards */}
                      <div className="grid grid-cols-2 gap-5 select-none text-[13px]">
                        {/* Left Card: 考试信息 */}
                        <div className="border border-neutral-200 rounded-[8px] bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 flex items-center gap-1.5 shrink-0">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            考试及场次安排
                          </div>
                          <div className="p-4 grid grid-cols-2 gap-3.5 text-neutral-700 flex-1">
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] text-neutral-400 font-medium">考试名称</span>
                              <span className="text-neutral-800 font-semibold truncate" title={detailsSession?.examName || '未指定考试'}>
                                {detailsSession?.examName || '未指定考试'}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] text-neutral-400 font-medium">场次名称</span>
                              <span className="text-neutral-800 font-semibold">
                                {detailsSession?.name || '未指定场次'}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] text-neutral-400 font-medium">考试考场</span>
                              <span className="text-neutral-800 font-semibold">
                                {detailsSession?.location || '默认考场 (302室)'}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] text-neutral-400 font-medium">监考老师</span>
                              <span className="text-neutral-800 font-semibold">
                                {detailsSession?.invigilator || '系统管理员'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Card: 考生在线及答卷监控 */}
                        <div className="border border-neutral-200 rounded-[8px] bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 flex items-center gap-1.5 shrink-0">
                            <Users className="w-4 h-4 text-[#fa541c]" />
                            考生在线及答卷监控
                          </div>
                          <div className="p-4 grid grid-cols-3 gap-3 flex-1 items-center">
                            <div className="bg-emerald-50/45 border border-emerald-100 rounded-lg p-3 text-center flex flex-col justify-between h-full">
                              <span className="text-[10px] text-emerald-600 font-bold">已交卷</span>
                              <span className="text-2xl font-bold text-emerald-600 font-mono mt-1">1 <span className="text-[11px] font-normal text-emerald-500">人</span></span>
                            </div>
                            <div className="bg-blue-50/45 border border-blue-100 rounded-lg p-3 text-center flex flex-col justify-between h-full">
                              <span className="text-[10px] text-blue-600 font-bold">考试中</span>
                              <span className="text-2xl font-bold text-blue-600 font-mono mt-1">2 <span className="text-[11px] font-normal text-blue-500">人</span></span>
                            </div>
                            <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-lg p-3 text-center flex flex-col justify-between h-full">
                              <span className="text-[10px] text-neutral-400 font-bold">未登录</span>
                              <span className="text-2xl font-bold text-neutral-500 font-mono mt-1">1 <span className="text-[11px] font-normal text-neutral-400">人</span></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Filter & Action Toolbar */}
                      <div className="flex items-center justify-between gap-3 mt-4 select-none">
                        {/* Left search */}
                        <div className="relative flex items-center">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                          <input
                            type="text"
                            value={invigilationSearchQuery}
                            onChange={(e) => setInvigilationSearchQuery(e.target.value)}
                            placeholder="输入姓名或账号搜索"
                            className="pl-9 pr-4 py-2 w-60 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400 h-9"
                          />
                        </div>

                        {/* Right action buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => showToast('已成功初始化试卷', 'success')}
                            className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-3.5 h-8 text-[12px] font-bold rounded-[4px] cursor-pointer bg-white"
                          >
                            初始化试卷
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => showToast('环境已开始初始化', 'success')}
                            className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-3.5 h-8 text-[12px] font-bold rounded-[4px] cursor-pointer bg-white"
                          >
                            初始化环境
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setConfirmModal({
                                show: true,
                                title: '清理环境',
                                message: '确定要清理该实训题目对应的虚拟机环境吗？该操作将重置考生容器状态。',
                                showCancel: true,
                                onConfirm: () => {
                                  showToast('正在清理环境...', 'info');
                                  setTimeout(() => {
                                    showToast('清理成功', 'success');
                                  }, 1000);
                                }
                              });
                            }}
                            className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-3.5 h-8 text-[12px] font-bold rounded-[4px] cursor-pointer bg-white"
                          >
                            清理环境
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => showToast('数据导出成功，正在开始下载', 'success')}
                            className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-3.5 h-8 text-[12px] font-bold rounded-[4px] cursor-pointer bg-white"
                          >
                            导出数据
                          </Button>
                          <Button
                            onClick={() => showToast('正在统分中...', 'success')}
                            className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-8 px-4 rounded-[4px] text-[12px] border-0 cursor-pointer shadow-sm transition-colors"
                          >
                            统分
                          </Button>
                        </div>
                      </div>

                      {/* Candidates Table */}
                      {(() => {
                        const allStudents = [
                          { id: 2001, account: 'df0003', name: '王小明', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '考试中', score: 80 },
                          { id: 2002, account: 'df0002', name: '张小强', paperStatus: '已出卷', envStatus: '已关闭', avEnv: '1/1', invStatus: '正常', loginStatus: '已交卷', score: 100 },
                          { id: 2003, account: 'df0001', name: '李华', paperStatus: '未出卷', envStatus: '未开始', avEnv: '0/0', invStatus: '正常', loginStatus: '未登录', score: 0 },
                          { id: 2004, account: 'df0004', name: '赵大山', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '异常 (切换屏幕)', loginStatus: '考试中', score: 40 },
                          { id: 2005, account: 'df0005', name: '钱思琪', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '考试中', score: 11 },
                          { id: 2006, account: 'df0006', name: '孙志坚', paperStatus: '已出卷', envStatus: '已关闭', avEnv: '1/1', invStatus: '正常', loginStatus: '已交卷', score: 80 },
                          { id: 2007, account: 'df0007', name: '周明', paperStatus: '未出卷', envStatus: '未开始', avEnv: '0/0', invStatus: '正常', loginStatus: '未登录', score: 0 },
                          { id: 2008, account: 'df0008', name: '吴秀英', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '考试中', score: 100 },
                          { id: 2009, account: 'df0009', name: '郑国庆', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '考试中', score: 56 },
                          { id: 2010, account: 'df0010', name: '冯志新', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '已交卷', score: 80 },
                          { id: 2011, account: 'df0011', name: '陈建国', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '考试中', score: 80 },
                          { id: 2012, account: 'df0012', name: '卫红旗', paperStatus: '已出卷', envStatus: '运行中', avEnv: '1/1', invStatus: '正常', loginStatus: '考试中', score: 80 }
                        ];

                        const filteredStudents = allStudents.filter(s => {
                          const query = invigilationSearchQuery.toLowerCase().trim();
                          if (!query) return true;
                          return s.account.toLowerCase().includes(query) || s.name.toLowerCase().includes(query);
                        });

                        const totalStudents = filteredStudents.length;
                        const totalOverviewPages = Math.ceil(totalStudents / overviewPageSize);
                        const activeOverviewPage = Math.min(overviewCurrentPage, Math.max(1, totalOverviewPages));

                        const currentStudents = filteredStudents.slice(
                          (activeOverviewPage - 1) * overviewPageSize,
                          activeOverviewPage * overviewPageSize
                        );

                        return (
                          <>
                            <div className="border border-neutral-200 rounded overflow-hidden">
                              <table className="w-full text-left border-collapse text-xs select-none">
                                <thead>
                                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                                    <th className="p-3 w-10 text-center">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-[#fa541c] border-neutral-350 rounded cursor-pointer accent-[#fa541c] mx-auto"
                                      />
                                    </th>
                                    <th className="p-3 text-left">账号</th>
                                    <th className="p-3 text-left">姓名</th>
                                    <th className="p-3 text-left">试卷状态</th>
                                    <th className="p-3 text-left">环境状态</th>
                                    <th className="p-3 text-left">可用环境</th>
                                    <th className="p-3 text-left">监考状态</th>
                                    <th className="p-3 text-left">状态</th>
                                    <th className="p-3 text-center">操作</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                                  {currentStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-neutral-50/50">
                                      <td className="p-3 text-center">
                                        <input
                                          type="checkbox"
                                          className="w-4 h-4 text-[#fa541c] border-neutral-350 rounded cursor-pointer accent-[#fa541c] mx-auto"
                                        />
                                      </td>
                                      <td className="p-3 font-semibold text-neutral-600 font-mono">{student.account}</td>
                                      <td className="p-3 font-medium text-neutral-800">{student.name}</td>
                                      <td className="p-3">
                                        {student.paperStatus === '已出卷' ? (
                                          <span className="text-[#fa541c] bg-[#fff2e8] border border-[#ffd8bf] px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                                            已出卷
                                          </span>
                                        ) : (
                                          <span className="text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                                            未出卷
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3">
                                        {student.envStatus === '运行中' && (
                                          <span className="text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                                            运行中
                                          </span>
                                        )}
                                        {student.envStatus === '已关闭' && (
                                          <span className="text-neutral-400 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                                            已关闭
                                          </span>
                                        )}
                                        {student.envStatus === '未开始' && (
                                          <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                                            未开始
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3 font-mono text-neutral-700">{student.avEnv}</td>
                                      <td className="p-3">
                                        {student.invStatus === '正常' ? (
                                          <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            正常
                                          </span>
                                        ) : (
                                          <span className="flex items-center gap-1.5 text-red-650 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                            {student.invStatus}
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3">
                                        <span className={cn(
                                          "px-2 py-0.5 rounded text-[11px] font-medium inline-block border",
                                          student.loginStatus === '已交卷' && "text-[#52c41a] bg-[#f6ffed] border-[#d9f7be]",
                                          student.loginStatus === '考试中' && "text-blue-600 bg-blue-50 border-blue-200",
                                          student.loginStatus === '未登录' && "text-[#8c8c8c] bg-[#f5f5f5] border-[#d9d9d9]"
                                        )}>
                                          {student.loginStatus}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs">
                                          {student.loginStatus === '已交卷' ? (
                                            <button
                                              onClick={() => {
                                                setSelectedStudentForEnv(student);
                                                setShowEnvDetailsModal(true);
                                              }}
                                              className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-semibold transition-colors hover:underline"
                                            >
                                              环境详情
                                            </button>
                                          ) : (
                                            <button
                                              disabled
                                              className="text-[#ff8d60] bg-transparent border-0 cursor-not-allowed p-0 font-semibold transition-colors"
                                              title="仅在已交卷状态下可查看环境详情"
                                            >
                                              环境详情
                                            </button>
                                          )}
                                          <span className="text-neutral-300">|</span>
                                          <button
                                            onClick={() => {
                                              setSelectedStudentForPaper(student);
                                              setShowViewPaperModal(true);
                                            }}
                                            className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-semibold transition-colors hover:underline"
                                          >
                                            查看试卷
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex items-center justify-end pt-2 gap-4 bg-transparent select-none">
                              <span className="text-[13px] text-neutral-500">共 {totalStudents} 条</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={activeOverviewPage === 1}
                                  onClick={() => setOverviewCurrentPage(prev => Math.max(prev - 1, 1))}
                                  className="h-7 w-7 p-0 rounded-sm cursor-pointer"
                                >
                                  &lt;
                                </Button>
                                {Array.from({ length: totalOverviewPages }).map((_, index) => {
                                  const p = index + 1;
                                  const isActive = activeOverviewPage === p;
                                  return (
                                    <Button
                                      key={p}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setOverviewCurrentPage(p)}
                                      className={`h-7 w-7 p-0 rounded-sm cursor-pointer ${
                                        isActive
                                          ? 'bg-[#fa541c] text-white border-[#fa541c]'
                                          : 'bg-white text-neutral-600 border-neutral-200 hover:text-[#fa541c] hover:border-orange-200'
                                      }`}
                                    >
                                      {p}
                                    </Button>
                                  );
                                })}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={activeOverviewPage === totalOverviewPages}
                                  onClick={() => setOverviewCurrentPage(prev => Math.min(prev + 1, totalOverviewPages))}
                                  className="h-7 w-7 p-0 rounded-sm cursor-pointer"
                                >
                                  &gt;
                                </Button>
                              </div>
                              <div className="relative bg-white rounded-[6px]">
                                <select
                                  value={`${overviewPageSize}`}
                                  onChange={(e) => {
                                    const size = parseInt(e.target.value);
                                    setOverviewPageSize(size);
                                    setOverviewCurrentPage(1);
                                  }}
                                  className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm"
                                >
                                  <option className="bg-white" value="5">5 条/页</option>
                                  <option className="bg-white" value="10">10 条/页</option>
                                  <option className="bg-white" value="20">20 条/页</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                  <ChevronDown className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {invigilationTab === 'content' && (() => {
                    const allQuestions = [
                      {
                        id: 10001,
                        name: '简答题试题题干',
                        type: '简答题',
                        library: 'test_lw',
                        score: 3,
                        checkpoints: [
                          { name: '答案完整性', content: '检查回答字数与核心结构', description: '回答包含核心简答要求', scoreRatio: 40 },
                          { name: '关键字匹配', content: '匹配简答关键知识点', description: '包含指定关键字或核心定义', scoreRatio: 60 }
                        ]
                      },
                      {
                        id: 10002,
                        name: '机器学习技术在图像识别中的卷积过程分析与前向计算',
                        type: '编程题',
                        library: 'ml_image_lib',
                        score: 15,
                        checkpoints: []
                      },
                      {
                        id: 10003,
                        name: '分类与回归算法的特征选择原则及信息熵推导简答',
                        type: '简答题',
                        library: 'ml_theory',
                        score: 10,
                        checkpoints: [
                          { name: '公式正确性', content: '检查信息熵计算公式是否完整', description: '包含H(X) = -sum(P(xi)logP(xi))', scoreRatio: 50 },
                          { name: '对比说明', content: '分类与回归的选择原则对比', description: '清晰对比连续与离散变量', scoreRatio: 50 }
                        ]
                      },
                      {
                        id: 10004,
                        name: '单项选择：支持向量机中核函数的主要作用是什么？',
                        type: '单选题',
                        library: 'ml_theory',
                        score: 2,
                        checkpoints: []
                      },
                      {
                        id: 10005,
                        name: '多项选择：深度学习模型训练中防止过拟合的策略有哪些？',
                        type: '多选题',
                        library: 'dl_adv',
                        score: 5,
                        checkpoints: []
                      },
                      {
                        id: 10006,
                        name: '简答题：请简述梯度消失与梯度爆炸的成因及常见的解决方法',
                        type: '简答题',
                        library: 'dl_adv',
                        score: 8,
                        checkpoints: [
                          { name: '成因分析', content: '指出网络层数、激活函数与链式法则的关系', description: '包含Sigmoid饱和区或链式连乘', scoreRatio: 50 },
                          { name: '解决方案', content: '列举常见的解决方案如ResNet, BN, ReLU', description: '列出至少3种有效方案', scoreRatio: 50 }
                        ]
                      },
                      {
                        id: 10007,
                        name: '填空题：在模型评估指标中，F1-Score是_____和_____的调和平均数。',
                        type: '填空题',
                        library: 'ml_theory',
                        score: 4,
                        checkpoints: []
                      },
                      {
                        id: 10008,
                        name: '判断题：L1正则化倾向于产生稀疏权重，而L2正则化倾向于使权重均等且接近零。',
                        type: '判断题',
                        library: 'ml_theory',
                        score: 2,
                        checkpoints: []
                      },
                      {
                        id: 10009,
                        name: '简答题：简要陈述主成分分析（PCA）的数学步骤与物理意义',
                        type: '简答题',
                        library: 'math_ml',
                        score: 8,
                        checkpoints: [
                          { name: '数学步骤', content: '中心化、协方差矩阵、特征值分解、投影', description: '包含完整数学步骤', scoreRatio: 60 },
                          { name: '物理意义', content: '最大方差理论或最小重建误差理论', description: '明确最大方差解释', scoreRatio: 40 }
                        ]
                      },
                      {
                        id: 10010,
                        name: '编程题：使用Python and NumPy手动实现支持向量机SVM的硬间隔推导算法',
                        type: '编程题',
                        library: 'math_ml',
                        score: 20,
                        checkpoints: []
                      }
                    ];

                    const totalQuestions = allQuestions.length;
                    const totalScore = allQuestions.reduce((sum, q) => sum + q.score, 0);
                    const totalPages = Math.ceil(totalQuestions / contentPageSize);
                    const currentQuestions = allQuestions.slice(
                      (contentCurrentPage - 1) * contentPageSize,
                      contentCurrentPage * contentPageSize
                    );

                    return (
                      <div className="space-y-4 mt-5 select-none animate-in fade-in slide-in-from-bottom-3 duration-300">
                        {/* 试题信息 Card */}
                        <div className="w-[320px] border border-neutral-200 rounded-[8px] bg-white shadow-sm flex flex-col justify-between overflow-hidden">
                          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 text-[13px] flex items-center gap-1.5 shrink-0">
                            试题信息
                          </div>
                          <div className="p-4 text-[13px] text-neutral-700">
                            试题总分：{totalScore}
                          </div>
                        </div>

                        {/* 试题列表 Table */}
                        <div className="border border-neutral-200 rounded overflow-hidden">
                          <table className="w-full text-left border-collapse text-xs select-none">
                            <thead>
                              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                                <th className="p-3 pl-4 w-[42%]">题目名称</th>
                                <th className="p-3 w-[13%]">题型</th>
                                <th className="p-3 w-[20%]">资源库</th>
                                <th className="p-3 w-[12%]">分值</th>
                                <th className="p-3 text-center w-[13%]">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                              {currentQuestions.map((question) => (
                                <tr key={question.id} className="hover:bg-neutral-50/50">
                                  <td className="p-3 pl-4 font-semibold text-neutral-900 truncate max-w-[200px]" title={question.name}>{question.name}</td>
                                  <td className="p-3 text-neutral-600">{question.type}</td>
                                  <td className="p-3 font-mono text-neutral-500">{question.library}</td>
                                  <td className="p-3 font-mono text-neutral-800 font-semibold">{question.score}</td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs">
                                      {question.type === '简答题' ? (
                                        <button
                                          onClick={() => setSelectedCheckpointQuestion(question)}
                                          className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-semibold transition-colors hover:underline"
                                        >
                                          检查项
                                        </button>
                                      ) : (
                                        <button
                                          disabled
                                          className="text-[#ff8d60] bg-transparent border-0 cursor-not-allowed p-0 font-semibold transition-colors"
                                          title="仅简答题支持设置检查项"
                                        >
                                          检查项
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="flex items-center justify-end pt-2 gap-4 bg-transparent select-none">
                          <span className="text-[13px] text-neutral-500">共 {totalQuestions} 条</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={contentCurrentPage === 1}
                              onClick={() => setContentCurrentPage(prev => Math.max(prev - 1, 1))}
                              className="h-7 w-7 p-0 rounded-sm cursor-pointer"
                            >
                              &lt;
                            </Button>
                            {Array.from({ length: totalPages }).map((_, index) => {
                              const p = index + 1;
                              const isActive = contentCurrentPage === p;
                              return (
                                <Button
                                  key={p}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setContentCurrentPage(p)}
                                  className={`h-7 w-7 p-0 rounded-sm cursor-pointer ${
                                    isActive
                                      ? 'bg-[#fa541c] text-white border-[#fa541c]'
                                      : 'bg-white text-neutral-600 border-neutral-200 hover:text-[#fa541c] hover:border-orange-200'
                                  }`}
                                >
                                  {p}
                                </Button>
                              );
                            })}
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={contentCurrentPage === totalPages}
                              onClick={() => setContentCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              className="h-7 w-7 p-0 rounded-sm cursor-pointer"
                            >
                              &gt;
                            </Button>
                          </div>
                          <div className="relative bg-white rounded-[6px]">
                            <select
                              value={`${contentPageSize}`}
                              onChange={(e) => {
                                const size = parseInt(e.target.value);
                                setContentPageSize(size);
                                setContentCurrentPage(1);
                              }}
                              className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm"
                            >
                              <option className="bg-white" value="5">5 条/页</option>
                              <option className="bg-white" value="10">10 条/页</option>
                              <option className="bg-white" value="20">20 条/页</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                              <ChevronDown className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {invigilationTab === 'notice' && (
                    <div className="space-y-4 mt-5">
                      <div className="border border-neutral-150 rounded-[8px] overflow-hidden bg-white shadow-sm">
                        <div className="bg-neutral-50/50 p-4 border-b border-neutral-150 font-bold text-neutral-800 text-[14px]">
                          考试纪律与规范要求
                        </div>
                        <div className="p-4 space-y-3 text-[13px] text-neutral-600 leading-relaxed">
                          <p>1. 请各位参考考生提前准备好考试环境，确保摄像头与音频输入输出设备运行良好，光线充足，人脸无遮挡。</p>
                          <p>2. 考中系统将自动启用摄像头防作弊轨迹抓拍及网页切屏警示监控。</p>
                          <p>3. 累计切换考试窗口或浏览器页面超过 3 次，系统将自动判定为作弊，执行强制交卷，成绩按零分处理。</p>
                          <p>4. 严禁替考、抄袭或使用未经许可的任何辅助资料。一经发现，考官有权当场取消考生成绩并严肃处理。</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detailsType === 'rank' && (() => {
                const rankList = [
                  { rank: 1, name: '李四方', id: '202674454201', class: '数据科学', classFull: '数据科学二班', score: 98, duration: '42m 15s', phone: '13912345678', submitTime: '2026/02/11 16:15', objScore: 58, subScore: 40, avatarText: '四方' },
                  { rank: 2, name: '张三丰', id: '202674454202', class: '软件工程', classFull: '软件工程一班', score: 95, duration: '48m 32s', phone: '18656686967', submitTime: '2026/02/11 16:18', objScore: 55, subScore: 40, avatarText: '三丰' },
                  { rank: 3, name: '王五常', id: '202674454203', class: '人工智能', classFull: '人工智能三班', score: 92, duration: '51m 10s', phone: '13512345678', submitTime: '2026/02/11 16:21', objScore: 52, subScore: 40, avatarText: '五常' },
                  { rank: 4, name: '赵六顺', id: '202674454204', class: '软件工程', classFull: '软件工程一班', score: 89, duration: '55m 40s', phone: '13788889999', submitTime: '2026/02/11 16:25', objScore: 49, subScore: 40, avatarText: '六顺' },
                  { rank: 5, name: '周七弦', id: '202674454205', class: '软件工程', classFull: '软件工程一班', score: 88, duration: '58m 12s', phone: '13611112222', submitTime: '2026/02/11 16:28', objScore: 48, subScore: 40, avatarText: '七弦' },
                  { rank: 6, name: '吴八极', id: '202674454206', class: '人工智能', classFull: '人工智能三班', score: 85, duration: '44m 20s', phone: '13822223333', submitTime: '2026/02/11 16:14', objScore: 45, subScore: 40, avatarText: '八极' },
                  { rank: 7, name: '郑九霄', id: '202674454207', class: '数据科学', classFull: '数据科学二班', score: 84, duration: '49m 05s', phone: '13933334444', submitTime: '2026/02/11 16:19', objScore: 44, subScore: 40, avatarText: '九霄' },
                  { rank: 8, name: '冯十方', id: '202674454208', class: '人工智能', classFull: '人工智能三班', score: 82, duration: '53m 15s', phone: '13544445555', submitTime: '2026/02/11 16:23', objScore: 42, subScore: 40, avatarText: '十方' },
                  { rank: 9, name: '陈百川', id: '202674454209', class: '数据科学', classFull: '数据科学二班', score: 79, duration: '57m 50s', phone: '13755556666', submitTime: '2026/02/11 16:27', objScore: 39, subScore: 40, avatarText: '百川' },
                  { rank: 10, name: '楚天阔', id: '202674454210', class: '软件工程', classFull: '软件工程一班', score: 76, duration: '50m 30s', phone: '13866667777', submitTime: '2026/02/11 16:20', objScore: 36, subScore: 40, avatarText: '天阔' },
                  { rank: 11, name: '沈十一', id: '202674454211', class: '数据科学', classFull: '数据科学二班', score: 75, duration: '52m 10s', phone: '13977778888', submitTime: '2026/02/11 16:32', objScore: 35, subScore: 40, avatarText: '十一' },
                  { rank: 12, name: '韩十二', id: '202674454212', class: '软件工程', classFull: '软件工程一班', score: 72, duration: '54m 30s', phone: '13899990000', submitTime: '2026/02/11 16:35', objScore: 32, subScore: 40, avatarText: '十二' },
                  { rank: 13, name: '秦十三', id: '202674454213', class: '人工智能', classFull: '人工智能三班', score: 70, duration: '56m 15s', phone: '13511112222', submitTime: '2026/02/11 16:38', objScore: 30, subScore: 40, avatarText: '十三' },
                  { rank: 14, name: '尤十四', id: '202674454214', class: '数据科学', classFull: '数据科学二班', score: 68, duration: '58m 05s', phone: '13633334444', submitTime: '2026/02/11 16:41', objScore: 28, subScore: 40, avatarText: '十四' }
                ];

                const topThree = rankList.slice(0, 3);
                const listRanks = rankList.filter(stu => stu.rank > 3);

                // Pagination logic
                const totalListRanks = listRanks.length;
                const totalPages = Math.ceil(totalListRanks / rankPageSize) || 1;
                const activePage = Math.min(rankCurrentPage, totalPages);
                const paginatedRanks = listRanks.slice(
                  (activePage - 1) * rankPageSize,
                  activePage * rankPageSize
                );

                // Wheat ears decorations for rank numbers (golden, silver-blue, bronze-orange)
                const WheatDecor = ({ rank, strokeColor, fillColor }: { rank: number; strokeColor: string; fillColor: string }) => (
                  <div className="flex items-center justify-center gap-1 select-none">
                    {/* Left Wheat Ear */}
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M17 20C13 18 9 13 9 5" />
                      <path d="M9.5 16C8 15 6.5 14 6.5 12C6.5 10 8 11 9.5 12" fill={fillColor} />
                      <path d="M9 12C7.5 11 6 10 6 8C6 6 7.5 7 9 8" fill={fillColor} />
                      <path d="M9 8C7.5 7 6 6 6 4C6 2 7.5 3 9 4" fill={fillColor} />
                      <path d="M9 4C8.5 3.5 7.5 2 7.5 1" />
                    </svg>
                    
                    <span className="text-[28px] font-black leading-none font-serif select-none" style={{ color: strokeColor }}>
                      {rank}
                    </span>

                    {/* Right Wheat Ear */}
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M7 20C11 18 15 13 15 5" />
                      <path d="M14.5 16C16 15 17.5 14 17.5 12C17.5 10 16 11 14.5 12" fill={fillColor} />
                      <path d="M15 12C16.5 11 18 10 18 8C18 6 16.5 7 15 8" fill={fillColor} />
                      <path d="M15 8C16.5 7 18 6 18 4C18 2 16.5 3 15 4" fill={fillColor} />
                      <path d="M15 4C15.5 3.5 16.5 2 16.5 1" />
                    </svg>
                  </div>
                );

                return (
                  <div className="space-y-3 text-left">
                    {/* Top 3 Podium Area matching the reference style */}
                    <div className="flex justify-center items-end gap-5 pt-3 pb-0 select-none">
                      
                      {/* 2nd Place Card (Left) */}
                      <div className="flex-1 bg-gradient-to-b from-[#f0f5ff] to-transparent rounded-2xl p-5 flex flex-col items-center justify-center text-center relative hover:-translate-y-0.5 transition-all duration-300 h-[195px]">
                        <div className="flex flex-col items-center w-full justify-between h-full">
                          {/* Rank Number with Wheat Ear Decoration */}
                          <WheatDecor rank={2} strokeColor="#2f54eb" fillColor="#d6e4ff" />

                          {/* Avatar with circular frame */}
                          <div className="my-2 relative">
                            <div className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-tr from-[#597ef7] to-[#2f54eb] flex items-center justify-center select-none">
                              <span className="text-white text-base font-bold">{topThree[1].avatarText}</span>
                            </div>
                          </div>

                          {/* Name */}
                          <div className="text-[14px] font-bold text-neutral-800 leading-tight mb-1 truncate w-full px-2" title={topThree[1].name}>
                            {topThree[1].name}
                          </div>
                          
                          {/* Score metrics */}
                          <div className="text-[#fa541c] font-black font-mono text-[14.5px]">
                            {topThree[1].score}<span className="text-[10px] font-bold text-neutral-450 ml-0.5">分</span>
                          </div>
                        </div>
                      </div>

                      {/* 1st Place Card (Center) - Slightly taller & scaled */}
                      <div className="flex-1 bg-gradient-to-b from-[#fffbe6] to-transparent rounded-2xl p-5 flex flex-col items-center justify-center text-center relative hover:-translate-y-1 transition-all duration-300 z-10 h-[220px] scale-105">
                        <div className="flex flex-col items-center w-full justify-between h-full">
                          {/* Rank Number with Wheat Ear Decoration */}
                          <WheatDecor rank={1} strokeColor="#d4b106" fillColor="#fffbe6" />

                          {/* Avatar with circular frame */}
                          <div className="my-2 relative">
                            <div className="w-18 h-18 rounded-full border-3 border-white bg-gradient-to-tr from-[#ffc53d] to-[#d4b106] flex items-center justify-center select-none">
                              <span className="text-white text-lg font-black">{topThree[0].avatarText}</span>
                            </div>
                          </div>

                          {/* Name */}
                          <div className="text-[15.5px] font-extrabold text-neutral-900 leading-tight mb-1 truncate w-full px-2" title={topThree[0].name}>
                            {topThree[0].name}
                          </div>
                          
                          {/* Score metrics */}
                          <div className="text-[#fa541c] font-black font-mono text-[16px]">
                            {topThree[0].score}<span className="text-[10px] font-bold text-neutral-450 ml-0.5">分</span>
                          </div>
                        </div>
                      </div>

                      {/* 3rd Place Card (Right) */}
                      <div className="flex-1 bg-gradient-to-b from-[#fff1f0] to-transparent rounded-2xl p-5 flex flex-col items-center justify-center text-center relative hover:-translate-y-0.5 transition-all duration-300 h-[195px]">
                        <div className="flex flex-col items-center w-full justify-between h-full">
                          {/* Rank Number with Wheat Ear Decoration */}
                          <WheatDecor rank={3} strokeColor="#fa541c" fillColor="#ffe8e6" />

                          {/* Avatar with circular frame */}
                          <div className="my-2 relative">
                            <div className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-tr from-[#ff7875] to-[#fa541c] flex items-center justify-center select-none">
                              <span className="text-white text-base font-bold">{topThree[2].avatarText}</span>
                            </div>
                          </div>

                          {/* Name */}
                          <div className="text-[13px] font-bold text-neutral-800 leading-tight mb-1 truncate w-full px-2" title={topThree[2].name}>
                            {topThree[2].name}
                          </div>
                          
                          {/* Score metrics */}
                          <div className="text-[#fa541c] font-black font-mono text-[14px]">
                            {topThree[2].score}<span className="text-[10px] font-bold text-neutral-455 ml-0.5">分</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Other Ranks Table */}
                    <div className="pt-0 space-y-3">
                      <div className="border border-neutral-200 rounded overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold select-none">
                              <th className="p-3 w-20 text-center">排名</th>
                              <th className="p-3">姓名</th>
                              <th className="p-3">最后提交时间</th>
                              <th className="p-3 text-right pr-6">最终得分</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                            {paginatedRanks.map((stu) => (
                              <tr 
                                key={stu.rank} 
                                className="hover:bg-neutral-50/50"
                              >
                                <td className="p-3 text-center select-none font-mono font-bold text-neutral-500 w-20">
                                  {stu.rank}
                                </td>
                                <td className="p-3 font-semibold text-neutral-900">
                                  {stu.name}
                                </td>
                                <td className="p-3 text-neutral-500 font-mono">
                                  {stu.submitTime}
                                </td>
                                <td className="p-3 text-right pr-6 font-bold text-[#fa541c] select-none font-mono">
                                  {stu.score} 分
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {paginatedRanks.length === 0 && (
                          <div className="py-12 text-center text-neutral-400 bg-neutral-50/30">
                            暂无其他排名数据
                          </div>
                        )}
                      </div>

                      {/* Pagination Footer */}
                      <div className="flex items-center justify-end pt-2 gap-4 bg-transparent select-none">
                        <span className="text-[13px] text-neutral-500">共 {totalListRanks} 条</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-sm" 
                            disabled={activePage === 1} 
                            onClick={() => setRankCurrentPage(prev => Math.max(prev - 1, 1))}
                          >
                            &lt;
                          </Button>
                          {Array.from({ length: totalPages }).map((_, idx) => (
                            <Button 
                              key={idx}
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "h-7 w-7 p-0 rounded-sm",
                                activePage === idx + 1 ? "bg-[#fa541c] text-white border-[#fa541c]" : ""
                              )}
                              onClick={() => setRankCurrentPage(idx + 1)}
                            >
                              {idx + 1}
                            </Button>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-sm" 
                            disabled={activePage === totalPages} 
                            onClick={() => setRankCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          >
                            &gt;
                          </Button>
                        </div>
                        <div className="relative bg-white rounded-[6px]">
                          <select 
                            value={rankPageSize}
                            onChange={(e) => {
                              const size = parseInt(e.target.value);
                              setRankPageSize(size);
                              setRankCurrentPage(1);
                            }}
                            className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm"
                          >
                            <option className="bg-white" value={9}>9 条/页</option>
                            <option className="bg-white" value={20}>20 条/页</option>
                            <option className="bg-white" value={50}>50 条/页</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsDetailsDrawerOpen(false)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded shadow-sm border-0 cursor-pointer"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 快速添加考生 Modal */}
      {showQuickAddModal && (
        <div 
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left text-[13px]"
          onClick={() => {
            setShowQuickAddModal(false);
            setQuickAddAccountsText('');
          }}
        >
          <div 
            className="bg-white w-full max-w-[540px] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#fa541c]" /> 快速添加考生
              </h2>
              <button 
                onClick={() => {
                  setShowQuickAddModal(false);
                  setQuickAddAccountsText('');
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-white flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-[#262626] mt-2 w-[48px] shrink-0 text-right">账号：</span>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="relative w-full">
                    <textarea
                      value={quickAddAccountsText}
                      onChange={(e) => {
                        const val = e.target.value;
                        const lines = val.split('\n');
                        if (lines.length <= 200) {
                          setQuickAddAccountsText(val);
                        } else {
                          const cappedText = lines.slice(0, 200).join('\n');
                          setQuickAddAccountsText(cappedText);
                          showToast('最多只能输入200行', 'error');
                        }
                      }}
                      className="w-full h-[220px] p-3 text-[13px] border border-[#d9d9d9] rounded-[6px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 resize-none custom-scrollbar"
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-neutral-400 select-none">
                      {quickAddAccountsText === '' ? 0 : quickAddAccountsText.split('\n').length}/200
                    </div>
                  </div>
                  <div className="text-[12px] text-[#fa541c] font-medium leading-relaxed">
                    输入账号，最多支持200行，每行一个账号，支持多行快速添加考生
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setShowQuickAddModal(false);
                  setQuickAddAccountsText('');
                }} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  const lines = quickAddAccountsText.split('\n')
                    .map(line => line.trim())
                    .filter(line => line !== '');

                  if (lines.length === 0) {
                    showToast('请输入考生账号', 'error');
                    return;
                  }

                  const newCandidates = lines.map((account, index) => ({
                    id: Date.now() + index,
                    account,
                    name: account,
                    phone: '1875183' + Math.floor(1000 + Math.random() * 9000),
                    group: '测试用户'
                  }));

                  setCandidateList([
                    ...candidateList,
                    ...newCandidates
                  ]);
                  showToast(`已成功快速添加 ${newCandidates.length} 位考生`, 'success');
                  setShowQuickAddModal(false);
                  setQuickAddAccountsText('');
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 添加考生 Modal */}
      {showAddCandidatesModal && (() => {
        const PAGE_SIZE = 5;
        const totalPages = Math.ceil(filteredAvailableCandidates.length / PAGE_SIZE) || 1;
        
        // Paginated subset of filtered candidates
        const pagedCandidates = filteredAvailableCandidates.slice(
          (addCandidatesPage - 1) * PAGE_SIZE,
          addCandidatesPage * PAGE_SIZE
        );

        return (
          <div 
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left text-[13px]"
            onClick={() => {
              setShowAddCandidatesModal(false);
              setAddSearchQuery('');
              setSelectedAddStudentIds([]);
            }}
          >
            <div 
              className="bg-white w-full max-w-[720px] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
                <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#fa541c]" /> 添加考生
                </h2>
                <button 
                  onClick={() => {
                    setShowAddCandidatesModal(false);
                    setAddSearchQuery('');
                    setSelectedAddStudentIds([]);
                  }} 
                  className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 bg-white flex flex-col gap-5">
                {/* Search input section - Styled matching course module search */}
                <div className="relative w-full max-w-[320px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={addSearchQuery}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setAddSearchQuery(e.target.value);
                      }
                    }}
                    placeholder="请输入用户组/账号/姓名搜索"
                    className="w-full pl-9 pr-20 py-2 text-sm border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all bg-white"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-450 select-none pointer-events-none">
                    {addSearchQuery.length} / 100
                  </div>
                </div>

                {/* Candidates Table with non-transparent solid headers */}
                <div className="w-full overflow-y-auto border border-neutral-150 rounded-[8px] bg-white custom-scrollbar max-h-[250px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-600 font-semibold sticky top-0 z-10 select-none text-[13px]">
                        <th className="p-3 w-12 text-center bg-neutral-50 border-b border-neutral-100">
                          <input 
                            type="checkbox"
                            checked={pagedCandidates.length > 0 && pagedCandidates.every(s => selectedAddStudentIds.includes(s.id))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Add all on CURRENT page
                                const pageIds = pagedCandidates.map(s => s.id);
                                setSelectedAddStudentIds(prev => Array.from(new Set([...prev, ...pageIds])));
                              } else {
                                // Remove all on CURRENT page
                                const pageIds = pagedCandidates.map(s => s.id);
                                setSelectedAddStudentIds(prev => prev.filter(id => !pageIds.includes(id)));
                              }
                            }}
                            className="w-4 h-4 text-[#fa541c] border-neutral-300 rounded cursor-pointer accent-[#fa541c] mx-auto"
                          />
                        </th>
                        <th className="p-3 text-left bg-neutral-50 border-b border-neutral-100">账号</th>
                        <th className="p-3 text-left bg-neutral-50 border-b border-neutral-100">姓名</th>
                        <th className="p-3 text-left bg-neutral-50 border-b border-neutral-100">手机号</th>
                        <th className="p-3 text-left bg-neutral-50 border-b border-neutral-100">用户组</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px]">
                      {pagedCandidates.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-neutral-400 bg-white">
                            暂无符合搜索条件的未添加考生
                          </td>
                        </tr>
                      ) : (
                        pagedCandidates.map((candidate) => (
                          <tr 
                            key={candidate.id}
                            className={cn(
                              "hover:bg-neutral-50/40 cursor-pointer transition-colors text-neutral-700 bg-white",
                              selectedAddStudentIds.includes(candidate.id) ? "bg-orange-50/10" : ""
                            )}
                            onClick={() => {
                              if (selectedAddStudentIds.includes(candidate.id)) {
                                setSelectedAddStudentIds(selectedAddStudentIds.filter(id => id !== candidate.id));
                              } else {
                                setSelectedAddStudentIds([...selectedAddStudentIds, candidate.id]);
                              }
                            }}
                          >
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox"
                                checked={selectedAddStudentIds.includes(candidate.id)}
                                onChange={() => {
                                  if (selectedAddStudentIds.includes(candidate.id)) {
                                    setSelectedAddStudentIds(selectedAddStudentIds.filter(id => id !== candidate.id));
                                  } else {
                                    setSelectedAddStudentIds([...selectedAddStudentIds, candidate.id]);
                                  }
                                }}
                                className="w-4 h-4 text-[#fa541c] border-neutral-350 rounded cursor-pointer accent-[#fa541c] mx-auto"
                              />
                            </td>
                            <td className="p-3 text-left font-medium text-neutral-900">{candidate.account}</td>
                            <td className="p-3 text-left">{candidate.name}</td>
                            <td className="p-3 text-left text-neutral-500">{candidate.phone}</td>
                            <td className="p-3 text-left text-neutral-500">{candidate.group}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Component */}
                <div className="flex items-center justify-end py-2 bg-transparent select-none mt-2 gap-4">
                  <span className="text-[13px] text-neutral-500">
                    共 {filteredAvailableCandidates.length} 条
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                      disabled={addCandidatesPage === 1}
                      onClick={() => setAddCandidatesPage(p => Math.max(1, p - 1))}
                    >
                      &lt;
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button 
                        key={pageNum}
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          "h-7 w-7 p-0 rounded-sm font-bold text-[12px] cursor-pointer",
                          addCandidatesPage === pageNum 
                            ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#fa541c] hover:text-white" 
                            : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                        )}
                        onClick={() => setAddCandidatesPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                      disabled={addCandidatesPage === totalPages}
                      onClick={() => setAddCandidatesPage(p => Math.min(totalPages, p + 1))}
                    >
                      &gt;
                    </Button>
                  </div>
                  <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white">
                    <option>5 条/页</option>
                    <option>10 条/页</option>
                    <option>20 条/页</option>
                  </select>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-3 shrink-0">
                <Button 
                  onClick={() => {
                    setShowAddCandidatesModal(false);
                    setAddSearchQuery('');
                    setSelectedAddStudentIds([]);
                  }} 
                  variant="outline"
                  className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => {
                    if (selectedAddStudentIds.length === 0) {
                      showToast('请选择需要添加的考生', 'error');
                      return;
                    }

                    const candidatesToAdd = MOCK_AVAILABLE_CANDIDATES.filter(c => selectedAddStudentIds.includes(c.id));
                    
                    // Filter out candidates that are already in candidateList
                    const uniqueCandidatesToAdd = candidatesToAdd.filter(c => !candidateList.some(curr => curr.account === c.account));
                    const skippedCount = candidatesToAdd.length - uniqueCandidatesToAdd.length;

                    if (uniqueCandidatesToAdd.length === 0) {
                      showToast('所选考生均已在名单中', 'info');
                      setShowAddCandidatesModal(false);
                      setAddSearchQuery('');
                      setSelectedAddStudentIds([]);
                      return;
                    }

                    setCandidateList([
                      ...candidateList,
                      ...uniqueCandidatesToAdd
                    ]);

                    if (skippedCount > 0) {
                      showToast(`成功添加 ${uniqueCandidatesToAdd.length} 位考生（已自动跳过 ${skippedCount} 位已存在考生）`, 'success');
                    } else {
                      showToast(`已成功添加 ${uniqueCandidatesToAdd.length} 位考生`, 'success');
                    }

                    setShowAddCandidatesModal(false);
                    setAddSearchQuery('');
                    setSelectedAddStudentIds([]);
                  }}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 实训题检查项 Modal */}
      {selectedCheckpointQuestion && (
        <div 
          className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-[1px] flex items-center justify-center animate-fade-in text-left"
          onClick={() => setSelectedCheckpointQuestion(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-neutral-100 flex flex-col p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3.5 border-b border-neutral-150">
              <h3 className="text-base font-bold text-neutral-850 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#fa541c]" />
                实训题检查项配置 — {selectedCheckpointQuestion.name}
              </h3>
              <button
                onClick={() => setSelectedCheckpointQuestion(null)}
                className="text-neutral-450 hover:text-[#fa541c] hover:bg-neutral-50 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto max-h-[350px]">
              <table className="w-full text-left border-collapse text-xs select-none">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50 text-neutral-600 font-semibold text-[13px]">
                    <th className="p-3">检查项名称</th>
                    <th className="p-3">检查项内容</th>
                    <th className="p-3">检查项描述</th>
                    <th className="p-3 w-24 text-center">得分比例</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                  {selectedCheckpointQuestion.checkpoints && selectedCheckpointQuestion.checkpoints.length > 0 ? (
                    selectedCheckpointQuestion.checkpoints.map((cp: any, idx: number) => (
                      <tr key={idx} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="p-3 font-semibold text-neutral-850">{cp.name}</td>
                        <td className="p-3 text-neutral-500 font-mono">{cp.content}</td>
                        <td className="p-3 text-neutral-500">{cp.description}</td>
                        <td className="p-3 text-center font-bold text-neutral-800">{cp.scoreRatio}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-neutral-400">
                        暂无检查项
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-150">
              <Button
                onClick={() => setSelectedCheckpointQuestion(null)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-5 py-1.5 rounded-[4px] text-xs font-semibold cursor-pointer border-0 shadow-sm transition-colors"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 环境详情 Modal */}
      {showEnvDetailsModal && selectedStudentForEnv && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => {
            setShowEnvDetailsModal(false);
            setOpenMoreRow(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-neutral-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-[#fa541c]" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-850">环境详情</h3>
              </div>
              <button
                onClick={() => {
                  setShowEnvDetailsModal(false);
                  setOpenMoreRow(null);
                }}
                className="text-neutral-455 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              
              {/* Profile Card & Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-orange-50/15 border border-orange-100/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fa541c]/10 text-[#fa541c]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', userSelect: 'none' }}>
                    {selectedStudentForEnv.name ? selectedStudentForEnv.name.slice(0, 1) : <User className="w-5 h-5" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 select-none">
                      <span className="font-extrabold text-neutral-850 text-sm">{selectedStudentForEnv.name}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#f6ffed] border border-[#d9f7be] text-[#52c41a]">已交卷</span>
                    </div>
                    <div className="text-xs text-neutral-500 font-medium">
                      账号: <span className="font-mono text-neutral-700">{selectedStudentForEnv.account}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      showToast('已成功刷新环境数据', 'success');
                      setOpenMoreRow(null);
                    }}
                    className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 w-8 h-8 p-0 flex items-center justify-center rounded-[4px] cursor-pointer bg-white"
                    title="刷新"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Record 1 Section */}
              <div className="space-y-3">
                <div className="text-[14px] font-bold text-neutral-800 select-none">第1次记录</div>
                
                <div className="border border-neutral-200 rounded">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                        <th className="p-3 pl-4 w-[16%] whitespace-nowrap">试题名称</th>
                        <th className="p-3 w-[12%] whitespace-nowrap">环境状态</th>
                        <th className="p-3 w-[10%] whitespace-nowrap">进度</th>
                        <th className="p-3 w-[15%] whitespace-nowrap">虚拟ID</th>
                        <th className="p-3 w-[15%] whitespace-nowrap">虚拟IP</th>
                        <th className="p-3 pl-4 text-left w-[32%] whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                      <tr className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-3 pl-4 font-semibold text-neutral-850 whitespace-nowrap">编程题01</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium inline-block bg-neutral-100 border border-neutral-200 text-neutral-500">
                            未开始
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">--</td>
                        <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">--</td>
                        <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">--</td>
                        <td className="p-3 pl-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-4 text-xs whitespace-nowrap">
                            <button onClick={() => showToast('正在初始化环境...', 'info')} className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-medium whitespace-nowrap">初始化环境</button>
                            <button 
                              onClick={() => {
                                setOpenMoreRow(null);
                                setConfirmModal({
                                  show: true,
                                  title: '清理环境',
                                  message: '确定要清理该实训题目对应的虚拟机环境吗？该操作将重置考生容器状态。',
                                  showCancel: true,
                                  onConfirm: () => {
                                    showToast('正在清理环境...', 'info');
                                    setTimeout(() => {
                                      showToast('清理成功', 'success');
                                    }, 1000);
                                  }
                                });
                              }}
                              className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-medium whitespace-nowrap"
                            >
                              清理环境
                            </button>
                            <div className="relative" data-action-menu-open={openMoreRow === 'p01'}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMoreRow(openMoreRow === 'p01' ? null : 'p01');
                                }}
                                className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-medium flex items-center gap-0.5 whitespace-nowrap"
                              >
                                更多 <ChevronDown className="w-3 h-3" />
                              </button>
                              {openMoreRow === 'p01' && (
                                <div className="absolute left-0 bottom-full mb-[2px] bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[120px] text-left animate-in fade-in slide-in-from-bottom-1 duration-150">
                                  <button
                                    onClick={() => {
                                      setOpenMoreRow(null);
                                      setConfirmModal({
                                        show: true,
                                        title: '失败原因',
                                        message: '容器挂载点检测超时，未能与主服务正常握手。请尝试清理环境后重新初始化。',
                                        showCancel: false,
                                        onConfirm: () => {}
                                      });
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                  >
                                    失败原因
                                  </button>
                                  <button
                                    onClick={() => {
                                      showToast('正在执行检查...', 'info');
                                      setOpenMoreRow(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                  >
                                    执行检查
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-3 pl-4 font-semibold text-neutral-850 whitespace-nowrap">编程题03</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium inline-block bg-[#f6ffed] border border-[#d9f7be] text-[#52c41a]">
                            清理成功
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">--</td>
                        <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">--</td>
                        <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">--</td>
                        <td className="p-3 pl-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-4 text-xs whitespace-nowrap">
                            <button onClick={() => showToast('正在初始化环境...', 'info')} className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-medium whitespace-nowrap">初始化环境</button>
                            <button 
                              onClick={() => {
                                setOpenMoreRow(null);
                                setConfirmModal({
                                  show: true,
                                  title: '清理环境',
                                  message: '确定要清理该实训题目对应的虚拟机环境吗？该操作将重置考生容器状态。',
                                  showCancel: true,
                                  onConfirm: () => {
                                    showToast('正在清理环境...', 'info');
                                    setTimeout(() => {
                                      showToast('清理成功', 'success');
                                    }, 1000);
                                  }
                                });
                              }}
                              className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-medium whitespace-nowrap"
                            >
                              清理环境
                            </button>
                            <div className="relative" data-action-menu-open={openMoreRow === 'p03'}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMoreRow(openMoreRow === 'p03' ? null : 'p03');
                                }}
                                className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 font-medium flex items-center gap-0.5 whitespace-nowrap"
                              >
                                更多 <ChevronDown className="w-3 h-3" />
                              </button>
                              {openMoreRow === 'p03' && (
                                <div className="absolute left-0 bottom-full mb-[2px] bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[120px] text-left animate-in fade-in slide-in-from-bottom-1 duration-150">
                                  <button
                                    onClick={() => {
                                      setOpenMoreRow(null);
                                      setConfirmModal({
                                        show: true,
                                        title: '失败原因',
                                        message: '容器挂载点检测超时，未能与主服务正常握手。请尝试清理环境后重新初始化。',
                                        showCancel: false,
                                        onConfirm: () => {}
                                      });
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                  >
                                    失败原因
                                  </button>
                                  <button
                                    onClick={() => {
                                      showToast('正在执行检查...', 'info');
                                      setOpenMoreRow(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                  >
                                    执行检查
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Record 2 Section */}
              <div className="space-y-3">
                <div className="text-[14px] font-bold text-neutral-800 select-none">第2次记录</div>
                
                <div className="border border-neutral-200 rounded">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                        <th className="p-3 pl-4 w-[16%] whitespace-nowrap">试题名称</th>
                        <th className="p-3 w-[12%] whitespace-nowrap">环境状态</th>
                        <th className="p-3 w-[10%] whitespace-nowrap">进度</th>
                        <th className="p-3 w-[15%] whitespace-nowrap">虚拟ID</th>
                        <th className="p-3 w-[15%] whitespace-nowrap">虚拟IP</th>
                        <th className="p-3 pl-4 text-left w-[32%] whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700">
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-400 bg-white whitespace-nowrap">
                          暂无数据
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
              <Button
                onClick={() => {
                  setShowEnvDetailsModal(false);
                  setOpenMoreRow(null);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[6px] text-xs cursor-pointer shadow-sm transition-colors border-0"
              >
                关闭窗口
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* 查看试卷 Modal */}
      {showViewPaperModal && selectedStudentForPaper && (
        <div 
          className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-[2px] flex items-center justify-center animate-fade-in p-4 text-[13px]"
          onClick={() => {
            setShowViewPaperModal(false);
            setSelectedStudentForPaper(null);
          }}
        >
          <div 
            className="bg-white w-full max-w-[760px] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#fa541c]" />
                查看试卷 - {selectedStudentForPaper.name}
              </h3>
              <button 
                onClick={() => {
                  setShowViewPaperModal(false);
                  setSelectedStudentForPaper(null);
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="border border-neutral-100 rounded-md overflow-hidden bg-white overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium select-none whitespace-nowrap">
                      <th className="p-3 pl-4">提交次数</th>
                      <th className="p-3">提交时间</th>
                      <th className="p-3">得分/总分</th>
                      <th className="p-3 text-center pr-4">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {(() => {
                      const earnedScore = selectedStudentForPaper ? selectedStudentForPaper.score : 0;
                      const submitTime = selectedStudentForPaper?.loginStatus === '未登录' ? '--' : '2026-07-07 11:00:15';
                      const submitCount = selectedStudentForPaper?.loginStatus === '未登录' ? '0次' : '1次';
                      return (
                        <tr className="hover:bg-neutral-50/40 transition-colors whitespace-nowrap">
                          <td className="p-3 pl-4 font-medium text-neutral-800">{submitCount}</td>
                          <td className="p-3 text-neutral-500 font-mono">{submitTime}</td>
                          <td className="p-3 font-bold text-neutral-855">{earnedScore}分 / 100分</td>
                          <td className="p-3 text-center pr-4">
                            <button
                              onClick={() => {
                                setPreviewQuestionType('单选题');
                                setPreviewQuestionIdx(0);
                                setPreviewModeActive(true);
                                setShowViewPaperModal(false);
                              }}
                              className="text-xs text-[#fa541c] hover:text-[#e84a15] transition-colors border border-[#fa541c]/30 hover:border-[#fa541c] bg-transparent px-2.5 py-1 rounded-[4px] cursor-pointer font-medium"
                            >
                              预览
                            </button>
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end shrink-0">
              <Button 
                onClick={() => {
                  setShowViewPaperModal(false);
                  setSelectedStudentForPaper(null);
                }} 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 分配批阅任务 Modal */}
      {showAssignModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => {
            setShowAssignModal(false);
            setIsAssignMarkerDropdownOpen(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-100 flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 rounded-t-2xl">
              <h3 className="text-base font-extrabold text-neutral-850">添加批阅老师</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setIsAssignMarkerDropdownOpen(false);
                }}
                className="text-neutral-450 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-visible">
              <div className="grid grid-cols-[100px_1fr] items-start gap-y-5 gap-x-4">
                <label className="text-[13px] font-bold text-neutral-400 select-none pt-2 flex items-center">
                  单卷批阅次数 <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div>
                  <div className="border border-neutral-200 rounded-[6px] overflow-hidden flex items-center bg-white h-9 w-[114px]">
                    <button 
                      onClick={() => setAssignCount(Math.max(1, assignCount - 1))} 
                      className="w-9 h-full flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-r border-neutral-200 cursor-pointer text-base select-none disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={assignCount <= 1}
                    >
                      —
                    </button>
                    <span className="w-14 text-center font-bold text-[14px] text-neutral-850 select-none">{assignCount}</span>
                    <button 
                      onClick={() => setAssignCount(assignCount + 1)} 
                      className="w-9 h-full flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-l border-neutral-200 cursor-pointer text-base select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <label className="text-[13px] font-bold text-neutral-400 select-none pt-2 flex items-center">
                  批阅账号 <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex flex-col">
                  <div 
                    onClick={() => setIsAssignMarkerDropdownOpen(!isAssignMarkerDropdownOpen)}
                    className={cn(
                      "h-9 w-full border rounded-[6px] px-3.5 flex items-center justify-between transition-all duration-150 text-[13px] font-medium cursor-pointer text-left bg-white select-none",
                      isAssignMarkerDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "hover:border-[#fa541c] border-neutral-200"
                    )}
                  >
                    <span className={assignMarker ? "text-neutral-800" : "text-neutral-400"}>
                      {assignMarker ? (assignMarker === 'sx_admin' ? 'sxAdmin (sx_admin)' : assignMarker === 'teacher_01' ? '张老师 (teacher_01)' : '李老师 (teacher_02)') : '请选择批阅账号'}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isAssignMarkerDropdownOpen && "rotate-180")} />
                  </div>

                  {isAssignMarkerDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg border border-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[310] py-1 animate-in fade-in slide-in-from-top-1 duration-150 max-h-48 overflow-y-auto custom-scrollbar">
                      {[
                        { account: 'sx_admin', name: 'sxAdmin (sx_admin)' },
                        { account: 'teacher_01', name: '张老师 (teacher_01)' },
                        { account: 'teacher_02', name: '李老师 (teacher_02)' }
                      ].map((m) => (
                        <div
                          key={m.account}
                          onClick={() => {
                            setAssignMarker(m.account);
                            setIsAssignMarkerDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer transition-colors text-left flex items-center justify-between",
                            assignMarker === m.account && "bg-orange-50/40 text-[#fa541c] font-bold"
                          )}
                        >
                          <span>{m.name}</span>
                          {assignMarker === m.account && <Check className="w-3.5 h-3.5 text-[#fa541c]" />}
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="text-[12px] text-neutral-400 mt-2 select-none">将所有考生平均分配至批阅账号</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-2.5 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignModal(false);
                  setIsAssignMarkerDropdownOpen(false);
                }}
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  if (!assignMarker) {
                    showToast('请选择批阅账号', 'error');
                    return;
                  }
                  showToast('批阅任务分配成功', 'success');
                  setShowAssignModal(false);
                  setIsAssignMarkerDropdownOpen(false);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] text-xs cursor-pointer shadow-sm transition-colors border-0"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 自动分配批阅设置 Modal */}
      {showAutoAssignModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => {
            setShowAutoAssignModal(false);
            setIsAutoAssignMarkerDropdownOpen(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-neutral-100 flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#fa541c]" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-850">自动分配批阅设置</h3>
              </div>
              <button
                onClick={() => {
                  setShowAutoAssignModal(false);
                  setIsAutoAssignMarkerDropdownOpen(false);
                }}
                className="text-neutral-455 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-visible flex flex-col">
              {/* Prompt Text */}
              <div className="flex items-start gap-1.5 text-[12.5px] text-[#fa541c] font-semibold select-none leading-normal">
                <Info className="w-4 h-4 text-[#fa541c] mt-0.5 shrink-0" />
                <span>自动分配批阅设置仅在考试进行中对余量的未提交的试卷生效</span>
              </div>

              {/* Stepper Count Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-extrabold text-neutral-850 flex items-center gap-1 select-none">
                  单卷批阅次数 <span className="text-red-500">*</span>
                </label>
                <div className="border border-neutral-200 rounded-[6px] overflow-hidden flex items-center bg-white h-9 w-[114px]">
                  <button 
                    onClick={() => setAutoAssignCount(Math.max(1, autoAssignCount - 1))} 
                    className="w-9 h-full flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-r border-neutral-200 cursor-pointer text-base select-none disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={autoAssignCount <= 1}
                  >
                    —
                  </button>
                  <span className="w-14 text-center font-bold text-[14px] text-neutral-850 select-none">{autoAssignCount}</span>
                  <button 
                    onClick={() => setAutoAssignCount(autoAssignCount + 1)} 
                    className="w-9 h-full flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-l border-neutral-200 cursor-pointer text-base select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Marker Account Select */}
              <div className="space-y-1.5 relative flex flex-col">
                <label className="text-[13px] font-extrabold text-neutral-850 flex items-center gap-1 select-none">
                  批阅账号 <span className="text-red-500">*</span>
                </label>
                <div 
                  onClick={() => setIsAutoAssignMarkerDropdownOpen(!isAutoAssignMarkerDropdownOpen)}
                  className={cn(
                    "h-9 w-full border rounded-[6px] px-3.5 flex items-center justify-between transition-all duration-150 text-[13px] font-medium cursor-pointer text-left bg-white select-none",
                    isAutoAssignMarkerDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "hover:border-[#fa541c] border-neutral-200"
                  )}
                >
                  <span className={autoAssignMarker ? "text-neutral-800" : "text-neutral-400"}>
                    {autoAssignMarker ? (autoAssignMarker === 'sx_admin' ? 'sxAdmin (sx_admin)' : autoAssignMarker === 'teacher_01' ? '张老师 (teacher_01)' : '李老师 (teacher_02)') : '请选择批阅账号'}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isAutoAssignMarkerDropdownOpen && "rotate-180")} />
                </div>

                {isAutoAssignMarkerDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg border border-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[310] py-1 animate-in fade-in slide-in-from-top-1 duration-150 max-h-48 overflow-y-auto custom-scrollbar">
                    {[
                      { account: 'sx_admin', name: 'sxAdmin (sx_admin)' },
                      { account: 'teacher_01', name: '张老师 (teacher_01)' },
                      { account: 'teacher_02', name: '李老师 (teacher_02)' }
                    ].map((m) => (
                      <div
                        key={m.account}
                        onClick={() => {
                          setAutoAssignMarker(m.account);
                          setIsAutoAssignMarkerDropdownOpen(false);
                        }}
                        className={cn(
                          "px-4 py-2.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer transition-colors text-left flex items-center justify-between",
                          autoAssignMarker === m.account && "bg-orange-50/40 text-[#fa541c] font-bold"
                        )}
                      >
                        <span>{m.name}</span>
                        {autoAssignMarker === m.account && <Check className="w-3.5 h-3.5 text-[#fa541c]" />}
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-[12px] text-neutral-400 mt-1 select-none">将所有考生平均分配至批阅账号</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-2.5 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAutoAssignModal(false);
                  setIsAutoAssignMarkerDropdownOpen(false);
                }}
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  if (!autoAssignMarker) {
                    showToast('请选择批阅账号', 'error');
                    return;
                  }
                  showToast('自动分配设置成功', 'success');
                  setShowAutoAssignModal(false);
                  setIsAutoAssignMarkerDropdownOpen(false);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] text-xs cursor-pointer shadow-sm transition-colors border-0"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑更换批阅人 Modal */}
      {showChangeGraderModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => {
            setShowChangeGraderModal(false);
            setGraderDropdownOpen(false);
          }}
        >
          <div 
            className="bg-white w-full max-w-[450px] rounded-lg shadow-2xl flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0 rounded-t-lg">
              <h3 className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#fa541c]" />
                编辑更换批阅人
              </h3>
              <button 
                onClick={() => {
                  setShowChangeGraderModal(false);
                  setGraderDropdownOpen(false);
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 pb-8">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 relative select-none">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  管理员 <span className="text-[#fa541c]">*</span>
                </label>
                
                <div className="relative w-full">
                  {/* Select Trigger Box */}
                  <div 
                    onClick={() => setGraderDropdownOpen(!graderDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none text-left text-xs",
                      graderDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(graderValue ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {graderValue || '请选择'}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", graderDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {/* Dropdown Options */}
                  {graderDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150 text-xs">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {[
                          { name: 'sxAdmin (sx_admin)', value: 'sx_admin' },
                          { name: '张老师 (teacher_01)', value: 'teacher_01' },
                          { name: '李老师 (teacher_02)', value: 'teacher_02' },
                          { name: 'MS.df (teacherDF@sz)', value: 'teacherDF@sz' }
                        ].map((option) => {
                          const isSelected = graderValue === option.name;
                          return (
                            <div
                              key={option.value}
                              onClick={() => {
                                setGraderValue(option.name);
                                setGraderDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{option.name}</span>
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

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0 rounded-b-lg">
              <Button 
                onClick={() => {
                  setShowChangeGraderModal(false);
                  setGraderDropdownOpen(false);
                }} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!graderValue.trim()) {
                    showToast('管理员不能为空', 'error');
                    return;
                  }
                  showToast('更换批阅人成功', 'success');
                  setShowChangeGraderModal(false);
                  setGraderDropdownOpen(false);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 预览学生名单 Modal */}
      {showStudentsModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => setShowStudentsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-neutral-100 flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#fa541c]" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-850">预览学生名单</h3>
              </div>
              <button
                onClick={() => setShowStudentsModal(false)}
                className="text-neutral-455 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              {/* Table list */}
              <div className="space-y-3">
                <div className="border border-neutral-200 rounded">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                        <th className="p-3 pl-4">账号</th>
                        <th className="p-3">姓名</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
                      <tr className="hover:bg-neutral-50/50 transition-colors h-11">
                        <td className="p-3 pl-4 font-mono font-semibold text-neutral-850">2</td>
                        <td className="p-3 text-neutral-700 font-medium">t01_liuwei</td>
                      </tr>
                      <tr className="hover:bg-neutral-50/50 transition-colors h-11">
                        <td className="p-3 pl-4 font-mono font-semibold text-neutral-850">liuwei</td>
                        <td className="p-3 text-neutral-700 font-medium">liuwei</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-2.5 rounded-b-2xl">
              <Button
                onClick={() => setShowStudentsModal(false)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] text-xs cursor-pointer shadow-sm transition-colors border-0"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 批阅详情 Modal */}
      {showGradingDetailsModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => setShowGradingDetailsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-neutral-100 flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#fa541c]" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-850">批阅详情</h3>
              </div>
              <button
                onClick={() => setShowGradingDetailsModal(false)}
                className="text-neutral-455 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              {/* Table list */}
              <div className="space-y-3">
                <div className="border border-neutral-200 rounded">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                        <th className="p-3 pl-4 w-[25%]">账号</th>
                        <th className="p-3 w-[25%]">姓名</th>
                        <th className="p-3 w-[30%]">批阅状态</th>
                        <th className="p-3 pl-4 text-left w-[20%]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
                      <tr className="hover:bg-neutral-50/50 transition-colors h-11">
                        <td className="p-3 pl-4 font-mono font-semibold text-neutral-850">2</td>
                        <td className="p-3 text-neutral-700 font-medium">t01_liuwei</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium inline-block bg-orange-50 border border-orange-100 text-[#fa541c]">
                            批阅中（后转入）
                          </span>
                        </td>
                        <td className="p-3 pl-4 text-left">
                          <button
                            onClick={() => {
                              setSelectedStudentForPaper({ id: 2, account: '2', name: 't01_liuwei', score: 85 });
                              setPreviewModeActive(true);
                              setPreviewQuestionIdx(0);
                            }}
                            className="text-[#fa541c] hover:text-[#e84a15] font-bold bg-transparent border-0 cursor-pointer p-0 text-xs hover:underline"
                          >
                            预览试卷
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-neutral-50/50 transition-colors h-11">
                        <td className="p-3 pl-4 font-mono font-semibold text-neutral-850">liuwei</td>
                        <td className="p-3 text-neutral-700 font-medium">liuwei</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium inline-block bg-neutral-100 border border-neutral-200 text-neutral-500">
                            未批阅（后转入）
                          </span>
                        </td>
                        <td className="p-3 pl-4 text-left">
                          <button
                            onClick={() => {
                              setSelectedStudentForPaper({ id: 1, account: 'liuwei', name: 'liuwei', score: 70 });
                              setPreviewModeActive(true);
                              setPreviewQuestionIdx(0);
                            }}
                            className="text-[#fa541c] hover:text-[#e84a15] font-bold bg-transparent border-0 cursor-pointer p-0 text-xs hover:underline"
                          >
                            预览试卷
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-2.5 rounded-b-2xl">
              <Button
                onClick={() => setShowGradingDetailsModal(false)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] text-xs cursor-pointer shadow-sm transition-colors border-0"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 上传批阅 Modal */}
      {showImportScoresModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => setShowImportScoresModal(false)}
        >
          <div 
            className="bg-white w-full max-w-[450px] rounded-lg shadow-2xl flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0 rounded-t-lg">
              <h3 className="text-[15px] font-bold text-neutral-850">
                上传批阅
              </h3>
              <button 
                onClick={() => setShowImportScoresModal(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center justify-center">
              <div 
                onClick={() => showToast('正在选择上传文件...', 'info')}
                className="w-full border border-dashed border-[#ff9c6e]/70 bg-orange-50/[0.02] hover:bg-orange-50/[0.06] rounded-lg py-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none"
              >
                <UploadCloud className="w-14 h-14 text-[#ff9c6e] mb-4 stroke-[1.25]" />
                <span className="text-[#fa541c] font-medium text-[13px]">支持将文件拖拽至此区域</span>
              </div>
              
              <div className="text-neutral-500 font-medium select-none text-[12.5px] mt-4 flex items-center justify-center gap-0.5">
                <span>点此</span>
                <span 
                  onClick={() => showToast('正在下载导入模板...', 'success')}
                  className="text-[#fa541c] hover:underline cursor-pointer font-bold"
                >
                  ↓下载
                </span>
                <span>模板</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0 rounded-b-lg">
              <Button 
                onClick={() => setShowImportScoresModal(false)} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  showToast('最终成绩导入成功', 'success');
                  setShowImportScoresModal(false);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 考生视角批阅详情 Modal */}
      {showCandidateGradingDetailsModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[3px] flex items-center justify-center animate-fade-in text-left text-[13px]"
          onClick={() => setShowCandidateGradingDetailsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-neutral-100 flex flex-col overflow-visible animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#fa541c]" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-850">批阅详情</h3>
              </div>
              <button
                onClick={() => setShowCandidateGradingDetailsModal(false)}
                className="text-neutral-455 hover:text-[#fa541c] hover:bg-neutral-100/80 p-1.5 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              {/* Table list */}
              <div className="space-y-3">
                <div className="border border-neutral-200 rounded">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                        <th className="p-3 pl-4 w-[25%]">账号</th>
                        <th className="p-3 w-[25%]">姓名</th>
                        <th className="p-3 w-[30%]">批阅状态</th>
                        <th className="p-3 pl-4 text-left w-[20%]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
                      <tr className="hover:bg-neutral-50/50 transition-colors h-11">
                        <td className="p-3 pl-4 font-mono font-semibold text-neutral-850">sx_admin</td>
                        <td className="p-3 text-neutral-700 font-medium">sxAdmin</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium inline-block bg-orange-50 border border-orange-100 text-[#fa541c]">
                            批阅中
                          </span>
                        </td>
                        <td className="p-3 pl-4 text-left">
                          <button
                            onClick={() => {
                              setSelectedStudentForPaper({ id: 99, account: 'df0002', name: 'df0002', score: 85 });
                              setPreviewModeActive(true);
                              setPreviewQuestionIdx(0);
                              setShowCandidateGradingDetailsModal(false);
                            }}
                            className="text-[#fa541c] hover:text-[#e84a15] font-bold bg-transparent border-0 cursor-pointer p-0 text-xs hover:underline"
                          >
                            预览试卷
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-[#fbfbfb] flex justify-end gap-2.5 rounded-b-2xl">
              <Button
                onClick={() => setShowCandidateGradingDetailsModal(false)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-[4px] text-xs cursor-pointer shadow-sm transition-colors border-0"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 试卷预览 Full-screen View */}
      {previewModeActive && selectedStudentForPaper && (() => {
        const questions = getDynamicPreviewQuestions(selectedStudentForPaper.score);
        const q = questions[previewQuestionIdx];
        return (
          <div className="fixed inset-0 z-[300] bg-[#f5f5f5] flex flex-col font-sans text-neutral-800 animate-fade-in text-[13px]">
            {/* Header Bar */}
            <div className="h-[56px] bg-white border-b border-neutral-200/60 px-6 flex items-center shrink-0 text-left select-none">
              <button 
                onClick={() => setPreviewModeActive(false)}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 font-medium transition-colors border-0 bg-transparent cursor-pointer p-0 text-[13px]"
              >
                <ArrowLeft className="w-4 h-4" />
                退出
              </button>
              <div className="w-[1px] h-4 bg-neutral-200 mx-4"></div>
              <span className="font-bold text-neutral-800 text-[14px]">
                {detailsSession?.examName || 'Python 基础 - 答卷预览'}
              </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 mt-[20px] px-6 pb-6 relative z-20 overflow-hidden flex flex-col">
              <div className="max-w-[1400px] w-full mx-auto flex flex-1 bg-white border border-neutral-200/80 shadow-lg rounded-xl overflow-hidden min-h-[600px] h-[calc(100vh-14rem)]">
                {/* Left Answering Area */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
                  {/* Scrollable Question Content */}
                  <div className="flex-1 overflow-y-auto px-10 pt-10 pb-4 text-left">
                    
                    {/* Question Type and Score */}
                    <div className="flex items-center justify-between mb-5 select-none">
                      <div className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                        <span>{previewQuestionIdx + 1}、{q.type}</span>
                        <span className="text-[13px] text-neutral-400 font-normal">({q.maxScore}分)</span>
                        <span className="text-[13px] text-[#fa541c] font-bold ml-2">（得分: {q.score}分）</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-orange-50 text-[#fa541c] border border-orange-100/50 rounded-[4px] font-medium">
                          该题 {q.maxScore}.0分
                        </span>
                        <span className="px-2.5 py-1 bg-orange-50 text-[#fa541c] border border-orange-100/50 rounded-[4px] font-bold">
                          得 {q.score}分
                        </span>
                      </div>
                    </div>

                    {/* Question Title */}
                    <div className="text-neutral-800 mb-6 text-[15px] font-bold leading-relaxed">
                      {q.title}
                    </div>

                    {/* Options / Textarea depending on question type */}
                    {q.options ? (
                      <div className="space-y-6 max-w-[800px]">
                        <div className="space-y-3">
                          {q.options.map((opt) => {
                            const isSelected = Array.isArray(q.studentAnswer) ? q.studentAnswer.includes(opt.key) : q.studentAnswer === opt.key;
                            const isRight = Array.isArray(q.answer) ? q.answer.includes(opt.key) : q.answer === opt.key;
                            
                            let cardStyle = "border-neutral-200 bg-neutral-50/30 text-neutral-600";
                            if (q.isCorrect) {
                              if (isSelected) {
                                cardStyle = "border-green-500 text-green-600 bg-green-50/10 font-bold";
                              }
                            } else {
                              if (isSelected) {
                                cardStyle = "border-red-500 text-red-600 bg-red-50/10 font-bold";
                              } else if (isRight) {
                                cardStyle = "border-green-500 text-green-600 bg-green-50/10 font-bold";
                              }
                            }

                            return (
                              <div 
                                key={opt.key}
                                className={cn(
                                  "px-5 py-4 border rounded-[4px] font-medium text-left flex items-center justify-between text-[14px]",
                                  cardStyle
                                )}
                              >
                                <span>{opt.key}. {opt.value}</span>
                                <div className="flex gap-2 text-xs shrink-0 select-none">
                                  {isSelected && (
                                    <span className={cn(
                                      "px-2 py-0.5 rounded-[4px] text-[11px] font-bold",
                                      q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>学生作答</span>
                                  )}
                                  {isRight && !isSelected && (
                                    <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-green-100 text-green-700">正确答案</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Answer Details matching the mock image exactly */}
                        <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2.5 text-left text-[14px] select-none">
                          <div className="flex items-center gap-1.5 font-bold text-neutral-650">
                            <span>正确答案：</span>
                            <span className="text-[#52c41a] font-mono">{Array.isArray(q.answer) ? q.answer.sort().join(', ') : q.answer}</span>
                          </div>
                          <div className="flex items-center gap-2 font-bold text-neutral-650">
                            <span>学生答案：</span>
                            <span className="text-neutral-700 font-mono">{Array.isArray(q.studentAnswer) ? q.studentAnswer.sort().join(', ') : q.studentAnswer}</span>
                            {q.isCorrect ? (
                              <span className="text-[#52c41a] font-sans font-bold text-[18px]">✓</span>
                            ) : (
                              <span className="text-[#f5222d] font-sans font-bold text-[18px]">✗</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 max-w-[900px] text-left pt-2">
                        {/* Student Answer */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-neutral-500 block">学生作答：</span>
                          <pre className="p-4 bg-neutral-50 border border-neutral-200 rounded-[4px] text-[13px] text-neutral-700 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {q.studentAnswerText}
                          </pre>
                        </div>

                        {/* Standard Answer */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-green-700 block">参考答案：</span>
                          <pre className="p-4 bg-green-50/20 border border-green-200 rounded-[4px] text-[13px] text-green-800 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {q.answerText}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex items-center justify-between px-10 py-5 border-t border-neutral-100 bg-white shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10 select-none">
                    <Button
                      variant="outline"
                      disabled={previewQuestionIdx === 0}
                      onClick={() => setPreviewQuestionIdx(idx => idx - 1)}
                      className="border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-6 h-9.5 text-[13px] font-bold rounded-[4px]"
                    >
                      上一题
                    </Button>
                    
                    <Button 
                      disabled={previewQuestionIdx === questions.length - 1}
                      onClick={() => setPreviewQuestionIdx(idx => idx + 1)}
                      className={cn(
                        "px-6 h-9.5 text-[13px] font-bold shadow-sm rounded-[4px] transition-all flex items-center gap-1 cursor-pointer",
                        previewQuestionIdx === questions.length - 1
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200 shadow-none"
                          : "bg-[#fa541c] hover:bg-[#e84a15] text-white"
                      )}
                    >
                      下一题
                    </Button>
                  </div>
                </div>

                {/* Right Sidebar navigation */}
                <div className="w-80 border-l border-neutral-200 flex flex-col bg-white px-6 pt-8 pb-6 shrink-0 justify-between h-full text-left select-none">
                  <div className="overflow-y-auto flex-1 no-scrollbar space-y-6 flex flex-col justify-between">
                    {/* Sidebar navigations for all types */}
                    <div className="space-y-6 pt-2">
                      {['单选题', '多选题', '简答题', '实训编程题'].map((typeStr) => {
                        const typeQuestions = questions.map((q, qIdx) => ({ ...q, originalIndex: qIdx })).filter(q => q.type === typeStr);
                        if (typeQuestions.length === 0) return null;
                        return (
                          <div key={typeStr} className="space-y-3">
                            <h3 className="text-[13px] font-bold text-neutral-800">{typeStr}</h3>
                            <div className="grid grid-cols-5 gap-3">
                              {typeQuestions.map((item) => {
                                const isActive = item.originalIndex === previewQuestionIdx;
                                return (
                                  <div 
                                    key={item.id}
                                    onClick={() => setPreviewQuestionIdx(item.originalIndex)}
                                    className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative border",
                                      item.score > 0
                                        ? (isActive 
                                            ? "bg-emerald-500 text-white border-transparent" 
                                            : "bg-emerald-500/[0.08] border-emerald-500 text-emerald-600 hover:bg-emerald-500/[0.15]")
                                        : (isActive 
                                            ? "bg-red-500 text-white border-transparent" 
                                            : "bg-red-500/[0.08] border-red-500 text-red-600 hover:bg-red-500/[0.15]")
                                    )}
                                  >
                                    {item.originalIndex + 1}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Exit Preview Button below the navigations */}
                    <div className="pt-6 border-t border-neutral-200 mt-6 select-none shrink-0">
                      <Button 
                        onClick={() => setPreviewModeActive(false)}
                        className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white border-0 font-bold h-9.5 text-[13px] rounded-[4px] cursor-pointer transition-colors shadow-sm"
                      >
                        退出预览
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
