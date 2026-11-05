import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  HelpCircle, 
  X, 
  ArrowLeft, 
  Save, 
  Check, 
  Cpu, 
  GitBranch, 
  Terminal, 
  Layers, 
  Briefcase, 
  Tag, 
  ChevronDown, 
  BookOpen, 
  FileCode, 
  BarChart3, 
  Brain, 
  Settings, 
  GitFork, 
  Trash2, 
  Edit, 
  Copy, 
  Upload, 
  AlertCircle, 
  ChevronRight,
  FolderOpen,
  Info,
  Loader2,
  Bold,
  Italic,
  Type,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DatasetSyncSelector, { type SelectedDataset } from '@/components/DatasetSyncSelector';
import ProjectChecksDrawer from '@/components/ProjectChecksDrawer';
import { useLocation, useNavigate } from 'react-router-dom';

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

interface Project {
  datasets?: SelectedDataset[];
  id: number;
  name: string;
  desc: string;
  type: '编程项目' | '数据分析项目' | 'AI项目' | '运维项目';
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  gitUrl: string;
  baseImage: string;
  resources: { cpu: string; memory: string; gpu: string };
  scope: { positions: string[]; skills: string[]; scenarios: string[] };
  status: '草稿' | '已发布';
  updateTime: string;
  image: string;
  courseId?: number | null;
  publicApplyStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  tags?: string[];
  environments?: EnvConfig[];
  range?: '私有' | '租户' | '平台';
  auditStatus?: '待审核' | '已审核' | '已驳回' | '未审核' | '已通过';
  creator?: string;
  isAvailable?: boolean;
  introduction?: string;
}

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
  return {
    name: tagName,
    bg: 'bg-neutral-50',
    text: 'text-neutral-600',
    border: 'border-neutral-200',
    dot: 'bg-neutral-400'
  };
};

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
                  <span className="font-medium truncate">{opt.label}</span>
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

interface TeacherProjectsProps {
  embedded?: boolean;
  defaultCourseId?: number | null;
  defaultCourseName?: string | null;
  onBackToCourses?: () => void;
}

export default function TeacherProjects({
  embedded = false,
  defaultCourseId = null,
  defaultCourseName = null,
  onBackToCourses
}: TeacherProjectsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Route states / Props fallback
  const incomingCourseId = defaultCourseId || location.state?.courseId;
  const incomingCourseName = defaultCourseName || location.state?.courseName;

  // Default covers for premium look
  const defaultCovers = [
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cloud_1779333396845.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cyber_1779333412582.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_dev_1779333430898.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ml_1779333449102.png`,
  ];

  // View states (List or Modals)
  const [isModalOpen, setIsModalOpen] = useState(() => {
    const searchStr = location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.search);
    const searchParams = new URLSearchParams(searchStr);
    return searchParams.get('create') === 'true';
  });
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Search & Filter (Course Module Style)
  const [searchQuery, setSearchQuery] = useState('');
  const [projectTab, setProjectTab] = useState<'all' | '已发布' | '草稿'>('all'); // Match courseTab style
  const [expandedTagProjectIds, setExpandedTagProjectIds] = useState<number[]>([]);
  const [checksProject, setChecksProject] = useState<Project | null>(null);

  // Form setup wizard active tab inside Modal
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'env'>('basic');

  // Form states
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<'编程项目' | '数据分析项目' | 'AI项目' | '运维项目'>('编程项目');
  const [formDifficulty, setFormDifficulty] = useState<'初级' | '中级' | '高级'>('中级');
  const [formDuration, setFormDuration] = useState('8');
  const [selectedCover, setSelectedCover] = useState(defaultCovers[0]);
  const [formDatasets, setFormDatasets] = useState<SelectedDataset[]>([]);
  
  // New States for tags and environment configs
  const [formTags, setFormTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [availableTagsList, setAvailableTagsList] = useState<string[]>([
    'AI', '容器', '虚机', 'Java', 'Python', '数据分析', '运维', 'DevOps', '大模型', '微服务'
  ]);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const [formEnvironments, setFormEnvironments] = useState<EnvConfig[]>([]);
  const [formIntroduction, setFormIntroduction] = useState('');

  // Environment configurations states
  const [formSourceRepoUrl, setFormSourceRepoUrl] = useState('');
  const [repoUploadMode, setRepoUploadMode] = useState<'manual' | 'upload'>('manual');
  const [formCreationMethod, setFormCreationMethod] = useState<'template' | 'custom'>('template');
  const [formTemplateValue, setFormTemplateValue] = useState('通用模板');
  const [activeEnvIdx, setActiveEnvIdx] = useState(0);

  const currentResourcePool = formEnvironments[0]?.resourcePool || '资源池1';
  const currentEnvType = formEnvironments[0]?.type || '容器';

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
          image: CONTAINER_IMAGES[env.resourcePool]?.[0] || 'ctyun-python:3.10-slim-cpu',
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
          image: VM_IMAGES[env.resourcePool]?.[0] || 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
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
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);

  // Floating notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Application for Public State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [projectToApply, setProjectToApply] = useState<Project | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [applyTargetAudience, setApplyTargetAudience] = useState('');
  const [applyUsageSuggestion, setApplyUsageSuggestion] = useState('');
  const [applyRange, setApplyRange] = useState<'租户' | '平台'>('租户');
  const [isApplying, setIsApplying] = useState(false);

  // Off-Shelf State
  const [isOffShelfModalOpen, setIsOffShelfModalOpen] = useState(false);
  const [projectToOffShelf, setProjectToOffShelf] = useState<Project | null>(null);
  const [offShelfReason, setOffShelfReason] = useState('');

  // Action Confirmation Dialog State (Ref Course Module)
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleOffShelfProject = () => {
    if (!offShelfReason.trim()) {
      setToastMessage('请填写下架说明');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (!projectToOffShelf) return;

    setProjectsList(prev => prev.map(p => {
      if (p.id === projectToOffShelf.id) {
        return {
          ...p,
          status: '已下架',
        };
      }
      return p;
    }));
    setToastMessage(`项目「${projectToOffShelf.name}」已成功下架`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsOffShelfModalOpen(false);
    setProjectToOffShelf(null);
    setOffShelfReason('');
  };

  const handleReShelfProject = (proj: Project) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === proj.id) {
        return {
          ...p,
          status: '已发布',
        };
      }
      return p;
    }));
    setToastMessage(`项目「${proj.name}」已重新上架`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock initial dataset with real courseId assignments and default premium covers
  const [projectsList, setProjectsList] = useState<Project[]>([
    {
      id: 6,
      name: '企业级智能应用全栈开发综合实战',
      desc: '涵盖模型应用、数据分析、微服务开发和云原生部署的综合项目',
      type: 'AI项目',
      difficulty: '高级',
      duration: '40',
      gitUrl: '',
      baseImage: 'pytorch/pytorch:2.1.0-cuda12.1',
      resources: { cpu: '4 核', memory: '16 GB', gpu: 'NVIDIA T4' },
      scope: { positions: [], skills: [], scenarios: [] },
      status: '草稿',
      range: '私有',
      auditStatus: '未审核',
      updateTime: '2026/11/04 11:00',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_dev_1779333430898.png`,
      courseId: 1,
      tags: ['AI', 'Python', '大模型', '数据分析', '容器', '虚机', 'Java', '微服务', 'DevOps', '运维'],
      creator: '张老师',
      isAvailable: false,
      environments: [{ id: 'env-6', resourcePool: '上海园区资源池', type: '容器', image: 'sh-pytorch:2.2.0-cuda12.1-gpu' }],
    },
    {
      id: 5,
      name: '基于大语言模型与多模态检索增强生成的企业级智能知识库构建及云原生高可用部署综合实战项目——从数据处理、模型微调到应用开发与运维全流程实践',
      desc: '覆盖数据清洗、模型微调、知识检索、应用开发及云原生部署的综合实战项目',
      type: 'AI项目',
      difficulty: '高级',
      duration: '32',
      gitUrl: '',
      baseImage: 'pytorch/pytorch:2.1.0-cuda12.1',
      resources: { cpu: '4 核', memory: '16 GB', gpu: 'NVIDIA T4' },
      scope: { positions: [], skills: [], scenarios: [] },
      status: '草稿',
      range: '私有',
      auditStatus: '未审核',
      updateTime: '2026/11/04 10:00',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`,
      courseId: 1,
      tags: ['AI', '大模型', '企业级多模态大模型知识库构建与云原生高可用部署全流程综合实战', 'DevOps'],
      creator: '张老师',
      isAvailable: false,
      environments: [{ id: 'env-5', resourcePool: '上海园区资源池', type: '容器', image: 'sh-pytorch:2.2.0-cuda12.1-gpu' }],
    },
    {
      id: 1,
      name: '项目1',
      desc: '基于容器环境的实战开发项目',
      type: 'AI项目',
      difficulty: '高级',
      duration: '16',
      gitUrl: '',
      baseImage: 'pytorch/pytorch:2.1.0-cuda12.1',
      resources: { cpu: '4 核', memory: '16 GB', gpu: 'NVIDIA T4' },
      scope: { positions: [], skills: [], scenarios: [] },
      status: '草稿',
      range: '私有',
      auditStatus: '未审核',
      updateTime: '2026/06/15 17:30',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`,
      courseId: 1,
      tags: ['容器', 'AI'],
      creator: '张老师',
      isAvailable: false,
      environments: [
        {
          id: 'env-1',
          resourcePool: '上海园区资源池',
          type: '容器',
          image: 'sh-pytorch:2.2.0-cuda12.1-gpu',
        }
      ]
    },
    {
      id: 2,
      name: '项目2',
      desc: '基于虚拟机的微服务实训部署',
      type: '编程项目',
      difficulty: '高级',
      duration: '12',
      gitUrl: '',
      baseImage: 'openjdk:17-jdk-alpine',
      resources: { cpu: '2 核', memory: '8 GB', gpu: '无' },
      scope: { positions: [], skills: [], scenarios: [] },
      status: '草稿',
      range: '私有',
      auditStatus: '未审核',
      updateTime: '2026/06/15 17:25',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_dev_1779333430898.png`,
      courseId: 2,
      tags: ['虚机', 'Java'],
      creator: '李老师',
      isAvailable: true,
      environments: [
        {
          id: 'env-2',
          resourcePool: '天翼云资源池1',
          type: '虚机',
          image: 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
        }
      ]
    },
    {
      id: 3,
      name: '项目3',
      desc: '企业租户内的数据特征挖掘工程',
      type: '数据分析项目',
      difficulty: '中级',
      duration: '6',
      gitUrl: '',
      baseImage: 'python:3.10-slim',
      resources: { cpu: '1 核', memory: '4 GB', gpu: '无' },
      scope: { positions: [], skills: [], scenarios: [] },
      status: '已发布',
      range: '租户',
      auditStatus: '已通过',
      updateTime: '2026/06/15 17:20',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`,
      courseId: 1,
      tags: ['容器', '数据分析'],
      creator: '王老师',
      isAvailable: true,
      environments: [
        {
          id: 'env-3',
          resourcePool: '上海园区资源池',
          type: '容器',
          image: 'sh-python:3.11-slim',
        }
      ]
    },
    {
      id: 4,
      name: '项目4',
      desc: '云原生高可用容器平台部署',
      type: '运维项目',
      difficulty: '中级',
      duration: '8',
      gitUrl: '',
      baseImage: 'ubuntu:22.04',
      resources: { cpu: '2 核', memory: '4 GB', gpu: '无' },
      scope: { positions: [], skills: [], scenarios: [] },
      status: '已发布',
      range: '平台',
      auditStatus: '已通过',
      updateTime: '2026/06/15 17:15',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cloud_1779333396845.png`,
      courseId: 3,
      tags: ['虚机', 'DevOps'],
      creator: '刘老师',
      isAvailable: true,
      environments: [
        {
          id: 'env-4',
          resourcePool: '天翼云资源池1',
          type: '虚机',
          image: 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
        }
      ]
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };



  const handleCreateNew = () => {
    setFormDatasets([]);
    setCurrentProjectId(null);
    setFormName('');
    setFormDesc('');
    setFormType('编程项目');
    setFormDifficulty('中级');
    setFormDuration('8');
    setSelectedCover(defaultCovers[0]);
    setFormTags([]);
    setIsTagDropdownOpen(false);
    setFormIntroduction('');
    setFormSourceRepoUrl('https://github.com/opencv/opencv.git');
    setRepoUploadMode('manual');
    setFormCreationMethod('template');
    setFormTemplateValue('通用模板');
    setActiveEnvIdx(0);
    setFormEnvironments([
      {
        id: 'env-' + Date.now(),
        resourcePool: '天翼云资源池1',
        type: '容器',
        sourceFile: '',
        cpuCores: '2',
        memoryGB: '4',
        gpu: { power: '无', vram: '0', count: '0' },
        image: CONTAINER_IMAGES['天翼云资源池1'][0],
        envVariables: [],
        startCommand: 'python main.py'
      }
    ]);
    
    setActiveFormTab('basic');
    setModalMode('create');
    setIsModalOpen(true);
  };

  const hasTriggeredCreate = React.useRef(false);

  useEffect(() => {
    const searchStr = location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.search);
    const searchParams = new URLSearchParams(searchStr);
    const shouldOpen = (location.state as any)?.openCreate || searchParams.get('create') === 'true';
    
    if (shouldOpen && !hasTriggeredCreate.current) {
      hasTriggeredCreate.current = true;
      handleCreateNew();

      if (searchParams.get('create') === 'true') {
        const cleanBase = window.location.pathname + window.location.search;
        const newUrl = cleanBase + '#/teacher?tab=project';
        window.history.replaceState({ activeSubTab: 'project' }, document.title, newUrl);
      }
    }
  }, [location.state, location.search]);

  const handleEditProject = (proj: Project) => {
    setFormDatasets((proj.datasets || []).map(dataset => ({ ...dataset })));
    setCurrentProjectId(proj.id);
    setFormName(proj.name);
    setFormDesc(proj.desc);
    setFormType(proj.type);
    setFormDifficulty(proj.difficulty);
    setFormDuration(proj.duration);
    setSelectedCover(proj.image || defaultCovers[0]);
    setFormTags(proj.tags || []);
    setIsTagDropdownOpen(false);
    setFormIntroduction(proj.introduction || '');
    setFormSourceRepoUrl(proj.gitUrl || 'https://github.com/opencv/opencv.git');
    const isUrl = proj.gitUrl ? (proj.gitUrl.startsWith('http') || proj.gitUrl.startsWith('git@')) : true;
    setRepoUploadMode(isUrl ? 'manual' : 'upload');
    setFormCreationMethod(proj.environments?.[0]?.cpuCores ? 'custom' : 'template');
    setFormTemplateValue('通用模板');
    setActiveEnvIdx(0);
    
    if (proj.environments && proj.environments.length > 0) {
      setFormEnvironments(JSON.parse(JSON.stringify(proj.environments)));
    } else {
      // Fallback for older projects
      const isGpu = proj.resources.gpu && proj.resources.gpu !== '无';
      const defaultEnv: EnvConfig = {
        id: 'env-default-' + Date.now(),
        resourcePool: '天翼云资源池1',
        type: '容器',
        image: proj.baseImage || 'ctyun-python:3.10-slim-cpu',
        cpuCores: proj.resources.cpu.replace(/[^0-9]/g, '') || '2',
        memoryGB: proj.resources.memory.replace(/[^0-9]/g, '') || '4',
        gpu: {
          power: isGpu ? (proj.resources.gpu.includes('T4') ? 'T4' : 'A10G') : '无',
          vram: isGpu ? (proj.resources.gpu.includes('T4') ? '16GB' : '24GB') : '0',
          count: isGpu ? '1' : '0'
        },
        envVariables: [],
        startCommand: 'python main.py'
      };
      setFormEnvironments([defaultEnv]);
    }

    setActiveFormTab('basic');
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSave = (statusToSave?: '草稿' | '已发布') => {
    if (!formName.trim()) {
      showToast('请输入项目名称！');
      return;
    }

    // Set legacy fields for backwards compatibility with list views if any
    const firstEnv = formEnvironments[0];
    const legacyCpu = firstEnv ? (firstEnv.type === '容器' ? `${firstEnv.cpuCores} 核` : (firstEnv.vmSpecType === 'spec' ? '规格' : `${firstEnv.cpuCores} 核`)) : '2 核';
    const legacyMem = firstEnv ? (firstEnv.type === '容器' ? `${firstEnv.memoryGB} GB` : (firstEnv.vmSpecType === 'spec' ? '规格' : `${firstEnv.memoryGB} GB`)) : '4 GB';
    const legacyGpu = firstEnv ? (firstEnv.type === '容器' ? (firstEnv.gpu?.power !== '无' ? firstEnv.gpu?.power || '无' : '无') : (firstEnv.vmSpecType === 'spec' ? '规格' : (firstEnv.gpu?.power !== '无' ? firstEnv.gpu?.power || '无' : '无'))) : '无';

    const existingProj = currentProjectId ? projectsList.find(p => p.id === currentProjectId) : null;
    const finalStatus = statusToSave || (existingProj ? existingProj.status : '草稿');
    const finalRange = existingProj ? (existingProj.range || '私有') : '私有';
    const finalAuditStatus = existingProj ? (existingProj.auditStatus || '待审核') : '待审核';

    const newProjectData: Project = {
      id: currentProjectId ? currentProjectId : Date.now(),
      name: formName,
      desc: formDesc,
      type: formType,
      difficulty: formDifficulty,
      duration: formDuration,
      gitUrl: formSourceRepoUrl,
      baseImage: firstEnv?.image || 'python:3.10-slim',
      resources: {
        cpu: legacyCpu,
        memory: legacyMem,
        gpu: legacyGpu
      },
      scope: {
        positions: [],
        skills: formTags,
        scenarios: []
      },
      status: finalStatus,
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      image: selectedCover,
      datasets: formDatasets.map(dataset => ({ ...dataset })),
      courseId: currentProjectId ? projectsList.find(p => p.id === currentProjectId)?.courseId : (incomingCourseId || undefined),
      tags: formTags,
      environments: formEnvironments,
      range: finalRange,
      auditStatus: finalAuditStatus,
      introduction: formIntroduction
    };

    if (modalMode === 'edit') {
      setProjectsList(projectsList.map(p => p.id === currentProjectId ? newProjectData : p));
      showToast(`成功更新项目「${formName.slice(0, 10)}...」`);
    } else {
      setProjectsList([newProjectData, ...projectsList]);
      showToast(`成功创建项目「${formName.slice(0, 10)}...」并保存`);
    }

    setIsModalOpen(false);
  };


  const handleCopy = (proj: Project) => {
    const copied: Project = {
      ...proj,
      id: Date.now(),
      name: proj.name + ' - 副本',
      status: '草稿',
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      tags: proj.tags ? [...proj.tags] : [],
      environments: proj.environments ? JSON.parse(JSON.stringify(proj.environments)) : []
    };
    setProjectsList([copied, ...projectsList]);
    showToast(`成功复制项目「${proj.name.slice(0, 8)}...」`);
  };

  const handleDelete = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id));
    showToast('项目已成功删除');
  };

  const handlePublish = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, status: '已发布', auditStatus: '已审核' } : p));
    showToast('项目已成功发布');
  };

  const handleCancelPublish = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, status: '草稿', auditStatus: '待审核' } : p));
    showToast('项目已成功取消发布');
  };

  const handleApplyPublic = (proj: Project) => {
    setProjectToApply(proj);
    setApplyRange('租户');
    setApplyUsageSuggestion('');
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!applyUsageSuggestion.trim()) {
      showToast('请填写申请说明');
      return;
    }
    setIsApplying(true);
    setTimeout(() => {
      setProjectsList(projectsList.map(p => 
        p.id === projectToApply?.id ? { ...p, range: applyRange, auditStatus: '已审核', status: '已发布' } : p
      ));
      setIsApplying(false);
      setIsApplyModalOpen(false);
      setApplyUsageSuggestion('');
      showToast('项目已成功公开');
    }, 800);
  };

  const handleToggleAvailable = (id: number, val: boolean) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, isAvailable: val } : p));
    showToast(val ? '项目已启用' : '项目已禁用');
  };

  const handleViewDetails = (proj: Project) => {
    setFormDatasets((proj.datasets || []).map(dataset => ({ ...dataset })));
    setCurrentProjectId(proj.id);
    setFormName(proj.name);
    setFormDesc(proj.desc);
    setFormType(proj.type);
    setFormDifficulty(proj.difficulty);
    setFormDuration(proj.duration);
    setSelectedCover(proj.image || defaultCovers[0]);
    setFormTags(proj.tags || []);
    setIsTagDropdownOpen(false);
    setFormIntroduction(proj.introduction || '');
    setFormSourceRepoUrl(proj.gitUrl || 'https://github.com/opencv/opencv.git');
    const isUrl = proj.gitUrl ? (proj.gitUrl.startsWith('http') || proj.gitUrl.startsWith('git@')) : true;
    setRepoUploadMode(isUrl ? 'manual' : 'upload');
    setFormCreationMethod(proj.environments?.[0]?.cpuCores ? 'custom' : 'template');
    setFormTemplateValue('通用模板');
    setActiveEnvIdx(0);
    
    if (proj.environments && proj.environments.length > 0) {
      setFormEnvironments(JSON.parse(JSON.stringify(proj.environments)));
    } else {
      const isGpu = proj.resources.gpu && proj.resources.gpu !== '无';
      const defaultEnv: EnvConfig = {
        id: 'env-default-' + Date.now(),
        resourcePool: '天翼云资源池1',
        type: '容器',
        image: proj.baseImage || 'ctyun-python:3.10-slim-cpu',
        cpuCores: proj.resources.cpu.replace(/[^0-9]/g, '') || '2',
        memoryGB: proj.resources.memory.replace(/[^0-9]/g, '') || '4',
        gpu: {
          power: isGpu ? (proj.resources.gpu.includes('T4') ? 'T4' : 'A10G') : '无',
          vram: isGpu ? (proj.resources.gpu.includes('T4') ? '16GB' : '24GB') : '0',
          count: isGpu ? '1' : '0'
        },
        envVariables: [],
        startCommand: 'python main.py'
      };
      setFormEnvironments([defaultEnv]);
    }

    setActiveFormTab('basic');
    setModalMode('view');
    setIsModalOpen(true);
  };

  // Filter projects list
  const filteredProjects = projectsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.scope.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = projectTab === 'all' || p.status === projectTab;
    const matchesCourse = !incomingCourseId || p.courseId === incomingCourseId;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const openProjectPreview = (project: Project) => {
    navigate(`/teacher/projects/${project.id}/preview`, {
      state: {
        project: {
          title: project.name,
          desc: project.desc,
          introduction: project.introduction,
          image: project.image,
          tags: project.tags || [],
          difficulty: project.difficulty,
          status: project.status,
          participants: '0',
          rating: 0,
        },
        returnTo: location.pathname + location.search,
        returnState: location.state,
      },
    });
  };

  return (
    <div className={cn("flex flex-col h-full text-left", embedded ? "p-5" : "p-6")}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          <span className="w-2 h-2 rounded-full bg-[#fa541c] animate-pulse"></span>
          <span className="text-[14px] font-medium text-neutral-800">{toastMessage}</span>
        </div>
      )}

      {/* Associated Course Banner */}
      {incomingCourseId && incomingCourseName && (
        <div className="mb-5 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-orange-100 text-[#fa541c] shrink-0">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <div className="text-sm font-bold text-neutral-800">
                当前管理课程：<span className="text-[#fa541c]">{incomingCourseName}</span>
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">
                在此添加或编辑的项目将自动关联到该课程中。
              </div>
            </div>
          </div>
          {onBackToCourses && (
            <Button 
              variant="outline" 
              onClick={onBackToCourses}
              className="border-orange-200 hover:bg-orange-100/50 text-[#fa541c] hover:text-[#e84a15] h-8 text-xs font-bold px-4 rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 返回课程列表
            </Button>
          )}
        </div>
      )}

      {/* TOP CONTROLLER - Styled exactly like Dataset Search & Filter Controls */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索项目名称/技能..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-9 bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={handleCreateNew}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 h-9 text-[13px] shadow-sm shrink-0 border-0 cursor-pointer font-bold flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> 新建项目
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
                  <th className="p-4 font-medium w-[40%]">项目信息</th>
                  <th className="p-4 font-medium w-[9.6%]">创建人</th>
                  <th className="p-4 font-medium w-[9.6%]">环境类型</th>
                  <th className="p-4 font-medium w-[9.6%]">是否可用</th>
                  <th className="p-4 font-medium w-[9.6%]">课程范围</th>
                  <th className="p-4 font-medium w-[9.6%]">审核状态</th>
                  <th className="p-4 font-medium w-[12%]">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proj, index) => (
                  <tr key={proj.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredProjects.length - 1 && "border-b-0")}>
                    {/* 1. 项目信息 (封面 + 名称) */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-neutral-200/60 shadow-xs relative bg-neutral-100">
                          <img 
                            src={proj.image} 
                            alt={proj.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div className="min-w-0 w-full max-w-[440px] whitespace-normal">
                          <button type="button" className="block w-full text-left bg-transparent border-0 p-0 font-medium text-neutral-800 hover:text-[#fa541c] transition-colors cursor-pointer break-words leading-6 line-clamp-2" title={proj.name} onClick={() => openProjectPreview(proj)}>
                            {proj.name}
                          </button>
                          {!!proj.tags?.length && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {(expandedTagProjectIds.includes(proj.id) ? proj.tags : proj.tags.slice(0, 4)).map(tag => {
                                const style = getTagStyle(tag);
                                return (
                                  <span key={tag} title={tag} className={cn("inline-flex items-center gap-1 max-w-[160px] min-w-0 px-2 py-0.5 rounded text-[11px] font-medium border", style.bg, style.text, style.border)}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
                                    <span className="truncate">{tag}</span>
                                  </span>
                                );
                              })}
                              {proj.tags.length > 4 && (
                                <button
                                  type="button"
                                  aria-expanded={expandedTagProjectIds.includes(proj.id)}
                                  aria-label={`${expandedTagProjectIds.includes(proj.id) ? '收起' : '展开'}项目标签`}
                                  onClick={() => setExpandedTagProjectIds(previous => previous.includes(proj.id) ? previous.filter(id => id !== proj.id) : [...previous, proj.id])}
                                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-medium border border-[#ffbb96]/70 bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe7d6] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#fa541c]"
                                >
                                  {expandedTagProjectIds.includes(proj.id) ? '收起' : `+${proj.tags.length - 4}`}
                                  <ChevronDown className={cn("w-3 h-3 transition-transform", expandedTagProjectIds.includes(proj.id) && "rotate-180")} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. 创建人 */}
                    <td className="p-4 text-neutral-600 font-medium">
                      <div className="text-neutral-800 font-medium">{proj.creator || '张老师'}</div>
                    </td>

                    {/* 3. 环境类型 */}
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[12px] font-medium border",
                        (proj.environments?.[0]?.type || '容器') === '容器' 
                          ? "bg-blue-50 text-blue-600 border-blue-200" 
                          : "bg-purple-50 text-purple-600 border-purple-200"
                      )}>
                        {proj.environments?.[0]?.type || '容器'}
                      </span>
                    </td>

                    {/* 4. 是否可用 */}
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border font-medium",
                        proj.isAvailable 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-neutral-50 text-neutral-500 border-neutral-200"
                      )}>
                        {proj.isAvailable ? '可用' : '不可用'}
                      </span>
                    </td>

                    {/* 5. 课程范围 */}
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border font-medium",
                        proj.range === '平台' ? "bg-orange-50 text-orange-600 border-orange-200" :
                        proj.range === '租户' ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                        "bg-neutral-50 text-neutral-500 border-neutral-200"
                      )}>
                        {proj.range || '私有'}
                      </span>
                    </td>

                    {/* 6. 审核状态 */}
                    <td className="p-4">
                      {proj.auditStatus === '待审核' ? (
                        <span className="text-[#fa541c] font-medium">待审核</span>
                      ) : proj.auditStatus === '已审核' || proj.auditStatus === '已通过' ? (
                        <span className="text-emerald-600 font-medium">已通过</span>
                      ) : proj.auditStatus === '已驳回' ? (
                        <span className="text-rose-600 font-medium">已驳回</span>
                      ) : (
                        <span className="text-neutral-400 font-normal">--</span>
                      )}
                    </td>

                    {/* 7. 操作 */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleViewDetails(proj)} 
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium text-[13px] rounded-[4px]"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleApplyPublic(proj)} 
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium text-[13px] rounded-[4px]"
                        >
                          公开
                        </button>

                        {/* Secondary actions dropdown */}
                        {(() => {
                          const secondaryActions: Array<{ label: string; onClick: () => void; isDanger?: boolean }> = [
                            { label: '检查项', onClick: () => { setChecksProject(proj); setActiveDropdownId(null); } },
                          ];
                          
                          if (proj.status === '草稿') {
                            secondaryActions.push({
                              label: '发布',
                              onClick: () => {
                                setConfirmDialog({
                                  show: true,
                                  title: '确认发布项目',
                                  message: `确定要发布项目 "${proj.name}" 吗？发布后选课学生将可见该项目。`,
                                  onConfirm: () => handlePublish(proj.id)
                                });
                              }
                            });
                          } else if (proj.status === '已发布') {
                            secondaryActions.push({
                              label: '取消发布',
                              onClick: () => {
                                setConfirmDialog({
                                  show: true,
                                  title: '确认取消发布',
                                  message: `确定要取消发布项目 "${proj.name}" 吗？取消发布后学生将无法访问该项目。`,
                                  onConfirm: () => handleCancelPublish(proj.id)
                                });
                              }
                            });
                          }

                          if (proj.status === '已下架') {
                            secondaryActions.push({
                              label: '重新上架',
                              onClick: () => {
                                setConfirmDialog({
                                  show: true,
                                  title: '确认重新上架项目',
                                  message: `确定要重新上架项目 "${proj.name}" 吗？重新上架后选课学生将恢复可见。`,
                                  onConfirm: () => handleReShelfProject(proj)
                                });
                              }
                            });
                          } else {
                            secondaryActions.push({
                              label: '下架',
                              onClick: () => {
                                setProjectToOffShelf(proj);
                                setOffShelfReason('');
                                setIsOffShelfModalOpen(true);
                              }
                            });
                          }

                          secondaryActions.push({
                            label: '复制',
                            onClick: () => {
                              setConfirmDialog({
                                show: true,
                                title: '确认复制项目',
                                message: `确定要复制项目 "${proj.name}" 吗？`,
                                onConfirm: () => handleCopy(proj)
                              });
                            }
                          });

                          const showToggle = (proj.auditStatus !== '已审核' && proj.auditStatus !== '已通过');
                          if (showToggle) {
                            if (proj.isAvailable) {
                              secondaryActions.push({
                                label: '禁用',
                                onClick: () => {
                                  setConfirmDialog({
                                    show: true,
                                    title: '确认禁用项目',
                                    message: `确定要禁用项目 "${proj.name}" 吗？禁用后该项目将暂停服务。`,
                                    onConfirm: () => handleToggleAvailable(proj.id, false)
                                  });
                                }
                              });
                            } else {
                              secondaryActions.push({
                                label: '启用',
                                onClick: () => {
                                  setConfirmDialog({
                                    show: true,
                                    title: '确认启用项目',
                                    message: `确定要启用项目 "${proj.name}" 吗？`,
                                    onConfirm: () => handleToggleAvailable(proj.id, true)
                                  });
                                }
                              });
                            }
                          }

                          if (proj.range !== '租户' && proj.range !== '平台') {
                            secondaryActions.push({
                              label: '删除',
                              onClick: () => {
                                setConfirmDialog({
                                  show: true,
                                  title: '确认删除项目',
                                  message: `确定要删除项目 "${proj.name}" 吗？该操作不可撤销。`,
                                  onConfirm: () => handleDelete(proj.id)
                                });
                              },
                              isDanger: true
                            });
                          }

                          if (secondaryActions.length === 0) return null;

                          return (
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownId(activeDropdownId === proj.id ? null : proj.id);
                                }}
                                className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium text-[13px] rounded-[4px] flex items-center gap-0.5"
                              >
                                更多 <ChevronDown className="w-3 h-3" />
                              </button>
                              {activeDropdownId === proj.id && (
                                <div className="absolute right-0 top-full mt-1.5 bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[120px] text-left animate-in fade-in slide-in-from-top-1 duration-150">
                                  {secondaryActions.map((act, actIdx) => (
                                    <button 
                                      key={actIdx}
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        act.onClick();
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                    >
                                      {act.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProjects.length === 0 && (
              <div className="p-16 text-center text-neutral-400 font-semibold text-xs flex flex-col items-center justify-center gap-2 bg-neutral-50/10">
                <FolderOpen className="w-8 h-8 text-neutral-300" />
                <span>暂无符合条件的实战项目</span>
              </div>
            )}
          </div>
        </div>

        {/* Standalone Bottom Pagination Bar - Matching Dataset Module */}
        <div className="py-2 px-1 flex items-center justify-end gap-3 text-xs text-neutral-500 shrink-0 select-none">
          <span>共 {filteredProjects.length} 条</span>
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

      {/* PROJECT DIALOG (Create/Edit Drawer) - Styled exactly like Dataset creation drawer from right */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="w-5 h-5 text-[#fa541c]" /> : (modalMode === 'view' ? <BookOpen className="w-5 h-5 text-[#fa541c]" /> : <Edit className="w-5 h-5 text-[#fa541c]" />)} 
                {modalMode === 'create' ? '新建实战项目' : (modalMode === 'view' ? '查看项目详情' : '编辑实战项目')}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors"
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
                      disabled={modalMode === 'view'}
                      className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626] disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>

                  {/* 2. 标签 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      标签
                    </label>
                    <div ref={tagDropdownRef} className="relative w-full text-[13px]">
                      <div
                        onClick={() => modalMode !== 'view' && setIsTagDropdownOpen(!isTagDropdownOpen)}
                        className={cn(
                          "min-h-[38px] w-full border rounded px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all text-[#262626] bg-white cursor-pointer select-none",
                          isTagDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-neutral-300",
                          modalMode === 'view' && "bg-neutral-50 text-neutral-500 cursor-not-allowed border-neutral-100"
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
                                  {modalMode !== 'view' && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFormTags(formTags.filter(t => t !== tag));
                                      }}
                                      className="hover:bg-black/10 rounded-[4px] p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Right arrow */}
                        {modalMode !== 'view' && (
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                            <ChevronDown 
                              className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isTagDropdownOpen && "rotate-180")} 
                              strokeWidth={1.5}
                            />
                          </div>
                        )}
                      </div>

                      {/* Dropdown Menu */}
                      {isTagDropdownOpen && modalMode !== 'view' && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* List of tag options */}
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
                      disabled={modalMode === 'view'}
                      className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626] disabled:bg-neutral-50 disabled:text-neutral-500"
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
                          onClick={() => modalMode !== 'view' && setSelectedCover(cover)}
                          className={cn(
                            "aspect-[5/2] rounded-[4px] overflow-hidden border-2 transition-all relative select-none",
                            selectedCover === cover 
                              ? "border-[#fa541c] shadow-md shadow-orange-500/10 scale-[1.02]" 
                              : "border-transparent",
                            modalMode !== 'view' 
                              ? "cursor-pointer hover:border-[#fa541c]/50 hover:scale-[1.02]" 
                              : "cursor-not-allowed"
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
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="加粗"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="斜体"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-[#fa541c]" title="文本颜色"><Type className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="字体大小"><span className="text-[10px] font-bold font-serif leading-none relative top-[-0.5px]">Tt</span></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="无序列表"><List className="w-3.5 h-3.5" /></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="左对齐"><AlignLeft className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="居中"><AlignCenter className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="右对齐"><AlignRight className="w-3.5 h-3.5" /></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="撤销"><Undo2 className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="重做"><Redo2 className="w-3.5 h-3.5" /></button>
                        <div className="w-px h-3.5 bg-neutral-200 mx-1 flex-1"></div>
                        <button type="button" className="p-1 hover:bg-neutral-200 rounded-[4px] transition-colors text-neutral-500" title="全屏"><Maximize2 className="w-3.5 h-3.5" /></button>
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
              )}              {/* TAB 2: PROJECT ENVIRONMENT (MULTI-INSTANCE CONFIG) */}
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
                          const images = env.type === '容器' ? CONTAINER_IMAGES[pool] : VM_IMAGES[pool];
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
                                    image: CONTAINER_IMAGES[currentResourcePool]?.[0] || 'ctyun-python:3.10-slim-cpu',
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
                                    image: VM_IMAGES[currentResourcePool]?.[0] || 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
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
                          ? CONTAINER_IMAGES[activeEnv.resourcePool] || ['ctyun-python:3.10-slim-cpu']
                          : VM_IMAGES[activeEnv.resourcePool] || ['ctyun-ubuntu-22.04-server-x86_64.qcow2'];
                        
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

                  <div className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)] items-start gap-4">
                    <span className="text-[13px] font-bold text-[#262626] sm:text-right pt-1">数据集选择</span>
                    <DatasetSyncSelector value={formDatasets} onChange={setFormDatasets} disabled={modalMode === 'view'} />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer - styled exactly like dataset modal footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              {activeFormTab === 'basic' ? (
                <>
                  <Button 
                    onClick={() => setIsModalOpen(false)} 
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
                    onClick={() => setIsModalOpen(false)} 
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

      {isApplyModalOpen && projectToApply && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => !isApplying && setIsApplyModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                申请公开项目
              </h2>
              <button 
                onClick={() => setIsApplyModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors"
                disabled={isApplying}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">公开后全平台可见可用</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    提交申请后，超管将从 <strong>项目完整性、代码质量、文档规范、培训价值</strong> 四个维度进行审核。审核通过后将进入公共资源库。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">项目名称</label>
                  <input 
                    type="text" 
                    value={projectToApply.name} 
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
                        onClick={() => setApplyRange(opt.key as any)}
                        className={cn(
                          "border p-4 rounded cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyRange === opt.key 
                            ? "border-[#fa541c] bg-[#fff5f0]/30"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        )}
                      >
                        <span className={cn("font-bold text-[13px]", applyRange === opt.key ? "text-[#fa541c]" : "text-[#262626]")}>
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
                    value={applyUsageSuggestion}
                    onChange={(e) => setApplyUsageSuggestion(e.target.value)}
                    placeholder="请描述该项目的申请公开原因及相关说明..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsApplyModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                disabled={isApplying}
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmitApplication} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                disabled={isApplying}
              >
                {isApplying ? (
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

      {/* Project Off-Shelf Modal/Drawer */}
      {isOffShelfModalOpen && projectToOffShelf && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsOffShelfModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                下架实战项目
              </h2>
              <button 
                onClick={() => setIsOffShelfModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">下架后项目将暂不对学生及协同教师公开</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    下架项目后，该实战项目将从公共资源库和项目挑选列表中隐藏。已有实训班级的历史数据将予以保留，但无法基于该项目开启新的实训任务。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">项目名称</label>
                  <input 
                    type="text" 
                    value={projectToOffShelf.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    下架说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={offShelfReason}
                    onChange={(e) => setOffShelfReason(e.target.value)}
                    placeholder="请描述该项目的下架原因及相关说明..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
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
                onClick={handleOffShelfProject} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认下架
              </Button>
            </div>
          </div>
        </div>
      )}

      <ProjectChecksDrawer project={checksProject} onClose={() => setChecksProject(null)} />

      {/* Action Confirmation Modal (Ref Course Module) */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                {confirmDialog.title}
              </h2>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, show: false }))} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex items-start gap-3 bg-white">
              <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
              <div className="text-[14px] text-neutral-750 leading-normal">
                {confirmDialog.message}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, show: false }))} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(prev => ({ ...prev, show: false }));
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
