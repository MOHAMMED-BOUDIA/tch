import React, { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Bolt, ArrowRight, User, AtSign } from "lucide-react";

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

  const inputClass =
    "w-full bg-canvas-parchment h-12 pl-10 pr-4 rounded-pill border border-hairline body text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none placeholder:text-ink-muted-48";

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 md:p-6">
      <nav className="fixed top-0 left-0 right-0 h-11 bg-surface-black z-50 flex items-center justify-between px-6 select-none">
        <div className="flex items-center gap-2">
          <Bolt className="w-4 h-4 text-primary-on-dark" />
          <span className="nav-link font-semibold text-body-on-dark tracking-normal">Nexus</span>
        </div>
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="nav-link text-body-on-dark/70 hover:text-body-on-dark transition-colors cursor-pointer"
          >
            Back to site
          </button>
        )}
      </nav>

      <div className="w-full max-w-5xl bg-canvas rounded-md product-shadow overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[680px] border border-hairline">
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-pill bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bolt className="text-primary w-5 h-5" />
              </div>
              <span className="body-strong text-ink">Nexus</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="display-md text-ink">
                {mode === "register" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back"}
              </h1>
              <p className="body text-ink-muted-48">
                {mode === "register" ? "Join the network to start collaborating." : mode === "forgot" ? "Enter your email to receive a reset link." : "Sign in to your account to continue."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 caption px-4 py-3 rounded-pill font-medium">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 caption px-4 py-3 rounded-pill font-medium">
                  {successMsg}
                </div>
              )}

              {mode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label className="fine-print font-semibold text-ink-muted-48 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted-48" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="fine-print font-semibold text-ink-muted-48 uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted-48" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="alexrivera"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="fine-print font-semibold text-ink-muted-48 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted-48" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="fine-print font-semibold text-ink-muted-48 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="fine-print text-primary hover:text-primary-focus font-medium transition-colors cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted-48" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-canvas-parchment h-12 pl-10 pr-11 rounded-pill border border-hairline body text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none placeholder:text-ink-muted-48"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted-48 hover:text-ink transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="fine-print font-semibold text-ink-muted-48 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted-48" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary-focus text-white body-strong rounded-pill transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading
                  ? mode === "register" ? "Creating account..." : mode === "forgot" ? "Sending..." : "Signing in..."
                  : mode === "register" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {mode !== "forgot" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline" />
                  </div>
                  <div className="relative flex justify-center caption">
                    <span className="bg-canvas px-4 text-ink-muted-48">or continue with</span>
                  </div>
                </div>

                <p className="text-center caption text-ink-muted-48">
                  {mode === "register" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                        className="text-primary hover:text-primary-focus font-medium transition-colors cursor-pointer"
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
                        className="text-primary hover:text-primary-focus font-medium transition-colors cursor-pointer"
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

        <div className="hidden md:block relative w-[60%] overflow-hidden bg-surface-tile-1">
          <div className="absolute inset-0 bg-surface-tile-1 pointer-events-none" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] opacity-70 pointer-events-none">
            <GraphVisual />
          </div>

          <div className="absolute top-8 left-8 frosted rounded-md px-4 py-3 border border-white/10 flex items-center gap-3 product-shadow">
            <div className="w-9 h-9 rounded-xs bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <MessageSquareIcon />
            </div>
            <div>
              <p className="caption-strong text-white">Team Chat</p>
              <p className="fine-print text-body-muted">8 new messages</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-8 frosted rounded-md p-4 border border-white/10 flex items-center gap-3 product-shadow w-52">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="caption-strong text-white">Collaboration</p>
                <span className="fine-print text-primary font-bold">+23%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-pill overflow-hidden">
                <div className="h-full bg-primary rounded-pill" style={{ width: "76%" }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="fine-print text-body-muted">This week</span>
                <span className="fine-print text-body-muted">76%</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-8 frosted rounded-md p-3.5 border border-white/10 product-shadow">
            <p className="fine-print text-body-muted font-medium mb-2">Active now</p>
            <div className="flex items-center -space-x-2">
              {["#0066cc", "#0071e3", "#0066cc", "#0071e3"].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-surface-tile-1 flex items-center justify-center"
                  style={{ background: color }}
                />
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-surface-tile-1 bg-primary/20 flex items-center justify-center">
                <span className="fine-print font-bold text-white">+3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageSquareIcon() {
  return (
    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function GraphVisual() {
  const nodes = [
    { cx: 210, cy: 120, r: 18 },
    { cx: 120, cy: 210, r: 18 },
    { cx: 300, cy: 210, r: 18 },
    { cx: 160, cy: 300, r: 18 },
    { cx: 260, cy: 300, r: 18 },
    { cx: 210, cy: 380, r: 18 },
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2], [3, 4]];

  return (
    <svg viewBox="0 0 420 480" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="#2a2a2c"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
          />
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r={n.r * 1.1}
            fill="none"
            stroke="rgba(0,102,204,0.4)"
            strokeWidth="1"
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r="5"
            fill="#0066cc"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
        </g>
      ))}
    </svg>
  );
}
