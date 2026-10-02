// SparkCapsule · 灵感智囊 - 大模型流式通信与模拟引擎
import { PERSONAS } from '../constants';

/**
 * 模拟打字机流式输出的文本片段生成器
 */
function streamMockResponse(fullText, onChunk, onDone, signal) {
  let index = 0;
  // 按照微小时间间隔逐字或逐词推进，模拟大模型打字机效果
  const timer = setInterval(() => {
    if (signal?.aborted) {
      clearInterval(timer);
      return;
    }
    if (index >= fullText.length) {
      clearInterval(timer);
      onDone && onDone(fullText);
      return;
    }

    // 每次吐出 2~4 个字符，带来极度真实的打字节奏感
    const step = Math.min(Math.floor(Math.random() * 3) + 2, fullText.length - index);
    const chunk = fullText.slice(index, index + step);
    index += step;
    onChunk && onChunk(chunk);
  }, 35);

  return () => clearInterval(timer);
}

/**
 * 生成预设场景的精美模拟回复
 */
function getSimulatedReply(personaId, userPrompt) {
  const p = PERSONAS.find(item => item.id === personaId) || PERSONAS[0];

  if (personaId === 'architect') {
    return `💡 **【架构推演分析】**\n\n针对你提到的「${userPrompt}」，我们从**系统第一性原理**出发，逐层拆解：\n\n1. **核心输入与边界界定**：\n   - 明确系统的绝对不可变量与可扩展插件层。\n   - 隔离视图渲染层与状态持久层，避免由于界面频发重绘导致数据污染。\n\n2. **状态流转与单向数据流**：\n   - 建议采用不可变数据模型（Immutable State），所有更新通过明确定义的 Action 派发，确保调试时具有百分之百的可预测性。\n\n3. **演进路线建议**：\n   - 先行构建最小可行闭环（MVP），通过自动化测试固化核心逻辑后，再逐步向移动端原生容器推进。`;
  }

  if (personaId === 'copywriter') {
    return `✨ **【灵感润色与升华】**\n\n「${userPrompt}」是一个极具张力的思想切片！我为你将其重构并扩充为一段富有穿透力的文字：\n\n> *“灵感从不是凭空产生的闪电，而是我们在日常细碎感知中不断蓄积的引力波。当你把零散的思绪凝固在方寸屏幕之间，代码就变成了思想的骨骼，而创造力则是赋予其呼吸与心跳的灵魂。”*\n\n**【延伸提炼】**：\n• **核心意象**：从混乱到秩序，由微光汇聚成星河\n• **适用场景**：适合作为项目开篇引言、个人日志卷首语或设计阐述。`;
  }

  if (personaId === 'strategist') {
    return `📊 **【商业价值与落地沙盘】**\n\n关于你提出的「${userPrompt}」，我们从**商业闭环与用户价值**两个维度进行研判：\n\n1. **核心痛点击穿点（The Hook）**：\n   - 解决用户“想法瞬时消逝、缺乏沉淀工具”的高频微痛点，建立秒级入口。\n\n2. **产品壁垒构建（Moat）**：\n   - 100% 本地离线隐私 + 云端大模型按需唤醒，兼具安全性与智能化，与市面臃肿商业软件形成鲜明差异化。\n\n3. **下一步执行清单**：\n   - 第一周：完成核心形态真机验证；\n   - 第二周：邀请 3-5 位真实种子用户进行无感体验测试。`;
  }

  // 默认为生活管家
  return `🌱 **【极简生活行动建议】**\n\n收到你的想法啦！「${userPrompt}」听起来很棒，我们把它转化为今天就能迈出的小小一步：\n\n- [ ] **微习惯启动**：今天只花 5 分钟把最核心的第一步完成，不追求完美，只追求开始；\n- [ ] **环境降噪**：关闭非必要的即时通讯提醒，给自己一个完整的 25 分钟专注微空间；\n- [ ] **自我正反馈**：完成后喝一杯温水，告诉自己今天又前行了一小步！\n\n记住，最难的永远是启动的那一秒，你现在已经在路上了。加油！`;
}

export const aiService = {
  /**
   * 智囊团对话请求（支持真实 API 与智能模拟流式传输）
   * @param {Object} params
   * @param {string} params.personaId 角色ID
   * @param {Array} params.messages 历史对话列表 [{role: 'user'|'assistant', content: string}]
   * @param {Object} params.settings 系统设置（包含 API Key 等）
   * @param {Function} params.onChunk 实时增量文本回调
   * @param {Function} params.onDone 完成回调
   * @param {Function} params.onError 错误回调
   * @param {AbortSignal} params.signal 取消信号
   */
  async streamChat({ personaId, messages, settings, onChunk, onDone, onError, signal }) {
    const isMock = settings.useMockAI || !settings.apiKey || settings.apiKey.trim() === '';

    // 1. 如果是模拟模式或未填写 API Key，走高度拟真的本地流式打字机引擎
    if (isMock) {
      const lastUserMsg = messages[messages.length - 1]?.content || '你好';
      const reply = getSimulatedReply(personaId, lastUserMsg);
      return streamMockResponse(reply, onChunk, onDone, signal);
    }

    // 2. 真实网络大模型 API 请求（兼容 OpenAI / DeepSeek / 通义千问等接口格式）
    try {
      const persona = PERSONAS.find(p => p.id === personaId);
      const apiMessages = [
        { role: 'system', content: persona?.systemPrompt || '你是一个专业高效的 AI 助手。' },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ];

      const url = `${settings.apiBaseUrl.replace(/\/+$/, '')}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey.trim()}`
        },
        body: JSON.stringify({
          model: settings.modelName || 'deepseek-chat',
          messages: apiMessages,
          stream: true,
          temperature: 0.7
        }),
        signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败 (HTTP ${response.status}): ${errorText}`);
      }

      // 处理 SSE (Server-Sent Events) 流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const delta = data.choices?.[0]?.delta?.content || '';
              if (delta) {
                accumulatedText += delta;
                onChunk && onChunk(delta);
              }
            } catch (err) {
              // 忽略单个非 JSON 的 SSE 帧
            }
          }
        }
      }

      onDone && onDone(accumulatedText);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[AIService] 错误:', err);
      onError && onError(err.message || '网络连接异常，请检查 API 配置或网络');
    }
  },

  /**
   * AI 工坊：对单条胶囊笔记进行快捷智能重构
   */
  async processCapsuleAction({ actionType, capsule, settings, onChunk, onDone, onError, signal }) {
    let prompt = '';
    let mockResult = '';

    if (actionType === 'expand') {
      prompt = `请将以下灵感笔记深度扩写，充实细节、阐述论点并形成结构完整的深度长文：\n\n【标题】：${capsule.title}\n【内容】：${capsule.content}`;
      mockResult = `📝 **【深度扩写与结构化演化】**\n\n### 一、 核心立论与背景溯源\n在我们聚焦于「${capsule.title}」这一命题时，其本质不仅是一个偶发的思绪闪现，而是针对深层需求的一次创造性探索。原文指出：“${capsule.content}”。\n\n### 二、 体系化实施与多维展开\n1. **用户感知与直觉交互**：打造近乎零延迟的微反馈体验，让每一次操作都带来确定性。\n2. **架构鲁棒性与边界保护**：在极简界面之下，构建健壮的离线存储与异常自愈链路。\n\n### 三、 终局展望与价值沉淀\n这一构想的落地，将彻底打通零散思维碎片到系统化认知成果的高速通道。`;
    } else if (actionType === 'todos') {
      prompt = `请从以下笔记内容中，提炼出清晰可执行的待办行动清单（包含优先级与实施动作）：\n\n【标题】：${capsule.title}\n【内容】：${capsule.content}`;
      mockResult = `✅ **【精细化可执行行动清单】**\n\n针对「${capsule.title}」，已拆解为以下阶段行动步骤：\n\n- [ ] **步骤 1 (高优 · 准备阶段)**：明确核心范围与最小可行性指标（MVP）；\n- [ ] **步骤 2 (中优 · 执行阶段)**：搭建基础交互框架，验证核心主链路是否畅通；\n- [ ] **步骤 3 (中优 · 校验阶段)**：进行真机实测，排查临界状态与异常边界；\n- [ ] **步骤 4 (常态 · 沉淀阶段)**：整理阶段性产出，导出备份数据。`;
    } else {
      // 提炼摘要
      prompt = `请为以下内容提炼一句话核心主旨（20字以内）与 3 个关键标签：\n\n【标题】：${capsule.title}\n【内容】：${capsule.content}`;
      mockResult = `📌 **【智能精炼摘要】**\n\n**核心主旨**：围绕「${capsule.title}」展开的系统化方案规划。\n\n**关键提炼点**：\n1. 核心诉求聚焦清晰，具有很强的实操切入点；\n2. 具备良好的模块化扩展与二次开发潜力；\n3. 建议以轻量化闭环优先启动。`;
    }

    const isMock = settings.useMockAI || !settings.apiKey || settings.apiKey.trim() === '';
    if (isMock) {
      return streamMockResponse(mockResult, onChunk, onDone, signal);
    }

    // 真实 API
    return this.streamChat({
      personaId: 'architect',
      messages: [{ role: 'user', content: prompt }],
      settings,
      onChunk,
      onDone,
      onError,
      signal
    });
  }
};
