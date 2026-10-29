import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  placeholder: string;
  onChange: (value: string) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

// Use the same trigger, menu and selected option styles as the teacher exam form.
export default function CompetitionSelect({ id, value, options, optionLabels, placeholder, onChange, ...aria }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    const selected = menuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    selected?.scrollIntoView({ block: "nearest" });
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  const focusOption = (index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    if (items?.length) items[(index + items.length) % items.length]?.focus();
  };

  return <div ref={containerRef} className="relative w-full text-[13px]" onKeyDown={event => {
    if (open && event.key === "Escape") {
      event.preventDefault(); event.stopPropagation(); setOpen(false); triggerRef.current?.focus();
    }
    if (event.key === "Tab") setOpen(false);
  }}>
    <button ref={triggerRef} id={id} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-options`} {...aria}
      onClick={() => setOpen(previous => !previous)}
      onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault(); setOpen(true);
          requestAnimationFrame(() => focusOption(Math.max(0, options.indexOf(value))));
        }
      }}
      className={cn("h-9 w-full border rounded-[4px] px-3.5 py-2 flex items-center justify-between gap-2 transition-all bg-white cursor-pointer select-none text-left outline-none focus-visible:border-[#fa541c] focus-visible:ring-1 focus-visible:ring-[#fa541c]/25", open ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "border-neutral-200 hover:border-[#fa541c]", aria["aria-invalid"] && "border-red-400")}>
      <span className={cn("truncate", value ? "text-neutral-700 font-medium" : "text-neutral-400")}>{value ? optionLabels?.[value] || value : placeholder}</span>
      <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-neutral-400", open && "rotate-180")} />
    </button>
    {open && <div ref={menuRef} role="listbox" id={`${id}-options`} aria-labelledby={id} className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-y-auto max-h-[220px] custom-scrollbar flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150"
      onKeyDown={event => {
        const items = Array.from<HTMLButtonElement>(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []);
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          focusOption(event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : index + (event.key === "ArrowDown" ? 1 : -1));
        }
      }}>
      {options.map(option => <button key={option} type="button" role="option" aria-selected={value === option} onClick={() => { onChange(option); setOpen(false); triggerRef.current?.focus(); }} className={cn("px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between gap-3 shrink-0 outline-none focus:bg-orange-50/60", value === option ? "bg-orange-50 text-[#fa541c] font-bold" : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900")}>
        <span>{optionLabels?.[option] || option}</span>{value === option && <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />}
      </button>)}
    </div>}
  </div>;
}
