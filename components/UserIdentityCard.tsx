"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Check } from "lucide-react";

interface UserIdentityCardProps {
  initialName?: string;
  initialEmail?: string;
  onConfirm: (name: string, email: string) => void;
}

export function UserIdentityCard({
  initialName = "",
  initialEmail = "",
  onConfirm,
}: UserIdentityCardProps) {
  // Check URL parameters on initial state creation
  const [email, setEmail] = useState<string>(() => {
    if (initialEmail) return initialEmail;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email") || params.get("userEmail");
      if (urlEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(urlEmail.trim())) {
        return urlEmail.trim();
      }
    }
    return "";
  });

  const [name, setName] = useState<string>(() => {
    if (initialName) return initialName;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get("name") || params.get("userName");
      if (urlName && urlName.trim().length >= 2) {
        return urlName.trim();
      }
    }
    return "";
  });

  const [isDetectedEmail] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email") || params.get("userEmail");
      return !!(urlEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(urlEmail.trim()));
    }
    return false;
  });

  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);

  // Email validation regex
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isNameValid = name.trim().length >= 2;
  const canProceed = isEmailValid && isNameValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed) {
      onConfirm(name.trim(), email.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col gap-5"
    >
      {/* DETECTED EMAIL WELCOME BANNER */}
      {isDetectedEmail && !isEditingEmail ? (
        <div className="bg-[#F2EEFF] border border-[#5B2EFF]/25 rounded-[24px] p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2EFF]">
                Continue as
              </span>
              <span className="text-sm font-extrabold text-[#1D1C1A] truncate max-w-[200px]">
                {email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingEmail(true)}
            className="text-xs font-bold text-[#5B2EFF] hover:underline px-2 py-1"
          >
            Switch
          </button>
        </div>
      ) : (
        /* EMAIL INPUT FIELD */
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold text-[#1D1C1A]/70 uppercase tracking-wider flex items-center justify-between">
            <span>Work Email</span>
            {email.trim() && (
              <span
                className={`text-[10px] font-bold ${
                  isEmailValid ? "text-[#00D68F]" : "text-[#FF4D4D]"
                }`}
              >
                {isEmailValid ? "Valid Email" : "Enter valid email"}
              </span>
            )}
          </label>

          <div
            className={`w-full bg-[#FCFBF8] border rounded-[22px] p-3.5 flex items-center gap-3 transition-all duration-200 ${
              isEmailValid
                ? "border-[#00D68F] ring-2 ring-[#00D68F]/15"
                : email.length > 0
                ? "border-[#FF4D4D]"
                : "border-[#EFECE6] focus-within:border-[#5B2EFF] focus-within:ring-2 focus-within:ring-[#5B2EFF]/15"
            }`}
          >
            <Mail
              className={`w-5 h-5 ${
                isEmailValid ? "text-[#00D68F]" : "text-[#1D1C1A]/40"
              }`}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@sugarfit.com"
              required
              className="flex-1 bg-transparent text-sm font-semibold text-[#1D1C1A] placeholder:text-[#1D1C1A]/35 focus:outline-none"
            />
            {isEmailValid && (
              <div className="w-5 h-5 rounded-full bg-[#00D68F] text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAME INPUT FIELD */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-[#1D1C1A]/70 uppercase tracking-wider flex items-center justify-between">
          <span>What should we call you?</span>
          {name.trim() && (
            <span
              className={`text-[10px] font-bold ${
                isNameValid ? "text-[#00D68F]" : "text-[#1D1C1A]/40"
              }`}
            >
              {isNameValid ? "Looks great!" : "Min 2 characters"}
            </span>
          )}
        </label>

        <div
          className={`w-full bg-[#FCFBF8] border rounded-[22px] p-3.5 flex items-center gap-3 transition-all duration-200 ${
            isNameValid
              ? "border-[#00D68F] ring-2 ring-[#00D68F]/15"
              : "border-[#EFECE6] focus-within:border-[#5B2EFF] focus-within:ring-2 focus-within:ring-[#5B2EFF]/15"
          }`}
        >
          <User
            className={`w-5 h-5 ${
              isNameValid ? "text-[#00D68F]" : "text-[#1D1C1A]/40"
            }`}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            required
            className="flex-1 bg-transparent text-sm font-semibold text-[#1D1C1A] placeholder:text-[#1D1C1A]/35 focus:outline-none"
          />
          {isNameValid && (
            <div className="w-5 h-5 rounded-full bg-[#00D68F] text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>
    </motion.form>
  );
}
