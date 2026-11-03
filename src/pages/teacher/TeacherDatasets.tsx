import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  X, 
  Database,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Table,
  Edit,
  Trash2,
  Link as LinkIcon,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Layers,
  Info,
  ArrowDownCircle,
  ChevronDown,
  Star,
  Eye,
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  FileCode,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Dataset {
  id: number;
  name: string;
  subtitle?: string;
  desc: string;
  creator: string;
  type: '文本' | '图像' | '视频' | '音频' | '表格' | '其他' | '混合';
  isAvailable: boolean;
  scope: '私有' | '公共' | '租户';
  auditStatus?: '待审核' | '审核通过' | '已下架' | '--';
  tags: string[];
  size?: string;
  fileCount?: number;
  updateTime: string;
  starCount?: number;
  referenceCount?: number;
  image?: string;
  courseId?: number | null;
  courseName?: string;
  resourcePool?: string;
}

interface TeacherDatasetsProps {
  embedded?: boolean;
  defaultCourseId?: number | null;
  defaultCourseName?: string | null;
}

export default function TeacherDatasets({
  embedded = false,
  defaultCourseId = null,
  defaultCourseName = null,
}: TeacherDatasetsProps) {

  const navigate = useNavigate();

  // Mock data matching exact user screenshot
  const initialDatasets: Dataset[] = [
    {
      id: 1,
      name: 'NPZ格式的MNIST数据',
      subtitle: 'MNIST data in NPZ format',
      desc: 'This is classic MNIST dataset and pickled (in npz format).\n\nTo load this dataset in your code use following function:\n\ndef load_data(path):\n    with np.load(path) as f:\n        x_train, y_train = f[\'x_train\'], f[\'y_train\']\n        x_test, y_test = f[\'x_test\'], f[\'y_test\']\n        return (x_train, y_train), (x_test, y_test)\n\n(x_train, y_train), (x_test, y_test) = load_data(\'../input/mnist.npz\')',
      creator: 'momodel',
      type: '其他',
      isAvailable: true,
      scope: '公共',
      auditStatus: '审核通过',
      tags: ['computer science', '图像分类'],
      updateTime: '2026-07-23',
      starCount: 128,
      referenceCount: 214,
      size: '11 MB',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`
    },
    {
      id: 2,
      name: 'test2',
      subtitle: '图像分类标注数据集',
      desc: '涵盖多类型高分辨率图像标注与特征向量',
      creator: 'liuwei01',
      type: '图像',
      isAvailable: true,
      scope: '私有',
      auditStatus: '待审核',
      tags: ['公有云', '私有云'],
      updateTime: '2026-07-15',
      starCount: 256,
      referenceCount: 89,
      size: '1.25 GB',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`
    },
    {
      id: 3,
      name: 'test111',
      subtitle: '大模型私有数据预处理包',
      desc: '提供底层数据格式转换与预处理工具集',
      creator: 'liuwei01',
      type: '其他',
      isAvailable: true,
      scope: '私有',
      auditStatus: '待审核',
      tags: ['私有云'],
      updateTime: '2026-07-14',
      starCount: 64,
      referenceCount: 18,
      size: '340 MB',
      image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ml_1779333449102.png`
    }
  ];

  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tabFilter, setTabFilter] = useState<'all' | 'public' | 'my'>('all');
  const [courseFilter, setCourseFilter] = useState<string>(defaultCourseId ? String(defaultCourseId) : 'all');
  
  // Dropdown Action State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Filter dropdown state
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = React.useRef<HTMLDivElement>(null);
  const actionDropdownRef = React.useRef<HTMLDivElement>(null);

  const typeDropdownRef = React.useRef<HTMLDivElement>(null);
  const tagDropdownRef = React.useRef<HTMLDivElement>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [availableDatasetTags, setAvailableDatasetTags] = useState<string[]>([
    'CV/计算机视觉',
    'NLP/自然语言',
    '大模型/LLM',
    '图像分类',
    '目标检测',
    '医疗健康',
    '金融科技',
    '自动驾驶',
    '语音识别',
    '推荐系统',
    '时序预测',
    'computer science',
    '公有云',
    '私有云',
  ]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Drawer / Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const handleOpenDetail = (ds: Dataset) => {
    navigate(`/teacher/dataset/${ds.id}`);
  };

  // Off-shelf State
  const [isOffShelfModalOpen, setIsOffShelfModalOpen] = useState(false);
  const [datasetToOffShelf, setDatasetToOffShelf] = useState<Dataset | null>(null);
  const [offShelfReason, setOffShelfReason] = useState('');

  // Apply Public State (Course Module Style)
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [datasetToApply, setDatasetToApply] = useState<Dataset | null>(null);
  const [applyRange, setApplyRange] = useState<'租户' | '平台'>('租户');
  const [applyReason, setApplyReason] = useState('');

  const handleOpenApplyPublic = (ds: Dataset) => {
    setDatasetToApply(ds);
    setApplyRange('租户');
    setApplyReason('');
    setIsApplyPublicModalOpen(true);
  };

  const handleConfirmApplyPublic = () => {
    if (!applyReason.trim()) {
      showToast('请填写申请说明', 'error');
      return;
    }
    if (!datasetToApply) return;

    setDatasets(prev => prev.map(d => {
      if (d.id === datasetToApply.id) {
        return {
          ...d,
          auditStatus: '待审核',
          scope: applyRange === '平台' ? '公共' : '租户'
        };
      }
      return d;
    }));
    showToast(`数据集「${datasetToApply.name}」已提交公开申请`);
    setIsApplyPublicModalOpen(false);
    setDatasetToApply(null);
    setApplyReason('');
  };

  // Confirmation Modal State
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

  const handleOffShelfDataset = () => {
    if (!offShelfReason.trim()) {
      showToast('请填写下架说明', 'error');
      return;
    }
    if (!datasetToOffShelf) return;

    setDatasets(prev => prev.map(d => {
      if (d.id === datasetToOffShelf.id) {
        return {
          ...d,
          status: '已下架',
        };
      }
      return d;
    }));
    showToast(`数据集「${datasetToOffShelf.name}」已成功下架`);
    setIsOffShelfModalOpen(false);
    setDatasetToOffShelf(null);
    setOffShelfReason('');
  };

  const handleReShelfDataset = (ds: Dataset) => {
    setDatasets(prev => prev.map(d => {
      if (d.id === ds.id) {
        return {
          ...d,
          status: '已发布',
        };
      }
      return d;
    }));
    showToast(`数据集「${ds.name}」已重新上架`);
  };

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formResourcePool, setFormResourcePool] = useState('资源池1');
  const [formType, setFormType] = useState<Dataset['type']>('文本');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formScope, setFormScope] = useState<'私有' | '公开'>('私有');

  // Toast
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getIconByType = (type: string) => {
    switch(type) {
      case '文本': return <FileText className="w-5 h-5 text-blue-500" />;
      case '图片': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case '视频': return <Video className="w-5 h-5 text-purple-500" />;
      case '音频': return <Music className="w-5 h-5 text-orange-500" />;
      case '表格': return <Table className="w-5 h-5 text-teal-500" />;
      default: return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleApplyPublic = (ds: Dataset) => {
    setDatasets(prev => prev.map(d => d.id === ds.id ? { ...d, auditStatus: '待审核' } : d));
    showToast(`数据集「${ds.name}」已提交公开审核`);
  };

  const toggleAvailability = (ds: Dataset) => {
    const actionText = ds.isAvailable ? '禁用' : '启用';
    setConfirmDialog({
      show: true,
      title: `确认${actionText}数据集`,
      message: `确定要${actionText}数据集 "${ds.name}" 吗？${ds.isAvailable ? '禁用后该数据集将暂不可用于相关实验项目。' : '启用后该数据集将正常恢复使用。'}`,
      onConfirm: () => {
        setDatasets(prev => prev.map(d => d.id === ds.id ? { ...d, isAvailable: !d.isAvailable } : d));
        showToast(`数据集「${ds.name}」已${actionText}`);
      }
    });
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const newTag = customTagInput.trim();
    if (!formTags.includes(newTag)) {
      setFormTags([...formTags, newTag]);
    }
    if (!availableDatasetTags.includes(newTag)) {
      setAvailableDatasetTags(prev => [...prev, newTag]);
    }
    setCustomTagInput('');
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormName('');
    setFormDesc('');
    setFormResourcePool('资源池1');
    setFormType('文本');
    setFormTags([]);
    setFormScope('私有');
    setIsTypeDropdownOpen(false);
    setIsTagDropdownOpen(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (ds: Dataset) => {
    setIsEditMode(true);
    setCurrentId(ds.id);
    setFormName(ds.name);
    setFormDesc(ds.desc);
    setFormResourcePool(ds.resourcePool || '资源池1');
    setFormType(ds.type);
    setFormTags(ds.tags || []);
    setFormScope(ds.scope === '公共' || ds.scope === '租户' ? '公开' : '私有');
    setIsTypeDropdownOpen(false);
    setIsTagDropdownOpen(false);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      showToast('数据集名称不能为空', 'error');
      return;
    }
    
    const tagsArray = formScope === '私有' ? [] : formTags;

    if (isEditMode && currentId !== null) {
      setDatasets(datasets.map(d => d.id === currentId ? {
        ...d,
        name: formName,
        desc: formDesc,
        resourcePool: formResourcePool,
        type: formScope === '私有' ? '文本' : formType,
        tags: tagsArray,
        scope: formScope === '公开' ? '公共' : '私有',
        updateTime: new Date().toISOString().split('T')[0]
      } : d));
      showToast('数据集更新成功');
    } else {
      const newDataset: Dataset = {
        id: Date.now(),
        name: formName,
        subtitle: formDesc || formName,
        desc: formDesc,
        resourcePool: formResourcePool,
        creator: 'liuwei01',
        type: formScope === '私有' ? '文本' : formType,
        tags: tagsArray,
        isAvailable: true,
        scope: formScope === '公开' ? '公共' : '私有',
        auditStatus: formScope === '公开' ? '待审核' : '--',
        size: '0 MB',
        fileCount: 0,
        updateTime: new Date().toISOString().split('T')[0],
        starCount: 0,
        referenceCount: 0,
        image: `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`
      };
      setDatasets([newDataset, ...datasets]);
      showToast('数据集创建成功');
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (ds: Dataset) => {
    setConfirmDialog({
      show: true,
      title: '确认删除数据集',
      message: `确定要删除数据集 "${ds.name}" 吗？该操作不可撤销。`,
      onConfirm: () => {
        setDatasets(prev => prev.filter(d => d.id !== ds.id));
        showToast('删除数据集成功');
      }
    });
  };

  const filteredData = datasets.filter(d => {
    // Tab filter
    if (tabFilter === 'public' && d.scope !== '平台公共') return false;
    if (tabFilter === 'my' && d.scope !== '我的私有') return false;
    // Course filter
    if (courseFilter !== 'all' && d.courseId !== Number(courseFilter)) return false;
    // Search
    if (searchKeyword && !d.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });



  return (
    <div className={cn("flex flex-col h-full text-left", embedded ? "p-5" : "p-6")}>
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg shadow-xl animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#fa541c] shrink-0" />
          )}
          <span className="text-[14px] font-medium text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Top Actions - Spacing matching TeacherProjects */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索数据集名称" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-9 bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleOpenCreate} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 h-9 text-[13px] shadow-sm shrink-0 border-0 cursor-pointer font-bold flex items-center">
            <Plus className="w-4 h-4 mr-1" /> 新建数据集
          </Button>
        </div>
      </div>

      {/* Content Area - Table Card Container Module & Standalone Pagination */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden gap-3">
        {/* Table Card Container */}
        <div className="bg-white border border-neutral-200/80 rounded-[8px] overflow-hidden flex-1 flex flex-col">
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse whitespace-nowrap text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                    <th className="p-4 font-medium w-[28%]">数据集信息</th>
                    <th className="p-4 font-medium">创建人</th>
                    <th className="p-4 font-medium">类型</th>
                    <th className="p-4 font-medium">收藏数量</th>
                    <th className="p-4 font-medium">被引用次数</th>
                    <th className="p-4 font-medium">更新时间</th>
                    <th className="p-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((ds, index) => (
                    <tr key={ds.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredData.length - 1 && "border-b-0")}>
                      {/* 1. 数据集信息 */}
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div 
                            onClick={() => handleOpenDetail(ds)} 
                            className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-neutral-200/60 shadow-xs relative bg-neutral-100 cursor-pointer group/img"
                          >
                            <img 
                              src={ds.image || `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`}
                              alt={ds.name} 
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          <div>
                            <div 
                              onClick={() => handleOpenDetail(ds)} 
                              className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer"
                            >
                              {ds.name}
                            </div>
                            {ds.subtitle && (
                              <div className="text-xs text-neutral-500 font-mono mt-0.5">{ds.subtitle}</div>
                            )}
                            {ds.tags && ds.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {ds.tags.map((t, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-500 border border-neutral-200/80 text-[11px] rounded font-mono">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. 创建人 */}
                      <td className="p-4 text-neutral-600 font-medium">
                        <div className="text-neutral-800 font-medium">{ds.creator}</div>
                      </td>

                      {/* 3. 类型 */}
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium",
                          ds.type === '文本' ? "bg-blue-50 text-blue-600 border-blue-200" :
                          (ds.type === '图像' || ds.type === '图片') ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          "bg-neutral-100 text-neutral-600 border-neutral-200"
                        )}>
                          {ds.type}
                        </span>
                      </td>

                      {/* 4. 收藏数量 */}
                      <td className="p-4 text-neutral-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{ds.starCount ?? (ds.id === 1 ? 128 : ds.id === 2 ? 256 : 64)}</span>
                        </div>
                      </td>

                      {/* 5. 被引用次数 */}
                      <td className="p-4 text-neutral-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{ds.referenceCount ?? (ds.id === 1 ? 45 : ds.id === 2 ? 89 : 18)} 次</span>
                        </div>
                      </td>

                      {/* 6. 更新时间 */}
                      <td className="p-4 text-neutral-500 font-mono text-[12px]">
                        {ds.updateTime}
                      </td>

                      {/* 7. 操作 */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleOpenDetail(ds)} 
                            className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium rounded-[4px]"
                          >
                            查看
                          </button>

                          {ds.creator === 'liuwei01' ? (
                            <button 
                              onClick={() => handleOpenEdit(ds)} 
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium rounded-[4px]"
                            >
                              编辑
                            </button>
                          ) : (
                            <button 
                              disabled
                              className="text-[#ffbb96] bg-transparent border-0 cursor-not-allowed p-0 text-[13px] font-medium rounded-[4px] select-none opacity-80"
                              title="非本人创建的数据集不可编辑"
                            >
                              编辑
                            </button>
                          )}

                          {ds.creator === 'liuwei01' ? (
                            <button 
                              onClick={() => handleDelete(ds)} 
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium rounded-[4px]"
                            >
                              删除
                            </button>
                          ) : (
                            <button 
                              disabled
                              className="text-[#ffbb96] bg-transparent border-0 cursor-not-allowed p-0 text-[13px] font-medium rounded-[4px] select-none opacity-80"
                              title="非本人创建的数据集不可删除"
                            >
                              删除
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20">
              <div className="w-32 h-32 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                <Database className="w-12 h-12 text-neutral-300" />
              </div>
              <h3 className="text-[16px] font-bold text-neutral-800 mb-2">未找到数据集</h3>
              <p className="text-[13px] text-neutral-500 mb-6 max-w-sm">
                当前分类下暂无数据集记录。您可以新建数据集或调整过滤条件。
              </p>
              <Button onClick={handleOpenCreate} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-6 text-[13px] border-0 cursor-pointer">
                新建数据集
              </Button>
            </div>
          )}
        </div>

        {/* Standalone Bottom Pagination Bar - Independent Module outside Table Card */}
        {filteredData.length > 0 && (
          <div className="py-2 px-1 flex items-center justify-end gap-3 text-xs text-neutral-500 shrink-0 select-none">
            <span>共 {filteredData.length} 条</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center hover:bg-neutral-50 cursor-pointer bg-white text-neutral-600">
                &lt;
              </button>
              <button className="w-7 h-7 bg-[#fa541c] text-white rounded font-bold flex items-center justify-center shadow-xs">
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
        )}
      </div>

      {/* Drawer: Create / Edit */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[600px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-neutral-800">
                {isEditMode ? '编辑数据集' : '新建数据集'}
              </h2>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right">
                  名称 <span className="text-[#fa541c]">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入数据集名称"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800"
                />
              </div>

              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right pt-2">
                  描述
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="描述数据集的内容、用途及注意事项..."
                  className="w-full h-24 border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <span className="text-[13px] font-bold text-neutral-400 text-right pt-1">
                  资源池 <span className="text-[#fa541c]">*</span>
                </span>
                <div role="radiogroup" aria-label="资源池" className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                  {['资源池1', '天翼云资源池1', '上海园区资源池'].map(pool => (
                    <label key={pool} className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-neutral-800">
                      <input
                        type="radio"
                        name="datasetResourcePool"
                        value={pool}
                        checked={formResourcePool === pool}
                        onChange={() => setFormResourcePool(pool)}
                        className="accent-[#fa541c] w-4 h-4 cursor-pointer"
                      />
                      <span>{pool}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 权限 */}
              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right pt-1.5">
                  权限 <span className="text-[#fa541c]">*</span>
                </label>
                <div>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-neutral-800">
                      <input 
                        type="radio" 
                        name="datasetScope" 
                        value="私有" 
                        checked={formScope === '私有'} 
                        onChange={() => setFormScope('私有')}
                        className="accent-[#fa541c] w-4 h-4 cursor-pointer"
                      />
                      <span>私有</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium text-neutral-800">
                      <input 
                        type="radio" 
                        name="datasetScope" 
                        value="公开" 
                        checked={formScope === '公开'} 
                        onChange={() => setFormScope('公开')}
                        className="accent-[#fa541c] w-4 h-4 cursor-pointer"
                      />
                      <span>公开</span>
                    </label>
                  </div>
                  {formScope === '公开' && (
                    <div className="mt-2.5 text-[12px] text-amber-600 bg-amber-50/70 border border-amber-200/80 rounded px-3 py-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>公开数据集被引用后不可改回私有</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 当权限为公开时，才显示类型和标签 */}
              {formScope === '公开' && (
                <>
                  {/* 类型下拉 (参考新建课程模块风格) */}
                  <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      类型 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div ref={typeDropdownRef} className="relative w-full text-[13px]">
                      <div
                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                        className={cn(
                          "min-h-[38px] w-full border rounded-[4px] px-3.5 py-2 flex items-center justify-between transition-all text-[#262626] bg-white cursor-pointer select-none",
                          isTypeDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <span>{formType}</span>
                        <ChevronDown 
                          className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isTypeDropdownOpen && "rotate-180")} 
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* 类型下拉菜单 */}
                      {isTypeDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                            {[
                              { label: '文本', value: '文本' },
                              { label: '图像', value: '图像' },
                              { label: '视频', value: '视频' },
                              { label: '音频', value: '音频' },
                              { label: '其他', value: '其他' },
                            ].map(opt => {
                              const isSelected = formType === opt.value;
                              return (
                                <div
                                  key={opt.value}
                                  onClick={() => {
                                    setFormType(opt.value as Dataset['type']);
                                    setIsTypeDropdownOpen(false);
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
                  </div>

                  {/* 标签及下拉 (参考新建课程模块风格) */}
                  <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      标签
                    </label>
                    <div ref={tagDropdownRef} className="relative w-full text-[13px]">
                      <div
                        onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                        className={cn(
                          "min-h-[38px] w-full border rounded-[4px] px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all text-[#262626] bg-white cursor-pointer select-none",
                          isTagDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        {formTags.length === 0 ? (
                          <span className="text-neutral-400 select-none">请选择数据集标签</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 items-center w-full pr-8">
                            {formTags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold border transition-all bg-neutral-50 text-neutral-600 border-neutral-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
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
                            ))}
                          </div>
                        )}
                        
                        {/* 右侧下拉箭头 */}
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                          <ChevronDown 
                            className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isTagDropdownOpen && "rotate-180")} 
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      {/* 标签下拉菜单 */}
                      {isTagDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* 自定义标签添加栏 */}
                          <div className="px-3 py-2 border-b border-neutral-100 flex items-center gap-2 bg-neutral-50/50" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={customTagInput}
                              onChange={(e) => setCustomTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomTag();
                                }
                              }}
                              placeholder="自定义标签按回车添加..."
                              className="flex-1 border border-neutral-200 rounded px-2.5 py-1 text-[12px] focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomTag}
                              className="px-2.5 py-1 text-[12px] bg-[#fa541c] text-white rounded hover:bg-[#e84a15] transition-colors shrink-0 font-medium cursor-pointer"
                            >
                              添加
                            </button>
                          </div>

                          {/* 标签选项列表 */}
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {availableDatasetTags.map(tag => {
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
                </>
              )}
            </div>

            {/* Footer - matching 新建课程 buttons style */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsDrawerOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Public Drawer (Ref Course Module Style in TeacherHome) */}
      {isApplyPublicModalOpen && datasetToApply && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
          onClick={() => setIsApplyPublicModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                申请公开数据集资源
              </h2>
              <button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">公开后平台师生可见可用</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    申请公开后，数据集需经过超管审核。审核通过将加入对应范围的公共数据集库，相应师生可见可用。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">数据集名称</label>
                  <input 
                    type="text" 
                    value={datasetToApply.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-[4px] px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                    公开范围 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有班级与教师可见' },
                      { key: '平台', label: '平台级公开', desc: '全平台所有院校与租户可见' }
                    ].map(opt => (
                      <div 
                        key={opt.key}
                        onClick={() => setApplyRange(opt.key as any)}
                        className={cn(
                          "border p-4 rounded-[4px] cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyRange === opt.key 
                            ? "border-[#fa541c] bg-[#fff5f0]/30 font-bold"
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
                    value={applyReason}
                    onChange={(e) => setApplyReason(e.target.value)}
                    placeholder="请简述申请公开该数据集的理由或适用实验场景..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
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
              >
                取消
              </Button>
              <Button 
                onClick={handleConfirmApplyPublic} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                提交申请
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Off-Shelf Drawer (Ref Course Module Style in TeacherHome) */}
      {isOffShelfModalOpen && datasetToOffShelf && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
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
                下架数据集资源
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
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">下架后数据集将暂不对平台师生公开</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    下架数据集后，该数据资源将从公共数据集列表与课程绑定中隐藏。历史关联的项目仍保留缓存数据，但无法发起新的数据下载或调用。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">数据集名称</label>
                  <input 
                    type="text" 
                    value={datasetToOffShelf.name} 
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
                    placeholder="请简述下架该数据集的具体原因及后续安排..."
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
                onClick={handleOffShelfDataset} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认下架
              </Button>
            </div>
          </div>
        </div>
      )}

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
