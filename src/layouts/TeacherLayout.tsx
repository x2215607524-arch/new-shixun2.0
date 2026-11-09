import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { GraduationCap, User, LayoutDashboard, ChevronDown, HelpCircle, FileText, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeacherLayout() {
  const location = useLocation();
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<'人工智能' | '网络仿真'>('人工智能');
  useEffect(() => {
    const scene = location.state?.scene;
    if (scene === '人工智能' || scene === '网络仿真') setActiveModule(scene);
  }, [location.state?.scene]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModuleMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const navItems = [
    { name: "首页", path: "/teacher", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8]">
      {/* Dark Header */}
      <header className="h-14 bg-[#1f1f1f] text-white flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-6 h-full">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="w-6 h-6 bg-[#fa541c] rounded-[4px] flex items-center justify-center text-white font-bold text-xs">
              翼
            </div>
            <span className="text-[16px] font-medium tracking-wide">
              翼实训平台
            </span>
          </Link>
          
          {/* Top Navigation */}
          <nav className="hidden md:flex items-center h-full gap-1">
            {/* Module Switcher */}
            <div className="relative h-full flex items-center mr-2" ref={dropdownRef}>
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-white font-medium" 
                onClick={() => setIsModuleMenuOpen(!isModuleMenuOpen)}
              >
                <span className="text-[14px]">{activeModule}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isModuleMenuOpen ? "rotate-180" : "")} />
              </div>
              
              {/* Dropdown Menu */}
              {isModuleMenuOpen && (
                <div className="absolute top-12 left-0 w-32 bg-[#1f1f1f] border border-gray-800 rounded-md shadow-xl py-1 z-50">
                  <div className="flex flex-col">
                    {(['人工智能', '网络仿真'] as const).map(module => (
                      <button
                        key={module}
                        type="button"
                        className={cn("flex items-center px-4 py-2.5 text-left text-sm border-0 cursor-pointer hover:text-white hover:bg-white/10 transition-colors", activeModule === module ? "bg-white/10 text-white" : "bg-transparent text-gray-300")}
                        onClick={() => { setActiveModule(module); setIsModuleMenuOpen(false); }}
                      >
                        {module}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/teacher' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "h-full flex items-center gap-2 px-3 text-[14px] font-medium transition-colors relative",
                    isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fa541c]" />
                  )}
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-2">
            <Link to="/teacher/logs" className="text-gray-300 hover:text-white cursor-pointer transition-colors relative group block" title="操作日志">
              <FileText className="w-5 h-5" />
              {/* Premium custom floating tooltip */}
              <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 bg-[#1f1f1f] text-white text-[10px] px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-800 z-50">
                操作日志
              </span>
            </Link>
            <div className="text-gray-300 hover:text-white cursor-pointer transition-colors" title="帮助教程">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="relative" ref={profileRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="w-7 h-7 bg-[#fa541c] rounded-full flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-200">张老师</span>
              <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200 ml-1", isProfileMenuOpen ? "rotate-180" : "")} />
            </div>

            {isProfileMenuOpen && (
              <div className="absolute top-12 right-0 w-36 bg-[#1f1f1f] border border-gray-800 rounded-md shadow-xl py-1 z-50">
                <div className="flex flex-col">
                  <Link 
                    to="/teacher/center" 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    个人中心
                  </Link>
                  <Link 
                    to="/login/teacher" 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-t border-gray-800"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        <main className={cn(
          "flex flex-col flex-1 overflow-auto bg-[#f5f6f8]",
          (location.pathname.startsWith("/teacher/center") || 
           location.pathname.startsWith("/teacher/dataset") || 
           location.pathname.includes("/experiment/")) ? "p-0" : "p-6"
        )}>
          <Outlet context={{ activeModule }} />
        </main>
      </div>
    </div>
  );
}
