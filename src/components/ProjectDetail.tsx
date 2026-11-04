import React, { useState, useRef } from 'react';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, CheckCircle2, FileText, Code, CheckSquare, List, Activity, Settings, Eye, Play, Users, Download, ChevronDown, Copy, Folder, Info, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ProjectData {
  title: string;
  desc: string;
  image: string;
  participants: string;
  rating: number;
  favorites?: number;
  difficulty: string;
  tags: string[];
  status: string;
  introduction?: string;
}

interface ProjectDetailProps {
  project: ProjectData;
  onBack: () => void;
  onStart?: () => void;
}

export default function ProjectDetail({ project, onBack, onStart }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('intro');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('v0.1.1');

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const downloadTimerRef = useRef<any>(null);

  const handleDownloadSource = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
    
    downloadTimerRef.current = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
          setTimeout(() => {
            setIsDownloading(false);
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 11) + 8;
        return next > 100 ? 100 : next;
      });
    }, 150);
  };

  const cancelDownload = () => {
    if (downloadTimerRef.current) {
      clearInterval(downloadTimerRef.current);
    }
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f5f5] flex flex-col font-sans -mx-6 -mt-6 -mb-6">
      {/* Header Section */}
      <div className="relative pt-6 pb-8 px-8 md:px-14">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={project.image} 
            alt="Project Banner" 
            className="w-full h-full object-cover opacity-20 filter blur-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff2e8]/95 to-[#ffd8bf]/90"></div>
          
          {/* Decorative background elements moved inside the overflow-hidden container */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none z-0"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-start">


          <div className="flex-1 w-full">
            {/* Breadcrumb & Actions */}
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex items-center text-[13px] text-neutral-caption">
                <button onClick={onBack} className="hover:text-[#fa541c] flex items-center gap-1 font-medium transition-colors">
                  <ChevronLeft className="w-4 h-4" /> 返回
                </button>
                <span className="mx-2">/</span>
                <span className="hover:text-[#fa541c] cursor-pointer transition-colors">全部项目</span>
                <span className="mx-2">/</span>
                <span className="text-neutral-title font-bold">{project.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[13px] font-medium border shadow-sm",
                    isFavorited 
                      ? "bg-[#fa541c]/10 border-[#fa541c]/30 text-[#fa541c] hover:bg-[#fa541c]/20" 
                      : "bg-white/50 hover:bg-white text-neutral-title border-neutral-200/20"
                  )}
                >
                  <Star className={cn("w-4 h-4 transition-transform active:scale-95", isFavorited ? "text-[#fa541c] fill-[#fa541c]" : "")} /> 
                  {isFavorited ? '已收藏' : '收藏'}
                </button>
              </div>
            </div>

            {/* Title & Meta */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px] font-medium">
                  官方认证
                </span>
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px] font-medium">
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px] font-medium">
                  {project.difficulty}
                </span>
              </div>

              <p className="text-[14px] text-neutral-700 mb-4 leading-relaxed max-w-3xl bg-white/40 p-3 rounded-[8px] border border-white/50 backdrop-blur-sm">
                {project.desc}
              </p>

              {/* Favorites & Enrollment & Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-[10px] shadow-sm border border-neutral-200/50">
                  <div className="flex items-center gap-2">
                    <Star className={cn("w-4 h-4 transition-colors", isFavorited ? "text-[#fa541c] fill-[#fa541c]" : "text-neutral-500")} />
                    <span className="text-[13px] text-neutral-600 font-medium">
                      <span className="text-[#fa541c] font-bold">
                        {(project.favorites || (project.rating > 10 ? project.rating : Math.floor(project.rating * 100))) + (isFavorited ? 1 : 0)}
                      </span> 人收藏
                    </span>
                  </div>
                  <div className="w-px h-5 bg-neutral-200"></div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span className="text-[13px] text-neutral-600 font-medium"><span className="text-[#fa541c] font-bold">{project.participants}</span> 人已参与</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-8 flex gap-6 items-start">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-[12px] shadow-sm p-1 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {[
                { id: 'intro', label: '项目介绍' },
                { id: 'source', label: '源码' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-3 rounded-[8px] text-[15px] font-medium transition-all flex items-center",
                    activeTab === tab.id ? "text-[#fa541c] bg-[#fff2e8]" : "text-neutral-body hover:text-neutral-title hover:bg-neutral-bg"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {activeTab === 'source' && (
                <button 
                  onClick={handleDownloadSource}
                  className="flex items-center gap-1.5 px-3 py-1 border border-neutral-200 rounded-[4px] hover:text-[#fa541c] hover:border-[#fa541c]/30 text-neutral-500 bg-white hover:bg-[#fff2e8] transition-colors text-[13px] font-semibold cursor-pointer h-7"
                  title="下载源码"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载源码</span>
                </button>
              )}

              <div className="relative">
                <div 
                  onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                  className="flex items-center gap-1 text-neutral-500 cursor-pointer hover:text-neutral-900 transition-colors pr-4 select-none"
                >
                  <span className="text-[14px] text-neutral-400">版本：</span>
                  <span className="text-[14px] text-neutral-500 mr-1">{selectedVersion}</span>
                  <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform duration-200", isVersionDropdownOpen ? "rotate-180" : "")} />
                </div>
                {isVersionDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsVersionDropdownOpen(false)}></div>
                    <div className="absolute right-4 top-8 bg-white border border-neutral-100 rounded-lg shadow-lg py-1.5 min-w-[100px] z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                      {['v0.1.1', 'v0.1.0', 'v0.0.9'].map((ver) => (
                        <button
                          key={ver}
                          onClick={() => {
                            setSelectedVersion(ver);
                            setIsVersionDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-[13px] hover:bg-neutral-50 transition-colors",
                            selectedVersion === ver ? "text-[#fa541c] font-bold" : "text-neutral-700"
                          )}
                        >
                          {ver}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Intro Section */}
          {activeTab === 'intro' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[16px] shadow-sm p-8">
                <h2 className="text-lg font-bold text-neutral-title mb-4">项目介绍</h2>
                <p className="text-[14px] text-neutral-body leading-relaxed mb-6 whitespace-pre-wrap break-words">
                  {project.introduction || project.desc}
                </p>
                <div className="bg-[#fafafa] rounded-[12px] p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "掌握实战项目开发流程",
                    "学习主流模型构建与调试",
                    "理解真实业务场景数据特征",
                    "提升全栈/AI应用独立开发能力"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-neutral-body text-[14px]">
                       <CheckCircle2 className="w-4 h-4 text-[#fa541c]" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Source Code Section */}
          {activeTab === 'source' && (
            <div className="bg-white rounded-[16px] shadow-sm flex overflow-hidden border border-neutral-border h-[700px] animate-in fade-in duration-300">
              <div className="w-64 border-r border-neutral-border flex flex-col bg-white shrink-0">
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <Folder className="w-4 h-4 text-[#faad14] fill-current opacity-80" /> .vscode
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <Folder className="w-4 h-4 text-[#faad14] fill-current opacity-80" /> results
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <Folder className="w-4 h-4 text-[#faad14] fill-current opacity-80" /> src
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-neutral-300 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">T</div> .gitignore
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-purple-400 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">M</div> _overview.md
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-[#fa541c] text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">J</div> _readme.ipynb
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-pink-400 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">Y</div> app_spec.yml
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-[#fa541c] text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">J</div> coding_here.ipynb
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> handler.py
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-neutral-300 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">T</div> LICENSE
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-[#fa541c] text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">J</div> Main.ipynb
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> preproduction.py
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-neutral-300 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">T</div> project_requirements.txt
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-[#f5f6f8] rounded cursor-pointer text-[14px] text-neutral-title font-medium border-l-2 border-[#fa541c] -ml-2 pl-3">
                      <div className="w-4 h-4 bg-purple-400 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">M</div> readme.md
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> showEmbedding.py
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> showLSTM.py
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 flex flex-col bg-white overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-24 bg-[#fff2e8] rounded-full flex items-center justify-end pr-1 cursor-pointer z-10 border border-[#ffd8bf] shadow-sm">
                  <ChevronLeft className="w-4 h-4 text-[#fa541c]" />
                </div>
                <div className="h-12 border-b border-neutral-100 flex items-center justify-between px-6 shrink-0">
                  <div className="text-[14px] text-[#fa541c]">master <span className="text-neutral-caption mx-1">/</span> <span className="text-[#fa541c]">readme.md</span></div>
                </div>
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold text-neutral-title mb-10">SOL模拟器</h1>
                    <h2 className="text-2xl font-bold text-neutral-title mb-6">简介</h2>
                    <p className="text-[16px] text-neutral-title leading-loose mb-12">
                      本项目是基于GloVe（求取Embedding）和LSTM（训练生成器）制作的SOL对话模拟器，模拟SOL在群里的对话方式。<br/>
                      如果有机会的话，后续会制作成QQ插件。
                    </p>
                    <h2 className="text-2xl font-bold text-neutral-title mb-8">来自网络的语料库</h2>
                    <p className="text-[15px] text-neutral-title leading-loose mb-6">
                      https://github.com/codemayq/chinese_chatbot_corpus
                    </p>
                    <div className="border border-neutral-100 rounded overflow-hidden">
                      <table className="w-full text-left text-[14px]">
                        <thead className="bg-white border-b border-neutral-100">
                          <tr>
                            <th className="px-4 py-4 font-bold text-neutral-title border-r border-neutral-100 w-32 text-center">名称</th>
                            <th className="px-4 py-4 font-bold text-neutral-title border-r border-neutral-100 w-24 text-center">数量</th>
                            <th className="px-4 py-4 font-bold text-neutral-title text-center">SOL的奇妙手工打分</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">chatterbot</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">560</td>
                            <td className="px-4 py-4">8（翻译有问题，但是内容都是对上的）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">douban</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">3.520M</td>
                            <td className="px-4 py-4">2（牛头不对马嘴）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">ptt</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">0.4M</td>
                            <td className="px-4 py-4">8（八卦太多了，好吧毕竟是八卦语料库，不过好像没怎么参与训练？）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">qingyun</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">0.1M</td>
                            <td className="px-4 py-4">5（部分内容无关）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">subtitle</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">2.74M</td>
                            <td className="px-4 py-4">8（语言通顺性还行，不过不是对话）</td>
                          </tr>
                          <tr className="hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">tieba</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">2.32M</td>
                            <td className="px-4 py-4">6（语言通顺性还行，但是足球实在太多了）</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Project Metadata */}
        <div className="w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full aspect-[4/3] object-cover rounded-[8px] mb-6" 
              referrerPolicy="no-referrer"
            />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-[#fa541c] font-medium text-[18px]">
                <div className="w-[3px] h-4 bg-[#fa541c] rounded-full"></div>
                项目
              </div>
              <div className="flex items-center text-[15px] text-neutral-500">
                <Star className="w-4 h-4 mr-1.5" /> 4 
                <span className="w-1 h-1 bg-neutral-300 rounded-full mx-2.5"></span>
                <Clock className="w-4 h-4 mr-1.5" /> 2022/12/01
              </div>
            </div>
            {onStart && <Button
              onClick={onStart}
              className="w-full h-12 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[6px] font-bold text-[18px] transition-colors shadow-sm flex items-center justify-center gap-2 border-0 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>启动项目</span>
            </Button>}
          </div>
        </div>
      </div>

      {/* Downloading Progress Modal */}
      {isDownloading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                正在下载源码
              </h2>
              <button 
                onClick={cancelDownload} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex items-start gap-3 bg-white">
              <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5 animate-pulse">!</div>
              <div className="flex-1 text-[14px] text-neutral-750 leading-normal">
                <div>正在为您打包并下载项目源码，请勿关闭页面...</div>
                
                {/* Progress Bar */}
                <div className="mt-4 w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#fa541c] h-full transition-all duration-150 ease-out" 
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>下载进度</span>
                  <span className="text-[#fa541c] font-bold">{downloadProgress}%</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={cancelDownload} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
