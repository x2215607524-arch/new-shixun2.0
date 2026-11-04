import React, { useState, useRef, useEffect } from 'react';
import { Plus, FolderKanban, HelpCircle, FileQuestion, FileText, Database, BookOpen, Copy, Eye, User, Calendar, Clock, Search, Trash2, Edit, Check, X, Users, CreditCard, Cpu, ShieldCheck, AlertCircle, CheckCircle, ShieldAlert, BarChart3, School, PenTool, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherProjects from './TeacherProjects';
import TeacherExams from './TeacherExams';
import TeacherDatasets from './TeacherDatasets';
import TeacherPractices from './TeacherPractices';
import TeacherAICenter from './TeacherAICenter';
import { Layers, Info, Bold, Italic, Type, List, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Maximize2, ChevronDown } from 'lucide-react';

export default function TeacherHome() {
  const location = useLocation();
  const [activeSubTab, setActiveSubTab] = useState<'course' | 'project' | 'dataset' | 'exam' | 'practice' | 'aicenter'>(() => {
    const searchStr = location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.search);
    const searchParams = new URLSearchParams(searchStr);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['course', 'project', 'dataset', 'exam', 'practice', 'aicenter'].includes(tabParam)) {
      return tabParam as any;
    }
    return (location.state as any)?.activeSubTab || 'course';
  });

  useEffect(() => {
    const searchStr = location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.search);
    const searchParams = new URLSearchParams(searchStr);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['course', 'project', 'dataset', 'exam', 'practice', 'aicenter'].includes(tabParam)) {
      setActiveSubTab(tabParam as any);
    } else if ((location.state as any)?.activeSubTab) {
      setActiveSubTab((location.state as any).activeSubTab);
    }
  }, [location.search, location.state]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);

  // Initial course data setup
  const [coursesList, setCoursesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('zhiyun_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultList = [
      {
        id: 1,
        name: '人工智能基础与实践',
        code: 'AI-101-2026',
        desc: '本课程旨在介绍人工智能的基本概念、算法原理及实际应用。',
        teacher: '张老师',
        ta: '李助教',
        scope: '平台',
        status: '已发布',
        auditStatus: '已通过',
        image: 'https://picsum.photos/seed/ai/400/200',
        state: 'active',
        major: '人工智能',
        tags: '必修, 核心课程'
      },
      {
        id: 2,
        name: '深度学习进阶',
        code: 'DL-201-2026',
        desc: '深入探讨神经网络、CNN、RNN等高级深度学习模型。',
        teacher: '张老师',
        ta: '王助教',
        scope: '私有',
        status: '草稿',
        auditStatus: '待审核',
        image: 'https://picsum.photos/seed/dl/400/200',
        state: 'active',
        major: '人工智能',
        tags: '必修'
      },
      {
        id: 3,
        name: 'Python数据分析',
        code: 'PY-301-2025',
        desc: '使用Python进行数据清洗、处理、分析和可视化。',
        teacher: '张老师',
        ta: '-',
        scope: '租户',
        status: '已发布',
        auditStatus: '已通过',
        image: 'https://picsum.photos/seed/data/400/200',
        state: 'ended',
        major: '计算机科学',
        tags: '选修'
      }
    ];
    localStorage.setItem('zhiyun_courses', JSON.stringify(defaultList));
    return defaultList;
  });

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<'create' | 'edit' | 'detail'>('create');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCover, setSelectedCover] = useState('');
  
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [applyPublicCourse, setApplyPublicCourse] = useState<any>(null);
  const [applyReason, setApplyReason] = useState('');
  const [applyRange, setApplyRange] = useState<'租户' | '平台'>('租户');

  const [isOffShelfModalOpen, setIsOffShelfModalOpen] = useState(false);
  const [offShelfCourse, setOffShelfCourse] = useState<any>(null);
  const [offShelfReason, setOffShelfReason] = useState('');
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
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [activeCourseDropdownId, setActiveCourseDropdownId] = useState<number | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveCourseDropdownId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [courseFormName, setCourseFormName] = useState('');
  const [courseFormMajor, setCourseFormMajor] = useState('');
  const [courseFormTags, setCourseFormTags] = useState<string[]>([]);
  const [isCourseTagDropdownOpen, setIsCourseTagDropdownOpen] = useState(false);
  const [availableCourseTagsList] = useState<string[]>([
    '必修', '选修', '核心课程', '专业课', '通识课', '实践课', '基础课'
  ]);
  const courseTagDropdownRef = useRef<HTMLDivElement>(null);
  const [courseFormDesc, setCourseFormDesc] = useState('');
  const [courseFormIntroduction, setCourseFormIntroduction] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (courseTagDropdownRef.current && !courseTagDropdownRef.current.contains(event.target as Node)) {
        setIsCourseTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const navigate = useNavigate();

  const defaultCovers = [
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ai_1779333317936.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_data_1779333332856.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cloud_1779333396845.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_cyber_1779333412582.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_dev_1779333430898.png`,
    `${import.meta.env.BASE_URL}images/covers/microsoft_tech_ml_1779333449102.png`,
  ];

  const teachingTools = [
    { icon: FileQuestion, title: '试题管理', desc: '试题库录入与智能标签', bgGradient: 'bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white hover:from-blue-100/50 hover:to-indigo-50/60', borderClass: 'border-blue-100/70 hover:border-blue-200/80', titleColor: 'text-blue-950', descColor: 'text-neutral-500', iconBg: 'bg-blue-600', iconTextColor: 'text-blue-600', shadowColor: 'hover:shadow-blue-500/5 hover:shadow-md', path: '/teacher/questions' },
    { icon: FileText, title: '试卷管理', desc: '智能组卷与作业分发', bgGradient: 'bg-gradient-to-br from-violet-50/60 via-purple-50/30 to-white hover:from-violet-100/50 hover:to-purple-50/60', borderClass: 'border-violet-100/70 hover:border-violet-200/80', titleColor: 'text-violet-950', descColor: 'text-neutral-500', iconBg: 'bg-violet-600', iconTextColor: 'text-violet-600', shadowColor: 'hover:shadow-violet-500/5 hover:shadow-md', path: '/teacher/papers' },
    { icon: ShieldAlert, title: '防作弊管理', desc: '考试竞赛过程监控策略', bgGradient: 'bg-gradient-to-br from-rose-50/60 via-red-50/30 to-white hover:from-rose-100/50 hover:to-red-50/60', borderClass: 'border-rose-100/70 hover:border-rose-200/80', titleColor: 'text-rose-950', descColor: 'text-neutral-500', iconBg: 'bg-rose-600', iconTextColor: 'text-rose-600', shadowColor: 'hover:shadow-rose-500/5 hover:shadow-md', path: '/teacher/anticheat' },
    { icon: Database, title: '资源分配', desc: '实训算力资源配置', bgGradient: 'bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white hover:from-emerald-100/50 hover:to-emerald-50/60', borderClass: 'border-emerald-100/70 hover:border-emerald-200/80', titleColor: 'text-emerald-950', descColor: 'text-neutral-500', iconBg: 'bg-emerald-600', iconTextColor: 'text-emerald-600', shadowColor: 'hover:shadow-emerald-500/5 hover:shadow-md', path: '/teacher/resources' },
    { icon: Users, title: '用户管理', desc: '学生与协作教师团队管理', bgGradient: 'bg-gradient-to-br from-cyan-50/60 via-blue-50/30 to-white hover:from-cyan-100/50 hover:to-blue-50/60', borderClass: 'border-cyan-100/70 hover:border-cyan-200/80', titleColor: 'text-cyan-950', descColor: 'text-neutral-500', iconBg: 'bg-cyan-600', iconTextColor: 'text-cyan-600', shadowColor: 'hover:shadow-cyan-500/5 hover:shadow-md', path: '/teacher/students' },
    { icon: BarChart3, title: '学习数据统计', desc: '学生学习曲线进度大盘', bgGradient: 'bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-white hover:from-amber-100/50 hover:to-orange-50/60', borderClass: 'border-amber-100/70 hover:border-amber-200/80', titleColor: 'text-amber-950', descColor: 'text-neutral-500', iconBg: 'bg-amber-600', iconTextColor: 'text-amber-600', shadowColor: 'hover:shadow-amber-500/5 hover:shadow-md', path: '/teacher/statistics' },
    { icon: PenTool, title: '批阅管理', desc: '主客观题人工批改与反馈', bgGradient: 'bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white hover:from-orange-100/50 hover:to-amber-50/60', borderClass: 'border-orange-100/70 hover:border-orange-200/80', titleColor: 'text-orange-950', descColor: 'text-neutral-500', iconBg: 'bg-[#fa541c]', iconTextColor: 'text-[#fa541c]', shadowColor: 'hover:shadow-orange-500/5 hover:shadow-md', path: '/teacher/grading' },
    { icon: ClipboardList, title: '考试规则', desc: '设置考试防作弊与规则模板', bgGradient: 'bg-gradient-to-br from-teal-50/60 via-emerald-50/30 to-white hover:from-teal-100/50 hover:to-emerald-50/60', borderClass: 'border-teal-100/70 hover:border-teal-200/80', titleColor: 'text-teal-950', descColor: 'text-neutral-500', iconBg: 'bg-teal-600', iconTextColor: 'text-teal-600', shadowColor: 'hover:shadow-teal-500/5 hover:shadow-md', path: '/teacher/examrules' },
    { icon: CreditCard, title: '计费账单', desc: '查看算力与存储消费', bgGradient: 'bg-gradient-to-br from-fuchsia-50/60 via-pink-50/30 to-white hover:from-fuchsia-100/50 hover:to-pink-50/60', borderClass: 'border-fuchsia-100/70 hover:border-fuchsia-200/80', titleColor: 'text-fuchsia-950', descColor: 'text-neutral-500', iconBg: 'bg-fuchsia-600', iconTextColor: 'text-fuchsia-600', shadowColor: 'hover:shadow-fuchsia-500/5 hover:shadow-md', path: '/teacher/billing' },
    { icon: Cpu, title: 'AI配额管理', desc: '大模型GPU算力配额设置', bgGradient: 'bg-gradient-to-br from-indigo-50/60 via-violet-50/30 to-white hover:from-indigo-100/50 hover:to-violet-50/60', borderClass: 'border-indigo-100/70 hover:border-indigo-200/80', titleColor: 'text-indigo-950', descColor: 'text-neutral-500', iconBg: 'bg-indigo-600', iconTextColor: 'text-indigo-600', shadowColor: 'hover:shadow-indigo-500/5 hover:shadow-md', path: '/teacher/aiquota' },
    { icon: ShieldCheck, title: '审核中心', desc: '自建课程项目上架审核', bgGradient: 'bg-gradient-to-br from-pink-50/60 via-rose-50/30 to-white hover:from-pink-100/50 hover:to-rose-50/60', borderClass: 'border-pink-100/70 hover:border-pink-200/80', titleColor: 'text-pink-950', descColor: 'text-neutral-500', iconBg: 'bg-pink-600', iconTextColor: 'text-pink-600', shadowColor: 'hover:shadow-pink-500/5 hover:shadow-md', path: '/teacher/audit' },
  ];

  const handlePublishCourse = (id: number) => {
    const updated = coursesList.map(c => c.id === id ? { ...c, status: '已发布' } : c);
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('课程已发布');
  };

  const handleCancelPublishCourse = (id: number) => {
    const updated = coursesList.map(c => c.id === id ? { ...c, status: '草稿' } : c);
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('已取消发布课程');
  };

  const handleDeleteCourse = (id: number) => {
    const updated = coursesList.filter(c => c.id !== id);
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('删除课程成功');
  };

  const handleCopyCourse = (course: any) => {
    const newCourse = {
      ...course,
      id: Date.now(),
      name: `${course.name} (复制)`,
      code: `AI-${Math.floor(100 + Math.random() * 900)}-2026`,
      scope: '私有',
      status: '草稿',
      auditStatus: '待审核',
    };
    const updated = [newCourse, ...coursesList];
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('复制课程成功');
  };

  const handleOpenCourseDetail = (course: any) => {
    setEditingCourse(course);
    setCourseFormName(course.name);
    setCourseFormMajor(course.major || '人工智能');
    setCourseFormTags(course.tags ? course.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
    setIsCourseTagDropdownOpen(false);
    setCourseFormDesc(course.desc);
    setSelectedCover(course.image);
    setCourseFormIntroduction(course.introduction || '');
    setCourseModalMode('detail');
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = () => {
    if (!courseFormName.trim()) {
      showToast('请输入课程名称', 'error');
      return;
    }
    if (courseModalMode === 'create') {
      const newCourse = {
        id: Date.now(),
        name: courseFormName,
        code: `AI-${Math.floor(100 + Math.random() * 900)}-2026`,
        desc: courseFormDesc,
        teacher: '张老师',
        ta: '-',
        scope: '私有',
        status: '草稿',
        auditStatus: '待审核',
        image: selectedCover || defaultCovers[0],
        state: 'active',
        major: courseFormMajor || '人工智能',
        tags: courseFormTags.join(', ') || '必修, 核心课程',
        introduction: courseFormIntroduction
      };
      const updated = [newCourse, ...coursesList];
      setCoursesList(updated);
      localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
      showToast('创建课程成功');
    } else {
      const updated = coursesList.map(c => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            name: courseFormName,
            desc: courseFormDesc,
            image: selectedCover,
            major: courseFormMajor,
            tags: courseFormTags.join(', '),
            introduction: courseFormIntroduction
          };
        }
        return c;
      });
      setCoursesList(updated);
      localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
      showToast('修改课程成功');
    }
    setIsCourseModalOpen(false);
  };

  const handleApplyPublic = () => {
    if (!applyReason.trim()) {
      showToast('请填写申请说明', 'error');
      return;
    }
    const updated = coursesList.map(c => {
      if (c.id === applyPublicCourse.id) {
        return {
          ...c,
          scope: applyRange,
          auditStatus: '待审核'
        };
      }
      return c;
    });
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('提交申请成功，等待超管审核');
    setIsApplyPublicModalOpen(false);
  };

  const handleOffShelf = () => {
    if (!offShelfReason.trim()) {
      showToast('请填写下架说明', 'error');
      return;
    }
    if (!offShelfCourse) return;
    const updated = coursesList.map(c => {
      if (c.id === offShelfCourse.id) {
        return {
          ...c,
          status: '已下架',
          offShelfReason
        };
      }
      return c;
    });
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast(`课程 "${offShelfCourse.name}" 已成功下架`);
    setIsOffShelfModalOpen(false);
    setOffShelfCourse(null);
    setOffShelfReason('');
  };

  const filteredCourses = coursesList.filter(c => {
    const query = courseSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
  });

  return (
    <div className="-m-6 p-6 bg-gradient-to-b from-[#ffe2d1] via-[#fff8f5] to-[#ffffff] min-h-full space-y-8 pb-12 relative flex-1">
      {/* Toast */}
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

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#fa541c] rounded-2xl overflow-hidden shadow-lg group h-auto md:h-[165px]">
        
        {/* Diagonal light rays */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
           <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,#ffffff_40px,#ffffff_80px)]"></div>
        </div>
        
        {/* Background Arrows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -bottom-20 left-[25%] w-[450px] h-[450px] opacity-10 transform rotate-45 text-white" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 100,50 70,50 70,100 30,100 30,50 0,50" />
          </svg>
          <svg className="absolute top-[10%] left-[50%] w-[250px] h-[250px] opacity-[0.08] transform rotate-45 text-white" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 100,50 70,50 70,100 30,100 30,50 0,50" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row h-full">
          <div className="p-5 md:py-6 md:pl-10 w-full flex flex-col justify-center">
            {/* Bold slanted Title */}
            <div className="transform -skew-x-12 origin-left mb-2 flex flex-wrap items-end gap-3 md:gap-5">
              <h1 className="text-2xl md:text-[30px] font-black text-white leading-none drop-shadow-[2px_3px_0px_rgba(212,56,13,0.5)] italic tracking-wider">
                欢迎回来，张老师
              </h1>
              <h2 className="text-lg md:text-[22px] font-bold text-white/90 leading-none drop-shadow-[1px_2px_0px_rgba(212,56,13,0.5)] italic tracking-wide">
                智云实战教学空间
              </h2>
            </div>
            
            {/* White highlighted Subtitle */}
            <div className="transform -skew-x-12 origin-left mb-2 inline-block max-w-max">
              <div className="bg-gradient-to-r from-white via-white to-transparent text-[#fa541c] text-xs md:text-sm font-black pl-6 pr-12 py-1 md:py-1.5">
                <span className="transform skew-x-12 block italic tracking-wide">带你轻松管理今日教学任务</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>



      {/* Teaching Tools */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-neutral-title flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            教学利器
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {teachingTools.map((tool, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (tool.path !== '#') {
                  navigate(tool.path);
                } else {
                  showToast(`"${tool.title}" 功能模块正在升级配置中...`);
                }
              }}
              className={cn(
                "p-5 rounded-2xl border flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group bg-white",
                tool.bgGradient,
                tool.borderClass,
                tool.shadowColor
              )}
            >
              {/* Microsoft Glassmorphism Icon container */}
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-white/90 border border-white shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.85)] overflow-hidden group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {/* Visual refraction element - blurry backing sphere */}
                <div className={cn("absolute inset-2 blur-[3px] rounded-full opacity-20 pointer-events-none", tool.iconBg)}></div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/60 blur-[1px] pointer-events-none"></div>
                <tool.icon className={cn("w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.08)] relative z-10", tool.iconTextColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={cn("font-bold text-sm tracking-wide truncate group-hover:text-[#fa541c] transition-colors", tool.titleColor)}>{tool.title}</h4>
                <p className={cn("text-[11px] mt-0.5 leading-tight truncate", tool.descColor)}>{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Management - Table Layout */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="border-b border-neutral-border/50 px-6 pt-4 flex gap-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveSubTab('course')}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'course' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            课程
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('project');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'project' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            项目
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('dataset');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'dataset' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            数据集
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('exam');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'exam' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            考试
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('practice');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'practice' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            最佳实践
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('aicenter');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'aicenter' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            ai能力中心
          </button>
        </div>
        {activeSubTab === 'course' ? (
          <div className="flex flex-col h-full text-left p-5">
            {/* Top Actions - Spacing and alignment matching TeacherDatasets */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    type="text" 
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    placeholder="搜索课程名称/代码" 
                    className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-9 bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => { 
                    setEditingCourse(null); 
                    setCourseFormName('');
                    setCourseFormMajor('');
                    setCourseFormTags([]);
                    setIsCourseTagDropdownOpen(false);
                    setCourseFormDesc('');
                    setSelectedCover(defaultCovers[0]); 
                    setCourseFormIntroduction('');
                    setCourseModalMode('create'); 
                    setIsCourseModalOpen(true); 
                  }} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 h-9 text-[13px] shadow-sm shrink-0 border-0 cursor-pointer font-bold flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> 新建课程
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
                        <th className="p-4 font-medium w-[30%]">课程信息</th>
                        <th className="p-4 font-medium w-[14%]">授课教师</th>
                        <th className="p-4 font-medium w-[14%]">课程范围</th>
                        <th className="p-4 font-medium w-[14%]">状态</th>
                        <th className="p-4 font-medium w-[14%]">审核状态</th>
                        <th className="p-4 font-medium w-[14%]">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course, index) => (
                        <tr key={course.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredCourses.length - 1 && "border-b-0")}>
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-neutral-200/60 shadow-xs relative bg-neutral-100">
                                <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => navigate(`/teacher/course/${course.id}`)}
                                  className="bg-transparent border-0 p-0 text-left font-medium text-neutral-800 hover:text-[#fa541c] transition-colors cursor-pointer"
                                >
                                  {course.name}
                                </button>
                                <div className="text-xs text-neutral-500 font-mono mt-0.5">{course.code}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-600">
                            <div className="text-neutral-800 font-medium">{course.teacher}</div>
                          </td>
                          <td className="p-4">
                            {course.scope === '平台' ? (
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[12px] border border-orange-200 font-medium">{course.scope}</span>
                            ) : course.scope === '租户' ? (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[12px] border border-blue-200 font-medium">{course.scope}</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[12px] border border-neutral-200 font-medium">{course.scope}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-0.5 text-[12px] rounded border font-medium", 
                              course.status === '已发布' ? "bg-orange-50 text-orange-600 border-orange-200" : 
                              course.status === '已下架' ? "bg-neutral-100 text-neutral-600 border-neutral-200" : 
                              "bg-rose-50 text-rose-600 border-rose-200"
                            )}>
                              {course.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {course.auditStatus === '已通过' && (
                              <span className="text-emerald-600 font-medium">已通过</span>
                            )}
                            {course.auditStatus === '待审核' && (
                              <span className="text-[#fa541c] font-medium">待审核</span>
                            )}
                            {course.auditStatus === '已驳回' && (
                              <span className="text-rose-600 font-medium">已驳回</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <button onClick={() => navigate(`/teacher/course/${course.id}`)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium rounded-[4px]">查看</button>
                              <button 
                                onClick={() => handleOpenCourseDetail(course)}
                                className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium rounded-[4px]"
                              >
                                详情
                              </button>

                              {/* Dropdown for other options */}
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveCourseDropdownId(activeCourseDropdownId === course.id ? null : course.id);
                                  }}
                                  className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium flex items-center gap-0.5 rounded-[4px]"
                                >
                                  更多 <ChevronDown className="w-3 h-3" />
                                </button>
                                {activeCourseDropdownId === course.id && (
                                  <div className="absolute right-0 mt-1.5 bg-white border border-neutral-200 rounded-[4px] shadow-lg py-1 z-30 min-w-[120px] text-left animate-in fade-in slide-in-from-top-1 duration-150">
                                    <button 
                                      onClick={() => {
                                        setActiveCourseDropdownId(null);
                                        if (course.scope === '租户' || course.scope === '平台') return;
                                        setEditingCourse(course);
                                        setCourseFormName(course.name);
                                        setCourseFormMajor(course.major || '人工智能');
                                        setCourseFormTags(course.tags ? course.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
                                        setIsCourseTagDropdownOpen(false);
                                        setCourseFormDesc(course.desc);
                                        setSelectedCover(course.image);
                                        setCourseFormIntroduction(course.introduction || '');
                                        setCourseModalMode('edit');
                                        setIsCourseModalOpen(true);
                                      }} 
                                      disabled={course.scope === '租户' || course.scope === '平台'}
                                      className={cn(
                                        "w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all font-medium",
                                        (course.scope === '租户' || course.scope === '平台') 
                                          ? "text-neutral-400 cursor-not-allowed hover:bg-transparent" 
                                          : "text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50"
                                      )}
                                    >
                                      编辑
                                    </button>
                                    {course.status === '草稿' ? (
                                      <button 
                                        onClick={() => {
                                          setConfirmDialog({
                                            show: true,
                                            title: '确认发布课程',
                                            message: `确定要发布课程 "${course.name}" 吗？发布后选课学生将可见该课程。`,
                                            onConfirm: () => handlePublishCourse(course.id)
                                          });
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                      >
                                        发布
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          setConfirmDialog({
                                            show: true,
                                            title: '确认取消发布',
                                            message: `确定要取消发布课程 "${course.name}" 吗？取消发布后学生将无法访问该课程。`,
                                            onConfirm: () => handleCancelPublishCourse(course.id)
                                          });
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                      >
                                        取消发布
                                      </button>
                                    )}
                                    {course.scope === '私有' && (
                                      <button 
                                        onClick={() => {
                                          setApplyPublicCourse(course);
                                          setApplyReason('');
                                          setApplyRange('租户');
                                          setIsApplyPublicModalOpen(true);
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                      >
                                        申请公开
                                      </button>
                                    )}
                                    {course.status === '已下架' ? (
                                      <button 
                                        onClick={() => {
                                          setConfirmDialog({
                                            show: true,
                                            title: '确认重新上架课程',
                                            message: `确定要重新上架课程 "${course.name}" 吗？重新上架后选课学生将恢复可见。`,
                                            onConfirm: () => handlePublishCourse(course.id)
                                          });
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                      >
                                        重新上架
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          setOffShelfCourse(course);
                                          setOffShelfReason('');
                                          setIsOffShelfModalOpen(true);
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                      >
                                        下架
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleCopyCourse(course)}
                                      className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                    >
                                      复制
                                    </button>
                                    <div className="h-[1px] bg-neutral-100 my-0.5"></div>
                                    <button 
                                      onClick={() => {
                                        if (course.scope === '租户' || course.scope === '平台') return;
                                        setConfirmDialog({
                                          show: true,
                                          title: '确认删除课程',
                                          message: `确定要删除课程 "${course.name}" 吗？该操作不可撤销。`,
                                          onConfirm: () => handleDeleteCourse(course.id)
                                        });
                                      }}
                                      disabled={course.scope === '租户' || course.scope === '平台'}
                                      className={cn(
                                        "w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 block transition-all cursor-pointer font-medium",
                                        (course.scope === '租户' || course.scope === '平台') 
                                          ? "text-neutral-400 cursor-not-allowed hover:bg-transparent" 
                                          : "text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50"
                                      )}
                                    >
                                      删除
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredCourses.length === 0 && (
                    <div className="p-12 text-center text-neutral-caption">
                      暂无符合条件的课程
                    </div>
                  )}
                </div>
              </div>
              
              {/* Standalone Bottom Pagination Bar - Matching Dataset Module */}
              <div className="py-2 px-1 flex items-center justify-end gap-3 text-xs text-neutral-500 shrink-0 select-none">
                <span>共 {filteredCourses.length} 条</span>
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
          </div>
        ) : activeSubTab === 'project' ? (
          <TeacherProjects 
            embedded={true} 
            defaultCourseId={selectedCourseId} 
            defaultCourseName={selectedCourseName}
            onBackToCourses={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('course');
            }}
          />
        ) : activeSubTab === 'dataset' ? (
          <TeacherDatasets 
            embedded={true} 
            defaultCourseId={selectedCourseId}
            defaultCourseName={selectedCourseName}
          />
        ) : activeSubTab === 'practice' ? (
          <TeacherPractices embedded={true} />
        ) : activeSubTab === 'aicenter' ? (
          <TeacherAICenter embedded={true} />
        ) : (
          <TeacherExams embedded={true} />
        )}
      </div>

      {/* Course Dialog (Create/Edit/Detail Drawer) */}
      {isCourseModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
          onClick={() => setIsCourseModalOpen(false)}
        >
          <div 
            key={courseModalMode + (editingCourse?.id || '')}
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                {courseModalMode === 'create' ? (
                  <Plus className="w-5 h-5 text-[#fa541c]" />
                ) : courseModalMode === 'edit' ? (
                  <Edit className="w-5 h-5 text-[#fa541c]" />
                ) : (
                  <FileText className="w-5 h-5 text-[#fa541c]" />
                )} 
                {courseModalMode === 'create' ? '新建课程' : courseModalMode === 'edit' ? '编辑课程' : '课程详情'}
              </h2>
              <button 
                onClick={() => setIsCourseModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Forms */}
            {courseModalMode === 'detail' ? (
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px] text-left">
                {/* 1. 课程名称 (参照编辑模块) */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    课程名称：
                  </label>
                  <div className="text-sm font-bold text-neutral-800 border border-neutral-200/80 bg-neutral-50/30 rounded-[4px] p-3 leading-relaxed">
                    {courseFormName}
                  </div>
                </div>

                {/* 2. 标签 (参照编辑模块) */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-1.5">
                    课程标签：
                  </label>
                  <div className="min-h-[38px] border border-neutral-200/80 rounded-[4px] p-2 bg-neutral-50/20 flex flex-wrap gap-1.5 items-center">
                    {courseFormTags.length === 0 ? (
                      <span className="text-neutral-400 text-xs italic px-1">未设定标签</span>
                    ) : (
                      courseFormTags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold border bg-neutral-50 text-neutral-600 border-neutral-200 select-none"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                          <span>{tag}</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. 课程描述 (参照编辑模块) */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    课程描述：
                  </label>
                  <div className="text-xs text-neutral-700 bg-neutral-50/30 border border-neutral-200/80 rounded-[4px] p-3.5 leading-relaxed whitespace-pre-wrap min-h-[80px]">
                    {courseFormDesc || '暂无描述信息'}
                  </div>
                </div>

                {/* 4. 课程封面 (参照编辑模块) */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    课程封面：
                  </label>
                  <div className="max-w-[280px] aspect-[5/2] rounded-[6px] overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 relative group">
                    <img 
                      src={selectedCover || editingCourse?.image} 
                      alt="Course cover preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                      当前选中封面
                    </div>
                  </div>
                </div>

                {/* 5. 课程介绍 (参照编辑模块) */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    课程介绍：
                  </label>
                  <div className="border border-neutral-200/80 rounded-[4px] overflow-hidden flex flex-col bg-white">
                    <div className="px-3.5 py-2 border-b border-neutral-200 bg-neutral-50/60 font-bold text-neutral-700 text-xs flex items-center justify-between select-none">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#fa541c]" />
                        富文本介绍预览
                      </span>
                      <span className="text-[11px] font-normal text-neutral-400">只读视图</span>
                    </div>
                    <div className="p-4 text-xs text-neutral-800 leading-relaxed min-h-[140px] whitespace-pre-wrap bg-neutral-50/10">
                      {courseFormIntroduction || '暂无课程详细介绍'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                
                {/* 1. 课程名称 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    课程名称 <span className="text-[#fa541c]">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626]" 
                    value={courseFormName}
                    onChange={(e) => setCourseFormName(e.target.value)}
                    placeholder="请输入课程名称" 
                    autoFocus={courseModalMode === 'create'} 
                  />
                </div>

                {/* 2. 标签 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    标签 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div ref={courseTagDropdownRef} className="relative w-full text-[13px]">
                    <div
                      onClick={() => setIsCourseTagDropdownOpen(!isCourseTagDropdownOpen)}
                      className={cn(
                        "min-h-[38px] w-full border rounded-[4px] px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all text-[#262626] bg-white cursor-pointer select-none",
                        isCourseTagDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      {courseFormTags.length === 0 ? (
                        <span className="text-neutral-400 select-none">请选择课程标签</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 items-center w-full pr-8">
                          {courseFormTags.map(tag => (
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
                                  setCourseFormTags(courseFormTags.filter(t => t !== tag));
                                }}
                                className="hover:bg-black/10 rounded-[4px] p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center border-0 bg-transparent"
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
                          className={cn("w-4 h-4 transition-transform duration-200 text-neutral-400", isCourseTagDropdownOpen && "rotate-180")} 
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isCourseTagDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* List of tag options */}
                        <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                          {availableCourseTagsList.map(tag => {
                            const isSelected = courseFormTags.includes(tag);
                            return (
                              <div
                                key={tag}
                                onClick={() => {
                                  if (isSelected) {
                                    setCourseFormTags(courseFormTags.filter(t => t !== tag));
                                  } else {
                                    setCourseFormTags([...courseFormTags, tag]);
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

                {/* 3. 课程描述 */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    课程描述 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea 
                    className="w-full min-h-[100px] border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none" 
                    value={courseFormDesc}
                    onChange={(e) => setCourseFormDesc(e.target.value)}
                    placeholder="请输入课程描述"
                  ></textarea>
                </div>

                {/* 4. 课程封面 */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-1.5">
                    课程封面 <span className="text-[#fa541c]">*</span>
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
                          <div className="absolute top-1.5 right-1.5 bg-[#fa541c] text-white rounded-full p-0.5 shadow-md flex items-center justify-center w-5 h-5 animate-in zoom-in-50 duration-150">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. 课程介绍 */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    课程介绍 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="border border-neutral-200 rounded-[4px] overflow-hidden flex flex-col bg-white w-full">
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
                      placeholder="请输入课程介绍内容"
                      value={courseFormIntroduction}
                      onChange={(e) => setCourseFormIntroduction(e.target.value)}
                      className="w-full min-h-[160px] p-4 text-[13px] focus:outline-none resize-none leading-relaxed text-[#262626] border-0"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              {courseModalMode === 'detail' ? (
                <Button 
                  onClick={() => setIsCourseModalOpen(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                >
                  关闭
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsCourseModalOpen(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleSaveCourse} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                  >
                    确认
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply for Public Drawer */}
      {isApplyPublicModalOpen && applyPublicCourse && (
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
                申请公开课程资源
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
                    申请公开后，课程需经过超管审核。审核通过将加入对应范围的公共课程库，相应师生可见可用。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">课程名称</label>
                  <input 
                    type="text" 
                    value={applyPublicCourse.name} 
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
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有班级可见' },
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
                    placeholder="请简述申请公开该课程的理由或推荐使用场景..."
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
                onClick={handleApplyPublic} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                提交申请
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 下架课程 Drawer/Modal */}
      {isOffShelfModalOpen && offShelfCourse && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
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
                下架课程资源
              </h2>
              <button 
                onClick={() => setIsOffShelfModalOpen(false)} 
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
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">下架后课程将暂不对选课师生公开</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    下架课程后，该课程资源将从公共课程库和选课列表中隐藏。已有选课记录的班级保留历史学习数据，但无法发起新的选课或创建班级。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">课程名称</label>
                  <input 
                    type="text" 
                    value={offShelfCourse.name} 
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
                    placeholder="请简述下架该课程的具体原因及后续安排..."
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
                onClick={handleOffShelf} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认下架
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
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
