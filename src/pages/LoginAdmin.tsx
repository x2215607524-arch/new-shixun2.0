import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail, Phone, ShieldCheck, Key, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Briefcase, KeyRound } from "lucide-react";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";
import adminImg from "../admin.jpg";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [loginForm, setLoginForm] = useState({ account: "", password: "", remember: false });
  const [registerForm, setRegisterForm] = useState({ name: "", phoneOrEmail: "", code: "", department: "运营部", licenseKey: "", password: "", confirmPassword: "", agree: false });
  const [forgotForm, setForgotForm] = useState({ phoneOrEmail: "", code: "", newPassword: "", confirmPassword: "" });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    const field = mode === 'register' ? registerForm.phoneOrEmail : forgotForm.phoneOrEmail;
    if (!field) {
      showToast("请输入邮箱或工作手机号", "warning");
      return;
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field);
    const isPhone = /^1[3-9]\d{9}$/.test(field);
    if (!isEmail && !isPhone) {
      showToast("工作邮箱或手机号格式不正确", "error");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      showToast(`验证码已发送至您的${isEmail ? '邮箱' : '手机'}，请注意查收`, "success");
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.account || !loginForm.password) {
      showToast("请填写完整的管理员账号 and 密码", "warning");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      showToast("管理员登录成功！正在跳转至管理后台...", "success");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.agree) {
      showToast("请先阅读并同意平台数据保密及合规条款", "warning");
      return;
    }
    if (!registerForm.licenseKey) {
      showToast("请输入安全防篡改运营授权密钥", "warning");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }
    if (registerForm.password.length < 8) {
      showToast("为了安全起见，管理员密码不能少于8位", "warning");
      return;
    }
    if (!registerForm.code) {
      showToast("请输入验证码", "warning");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("管理员权限注册及分配成功！正在初始化控制台...", "success");
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        navigate("/admin");
      }, 1500);
    }, 1200);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }
    if (forgotForm.newPassword.length < 8) {
      showToast("新密码长度不能少于8位", "warning");
      return;
    }
    if (!forgotForm.code) {
      showToast("请输入验证码", "warning");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("密码重置成功！即将返回登录...", "success");
      setTimeout(() => {
        setMode('login');
        setForgotForm({ phoneOrEmail: "", code: "", newPassword: "", confirmPassword: "" });
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-neutral-bg relative overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white border border-neutral-border px-4 py-3 rounded-[12px] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-error" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-warning" />}
          {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-info" />}
          <span className="text-[14px] font-medium text-neutral-title">{toast.message}</span>
        </div>
      )}

      {/* Left Side - 2/5 */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-white">
        <img 
          src={adminImg} 
          alt="Admin Login Background" 
          className="absolute inset-0 w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-16 hover:opacity-90 transition-opacity absolute top-8 left-8 z-20 text-white drop-shadow-md">
          <ZhiYunLogo className="w-12 h-12 text-white drop-shadow-md animate-pulse" strokeWidth={2} />
          <span className="text-[24px] font-bold tracking-widest">
            翼实训平台
          </span>
        </Link>
      </div>

      {/* Right Side - 3/5 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-xl border border-neutral-border p-8 transition-all duration-300 hover:shadow-2xl">
          
          {/* LOGIN MODE */}
          {mode === 'login' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-[12px] flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md shadow-primary/30">
                  管
                </div>
                <h1 className="text-[24px] font-bold text-neutral-title tracking-tight">运营端登录</h1>
                <p className="text-[14px] text-neutral-caption mt-2">欢迎回来，请登录您的管理员账号</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="请输入管理员账号/邮箱/手机号" 
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={loginForm.account}
                      onChange={(e) => setLoginForm({ ...loginForm, account: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="请输入密码" 
                      className="pl-10 pr-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-caption hover:text-neutral-title transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[14px]">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded border-neutral-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      checked={loginForm.remember}
                      onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                    />
                    <span className="text-neutral-body group-hover:text-neutral-title transition-colors">自动登录</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setCountdown(0); }} 
                    className="text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
                  >
                    忘记密码？
                  </button>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-[10px] shadow-lg shadow-primary/20 font-medium transition-all active:scale-[0.98]"
                >
                  {loading ? "登 录 中..." : "登 录"}
                </Button>
              </form>

              <div className="mt-6 text-center text-[14px] text-neutral-body">
                还没有管理员权限？{" "}
                <button 
                  type="button" 
                  onClick={() => { setMode('register'); setCountdown(0); }} 
                  className="text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
                >
                  申请管理员账号
                </button>
              </div>
            </div>
          )}

          {/* REGISTER MODE (Request Access) */}
          {mode === 'register' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setMode('login')} 
                  className="flex items-center gap-1.5 text-neutral-body hover:text-neutral-title transition-colors text-[14px]"
                >
                  <ArrowLeft className="w-4 h-4" /> 返回登录
                </button>
                <span className="text-[14px] text-neutral-caption font-medium">管理员权限申请</span>
              </div>

              <div className="flex flex-col items-center mb-4">
                <h1 className="text-[22px] font-bold text-neutral-title">申请运营管理账号</h1>
                <p className="text-[13px] text-neutral-caption mt-1">需填写安全密钥以激活特定部门权限</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="真实姓名" 
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <select
                      className="w-full pl-10 pr-3 h-11 border border-neutral-border rounded-[10px] focus:ring-primary focus:border-primary bg-neutral-bg text-[14px] text-neutral-title focus-visible:ring-primary focus-visible:border-primary transition-all appearance-none cursor-pointer"
                      value={registerForm.department}
                      onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })}
                      required
                    >
                      <option value="运营部">运营部 (Operations)</option>
                      <option value="技术部">技术部 (Technology)</option>
                      <option value="教研实训部">教研实训部 (Education & Practice)</option>
                      <option value="安全合规部">安全合规部 (Security & Compliance)</option>
                    </select>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="运营授权密钥 (Operations Security Key)" 
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.licenseKey}
                      onChange={(e) => setRegisterForm({ ...registerForm, licenseKey: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="工作电子邮箱 / 手机号" 
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.phoneOrEmail}
                      onChange={(e) => setRegisterForm({ ...registerForm, phoneOrEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-neutral-caption" />
                      </div>
                      <Input 
                        type="text" 
                        maxLength={6}
                        placeholder="工作验证码" 
                        className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                        value={registerForm.code}
                        onChange={(e) => setRegisterForm({ ...registerForm, code: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="button"
                      disabled={countdown > 0 || isSending}
                      onClick={handleSendCode}
                      className="h-11 px-4 text-[13px] bg-neutral-bg border border-neutral-border hover:bg-neutral-hover text-neutral-title rounded-[10px] transition-colors whitespace-nowrap min-w-[110px]"
                    >
                      {countdown > 0 ? `${countdown} 秒后重发` : "获取验证码"}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="登录密码 (建议不少于8位)" 
                      className="pl-10 pr-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-caption hover:text-neutral-title transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="再次确认登录密码" 
                      className="pl-10 pr-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-caption hover:text-neutral-title transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-[13px] text-neutral-body leading-relaxed flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="agree-admin"
                    className="rounded border-neutral-border text-primary focus:ring-primary h-4 w-4 mt-0.5 cursor-pointer"
                    checked={registerForm.agree}
                    onChange={(e) => setRegisterForm({ ...registerForm, agree: e.target.checked })}
                  />
                  <label htmlFor="agree-admin" className="cursor-pointer select-none">
                    我已阅读并承诺遵守
                    <a href="#" className="text-primary hover:underline font-medium">《翼实训平台数据合规协议》</a>
                    与
                    <a href="#" className="text-primary hover:underline font-medium">《信息安全及涉密保密制度》</a>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-[10px] shadow-lg shadow-primary/20 font-medium transition-all active:scale-[0.98] mt-2"
                >
                  {loading ? "提交创建并审核中..." : "申 请 开 通 管 理 权 限"}
                </Button>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setMode('login')} 
                  className="flex items-center gap-1.5 text-neutral-body hover:text-neutral-title transition-colors text-[14px]"
                >
                  <ArrowLeft className="w-4 h-4" /> 返回登录
                </button>
                <span className="text-[14px] text-neutral-caption font-medium">重置密码</span>
              </div>

              <div className="flex flex-col items-center mb-4">
                <h1 className="text-[22px] font-bold text-neutral-title">管理员密码重置</h1>
                <p className="text-[13px] text-neutral-caption mt-1">请输入登记的安全手机号或安全邮箱接收重置验证码</p>
              </div>

              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="平台绑定的管理员电子邮箱 / 手机" 
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={forgotForm.phoneOrEmail}
                      onChange={(e) => setForgotForm({ ...forgotForm, phoneOrEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-neutral-caption" />
                      </div>
                      <Input 
                        type="text" 
                        maxLength={6}
                        placeholder="请输入验证码" 
                        className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                        value={forgotForm.code}
                        onChange={(e) => setForgotForm({ ...forgotForm, code: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="button"
                      disabled={countdown > 0 || isSending}
                      onClick={handleSendCode}
                      className="h-11 px-4 text-[13px] bg-neutral-bg border border-neutral-border hover:bg-neutral-hover text-neutral-title rounded-[10px] transition-colors whitespace-nowrap min-w-[110px]"
                    >
                      {countdown > 0 ? `${countdown} 秒后重发` : "获取验证码"}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="设置新登录密码 (不能低于8位)" 
                      className="pl-10 pr-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={forgotForm.newPassword}
                      onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-caption hover:text-neutral-title transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="再次确认新登录密码" 
                      className="pl-10 pr-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={forgotForm.confirmPassword}
                      onChange={(e) => setForgotForm({ ...forgotForm, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-caption hover:text-neutral-title transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-[10px] shadow-lg shadow-primary/20 font-medium transition-all active:scale-[0.98] mt-2"
                >
                  {loading ? "安全重设并保存密码..." : "确 认 重 置"}
                </Button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
