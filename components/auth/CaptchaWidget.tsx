"use client";

import React, { useState, useEffect, useRef } from "react";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

interface CaptchaWidgetProps {
  onVerifyChange: (isValid: boolean) => void;
  error?: string | null;
}

export function CaptchaWidget({ onVerifyChange, error }: CaptchaWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaCode, setCaptchaCode] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  // Generate random 5-character alphanumeric string (excluding ambiguous characters like 0/O, 1/I)
  const generateCode = () => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#FFF5F9");
    bgGradient.addColorStop(1, "#FCE7F3");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Random background noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = i % 2 === 0 ? "rgba(236, 72, 153, 0.35)" : "rgba(219, 39, 119, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Random noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(236, 72, 153, 0.4)" : "rgba(190, 24, 93, 0.3)";
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distinct rotations and fonts
    const charSpacing = width / (code.length + 1);
    ctx.textBaseline = "middle";

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = charSpacing * (i + 1);
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Deep, clear high-contrast colors
      const colors = ["#BE185D", "#9D174D", "#831843", "#701A75", "#86198F"];
      ctx.fillStyle = colors[i % colors.length];
      ctx.font = `bold ${Math.floor(22 + Math.random() * 4)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(char, -8, 0);

      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateCode();
    setCaptchaCode(newCode);
    setUserInput("");
    setIsVerified(false);
    setTouched(false);
    onVerifyChange(false);
    setTimeout(() => drawCaptcha(newCode), 50);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().trim();
    setUserInput(value);
    setTouched(true);

    const match = value === captchaCode;
    setIsVerified(match);
    onVerifyChange(match);
  };

  return (
    <div className="space-y-2 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
          <span>Security Verification</span>
        </label>
        <span className="text-[10px] text-zinc-500 font-medium">Type characters below</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Rendered Canvas Code */}
        <div className="relative rounded-lg overflow-hidden border border-pink-200 shadow-2xs shrink-0">
          <canvas
            ref={canvasRef}
            width={150}
            height={44}
            className="block cursor-pointer select-none"
            onClick={refreshCaptcha}
            title="Click to refresh security code"
          />
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-2 rounded-lg bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors shadow-2xs"
          title="Get a new security code"
          aria-label="Refresh Security Code"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Input box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter Code"
            maxLength={5}
            className={`w-full px-3 py-2 rounded-lg border text-sm font-bold tracking-widest uppercase focus:outline-hidden transition-all ${
              isVerified
                ? "border-emerald-400 bg-emerald-50/30 text-emerald-900 focus:ring-2 focus:ring-emerald-200"
                : touched && userInput.length > 0
                ? "border-amber-400 bg-white text-zinc-900 focus:ring-2 focus:ring-pink-200"
                : "border-zinc-200 bg-white text-zinc-900 focus:ring-2 focus:ring-pink-200"
            }`}
            required
          />
          {isVerified && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
          )}
        </div>
      </div>

      {touched && !isVerified && userInput.length >= 5 && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Verification code does not match. Please re-enter or click refresh.</span>
        </p>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
