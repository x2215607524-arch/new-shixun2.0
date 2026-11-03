import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail, Phone, ShieldCheck, Key, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Building, Award } from "lucide-react";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";
import teacherImg from "../teacher-login-bg.jpg";

export default function LoginTeacher() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [loginForm, setLoginForm] = useState({ account: "", password: "", remember: false });
  const [registerForm, setRegisterForm] = useState({ name: "", phoneOrEmail: "", code: "", school: "", inviteCode: "", password: "", confirmPassword: "", agree: false });
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
      showToast("请输入邮箱或手机号", "warning");
      return;
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field);
    const isPhone = /^1[3-9]\d{9}$/.test(field);
    if (!isEmail && !isPhone) {
      showToast("邮箱或手机号格式不正确", "error");
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
      showToast("请填写完整的教师账号和密码", "warning");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("教师登录成功！正在跳转控制台...", "success");
      setTimeout(() => {
        navigate("/teacher");
      }, 1000);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.agree) {
      showToast("请先阅读并勾选服务协议与隐私政策", "warning");
      return;
    }
    if (!registerForm.school) {
      showToast("请输入所属学校/机构名称", "warning");
      return;
    }
    if (!registerForm.inviteCode) {
      showToast("请输入校区授权码或教师激活码", "warning");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }
    if (registerForm.password.length < 6) {
      showToast("密码长度不能少于6位", "warning");
      return;
    }
    if (!registerForm.code) {
      showToast("请输入验证码", "warning");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("教师账号激活注册成功！正在进入控制台...", "success");
      setTimeout(() => {
        navigate("/teacher");
      }, 1500);
    }, 1200);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }
    if (forgotForm.newPassword.length < 6) {
      showToast("新密码长度不能少于6位", "warning");
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
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-[#fa541c]">
        <img
          src={teacherImg}
          alt="Teacher Login Background"
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
                  教
                </div>
                <h1 className="text-[24px] font-bold text-neutral-title tracking-tight">教师登录</h1>
                <p className="text-[14px] text-neutral-caption mt-2">欢迎回来，请登录您的教师账号</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input
                      type="text"
                      placeholder="请输入教工号/邮箱/手机号"
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
                还没有教师账号？{" "}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setCountdown(0); }}
                  className="text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
                >
                  立即自助注册
                </button>
              </div>
            </div>
          )}

          {/* REGISTER MODE */}
          {mode === 'register' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setMode('login')}
                  className="flex items-center gap-1.5 text-neutral-body hover:text-neutral-title transition-colors text-[14px]"
                >
                  <ArrowLeft className="w-4 h-4" /> 返回登录
                </button>
                <span className="text-[14px] text-neutral-caption font-medium">教师自助注册</span>
              </div>

              <div className="flex flex-col items-center mb-4">
                <h1 className="text-[22px] font-bold text-neutral-title">注册教师账号</h1>
                <p className="text-[13px] text-neutral-caption mt-1">需填写校区授权激活码完成身份验证</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input
                      type="text"
                      placeholder="教师姓名 (真实姓名)"
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input
                      type="text"
                      placeholder="所属学校 / 教育机构"
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.school}
                      onChange={(e) => setRegisterForm({ ...registerForm, school: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input
                      type="text"
                      placeholder="校区授权码 / 教师激活码"
                      className="pl-10 h-11 border border-neutral-border rounded-[10px] focus-visible:ring-primary focus-visible:border-primary transition-all bg-neutral-bg"
                      value={registerForm.inviteCode}
                      onChange={(e) => setRegisterForm({ ...registerForm, inviteCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input
                      type="text"
                      placeholder="联系手机号 / 电子邮箱"
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
                        placeholder="验证码"
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
                      placeholder="登录密码 (不少于6位)"
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
                    id="agree-teacher"
                    className="rounded border-neutral-border text-primary focus:ring-primary h-4 w-4 mt-0.5 cursor-pointer"
                    checked={registerForm.agree}
                    onChange={(e) => setRegisterForm({ ...registerForm, agree: e.target.checked })}
                  />
                  <label htmlFor="agree-teacher" className="cursor-pointer select-none">
                    我已阅读并同意
                    <a href="#" className="text-primary hover:underline font-medium">《教师端服务使用条款》</a>
                    与
                    <a href="#" className="text-primary hover:underline font-medium">《教学数据安全保护规范》</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-[10px] shadow-lg shadow-primary/20 font-medium transition-all active:scale-[0.98] mt-2"
                >
                  {loading ? "提交激活注册中..." : "申 请 激 活 注 册"}
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
                <span className="text-[14px] text-neutral-caption font-medium">找回密码</span>
              </div>

              <div className="flex flex-col items-center mb-4">
                <h1 className="text-[22px] font-bold text-neutral-title">教师密码重置</h1>
                <p className="text-[13px] text-neutral-caption mt-1">请输入登记的手机或工作邮箱以重设密码</p>
              </div>

              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-caption" />
                    </div>
                    <Input
                      type="text"
                      placeholder="请输入工作邮箱 / 预留手机号"
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
                      placeholder="设置新登录密码 (不少于6位)"
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
                  {loading ? "正在保存新密码..." : "确 认 重 置"}
                </Button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
