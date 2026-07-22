"use client";
import React from "react";
import { Edit3 } from "lucide-react";

interface NotesEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  promptPrefix?: string;
  maxLength?: number;
}

export function NotesEditor({
  value,
  onChange,
  placeholder = "Type your thoughts here...",
  promptPrefix = "The highlight of my evening was...",
  maxLength = 300,
}: NotesEditorProps) {
  return (
    <div className="w-full bg-[#FCFBF8] border border-[#EFECE6] focus-within:border-[#5B2EFF] focus-within:ring-2 focus-within:ring-[#5B2EFF]/20 rounded-[24px] p-5 flex flex-col gap-3 transition-all duration-200">
      <div className="flex items-center justify-between border-b border-[#EFECE6]/60 pb-3">
        <div className="flex items-center gap-2 text-[#5B2EFF]">
          <Edit3 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Notes
          </span>
        </div>
        <span className="text-[11px] text-[#1D1C1A]/40 font-medium">
          {value.length}/{maxLength}
        </span>
      </div>

      {promptPrefix && (
        <p className="text-sm font-semibold text-[#1D1C1A]/80 italic">
          &ldquo;{promptPrefix}&rdquo;
        </p>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-transparent text-base font-normal text-[#1D1C1A] placeholder:text-[#1D1C1A]/35 focus:outline-none resize-none leading-relaxed"
      />
    </div>
  );
}
