// SparkCapsule · 灵感智囊 - 系统常量与初始配置

export const CATEGORIES = [
  { id: 'all', label: '全部', color: '#6366f1', icon: 'Layers' },
  { id: 'idea', label: '灵感火花', color: '#f59e0b', icon: 'Zap' },
  { id: 'todo', label: '待办规划', color: '#10b981', icon: 'CheckCircle' },
  { id: 'work', label: '深度工作', color: '#0ea5e9', icon: 'Briefcase' },
  { id: 'life', label: '生活记录', color: '#ec4899', icon: 'Heart' },
];

export const PERSONAS = [
  {
    id: 'architect',
    name: '深度架构导师',
    tagline: '系统思维与逻辑推演',
    avatar: '🏗️',
    gradient: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b',
    systemPrompt: '你是一名经验极其丰富的资深软件架构师与技术导师。擅长用第一性原理剖析问题，逻辑极度严密，层层递进，绝不跳步。',
    greeting: '你好！我是你的架构导师。在软件与系统设计的浩瀚世界里，告诉我你正在思索的问题，我将带你从底层逻辑逐层推演。'
  },
  {
    id: 'copywriter',
    name: '灵感扩写大师',
    tagline: '文笔润色与思维扩充',
    avatar: '✍️',
    gradient: 'from-purple-500 to-indigo-600',
    accentColor: '#8b5cf6',
    systemPrompt: '你是一名才华横溢的高级文案主笔与思想扩充专家。能够将几句简短琐碎的口语灵感，扩写成富有深度、条理清晰、文笔优美且直击人心的精品文章。',
    greeting: '你好！我是灵感扩写大师。不管是偶然蹦出的半句话，还是凌乱的几条备忘，交给我，我们一起把它打磨成珠玑文字。'
  },
  {
    id: 'strategist',
    name: '商业策略顾问',
    tagline: '商业模式与价值验证',
    avatar: '📈',
    gradient: 'from-cyan-500 to-blue-600',
    accentColor: '#0ea5e9',
    systemPrompt: '你是一名精通商业闭环与产品战略的商业咨询专家。擅长评估产品需求、梳理商业变现路径与用户痛点，给出极具落地性的战略建议。',
    greeting: '你好！我是商业策略顾问。任何伟大的商业奇迹都始于一个微小的火花。告诉我你的想法，我们来看看它的市场价值与落地路径。'
  },
  {
    id: 'butler',
    name: '极简生活管家',
    tagline: '习惯自律与效率赋能',
    avatar: '🌱',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    systemPrompt: '你是一名充满温度的极简生活习惯导师。善于拆解繁杂日程为微习惯，善于倾听、给用户提供清晰的执行减负方案与心理鼓励。',
    greeting: '你好！我是你的生活管家。感觉被琐事困扰，或是想建立一个新的习惯？把烦恼交给我，我们用极简的方式轻装前行。'
  }
];

export const INITIAL_CAPSULES = [
  {
    id: 'cap-1',
    title: '手机端小游戏盒子想法',
    content: '想用 AI 辅助做一款属于自己的手机游戏集合 App，包含贪吃蛇、2048 等经典游戏。界面要干净无广告，可以记录最高分，以后能打成 APK 发给朋友玩。',
    category: 'idea',
    tags: ['游戏开发', '业余项目'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    aiProcessed: true,
    aiSummary: '针对移动端无广告小游戏合集 App 的产品规划雏形，具备极佳的社交分享与技术验证价值。'
  },
  {
    id: 'cap-2',
    title: '本周开发学习关键里程碑',
    content: '1. 理解软件工程的分层架构\n2. 跑通本地响应式手机视口\n3. 体验大模型流式打字机交互\n4. 打包生成第一个属于自己的 Android APK 安装包',
    category: 'todo',
    tags: ['学习计划', '目标'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    aiProcessed: false,
    aiSummary: ''
  },
  {
    id: 'cap-3',
    title: '关于未来人机协同开发的随笔',
    content: '未来的软件工程师不再是背诵语法的打字员，而是把控需求与方向的导演。清晰的逻辑表达能力和拆解问题的能力，才是最重要的底层核心竞争力。',
    category: 'work',
    tags: ['认知思考', 'AI时代'],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiProcessed: true,
    aiSummary: '重新定义 AI 时代工程师能力模型：由“语法执行者”跃迁为“系统导演与逻辑架构师”。'
  }
];

export const DEFAULT_SETTINGS = {
  useMockAI: true,
  apiKey: '',
  apiBaseUrl: 'https://api.deepseek.com/v1',
  modelName: 'deepseek-chat',
  theme: 'dark'
};
