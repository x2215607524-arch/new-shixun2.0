import React, { useState } from "react";
import { 
  BookOpen, FolderKanban, FileQuestion, Cpu, Building, CheckCircle, 
  Clock, Search, Filter, Check, Shield, AlertCircle, Sparkles, X, 
  FileText, ClipboardCheck, ThumbsUp, User, ChevronRight, Database,
  ChevronDown, HelpCircle, Info, ShieldCheck, Play, Video, Terminal,
  Code, Layers, Download, ExternalLink, CheckCircle2, AlertTriangle,
  ChevronLeft, ArrowRight, MonitorPlay, ArrowLeft, Bold, Italic, Type, List, AlignCenter, Upload, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Mock Data Interfaces & Syllabus Types ---

export interface LessonDetailInfo {
  id: string;
  lessonNo: string;
  title: string;
  type: "video" | "experiment" | "doc" | "quiz" | "code";
  duration: string;
  objective: string;
  status: "合规" | "待审核" | "需关注" | "重点审核";
  videoInfo?: {
    resolution: string;
    bitrate: string;
    durationSeconds: number;
    videoUrlMock: string;
    subtitlesAvailable: boolean;
  };
  docInfo?: {
    wordCount: number;
    hasImages: boolean;
    contentMarkdown: string;
  };
  experimentInfo?: {
    envName: string;
    gpuRequirement: string;
    ramLimit: string;
    baseImage: string;
    datasetName: string;
    taskSteps: string[];
    sampleCode?: string;
  };
  quizInfo?: {
    questionCount: number;
    totalPoints: number;
    questionsPreview: Array<{
      qTitle: string;
      qType: string;
      options?: string[];
      answer: string;
      explanation: string;
    }>;
  };
  codeInfo?: {
    repoName: string;
    language: string;
    entryFile: string;
    files: string[];
    codePreview: string;
  };
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
  complianceChecks?: Array<{
    title: string;
    passed: boolean;
    desc: string;
  }>;
}

export interface CourseChapter {
  id: string;
  chapterNo: string;
  title: string;
  summary: string;
  lessons: LessonDetailInfo[];
}

interface AuditResource {
  id: string;
  name: string;
  creator: string;
  tenant: string;
  submitTime: string;
  status: "待审核" | "审核中" | "已通过" | "已驳回";
  auditType?: "租户公开" | "平台公开" | "下架" | "公开";
  rejectionReason?: string;
  details: {
    meta: string; // e.g. "32课时 | 2学分"
    content: string; // long summary
    outline: string[]; // key sub-items
  };
  chapters?: CourseChapter[];
  environments?: EnvConfig[];
}

export interface EnvConfig {
  id: string;
  resourcePool: string;
  type: '容器' | '虚机';
  sourceFile?: string;
  sourceRepoUrl?: string;
  creationMethod?: 'template' | 'custom';
  cpuCores?: string;
  memoryGB?: string;
  gpu?: {
    power: string;
    vram: string;
    count: string;
    model?: string;
  };
  image: string;
  envVariables?: { key: string; value: string }[];
  startCommand?: string;
  vmSpecType?: 'custom' | 'spec';
  selectedSpec?: string;
  storage?: {
    type: string;
    systemDisk: string;
    dataType?: string;
    dataDisk: string;
  };
  network?: {
    vpc: string;
    subnet: string;
  };
  vncType?: string;
}

export function getDefaultEnvironments(project: AuditResource): EnvConfig[] {
  if (project.environments && project.environments.length > 0) {
    return project.environments;
  }

  if (project.id.includes("PRJ-002") || project.name.includes("医学影像") || project.name.includes("ResNet")) {
    return [
      {
        id: "env-vm-1",
        resourcePool: "上海园区资源池",
        type: "虚机",
        sourceRepoUrl: "med_resnet50_segmentation_v2.zip (48.5 MB)",
        creationMethod: "custom",
        vmSpecType: "custom",
        selectedSpec: "8核 32G | 100GB SSD + 1x A100",
        image: "sh-pytorch:2.2.0-cuda12.1-gpu",
        cpuCores: "8",
        memoryGB: "32",
        gpu: { model: "A100", count: "1", power: "100", vram: "80" },
        storage: { type: "SSD", systemDisk: "100", dataType: "ESSD", dataDisk: "500" },
        network: { vpc: "vpc-shanghai-ai-01", subnet: "subnet-gpu-cluster-02" },
        vncType: "novnc",
        envVariables: [
          { key: "DATASET_PATH", value: "/mnt/data/medical_dicom_v2" },
          { key: "CUDA_VISIBLE_DEVICES", value: "0" },
          { key: "MODEL_SAVE_DIR", value: "/mnt/data/checkpoints" }
        ],
        startCommand: "python train.py --model unet_resnet50 --batch_size 16 --epochs 50"
      }
    ];
  }

  return [
    {
      id: "env-c1",
      resourcePool: "天翼云资源池1",
      type: "容器",
      sourceRepoUrl: "git@github.com:enterprise/cloud-ecommerce-microservices.git",
      creationMethod: "custom",
      image: "ctyun-openjdk:17-jdk-alpine",
      cpuCores: "4",
      memoryGB: "8",
      gpu: { model: "无", count: "0", power: "0", vram: "0" },
      envVariables: [
        { key: "SPRING_PROFILES_ACTIVE", value: "prod" },
        { key: "EUREKA_SERVER", value: "http://eureka-server:8761/eureka/" },
        { key: "SENTINEL_PORT", value: "8719" }
      ],
      startCommand: "java -jar /app/ecommerce-gateway-1.0.jar --spring.profiles.active=prod"
    },
    {
      id: "env-c2",
      resourcePool: "天翼云资源池1",
      type: "容器",
      sourceRepoUrl: "git@github.com:enterprise/cloud-ecommerce-microservices.git",
      creationMethod: "custom",
      image: "ctyun-python:3.10-slim-cpu",
      cpuCores: "2",
      memoryGB: "4",
      gpu: { model: "4090", count: "1", power: "100", vram: "24" },
      envVariables: [
        { key: "REDIS_SENTINEL_NODES", value: "10.0.4.12:26379,10.0.4.13:26379" },
        { key: "NUM_WORKERS", value: "4" }
      ],
      startCommand: "python main.py --mode worker"
    }
  ];
}

function getDefaultChapters(course?: AuditResource | null): CourseChapter[] {
  if (course && course.chapters && course.chapters.length > 0) {
    return course.chapters;
  }

  return [
    {
      id: "chap-1",
      chapterNo: "第一课",
      title: "第一课 人工智能训练师三级考试内容指导",
      summary: "包含职业简介、认定方案、认定要素细目表与平台演示讲义",
      lessons: [
        { id: "les-1-1", lessonNo: "1", title: "职业简介", type: "doc", duration: "15分钟", objective: "了解人工智能训练师职业定位与发展方向", status: "合规" },
        { id: "les-1-2", lessonNo: "2", title: "认定方案", type: "doc", duration: "20分钟", objective: "掌握三级职业技能认定考核方案", status: "合规" },
        { id: "les-1-3", lessonNo: "3", title: "认定要素细目表", type: "doc", duration: "25分钟", objective: "梳理认定考核核心技能与知识细目", status: "合规" },
        { id: "les-1-4", lessonNo: "4", title: "实操平台演示", type: "doc", duration: "30分钟", objective: "熟悉自动化考核与实操平台操作流程", status: "合规" },
        { id: "les-1-5", lessonNo: "5", title: "代码复习讲义", type: "doc", duration: "35分钟", objective: "复习必备基础算法代码与知识框架", status: "合规" }
      ]
    },
    {
      id: "chap-2",
      chapterNo: "第二课",
      title: "第二课 培训与指导",
      summary: "包含线性回归预测、互动课件演示与健康手环优化等实训",
      lessons: [
        { id: "les-2-1", lessonNo: "1", title: "线性回归实训：预测考试分数", type: "code", duration: "45分钟", objective: "使用线性回归算法进行数据集拟合与预测", status: "合规" },
        { id: "les-2-2", lessonNo: "2", title: "互动学习课件案例演示demo", type: "video", duration: "40分钟", objective: "通过互动课件掌握AI模型应用构建", status: "合规" },
        { id: "les-2-3", lessonNo: "3", title: "智能健康手环的数据分析与优化[3.1.3]", type: "code", duration: "50分钟", objective: "清洗特征数据并优化手环模型分类准确率", status: "合规" }
      ]
    }
  ];
}

const initialResources: Record<"course" | "project" | "question" | "paper" | "ai_capacity" | "practice" | "dataset", AuditResource[]> = {
  course: [
    {
      id: "AUD-CRS-001",
      name: "大语言模型工程应用与LoRA微调技术",
      creator: "张旭东 教授",
      tenant: "北京大学信息学院",
      submitTime: "2026-05-26 11:30",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "32 课时 | 2.0 学分 | RAG 与 LoRA 核心方向",
        content: "本课程专注大模型应用落地，涵盖 Prompt Engineering 最佳编写规范、语义向量数据库融合、RAG 混合召回系统搭建，以及利用 LoRA 算法针对垂直行业私有数据集进行高效微调部署。",
        outline: [
          "第一章: 生成式 AI 与大模型产业背景 (4课时)",
          "第二章: 向量检索与 RAG 融合系统架构 (8课时)",
          "第三章: 参数高效微调 (PEFT) 与 LoRA 实战 (12课时)",
          "第四章: 大模型安全合规性与企业级沙箱部署 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-002",
      name: "Python数据分析与多维科学计算实训",
      creator: "陈明 助教",
      tenant: "复旦大学软件学院",
      submitTime: "2026-05-25 10:15",
      status: "审核中",
      auditType: "租户公开",
      details: {
        meta: "48 课时 | 3.0 学分 | 数据分析与建模方向",
        content: "实战向数据科学基石课，针对高校学生定制，主攻 Numpy 多维数值计算、Pandas 多维表格数据操作清洗、Matplotlib & Seaborn 数据智能分析呈现以及 Scikit-learn 基本经典算法训练。",
        outline: [
          "第一章: Python 编程基础与科学计算环境搭建 (6课时)",
          "第二章: Numpy 矩阵操作与向量运算加速 (10课时)",
          "第三章: Pandas 高维数据清洗、聚合与时序操作 (16课时)",
          "第四章: 经典机器学习回归、分类及特征工程实战 (16课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-003",
      name: "计算机视觉与OpenCV图像处理实践",
      creator: "黄建华 教授",
      tenant: "浙江大学计算机学院",
      submitTime: "2026-05-27 09:10",
      status: "待审核",
      auditType: "下架",
      details: {
        meta: "36 课时 | 2.5 学分 | 图像算法方向",
        content: "该课程由教师提请申请下架，因课程教材版本升级且部分依赖库已被淘汰，需暂时从公共目录中下架该课程资源。",
        outline: [
          "下架申请原因: 教学大纲与OpenCV 4.0标准不符合，课程技术栈过时需更新",
          "后续安排: 预计下个学期完成新版大纲重构后再重新申请公开"
        ]
      }
    },
    {
      id: "AUD-CRS-004",
      name: "深度学习原理与PyTorch神经网络实战",
      creator: "李国强 副教授",
      tenant: "上海交通大学电子信息学院",
      submitTime: "2026-05-24 16:45",
      status: "已通过",
      auditType: "租户公开",
      details: {
        meta: "64 课时 | 4.0 学分 | 深度学习算法方向",
        content: "从神经网络感知机模型推导开始，涵盖 CNN、RNN、LSTM 及 Attention 机制原理，并在 PyTorch 框架下完成图像分类与自动文本生成项目搭建。",
        outline: [
          "第一章: 前向传播与反向传播算法推导 (12课时)",
          "第二章: 卷积神经网络 (CNN) 架构演进与 ImageNet 竞赛模型 (18课时)",
          "第三章: 循环神经网络与 Sequence-to-Sequence 模型 (18课时)",
          "第四章: PyTorch 模型分布式多卡训练实践 (16课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-005",
      name: "商业智能分析与Spark大数据处理大纲",
      creator: "王敏 讲师",
      tenant: "南京大学管理学院",
      submitTime: "2026-05-27 11:20",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "32 课时 | 2.0 学分 | 大数据处理方向",
        content: "讲解 Spark 核心数据结构 RDD、DataFrame 及 Spark SQL 查询优化器原理，配套千亿级电商日志离线清洗与实时流计算实训任务。",
        outline: [
          "第一章: 大数据生态与 HDFS 分布式存储 (6课时)",
          "第二章: Spark 算子转换与内存计算架构 (10课时)",
          "第三章: Spark SQL 与数据仓库 Hive 整合实践 (10课时)",
          "第四章: 实时流计算 Spark Streaming 项目实训 (6课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-006",
      name: "强化学习与自动驾驶决策规划算法",
      creator: "赵云 教授",
      tenant: "同济大学汽车学院",
      submitTime: "2026-05-23 14:00",
      status: "已通过",
      auditType: "下架",
      details: {
        meta: "40 课时 | 2.5 学分 | 智能驾驶方向",
        content: "教师申请将老版 DQ-Network 课程下架，更新为 PPO 与 SAC 连续动作空间决策算法。",
        outline: [
          "下架申请原因: 旧版 DQN 算法例程无法接入 Carla 0.9.15 新版仿真引擎",
          "后续安排: 替换为现代连续控制 SAC 策略梯度课程后重提交"
        ]
      }
    },
    {
      id: "AUD-CRS-007",
      name: "企业级微服务架构与K8s容器化部署",
      creator: "周建军 专家",
      tenant: "东南大学软件学院",
      submitTime: "2026-05-26 17:30",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "48 课时 | 3.0 学分 | 云原生方向",
        content: "覆盖 Docker 容器化构建、Spring Cloud 微服务组件拆分、Istio 服务网格与 Kubernetes Horizontal Pod Autoscaler 弹性扩缩容部署。",
        outline: [
          "第一章: 容器化演进与 Dockerfile 最佳实践 (10课时)",
          "第二章: Spring Cloud Alibaba 服务发现与配置中心 (14课时)",
          "第三章: Kubernetes 资源调度与 Helm 编排实战 (16课时)",
          "第四章: 云原生 DevOps 持续集成与发布 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-008",
      name: "前沿推荐系统算法与多路召回排序实践",
      creator: "孙艺 助教",
      tenant: "华中科技大学电信学院",
      submitTime: "2026-05-22 08:30",
      status: "已驳回",
      auditType: "租户公开",
      rejectionReason: "实验数据集中缺少脱敏处理说明，且第二章算法推理细则缺少配套练习答案。",
      details: {
        meta: "32 课时 | 2.0 学分 | 推荐算法方向",
        content: "讲解协同过滤、FM 因子分解机、DeepFM 及向量化双塔召回算法，结合真实流媒体点播场景进行 CTCVR 多目标拟合。",
        outline: [
          "第一章: 协同过滤与矩阵分解 (8课时)",
          "第二章: 深度学习推荐模型 DeepFM / DIN (10课时)",
          "第三章: 多路召回与向量数据库近似最近邻检索 (8课时)",
          "第四章: 多目标排序与重排策略 (6课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-009",
      name: "嵌入式AI与Edge Impulse边缘计算实训",
      creator: "宋华 教授",
      tenant: "西安交通大学微电子学院",
      submitTime: "2026-05-27 13:50",
      status: "待审核",
      auditType: "平台公开",
      details: {
        meta: "24 课时 | 1.5 学分 | 边缘计算方向",
        content: "结合 STM32F4 / ESP32 硬件板卡，讲授轻量化神经网络剪枝、8-bit 定点量化，并在 MCU 资源受限微控制器上运行 TinyML 实时姿态识别。",
        outline: [
          "第一章: 边缘计算与 TinyML 架构概论 (4课时)",
          "第二章: 神经网络参数剪枝与 INT8 量化算法 (8课时)",
          "第三章: 在 STM32 目标板上部署 TensorFLow Lite for Microcontrollers (12课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-010",
      name: "Web3智能合约开发与区块链安全审计",
      creator: "徐洋 讲师",
      tenant: "哈尔滨工业大学计算学部",
      submitTime: "2026-05-25 19:10",
      status: "待审核",
      auditType: "下架",
      details: {
        meta: "32 课时 | 2.0 学分 | 区块链方向",
        content: "申请下架包含已有重入攻击缺陷案例的实验项目，更新为 OpenZeppelin 5.0 安全库标准。",
        outline: [
          "下架申请原因: Solidity 0.8.20 语法更新，原以太坊硬分叉测试网 Goerli 已停用",
          "后续安排: 升级至 Sepolia 测试网后重新提交公开审核"
        ]
      }
    },
    {
      id: "AUD-CRS-011",
      name: "自然语言处理与BERT/GPT大模型理论",
      creator: "钱峰 教授",
      tenant: "中山大学计算机学院",
      submitTime: "2026-05-21 15:20",
      status: "已通过",
      auditType: "平台公开",
      details: {
        meta: "40 课时 | 2.5 学分 | NLP 方向",
        content: "从 Word2Vec 词向量表征、Seq2Seq 语法树解析，到 Transformer Encoder-Decoder 结构，系统剖析 BERT 预训练语言模型与 GPT 自回归生成模型原理。",
        outline: [
          "第一章: 传统文本表征与 N-gram 语言模型 (8课时)",
          "第二章: BERT 掩码语言模型与下游任务微调 (14课时)",
          "第三章: GPT 系列模型自回归解码策略 (18课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-012",
      name: "工业级RAG检索增强生成与知识图谱融合",
      creator: "韩梅 副教授",
      tenant: "天津大学智能与计算学部",
      submitTime: "2026-05-27 15:00",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "36 课时 | 2.5 学分 | 知识图谱方向",
        content: "围绕企业私有知识库问答痛点，融合 Neo4j 图数据库实体关系检索与 Milvus 向量数据库相似度召回，实现 GraphRAG 混合增强系统。",
        outline: [
          "第一章: 知识图谱构建与实体关系抽取 (10课时)",
          "第二章: 混合召回 RAG 架构与重排序 Rerank 模型 (12课时)",
          "第三章: GraphRAG 工业级知识库系统搭建实训 (14课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-013",
      name: "软件质量保证与自动化测试框架设计",
      creator: "彭亮 助教",
      tenant: "北京邮电大学软件学院",
      submitTime: "2026-05-20 11:00",
      status: "已驳回",
      auditType: "下架",
      rejectionReason: "下架申请理由阐述不清，且该课程尚在校内公开选课阶段，需先协调教务部门。",
      details: {
        meta: "32 课时 | 2.0 学分 | 软件测试方向",
        content: "涵盖 JUnit 5 单元测试、Selenium 网页 UI 自动化测试、JMeter 性能压力测试及 CI/CD 测试管线搭建。",
        outline: [
          "申请说明: 申请下架老版测试大纲",
          "驳回说明: 需提供教务处变更审批件"
        ]
      }
    },
    {
      id: "AUD-CRS-014",
      name: "智能语音识别与Whisper模型落地实践",
      creator: "郑浩 教授",
      tenant: "电子科技大学信息与通信工程学院",
      submitTime: "2026-05-27 16:30",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "24 课时 | 1.5 学分 | 语音处理方向",
        content: "介绍梅尔倒谱系数 (MFCC) 提取、CTC 损失函数原理，并基于 OpenAI Whisper 开展长音频字幕时间戳自动对齐实训。",
        outline: [
          "第一章: 声学信号处理与梅尔频谱图转换 (6课时)",
          "第二章: Whisper 语音模型架构与多语言转写 (10课时)",
          "第三章: 实时流式语音识别 API 部署 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-015",
      name: "算法高阶推导与LeetCode百题通关指南",
      creator: "马远 讲师",
      tenant: "中国科学技术大学计算机学院",
      submitTime: "2026-05-19 10:00",
      status: "已通过",
      auditType: "平台公开",
      details: {
        meta: "48 课时 | 3.0 学分 | 算法设计方向",
        content: "主攻高阶数据结构与动态规划，包含线段树、并查集、单调栈、Dijkstra 最短路径及背包问题推导解析。",
        outline: [
          "第一章: 复杂数据结构高级应用 (12课时)",
          "第二章: 图论算法与最短路径/最小生成树 (14课时)",
          "第三章: 动态规划状态转移方程构建精讲 (22课时)"
        ]
      }
    }
  ],
  project: [
    {
      id: "AUD-PRJ-001",
      name: "云原生微服务高并发电商实训项目",
      creator: "王强 教授",
      tenant: "清华大学计算机系",
      submitTime: "2026-05-26 14:00",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "大型分布式实训项目 | 建议耗时 2-3 周",
        content: "本实训模拟企业级超高并发电商结算场景，要求学生使用 Spring Cloud Alibaba 进行微服务治理，整合 Kubernetes 自动化容器调度、Sentinel 限流熔断防护，以及 Redis 哨兵多级缓存及秒杀库存一致性问题解决。",
        outline: [
          "环节一: 系统模块微服务架构拆分与 Eureka 注册中心注册",
          "环节二: 使用 Redis 乐观锁 + Lua 脚本实现超卖防御与一致性",
          "环节三: 编写 Dockerfile 并使用 Jenkins 流水线自动推送 Harbor",
          "环节四: 在 K8s 上编写 Deployment 与 Service 文件进行水平扩缩容部署"
        ]
      }
    },
    {
      id: "AUD-PRJ-002",
      name: "ResNet50医学影像病灶智能分割项目",
      creator: "徐教授",
      tenant: "上海交通大学医学院",
      submitTime: "2026-05-24 09:00",
      status: "已通过",
      auditType: "平台公开",
      details: {
        meta: "深度学习医学影像实训 | 建议耗时 1-2 周",
        content: "跨学科前沿 AI 实验。学生需要使用 PyTorch 加载预训练 ResNet50/UNet 模型，针对脱敏公开的肺部 CT/脑部 MRI 影像进行边缘检测与图像分割处理，使用 Dice 相似系数评估病灶捕捉效果。",
        outline: [
          "环节一: 医学 DICOM 图像格式转换及 CLAHE 对比度受限自适应直方图均衡化",
          "环节二: 使用 PyTorch 构建包含 Skip Connection 的 UNet 核心网络",
          "环节三: 采用 CrossEntropy 与 Dice Loss 混合损失函数进行迭代寻优",
          "环节四: 通过 Confusion Matrix 计算 Precision、Recall 和 F1-score 指标"
        ]
      }
    }
  ],
  question: [
    {
      id: "AUD-QUE-001",
      name: "Transformer自注意力机制物理意义考核题",
      creator: "刘博士",
      tenant: "浙江大学控制系",
      submitTime: "2026-05-26 15:30",
      status: "待审核",
      auditType: "平台公开",
      details: {
        meta: "大模型理论主观思考题 | 标签: 深度学习, Transformer",
        content: "简答题：请写出 Transformer 核心架构中 Self-Attention (自注意力机制) 的数学计算公式，并分别详细阐述公式中查询矩阵 (Q)、键矩阵 (K)、值矩阵 (V) 的物理含义。最后说明为什么在计算内积后需要除以根号下 dk 缩放因子？",
        outline: [
          "考察知识点: Transformer 架构, QKV 矩阵投影, 梯度消失预防机制",
          "评分标准一: 完整写出 Self-Attention 公式: Softmax(Q K^T / sqrt(d_k)) * V 占 30% 分数",
          "评分标准二: 阐明 Q-查询, K-被查询键值, V-内容信息的表征占 40% 分数",
          "评分标准三: 解释除以缩放因子是为了防止 dk 维度过大时内积结果过大，Softmax 进入饱和区导致梯度消失占 30% 分数"
        ]
      }
    },
    {
      id: "AUD-QUE-002",
      name: "Kubernetes就绪与存活探针机制单选题",
      creator: "赵讲师",
      tenant: "武汉大学软件学院",
      submitTime: "2026-05-25 16:00",
      status: "已通过",
      auditType: "租户公开",
      details: {
        meta: "云原生容器单选题 | 标签: K8s, 运维监控",
        content: "单选题：在 Kubernetes 的 Pod 生命周期管理中，如果希望评估容器内服务是否已经初始化完成，能正常承接外部网关 Service 流量，应该优选配置哪种机制？\n选项：\nA. Liveness Probe (存活探针)\nB. Readiness Probe (就绪探针)\nC. Startup Probe (启动探针)\nD. PostStart Hook (后置启动钩子)",
        outline: [
          "正确答案: B. Readiness Probe (就绪探针)",
          "解析: Readiness Probe 就绪探针用来确定容器是否准备好接受网络服务流量。若就绪探针失败，Endpoint 控制器会将该 Pod 的 IP 从 Service 对应的主机列表中移除，不予转发网络请求；而 Liveness Probe 失败时会自动重启容器，不属于纯粹的外部流量准入控制。"
        ]
      }
    }
  ],
  paper: [
    {
      id: "AUD-PAP-001",
      name: "2026年秋季大语言模型与深度学习期末综合试卷",
      creator: "张教授",
      tenant: "清华大学计算机系",
      submitTime: "2026-05-27 11:30",
      status: "待审核",
      auditType: "平台公开",
      details: {
        meta: "期末考试试卷 | 总分: 100分 | 包含单选、多选、简答与代码实战题",
        content: "本试卷涵盖 Transformer 架构、Self-Attention、DeepSpeed 分布式训练、LoRA 微调及云原生部署等核心知识点。考试时长 120 分钟，适用于计算机专业本科生及研究生期末考核。",
        outline: [
          "一、 单选题 (10题, 每题2分, 共20分)",
          "二、 多选题 (5题, 每题4分, 共20分)",
          "三、 简答题 (3题, 每题10分, 共30分)",
          "四、 编程与代码综合题 (2题, 每题15分, 共30分)"
        ]
      }
    },
    {
      id: "AUD-PAP-002",
      name: "云原生与K8s容器编排架构期中测试卷",
      creator: "李副教授",
      tenant: "北京大学软件学院",
      submitTime: "2026-05-25 14:20",
      status: "已通过",
      auditType: "租户公开",
      details: {
        meta: "期中测试卷 | 总分: 100分 | 包含基础概念与实战部署题",
        content: "试卷侧重考察 Pod 生命周期、Ingress 控制器、StatefulSet 状态节点编排及 Prometheus 告警配置等实践能力。",
        outline: [
          "一、 选择题 (15题, 每题2分, 共30分)",
          "二、 问答题 (4题, 每题10分, 共40分)",
          "三、 架构设计与 Deployment YAML 编写题 (1题, 共30分)"
        ]
      }
    }
  ],
  ai_capacity: [
    {
      id: "AUD-AIC-001",
      name: "智能中英文口语流畅度及发音评测能力",
      creator: "吴教授",
      tenant: "南京大学外国语学院",
      submitTime: "2026-05-26 17:00",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "音频评测 API 能力 | 平均响应 SLA 150ms",
        content: "提供一键式流式音频口语发音评估 API。支持录入 mp3/wav 音频与标准文本对比，智能识别学生读音中的音素错漏、重音偏移、语流卡顿及流畅度得分，完美贴合英语人机口语实训教学。",
        outline: [
          "接口规格: POST /api/v1/speech/eval (Payload: audio_file, target_text)",
          "吞吐量限制: 单租户默认并发数 50 QPS, 可按需配额扩增",
          "底层模型: 基于 Whisper-v3 音素对齐优化模型"
        ]
      }
    }
  ],
  practice: [
    {
      id: "AUD-PRC-001",
      name: "大规模预训练大模型分布式微调最佳实践",
      creator: "陈博士",
      tenant: "复旦大学计算机学院",
      submitTime: "2026-05-27 10:20",
      status: "待审核",
      auditType: "租户公开",
      details: {
        meta: "分布式微调实践 | 推荐星级 5 星",
        content: "本实践介绍如何使用 DeepSpeed 和 Megatron-LM 在多机多卡 GPU 环境下进行 70B 参数规模 LLM 的 3D 并行（张量并行、流水线并行、数据并行）的高效分布式微调与优化。",
        outline: [
          "第一阶段: 分布式环境初始化与无缝集群连接配置",
          "第二阶段: Megatron-LM 与 DeepSpeed 混合配置文件的精细调优",
          "第三阶段: 针对大模型吞吐与显存占用的量化微调技术 (FP16/BF16)",
          "第四阶段: 故障自动恢复与多节点网络通信拥堵排除实践"
        ]
      }
    }
  ],
  dataset: [
    {
      id: "AUD-DTS-001",
      name: "多模态中文医疗问答微调高质量数据集",
      creator: "李教授",
      tenant: "浙江大学医学院",
      submitTime: "2026-05-26 09:40",
      status: "待审核",
      auditType: "平台公开",
      details: {
        meta: "医疗问答数据集 | 100万条高质量对话",
        content: "本数据集专为医疗行业多模态大模型定制，包含100万条经过医学专家脱敏与多轮校验的高质量中文医疗问答对与对应诊断 CT 图片，数据格式完全契合 JSON-L 及 WebDataset 规范。",
        outline: [
          "格式标准: JSON Lines 纯文本 + 图像 Base64 字典",
          "数据清洗: 已使用过滤规则对病患姓名、证件、病历号等敏感隐私数据进行脱敏",
          "适用方向: 医疗垂直行业大模型指令微调、评测与 RAG 知识库检索"
        ]
      }
    }
  ]
};

export default function AdminAudit() {
  const [activeMenu, setActiveMenu] = useState<"course" | "project" | "question" | "paper" | "ai_capacity" | "practice" | "dataset">("course");
  const [activeBusinessTab, setActiveBusinessTab] = useState<"人工智能" | "网络仿真">("人工智能");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"全部" | "待审核" | "已通过" | "已驳回">("全部");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states (Ref TeacherQuestions)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Course Syllabus & Lesson Detail States
  const [syllabusSearch, setSyllabusSearch] = useState("");
  const [selectedLessonTypeFilter, setSelectedLessonTypeFilter] = useState<string>("全部");
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  // Active Lesson Detail Modal state
  const [activeDetailLesson, setActiveDetailLesson] = useState<{
    lesson: LessonDetailInfo;
    chapterTitle: string;
    courseName: string;
    chapterId: string;
  } | null>(null);

  const [activeLessonTab, setActiveLessonTab] = useState<"content" | "attachments" | "audit">("content");
  const [lessonAuditNotes, setLessonAuditNotes] = useState<Record<string, string>>({});
  const [lessonAuditStatus, setLessonAuditStatus] = useState<Record<string, "合规" | "需整改">>({});

  const [resources, setResources] = useState<Record<string, AuditResource[]>>(initialResources);
  const activeList = resources[activeMenu] || [];
  const supportsBusinessTabs = ["course", "project", "question", "paper"].includes(activeMenu);
  const networkSimulationKeywords = /网络|路由|交换|拓扑|仿真|云原生|容器|Kubernetes|微服务|安全运维|VPC|子网/i;
  const businessScopedList = supportsBusinessTabs
    ? activeList.filter(item => {
        const searchableContent = [
          item.name,
          item.details.meta,
          item.details.content,
          ...item.details.outline,
        ].join(" ");
        const isNetworkSimulation = networkSimulationKeywords.test(searchableContent);
        return activeBusinessTab === "网络仿真" ? isNetworkSimulation : !isNetworkSimulation;
      })
    : activeList;

  // Review Drawer state
  const [reviewingItem, setReviewingItem] = useState<AuditResource | null>(null);
  const [drawerMode, setDrawerMode] = useState<"audit" | "detail">("audit");
  const [rejectionInput, setRejectionInput] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Paper Audit Detail Draw Rules state
  const [auditPaperDrawRules, setAuditPaperDrawRules] = useState([
    { id: 'audit-rule-1', type: '单选题', tag: '标签1', difficulty: '容易', count: 5, maxAvailable: 7, score: 10 },
    { id: 'audit-rule-2', type: '多选题', tag: '标签1', difficulty: '容易', count: 5, maxAvailable: 7, score: 10 }
  ]);

  const handleUpdateAuditPaperRule = (id: string, key: 'count' | 'score', val: any) => {
    setAuditPaperDrawRules(prev => prev.map(r => r.id === id ? { ...r, [key]: val } : r));
  };

  const handleRemoveAuditPaperRule = (id: string) => {
    setAuditPaperDrawRules(prev => prev.filter(r => r.id !== id));
  };

  // Project Audit Drawer Tab & Environment Instance state
  const [activeProjectTab, setActiveProjectTab] = useState<"basic" | "env">("env");
  const [activeProjectEnvIdx, setActiveProjectEnvIdx] = useState<number>(0);
  const [isLessonMenuCollapsed, setIsLessonMenuCollapsed] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const toggleChapter = (chapId: string) => {
    setExpandedChapters(prev => ({ ...prev, [chapId]: prev[chapId] === false ? true : false }));
  };

  const handlePrevLesson = () => {
    if (!activeDetailLesson) return;
    const chapters = getDefaultChapters(reviewingItem);
    let allLessons: { lesson: LessonDetailInfo; chapterTitle: string; chapterId: string }[] = [];
    chapters.forEach(ch => {
      ch.lessons.forEach(l => {
        allLessons.push({ lesson: l, chapterTitle: `${ch.chapterNo} ${ch.title}`, chapterId: ch.id });
      });
    });
    const currentIndex = allLessons.findIndex(item => item.lesson.id === activeDetailLesson.lesson.id);
    if (currentIndex > 0) {
      const prevItem = allLessons[currentIndex - 1];
      setActiveDetailLesson({
        lesson: prevItem.lesson,
        chapterTitle: prevItem.chapterTitle,
        courseName: reviewingItem?.name || activeDetailLesson.courseName,
        chapterId: prevItem.chapterId
      });
    }
  };

  const handleNextLesson = () => {
    if (!activeDetailLesson) return;
    const chapters = getDefaultChapters(reviewingItem);
    let allLessons: { lesson: LessonDetailInfo; chapterTitle: string; chapterId: string }[] = [];
    chapters.forEach(ch => {
      ch.lessons.forEach(l => {
        allLessons.push({ lesson: l, chapterTitle: `${ch.chapterNo} ${ch.title}`, chapterId: ch.id });
      });
    });
    const currentIndex = allLessons.findIndex(item => item.lesson.id === activeDetailLesson.lesson.id);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextItem = allLessons[currentIndex + 1];
      setActiveDetailLesson({
        lesson: nextItem.lesson,
        chapterTitle: nextItem.chapterTitle,
        courseName: reviewingItem?.name || activeDetailLesson.courseName,
        chapterId: nextItem.chapterId
      });
    }
  };

  // Scorecards toggles
  const [checkQuality, setCheckQuality] = useState(true);
  const [checkOriginality, setCheckOriginality] = useState(true);
  const [checkStandard, setCheckStandard] = useState(true);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id: string) => {
    const targetItem = activeList.find(item => item.id === id);
    const updated = activeList.map(item => {
      if (item.id === id) {
        return { ...item, status: "已通过" as const };
      }
      return item;
    });
    setResources({ ...resources, [activeMenu]: updated });
    setReviewingItem(null);
    if (targetItem?.auditType === "下架") {
      triggerToast("审核通过！该资源已从平台公共目录成功下架。");
    } else {
      triggerToast("审核通过！资源已正式升级为平台公共资源，全网租户可见可用。");
    }
  };

  const handleReject = (id: string) => {
    if (!rejectionInput.trim()) {
      triggerToast("请填写具体的驳回意见，告知教师需要调整的格式或缺陷！");
      return;
    }
    const updated = activeList.map(item => {
      if (item.id === id) {
        return { ...item, status: "已驳回" as const, rejectionReason: rejectionInput };
      }
      return item;
    });
    setResources({ ...resources, [activeMenu]: updated });
    setReviewingItem(null);
    setShowRejectForm(false);
    setRejectionInput("");
    triggerToast("已驳回申请，审核意见已安全投递到该校教师工作台。");
  };

  const filteredResources = businessScopedList.filter(item => {
    const matchesStatus = activeStatusFilter === "全部" || item.status === activeStatusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredResources.length / pageSize) || 1;
  const paginatedResources = filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[14px] font-medium text-neutral-800">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Menu */}
      <div className="w-[200px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full">
        <div className="p-5 border-b border-neutral-border shrink-0">
          <h2 className="text-lg font-semibold text-neutral-title">审核中心</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Menu Item 1: Course */}
          <button 
            onClick={() => { setActiveMenu("course"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "course" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>课程审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("project"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "project" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <FolderKanban className="w-4 h-4 shrink-0" />
            <span>项目审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("practice"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "practice" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <ThumbsUp className="w-4 h-4 shrink-0" />
            <span>最佳实践审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("dataset"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "dataset" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>数据集审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("question"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "question" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <FileQuestion className="w-4 h-4 shrink-0" />
            <span>试题审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("paper"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "paper" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>试卷审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("ai_capacity"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "ai_capacity" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span>AI能力审核</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-6 flex flex-col min-h-0 space-y-4">
        {/* Header Title Section (Styled exact matching TeacherQuestions) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
          <div className="flex items-end gap-4">
            <h1 className="text-xl font-bold text-neutral-900">
              {activeMenu === "course" && "课程审核"}
              {activeMenu === "project" && "项目审核"}
              {activeMenu === "question" && "试题审核"}
              {activeMenu === "paper" && "试卷审核"}
              {activeMenu === "ai_capacity" && "AI能力审核"}
              {activeMenu === "practice" && "最佳实践审核"}
              {activeMenu === "dataset" && "数据集审核"}
            </h1>
            <p className="text-sm text-neutral-500 mb-0.5">
              {activeMenu === "course" && "审核各高校教师提请公开与下架的实训课程大纲，审核通过后同步更新公共课程资源库状态"}
              {activeMenu === "project" && "评估企业级及学术性前沿实训项目案例，通过后在全网范围提供秒级沙箱环境部署"}
              {activeMenu === "question" && "严控试卷试题的知识点覆盖度、科学性及格式标准，确保高价值考核资源的入库品质"}
              {activeMenu === "paper" && "规范审查各学院教师提交的期末与阶段性试卷，把控试卷难度分布、大纲覆盖度及总分指标"}
              {activeMenu === "ai_capacity" && "测试和校验教师研发定制的高性能AI大模型API接口、离线推理实例以及流畅度评测能力"}
              {activeMenu === "practice" && "审核教师及专家提请公开的优质企业级与学术前沿最佳实践方案，核准后上架公共目录"}
              {activeMenu === "dataset" && "严加甄别与审计共享数据集的合规度、隐私脱敏及标注规范性，确保高质量科学研究数据的开放安全"}
            </p>
          </div>

          {/* Quick Statistics Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded border border-neutral-border text-xs flex items-center gap-2">
              <span className="text-neutral-500 font-medium">总数:</span>
              <span className="font-bold text-neutral-800">{businessScopedList.length}</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded border border-neutral-border text-xs flex items-center gap-2">
              <span className="text-neutral-500 font-medium">待审核:</span>
              <span className="font-bold text-[#fa541c]">{businessScopedList.filter(item => item.status === "待审核").length}</span>
            </div>
          </div>
        </div>

        {/* Table and Toolbar Unified Module (Ref TeacherQuestions Style) */}
        <div className="bg-white rounded border border-neutral-border overflow-hidden flex-1 flex flex-col">
          {supportsBusinessTabs && (
            <div className="flex items-center gap-8 px-6 border-b border-neutral-border bg-white shrink-0" role="tablist" aria-label="业务类型">
              {(["人工智能", "网络仿真"] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeBusinessTab === tab}
                  onClick={() => {
                    setActiveBusinessTab(tab);
                    setActiveStatusFilter("全部");
                    setSearchQuery("");
                    setCurrentPage(1);
                    setSelectedItemIds([]);
                  }}
                  className={cn(
                    "relative h-12 px-1 text-[14px] font-medium border-0 bg-transparent cursor-pointer transition-colors",
                    activeBusinessTab === tab
                      ? "text-[#fa541c] font-semibold"
                      : "text-neutral-500 hover:text-neutral-800"
                  )}
                >
                  {tab}
                  {activeBusinessTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fa541c]" />
                  )}
                </button>
              ))}
            </div>
          )}
          {/* Integrated Toolbar Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50 bg-white shrink-0">
            {/* Search Input bar & Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text"
                  placeholder="请输入要搜索的内容"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Right: Actions & Status Pill Selectors */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex bg-neutral-100 rounded-full p-1 border border-neutral-200/50">
                {(["全部", "待审核", "已通过", "已驳回"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setActiveStatusFilter(f); setCurrentPage(1); setSelectedItemIds([]); }}
                    className={cn(
                      "px-4 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer border-0 bg-transparent",
                      activeStatusFilter === f 
                        ? "bg-white text-[#fa541c] font-bold shadow-sm" 
                        : "text-neutral-body hover:text-neutral-title"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {selectedItemIds.length > 0 && (
                <Button 
                  onClick={() => {
                    triggerToast(`已为选中的 ${selectedItemIds.length} 项资源发起批量处理`);
                    setSelectedItemIds([]);
                  }}
                  className="bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe8d6] border border-[#ffbb96]/50 h-8 px-3 rounded-[4px] text-xs font-semibold cursor-pointer shadow-2xs transition-all"
                >
                  批量审核 ({selectedItemIds.length})
                </Button>
              )}
            </div>
          </div>

          {/* Main Table Content - Natural height without vertical scrollbar */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                  <th className="pl-6 pr-3 py-3.5 font-medium text-left">资源名称</th>
                  <th className="px-3 py-3.5 font-medium text-left">
                    <div className="flex items-center gap-1">类型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="px-3 py-3.5 font-medium text-left">提交教师</th>
                  <th className="px-3 py-3.5 font-medium text-left">申请时间</th>
                  <th className="px-3 py-3.5 font-medium text-left">
                    <div className="flex items-center gap-1">审核状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResources.map((item, index) => (
                  <tr key={item.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === paginatedResources.length - 1 && "border-b-0")}>
                    <td className="pl-6 pr-3 py-3 text-left">
                      <div className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer truncate max-w-[340px]" title={item.name}>
                        {item.name}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-left">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[12px] rounded-[4px] font-medium border",
                        (item.auditType || "平台公开") === "下架" 
                          ? "bg-[#fafafa] text-[#8c8c8c] border-[#d9d9d9]" 
                          : (item.auditType || "平台公开") === "租户公开"
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-[#fff2e8] text-[#fa541c] border-[#ffbb96]"
                      )}>
                        {item.auditType === "公开" ? "平台公开" : (item.auditType || "平台公开")}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-left text-neutral-600">
                      <div className="text-neutral-800 font-medium">{item.creator}</div>
                    </td>
                    <td className="px-3 py-3 text-left text-neutral-500 font-mono">{item.submitTime}</td>
                    <td className="px-3 py-3 text-left">
                      {item.status === "已通过" && (
                        <span className="text-emerald-600 font-medium">已通过</span>
                      )}
                      {item.status === "待审核" && (
                        <span className="text-[#fa541c] font-medium">待审核</span>
                      )}
                      {item.status === "已驳回" && (
                        <span className="text-rose-600 font-medium">已驳回</span>
                      )}
                      {item.status === "审核中" && (
                        <span className="text-blue-600 font-medium">审核中</span>
                      )}
                    </td>
                    <td className="pl-3 pr-6 py-3 text-left">
                      <div className="flex items-center gap-3">
                        {item.status === "待审核" || item.status === "审核中" ? (
                          <button 
                            onClick={() => { setDrawerMode("audit"); setReviewingItem(item); }}
                            className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold"
                          >
                            审核
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setDrawerMode("audit"); setReviewingItem(item); }}
                            className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold"
                          >
                            查看
                          </button>
                        )}
                        {(activeMenu === "course" || activeMenu === "project" || activeMenu === "practice" || activeMenu === "dataset" || activeMenu === "question" || activeMenu === "paper" || activeMenu === "ai_capacity") && (
                          <button 
                            onClick={() => { 
                              setDrawerMode("detail"); 
                              setActiveProjectTab("basic");
                              setReviewingItem(item); 
                            }}
                            className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold"
                          >
                            资源详情
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredResources.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-16 text-center text-xs text-neutral-caption italic">
                      暂无符合条件的审核记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component - Ref TeacherQuestions */}
          <div className="flex items-center justify-end px-6 py-4 gap-4 border-t border-neutral-border/30 bg-white">
            <span className="text-[13px] text-neutral-500">共 {filteredResources.length} 条</span>
            <div className="flex items-center gap-2">
              <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-sm cursor-pointer border-neutral-200 text-neutral-600 disabled:opacity-40" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page} 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "h-7 w-7 p-0 rounded-sm text-xs font-semibold cursor-pointer transition-colors border",
                      currentPage === page 
                        ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#e84a15]" 
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-sm cursor-pointer border-neutral-200 text-neutral-600 disabled:opacity-40"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages || filteredResources.length === 0}
                >
                  &gt;
                </Button>
              </div>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-[13px] border border-neutral-200 rounded-sm px-2.5 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer"
              >
                <option value={5}>5 条/页</option>
                <option value={10}>10 条/页</option>
                <option value={20}>20 条/页</option>
              </select>
          </div>
        </div>
      </div>

      {/* Audit Evaluation Drawer Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-[760px] h-screen flex flex-col shadow-2xl border-l border-neutral-border animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header (Ref Teacher Invigilation Info Header) */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-[15px] font-bold text-neutral-850 flex items-center gap-2">
                {drawerMode === "detail" ? (
                  <svg className="w-5 h-5 text-[#fa541c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9.5" />
                    <path d="M7.5 8.5h9" />
                    <path d="M7.5 12h9" />
                    <path d="M7.5 15.5h9" />
                  </svg>
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#fa541c]" />
                )}
                <span>{drawerMode === "detail" ? "资源详情" : (activeMenu === "course" ? "审核" : "审核资源详情")}</span>
              </h3>
              <button 
                onClick={() => setReviewingItem(null)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project Edit Tabs Header when drawerMode === "detail" && activeMenu === "project" */}
            {drawerMode === "detail" && activeMenu === "project" && (
              <div className="flex border-b border-neutral-100 bg-neutral-50/20 text-[11px] font-bold select-none shrink-0">
                {[
                  { key: 'basic', label: '1. 基础信息', icon: BookOpen },
                  { key: 'env', label: '2. 项目环境', icon: Cpu }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveProjectTab(tab.key as any)}
                    className={cn(
                      "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px]",
                      activeProjectTab === tab.key 
                        ? "border-[#fa541c] text-[#fa541c] bg-white font-extrabold" 
                        : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/40"
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Audit Mode Modules: Base Info & Application Explanation */}
              {drawerMode === "audit" && (
                <>
                  {/* Resource Core Info Panel Header (Ref Teacher Invigilation Card Style) */}
                  <div className="border border-neutral-200 rounded-[8px] bg-white shadow-xs overflow-hidden">
                    <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-bold text-neutral-800 text-[13px] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#fa541c]" />
                        <span>审核资源基础信息</span>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-orange-50 text-[#fa541c] border border-[#ffbb96]">
                        {reviewingItem.status}
                      </span>
                    </div>
                    <div className="p-4 space-y-3 select-none text-[13px]">
                      <div className="text-[14px] font-bold text-neutral-900 leading-snug">{reviewingItem.name}</div>
                      <div className="grid grid-cols-3 gap-3.5 pt-2 border-t border-neutral-100 text-neutral-700">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-neutral-400 font-medium">提请教师</span>
                          <span className="text-neutral-800 font-semibold">{reviewingItem.creator}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-neutral-400 font-medium">提交时间</span>
                          <span className="text-neutral-800 font-semibold">{reviewingItem.submitTime}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-neutral-400 font-medium">类型</span>
                          <span className="text-neutral-800 font-semibold">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-bold border",
                              (reviewingItem.auditType || "平台公开") === "下架"
                                ? "bg-[#fafafa] text-[#8c8c8c] border-[#d9d9d9]"
                                : (reviewingItem.auditType || "平台公开") === "租户公开"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-[#fff2e8] text-[#fa541c] border-[#ffbb96]"
                            )}>
                              {reviewingItem.auditType === "公开" ? "平台公开" : (reviewingItem.auditType || "平台公开")}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Core details / 说明 (Ref Teacher side Off-Shelf style) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-[#262626]">申请说明</label>
                      <span className="text-[11px] text-neutral-400">提请变动与发布详情</span>
                    </div>
                    <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-[#d4380d]">
                      <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                      <div className="flex-1 space-y-1.5">
                        <p className="font-bold text-[13px] text-[#fa541c]">说明及原由摘要</p>
                        <p className="text-[13px] text-[#d4380d] opacity-90 leading-relaxed bg-white/80 border border-[#ffbb96]/50 rounded-[4px] p-3 font-normal">
                          {reviewingItem.details.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Resource Detail Mode Module: Course Directory / Lessons Section */}
              {drawerMode === "detail" && activeMenu === "course" && (() => {
                const chapters = getDefaultChapters(reviewingItem);

                return (
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-[#262626]">课程目录与课时体系</label>
                      <span className="text-[11px] text-neutral-400">共 {chapters.length} 章节 · {chapters.reduce((acc, c) => acc + c.lessons.length, 0)} 课时</span>
                    </div>

                    <div className="space-y-4">
                      {chapters.map((chapter, chapIdx) => (
                        <div key={chapter.id || chapIdx} className="bg-white rounded-[4px] border border-neutral-200 overflow-hidden shadow-xs">
                          {/* Chapter Title Banner */}
                          <div className="bg-[#f5f5f5] px-5 py-3 border-b border-neutral-200/80 font-bold text-neutral-900 text-sm tracking-tight">
                            {chapter.title}
                          </div>

                          {/* Lessons List */}
                          <div className="divide-y divide-neutral-100">
                            {chapter.lessons.map((lesson, lesIdx) => {
                              const isDoc = lesson.type === "doc";
                              const isCode = lesson.type === "code" || lesson.type === "experiment";
                              const isVideo = lesson.type === "video" || lesson.type === "quiz";

                              return (
                                <div 
                                  key={lesson.id || lesIdx} 
                                  onClick={() => setActiveDetailLesson({
                                    lesson,
                                    chapterTitle: `${chapter.chapterNo || ''} ${chapter.title || ''}`,
                                    courseName: reviewingItem?.name || "大语言模型工程应用与LoRA微调技术",
                                    chapterId: chapter.id || `chap-${chapIdx}`
                                  })}
                                  className="px-5 py-3 flex items-center gap-3 bg-white hover:bg-neutral-50/50 transition-colors cursor-pointer group"
                                >
                                  {/* Left 课时 Label */}
                                  <span className="text-neutral-400 font-normal text-xs shrink-0 w-12 group-hover:text-[#fa541c] transition-colors">
                                    课时{lesIdx + 1}:
                                  </span>

                                  {/* Icon Badge */}
                                  {isDoc && (
                                    <span className="w-6 h-6 rounded-[4px] bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-center justify-center shrink-0">
                                      <FileText className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                  {isCode && (
                                    <span className="w-6 h-6 rounded-[4px] bg-amber-50 text-amber-600 border border-amber-200/50 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold">
                                      &lt;&gt;
                                    </span>
                                  )}
                                  {isVideo && (
                                    <span className="w-6 h-6 rounded-[4px] bg-blue-50 text-blue-600 border border-blue-200/50 flex items-center justify-center shrink-0">
                                      <MonitorPlay className="w-3.5 h-3.5" />
                                    </span>
                                  )}

                                  {/* Lesson Title */}
                                  <span className="text-xs font-bold text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer leading-snug">
                                    {lesson.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Project Resource Detail Mode Module (Referencing Teacher Side Project Edit Drawer) */}
              {drawerMode === "detail" && activeMenu === "project" && (
                <div className="space-y-6 text-[13px]">
                  {/* TAB 1: 基础信息 */}
                  {activeProjectTab === "basic" && (
                    <div className="space-y-5 animate-fade-in py-1">
                      
                      {/* 1. 项目名称 */}
                      <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          项目名称 <span className="text-[#fa541c]">*</span>
                        </label>
                        <input 
                          type="text"
                          readOnly
                          disabled
                          value={reviewingItem.name}
                          className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                        />
                      </div>

                      {/* 2. 标签 */}
                      <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          标签
                        </label>
                        <div className="min-h-[38px] w-full border border-neutral-200/80 rounded px-3 py-1.5 flex flex-wrap items-center gap-2 bg-neutral-50/80 cursor-not-allowed select-none">
                          {["容器", "AI"].map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded text-xs text-neutral-700 font-medium shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3. 项目描述 */}
                      <div className="grid grid-cols-[90px_1fr] items-center gap-3">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          项目描述 <span className="text-[#fa541c]">*</span>
                        </label>
                        <input 
                          type="text"
                          readOnly
                          disabled
                          value={reviewingItem.details?.summary || "基于 DeepSpeed 与 Megatron-LM 的大语言模型分布式微调与工程应用实践。"}
                          className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 cursor-not-allowed select-none"
                        />
                      </div>

                      {/* 4. 项目图片 */}
                      <div className="grid grid-cols-[90px_1fr] items-start gap-3">
                        <label className="text-[13px] font-bold text-[#262626] text-right pt-1.5">
                          项目图片 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="w-full aspect-[5/2] rounded-[4px] overflow-hidden border-2 border-[#fa541c] relative shadow-sm max-w-md">
                          <img 
                            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80" 
                            alt="project-cover" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute top-2 right-2 bg-[#fa541c] text-white rounded-full p-0.5 shadow-md flex items-center justify-center w-5 h-5">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        </div>
                      </div>

                      {/* 5. 项目介绍 (富文本编辑区域样式) */}
                      <div className="grid grid-cols-[90px_1fr] items-start gap-3">
                        <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                          项目介绍 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="border border-neutral-200 rounded overflow-hidden flex flex-col bg-white w-full">
                          {/* Rich Text Toolbar */}
                          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-neutral-200 bg-neutral-50/80 select-none">
                            <button type="button" className="p-1 hover:bg-neutral-200 rounded text-neutral-400 cursor-not-allowed" title="加粗"><Bold className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-neutral-200 rounded text-neutral-400 cursor-not-allowed" title="斜体"><Italic className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-neutral-200 rounded text-[#fa541c] cursor-not-allowed" title="文本颜色"><Type className="w-3.5 h-3.5" /></button>
                            <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                            <button type="button" className="p-1 hover:bg-neutral-200 rounded text-neutral-400 cursor-not-allowed" title="无序列表"><List className="w-3.5 h-3.5" /></button>
                            <div className="w-px h-3.5 bg-neutral-200 mx-1"></div>
                            <button type="button" className="p-1 hover:bg-neutral-200 rounded text-neutral-400 cursor-not-allowed" title="居中"><AlignCenter className="w-3.5 h-3.5" /></button>
                          </div>
                          
                          {/* Rich Text Content Box */}
                          <div className="p-4 text-[13px] text-neutral-800 space-y-2.5 leading-relaxed bg-neutral-50/30 min-h-[140px]">
                            <p className="font-bold text-neutral-900">🎯 项目实践背景与核心能力培养：</p>
                            <p className="text-neutral-700">
                              本项目基于前沿生成式 AI 框架，指导学生掌握工业级 LLM 模型微调核心全流程。学生将在云端高算力 GPU 沙箱节点上完成模型参数加载、数据集量化与 LoRA 适配器训练。
                            </p>
                            <p className="font-bold text-neutral-900 pt-1">包含实操要点：</p>
                            <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                              <li>PyTorch 2.2 + CUDA 12.1 分布式算法搭建</li>
                              <li>DeepSpeed Zero-3 显存优化参数调优</li>
                              <li>自动化评估与验证集 Task 评估曲线绘制</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: 项目环境 (Reference Teacher Side Edit Drawer Screenshot) */}
                  {activeProjectTab === "env" && (
                    <div className="space-y-6 animate-fade-in py-2">
                      
                      {/* 1. 选择资源池 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          选择资源池 <span className="text-[#fa541c]">*</span>
                        </label>
                        <input 
                          type="text"
                          readOnly
                          disabled
                          value="上海园区资源池"
                          className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                        />
                      </div>

                      {/* 2. 选择环境类型 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          选择环境类型 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          <label className="flex items-center gap-2 select-none text-neutral-700 font-medium cursor-not-allowed">
                            <input type="radio" checked readOnly disabled className="w-4 h-4 accent-[#fa541c]" />
                            <span>容器</span>
                          </label>
                          <label className="flex items-center gap-2 select-none text-neutral-400 font-medium cursor-not-allowed">
                            <input type="radio" disabled className="w-4 h-4" />
                            <span>云主机</span>
                          </label>
                        </div>
                      </div>

                      {/* 3. 源仓库地址 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          源仓库地址 <span className="text-[#fa541c]">*</span>
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          <label className="flex items-center gap-2 select-none text-neutral-700 font-medium cursor-not-allowed">
                            <input type="radio" checked readOnly disabled className="w-4 h-4 accent-[#fa541c]" />
                            <span>手动添加</span>
                          </label>
                          <label className="flex items-center gap-2 select-none text-neutral-400 font-medium cursor-not-allowed">
                            <input type="radio" disabled className="w-4 h-4" />
                            <span>本地文件上传</span>
                          </label>
                        </div>
                      </div>

                      {/* 源仓库地址输入框 */}
                      <div className="grid grid-cols-[100px_1fr] gap-4">
                        <div />
                        <input
                          type="text"
                          readOnly
                          disabled
                          value="https://github.com/opencv/opencv.git"
                          className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-mono cursor-not-allowed select-none"
                        />
                      </div>

                      {/* 4. 创建方式 */}
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-[#262626] text-right">
                          创建方式
                        </label>
                        <div className="flex items-center gap-6 text-[13px]">
                          <label className="flex items-center gap-2 select-none text-neutral-700 font-medium cursor-not-allowed">
                            <input type="radio" checked readOnly disabled className="w-4 h-4 accent-[#fa541c]" />
                            <span>模板创建</span>
                          </label>
                          <label className="flex items-center gap-2 select-none text-neutral-400 font-medium cursor-not-allowed">
                            <input type="radio" disabled className="w-4 h-4" />
                            <span>自定义</span>
                          </label>
                        </div>
                      </div>

                      {/* 创建方式输入框 */}
                      <div className="grid grid-cols-[100px_1fr] gap-4">
                        <div />
                        <input
                          type="text"
                          readOnly
                          disabled
                          value="通用模板"
                          className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                        />
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* Best Practice Resource Detail Mode Module (Ref Reference Screenshot) */}
              {drawerMode === "detail" && activeMenu === "practice" && (
                <div className="space-y-6 animate-fade-in py-2 text-[13px]">
                  
                  {/* 1. 实践名称 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      <span className="text-[#fa541c]">*</span>实践名称
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value={reviewingItem.name || "Python 数据清洗与可视化教学案例"}
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 2. 核心摘要 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      核心摘要
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value={reviewingItem.details?.summary || "专为学生入门数据分析打造的全自动清洗工作流实践，包含真实业务数据集。"}
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 3. 详细描述 */}
                  <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                      详细描述
                    </label>
                    <textarea 
                      readOnly
                      disabled
                      rows={4}
                      value={reviewingItem.details?.content || "提供一套完整的Python数据清洗模板代码，包含缺失值处理、异常值检测、数据标准化等功能，专为数据分析课程设计。"}
                      className="w-full border border-neutral-200/80 rounded-[4px] p-3.5 text-[13px] text-[#262626] bg-neutral-50/80 leading-relaxed resize-none h-28 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 4. 技术标签 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      技术标签
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value="数据处理, 代码开发"
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 5. 业务场景标签 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      业务场景标签
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value="课程辅助, 项目开发"
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 cursor-not-allowed select-none"
                    />
                  </div>

                </div>
              )}

              {/* Dataset Resource Detail Mode Module (Ref Figure 1 Screenshot) */}
              {drawerMode === "detail" && activeMenu === "dataset" && (
                <div className="space-y-6 animate-fade-in py-2 text-[13px]">
                  
                  {/* 1. 名称 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      名称 <span className="text-[#fa541c]">*</span>
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value={reviewingItem.name}
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 2. 描述 */}
                  <div className="grid grid-cols-[90px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                      描述
                    </label>
                    <textarea 
                      readOnly
                      disabled
                      rows={4}
                      value={reviewingItem.details?.content || "本数据集专为医疗行业多模态大模型定制，包含100万条经过医学专家脱敏与多轮校验的高质量中文医疗问答对与对应诊断 CT 图片。"}
                      className="w-full border border-neutral-200/80 rounded-[4px] p-3.5 text-[13px] text-[#262626] bg-neutral-50/80 leading-relaxed resize-none h-28 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 3. 类型 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      类型 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="relative w-full">
                      <input 
                        type="text"
                        readOnly
                        disabled
                        value="文本数据集"
                        className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none pr-10"
                      />
                      <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4. 标签 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      标签
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value="tag-bbb"
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 5. 文件名称 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      文件名称
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value="med_qa_multimodal_dataset_v1.0.zip"
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-mono font-medium cursor-not-allowed select-none"
                    />
                  </div>

                </div>
              )}

              {/* Question Resource Detail Mode Module (Ref Figure 2 Screenshot) */}
              {drawerMode === "detail" && activeMenu === "question" && (
                <div className="space-y-5 animate-fade-in py-2 text-[13px]">
                  
                  {/* 1. 试题标题 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-600 block">
                      试题标题：
                    </label>
                    <div className="w-full border border-neutral-200/80 rounded-[4px] p-4 text-[14px] text-[#262626] font-bold bg-neutral-50/50 leading-snug">
                      {reviewingItem.name || "智能体与传统程序最本质的区别是什么？"}
                    </div>
                  </div>

                  {/* 2. 所属题库 & 难度级别 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-600 block">
                        所属题库
                      </label>
                      <div className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#262626] bg-neutral-50/50 font-medium">
                        人工智能通识D-uni
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-600 block">
                        难度级别
                      </label>
                      <div className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2.5 text-[13px] text-[#262626] bg-neutral-50/50 font-medium">
                        容易
                      </div>
                    </div>
                  </div>

                  {/* 3. 关联标签 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-600 block">
                      关联标签：
                    </label>
                    <div>
                      <span className="inline-flex items-center px-3 py-1 bg-orange-50 text-[#fa541c] border border-orange-200 rounded-[4px] text-xs font-semibold">
                        智能体
                      </span>
                    </div>
                  </div>

                  {/* 4. 试题答案选项 */}
                  <div className="space-y-2.5">
                    <label className="text-[13px] font-bold text-neutral-600 block">
                      试题答案选项：
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: "A", text: "自动搜索大语言模型的隐藏参数" },
                        { key: "B", text: "结合外部知识库对生成结果进行事实增强" },
                        { key: "C", text: "增加多模态数据输入通道" },
                        { key: "D", text: "使用深度网络加速推理速度" }
                      ].map(opt => (
                        <div key={opt.key} className="w-full border border-neutral-200/70 rounded-[4px] p-3.5 bg-neutral-50/30 flex items-center gap-3.5">
                          <span className="w-7 h-7 rounded-[4px] bg-neutral-100 text-neutral-600 font-bold flex items-center justify-center text-xs shrink-0 border border-neutral-200/60">
                            {opt.key}
                          </span>
                          <span className="text-[13px] text-neutral-800 font-medium">
                            {opt.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. 正确参考答案 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-600 block">
                      正确参考答案：
                    </label>
                    <div className="w-full border border-orange-200/80 rounded-[4px] p-4 bg-orange-50/40 flex items-center gap-2">
                      <span className="text-[#fa541c] font-bold text-[13px]">● 答案为：</span>
                      <span className="w-7 h-7 rounded-[4px] bg-[#fa541c] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                        B
                      </span>
                    </div>
                  </div>

                  {/* 6. 答案深度解析 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-600 block">
                      答案深度解析：
                    </label>
                    <div className="w-full border border-neutral-200/80 rounded-[4px] p-4 text-[13px] text-neutral-700 leading-relaxed bg-neutral-50/40 font-normal">
                      {reviewingItem.details?.outline?.[1]?.replace("解析: ", "") || "该题的关键考点在于大模型主流应用的结合点。通过结合结构化或非结构化外部知识库，利用事实注入和二次检索召回，能够从根本上缓解或避免大模型输出的“幻觉”现象，提升特定业务场景的准确性。"}
                    </div>
                  </div>

                </div>
              )}

              {/* Paper Resource Detail Mode Module (Ref Teacher Paper Detail Drawer) */}
              {drawerMode === "detail" && activeMenu === "paper" && (
                <div className="space-y-5 animate-fade-in py-2 text-[13px] text-left">
                  {/* 1. 试卷名称 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-400">试卷名称：</label>
                    <div className="text-sm font-bold text-neutral-800 border border-neutral-100 bg-neutral-50/30 rounded-[4px] p-3.5 leading-relaxed">
                      {reviewingItem.name}
                    </div>
                  </div>

                  {/* 2. 试卷说明 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-400">试卷说明：</label>
                    <div className="text-xs text-neutral-700 bg-neutral-50/30 border border-neutral-100 rounded-[4px] p-3.5 leading-relaxed">
                      {reviewingItem.details?.content || "用于人工智能通识课程的阶段性考核与知识点综合测验试卷。"}
                    </div>
                  </div>

                  {/* 3. Grid Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-400">试题配置</label>
                      <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-[4px] font-bold truncate" title="随机抽题">
                        随机抽题
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-400">总分</label>
                      <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-[4px] font-bold">
                        {auditPaperDrawRules.reduce((sum, r) => sum + ((Number(r.count) || 0) * (Number(r.score) || 0)), 0) || 100} 分
                      </p>
                    </div>
                  </div>

                  {/* 4. Question Configuration Detail Card */}
                  <div className="bg-[#fff2e8]/10 border border-[#ffbb96]/30 rounded-[4px] p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#fa541c] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                      <span>配置详情</span>
                    </h4>

                    <div className="space-y-4 animate-fade-in">
                      {['单选题', '多选题', '判断题', '填空题', '简答题', '思考题', '编程题', '实训题'].filter(type => auditPaperDrawRules.some(r => r.type === type)).map((type) => {
                        const rulesOfType = auditPaperDrawRules.filter(r => r.type === type);
                        return (
                          <div key={type} className="bg-white rounded-[4px] border border-neutral-200 p-4 space-y-3 shadow-sm">
                            <h5 className="text-sm font-bold text-neutral-800">{type}</h5>
                            <div className="border border-neutral-200 rounded-[4px] overflow-hidden bg-white">
                              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                                <thead>
                                  <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-600 font-bold">
                                    <th className="px-3.5 py-2.5 font-bold">抽取标签</th>
                                    <th className="px-3.5 py-2.5 font-bold">难易程度</th>
                                    <th className="px-3.5 py-2.5 text-center font-bold">抽取数量</th>
                                    <th className="px-3.5 py-2.5 text-center font-bold">最多可抽</th>
                                    <th className="px-3.5 py-2.5 text-center font-bold">分值</th>
                                    <th className="px-3.5 py-2.5 text-center font-bold">总分</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                                  {rulesOfType.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-neutral-50/30 transition-colors">
                                      <td className="px-3.5 py-3 font-medium text-neutral-800">{rule.tag}</td>
                                      <td className="px-3.5 py-3 text-neutral-600">{rule.difficulty}</td>
                                      <td className="px-3.5 py-3 text-center">
                                        <span className="inline-block w-14 h-7 text-center border border-neutral-200/80 rounded-[4px] bg-neutral-50/80 font-semibold text-neutral-800 leading-7 select-none">
                                          {rule.count}
                                        </span>
                                      </td>
                                      <td className="px-3.5 py-3 text-center font-bold text-neutral-800">{rule.maxAvailable}</td>
                                      <td className="px-3.5 py-3 text-center">
                                        <span className="inline-block w-14 h-7 text-center border border-neutral-200/80 rounded-[4px] bg-neutral-50/80 font-semibold text-neutral-800 leading-7 select-none">
                                          {rule.score}
                                        </span>
                                      </td>
                                      <td className="px-3.5 py-3 text-center font-extrabold text-neutral-900">
                                        {(Number(rule.count) || 0) * (Number(rule.score) || 0)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                      {auditPaperDrawRules.length === 0 && (
                        <div className="p-6 text-center text-xs text-neutral-400 bg-white rounded-[4px] border border-neutral-200">
                          暂无配置规则
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Capacity Resource Detail Mode Module (Ref Dataset Resource Detail Style) */}
              {drawerMode === "detail" && activeMenu === "ai_capacity" && (
                <div className="space-y-6 animate-fade-in py-2 text-[13px]">
                  
                  {/* 1. 助手头像 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      助手头像
                    </label>
                    <div>
                      <div className="w-14 h-14 rounded-[4px] bg-[#fff2e8] border border-[#ffbb96] flex items-center justify-center text-[#fa541c] shadow-xs shrink-0">
                        <Bot className="w-7 h-7 text-[#fa541c]" />
                      </div>
                    </div>
                  </div>

                  {/* 2. 助手名称 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      助手名称 <span className="text-[#fa541c]">*</span>
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value={reviewingItem.name || "深度学习答疑"}
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 3. 助手分类 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      助手分类
                    </label>
                    <div className="relative w-full">
                      <input 
                        type="text"
                        readOnly
                        disabled
                        value="答疑助手"
                        className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none pr-10"
                      />
                      <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4. 默认欢迎语 */}
                  <div className="grid grid-cols-[90px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                      默认欢迎语
                    </label>
                    <textarea 
                      readOnly
                      disabled
                      rows={4}
                      value={reviewingItem.details?.content || "遇到报错了？把日志发给我看看。"}
                      className="w-full border border-neutral-200/80 rounded-[4px] p-3.5 text-[13px] text-[#262626] bg-neutral-50/80 leading-relaxed resize-none h-28 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* 5. 关联知识库名称 */}
                  <div className="grid grid-cols-[90px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      关联知识库
                    </label>
                    <input 
                      type="text"
                      readOnly
                      disabled
                      value={reviewingItem.details?.meta ? reviewingItem.details.meta.split('|')[0].trim() : "人工智能深度学习知识库 v2.0"}
                      className="w-full border border-neutral-200/80 rounded-[4px] px-3.5 py-2 text-[13px] text-[#262626] bg-neutral-50/80 font-medium cursor-not-allowed select-none"
                    />
                  </div>

                </div>
              )}

              {/* Rejection input area */}
              {drawerMode === "audit" && showRejectForm && (
                <div className="space-y-2 pt-2 animate-slide-up">
                  <label className="text-[13px] font-bold text-[#fa541c] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#fa541c]" />
                    <span>驳回审核具体意见 <span className="text-[#fa541c]">*</span></span>
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="请输入对该教学资源调整修改的细则说明，协助教师进行补充重构..."
                    value={rejectionInput}
                    onChange={(e) => setRejectionInput(e.target.value)}
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded-[4px] p-3.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28 leading-relaxed"
                  />
                </div>
              )}

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-neutral-border bg-neutral-50/50 flex justify-end gap-3 shrink-0">
              {drawerMode === "detail" ? (
                <button 
                  onClick={() => setReviewingItem(null)} 
                  className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                >
                  取消
                </button>
              ) : showRejectForm ? (
                <>
                  <button 
                    onClick={() => setShowRejectForm(false)} 
                    className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                  >
                    返回
                  </button>
                  <button 
                    onClick={() => handleReject(reviewingItem.id)} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-6 rounded-[4px] text-[13px] font-semibold cursor-pointer border-0 shadow-sm transition-colors"
                  >
                    确认驳回
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowRejectForm(true)} 
                    className="border border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                  >
                    驳回并通知
                  </button>
                  <button 
                    onClick={() => handleApprove(reviewingItem.id)} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] text-[13px] font-semibold cursor-pointer border-0 shadow-sm transition-colors"
                  >
                    审核通过
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Lesson Detail Sub-Modal View (Matching Reference Screenshot: Left Sidebar Menu + Right Content) */}
      {activeDetailLesson && (
        <div className="fixed inset-0 z-[70] bg-white flex animate-in fade-in duration-200 overflow-hidden">
          {/* Left Sidebar Menu */}
          <div className={cn(
            "w-[300px] border-r border-neutral-200 bg-white flex flex-col shrink-0 select-none relative transition-all duration-300",
            isLessonMenuCollapsed && "w-[0px] p-0 overflow-hidden border-r-0"
          )}>
            {/* Top Header with Return Button */}
            <div className="p-4 border-b border-neutral-100 shrink-0 space-y-3">
              <button 
                onClick={() => setActiveDetailLesson(null)}
                className="flex items-center gap-1.5 text-neutral-800 hover:text-[#fa541c] text-sm font-bold transition-colors bg-transparent border-0 cursor-pointer p-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回</span>
              </button>
              <div>
                <h2 className="font-bold text-neutral-900 text-sm leading-snug truncate" title={activeDetailLesson.courseName}>
                  {activeDetailLesson.courseName}
                </h2>
                <span className="text-[12px] text-neutral-400 block mt-1">
                  当前学习：{activeDetailLesson.lesson.title}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#fa541c] h-full w-[0%]" />
                </div>
                <div className="flex justify-end">
                  <span className="text-[11px] text-neutral-400">0%</span>
                </div>
              </div>
            </div>

            {/* Chapters & Lessons Accordion List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {(() => {
                const chapters = getDefaultChapters(reviewingItem);
                return chapters.map((chapter, chapIdx) => {
                  const chapKey = chapter.id || `chap-${chapIdx}`;
                  const isExpanded = expandedChapters?.[chapKey] !== false;

                  return (
                    <div key={chapKey} className="space-y-1">
                      {/* Chapter Title Bar */}
                      <div 
                        onClick={() => toggleChapter(chapKey)}
                        className="flex items-center justify-between px-2.5 py-2 hover:bg-neutral-50 rounded text-xs font-bold text-neutral-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", !isExpanded && "-rotate-90")} />
                          <span className="truncate">{chapter.title}</span>
                        </div>
                        {chapIdx > 0 && (
                          <span className="px-1.5 py-0.2 bg-neutral-100 text-neutral-400 text-[10px] rounded shrink-0">未开放</span>
                        )}
                      </div>

                      {/* Lessons inside Chapter */}
                      {isExpanded && chapter.lessons && (
                        <div className="pl-4 space-y-0.5 border-l border-neutral-100 ml-3">
                          {chapter.lessons.map((les, lesIdx) => {
                            const isSelected = les?.id === activeDetailLesson?.lesson?.id;

                            return (
                              <div
                                key={les?.id || lesIdx}
                                onClick={() => setActiveDetailLesson({
                                  lesson: les,
                                  chapterTitle: `${chapter.chapterNo || ''} ${chapter.title || ''}`,
                                  courseName: reviewingItem?.name || activeDetailLesson?.courseName || "课程资源",
                                  chapterId: chapKey
                                })}
                                className={cn(
                                  "px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between",
                                  isSelected 
                                    ? "bg-[#fff2e8] text-[#fa541c] font-bold border-l-2 border-[#fa541c]" 
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-normal"
                                )}
                              >
                                <span className="truncate">{les.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Collapse Toggle Button on Border Line */}
            <button 
              onClick={() => setIsLessonMenuCollapsed(!isLessonMenuCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-500 hover:text-[#fa541c] z-20 cursor-pointer"
            >
              <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", isLessonMenuCollapsed && "rotate-180")} />
            </button>
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 bg-white overflow-y-auto custom-scrollbar flex flex-col p-8 sm:p-12">
            <div className="max-w-4xl space-y-6">
              <div className="text-xs text-neutral-400 font-medium">教案</div>
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {activeDetailLesson.lesson?.title || "课时"}教案
              </h1>

              {/* Section 1: 课时安排 */}
              <div className="space-y-2 pt-2">
                <h2 className="text-lg font-bold text-neutral-900">1. 课时安排</h2>
                <p className="text-sm font-semibold text-neutral-700">4 学时</p>
              </div>

              {/* Section 2: 教学课型 */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-neutral-900">2. 教学课型</h2>
                <div className="text-sm text-neutral-700 leading-relaxed font-mono space-y-1">
                  <p>理论课 [/]</p>
                  <p>实验课 [/]</p>
                  <p>习题课 [ ]</p>
                  <p>实习课 [ ]</p>
                  <p>其它 [ ]</p>
                </div>
              </div>

              {/* Section 3: 教学目标 */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-neutral-900">3. 教学目标</h2>
                
                <div className="space-y-2 pl-2">
                  <h3 className="text-sm font-bold text-neutral-800">1. 知识掌握：</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
                    <li>说出机器学习与早期“规则灌输”方法的本质差异，理解经验知识 vs 数据知识</li>
                    <li>区分监督、无监督、强化学习三者的输入、输出与核心任务</li>
                    <li>复述监督学习完整流程：训练集-验证集-测试集、损失函数、过拟合</li>
                    <li>列举回归与分类常用损失函数各一种并写出公式</li>
                    <li>描述 K-means 的目标及算法步骤</li>
                    <li>列举强化学习五大元素：Agent、Environment、State、Action、Reward</li>
                  </ul>
                </div>

                <div className="space-y-2 pl-2 pt-2">
                  <h3 className="text-sm font-bold text-neutral-800">2. 能力提升：</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
                    <li>针对给定场景判断应使用哪类学习范式并说明理由</li>
                    <li>在在线沙箱平台独立完成机器学习模型构建与参数校验</li>
                  </ul>
                </div>
              </div>

              {/* Embedded Media if available */}
              {activeDetailLesson.lesson?.type === "video" && (
                <div className="pt-6 space-y-3 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-800">配套视频讲义演示:</h3>
                  <div className="bg-neutral-950 rounded-xl overflow-hidden shadow-md aspect-video relative flex items-center justify-center border border-neutral-800 max-w-2xl">
                    <video 
                      controls
                      className="w-full h-full object-cover"
                      src={activeDetailLesson.lesson?.videoInfo?.videoUrlMock}
                      poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
                    />
                  </div>
                </div>
              )}

              {activeDetailLesson.lesson?.type === "code" || activeDetailLesson.lesson?.type === "experiment" ? (
                <div className="pt-6 space-y-3 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-800">实训环境与代码参考:</h3>
                  <div className="bg-neutral-900 text-neutral-100 rounded-xl p-5 border border-neutral-800 space-y-3 max-w-2xl">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="font-bold text-white text-xs">Python 3.10 / PyTorch 2.2 沙箱</span>
                      <span className="text-xs text-amber-300 font-mono">GPU: NVIDIA A100</span>
                    </div>
                    <pre className="p-3 bg-black rounded text-emerald-400 text-xs font-mono overflow-x-auto border border-neutral-800 leading-relaxed">
                      {activeDetailLesson.lesson?.experimentInfo?.sampleCode || `import torch\nimport numpy as np\nprint("Machine Learning Sandbox Ready")`}
                    </pre>
                  </div>
                </div>
              ) : null}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
