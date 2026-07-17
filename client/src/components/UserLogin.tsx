import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Bolt, ArrowRight, ArrowLeft, Calendar, MessageSquare, User, AtSign } from "lucide-react";

interface Props {
  onLogin: (token: string, role: string, userId: string) => void;
  onBackToLanding?: () => void;
}

const API = import.meta.env.VITE_API_URL || "";

export default function UserLogin({ onLogin, onBackToLanding }: Props) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      let endpoint: string;
      let body: Record<string, string>;
      if (mode === "register") {
        endpoint = `${API}/api/auth/register`;
        body = { username, email, password, name };
      } else if (mode === "forgot") {
        endpoint = `${API}/api/auth/forgot-password`;
        body = { email };
      } else {
        endpoint = `${API}/api/auth/login`;
        body = { email, password };
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed");
      }
      if (mode === "forgot") {
        setSuccessMsg(data.message || "Check your email for the reset link.");
        return;
      }
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_id", String(data.user.id));
      onLogin(data.token, data.user.role, data.user.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl bg-[#111827] rounded-3xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[680px]">
        {/* ─── LEFT: Form ─── */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-sm space-y-6">
            {/* Back button */}
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
                <Bolt className="text-[#00E5FF] w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#F8FAFC] tracking-tight">
                stgos
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
                {mode === "register" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back"}
              </h1>
              <p className="text-sm text-[#64748B]">
                {mode === "register" ? "Join the network to start collaborating." : mode === "forgot" ? "Enter your email to receive a reset link." : "Sign in to your account to continue."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl font-medium">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-4 py-3 rounded-xl font-medium">
                  {successMsg}
                </div>
              )}

              {mode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full bg-[#1E293B] h-12 pl-10 pr-4 rounded-xl border border-[#334155] text-sm text-[#F8FAFC] focus:ring-2 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF] transition-all outline-none placeholder:text-[#64748B]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="alexrivera"
                        className="w-full bg-[#1E293B] h-12 pl-10 pr-4 rounded-xl border border-[#334155] text-sm text-[#F8FAFC] focus:ring-2 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF] transition-all outline-none placeholder:text-[#64748B]"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-[#1E293B] h-12 pl-10 pr-4 rounded-xl border border-[#334155] text-sm text-[#F8FAFC] focus:ring-2 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF] transition-all outline-none placeholder:text-[#64748B]"
                    required
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[11px] text-[#00E5FF] hover:text-[#3B82F6] font-medium transition-colors cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-[#1E293B] h-12 pl-10 pr-11 rounded-xl border border-[#334155] text-sm text-[#F8FAFC] focus:ring-2 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF] transition-all outline-none placeholder:text-[#64748B]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-[#1E293B] h-12 pl-10 pr-4 rounded-xl border border-[#334155] text-sm text-[#F8FAFC] focus:ring-2 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF] transition-all outline-none placeholder:text-[#64748B]"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-black/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading
                  ? mode === "register" ? "Creating account..." : mode === "forgot" ? "Sending..." : "Signing in..."
                  : mode === "register" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {mode !== "forgot" && (
              <>
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1E293B]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#111827] px-4 text-[#64748B]">or continue with</span>
                  </div>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-11 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] rounded-xl text-xs font-medium text-[#cbd5e1] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button className="h-11 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] rounded-xl text-xs font-medium text-[#cbd5e1] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#F8FAFC">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                  </button>
                </div>
              </>
            )}

            {/* Toggle between login/register/forgot */}
            <p className="text-center text-xs text-[#64748B]">
              {mode === "forgot" ? (
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                  className="text-[#00E5FF] hover:text-[#3B82F6] font-medium transition-colors cursor-pointer"
                >
                  Back to sign in
                </button>
              ) : mode === "register" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                    className="text-[#00E5FF] hover:text-[#3B82F6] font-medium transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
                    className="text-[#00E5FF] hover:text-[#3B82F6] font-medium transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* ─── RIGHT: Image ─── */}
        <div className="hidden md:block relative w-[60%] overflow-hidden rounded-r-3xl">
          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
            alt="Team collaborating in a modern office"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Warm gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 via-[#0F172A]/40 to-[#0F172A]/70 pointer-events-none" />

          {/* Subtle dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 pointer-events-none" />

          {/* Floating chat bubble */}
          <div className="absolute top-8 left-8 backdrop-blur-xl bg-[#111827]/80 rounded-2xl px-4 py-3 shadow-xl border border-[#1E293B]/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#F8FAFC]">Team Chat</p>
              <p className="text-[8px] text-[#94A3B8]">8 new messages</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          </div>

          {/* Floating calendar card */}
          <div className="absolute bottom-12 right-8 backdrop-blur-xl bg-[#111827]/80 rounded-2xl p-4 shadow-xl border border-[#1E293B]/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#F8FAFC]">Today's Standup</p>
              <p className="text-[8px] text-[#94A3B8]">9:00 AM · 6 attendees</p>
            </div>
          </div>

          {/* Floating avatar stack */}
          <div className="absolute bottom-12 left-8 backdrop-blur-xl bg-[#111827]/70 rounded-xl px-4 py-2.5 shadow-xl border border-[#1E293B]/50 flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              {["#00E5FF", "#3B82F6", "#00E5FF", "#3B82F6"].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#0F172A]"
                  style={{ background: color }}
                />
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-[#0F172A] bg-[#00E5FF]/10 flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#00E5FF]">+3</span>
              </div>
            </div>
            <span className="text-[9px] text-[#94A3B8] font-medium">Active now</span>
          </div>

          {/* Soft glowing accent */}
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#00E5FF]/30 blur-sm animate-ping" style={{ animationDuration: "3s" }} />
        </div>
      </div>
    </div>
  );
}
