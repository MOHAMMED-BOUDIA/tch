import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Bolt, ArrowRight, ArrowLeft, Calendar, MessageSquare, User, AtSign } from "lucide-react";

interface Props {
  onLogin: (token: string, role: string, userId: string) => void;
  onBackToLanding?: () => void;
}

export default function UserLogin({ onLogin, onBackToLanding }: Props) {
  const router = useRouter();
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
        endpoint = "/api/auth/register";
        body = { username, email, password, name };
      } else if (mode === "forgot") {
        endpoint = "/api/auth/forgot-password";
        body = { email };
      } else {
        endpoint = "/api/auth/login";
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
      if (mode === "register") {
        setSuccessMsg("Account created successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }
      if (mode === "forgot") {
        setSuccessMsg(data.message || "Check your email for the reset link.");
        return;
      }
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_id", String(data.user.id));
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
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

                
            

            {/* Toggle between login/register/forgot */}
            <p className="text-center text-xs text-[#64748B]">
              {mode === "register" ? (
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
            </>
            )}
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
              <p className="text-[10px] font-bold text-[#F8FAFC]">{`Today's Standup`}</p>
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
