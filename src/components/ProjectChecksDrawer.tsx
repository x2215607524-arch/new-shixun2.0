import { useEffect, useRef, useState } from 'react';
import { CheckSquare, X, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CheckItem {
  id: string;
  name: string;
  type: string;
  block: string;
  code: string;
  script: string;
  description: string;
}
const emptyForm = (): CheckItem => ({ id: '', name: '', type: '代码块脚本检查', block: '', code: '', script: '', description: '' });
const codeBlocks = [
  { value: 'main.py', label: 'main.py', code: 'def main():\n    # 在此编写项目执行逻辑\n    pass\n' },
  { value: 'handler.py', label: 'handler.py', code: 'def handler(event):\n    return {"success": True}\n' },
];
function CustomSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return <Select value={value || null} onValueChange={selected => onChange(selected || '')}>
    <SelectTrigger className="w-full rounded border-neutral-200 text-[13px] bg-white h-9 focus-visible:border-[#fa541c]"><SelectValue placeholder={placeholder} /></SelectTrigger>
    <SelectContent positionerClassName="z-[220]" className="bg-white border border-neutral-200 rounded shadow-lg" alignItemWithTrigger={false}>
      {options.map(option => <SelectItem key={option.value} value={option.value} className="text-[13px] py-2 px-3 pr-8 data-selected:bg-orange-50 data-selected:text-[#fa541c] data-highlighted:bg-orange-50/60 cursor-pointer">{option.label}</SelectItem>)}
    </SelectContent>
  </Select>;
}

export default function ProjectChecksDrawer({ project, onClose }: { project: { id: number; name: string } | null; onClose: () => void }) {
  const [records, setRecords] = useState<Record<number, CheckItem[]>>({});
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [form, setForm] = useState<CheckItem>(emptyForm);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<CheckItem | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const importSequence = useRef(0);
  useEffect(() => {
    setView('list'); setDeleting(null); setError(''); importSequence.current++;
  }, [project?.id]);
  useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (deleting) setDeleting(null);
        else if (view !== 'list') setView('list');
        else onClose();
      }
    };
    document.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', close); };
  }, [project, onClose, view, deleting]);
  if (!project) return null;
  const items = records[project.id] || [];
  const startForm = (item?: CheckItem) => {
    importSequence.current++; setForm(item ? { ...item } : emptyForm()); setError(''); setView('form');
  };
  const save = () => {
    if (!form.name.trim()) { setError('请输入检查项名称'); return; }
    if (!form.block) { setError('请选择代码块'); return; }
    if (!form.code.trim()) { setError('代码块内容不能为空'); return; }
    if (!form.script.trim()) { setError('请输入或加载脚本文件'); return; }
    const saved = { ...form, name: form.name.trim(), id: form.id || `check-${Date.now()}` };
    setRecords(previous => ({ ...previous, [project.id]: form.id ? items.map(item => item.id === form.id ? saved : item) : [...items, saved] }));
    importSequence.current++; setView('list');
  };
  const editor = (value: string, onChange: ((value: string) => void) | undefined, placeholder: string, load = false) => (
    <div className="relative flex overflow-hidden rounded-[6px] border border-neutral-200 bg-[#f5f6f8]">
      <div aria-hidden="true" className="w-10 shrink-0 border-r border-neutral-200 text-right pr-3 pt-3 text-xs text-neutral-400 font-mono">1</div>
      <textarea aria-label={placeholder} readOnly={!onChange} value={value} onChange={event => onChange?.(event.target.value)} placeholder={placeholder} spellCheck={false} className={`w-full min-w-0 h-48 p-3 ${load ? 'pt-10' : ''} bg-transparent resize-y font-mono text-[12px] leading-6 text-neutral-700 focus:outline-none whitespace-pre`} />
      {load && <button type="button" onClick={() => fileInput.current?.click()} className="absolute right-3 top-2 text-[#fa541c] text-xs font-medium cursor-pointer">加载文件</button>}
    </div>
  );
  return <div className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left text-[13px]" onClick={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="project-checks-title" className="bg-white w-full max-w-[900px] h-dvh flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300" onClick={event => event.stopPropagation()}>
      <header className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {view !== 'list' && <button aria-label="返回检查项列表" onClick={() => { importSequence.current++; setView('list'); }} className="p-1 text-neutral-500 hover:text-[#fa541c] cursor-pointer"><ArrowLeft size={17} /></button>}
          <CheckSquare className="w-5 h-5 text-[#fa541c] shrink-0" />
          <h2 id="project-checks-title" className="text-[15px] font-bold text-neutral-800">{view === 'list' ? '项目检查项' : view === 'detail' ? '检查项内容' : form.id ? '编辑检查项' : '新建检查项'}</h2>
        </div>
        <button aria-label="关闭检查项" onClick={onClose} className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] cursor-pointer"><X size={18} /></button>
      </header>
      <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
        <div className="bg-orange-50/20 rounded-lg px-4 py-3 border border-orange-100/60 text-neutral-600 break-words"><span className="text-neutral-400">关联项目：</span>{project.name}</div>
        {view === 'list' ? <>
          <div className="flex items-center justify-between gap-3"><span className="text-neutral-500">共 {items.length} 个检查项</span><Button onClick={() => startForm()} className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-8 px-3 rounded-[4px] text-xs cursor-pointer"><Plus size={14} />新建检查项</Button></div>
          <div className="border border-neutral-200 rounded-[6px] overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-100"><tr><th className="p-3 font-medium w-[30%]">检查项名称</th><th className="p-3 font-medium">检查项内容</th><th className="p-3 font-medium w-[30%]">检查项描述</th><th className="p-3 font-medium whitespace-nowrap">操作</th></tr></thead>
              <tbody>{items.map(item => <tr key={item.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/40">
                <td className="p-3 break-all">{item.name}</td>
                <td className="p-3"><button className="text-[#fa541c] whitespace-nowrap cursor-pointer" onClick={() => { setForm({ ...item }); setView('detail'); }}>详情查看</button></td>
                <td className="p-3 break-all text-neutral-500">{item.description || '--'}</td>
                <td className="p-3"><div className="flex items-center gap-3 whitespace-nowrap"><button onClick={() => startForm(item)} className="text-[#fa541c] cursor-pointer">编辑</button><span className="h-3 w-px bg-neutral-200" /><button onClick={() => setDeleting(item)} className="text-[#fa541c] cursor-pointer">删除</button></div></td>
              </tr>)}{items.length === 0 && <tr><td colSpan={4} className="py-16 text-center text-neutral-400">暂无检查项，点击“新建检查项”添加</td></tr>}</tbody>
            </table>
          </div>
        </> : view === 'form' ? <form id="project-check-form" onSubmit={event => { event.preventDefault(); save(); }} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-3 items-center"><label htmlFor="project-check-name" className="text-neutral-600 sm:text-right">检查项名称 <span className="text-[#fa541c]">*</span></label><div className="relative"><input id="project-check-name" value={form.name} maxLength={100} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="请输入检查项名称" className="w-full rounded border border-neutral-200 px-3 py-2 pr-20 focus:outline-none focus:border-[#fa541c]" /><span className="absolute right-3 top-2 text-xs text-neutral-400">{form.name.length} / 100</span></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-3 items-center"><span className="text-neutral-600 sm:text-right">检查项类型 <span className="text-[#fa541c]">*</span></span><CustomSelect value={form.type} onChange={type => setForm({ ...form, type })} options={[{ value: '代码块脚本检查', label: '代码块脚本检查' }]} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-3 items-start"><span className="text-neutral-600 sm:text-right pt-2">代码块 <span className="text-[#fa541c]">*</span></span><div className="space-y-3"><CustomSelect value={form.block} placeholder="请选择代码块" onChange={block => setForm({ ...form, block, code: codeBlocks.find(item => item.value === block)?.code || '' })} options={codeBlocks} />{editor(form.code, code => setForm({ ...form, code }), '请输入代码块内容')}</div></div>
          <div className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-3 items-start"><span className="text-neutral-600 sm:text-right pt-2">脚本文件 <span className="text-[#fa541c]">*</span></span><div>{editor(form.script, script => setForm({ ...form, script }), '请输入脚本文件', true)}<input ref={fileInput} type="file" accept=".py,.js,.ts,.sh,.txt" className="hidden" aria-label="加载脚本文件" onChange={async event => {
            const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
            if (file.size > 1024 * 1024) { setError('请加载不超过 1 MB 的脚本文件'); return; }
            const sequence = ++importSequence.current;
            try { const script = await file.text(); if (sequence === importSequence.current) { setForm(previous => ({ ...previous, script })); setError(''); } } catch { setError('文件读取失败，请重试'); }
          }} /></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-3 items-start"><label htmlFor="project-check-description" className="text-neutral-600 sm:text-right pt-2">检查项描述</label><textarea id="project-check-description" value={form.description} maxLength={1000} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="请输入检查项描述（选填）" className="w-full h-20 rounded border border-neutral-200 px-3 py-2 focus:outline-none focus:border-[#fa541c] resize-y" /></div>
          {error && <p role="alert" className="text-red-500 sm:ml-[122px]">{error}</p>}
        </form> : <div className="space-y-4">
          <div><h3 className="font-semibold text-neutral-800 break-all">{form.name}</h3><p className="mt-1 text-neutral-500">{form.type} · {form.block}</p></div>
          <div><h4 className="mb-2 font-medium">代码块</h4>{editor(form.code, undefined, '代码块内容')}</div>
          <div><h4 className="mb-2 font-medium">脚本文件</h4>{editor(form.script, undefined, '脚本文件内容')}</div>
          <div><h4 className="mb-2 font-medium">检查项描述</h4><p className="whitespace-pre-wrap break-words text-neutral-500">{form.description || '--'}</p></div>
        </div>}
      </div>
      <footer className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
        <Button variant="outline" onClick={() => { if (view === 'list') onClose(); else { importSequence.current++; setView('list'); } }} className="h-8 rounded-[4px] text-xs cursor-pointer">{view === 'list' ? '关闭' : view === 'form' ? '取消' : '返回列表'}</Button>
        {view === 'form' && <Button form="project-check-form" type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-8 rounded-[4px] text-xs cursor-pointer">保存</Button>}
      </footer>
    </section>
    {deleting && <div className="fixed inset-0 z-[210] bg-black/30 flex items-center justify-center p-4" onClick={event => { event.stopPropagation(); setDeleting(null); }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-project-check-title" className="w-full max-w-[420px] bg-white rounded-lg p-6 shadow-xl" onClick={event => event.stopPropagation()}>
        <h3 id="delete-project-check-title" className="font-semibold text-[16px] flex items-center gap-2"><Trash2 size={18} className="text-[#fa541c]" />删除检查项</h3>
        <p className="mt-4 text-neutral-500 break-all">确定删除检查项“{deleting.name}”吗？删除后不可恢复。</p>
        <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={() => setDeleting(null)}>取消</Button><Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white" onClick={() => { setRecords(previous => ({ ...previous, [project.id]: items.filter(item => item.id !== deleting.id) })); setDeleting(null); }}>确认删除</Button></div>
      </div>
    </div>}
  </div>;
}
