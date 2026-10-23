import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import AdminAICenterPage from "./AdminAICenterPage";
import AdminCompetitionsPage from "./AdminCompetitionsPage";
import AdminAIQuotaPage from "./AdminAIQuotaPage";
import AdminTenantsPage from "./AdminTenantsPage";
import AdminPermissionsPage from "./AdminPermissionsPage";
import AdminResourcesPage from "./AdminResourcesPage";
import { Brain, Shield, Cloud, Server, Laptop, Network, Key, Settings, Activity, Users, Database, Cpu, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export function AdminAI() {
  return (
    <AdminStandardPage 
      title="人工智能管理" 
      description="管理AI模型、算力资源与API调用统计"
      primaryAction="部署新模型"
      stats={[
        { title: "模型总数", value: "124", icon: Brain, trend: "12%", trendUp: true },
        { title: "活跃实例", value: "45", icon: Server, trend: "5%", trendUp: true },
        { title: "累计调用", value: "1.2M", icon: Activity, trend: "18%", trendUp: true },
        { title: "GPU利用率", value: "87%", icon: Cpu, trend: "2%", trendUp: false }
      ]}
      columns={["模型名称", "类型", "状态", "部署时间", "调用次数"]}
      data={[
        ["DeepSeek-R1", "LLM", "运行中", "2026-03-15", "45,231"],
        ["Stable Diffusion XL", "CV", "运行中", "2026-03-10", "12,094"],
        ["Whisper-v3", "Audio", "已停止", "2026-02-28", "8,432"],
        ["Llama-3-70B", "LLM", "运行中", "2026-03-01", "32,105"]
      ]}
    />
  );
}

export function AdminSecurity() {
  return (
    <AdminStandardPage 
      title="安全运维" 
      description="监控系统安全状态、告警信息与漏洞修复"
      primaryAction="添加策略"
      stats={[
        { title: "今日告警", value: "3", icon: AlertTriangle, trend: "50%", trendUp: false },
        { title: "拦截攻击", value: "1,204", icon: Shield, trend: "12%", trendUp: true },
        { title: "活跃策略", value: "45", icon: CheckCircle, trend: "0%", trendUp: true },
        { title: "漏洞修复率", value: "98%", icon: Activity, trend: "2%", trendUp: true }
      ]}
      columns={["告警级别", "事件类型", "源IP", "目标资源", "发生时间", "状态"]}
      data={[
        ["高危", "SQL注入", "192.168.1.45", "Web服务", "10分钟前", "已拦截"],
        ["中危", "异常登录", "114.55.2.1", "管理后台", "1小时前", "待处理"],
        ["低危", "端口扫描", "10.0.0.5", "数据库", "2小时前", "已忽略"],
        ["高危", "DDoS攻击", "多个IP", "网关", "昨天", "已缓解"]
      ]}
    />
  );
}

export function AdminPublicCloud() {
  return (
    <AdminStandardPage 
      title="公有云管理" 
      description="管理公有云资源、实例状态与费用统计"
      primaryAction="创建实例"
      stats={[
        { title: "云主机", value: "342", icon: Cloud, trend: "8%", trendUp: true },
        { title: "存储容量", value: "45TB", icon: Database, trend: "15%", trendUp: true },
        { title: "本月费用", value: "¥45,230", icon: Activity, trend: "5%", trendUp: false },
        { title: "运行状态", value: "健康", icon: CheckCircle }
      ]}
      columns={["实例ID", "规格", "区域", "公网IP", "状态"]}
      data={[
        ["i-8s9d7f2a", "4C16G", "华东1 (杭州)", "114.55.12.34", "运行中"],
        ["i-2b3c4d5e", "8C32G", "华北2 (北京)", "39.106.5.6", "运行中"],
        ["i-9f8e7d6c", "2C8G", "华南1 (深圳)", "120.79.8.9", "已停机"],
        ["i-1a2b3c4d", "16C64G", "华东2 (上海)", "47.100.2.3", "运行中"]
      ]}
    />
  );
}

export function AdminPrivateCloud() {
  return (
    <AdminStandardPage 
      title="私有云管理" 
      description="管理本地数据中心、物理节点与虚拟化资源"
      primaryAction="添加节点"
      stats={[
        { title: "物理节点", value: "45", icon: Server, trend: "2", trendUp: true },
        { title: "虚拟机", value: "892", icon: Cloud, trend: "45", trendUp: true },
        { title: "存储集群", value: "12", icon: Database, trend: "0", trendUp: true },
        { title: "整体负载", value: "65%", icon: Activity, trend: "5%", trendUp: false }
      ]}
      columns={["节点名称", "IP地址", "CPU使用率", "内存使用率", "状态"]}
      data={[
        ["node-01-compute", "10.0.0.11", "45%", "60%", "在线"],
        ["node-02-compute", "10.0.0.12", "78%", "85%", "高负载"],
        ["node-03-storage", "10.0.0.21", "20%", "40%", "在线"],
        ["node-04-network", "10.0.0.31", "15%", "30%", "在线"]
      ]}
    />
  );
}

export function AdminIT() {
  return (
    <AdminStandardPage 
      title="IT 资产管理" 
      description="管理企业IT设备、软件授权与工单"
      primaryAction="资产入库"
      stats={[
        { title: "设备总数", value: "1,204", icon: Laptop, trend: "12", trendUp: true },
        { title: "软件授权", value: "450", icon: Key, trend: "5", trendUp: true },
        { title: "待处理工单", value: "12", icon: Clock, trend: "3", trendUp: false },
        { title: "资产健康度", value: "96%", icon: CheckCircle, trend: "1%", trendUp: true }
      ]}
      columns={["资产编号", "设备类型", "使用人", "部门", "状态"]}
      data={[
        ["IT-2026-001", "MacBook Pro 16", "张三", "研发部", "使用中"],
        ["IT-2026-045", "ThinkPad T14", "李四", "市场部", "使用中"],
        ["IT-2026-102", "Dell 显示器 27寸", "王五", "设计部", "使用中"],
        ["IT-2026-230", "iPad Pro", "-", "库存", "闲置"]
      ]}
    />
  );
}

export function AdminIP() {
  return (
    <AdminStandardPage 
      title="IP 地址管理" 
      description="管理网络子网、IP分配与冲突检测"
      primaryAction="分配 IP"
      stats={[
        { title: "IP总数", value: "4,096", icon: Network, trend: "0", trendUp: true },
        { title: "已分配", value: "2,104", icon: CheckCircle, trend: "45", trendUp: true },
        { title: "空闲", value: "1,992", icon: Cloud, trend: "45", trendUp: false },
        { title: "冲突告警", value: "0", icon: AlertTriangle, trend: "2", trendUp: true }
      ]}
      columns={["IP地址", "MAC地址", "分配对象", "状态", "最后活跃时间"]}
      data={[
        ["192.168.10.5", "00:1A:2B:3C:4D:5E", "Server-A", "已分配", "刚刚"],
        ["192.168.10.6", "00:1A:2B:3C:4D:5F", "Router-Core", "已分配", "刚刚"],
        ["192.168.10.7", "-", "-", "空闲", "-"],
        ["10.0.0.15", "AA:BB:CC:DD:EE:FF", "Dev-VM-01", "已分配", "5分钟前"]
      ]}
    />
  );
}

export function AdminPermissions() {
  return <AdminPermissionsPage />;
}

export function AdminSystem() {
  return (
    <AdminStandardPage 
      title="系统管理" 
      description="管理系统配置、定时任务与日志备份"
      primaryAction="系统设置"
      stats={[
        { title: "系统版本", value: "v2.4.0", icon: Settings, trend: "最新", trendUp: true },
        { title: "运行时间", value: "145天", icon: Clock, trend: "稳定", trendUp: true },
        { title: "审计日志", value: "2.4M", icon: Database, trend: "100k", trendUp: true },
        { title: "备份状态", value: "正常", icon: CheckCircle, trend: "今天", trendUp: true }
      ]}
      columns={["任务名称", "类型", "执行周期", "上次执行", "状态"]}
      data={[
        ["数据库全量备份", "定时任务", "每天 02:00", "今天 02:00", "成功"],
        ["系统日志清理", "维护任务", "每周日 03:00", "上周日 03:00", "成功"],
        ["配置同步", "系统任务", "每小时", "10分钟前", "成功"],
        ["漏洞库更新", "安全任务", "每天 04:00", "今天 04:00", "成功"]
      ]}
    />
  );
}



export function AdminResources() {
  return <AdminResourcesPage />;
}

export function AdminTenants() {
  return <AdminTenantsPage />;
}

export function AdminAIQuota() {
  return <AdminAIQuotaPage />;
}

export function AdminCompetitions() {
  return <AdminCompetitionsPage />;
}

export function AdminAICenter() {
  return <AdminAICenterPage />;
}

export function AdminNetworkSimulation() {
  return (
    <AdminStandardPage
      title="网络仿真"
      description="管理网络拓扑、仿真任务与运行环境"
      primaryAction="新建仿真"
      stats={[{ title: "仿真场景", value: "24", icon: Network }]}
      columns={["场景名称", "网络拓扑", "运行状态"]}
      data={[["企业园区网络", "三层交换网络", "运行中"]]}
    />
  );
}
