"use me";
import React from "react";

interface PhoneMockupProps {
  children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] flex flex-col items-center justify-center sm:py-6 sm:px-4 relative overflow-hidden">
      {/* Soft Ambient Desktop Backdrop Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#5B2EFF]/10 via-[#FF2E93]/8 to-[#00B2FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop Header branding bar */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#5B2EFF] flex items-center justify-center text-white text-[11px] font-extrabold tracking-tighter shadow-[0_2px_8px_rgba(91,46,255,0.4)]">
            sf
          </div>
          <span className="text-xs font-bold text-[#1D1C1A]/80 uppercase tracking-widest">
            Sugar.fit
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#F2EEFF] text-[#5B2EFF] px-3 py-1 rounded-full border border-[#5B2EFF]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B2EFF] animate-ping" />
          <span className="text-xs font-extrabold tracking-tight">5th Anniversary</span>
        </div>
      </header>

      {/* Main Container / Phone Mockup Frame */}
      <main className="w-full max-w-[420px] bg-white sm:rounded-[36px] h-screen sm:h-[840px] max-h-screen sm:max-h-[90vh] flex flex-col relative overflow-hidden sm:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.08)] sm:border sm:border-[#EFECE6]">
        {/* Mobile top safe-area notch bar (desktop view only) */}
        <div className="hidden sm:flex justify-center pt-3 pb-1 shrink-0 bg-white z-30 pointer-events-none">
          <div className="w-28 h-4 bg-[#1D1C1A]/10 rounded-full flex items-center justify-center">
            <div className="w-10 h-1 bg-[#1D1C1A]/20 rounded-full" />
          </div>
        </div>

        {/* Content Container (Header + Scrollable Body + Sticky Footer) */}
        <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
          {children}
        </div>

        {/* Mobile bottom home indicator bar (desktop mockup view) */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 shrink-0 bg-white z-30 pointer-events-none">
          <div className="w-32 h-1 bg-[#1D1C1A]/15 rounded-full" />
        </div>
      </main>

      {/* Footer desktop subtle caption */}
      <footer className="hidden sm:block mt-3 text-center relative z-10 shrink-0">
        <p className="text-[11px] text-[#1D1C1A]/50 font-semibold tracking-wide">
          ✨ Sugar.fit 5th Anniversary • Crafting Memories
        </p>
      </footer>
    </div>
  );
}
