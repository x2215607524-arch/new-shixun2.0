import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";
import { 
  Book, 
  MonitorPlay, 
  FileText, 
  Trophy, 
  Swords, 
  Cloud, 
  Code,
  Menu,
  ChevronDown,
  FolderOpen,
  Search,
  Maximize,
  User as UserIcon,
  LayoutDashboard,
  Users,
  Database,
  FolderKanban,
  Brain,
  Shield,
  Server,
  Laptop,
  Network,
  Key,
  Settings,
  Bell,
  Star,
  CheckSquare,
  Globe,
  Building,
  Activity,
  Zap,
  Clock,
  Webcam,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string }[];
}

interface DashboardLayoutProps {
  type: "user" | "admin";
}

export default function DashboardLayout({ type }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const [isAnswering, setIsAnswering] = React.useState(!!(window as any).__IS_ANSWERING__);
  const [examTimeLeft, setExamTimeLeft] = React.useState((window as any).__EXAM_TIME_LEFT__ || 600);

  const formatExamTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  React.useEffect(() => {
    const handleAnsweringChange = () => {
      setIsAnswering(!!(window as any).__IS_ANSWERING__);
      setExamTimeLeft((window as any).__EXAM_TIME_LEFT__ || 600);
    };
    const handleTimeChange = () => {
      setExamTimeLeft((window as any).__EXAM_TIME_LEFT__ || 600);
    };
    window.addEventListener("answering-state-change", handleAnsweringChange);
    window.addEventListener("answering-time-change", handleTimeChange);
    return () => {
      window.removeEventListener("answering-state-change", handleAnsweringChange);
      window.removeEventListener("answering-time-change", handleTimeChange);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    navigate('/login/user');
  };

  const [isModuleOpen, setIsModuleOpen] = React.useState(false);
  const moduleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moduleRef.current && !moduleRef.current.contains(event.target as Node)) {
        setIsModuleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userItems: NavItem[] = [
    { title: "首页", icon: LayoutDashboard, href: "/user" },
    { title: "最佳实践", icon: Star, href: "/user/practices" },
    { title: "课程", icon: Book, href: "/user/courses" },
    { title: "项目", icon: FolderKanban, href: "/user/projects" },
    { title: "考试", icon: FileText, href: "/user/exams" },
    { title: "数据集", icon: Database, href: "/user/datasets" },
    { 
      title: "AI能力中心", 
      icon: Brain, 
      children: [
        { title: "AI助手", href: "/user/ai/assistant" },
        { title: "数字员工", href: "/user/ai/agents" },
      ]
    },
  ];

  const adminItems: NavItem[] = [
    { title: "人工智能", icon: Brain, href: "/admin/ai" },
    { title: "公有云", icon: Cloud, href: "/admin/public-cloud" },
    { title: "网络仿真", icon: Network, href: "/admin/network-simulation" },
    { title: "审核中心", icon: CheckSquare, href: "/admin/audit" },
    { title: "租户管理", icon: Building, href: "/admin/tenants" },
    { title: "ai配额管理", icon: Activity, href: "/admin/ai-quota" },
    { title: "竞赛管理", icon: Trophy, href: "/admin/competitions" },
    { title: "权限管理", icon: Key, href: "/admin/permissions" },
    { title: "系统管理", icon: Settings, href: "/admin/system" },
  ];

  const mergedModules = [
    { title: "人工智能", icon: Brain, href: "/admin/ai" },
    { title: "公有云", icon: Cloud, href: "/admin/public-cloud" },
    { title: "网络仿真", icon: Network, href: "/admin/network-simulation" },
  ];

  const activeModule = mergedModules.find(m => 
    location.pathname === m.href || location.pathname.startsWith(m.href + "/") || location.pathname.startsWith(m.href)
  ) || mergedModules[0];

  const isAnyModuleActive = mergedModules.some(m => 
    location.pathname === m.href || location.pathname.startsWith(m.href + "/") || location.pathname.startsWith(m.href)
  );

  const items = type === "user" ? userItems : adminItems;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f5f6f8]">
      {/* Header */}
      <header className={cn(
        "h-16 flex items-center justify-between px-8 flex-shrink-0 z-50 transition-colors duration-200",
        isAnswering ? "bg-white border-b border-neutral-200 border-t-[3px] border-t-purple-600 text-neutral-800" : "bg-[#1f1f1f] text-white"
      )}>
        {isAnswering ? (
          /* Answering Header (White background) */
          <>
            {/* Left Side */}
            <div className="flex items-center select-none">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("exit-answering"))}
                className="text-neutral-caption hover:text-neutral-title flex items-center gap-1.5 text-[14px] font-medium border-0 bg-transparent cursor-pointer p-0"
              >
                <span className="text-[16px] font-bold">←</span> 退出
              </button>
              <div className="h-4 w-px bg-neutral-200 mx-4"></div>
              <span className="font-bold text-neutral-800 text-[14px]">
                {(window as any).__EXAM_TITLE__ || "中国电信云网资源管理(三级)云网资源管理(三级)"}
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-neutral-title text-[13px] font-semibold select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Webcam className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                <span className="text-[13px] text-[#262626] font-semibold">正在监控</span>
              </div>

              <div className="border border-[#fa541c] bg-orange-50/5 rounded-[4px] px-3.5 py-1.5 flex items-center gap-2 font-mono font-bold text-[13px] text-[#fa541c] ml-6 shadow-xs select-none">
                <Clock className="w-4 h-4 text-[#fa541c] shrink-0" />
                <span className="font-sans text-[#fa541c] font-medium">距离考试结束：</span>
                <span className="text-[#fa541c]">{formatExamTime(examTimeLeft)}</span>
              </div>

              <div className="flex items-center gap-2 select-none ml-6 font-semibold text-neutral-title text-[13px]">
                <div className="flex items-center justify-center w-7 h-7 rounded-full border border-orange-200 bg-[#fa541c]/5 text-[#fa541c]">
                  <UserIcon className="w-3.5 h-3.5 text-[#fa541c] shrink-0" />
                </div>
                <span>学生1</span>
              </div>
            </div>
          </>
        ) : (
          /* Normal Dark Header */
          <>
            <div className="flex items-center gap-6 h-full">
              <Link to="/" className="flex items-center gap-2 mr-4">
                <ZhiYunLogo className="w-6 h-6 text-[#fa541c]" />
                <span className="text-[16px] font-medium tracking-wide">
                  {type === "admin" ? "智云实训平台" : "智云实训平台(人工智能)"}
                </span>
              </Link>
              
              {/* Top Navigation */}
              {!isAnswering && (
                <nav className="hidden md:flex items-center h-full gap-1">
                  {type === "admin" && (
                    <div className="relative h-full flex items-center mr-2" ref={moduleRef}>
                      <div 
                        className={cn(
                          "h-full flex items-center gap-1.5 px-3 transition-colors cursor-pointer text-white font-medium relative hover:bg-white/10 rounded-md",
                          isAnyModuleActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white"
                        )}
                        onClick={() => setIsModuleOpen(!isModuleOpen)}
                      >
                        <span className="text-[14px]">人工智能</span>
                        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isModuleOpen ? "rotate-180" : "")} />
                        {isAnyModuleActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fa541c]" />
                        )}
                      </div>
                      
                      {/* Dropdown Menu listing all six modules */}
                      {isModuleOpen && (
                        <div className="absolute top-12 left-0 w-40 bg-[#1f1f1f] border border-gray-800 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="flex flex-col">
                            {mergedModules.map((mod) => {
                              const isActive = location.pathname === mod.href || location.pathname.startsWith(mod.href + "/");
                              return (
                                  <Link 
                                    key={mod.href}
                                    to={mod.href} 
                                    className={cn(
                                      "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                                      isActive 
                                        ? "bg-white/5 text-[#fa541c] font-semibold" 
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                    )}
                                    onClick={() => setIsModuleOpen(false)}
                                  >
                                    {mod.title}
                                  </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {items
                    .filter(item => {
                      if (type === "admin") {
                        return !["人工智能", "公有云", "网络仿真"].includes(item.title);
                      }
                      return true;
                    })
                    .map((item) => {
                      if (item.children) {
                        return (
                          <div key={item.title} className="h-full flex items-center relative group cursor-pointer px-3 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 text-[14px] font-medium text-gray-300 group-hover:text-white transition-colors">
                              <item.icon className="w-4 h-4" />
                              {item.title}
                              <ChevronDown className="w-4 h-4" />
                            </div>
                            <div className="absolute top-full left-0 hidden group-hover:block pt-1 min-w-[160px]">
                              <div className="rounded-[6px] border border-neutral-border bg-white p-2 shadow-lg">
                                {item.children.map(child => (
                                  <Link key={child.href} to={child.href} className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">
                                    {child.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href!}
                          className={cn(
                            "h-full flex items-center gap-2 px-3 text-[14px] font-medium transition-colors relative",
                            isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/10"
                          )}
                        >
                          {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fa541c]" />
                          )}
                          <item.icon className="w-4 h-4" />
                          {item.title}
                        </Link>
                      );
                    })}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-5 text-gray-300">
              {isLoggedIn ? (
                <>
                  <Link to="/user/center/messages" className="relative hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Link>
                  <div className="relative group h-full flex items-center">
                    <button className="flex items-center gap-2 hover:text-white transition-colors h-14 px-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full right-0 hidden group-hover:block pt-1 min-w-[140px]">
                      <div className="rounded-[6px] border border-neutral-border bg-white p-2 shadow-lg">
                        {type === "user" && (
                          <>
                            <Link to="/user/center" className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">个人中心</Link>
                            <Link to="/user/persona" className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">用户画像</Link>
                            <Link to="/user/mylearning" className="block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">我的学习</Link>
                            <div className="h-[1px] bg-neutral-border my-1" />
                          </>
                        )}
                        <button onClick={handleLogout} className="w-full text-left block px-3 py-2 hover:bg-[#fff2e8] hover:text-[#fa541c] rounded-[4px] text-[14px] text-neutral-title transition-colors">退出登录</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login/user" className="text-[14px] hover:text-white transition-colors">登录</Link>
                  <Link to="/login/user" className="text-[14px] bg-[#fa541c] hover:bg-[#ff7a45] text-white px-4 py-1.5 rounded-full transition-colors">注册</Link>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      {/* Main Body */}
      <div className="flex flex-1 min-h-0">
        {/* Main Content Area */}
        <main className={cn(
          "flex flex-col min-h-0",
          isAnswering 
            ? "flex-1 bg-[#f5f6f8] overflow-hidden p-0" 
            : cn(
                (location.pathname === "/user/ai/assistant/studio" || location.pathname === "/user/ai/agents/studio" || location.pathname === "/user/ai/agents") ? "flex-1 p-0 bg-[#f5f6f8] overflow-hidden" : "flex-1 bg-[#f5f6f8] overflow-auto",
                (location.pathname === "/user" || location.pathname.startsWith("/user/center") || location.pathname === "/user/mylearning" || location.pathname === "/user/ai/assistant/studio" || location.pathname === "/user/ai/agents/studio" || location.pathname.startsWith("/admin/ai") || location.pathname.startsWith("/admin/audit") || location.pathname.startsWith("/admin/ai-center") || location.pathname.startsWith("/admin/competitions") || location.pathname.startsWith("/admin/system") || location.pathname === "/user/ai/agents") ? "p-0" : "p-6"
              )
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
