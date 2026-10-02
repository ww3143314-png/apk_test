import React, { useState, useEffect } from 'react';
import { Wand2, Sparkles, CheckSquare, FileText, Bookmark, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { aiService } from '../services/aiService';

export default function AIStudioView({
  capsules,
  selectedCapsuleId,
  settings,
  onSaveNewCapsule
}) {
  const [activeCapsuleId, setActiveCapsuleId] = useState(selectedCapsuleId || capsules[0]?.id || '');
  const [actionType, setActionType] = useState('expand');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentCapsule = capsules.find(c => c.id === activeCapsuleId) || capsules[0];

  useEffect(() => {
    if (selectedCapsuleId) {
      setActiveCapsuleId(selectedCapsuleId);
    }
  }, [selectedCapsuleId]);

  const handleStartAI = async () => {
    if (!currentCapsule) return;
    setIsGenerating(true);
    setStreamedText('');
    setErrorMsg('');
    setCopied(false);

    try {
      await aiService.processCapsuleAction({
        actionType,
        capsule: currentCapsule,
        settings,
        onChunk: (chunk) => {
          setStreamedText(prev => prev + chunk);
        },
        onDone: (final) => {
          setIsGenerating(false);
        },
        onError: (err) => {
          setErrorMsg(err);
          setIsGenerating(false);
        }
      });
    } catch (e) {
      setErrorMsg(e.message || '处理遇到错误');
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!streamedText) return;
    navigator.clipboard.writeText(streamedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsCapsule = () => {
    if (!streamedText) return;
    const actionLabels = { expand: '深度扩写', todos: '行动清单', summary: '核心摘要' };
    onSaveNewCapsule({
      title: `[AI ${actionLabels[actionType]}] ${currentCapsule.title}`,
      content: streamedText,
      category: actionType === 'todos' ? 'todo' : 'idea',
      tags: ['AI生成', actionLabels[actionType]],
      aiProcessed: true,
      aiSummary: `由 AI 工坊基于《${currentCapsule.title}》重构生成`
    });
    alert('已成功保存为新的灵感胶囊！可在“灵感胶囊”标签页查看。');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 来源胶囊选择器 */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#f59e0b" />
          <span>选择待加工的灵感原稿：</span>
        </div>

        {capsules.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-dim)', padding: '10px 0' }}>
            目前暂无灵感胶囊，请先在第一屏新建一条笔记。
          </div>
        ) : (
          <select
            value={activeCapsuleId}
            onChange={(e) => {
              setActiveCapsuleId(e.target.value);
              setStreamedText('');
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {capsules.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.content.slice(0, 20)}...)
              </option>
            ))}
          </select>
        )}

        {currentCapsule && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'var(--text-dim)',
            lineHeight: '1.5'
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>原稿摘录：</span> {currentCapsule.content}
          </div>
        )}
      </div>

      {/* 加工指令选择 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <button
          onClick={() => setActionType('expand')}
          className="touch-btn"
          style={{
            padding: '12px 8px',
            borderRadius: '16px',
            background: actionType === 'expand' ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-card)',
            border: actionType === 'expand' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
            color: actionType === 'expand' ? '#f59e0b' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileText size={20} />
          <span style={{ fontSize: '11px', fontWeight: '700' }}>深度扩写</span>
        </button>

        <button
          onClick={() => setActionType('todos')}
          className="touch-btn"
          style={{
            padding: '12px 8px',
            borderRadius: '16px',
            background: actionType === 'todos' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
            border: actionType === 'todos' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
            color: actionType === 'todos' ? '#10b981' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CheckSquare size={20} />
          <span style={{ fontSize: '11px', fontWeight: '700' }}>提炼待办</span>
        </button>

        <button
          onClick={() => setActionType('summary')}
          className="touch-btn"
          style={{
            padding: '12px 8px',
            borderRadius: '16px',
            background: actionType === 'summary' ? 'rgba(14, 165, 233, 0.18)' : 'var(--bg-card)',
            border: actionType === 'summary' ? '1px solid #0ea5e9' : '1px solid var(--border-subtle)',
            color: actionType === 'summary' ? '#0ea5e9' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={20} />
          <span style={{ fontSize: '11px', fontWeight: '700' }}>智能摘要</span>
        </button>
      </div>

      {/* 触发启动按钮 */}
      <button
        onClick={handleStartAI}
        disabled={isGenerating || !currentCapsule}
        className="touch-btn"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '18px',
          background: isGenerating ? 'rgba(245, 158, 11, 0.4)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          border: 'none',
          color: '#000',
          fontWeight: '700',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? (
          <>
            <RefreshCw size={18} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
            <span>AI 大脑正在高速重构中...</span>
          </>
        ) : (
          <>
            <Wand2 size={18} />
            <span>一键启动 AI 重构</span>
          </>
        )}
      </button>

      {/* 错误提示 */}
      {errorMsg && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#f87171',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AI 成果流式呈现区 */}
      {(streamedText || isGenerating) && (
        <div className="glass-card" style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wand2 size={14} /> AI 重构成果
            </span>

            {!isGenerating && streamedText && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleCopy}
                  className="touch-btn"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: copied ? '#10b981' : 'var(--text-muted)',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? '已复制' : '复制'}</span>
                </button>

                <button
                  onClick={handleSaveAsCapsule}
                  className="touch-btn"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Bookmark size={12} />
                  <span>存为新胶囊</span>
                </button>
              </div>
            )}
          </div>

          <div style={{
            fontSize: '13px',
            color: '#e2e8f0',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
          }}>
            {streamedText}
            {isGenerating && <span className="typing-cursor" />}
          </div>
        </div>
      )}
    </div>
  );
}
