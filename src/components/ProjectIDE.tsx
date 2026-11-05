import React, { useState } from 'react';
import { ChevronRight, Star, Plus, Play, Square, RotateCcw, Layers, Cpu, Database, Activity, HardDrive, Download, Eye, FileDigit, ChevronLeft, ChevronDown, Save, Code, Map, Clock, FileText, Check, Search, MessageSquare, List, X, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProjectWorkspaceChecks from '@/components/ProjectWorkspaceChecks';
import { CheckSquare } from 'lucide-react';

interface ProjectIDEProps {
  projectTitle?: string;
  showAIAssistant?: boolean;
  showChecks?: boolean;
  onBack: () => void;
}

export default function ProjectIDE({ onBack, projectTitle, showAIAssistant = true, showChecks = false }: ProjectIDEProps) {
  const [activeTab, setActiveTab] = useState('file'); // file, dataset, toc
  const [datasetTab, setDatasetTab] = useState('public');
  const [importedDatasets, setImportedDatasets] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  
  const [showGpuModal, setShowGpuModal] = useState(false);
  const [isGpuRunning, setIsGpuRunning] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans w-full h-full">
      {/* Top Bar */}
      <div className="h-12 border-b border-neutral-border flex items-center justify-between px-4 shrink-0 bg-[#fafafa]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:text-[#fa541c] text-neutral-title" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" /> 返回
          </div>
          <div className="h-4 w-px bg-neutral-border mx-2"></div>
          <div className="flex items-center gap-2 font-bold text-neutral-title">
            <span>{projectTitle || "新建深度学习项目"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-neutral-body">
            {/* Jupyter Native Buttons Mock */}
            <button className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600" title="Save file"><Save className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600" title="Add cell below"><Plus className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600" title="Run selected cell"><Play className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600" title="Interrupt the kernel"><Square className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600" title="Restart the kernel"><RotateCcw className="w-4 h-4" /></button>
            
            <div className="mx-2 h-4 w-px bg-neutral-border"></div>
            
            <Button variant="outline" size="sm" className="h-8 text-[13px] text-neutral-title hover:bg-neutral-100 mr-2 flex items-center gap-1.5 border-neutral-border">
              <Layers className="w-3.5 h-3.5" /> 收起/展开非Cell块
            </Button>
            
            {isGpuRunning ? (
               <Button size="sm" className="h-8 text-[13px] bg-green-500 hover:bg-green-600 text-white flex items-center gap-1.5 mr-2">
                 <Activity className="w-3.5 h-3.5" /> GPU 运行中
               </Button>
            ) : (
               <Button size="sm" className="h-8 text-[13px] bg-[#fa541c] hover:bg-[#d4380d] text-white flex items-center gap-1.5 mr-2" onClick={() => setShowGpuModal(true)}>
                 <Cpu className="w-3.5 h-3.5" /> 启动 GPU 环境
               </Button>
            )}

            <Button variant="outline" size="sm" className="h-8 text-[13px] text-[#fa541c] border-[#fa541c] hover:bg-[#fff2e8] flex items-center gap-1.5">
              保存为我的项目
            </Button>
          </div>
        </div>
      </div>
      
      {/* Menu Bar */}
      <div className="h-8 border-b border-neutral-border flex items-center px-4 text-[13px] text-neutral-body gap-4 bg-[#f5f6f8] shrink-0">
        <span className="cursor-pointer hover:text-neutral-title">File</span>
        <span className="cursor-pointer hover:text-neutral-title">Edit</span>
        <span className="cursor-pointer hover:text-neutral-title">View</span>
        <span className="cursor-pointer hover:text-neutral-title">Run</span>
        <span className="cursor-pointer hover:text-neutral-title">Kernel</span>
        <span className="cursor-pointer hover:text-neutral-title">Tabs</span>
        <span className="cursor-pointer hover:text-neutral-title">Help</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Icons */}
        <div className="w-16 border-r border-neutral-border flex flex-col items-center py-4 gap-6 text-neutral-caption bg-[#fafafa]">
          <div 
            className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeTab === 'file' ? "text-[#fa541c]" : "hover:text-neutral-title")}
            onClick={() => setActiveTab('file')}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">文件</span>
          </div>
          <div 
            className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeTab === 'dataset' ? "text-[#fa541c]" : "hover:text-neutral-title")}
            onClick={() => setActiveTab('dataset')}
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px]">数据集</span>
          </div>
          <div 
            className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeTab === 'toc' ? "text-[#fa541c]" : "hover:text-neutral-title")}
            onClick={() => setActiveTab('toc')}
          >
            <List className="w-5 h-5" />
            <span className="text-[10px]">目录</span>
          </div>
          {showChecks && <button type="button" aria-pressed={activeTab === 'checks'} onClick={() => setActiveTab('checks')} className={cn("flex flex-col items-center gap-1 cursor-pointer w-full bg-transparent border-0 p-0", activeTab === 'checks' ? "text-[#fa541c]" : "hover:text-neutral-title")}>
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px]">检查项</span>
          </button>}
        </div>

        {/* Left Sidebar - Dynamic Content */}
        <div className="w-72 border-r border-neutral-border flex flex-col bg-white">
          {showChecks && <div className={cn('h-full min-h-0', activeTab !== 'checks' && 'hidden')}><ProjectWorkspaceChecks /></div>}
          {activeTab === 'file' && (
            <div className="flex flex-col h-full bg-[#fafafa]">
              <div className="p-2 text-xs font-bold text-neutral-caption uppercase bg-neutral-100 border-b border-neutral-border">
                项目目录
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="flex items-center gap-1 text-[13px] text-neutral-title font-medium py-1">
                  <ChevronDown className="w-4 h-4" /> root
                </div>
                <div className="pl-6 py-1 text-[13px] text-[#fa541c] hover:bg-neutral-200 cursor-pointer flex items-center gap-2">
                   <div className="w-3 h-3 bg-[#fa541c] rounded-sm shrink-0"></div> main.ipynb
                </div>
                <div className="pl-6 py-1 text-[13px] text-neutral-body hover:bg-neutral-200 cursor-pointer flex items-center gap-2">
                   <FileText className="w-3 h-3 text-neutral-caption shrink-0" /> utils.py
                </div>
                <div className="pl-6 py-1 text-[13px] text-neutral-body hover:bg-neutral-200 cursor-pointer flex items-center gap-2">
                   <Database className="w-3 h-3 text-neutral-caption shrink-0" /> config.json
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dataset' && (
            <div className="flex flex-col h-full bg-white">
              <div className="flex border-b border-neutral-border">
                {[
                  {id: 'public', label: '公开', icon: Database},
                  {id: 'import', label: '导入', icon: Download},
                  {id: 'fav', label: '收藏', icon: Star},
                  {id: 'my', label: '我的', icon: Activity}
                ].map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setDatasetTab(t.id)}
                    className={cn(
                      "flex-1 py-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors border-b-2",
                      datasetTab === t.id ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-caption border-transparent hover:text-neutral-title"
                    )}
                  >
                    <t.icon className="w-4 h-4" />
                    <span className="text-[10px] transform scale-90">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-4 relative">
                  {datasetTab === 'public' && (
                    <>
                      <div className="relative mb-4">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
                        <Input type="text" placeholder="搜索公开数据集..." className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-md text-sm border-0 focus-visible:ring-1 focus-visible:ring-[#fa541c]" />
                      </div>
                      <div className="space-y-3">
                        {[
                          {name: "MNIST Digit Recognizer", desc: "经典手写数字识别公开验证集"},
                          {name: "IMDB Movie Reviews", desc: "自然语言情感分类标准数据集"},
                          {name: "COCO Image 2017", desc: "目标检测巨无霸公开数据集"}
                        ].map((d, i) => (
                          <div onClick={() => setSelectedDataset(d)} key={i} className="p-3 border border-neutral-border rounded hover:border-[#fa541c] hover:shadow-sm cursor-pointer transition-all bg-white group">
                            <div className="text-sm font-bold text-neutral-title mb-1 group-hover:text-[#fa541c]">{d.name}</div>
                            <div className="text-[11px] text-neutral-caption line-clamp-2">{d.desc}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {datasetTab === 'import' && (
                    <>
                      <div className="text-xs text-neutral-body mb-4 font-medium">共 {importedDatasets.length} 个已导入的数据集</div>
                      <div className="space-y-3">
                        {importedDatasets.map((name, i) => (
                            <div key={i} className="p-3 border border-neutral-border rounded bg-[#fafafa]">
                              <div className="text-sm font-bold text-neutral-title mb-2">{name}</div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="h-6 text-[11px] flex-1 bg-white hover:bg-neutral-50 border-neutral-300" onClick={() => setActiveTab('file')}>
                                  <Eye className="w-3 h-3 mr-1" /> 查看文件
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-6 text-[11px] text-red-500 border-red-200 hover:bg-red-50"
                                  onClick={() => {
                                      if(window.confirm("确认要取消导入此数据集吗？该操作立即生效。")){
                                        setImportedDatasets(prev => prev.filter(x => x !== name));
                                      }
                                  }}
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                        ))}
                      </div>
                    </>
                  )}
              </div>
            </div>
          )}
          {activeTab === 'toc' && (
            <div className="flex flex-col h-full p-4">
              <h3 className="text-xs font-bold text-neutral-title tracking-wider border-b border-neutral-border pb-3 mb-3">TOC</h3>
              <div className="text-[13px] text-neutral-body">1. 导入数据</div>
              <div className="text-[13px] text-neutral-body pl-4 mt-2">1.1 查看统计信息</div>
            </div>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-white relative">
          <div className="flex border-b border-neutral-border bg-[#f5f6f8] shrink-0">
            <div className="px-4 py-2 border-r border-neutral-border flex items-center gap-2 bg-white border-t-2 border-t-[#fa541c]">
              <div className="w-3 h-3 bg-[#fa541c] rounded-sm"></div>
              <span className="text-[13px] text-neutral-title">main.ipynb</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-20">
            {selectedDataset ? (
              <div className="p-8 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-title flex items-center gap-3">
                        <Database className="w-6 h-6 text-[#fa541c]" /> {selectedDataset.name}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 shadow-sm">收藏</Button>
                      {!importedDatasets.includes(selectedDataset.name) && (
                        <Button size="sm" className="h-8 bg-[#fa541c] text-white" onClick={() => setImportedDatasets(prev => [...prev, selectedDataset.name])}>
                          导入
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDataset(null)}><X className="w-5 h-5"/></Button>
                    </div>
                </div>
                <div className="border border-neutral-border rounded p-6 bg-[#fafafa]">
                  <h3 className="font-bold text-neutral-title mb-4">概览概括</h3>
                  <p className="text-[14px] text-neutral-body">{selectedDataset.desc}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 max-w-4xl mx-auto w-full">
                {/* Mock Jupyter Cell 1 */}
                <div className="flex gap-4 mb-4 group">
                  <div className="text-[13px] text-neutral-caption font-mono w-12 text-right mt-1 opacity-60">In [1]:</div>
                  <div className="flex-1 bg-[#f5f6f8] border border-neutral-border rounded p-3 font-mono text-[13px]">
                    <span className="text-purple-600">import</span> pandas <span className="text-purple-600">as</span> pd<br/>
                    <span className="text-purple-600">import</span> numpy <span className="text-purple-600">as</span> np<br/>
                    <br/>
                    <span className="text-neutral-500"># Start building your new project</span>
                  </div>
                </div>
                {/* Mock Jupyter Cell 1 Out */}
                {isGpuRunning && (
                   <div className="flex gap-4 mb-4">
                     <div className="text-[13px] text-red-500 font-mono w-12 text-right mt-1 opacity-60">Out [1]:</div>
                     <div className="flex-1 text-[13px] font-mono p-2">
                       Libraries loaded successfully with GPU environment.
                     </div>
                   </div>
                )}
                <div className="flex gap-4 mb-4">
                  <div className="text-[13px] text-neutral-caption font-mono w-12 text-right mt-1 opacity-60">In [ ]:</div>
                  <div className="flex-1 border border-[#1890ff] shadow-[0_0_0_2px_rgba(24,144,255,0.2)] rounded p-3 font-mono text-[13px] bg-white relative">
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#f5f6f8] border-b border-l border-[#1890ff]/20 text-[10px] text-neutral-caption rounded-bl">Python 3</div>
                    <span className="animate-pulse inline-block w-1.5 h-4 bg-black align-middle"></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bottom AI Toolbar */}
            {showAIAssistant && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-neutral-border px-4 py-3 rounded-full z-10">
              <div className="flex items-center gap-2 text-neutral-title font-bold text-[14px] px-2 py-1">
                 <Bot className="w-5 h-5 text-[#fa541c]" /> AI 项目助手
              </div>
              <div className="w-px h-5 bg-neutral-border mx-1"></div>
              <Button variant="outline" size="sm" className="h-8 rounded-full text-[13px] text-neutral-title border-[#fa541c]/30 hover:border-[#fa541c] hover:bg-[#fff2e8] px-4 shadow-sm flex items-center gap-1.5 transition-all">
                <Sparkles className="w-3.5 h-3.5 text-[#fa541c]" /> AI 代码生成
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-full text-[13px] text-neutral-title border-neutral-300 hover:border-[#1890ff] hover:text-[#1890ff] hover:bg-[#e6f4ff] px-4 shadow-sm flex items-center gap-1.5 transition-all">
                <MessageSquare className="w-3.5 h-3.5" /> AI 代码解释
              </Button>
            </div>}
          </div>
        </div>

        {/* Right Sidebar - Monitor */}
        <div className="w-80 border-l border-neutral-border flex flex-col bg-[#fdfdfd] shrink-0">
          <div className="p-4 border-b border-neutral-border flex items-center gap-2 bg-white">
            <Activity className="w-5 h-5 text-[#fa541c]" />
            <h3 className="font-bold text-neutral-title text-[15px]">资源监控</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-bold text-neutral-title flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-500" /> CPU 使用率</span>
                <span className="text-[13px] text-blue-600 font-mono">12.4%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[12%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-bold text-neutral-title flex items-center gap-2"><HardDrive className="w-4 h-4 text-green-500" /> 内存使用</span>
                <span className="text-[13px] text-green-600 font-mono">4.2 / 16 GB</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[26%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-bold text-neutral-title flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#fa541c]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> 
                  GPU 使用率
                </span>
                <span className="text-[13px] text-[#fa541c] font-mono">
                   {isGpuRunning ? '89%' : 'N/A'}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#fa541c]" style={{ width: isGpuRunning ? '89%' : '0%' }}></div>
              </div>
              <div className="text-[11px] text-neutral-caption mt-2 flex justify-between">
                <span>显存: {isGpuRunning ? '14.2 / 16 GB' : '0 / 0 GB'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-7 border-t border-neutral-border bg-neutral-100 flex items-center px-4 justify-between text-[11px] text-neutral-caption shrink-0">
        <div className="flex items-center gap-4 text-neutral-body">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Auto-saved</span>
          <span>1 kernel 运行中</span>
        </div>
        <div>JupyterLab - Python 3</div>
      </div>

      {/* GPU Config Modal */}
      {showGpuModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="h-14 border-b border-neutral-border flex items-center justify-between px-6 bg-[#fafafa]">
              <h2 className="text-[16px] font-bold text-neutral-title flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#fa541c]" /> 启动实验环境
              </h2>
              <button onClick={() => setShowGpuModal(false)} className="text-neutral-caption hover:text-neutral-title transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-title flex justify-between">
                  <span>选择镜像</span>
                </label>
                <div className="border border-neutral-border rounded text-[13px] p-2 bg-neutral-50 text-neutral-body">
                  jupyterlab:base
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-title flex justify-between">
                  <span>CPU 资源</span>
                </label>
                <div className="border border-neutral-border rounded text-[13px] p-2 bg-neutral-50 text-neutral-body">
                  4 核
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-title">内存资源</label>
                  <div className="border border-neutral-border rounded text-[13px] p-2 bg-neutral-50 text-neutral-body">
                    8 GB
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-title">GPU 显存</label>
                  <div className="border border-neutral-border rounded text-[13px] p-2 bg-neutral-50 text-neutral-body">
                    4 GB
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-title flex justify-between">
                  <span>GPU 算力分配</span>
                </label>
                <div className="border border-neutral-border rounded text-[13px] p-2 bg-[#fff2e8] text-[#fa541c] font-bold">
                  50%
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-border flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowGpuModal(false)}>取消</Button>
                <Button 
                  className="bg-[#fa541c] hover:bg-[#d4380d] text-white" 
                  onClick={() => {
                    setIsGpuRunning(true);
                    setShowGpuModal(false);
                  }}
                >
                  确认启动
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
