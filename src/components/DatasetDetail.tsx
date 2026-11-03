import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  Database, 
  FileText, 
  Star, 
  Download, 
  Plus, 
  Link as LinkIcon, 
  CheckCircle, 
  AlertCircle, 
  FileCode, 
  Check, 
  ExternalLink,
  Copy,
  X,
  BookOpen,
  Cpu,
  ChevronDown,
  Upload,
  HelpCircle,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TeacherExperimentIDE from '@/pages/teacher/TeacherExperimentIDE';

interface DatasetDetailProps {
  dataset: any;
  onBack: () => void;
}

export default function DatasetDetail({ dataset, onBack }: DatasetDetailProps) {
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // State
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'file_npz'>('overview');
  const [isStarred, setIsStarred] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Add to Project Modal & Drawer states
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('IL511785481462');
  const [drawerStep, setDrawerStep] = useState<'select' | 'create'>('select');
  const [showSuccessConfirmModal, setShowSuccessConfirmModal] = useState(false);
  const [showExperimentIDE, setShowExperimentIDE] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'env'>('basic');
  const [formName, setFormName] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formDesc, setFormDesc] = useState('');
  const [formIntroduction, setFormIntroduction] = useState('');
  const [selectedCover, setSelectedCover] = useState(`${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Env tab state
  const [resourcePool, setResourcePool] = useState('天翼云资源池1');
  const [envType, setEnvType] = useState<'容器' | '云主机'>('容器');
  const [repoUploadMode, setRepoUploadMode] = useState<'manual' | 'upload'>('manual');
  const [formSourceRepoUrl, setFormSourceRepoUrl] = useState('');
  const [creationMethod, setCreationMethod] = useState<'template' | 'custom'>('template');
  const [templateValue, setTemplateValue] = useState('通用模板');

  const [projectList, setProjectList] = useState([
     { id: 'IL511785481462', name: 'IL511785481462' },
     { id: 'IL511773974443', name: 'IL511773974443' }
  ]);

  const defaultCovers = [
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cloud_1779333396845.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cyber_1779333412582.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_dev_1779333430898.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ml_1779333449102.png`,
  ];

  const availableTagsList = ['AI', '容器', '虚机', 'Java', 'Python', '数据分析', 'DevOps', '大模型'];

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'AI':
        return { bg: 'bg-orange-50', text: 'text-[#fa541c]', border: 'border-orange-200', dot: 'bg-[#fa541c]' };
      case '容器':
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' };
      case '虚机':
        return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-500' };
      case 'Java':
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' };
      case 'Python':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case '数据分析':
        return { bg: 'bg-[#e6f7ff]', text: 'text-[#1890ff]', border: 'border-[#91d5ff]', dot: 'bg-[#1890ff]' };
      case 'DevOps':
        return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', dot: 'bg-indigo-500' };
      case '大模型':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
      default:
        return { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200', dot: 'bg-neutral-400' };
    }
  };

  // Normalizing dataset properties to match exact layout fields
  const datasetTitle = dataset?.name || dataset?.title || 'NPZ格式的MNIST数据';
  const datasetSubtitle = dataset?.subtitle || dataset?.desc || 'MNIST data in NPZ format for machine learning and deep learning benchmarking.';
  const datasetCreator = dataset?.creator || dataset?.author || 'momodel';
  const datasetUpdateTime = dataset?.updateTime || dataset?.updated || '2021/03/03';
  const datasetTags = dataset?.tags || ['computer science', '图像分类'];
  const datasetReferenceCount = dataset?.referenceCount ?? 214;
  const datasetStarCount = dataset?.starCount ?? 128;
  const datasetSize = dataset?.size || '11 MB';
  const datasetImage = dataset?.image || `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`;

  if (showExperimentIDE) {
    return <TeacherExperimentIDE onBack={() => setShowExperimentIDE(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans text-left w-full m-0 p-0 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-[14px] font-medium text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Hero Header Section - Exact match of Teacher Dataset Detail */}
      <div className="relative pt-6 pb-10 px-6 md:px-14 overflow-hidden border-b border-orange-100">
        {/* Background Image & Soft Orange/Peach Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://picsum.photos/seed/pythondataset/1920/400" 
            alt="Dataset Banner" 
            className="w-full h-full object-cover opacity-15"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff2e8] via-[#ffe4d3]/95 to-[#ffd8bf]/85"></div>
          {/* Decorative background glow circle */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          {/* Breadcrumb & Top Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[13px] text-neutral-600">
              <button 
                onClick={onBack} 
                className="hover:text-[#fa541c] flex items-center gap-1 font-medium transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                <ChevronLeft className="w-4 h-4" /> 返回数据集列表
              </button>
              <span className="mx-2 text-neutral-400">/</span>
              <span className="hover:text-[#fa541c] cursor-pointer">翼实训平台</span>
              <span className="mx-2 text-neutral-400">/</span>
              <span className="hover:text-[#fa541c] cursor-pointer">数据集中心</span>
              <span className="mx-2 text-neutral-400">/</span>
              <span className="text-neutral-900 font-bold">{datasetTitle}</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setIsStarred(!isStarred);
                  showToast(isStarred ? '取消收藏' : '已收藏该数据集', 'success');
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all text-[13px] font-medium cursor-pointer border",
                  isStarred 
                    ? "bg-[#fa541c]/10 text-[#fa541c] border-[#ffbb96] hover:bg-[#fa541c]/20" 
                    : "bg-white/70 hover:bg-white text-neutral-700 border-white/80 shadow-2xs"
                )}
              >
                <Star className={cn("w-4 h-4 transition-transform active:scale-95", isStarred ? "text-[#fa541c] fill-[#fa541c]" : "")} /> 
                {isStarred ? '已收藏' : '收藏'}
              </button>
            </div>
          </div>

          {/* Main Info Row with Cover Image on Left */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Left: Cover Image Card */}
            <div className="shrink-0 z-10">
              <div className="w-[300px] h-[170px] rounded-xl overflow-hidden border-[5px] border-white shadow-2xl transition-transform duration-300 hover:scale-[1.02] relative bg-neutral-900">
                <img 
                  src={datasetImage} 
                  alt={datasetTitle} 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right: Info Section */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{datasetTitle}</h1>
              </div>

              <p className="text-sm text-neutral-600 font-mono leading-relaxed max-w-3xl">
                {datasetSubtitle}
              </p>

              {/* Tag Pill Style placed below subtitle */}
              {datasetTags && datasetTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {datasetTags.map((t: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-500 border border-neutral-200/80 text-[11px] rounded font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Info Row: 创建人 -> 更新时间 -> 引用次数 -> 收藏数量 */}
              <div className="flex items-center gap-6 text-xs text-neutral-600 pt-1 flex-wrap font-medium">
                <span>创建人：{datasetCreator}</span>
                <span className="text-neutral-300">•</span>
                <span>更新时间：{datasetUpdateTime}</span>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <span>引用：{datasetReferenceCount} 次</span>
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>收藏：{datasetStarCount + (isStarred ? 1 : 0)}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => showToast(`开始下载数据集「${datasetTitle}」`, 'success')}
                  className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 shadow-2xs h-9 px-4 text-xs font-bold rounded-[4px] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-600" />
                  下载
                </Button>

                <Button
                  onClick={() => setShowAddToProjectModal(true)}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-md shadow-orange-500/20 h-9 px-5 text-xs font-bold rounded-[4px] flex items-center gap-1.5 cursor-pointer transition-all border-0"
                >
                  <Plus className="w-4 h-4" />
                  添加到项目
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-stretch">
          {/* Left Sidebar File Tree (Height aligned with right panel) */}
          <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/60 font-bold text-neutral-700 text-xs flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-500" />
                文件目录
              </span>
            </div>

            <div className="p-2 space-y-1 text-xs flex-1 bg-white">
              <button
                onClick={() => setActiveDetailTab('overview')}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 transition-all border-0 cursor-pointer font-medium",
                  activeDetailTab === 'overview'
                    ? "bg-[#fff2e8] text-[#fa541c] font-bold shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <FileText className="w-4 h-4 shrink-0 text-[#fa541c]" />
                <span>概览说明</span>
              </button>

              <button
                onClick={() => setActiveDetailTab('file_npz')}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 transition-all border-0 cursor-pointer font-medium font-mono text-[12px]",
                  activeDetailTab === 'file_npz'
                    ? "bg-[#fff2e8] text-[#fa541c] font-bold shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <FileCode className="w-4 h-4 shrink-0 text-neutral-400" />
                <span>mnist.npz</span>
              </button>
            </div>
          </div>

          {/* Right Main Content Card */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-sm space-y-6 text-left min-h-[460px] flex flex-col justify-between">
            {activeDetailTab === 'overview' ? (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 border-l-4 border-[#fa541c] pl-3 py-0.5">
                  <h2 className="text-base font-bold text-neutral-900">概览</h2>
                </div>

                <div className="space-y-2 text-xs text-neutral-700 leading-relaxed font-sans">
                  <p>This is classic MNIST dataset and pickled (in npz format).</p>
                  <p className="text-neutral-600">To load this dataset in your code use following function</p>
                </div>

                {/* Code Snippet Box */}
                <div className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-[#f8fafc]">
                  <div className="px-4 py-2 bg-neutral-100/80 border-b border-neutral-200/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-blue-500" />
                      mnist_loader.py
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`def load_data(path):\n    with np.load(path) as f:\n        x_train, y_train = f['x_train'], f['y_train']\n        x_test, y_test = f['x_test'], f['y_test']\n        return (x_train, y_train), (x_test, y_test)\n\n(x_train, y_train), (x_test, y_test) = load_data('../input/mnist.npz')`);
                        setIsCopied(true);
                        showToast('已复制示例代码到剪贴板', 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-neutral-500 hover:text-[#fa541c] bg-white border border-neutral-200 px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? '已复制' : '复制代码'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-neutral-800 leading-relaxed overflow-x-auto m-0 bg-neutral-50/50">
                    <code>{`def load_data(path):
    with np.load(path) as f:
        x_train, y_train = f['x_train'], f['y_train']
        x_test, y_test = f['x_test'], f['y_test']
        return (x_train, y_train), (x_test, y_test)

(x_train, y_train), (x_test, y_test) = load_data('../input/mnist.npz')`}</code>
                  </pre>
                </div>

                {/* Source Link */}
                <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                  <span>Dataset source:</span>
                  <a 
                    href="https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#fa541c] hover:underline flex items-center gap-1"
                  >
                    https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-l-4 border-[#fa541c] pl-3 py-0.5">
                  <h2 className="text-base font-bold text-neutral-900 font-mono">mnist.npz 文件结构预览</h2>
                  <span className="text-xs text-neutral-400 font-mono">压缩二进制数据 (NumPy Compressed Archive)</span>
                </div>

                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold">
                      <tr>
                        <th className="p-3">Array Key</th>
                        <th className="p-3">Shape</th>
                        <th className="p-3">Data Type</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      <tr>
                        <td className="p-3 font-bold text-blue-600">x_train</td>
                        <td className="p-3 text-neutral-700">(60000, 28, 28)</td>
                        <td className="p-3 text-neutral-500">uint8</td>
                        <td className="p-3 text-neutral-600">60,000 张 28x28 灰度训练手写数字图像</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-blue-600">y_train</td>
                        <td className="p-3 text-neutral-700">(60000,)</td>
                        <td className="p-3 text-neutral-500">uint8</td>
                        <td className="p-3 text-neutral-600">60,000 个训练目标标签 (0-9)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-emerald-600">x_test</td>
                        <td className="p-3 text-neutral-700">(10000, 28, 28)</td>
                        <td className="p-3 text-neutral-500">uint8</td>
                        <td className="p-3 text-neutral-600">10,000 张 28x28 灰度测试手写数字图像</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-emerald-600">y_test</td>
                        <td className="p-3 text-neutral-700">(10000,)</td>
                        <td className="p-3 text-neutral-500">uint8</td>
                        <td className="p-3 text-neutral-600">10,000 个测试目标标签 (0-9)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add To Project Drawer */}
      {showAddToProjectModal && (
        <div 
          className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
          onClick={() => {
            setShowAddToProjectModal(false);
            setDrawerStep('select');
          }}
        >
          <div 
            className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {drawerStep === 'select' ? (
              <>
                <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                  <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#fa541c]" /> 添加到项目
                  </h2>
                  <button 
                    onClick={() => setShowAddToProjectModal(false)} 
                    className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                  <div className="bg-[#fff2e8]/40 border border-[#ffbb96]/60 rounded-[6px] p-4 text-[13px] text-neutral-700">
                    数据集包含预处理特征向量，选择将此数据集挂载至已有项目或创建新项目。
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#262626] block">选择现有项目：</label>
                    <div className="space-y-2">
                      {projectList.map((proj) => (
                        <div 
                          key={proj.id}
                          onClick={() => setSelectedProjectId(proj.id)}
                          className={cn(
                            "p-3.5 rounded-[6px] border cursor-pointer flex items-center justify-between transition-all",
                            selectedProjectId === proj.id 
                              ? "border-[#fa541c] bg-[#fff2e8]/30 shadow-xs" 
                              : "border-neutral-200/80 hover:border-neutral-300 bg-white"
                          )}
                        >
                          <div>
                            <div className="font-bold text-neutral-800">{proj.name}</div>
                            <div className="text-[12px] text-neutral-400 font-mono mt-0.5">ID: {proj.id}</div>
                          </div>
                          {selectedProjectId === proj.id && (
                            <Check className="w-5 h-5 text-[#fa541c]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setDrawerStep('create')}
                      className="w-full py-2.5 border border-dashed border-[#fa541c]/60 text-[#fa541c] rounded-[6px] hover:bg-[#fff2e8]/40 font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 bg-transparent text-[13px]"
                    >
                      <Plus className="w-4 h-4" /> 新建项目
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                  <Button 
                    onClick={() => setShowAddToProjectModal(false)} 
                    variant="outline"
                    className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 font-semibold"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowAddToProjectModal(false);
                      setShowSuccessConfirmModal(true);
                    }} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer font-semibold"
                  >
                    确定
                  </Button>
                </div>
              </>
            ) : (
              /* Create Project step - Exact match of TeacherProjects New Project Modal */
              <>
                <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                  <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#fa541c]" /> 新建实战项目
                  </h2>
                  <button 
                    onClick={() => {
                      setShowAddToProjectModal(false);
                      setDrawerStep('select');
                    }} 
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
                        "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px] border-t-0 border-x-0 bg-transparent",
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
                              "min-h-[38px] w-full border rounded px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all text-[#262626] bg-white cursor-pointer select-none relative",
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

                      {/* 5. 项目介绍 */}
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
                          
                          <textarea 
                            placeholder="请输入"
                            value={formIntroduction}
                            onChange={(e) => setFormIntroduction(e.target.value)}
                            className="w-full min-h-[140px] p-4 text-[13px] focus:outline-none resize-none leading-relaxed text-[#262626] border-0"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: PROJECT ENVIRONMENT */}
                  {activeFormTab === 'env' && (
                    <div className="space-y-6 animate-fade-in py-2">
                      
                      {/* 1. 选择资源池 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          选择资源池 <span className="text-[#fa541c]">*</span>
                        </label>
                        <select 
                          value={resourcePool} 
                          onChange={(e) => setResourcePool(e.target.value)}
                          className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                        >
                          <option value="天翼云资源池1">天翼云资源池1</option>
                          <option value="资源池1">资源池1</option>
                          <option value="上海园区资源池">上海园区资源池</option>
                        </select>
                      </div>

                      {/* 2. 选择环境类型 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          选择环境类型 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          {[
                            { value: '容器', label: '容器' },
                            { value: '云主机', label: '云主机' }
                          ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer">
                              <input
                                type="radio"
                                name="envType"
                                value={opt.value}
                                checked={envType === opt.value}
                                onChange={() => setEnvType(opt.value as any)}
                                className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                              />
                              <span className="font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 3. 源仓库地址 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          源仓库地址 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          {[
                            { value: 'manual', label: '手动添加' },
                            { value: 'upload', label: '本地文件上传' }
                          ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer">
                              <input
                                type="radio"
                                name="repoUploadMode"
                                value={opt.value}
                                checked={repoUploadMode === opt.value}
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

                      <div className="grid grid-cols-[100px_1fr] gap-4">
                        <div />
                        <div className="w-full">
                          {repoUploadMode === 'manual' ? (
                            <input
                              type="text"
                              placeholder="请输入源仓库地址 (如: git@github.com:... 或 https://...)"
                              value={formSourceRepoUrl}
                              onChange={(e) => setFormSourceRepoUrl(e.target.value)}
                              className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626] font-mono"
                            />
                          ) : (
                            <div className="space-y-2.5 w-full">
                              <label className="flex flex-col items-center justify-center border border-dashed border-neutral-300 hover:border-[#fa541c]/50 bg-neutral-50/10 hover:bg-neutral-50/30 rounded-[8px] p-6 cursor-pointer transition-all gap-2 text-center">
                                <Upload className="w-6 h-6 text-[#fa541c]" strokeWidth={1.5} />
                                <span className="text-[13px] text-[#262626] font-bold">点击选择或拖拽源码文件上传</span>
                                <span className="text-[11px] text-neutral-400">单文件上限 100MB</span>
                              </label>
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
                            <label key={opt.value} className="flex items-center gap-2 select-none cursor-pointer">
                              <input
                                type="radio"
                                name="creationMethod"
                                value={opt.value}
                                checked={creationMethod === opt.value}
                                onChange={() => setCreationMethod(opt.value as any)}
                                className="w-4 h-4 accent-[#fa541c] cursor-pointer"
                              />
                              <span className="font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Template Details */}
                      <div className="border border-neutral-200 rounded p-5 bg-white space-y-4">
                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                          <label className="text-[13px] font-bold text-[#262626] text-right">
                            选择模板 <span className="text-[#fa541c]">*</span>
                          </label>
                          <select 
                            value={templateValue}
                            onChange={(e) => setTemplateValue(e.target.value)}
                            className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]"
                          >
                            <option value="通用 Python 3.10 AI 分析环境">通用 Python 3.10 AI 分析环境</option>
                            <option value="PyTorch 2.0 + CUDA 11.8 深度学习环境">PyTorch 2.0 + CUDA 11.8 深度学习环境</option>
                            <option value="TensorFlow 2.12 官方基准镜像">TensorFlow 2.12 官方基准镜像</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                          <label className="text-[13px] font-bold text-[#262626] text-right">
                            算力配置 <span className="text-[#fa541c]">*</span>
                          </label>
                          <div className="flex gap-3 text-[12px]">
                            <span className="px-3 py-1.5 bg-orange-50 text-[#fa541c] border border-orange-200 rounded font-bold">2核 4G (基础开发)</span>
                            <span className="px-3 py-1.5 bg-white text-neutral-600 border border-neutral-200 rounded font-medium cursor-pointer hover:border-neutral-300">4核 8G (标准计算)</span>
                            <span className="px-3 py-1.5 bg-white text-neutral-600 border border-neutral-200 rounded font-medium cursor-pointer hover:border-neutral-300">8核 16G + RTX 4090</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between shrink-0">
                  <div>
                    {activeFormTab === 'env' ? (
                      <Button 
                        onClick={() => setActiveFormTab('basic')} 
                        variant="outline" 
                        className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 font-semibold"
                      >
                        上一步
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setDrawerStep('select')} 
                        variant="outline" 
                        className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 font-semibold"
                      >
                        返回关联列表
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => {
                        setShowAddToProjectModal(false);
                        setDrawerStep('select');
                      }} 
                      variant="outline" 
                      className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 font-semibold"
                    >
                      取消
                    </Button>
                    {activeFormTab === 'basic' ? (
                      <Button 
                        onClick={() => setActiveFormTab('env')} 
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer font-semibold"
                      >
                        下一步
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          const newId = formName ? `PRJ_${formName}` : `IL51179900223`;
                          const newProj = { id: newId, name: formName || '新建实战项目' };
                          setProjectList([newProj, ...projectList]);
                          setSelectedProjectId(newId);
                          setDrawerStep('select');
                        }} 
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer font-semibold"
                      >
                        保存
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog matching user screenshot */}
      {showSuccessConfirmModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-fade-in p-4">
          <div className="w-full max-w-[540px] bg-white rounded-[16px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left border border-neutral-100">
            <div className="px-6 py-3.5 bg-[#f8f9fa] border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-neutral-800 tracking-tight">提示</h3>
              <button 
                onClick={() => setShowSuccessConfirmModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-7 space-y-4">
              <p className="text-[14px] text-neutral-700 leading-relaxed font-normal">
                此数据集已被成功添加到你的项目{' '}
                <span className="text-[#fa541c] font-bold hover:underline cursor-pointer">
                  {selectedProjectId}
                </span>
                ，你可以进入相应 Notebook 进行数据分析。
              </p>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowSuccessConfirmModal(false)}
                className="px-6 h-9 rounded-[4px] border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 transition-colors text-[13px] font-semibold cursor-pointer select-none"
              >
                稍后查看
              </button>
              <button 
                onClick={() => {
                  setShowSuccessConfirmModal(false);
                  setShowExperimentIDE(true);
                }}
                className="px-6 h-9 rounded-[4px] bg-[#fa541c] hover:bg-[#e84a15] text-white transition-colors text-[13px] font-semibold cursor-pointer border-0 shadow-sm select-none"
              >
                开始分析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
