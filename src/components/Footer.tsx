import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ZhiYunLogo } from "@/components/icons/ZhiYunLogo";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <ZhiYunLogo className="w-8 h-8 text-[#fa541c]" />
              <span className="text-xl font-bold text-slate-900">
                翼实训平台
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              新一代翼实训平台，致力于培养具备实战能力的AI工程师，助力企业数字化转型。
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#fa541c] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#fa541c] hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#fa541c] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-6">产品服务</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">AI 课程体系</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">企业级实战项目</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">在线实验环境</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">能力认证考试</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-6">支持与帮助</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">帮助中心</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">开发者文档</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">社区论坛</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#fa541c] text-sm transition-colors">联系客服</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-6">联系我们</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>北京市海淀区中关村软件园</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                <span>400-123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@yishixun.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} 翼实训平台. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-slate-400 hover:text-[#fa541c] text-sm transition-colors">隐私政策</Link>
            <Link to="#" className="text-slate-400 hover:text-[#fa541c] text-sm transition-colors">服务条款</Link>
            <Link to="#" className="text-slate-400 hover:text-[#fa541c] text-sm transition-colors">Cookie政策</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
