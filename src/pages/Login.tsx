import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to user dashboard
    navigate("/user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
      <div className="w-full max-w-[400px] bg-white rounded-[8px] shadow-lg border border-neutral-border p-8">
        <div className="mb-10 flex flex-col items-center">
          <ZhiYunLogo className="w-12 h-12 text-[#fa541c] mb-4" />
          <h1 className="text-[24px] font-medium text-neutral-title">登录翼实训平台</h1>
          <p className="text-[14px] text-neutral-caption mt-2">欢迎回来，请登录您的账号</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neutral-caption" />
              </div>
              <Input 
                type="text" 
                placeholder="请输入用户名/邮箱/手机号" 
                className="pl-10 h-10"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-caption" />
              </div>
              <Input 
                type="password" 
                placeholder="请输入密码" 
                className="pl-10 h-10"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-neutral-border text-[#fa541c] focus:ring-[#fa541c]" />
              <span className="text-neutral-body">自动登录</span>
            </label>
            <a href="#" className="text-[#fa541c] hover:underline">忘记密码？</a>
          </div>

          <Button type="submit" className="w-full h-10 bg-[#fa541c] hover:bg-[#ff7a45] text-white">
            登 录
          </Button>
        </form>

        <div className="mt-6 text-center text-[14px] text-neutral-body">
          还没有账号？ <Link to="/login" className="text-[#fa541c] hover:underline">立即注册</Link>
        </div>
      </div>
    </div>
  );
}
