import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Sparkles, User, Bot, AlertCircle } from 'lucide-react';
import { PERSONAS } from '../constants';
import { storageService } from '../services/storage';
import { aiService } from '../services/aiService';

export default function AdvisorChatView({ settings }) {
  const [activePersonaId, setActivePersonaId] = useState(PERSONAS[0].id);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const messagesEndRef = useRef(null);
  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  // 加载该角色的历史消息
  useEffect(() => {
    const history = storageService.getChatHistory(activePersonaId);
    setMessages(history);
    setStreamingContent('');
    setErrorMsg('');
  }, [activePersonaId]);

  // 消息自动滚到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSendMessage = async (customText) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || isStreaming) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    // 1. 本地追加用户消息
    const updatedMessages = storageService.appendChatMessage(activePersonaId, userMessage);
    setMessages([...updatedMessages]);
    setInputVal('');
    setIsStreaming(true);
    setStreamingContent('');
    setErrorMsg('');

    try {
      await aiService.streamChat({
        personaId: activePersonaId,
        messages: updatedMessages,
        settings,
        onChunk: (chunk) => {
          setStreamingContent(prev => prev + chunk);
        },
        onDone: (fullAnswer) => {
          const aiMessage = {
            id: 'msg-' + (Date.now() + 1),
            role: 'assistant',
            content: fullAnswer,
            timestamp: new Date().toISOString()
          };
          const finalMessages = storageService.appendChatMessage(activePersonaId, aiMessage);
          setMessages([...finalMessages]);
          setStreamingContent('');
          setIsStreaming(false);
        },
        onError: (err) => {
          setErrorMsg(err);
          setIsStreaming(false);
        }
      });
    } catch (e) {
      setErrorMsg(e.message || '对话遇到错误');
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm(`确定要清空与「${activePersona.name}」的历史对话吗？`)) {
      storageService.clearChatHistory(activePersonaId);
      setMessages([]);
      setStreamingContent('');
    }
  };

  const getQuickQuestions = () => {
    switch (activePersonaId) {
      case 'architect':
        return ['从零开发一个手机App需要哪些核心模块？', '如何设计一个高内聚低耦合的小游戏架构？'];
      case 'copywriter':
        return ['帮我润色一段关于灵感与代码的开篇文案', '如何把一句平淡的话扩写得富有穿透力？'];
      case 'strategist':
        return ['个人开发者制作的轻量小软件该如何验证商业价值？', '如何吸引第一批种子用户？'];
      case 'butler':
        return ['今天任务太多不知从何做起，帮我拆解一下', '如何建立一个雷打不动的 25 分钟专注微习惯？'];
      default:
        return [];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* 专家角色水平选择轮播条 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '2px',
        scrollbarWidth: 'none'
      }}>
        {PERSONAS.map(p => {
          const isActive = p.id === activePersonaId;
          return (
            <div
              key={p.id}
              onClick={() => !isStreaming && setActivePersonaId(p.id)}
              className="touch-btn"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '16px',
                background: isActive ? 'rgba(245, 158, 11, 0.16)' : 'var(--bg-card)',
                border: isActive ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                cursor: isStreaming ? 'not-allowed' : 'pointer'
              }}
            >
              <span style={{ fontSize: '18px' }}>{p.avatar}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: isActive ? '#f59e0b' : '#fff' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                  {p.tagline}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 对话消息滚动区 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '8px 2px'
      }}>
        {/* 角色问候卡片 */}
        <div className="glass-card" style={{
          padding: '14px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{ fontSize: '24px' }}>{activePersona.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
              {activePersona.name} · {activePersona.tagline}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {activePersona.greeting}
            </div>
          </div>
        </div>

        {/* 历史消息渲染 */}
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '12px 14px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isUser ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--bg-card)',
                color: isUser ? '#000' : 'var(--text-main)',
                border: isUser ? 'none' : '1px solid var(--border-subtle)',
                fontSize: '13px',
                lineHeight: '1.6',
                fontWeight: isUser ? '600' : '400',
                whiteSpace: 'pre-wrap',
                boxShadow: isUser ? '0 4px 14px rgba(245, 158, 11, 0.2)' : 'none'
              }}>
                {msg.content}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', padding: '0 4px' }}>
                {isUser ? '我' : activePersona.name}
              </span>
            </div>
          );
        })}

        {/* 正在流式打字的消息 */}
        {isStreaming && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 14px',
              borderRadius: '18px 18px 18px 4px',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              fontSize: '13px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {streamingContent}
              <span className="typing-cursor" />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--primary-amber)', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={11} /> 思考吐字中...
            </span>
          </div>
        )}

        {/* 错误提示 */}
        {errorMsg && (
          <div style={{
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 快捷推荐提问 */}
      {messages.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={11} color="#f59e0b" /> 点击快速向导师提问：
          </div>
          {getQuickQuestions().map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="touch-btn"
              style={{
                textAlign: 'left',
                padding: '7px 10px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '11px',
                lineHeight: '1.4'
              }}
            >
              👉 {q}
            </button>
          ))}
        </div>
      )}

      {/* 底部输入框 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingTop: '6px'
      }}>
        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="touch-btn"
            style={{
              padding: '11px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-dim)'
            }}
            title="清空本角色对话记录"
          >
            <Trash2 size={16} />
          </button>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder={`向${activePersona.name}请教...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isStreaming}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim() || isStreaming}
          className="touch-btn"
          style={{
            padding: '12px 15px',
            borderRadius: '16px',
            background: inputVal.trim() && !isStreaming ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: inputVal.trim() && !isStreaming ? '#000' : 'var(--text-dim)',
            fontWeight: '700',
            cursor: inputVal.trim() && !isStreaming ? 'pointer' : 'not-allowed',
            boxShadow: inputVal.trim() && !isStreaming ? '0 4px 14px rgba(245, 158, 11, 0.3)' : 'none'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
