import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Plus, Database, Loader2, CheckCircle2, XCircle, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectedDataset { name: string; size: string; status: '同步中' | '同步成功' | '同步失败' }
const datasets = [
  { name: 'house_prices_train.csv', size: '42.5 MB' },
  { name: 'house_prices_test.csv', size: '12.8 MB' },
  { name: 'house_prices_eval.csv', size: '15.4 MB' },
  { name: 'mnist_train.bin', size: '9.9 MB' },
  { name: 'mnist_test.bin', size: '1.6 MB' },
  { name: 'iris_dataset.csv', size: '4.5 KB' },
];
export default function DatasetSyncSelector({ value, onChange, disabled = false }: { value: SelectedDataset[]; onChange: Dispatch<SetStateAction<SelectedDataset[]>>; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('pointerdown', close); Object.values(timers.current).forEach(clearTimeout); timers.current = {}; };
  }, []);
  useEffect(() => {
    if (disabled) return;
    value.filter(item => item.status === '同步中' && !timers.current[item.name]).forEach(dataset => {
      timers.current[dataset.name] = setTimeout(() => {
        onChange(previous => previous.map(item => item.name === dataset.name ? { ...item, status: '同步成功' } : item));
        delete timers.current[dataset.name];
      }, 2000);
    });
  }, [value, disabled, onChange]);
  const retry = (name: string) => {
    clearTimeout(timers.current[name]);
    onChange(previous => previous.map(item => item.name === name ? { ...item, status: '同步中' } : item));
    // Simulates synchronization until a backend dataset API is available.
    timers.current[name] = setTimeout(() => {
      onChange(previous => previous.map(item => item.name === name ? { ...item, status: '同步成功' } : item));
      delete timers.current[name];
    }, 2000);
  };
  const remove = (name: string) => { clearTimeout(timers.current[name]); delete timers.current[name]; onChange(previous => previous.filter(item => item.name !== name)); };
  return <div className="space-y-3">
    {!disabled && <div ref={root} className="relative" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); } }}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer bg-white"><Plus size={14} />添加数据集</button>
      {open && <div className="absolute z-30 w-[320px] max-w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto custom-scrollbar">{datasets.map(dataset => <label key={dataset.name} className="flex items-center justify-between gap-2 px-3.5 py-2 hover:bg-neutral-50 cursor-pointer text-xs text-neutral-700"><span className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4 accent-[#fa541c]" checked={value.some(item => item.name === dataset.name)} onChange={event => { if (!event.target.checked) remove(dataset.name); else { onChange(previous => [...previous, { ...dataset, status: '同步中' }]); retry(dataset.name); } }} />{dataset.name}</span><span className="text-[10px] text-neutral-400">{dataset.size}</span></label>)}</div>}
    </div>}
    {value.length > 0 ? <div className="space-y-2"><p className="text-xs text-neutral-500">已选择 {value.length} 个数据集</p>{value.map(dataset => <div key={dataset.name} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50/40 border border-neutral-200 rounded-[6px]">
      <div className="flex flex-wrap items-center gap-2 min-w-0 text-xs text-neutral-700"><Database size={16} className="text-[#fa541c] shrink-0" /><span className="font-medium break-all">{dataset.name}</span><span className="text-[10px] text-neutral-400">({dataset.size})</span></div>
      <div className="flex items-center gap-3 shrink-0"><span role="status" className={cn('inline-flex items-center gap-1 text-[11px]', dataset.status === '同步中' ? 'text-blue-500' : dataset.status === '同步失败' ? 'text-red-500' : 'text-green-600')}>{dataset.status === '同步中' ? <Loader2 size={14} className="animate-spin" /> : dataset.status === '同步失败' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}{dataset.status}</span>
        {!disabled && <><button type="button" aria-label={`重试同步${dataset.name}`} onClick={() => retry(dataset.name)} className="inline-flex items-center gap-1 text-[11px] text-[#fa541c] cursor-pointer"><RefreshCw size={14} />同步重试</button><button type="button" aria-label={`移除${dataset.name}`} onClick={() => remove(dataset.name)} className="text-neutral-400 hover:text-red-500 cursor-pointer"><X size={14} /></button></>}
      </div></div>)}</div> : <p className="text-xs text-neutral-400">暂未选择数据集</p>}
  </div>;
}
