import React, { useState, useEffect, useRef } from "react"
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DateTimePickerProps {
  value: string // expected format 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DDTHH:mm:ss'
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  align?: 'left' | 'right'
  showPresets?: boolean
  showSeconds?: boolean
  id?: string
  label?: string
  invalid?: boolean
  describedBy?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "请选择日期和时间",
  className,
  disabled = false,
  align = "right",
  showPresets = true,
  showSeconds = false,
  id,
  label,
  invalid,
  describedBy,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Internal date representation
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewYear, setViewYear] = useState<number>(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(new Date().getMonth()) // 0-11
  
  // Selected hour/minute/second state
  const [selectedHour, setSelectedHour] = useState<number>(0)
  const [selectedMinute, setSelectedMinute] = useState<number>(0)
  const [selectedSecond, setSelectedSecond] = useState<number>(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const hourListRef = useRef<HTMLDivElement>(null)
  const minuteListRef = useRef<HTMLDivElement>(null)
  const secondListRef = useRef<HTMLDivElement>(null)

  // Parse value prop when it changes or when modal opens
  useEffect(() => {
    if (value) {
      const normalized = value.includes('T') ? value : value.replace(' ', 'T')
      const parsed = new Date(normalized)
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed)
        setViewYear(parsed.getFullYear())
        setViewMonth(parsed.getMonth())
        setSelectedHour(parsed.getHours())
        setSelectedMinute(parsed.getMinutes())
        setSelectedSecond(parsed.getSeconds())
        return
      }
    }
    // Default fallback if no value
    setSelectedDate(null)
  }, [value, isOpen])

  // Scroll active hour/minute/second into view when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (hourListRef.current) {
          const selectedHourEl = hourListRef.current.querySelector('[data-selected="true"]')
          if (selectedHourEl) {
            selectedHourEl.scrollIntoView({ block: 'nearest', behavior: 'auto' })
          }
        }
        if (minuteListRef.current) {
          const selectedMinEl = minuteListRef.current.querySelector('[data-selected="true"]')
          if (selectedMinEl) {
            selectedMinEl.scrollIntoView({ block: 'nearest', behavior: 'auto' })
          }
        }
        if (showSeconds && secondListRef.current) {
          const selectedSecEl = secondListRef.current.querySelector('[data-selected="true"]')
          if (selectedSecEl) {
            selectedSecEl.scrollIntoView({ block: 'nearest', behavior: 'auto' })
          }
        }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showSeconds])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Helper formatting functions
  const formatDisplay = (val: string): string => {
    if (!val) return ""
    return val.replace("T", " ")
  }

  const formatToValueString = (date: Date, hour: number, min: number, sec = 0): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    const h = String(hour).padStart(2, "0")
    const M = String(min).padStart(2, "0")
    const s = String(sec).padStart(2, "0")
    return showSeconds ? `${y}-${m}-${d}T${h}:${M}:${s}` : `${y}-${m}-${d}T${h}:${M}`
  }

  // Quick preset selections
  const getPresets = () => {
    const presets = []
    
    // Pres 1: Now (此刻)
    presets.push({ label: "此刻", date: new Date() })

    // Pres 2: Today 18:00 (今天 18:00)
    const today18 = new Date()
    today18.setHours(18, 0, 0, 0)
    presets.push({ label: "今天 18:00", date: today18 })

    // Pres 3: Tomorrow 09:00 (明天 09:00)
    const tom09 = new Date()
    tom09.setDate(tom09.getDate() + 1)
    tom09.setHours(9, 0, 0, 0)
    presets.push({ label: "明天 09:00", date: tom09 })

    // Pres 4: Tomorrow 18:00 (明天 18:00)
    const tom18 = new Date()
    tom18.setDate(tom18.getDate() + 1)
    tom18.setHours(18, 0, 0, 0)
    presets.push({ label: "明天 18:00", date: tom18 })

    // Pres 5: Next Monday 09:00 (下周一 09:00)
    const nextMon = new Date()
    const currentDay = nextMon.getDay()
    const diff = nextMon.getDate() + (currentDay === 0 ? 1 : 8 - currentDay)
    nextMon.setDate(diff)
    nextMon.setHours(9, 0, 0, 0)
    presets.push({ label: "下周一 09:00", date: nextMon })

    return presets
  }

  // Date picker navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(prev => prev - 1)
    } else {
      setViewMonth(prev => prev - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(prev => prev + 1)
    } else {
      setViewMonth(prev => prev + 1)
    }
  }

  // Generate calendar cells (6 weeks grid = 42 items)
  const getDaysArray = () => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay() // 0-6 (Sun-Sat)
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const cells: { date: Date; isCurrentMonth: boolean }[] = []

    // Previous Month Days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i)
      cells.push({ date: prevDate, isCurrentMonth: false })
    }

    // Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(viewYear, viewMonth, i)
      cells.push({ date: currDate, isCurrentMonth: true })
    }

    // Next Month Days
    const remainingCells = 42 - cells.length
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i)
      cells.push({ date: nextDate, isCurrentMonth: false })
    }

    return cells
  }

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date)
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth())
  }

  const handlePresetSelect = (date: Date) => {
    setSelectedDate(date)
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth())
    setSelectedHour(date.getHours())
    setSelectedMinute(date.getMinutes())
    setSelectedSecond(date.getSeconds())
    
    // Directly apply the preset selection
    const formattedVal = formatToValueString(date, date.getHours(), date.getMinutes(), date.getSeconds())
    onChange(formattedVal)
    setIsOpen(false)
  }

  const handleConfirm = () => {
    const targetDate = selectedDate || new Date()
    const formattedVal = formatToValueString(targetDate, selectedHour, selectedMinute, selectedSecond)
    onChange(formattedVal)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange("")
    setSelectedDate(null)
    setIsOpen(false)
  }

  const isSelectedDay = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} onKeyDown={event => {
      if (isOpen && event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        setIsOpen(false)
        containerRef.current?.querySelector<HTMLElement>('[data-datetime-trigger]')?.focus()
      }
    }}>
      {/* Input Box Trigger */}
      <div
        id={id}
        data-datetime-trigger
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-disabled={disabled || undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onKeyDown={event => {
          if (event.target === event.currentTarget && !disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            setIsOpen(previous => !previous)
          }
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full border border-neutral-200 rounded-[4px] px-3 py-2 text-[14px] flex items-center justify-between cursor-pointer bg-white transition-all select-none",
          isOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-neutral-300",
          disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-100",
          invalid && "border-red-400"
        )}
      >
        <span className={cn(value ? "text-neutral-800" : "text-neutral-400")}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && !disabled && (
            <button
              type="button"
              aria-label={label ? `清除${label}` : '清除日期和时间'}
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="p-0.5 text-neutral-400 hover:text-neutral-600 rounded bg-transparent border-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <CalendarIcon className={cn("w-4 h-4 text-neutral-400", isOpen && "text-[#fa541c]")} />
        </div>
      </div>

      {/* Date-Time Picker Popover */}
      {isOpen && (
        <div className={cn(
          "absolute top-[calc(100%+6px)] z-50 bg-white border border-orange-100 rounded-2xl shadow-xl shadow-orange-500/5 backdrop-blur-md p-4 mt-1 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200",
          showPresets ? (showSeconds ? "w-[560px]" : "w-[500px]") : (showSeconds ? "w-[470px]" : "w-[410px]"),
          align === "left" ? "left-0" : "right-0"
        )} role="dialog" aria-label={label ? `选择${label}` : '选择日期和时间'}>
          {/* Main Selectors Layout: Calendar | Time Picker | Presets */}
          <div className="flex gap-4 min-h-[240px]">
            {/* 1. Calendar Panel */}
            <div className="w-[240px] shrink-0">
              <div className="flex justify-between items-center mb-3">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 hover:bg-orange-50 rounded-lg text-neutral-500 hover:text-[#fa541c] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-neutral-800 text-[13px]">
                  {viewYear}年 {viewMonth + 1}月
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 hover:bg-orange-50 rounded-lg text-neutral-500 hover:text-[#fa541c] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 text-center mb-1">
                {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                  <span key={day} className="text-[11px] font-bold text-neutral-400 w-8 h-6 flex items-center justify-center">
                    {day}
                  </span>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {getDaysArray().map(({ date, isCurrentMonth }, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectDay(date)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center text-[12px] rounded-lg transition-all border-0 bg-transparent cursor-pointer relative",
                      !isCurrentMonth && "text-neutral-300 hover:bg-neutral-50",
                      isCurrentMonth && !isSelectedDay(date) && "text-neutral-700 hover:bg-orange-50 hover:text-[#fa541c]",
                      isSelectedDay(date) && "bg-[#fa541c] text-white font-bold shadow-md shadow-orange-500/20",
                      isToday(date) && !isSelectedDay(date) && "border border-orange-300"
                    )}
                  >
                    {date.getDate()}
                    {isToday(date) && isSelectedDay(date) && (
                      <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
                    )}
                    {isToday(date) && !isSelectedDay(date) && (
                      <span className="absolute bottom-1 w-1 h-1 bg-[#fa541c] rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Time Pickers Panel (Scroll columns) */}
            <div className="flex shrink-0 border-l border-neutral-100 pl-4 gap-3 select-none">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-0.5"><Clock className="w-3 h-3"/> 时</span>
                <div
                  ref={hourListRef}
                  className="h-[210px] w-11 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar scroll-smooth"
                >
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      data-selected={selectedHour === h}
                      onClick={() => setSelectedHour(h)}
                      className={cn(
                        "h-7 w-full shrink-0 flex items-center justify-center text-[12px] rounded-md transition-colors cursor-pointer border-0 bg-transparent",
                        selectedHour === h
                          ? "bg-[#fa541c] text-white font-bold"
                          : "text-neutral-600 hover:bg-orange-50 hover:text-[#fa541c]"
                      )}
                    >
                      {String(h).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-0.5"><Clock className="w-3 h-3"/> 分</span>
                <div
                  ref={minuteListRef}
                  className="h-[210px] w-11 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar scroll-smooth"
                >
                  {minutes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-selected={selectedMinute === m}
                      onClick={() => setSelectedMinute(m)}
                      className={cn(
                        "h-7 w-full shrink-0 flex items-center justify-center text-[12px] rounded-md transition-colors cursor-pointer border-0 bg-transparent",
                        selectedMinute === m
                          ? "bg-[#fa541c] text-white font-bold"
                          : "text-neutral-600 hover:bg-orange-50 hover:text-[#fa541c]"
                      )}
                    >
                      {String(m).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {showSeconds && (
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-neutral-400 mb-1.5 flex items-center gap-0.5"><Clock className="w-3 h-3"/> 秒</span>
                  <div
                    ref={secondListRef}
                    className="h-[210px] w-11 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar scroll-smooth"
                  >
                    {seconds.map((s) => (
                      <button
                        key={s}
                        type="button"
                        data-selected={selectedSecond === s}
                        onClick={() => setSelectedSecond(s)}
                        className={cn(
                          "h-7 w-full shrink-0 flex items-center justify-center text-[12px] rounded-md transition-colors cursor-pointer border-0 bg-transparent",
                          selectedSecond === s
                            ? "bg-[#fa541c] text-white font-bold"
                            : "text-neutral-600 hover:bg-orange-50 hover:text-[#fa541c]"
                        )}
                      >
                        {String(s).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Quick Presets Panel */}
            {showPresets && (
              <div className="flex-1 shrink-0 border-l border-neutral-100 pl-4 flex flex-col gap-1.5 min-w-[100px]">
                <span className="text-[11px] font-bold text-neutral-400 mb-1">快捷选项</span>
                <div className="flex flex-col gap-1">
                  {getPresets().map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset.date)}
                      className="text-left text-[12px] text-neutral-600 hover:text-[#fa541c] hover:bg-orange-50 px-2 py-1.5 rounded-lg transition-colors font-medium cursor-pointer border-0 bg-transparent"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-neutral-100 pt-3 mt-3 flex justify-between items-center">
            <div className="text-[11.5px] text-neutral-500 font-medium">
              {selectedDate ? (
                <>
                  已选：
                  <span className="text-[#fa541c] font-semibold">
                    {formatDisplay(
                      formatToValueString(selectedDate, selectedHour, selectedMinute, selectedSecond)
                    )}
                  </span>
                </>
              ) : (
                <span className="text-neutral-400">未选择日期</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] text-neutral-500 hover:text-red-500 px-2 py-1 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer font-medium"
              >
                清除
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-3.5 py-1.5 rounded-[4px] text-[12px] font-bold transition-all shadow-md shadow-orange-500/10 cursor-pointer border-0"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
