import React from "react";
import AdminStandardPage from "./AdminStandardPage";
import { Trophy, Users, Award, Clock, CheckCircle } from "lucide-react";

export default function AdminAICompetitions() {
  return (
    <AdminStandardPage 
      title="人工智能竞赛管理" 
      description="管理AI算法竞赛、排行榜、队伍及评测系统"
      primaryAction="发布竞赛"
      stats={[
        { title: "进行中竞赛", value: "3", icon: Trophy, trend: "1", trendUp: true },
        { title: "参赛队伍", value: "1,245", icon: Users, trend: "450", trendUp: true },
        { title: "提交次数", value: "45.2k", icon: Award, trend: "12k", trendUp: true },
        { title: "评测队列", value: "12", icon: Clock, trend: "5", trendUp: false }
      ]}
      columns={["竞赛名称", "类型", "参赛队伍", "状态", "开始时间", "结束时间"]}
      data={[
        ["2026 全国大模型应用创新赛", "应用开发", "452", "进行中", "2026-03-01 09:00:00", "2026-05-31 18:00:00"],
        ["医疗影像病灶检测挑战赛", "计算机视觉", "320", "进行中", "2026-03-15 08:30:00", "2026-04-30 18:00:00"],
        ["金融风控预测算法大赛", "机器学习", "890", "已结束", "2025-12-01 09:00:00", "2026-02-28 20:00:00"],
        ["智能客服多轮对话评测", "自然语言处理", "150", "报名中", "2026-04-01 10:00:00", "2026-06-30 22:00:00"]
      ]}
    />
  );
}
