import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectWorkspaceChecks() {
  const [items, setItems] = useState([{ id: 'directory', name: '目录创建检查', status: '检查不通过' }]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout); }, []);
  const runChecks = (ids: string[]) => {
    setItems(previous => previous.map(item => ids.includes(item.id) ? { ...item, status: '检查中' } : item));
    ids.forEach(id => {
      clearTimeout(timers.current[id]);
      // Preview only: no script execution service is connected yet.
      timers.current[id] = setTimeout(() => {
        setItems(previous => previous.map(item => item.id === id ? { ...item, status: '检查不通过' } : item));
        delete timers.current[id];
      }, 1200);
    });
  };
  const passed = items.filter(item => item.status === '检查通过').length;
  const failed = items.filter(item => item.status === '检查不通过').length;
  const running = items.some(item => item.status === '检查中');
  return <div className="flex flex-col h-full min-h-0 bg-white">
    <div className="p-3 border-b border-neutral-border bg-[#fafafa] flex items-center gap-2 text-[13px] font-semibold text-neutral-title"><CheckSquare size={16} className="text-[#fa541c]" />检查项</div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="grid grid-cols-3 rounded-md border border-neutral-border bg-neutral-50 py-3 text-center">
        {[{ label: '总数', value: items.length, color: 'text-neutral-title' }, { label: '通过', value: passed, color: 'text-green-600' }, { label: '不通过', value: failed, color: 'text-red-500' }].map(stat => <div key={stat.label}><div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div><div className="mt-1 text-[11px] text-neutral-caption">{stat.label}</div></div>)}
      </div>
      <Button onClick={() => runChecks(items.map(item => item.id))} disabled={running || !items.length} className="w-full h-8 text-xs bg-[#fa541c] hover:bg-[#e84a15] text-white disabled:bg-[#ffbb96] disabled:opacity-100 cursor-pointer disabled:cursor-not-allowed">{running ? <Loader2 size={14} className="animate-spin" /> : <CheckSquare size={14} />}{running ? '检查中…' : '检查全部'}</Button>
      <div className="space-y-3">{items.map(item => <div key={item.id} className="border border-neutral-border rounded-md p-3 space-y-3">
        <div className="text-[13px] font-medium text-neutral-title break-words">{item.name}</div>
        <div className="flex items-center justify-between gap-2">
          <span role="status" className={`inline-flex items-center gap-1 text-[11px] ${item.status === '检查中' ? 'text-neutral-caption' : item.status === '检查通过' ? 'text-green-600' : 'text-red-500'}`}>
            {item.status === '检查中' ? <Loader2 size={13} className="animate-spin" /> : item.status === '检查通过' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}{item.status}
          </span>
          <Button size="sm" variant="outline" disabled={item.status === '检查中'} onClick={() => runChecks([item.id])} className="h-7 px-3 text-[11px] text-[#fa541c] border-[#fa541c]/40 hover:bg-[#fff2e8] disabled:text-[#ffbb96] disabled:border-[#ffbb96] disabled:opacity-100 cursor-pointer">检查</Button>
        </div>
      </div>)}</div>
      <p className="text-[11px] leading-5 text-neutral-caption">当前为检查流程演示，尚未连接脚本执行服务。</p>
    </div>
  </div>;
}
