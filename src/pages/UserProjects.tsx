import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Users,
  Star,
  Monitor,
  Tag,
  Plus,
  Github,
  X,
  Cpu,
  BookOpen,
  Trash2,
  Upload,
  Check,
  Loader2,
  Info,
  Bold,
  Italic,
  Type,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectIDE from "@/components/ProjectIDE";
import ProjectDetail from "@/components/ProjectDetail";

import { useLocation, useNavigate } from "react-router-dom";

interface EnvConfig {
  id: string;
  resourcePool: string;
  type: '容器' | '虚机';
  // 容器字段
  sourceFile?: string; // 项目源码文件
  cpuCores?: string;
  memoryGB?: string;
  gpu?: {
    power: string; // 算力
    vram: string;  // 显存
    count: string; // 卡数
    model?: string; // GPU 型号
  };
  image: string;
  envVariables?: { key: string; value: string }[];
  startCommand?: string;
  // 虚机字段
  vmSpecType?: 'custom' | 'spec'; // 自定义 or 选择规格
  selectedSpec?: string;
  storage?: {
    type: string;
    systemDisk: string;
    dataType?: string;
    dataDisk: string;
  };
  network?: {
    vpc: string;
    subnet: string;
  };
  vncType?: string;
}

const parseSubnet = (subnetStr: string) => {
  let standardStr = subnetStr;
  if (subnetStr === 'subnet-1') standardStr = '192.168.1.0/16';
  else if (subnetStr === 'subnet-2') standardStr = '192.168.2.0/24';
  else if (subnetStr === 'subnet-3') standardStr = '192.168.3.0/24';
  else if (!subnetStr || !subnetStr.includes('/')) standardStr = '192.168.1.0/16';

  const parts = standardStr.split(/[./]/);
  const octet3 = parts[2] || '1';
  const octet4 = parts[3] || '0';
  const mask = parts[4] || '16';
  return { octet3, octet4, mask };
};


const CONTAINER_IMAGES = {
  '天翼云资源池1': [
    'ctyun-python:3.10-slim-cpu',
    'ctyun-pytorch:2.1.0-cuda12.1-gpu',
    'ctyun-tensorflow:2.14.0-cuda11.8-gpu',
    'ctyun-openjdk:17-jdk-alpine',
    'ctyun-node:20-alpine'
  ],
  '上海园区资源池': [
    'sh-python:3.11-slim',
    'sh-pytorch:2.2.0-cuda12.1-gpu',
    'sh-tensorflow:2.15.0-cuda12.2-gpu',
    'sh-openjdk:11-jdk-alpine',
    'sh-node:18-alpine'
  ]
};

const VM_IMAGES = {
  '天翼云资源池1': [
    'ctyun-ubuntu-22.04-server-x86_64.qcow2',
    'ctyun-centos-7.9-x86_64.qcow2',
    'ctyun-debian-11.5-x86_64.qcow2',
    'ctyun-windows-server-2022-standard.qcow2'
  ],
  '上海园区资源池': [
    'sh-ubuntu-20.04-server-x86_64.img',
    'sh-centos-8.4-x86_64.img',
    'sh-debian-12.0-x86_64.img',
    'sh-windows-10-enterprise-x64.img'
  ]
};

const VM_SPECS = [
  { value: 'ecs.g6.large', label: '通用计算型 g6.large | 2核 8GB | 无GPU' },
  { value: 'ecs.g6.xlarge', label: '通用计算型 g6.xlarge | 4核 16GB | 无GPU' },
  { value: 'ecs.gn6i-c4g1.xlarge', label: 'GPU计算型 gn6i | 4核 16GB | T4 * 1 (16GB)' },
  { value: 'ecs.gn7i-c8g1.2xlarge', label: 'GPU计算型 gn7i | 8核 32GB | A10G * 1 (24GB)' }
];

interface CustomSelectOption {
  value: string;
  label: string | React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  placeholder = '请选择'
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className={cn("relative text-[13px] w-full", className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "min-h-[38px] w-full border rounded px-3.5 py-2 flex items-center justify-between transition-all text-[#262626] bg-white cursor-pointer select-none",
          isOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-neutral-300",
          disabled && "bg-neutral-50 text-neutral-500 cursor-not-allowed border-neutral-100"
        )}
      >
        <span className={cn("truncate font-medium", !selectedOption && "text-neutral-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {!disabled && (
          <div className="text-neutral-400 shrink-0 ml-2">
            <ChevronDown 
              className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isOpen && "rotate-180")} 
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
            {options.map(opt => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2.5 text-left text-[13px] transition-colors cursor-pointer flex items-center justify-between",
                    isSelected 
                      ? "bg-orange-50 text-[#fa541c] font-bold"
                      : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                  )}
                >
                  <span className="font-medium">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#fa541c]" strokeWidth={2.5} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const AVAILABLE_TAGS = [
  { name: 'AI', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500' },
  { name: '容器', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' },
  { name: '虚机', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-500' },
  { name: 'Java', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  { name: 'Python', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', dot: 'bg-teal-500' },
  { name: '数据分析', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  { name: '运维', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500' },
  { name: 'DevOps', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  { name: '大模型', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
  { name: '微服务', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', dot: 'bg-sky-500' },
];

const getTagStyle = (tagName: string) => {
  const found = AVAILABLE_TAGS.find(t => t.name === tagName);
  if (found) return found;
  return {
    name: tagName,
    bg: 'bg-neutral-50',
    text: 'text-neutral-600',
    border: 'border-neutral-200',
    dot: 'bg-neutral-400'
  };
};


export default function UserProjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeProject = location.state?.resumeProject;
  const [isEditingProject, setIsEditingProject] = useState(!!resumeProject);
  const [selectedProject, setSelectedProject] = useState<any>(location.state?.project || null);

  useEffect(() => {
    if (location.state?.project) {
      setSelectedProject(location.state.project);
    }
  }, [location.state]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Default covers for premium look
  const defaultCovers = [
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cloud_1779333396845.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cyber_1779333412582.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_dev_1779333430898.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ml_1779333449102.png`,
  ];

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form setup wizard active tab inside Modal
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'env'>('basic');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'初级' | '中级' | '高级'>('中级');
  const [selectedCover, setSelectedCover] = useState(defaultCovers[0]);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [formEnvironments, setFormEnvironments] = useState<EnvConfig[]>([]);

  // Additional form states matching Fig 1 & Fig 2
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [availableTagsList, setAvailableTagsList] = useState<string[]>([
    'AI', '容器', '虚机', 'Java', 'Python', '数据分析', '运维', 'DevOps', '大模型', '微服务'
  ]);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const [formIntroduction, setFormIntroduction] = useState('');

  const [activeEnvIdx, setActiveEnvIdx] = useState(0);
  const [repoUploadMode, setRepoUploadMode] = useState<'manual' | 'upload'>('manual');
  const [formSourceRepoUrl, setFormSourceRepoUrl] = useState('');
  const [formCreationMethod, setFormCreationMethod] = useState<'template' | 'custom'>('template');
  const [formTemplateValue, setFormTemplateValue] = useState('通用模板');

  const currentResourcePool = formEnvironments[0]?.resourcePool || '资源池1';
  const currentEnvType = formEnvironments[0]?.type || '容器';
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');

  const handleChangeEnvType = (newType: '容器' | '虚机') => {
    const updated = formEnvironments.map(env => {
      if (env.type === newType) return env;
      if (newType === '容器') {
        return {
          id: env.id,
          resourcePool: env.resourcePool,
          type: '容器' as const,
          sourceFile: '',
          cpuCores: '2',
          memoryGB: '4',
          gpu: { power: '无', vram: '0', count: '0', model: '4090' },
          image: CONTAINER_IMAGES[env.resourcePool as '天翼云资源池1' | '上海园区资源池']?.[0] || 'ctyun-python:3.10-slim-cpu',
          envVariables: [],
          startCommand: 'python main.py'
        };
      } else {
        return {
          id: env.id,
          resourcePool: env.resourcePool,
          type: '虚机' as const,
          vmSpecType: 'custom' as const,
          selectedSpec: VM_SPECS[0].value,
          cpuCores: '2',
          memoryGB: '8',
          gpu: { power: '无', vram: '0', count: '0', model: '4090' },
          image: VM_IMAGES[env.resourcePool as '天翼云资源池1' | '上海园区资源池']?.[0] || 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
          storage: { type: 'SSD', systemDisk: '40', dataType: 'SSD', dataDisk: '100' },
          network: { vpc: 'vpc-default', subnet: 'subnet-1' },
          vncType: 'novnc' as const
        };
      }
    });
    setFormEnvironments(updated);
    setActiveEnvIdx(0);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initial projects data state
  const [projectsList, setProjectsList] = useState([
    {
      title: "图像分类项目",
      desc: "基于CNN的图像分类实战，涵盖数据预处理、模型构建与训练。",
      image: "https://picsum.photos/seed/proj1/400/225",
      participants: "1,234",
      favorites: 342,
      innovator: "李明",
      type: "平台项目",
      difficulty: "中级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "文本情感分析项目",
      desc: "NLP实战：使用深度学习模型对海量文本进行情感倾向分析。",
      image: "https://picsum.photos/seed/proj2/400/225",
      participants: "987",
      favorites: 156,
      innovator: "张华",
      type: "租户项目",
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "电商数据可视化大屏",
      desc: "使用 ECharts 和 React 构建实时动态的电商销售数据大屏。",
      image: "https://picsum.photos/seed/proj3/400/225",
      participants: "2,156",
      favorites: 521,
      innovator: "王强",
      type: "个人项目",
      difficulty: "初级",
      tags: ["数据分析", "可视化"],
      status: "start"
    },
    {
      title: "目标检测系统开发",
      desc: "基于 YOLOv8 的实时目标检测系统，支持自定义数据集训练。",
      image: "https://picsum.photos/seed/proj4/400/225",
      participants: "856",
      favorites: 189,
      innovator: "赵雪",
      type: "平台项目",
      difficulty: "高级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "用户行为数据清洗",
      desc: "使用 Pandas 处理千万级用户行为日志，提取有效特征。",
      image: "https://picsum.photos/seed/proj5/400/225",
      participants: "1,432",
      favorites: 275,
      innovator: "刘磊",
      type: "租户项目",
      difficulty: "中级",
      tags: ["数据分析", "数据清洗"],
      status: "start"
    },
    {
      title: "全栈博客系统开发",
      desc: "从零开始构建基于 Next.js 和 Node.js 的全栈博客平台。",
      image: "https://picsum.photos/seed/proj6/400/225",
      participants: "3,210",
      favorites: 890,
      innovator: "陈芳",
      type: "个人项目",
      difficulty: "中级",
      tags: ["Web开发", "全栈"],
      status: "start"
    },
    {
      title: "智能问答机器人",
      desc: "结合大语言模型API，开发具备上下文记忆的智能客服机器人。",
      image: "https://picsum.photos/seed/proj7/400/225",
      participants: "1,890",
      favorites: 432,
      innovator: "孙杰",
      type: "平台项目",
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "房价预测机器学习模型",
      desc: "使用 Scikit-Learn 构建回归模型，预测城市二手房价格走势。",
      image: "https://picsum.photos/seed/proj8/400/225",
      participants: "2,450",
      favorites: 610,
      innovator: "周伟",
      type: "租户项目",
      difficulty: "初级",
      tags: ["数据分析", "机器学习"],
      status: "continue"
    }
  ]);

  const banners = [
    { title: "2026 AI 创新挑战赛", desc: "丰厚奖金池，等你来战！", color: "from-blue-600 to-indigo-800" },
    { title: "大模型前沿探索营", desc: "掌握最新 LLM 核心技术", color: "from-[#fa541c] to-[#d4380d]" },
    { title: "计算机视觉实战课", desc: "从入门到精通 CV", color: "from-emerald-600 to-teal-800" }
  ];

  useEffect(() => {
    if (isEditingProject) return;
    const interval = setInterval(() => {
       setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isEditingProject]);

  const handleSave = () => {
    if (!formName.trim()) {
      showToast('请输入项目名称！');
      return;
    }
    if (!formDesc.trim()) {
      showToast('请输入项目描述！');
      return;
    }
    if (!formIntroduction.trim()) {
      showToast('请输入项目介绍！');
      return;
    }

    let finalEnvs = [...formEnvironments];
    if (currentEnvType === '容器' && formCreationMethod === 'template') {
      finalEnvs = [
        {
          id: 'env-' + Date.now(),
          resourcePool: currentResourcePool,
          type: '容器',
          image: formTemplateValue === '通用模板' ? 'ctyun-python:3.10-slim-cpu' : 
                 formTemplateValue === 'AI模型开发模板' ? 'ctyun-pytorch:2.1.0-cuda12.1-gpu' :
                 formTemplateValue === '数据挖掘算法模板' ? 'ctyun-tensorflow:2.14.0-cuda11.8-gpu' :
                 'ctyun-openjdk:17-jdk-alpine', // Java微服务模板
          sourceFile: repoUploadMode === 'upload' ? formSourceRepoUrl : undefined,
          cpuCores: '2',
          memoryGB: '4',
          gpu: { power: '无', vram: '0', count: '0' }
        }
      ];
    } else {
      finalEnvs = formEnvironments.map(env => {
        if (env.type === '容器') {
          return {
            ...env,
            sourceFile: repoUploadMode === 'upload' ? formSourceRepoUrl : undefined
          };
        }
        return env;
      });
    }

    const newProject: any = {
      title: formName,
      desc: formDesc,
      image: selectedCover,
      participants: "0",
      favorites: 0,
      innovator: "我",
      type: "个人项目",
      difficulty: formDifficulty,
      tags: formTags.length > 0 ? formTags : ['AI'],
      status: "start",
      environments: finalEnvs,
      introduction: formIntroduction
    };

    setProjectsList([newProject, ...projectsList]);
    showToast(`成功创建项目「${formName.slice(0, 10)}...」`);
    setShowNewProjectModal(false);
  };



  if (isEditingProject) {
    return <ProjectIDE projectTitle={resumeProject?.name}
      onBack={() => resumeProject ? navigate("/user/mylearning", { state: { historyTab: "projects" } }) : setIsEditingProject(false)} />;
  }

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
        onStart={() => {
          setSelectedProject(null);
          setIsEditingProject(true);
        }} 
      />
    );
  }

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Banner Carousel */}
      <div className="w-full h-40 mb-8 rounded-[12px] overflow-hidden relative group shrink-0 shadow-sm">
        {banners.map((banner, i) => (
          <div 
            key={i} 
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r flex flex-col justify-center px-12",
              banner.color,
              currentBanner === i ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <h2 className="text-[28px] font-bold text-white mb-2">{banner.title}</h2>
            <p className="text-white/80 text-[15px]">{banner.desc}</p>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
             <div 
               key={i} 
               onClick={() => setCurrentBanner(i)}
               className={cn("w-2 h-2 rounded-full cursor-pointer transition-all", currentBanner === i ? "w-6 bg-white" : "bg-white/50")}
             ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-title">全部项目</h1>
        </div>
        <Button 
          className="bg-[#fa541c] hover:bg-[#d4380d] text-white flex items-center gap-2 shadow-sm h-10 px-6 rounded-[4px]"
          onClick={() => {
            setFormName('');
            setFormDesc('');
            setFormDifficulty('中级');
            setSelectedCover(defaultCovers[0]);
            setFormTags([]);
            setFormIntroduction('');
            setFormSourceRepoUrl('');
            setRepoUploadMode('manual');
            setFormCreationMethod('template');
            setFormTemplateValue('通用模板');
            setFormEnvironments([
              {
                id: 'env-' + Date.now(),
                resourcePool: '天翼云资源池1',
                type: '容器',
                sourceFile: '',
                cpuCores: '2',
                memoryGB: '4',
                gpu: { power: '无', vram: '0', count: '0', model: '4090' },
                image: CONTAINER_IMAGES['天翼云资源池1'][0],
                envVariables: [],
                startCommand: 'python main.py'
              }
            ]);
            setActiveEnvIdx(0);
            setActiveFormTab('basic');
            setShowNewProjectModal(true);
          }}
        >
          <Plus className="w-4 h-4" /> 新建项目
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-16">项目标签</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "AI实战", "数据分析", "Web开发", "图像分类", "目标检测", "NLP应用", "数据清洗", "可视化", "机器学习", "前端开发", "后端开发"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors border",
                  i === 0 ? "bg-[#fa541c] text-white border-transparent" : "bg-white border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-white rounded-full p-1 border border-neutral-border">
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium bg-[#f5f6f8] text-neutral-title">
            最新
          </button>
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium text-neutral-body hover:text-neutral-title">
            最热
          </button>
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption" />
          <Input 
            placeholder="输入项目名称或描述搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

      {/* Main Content Area */}
        <div className="flex-1 pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projectsList.map((project, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-[12px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-bg">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[16px] font-bold text-neutral-title mb-2 line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-[13px] text-neutral-caption mb-3 line-clamp-1">
                      {project.desc}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-[12px] text-neutral-body mb-4 flex items-center gap-3">
                       <span className="text-neutral-caption">创新者: <span className="font-medium text-neutral-body">{project.innovator}</span></span>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-neutral-border flex items-center justify-between text-[12px] text-neutral-caption">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{project.participants} 参与</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#faad14] fill-[#faad14]" />
                        <span className="text-[#faad14] font-medium">{project.favorites} 收藏</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-end p-4 gap-4 mt-8">
              <span className="text-[13px] text-neutral-500">共 234 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">2</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">3</Button>
                <span className="px-1 text-neutral-caption text-[13px]">...</span>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">&gt;</Button>
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-neutral-900/95 text-white border border-neutral-800 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-up text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#fa541c] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {showNewProjectModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setShowNewProjectModal(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" /> 
                新建实战项目
              </h2>
              <button 
                onClick={() => setShowNewProjectModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Headers for configurations */}
            <div className="flex border-b border-neutral-100 bg-neutral-50/20 text-[11px] font-bold select-none flex-shrink-0">
              {[
                { key: 'basic', label: '1. 基础信息', icon: BookOpen },
                { key: 'env', label: '2. 项目环境', icon: Cpu }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFormTab(tab.key as any)}
                  className={cn(
                    "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px]",
                    activeFormTab === tab.key 
                      ? "border-[#fa541c] text-[#fa541c] bg-white font-extrabold" 
                      : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/40"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content Forms */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              
              {/* TAB 1: BASIC INFORMATION */}
              {activeFormTab === 'basic' && (
                <div className="space-y-6 animate-fade-in py-2">
                  
                  {/* 1. 项目名称 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      项目名称 <span className="text-[#fa541c]">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="请输入"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                    />
                  </div>

                  {/* 2. 标签 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      标签
                    </label>
                    <div ref={tagDropdownRef} className="relative w-full text-[13px]">
                      <div
                        onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                        className={cn(
                          "min-h-[38px] w-full border rounded px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all text-[#262626] bg-white cursor-pointer select-none",
                          isTagDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        {formTags.length === 0 ? (
                          <span className="text-neutral-400 select-none">请选择项目标签</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 items-center w-full pr-8">
                            {formTags.map(tag => {
                              const style = getTagStyle(tag);
                              return (
                                <span
                                  key={tag}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold border transition-all animate-fade-in",
                                    style.bg,
                                    style.text,
                                    style.border
                                  )}
                                >
                                  <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)}></span>
                                  <span>{tag}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormTags(formTags.filter(t => t !== tag));
                                    }}
                                    className="hover:bg-black/10 rounded-[4px] p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center border-0 bg-transparent"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                        
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                          <ChevronDown 
                            className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isTagDropdownOpen && "rotate-180")} 
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      {isTagDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                            {availableTagsList.map(tag => {
                              const isSelected = formTags.includes(tag);
                              return (
                                <div
                                  key={tag}
                                  onClick={() => {
                                    if (isSelected) {
                                      setFormTags(formTags.filter(t => t !== tag));
                                    } else {
                                      setFormTags([...formTags, tag]);
                                    }
                                  }}
                                  className={cn(
                                    "px-4 py-2.5 text-left text-[13px] transition-colors cursor-pointer flex items-center justify-between",
                                    isSelected 
                                      ? "bg-orange-50 text-[#fa541c] font-bold"
                                      : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                                  )}
                                >
                                  <span className="font-medium">{tag}</span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-[#fa541c]" strokeWidth={2.5} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. 项目描述 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      项目描述 <span className="text-[#fa541c]">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="请输入"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                    />
                  </div>

                  {/* 4. 项目图片 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-1.5">
                      项目图片 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {defaultCovers.map((cover, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedCover(cover)}
                          className={cn(
                            "aspect-[5/2] rounded-[4px] overflow-hidden border-2 transition-all relative select-none cursor-pointer hover:border-[#fa541c]/50 hover:scale-[1.02]",
                            selectedCover === cover 
                              ? "border-[#fa541c] shadow-md shadow-orange-500/10 scale-[1.02]" 
                              : "border-transparent"
                          )}
                        >
                          <img src={cover} alt={`cover-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {selectedCover === cover && (
                            <div className="absolute top-2 right-2 bg-[#fa541c] text-white rounded-full p-0.5 shadow-md flex items-center justify-center w-5 h-5 animate-in zoom-in-50 duration-150">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. 项目介绍 (富文本编辑区域样式) */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      项目介绍 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="border border-neutral-200 rounded overflow-hidden flex flex-col bg-white w-full">
                      {/* Rich Text Toolbar */}
                      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-neutral-200 bg-neutral-50/50 select-none">
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="加粗"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="斜体"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-[#fa541c] border-0 bg-transparent cursor-pointer" title="文本颜色"><Type className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="字体大小"><span className="text-[10px] font-bold font-serif leading-none relative top-[-0.5px]">Tt</span></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="无序列表"><List className="w-3.5 h-3.5" /></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="左对齐"><AlignLeft className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="居中"><AlignCenter className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="右对齐"><AlignRight className="w-3.5 h-3.5" /></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="撤销"><Undo2 className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="重做"><Redo2 className="w-3.5 h-3.5" /></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1 flex-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500 border-0 bg-transparent cursor-pointer" title="全屏"><Maximize2 className="w-3.5 h-3.5" /></button>
                      </div>
                      
                      {/* Rich Text Editor Textarea */}
                      <textarea 
                        placeholder="请输入"
                        value={formIntroduction}
                        onChange={(e) => setFormIntroduction(e.target.value)}
                        disabled={modalMode === 'view'}
                        className="w-full min-h-[160px] p-4 text-[13px] focus:outline-none resize-none leading-relaxed text-[#262626] disabled:bg-neutral-50 disabled:text-neutral-500 border-0"
                      />
                    </div>
                  </div>

                </div>
              )}
              {activeFormTab === 'env' && (
                <div className="space-y-6 animate-fade-in py-2">
                  
                  {/* 1. 选择资源池 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      选择资源池 <span className="text-[#fa541c]">*</span>
                    </label>
                    <CustomSelect
                      value={currentResourcePool}
                      disabled={modalMode === 'view'}
                      onChange={(val) => {
                        const pool = val as any;
                        const updated = formEnvironments.map(env => {
                          const images = env.type === '容器' ? CONTAINER_IMAGES[pool as '天翼云资源池1' | '上海园区资源池'] : VM_IMAGES[pool as '天翼云资源池1' | '上海园区资源池'];
                          return {
                            ...env,
                            resourcePool: pool,
                            image: images?.[0] || env.image
                          };
                        });
                        setFormEnvironments(updated);
                      }}
                      options={[
                        { value: '资源池1', label: '资源池1' },
                        { value: '天翼云资源池1', label: '天翼云资源池1' },
                        { value: '上海园区资源池', label: '上海园区资源池' }
                      ]}
                    />
                  </div>

                  {/* 2. 选择环境类型 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      选择环境类型 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="flex items-center gap-6 text-[13px]">
                      {[
                        { value: '容器', label: '容器' },
                        { value: '虚机', label: '云主机' }
                      ].map(opt => (
                        <label 
                          key={opt.value} 
                          className={cn(
                            "flex items-center gap-2 select-none",
                            modalMode !== 'view' ? "cursor-pointer" : "cursor-not-allowed text-neutral-400"
                          )}
                        >
                          <input
                            type="radio"
                            name="envType"
                            value={opt.value}
                            checked={currentEnvType === opt.value}
                            disabled={modalMode === 'view'}
                            onChange={() => handleChangeEnvType(opt.value as any)}
                            className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                          />
                          <span className="font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {currentEnvType === '容器' && (
                    <>
                      {/* 3. 源仓库地址 & Mode Selector (同一行) */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          源仓库地址 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          {[
                            { value: 'manual', label: '手动添加' },
                            { value: 'upload', label: '本地文件上传' }
                          ].map(opt => (
                            <label 
                              key={opt.value} 
                              className={cn(
                                "flex items-center gap-2 select-none",
                                modalMode !== 'view' ? "cursor-pointer" : "cursor-not-allowed text-neutral-400"
                              )}
                            >
                              <input
                                type="radio"
                                name="repoUploadMode"
                                value={opt.value}
                                checked={repoUploadMode === opt.value}
                                disabled={modalMode === 'view'}
                                onChange={() => {
                                  setRepoUploadMode(opt.value as any);
                                  setFormSourceRepoUrl('');
                                }}
                                className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                              />
                              <span className="font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Mode-specific Controls (对齐右侧) */}
                      <div className="grid grid-cols-[100px_1fr] gap-4 animate-in fade-in duration-200">
                        <div />
                        <div className="w-full">
                          {repoUploadMode === 'manual' ? (
                            <input
                              type="text"
                              placeholder="请输入源仓库地址 (如: git@github.com:... 或 https://...)"
                              value={formSourceRepoUrl}
                              disabled={modalMode === 'view'}
                              onChange={(e) => setFormSourceRepoUrl(e.target.value)}
                              className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626] disabled:bg-neutral-50 disabled:text-neutral-500 font-mono"
                            />
                          ) : (
                            <div className="space-y-2.5 w-full">
                              <input
                                type="file"
                                id="local-repo-file-upload"
                                accept=".zip,.tar.gz,.tgz,.rar"
                                className="hidden"
                                disabled={modalMode === 'view'}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFormSourceRepoUrl(file.name);
                                    showToast(`已选择本地文件: ${file.name}`);
                                  }
                                }}
                              />
                              
                              {modalMode !== 'view' ? (
                                <label
                                  htmlFor="local-repo-file-upload"
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                      setFormSourceRepoUrl(file.name);
                                      showToast(`已通过拖拽选择文件: ${file.name}`);
                                    }
                                  }}
                                  className="flex flex-col items-center justify-center border border-dashed border-neutral-300 hover:border-[#fa541c]/50 bg-neutral-50/10 hover:bg-neutral-50/30 rounded-[8px] p-6 cursor-pointer transition-all gap-2 text-center"
                                >
                                  <Upload className="w-6 h-6 text-[#fa541c]" strokeWidth={1.5} />
                                  <span className="text-[13px] text-[#262626] font-bold">点击选择或拖拽源码文件上传</span>
                                  <span className="text-[11px] text-neutral-400">单文件上限 100MB</span>
                                </label>
                              ) : (
                                <div className="flex flex-col items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400 rounded-[8px] p-6 gap-2 text-center select-none cursor-not-allowed">
                                  <Upload className="w-6 h-6 text-neutral-300" strokeWidth={1.5} />
                                  <span className="text-[13px] font-bold">已上传的源码文件</span>
                                </div>
                              )}

                              {formSourceRepoUrl && (
                                <div className="flex items-center justify-between text-[12px] text-green-700 bg-green-50 border border-green-200 px-3.5 py-2 rounded-[4px] font-bold animate-in fade-in duration-200">
                                  <span className="truncate flex items-center gap-1.5">
                                    <span>✓ 已就绪:</span>
                                    <span className="font-mono">{formSourceRepoUrl}</span>
                                  </span>
                                  {modalMode !== 'view' && (
                                    <button
                                      type="button"
                                      onClick={() => setFormSourceRepoUrl('')}
                                      className="text-neutral-400 hover:text-red-500 ml-2 cursor-pointer bg-transparent border-0 font-bold"
                                    >
                                      清除
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. 创建方式 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          创建方式
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          {[
                            { value: 'template', label: '模板创建' },
                            { value: 'custom', label: '自定义' }
                          ].map(opt => (
                            <label 
                              key={opt.value} 
                              className={cn(
                                "flex items-center gap-2 select-none",
                                modalMode !== 'view' ? "cursor-pointer" : "cursor-not-allowed text-neutral-400"
                              )}
                            >
                              <input
                                type="radio"
                                name="creationMethod"
                                value={opt.value}
                                checked={formCreationMethod === opt.value}
                                disabled={modalMode === 'view'}
                                onChange={() => setFormCreationMethod(opt.value as any)}
                                className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                              />
                              <span className="font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Creation Details container depending on selection */}
                  {(currentEnvType === '虚机' || formCreationMethod === 'custom') ? (
                    /* 4b. 自定义 Details */
                    <div className="border border-neutral-200 rounded p-5 bg-white space-y-6 animate-fade-in">
                      
                      {/* Tab Row (容器1, 容器2 or 云主机1, 云主机2) */}
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-px">
                        <div className="flex gap-1 overflow-x-auto">
                          {formEnvironments.map((env, idx) => (
                            <div key={env.id} className="relative group flex items-center">
                              <button
                                type="button"
                                onClick={() => setActiveEnvIdx(idx)}
                                className={cn(
                                  "px-5 py-2 text-xs font-bold rounded-[4px]-t transition-all cursor-pointer border border-b-0 border-neutral-200 flex items-center gap-2",
                                  activeEnvIdx === idx
                                    ? "bg-[#fa541c] text-white border-[#fa541c] font-black"
                                    : "bg-white text-[#fa541c] border-[#fa541c]/50 hover:bg-orange-50/20"
                                )}
                              >
                                <span>{currentEnvType === '容器' ? `容器${idx + 1}` : `云主机${idx + 1}`}</span>
                                {formEnvironments.length > 1 && modalMode !== 'view' && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = formEnvironments.filter((_, i) => i !== idx);
                                      setFormEnvironments(updated);
                                      setActiveEnvIdx(prev => Math.max(0, prev - 1));
                                      showToast(`已删除${currentEnvType === '容器' ? '容器' : '云主机'}实例`);
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

                        {/* Add button */}
                        {modalMode !== 'view' && (
                          <button
                            type="button"
                            onClick={() => {
                              const newEnv: EnvConfig = currentEnvType === '容器' 
                                ? {
                                    id: 'env-' + Date.now(),
                                    resourcePool: currentResourcePool as any,
                                    type: '容器',
                                    cpuCores: '2',
                                    memoryGB: '4',
                                    gpu: { power: '无', vram: '0', count: '0', model: '4090' },
                                    image: CONTAINER_IMAGES[currentResourcePool as '天翼云资源池1' | '上海园区资源池']?.[0] || 'ctyun-python:3.10-slim-cpu',
                                    envVariables: [],
                                    startCommand: 'python main.py'
                                  }
                                : {
                                    id: 'env-' + Date.now(),
                                    resourcePool: currentResourcePool as any,
                                    type: '虚机',
                                    vmSpecType: 'custom',
                                    selectedSpec: VM_SPECS[0].value,
                                    cpuCores: '2',
                                    memoryGB: '8',
                                    gpu: { power: '无', vram: '0', count: '0', model: '4090' },
                                    image: VM_IMAGES[currentResourcePool as '天翼云资源池1' | '上海园区资源池']?.[0] || 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
                                    storage: { type: 'SSD', systemDisk: '40', dataType: 'SSD', dataDisk: '100' },
                                    network: { vpc: 'vpc-default', subnet: 'subnet-1' },
                                    vncType: 'novnc'
                                  };
                              setFormEnvironments([...formEnvironments, newEnv]);
                              setActiveEnvIdx(formEnvironments.length);
                              showToast(`已添加新${currentEnvType === '容器' ? '容器' : '云主机'}实例`);
                            }}
                            className="text-[#fa541c] hover:text-[#e84a15] text-[13px] font-bold cursor-pointer flex items-center gap-1 bg-transparent border-0 rounded-[4px]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{currentEnvType === '容器' ? '添加容器' : '添加云主机'}</span>
                          </button>
                        )}
                      </div>

                      {/* Active Instance Form Content */}
                      {formEnvironments[activeEnvIdx] && (() => {
                        const activeEnv = formEnvironments[activeEnvIdx];
                        const imagesList = activeEnv.type === '容器' 
                          ? CONTAINER_IMAGES[activeEnv.resourcePool as '天翼云资源池1' | '上海园区资源池'] || ['ctyun-python:3.10-slim-cpu']
                          : VM_IMAGES[activeEnv.resourcePool as '天翼云资源池1' | '上海园区资源池'] || ['ctyun-ubuntu-22.04-server-x86_64.qcow2'];
                        
                        return (
                          <div className="space-y-6">
                            
                            {/* 选择镜像 */}
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                              <label className="text-[13px] font-bold text-[#262626] text-right">
                                选择镜像 <span className="text-[#fa541c]">*</span>
                              </label>
                              <CustomSelect
                                value={activeEnv.image}
                                disabled={modalMode === 'view'}
                                onChange={(val) => {
                                  const updated = [...formEnvironments];
                                  updated[activeEnvIdx].image = val;
                                  setFormEnvironments(updated);
                                }}
                                options={imagesList.map(img => ({ value: img, label: img }))}
                                className="font-mono"
                              />
                            </div>

                            {/* 算力配置 Container */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold text-[#262626]">
                                  算力配置 <span className="text-[#fa541c]">*</span>
                                </span>
                                
                                {activeEnv.type === '虚机' && (
                                  <div className="flex bg-neutral-100 rounded p-0.5 border border-neutral-200 max-w-max">
                                    {[
                                      { key: 'spec', label: '规格选择' },
                                      { key: 'custom', label: '自定义资源' }
                                    ].map(opt => (
                                      <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => {
                                          const updated = [...formEnvironments];
                                          updated[activeEnvIdx].vmSpecType = opt.key as any;
                                          setFormEnvironments(updated);
                                        }}
                                        className={cn(
                                          "px-3 py-1 text-center text-[11px] rounded-[4px] transition-all cursor-pointer font-bold border-0",
                                          activeEnv.vmSpecType === opt.key 
                                            ? "bg-white text-[#fa541c] shadow-sm"
                                            : "text-neutral-500 hover:text-neutral-800"
                                        )}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {activeEnv.type === '虚机' && activeEnv.vmSpecType === 'spec' ? (
                                /* VM SPEC TYPE */
                                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                  <label className="text-[13px] text-neutral-550 text-right">选择规格</label>
                                  <CustomSelect
                                    value={activeEnv.selectedSpec || ''}
                                    disabled={modalMode === 'view'}
                                    onChange={(val) => {
                                      const updated = [...formEnvironments];
                                      updated[activeEnvIdx].selectedSpec = val;
                                      setFormEnvironments(updated);
                                    }}
                                    options={VM_SPECS}
                                  />
                                </div>
                              ) : (
                                /* CUSTOM CPU/MEM/GPU CONFIG */
                                <div className="space-y-4">
                                  {/* CPU and Memory Row */}
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                      <span className="text-[13px] text-neutral-550 text-right pr-3">CPU</span>
                                      <input
                                        type="text"
                                        placeholder="请输入"
                                        value={activeEnv.cpuCores || '2'}
                                        disabled={modalMode === 'view'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[activeEnvIdx].cpuCores = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626]"
                                      />
                                      <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">核</span>
                                    </div>

                                    <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                      <span className="text-[13px] text-neutral-550 text-right pr-3">内存</span>
                                      <input
                                        type="text"
                                        placeholder="请输入"
                                        value={activeEnv.memoryGB || '8'}
                                        disabled={modalMode === 'view'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[activeEnvIdx].memoryGB = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626]"
                                      />
                                      <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">GB</span>
                                    </div>
                                  </div>

                                  {/* GPU Model and count row */}
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                      <span className="text-[13px] text-neutral-550 text-right pr-3">GPU型号</span>
                                      <CustomSelect
                                        value={activeEnv.gpu?.model || '4090'}
                                        disabled={modalMode === 'view'}
                                        onChange={(val) => {
                                          const updated = [...formEnvironments];
                                          if (!updated[activeEnvIdx].gpu) updated[activeEnvIdx].gpu = { power: '无', vram: '0', count: '0' };
                                          updated[activeEnvIdx].gpu!.model = val;
                                          setFormEnvironments(updated);
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
                                      <span className="text-[13px] text-neutral-550 text-right pr-3">GPU</span>
                                      <input
                                        type="text"
                                        placeholder="请输入"
                                        value={activeEnv.gpu?.count || '0'}
                                        disabled={modalMode === 'view' || activeEnv.gpu?.model === '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          if (!updated[activeEnvIdx].gpu) updated[activeEnvIdx].gpu = { power: '无', vram: '0', count: '0' };
                                          updated[activeEnvIdx].gpu!.count = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] disabled:bg-neutral-50"
                                      />
                                      <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">张</span>
                                    </div>
                                  </div>

                                  {/* GPU Power and VRAM (Only for Containers as per image 2) */}
                                  {activeEnv.type === '容器' && (
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                        <span className="text-[13px] text-neutral-550 text-right pr-3">算力</span>
                                        <input
                                          type="text"
                                          placeholder="请输入"
                                          value={activeEnv.gpu?.power || '100'}
                                          disabled={modalMode === 'view' || activeEnv.gpu?.model === '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            if (!updated[activeEnvIdx].gpu) updated[activeEnvIdx].gpu = { power: '无', vram: '0', count: '0' };
                                            updated[activeEnvIdx].gpu!.power = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] disabled:bg-neutral-50"
                                        />
                                        <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">%</span>
                                      </div>

                                      <div className="grid grid-cols-[80px_1fr_32px] items-center">
                                        <span className="text-[13px] text-neutral-550 text-right pr-3">显存</span>
                                        <input
                                          type="text"
                                          placeholder="请输入"
                                          value={activeEnv.gpu?.vram || '24'}
                                          disabled={modalMode === 'view' || activeEnv.gpu?.model === '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            if (!updated[activeEnvIdx].gpu) updated[activeEnvIdx].gpu = { power: '无', vram: '0', count: '0' };
                                            updated[activeEnvIdx].gpu!.vram = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-[#262626] disabled:bg-neutral-50"
                                        />
                                        <span className="text-[13px] text-[#262626] font-bold pl-2 shrink-0">GB</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* CONTAINER specific configurations (环境变量, 启动命令) */}
                            {activeEnv.type === '容器' && (
                              <div className="space-y-6">
                                {/* 环境变量配置 */}
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                                    <span className="text-[13px] font-bold text-[#262626]">
                                      环境变量配置 <span className="text-[#fa541c]">*</span>
                                    </span>
                                    {modalMode !== 'view' && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...formEnvironments];
                                          if (!updated[activeEnvIdx].envVariables) updated[activeEnvIdx].envVariables = [];
                                          updated[activeEnvIdx].envVariables!.push({ key: '', value: '' });
                                          setFormEnvironments(updated);
                                        }}
                                        className="text-[#fa541c] hover:text-[#e84a15] text-xs font-bold bg-transparent border-0 cursor-pointer flex items-center gap-0.5 rounded-[4px]"
                                      >
                                        <Plus className="w-3 h-3" /> 添加变量
                                      </button>
                                    )}
                                  </div>

                                  <div className="space-y-2.5">
                                    {activeEnv.envVariables && activeEnv.envVariables.length > 0 ? (
                                      activeEnv.envVariables.map((variable, vIdx) => (
                                        <div key={vIdx} className="flex gap-2 items-center">
                                          <input
                                            type="text"
                                            placeholder="key"
                                            value={variable.key}
                                            disabled={modalMode === 'view'}
                                            onChange={(e) => {
                                              const updated = [...formEnvironments];
                                              updated[activeEnvIdx].envVariables![vIdx].key = e.target.value;
                                              setFormEnvironments(updated);
                                            }}
                                            className="flex-1 text-[13px] border border-neutral-200 rounded px-3 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-[#262626]"
                                          />
                                          <span className="text-neutral-400 font-bold select-none">=</span>
                                          <input
                                            type="text"
                                            placeholder="Value"
                                            value={variable.value}
                                            disabled={modalMode === 'view'}
                                            onChange={(e) => {
                                              const updated = [...formEnvironments];
                                              updated[activeEnvIdx].envVariables![vIdx].value = e.target.value;
                                              setFormEnvironments(updated);
                                            }}
                                            className="flex-1 text-[13px] border border-neutral-200 rounded px-3 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-[#262626]"
                                          />
                                          {modalMode !== 'view' && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = [...formEnvironments];
                                                updated[activeEnvIdx].envVariables = updated[activeEnvIdx].envVariables!.filter((_, i) => i !== vIdx);
                                                setFormEnvironments(updated);
                                              }}
                                              className="text-neutral-450 hover:text-red-500 p-1 cursor-pointer border-0 bg-transparent flex items-center rounded-[4px]"
                                            >
                                              <X className="w-4 h-4" />
                                            </button>
                                          )}
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
                                    value={activeEnv.startCommand || ''}
                                    disabled={modalMode === 'view'}
                                    onChange={(e) => {
                                      const updated = [...formEnvironments];
                                      updated[activeEnvIdx].startCommand = e.target.value;
                                      setFormEnvironments(updated);
                                    }}
                                    className="w-full min-h-[80px] p-3 text-[13px] border border-neutral-200 rounded focus:outline-none focus:border-[#fa541c] resize-none leading-relaxed text-[#262626] font-mono"
                                  />
                                </div>
                              </div>
                            )}

                            {/* VM specific configurations (存储配置, 网络配置, VNC类型) */}
                            {activeEnv.type === '虚机' && (
                              <div className="space-y-6">
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
                                            value={activeEnv.storage?.type || 'SSD'}
                                            disabled={modalMode === 'view'}
                                            onChange={(val) => {
                                              const updated = [...formEnvironments];
                                              if (!updated[activeEnvIdx].storage) updated[activeEnvIdx].storage = { type: 'SSD', systemDisk: '40', dataType: 'SSD', dataDisk: '100' };
                                              updated[activeEnvIdx].storage!.type = val;
                                              setFormEnvironments(updated);
                                            }}
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
                                            value={activeEnv.storage?.systemDisk || '40'}
                                            disabled={modalMode === 'view'}
                                            onChange={(e) => {
                                              const updated = [...formEnvironments];
                                              if (!updated[activeEnvIdx].storage) updated[activeEnvIdx].storage = { type: 'SSD', systemDisk: '40', dataType: 'SSD', dataDisk: '100' };
                                              updated[activeEnvIdx].storage!.systemDisk = e.target.value;
                                              setFormEnvironments(updated);
                                            }}
                                            className="w-full border border-neutral-200 rounded px-2.5 py-1.5 text-[13px] text-[#262626]"
                                          />
                                          <span className="text-[13px] text-[#262626] font-bold shrink-0">GB</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 数据盘 */}
                                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                                      <span className="text-[13px] text-neutral-550 text-right">数据盘</span>
                                      <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 flex-1">
                                          <span className="text-xs text-neutral-400 shrink-0">存储类型</span>
                                          <CustomSelect
                                            value={activeEnv.storage?.dataType || 'SSD'}
                                            disabled={modalMode === 'view'}
                                            onChange={(val) => {
                                              const updated = [...formEnvironments];
                                              if (!updated[activeEnvIdx].storage) updated[activeEnvIdx].storage = { type: 'SSD', systemDisk: '40', dataType: 'SSD', dataDisk: '100' };
                                              updated[activeEnvIdx].storage!.dataType = val;
                                              setFormEnvironments(updated);
                                            }}
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
                                            value={activeEnv.storage?.dataDisk || '100'}
                                            disabled={modalMode === 'view'}
                                            onChange={(e) => {
                                              const updated = [...formEnvironments];
                                              if (!updated[activeEnvIdx].storage) updated[activeEnvIdx].storage = { type: 'SSD', systemDisk: '40', dataType: 'SSD', dataDisk: '100' };
                                              updated[activeEnvIdx].storage!.dataDisk = e.target.value;
                                              setFormEnvironments(updated);
                                            }}
                                            className="w-full border border-neutral-200 rounded px-2.5 py-1.5 text-[13px] text-[#262626]"
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
                                          className="w-12 text-center bg-neutral-50 border border-neutral-200 rounded py-1.5 text-[13px] text-neutral-500 cursor-not-allowed select-none focus:outline-none"
                                        />
                                        <span className="text-neutral-400 font-bold">.</span>
                                        
                                        <select
                                          value={(() => {
                                            const { octet3 } = parseSubnet(activeEnv.network?.subnet || 'subnet-1');
                                            return octet3;
                                          })()}
                                          disabled={modalMode === 'view'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const currentSubnet = activeEnv.network?.subnet || 'subnet-1';
                                            const { mask } = parseSubnet(currentSubnet);
                                            const updated = [...formEnvironments];
                                            if (!updated[activeEnvIdx].network) updated[activeEnvIdx].network = { vpc: 'vpc-default', subnet: '' };
                                            updated[activeEnvIdx].network!.subnet = `192.168.${val}.0/${mask}`;
                                            setFormEnvironments(updated);
                                          }}
                                          className="px-2 py-1.5 border border-neutral-200 rounded text-[13px] text-[#262626] bg-white focus:outline-none focus:border-[#fa541c] disabled:bg-neutral-50 disabled:text-neutral-500 cursor-pointer min-w-[50px] text-center"
                                        >
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                        </select>
                                        <span className="text-neutral-400 font-bold">.</span>
                                        
                                        <input
                                          type="text"
                                          value="0"
                                          disabled
                                          className="w-12 text-center bg-neutral-50 border border-neutral-200 rounded py-1.5 text-[13px] text-neutral-500 cursor-not-allowed select-none focus:outline-none"
                                        />
                                        <span className="text-neutral-400 font-bold">/</span>
                                        
                                        <select
                                          value={(() => {
                                            const { mask } = parseSubnet(activeEnv.network?.subnet || 'subnet-1');
                                            return mask;
                                          })()}
                                          disabled={modalMode === 'view'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const currentSubnet = activeEnv.network?.subnet || 'subnet-1';
                                            const { octet3 } = parseSubnet(currentSubnet);
                                            const updated = [...formEnvironments];
                                            if (!updated[activeEnvIdx].network) updated[activeEnvIdx].network = { vpc: 'vpc-default', subnet: '' };
                                            updated[activeEnvIdx].network!.subnet = `192.168.${octet3}.0/${val}`;
                                            setFormEnvironments(updated);
                                          }}
                                          className="px-2 py-1.5 border border-neutral-200 rounded text-[13px] text-[#262626] bg-white focus:outline-none focus:border-[#fa541c] disabled:bg-neutral-50 disabled:text-neutral-500 cursor-pointer min-w-[58px] text-center"
                                        >
                                          <option value="16">16</option>
                                          <option value="24">24</option>
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
                                      <label 
                                        key={opt.value} 
                                        className={cn(
                                          "flex items-center gap-2 select-none",
                                          modalMode !== 'view' ? "cursor-pointer" : "cursor-not-allowed text-neutral-400"
                                        )}
                                      >
                                        <input
                                          type="radio"
                                          name={`vncType-${activeEnv.id}`}
                                          value={opt.value}
                                          checked={(activeEnv.vncType || 'novnc').toLowerCase() === opt.value.toLowerCase()}
                                          disabled={modalMode === 'view'}
                                          onChange={() => {
                                            const updated = [...formEnvironments];
                                            updated[activeEnvIdx].vncType = opt.value as any;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                                        />
                                        <span className="font-medium">{opt.label}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                              </div>
                            )}

                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* 4a. 模板创建 Details */
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                      <div></div>
                      <CustomSelect
                        value={formTemplateValue}
                        disabled={modalMode === 'view'}
                        onChange={(val) => setFormTemplateValue(val)}
                        options={[
                          { value: '通用模板', label: '通用模板' },
                          { value: 'AI模型开发模板', label: 'AI模型开发模板' },
                          { value: '数据挖掘算法模板', label: '数据挖掘算法模板' },
                          { value: 'Java微服务模板', label: 'Java微服务模板' }
                        ]}
                      />
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              {activeFormTab === 'basic' ? (
                <>
                  <Button 
                    onClick={() => setShowNewProjectModal(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => setActiveFormTab('env')} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                  >
                    下一步
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setActiveFormTab('basic')} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold mr-auto"
                  >
                    上一步
                  </Button>
                  <Button 
                    onClick={() => setShowNewProjectModal(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => handleSave()} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                  >
                    保存
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
