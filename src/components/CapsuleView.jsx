import React, { useState } from 'react';
import { Plus, Search, Wand2, Trash2, Edit3, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../constants';

export default function CapsuleView({
  capsules,
  onOpenCreateModal,
  onEditCapsule,
  onDeleteCapsule,
  onSendToStudio
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤逻辑
  const filteredCapsules = capsules.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getCategoryMeta = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[1];
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return '刚刚';
      if (diffHours < 24) return `${diffHours}小时前`;
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } catch {
      return '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 搜索与新建快捷栏 */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="搜索灵感、标签或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: '16px',
              background: 'rgba(22, 28, 45, 0.7)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={onOpenCreateModal}
          className="touch-btn"
          style={{
            padding: '10px 14px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            color: '#000',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Plus size={16} strokeWidth={3} />
          <span>速记</span>
        </button>
      </div>

      {/* 分类胶囊标签栏 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none'
      }}>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="touch-btn"
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: isSelected ? '700' : '500',
                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid var(--border-subtle)',
                color: isSelected ? '#f59e0b' : 'var(--text-muted)'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 灵感卡片瀑布流 */}
      {filteredCapsules.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(22, 28, 45, 0.3)',
          borderRadius: '24px',
          border: '1px dashed var(--border-subtle)',
          marginTop: '10px'
        }}>
          <Sparkles size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>
            {searchQuery ? '没有找到相关的灵感胶囊' : '这里目前空空如也'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
            点击右上角「+ 速记」捕捉你的第一颗思维火花吧
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCapsules.map((capsule) => {
            const catMeta = getCategoryMeta(capsule.category);

            return (
              <div
                key={capsule.id}
                className="glass-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {/* 卡片头部：分类指示 + AI 处理标 + 时间 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: catMeta.color,
                      boxShadow: `0 0 8px ${catMeta.color}`
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: catMeta.color }}>
                      {catMeta.label}
                    </span>

                    {capsule.aiProcessed && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        marginLeft: '4px'
                      }}>
                        <CheckCircle2 size={10} />
                        AI 已洞察
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-dim)' }}>
                    <Clock size={11} />
                    <span>{formatDate(capsule.createdAt)}</span>
                  </div>
                </div>

                {/* 卡片标题 */}
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', lineHeight: '1.4' }}>
                  {capsule.title}
                </div>

                {/* 卡片内容正文 */}
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {capsule.content}
                </div>

                {/* 标签列表 */}
                {capsule.tags && capsule.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                    {capsule.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-dim)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 7px',
                          borderRadius: '6px'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 卡片底栏操作区 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: '4px'
                }}>
                  {/* 一键送入 AI 工坊核心入口 */}
                  <button
                    onClick={() => onSendToStudio(capsule)}
                    className="touch-btn"
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      color: '#f59e0b',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '5px 10px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Wand2 size={13} />
                    <span>送入 AI 工坊</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onEditCapsule(capsule)}
                      className="touch-btn"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        padding: '6px',
                        borderRadius: '8px'
                      }}
                      title="编辑胶囊"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteCapsule(capsule.id)}
                      className="touch-btn"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#f43f5e',
                        padding: '6px',
                        borderRadius: '8px',
                        opacity: 0.8
                      }}
                      title="删除胶囊"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
