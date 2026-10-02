import React, { useState, useEffect } from 'react';
import { X, Check, Tag } from 'lucide-react';
import { CATEGORIES } from '../constants';

export default function CapsuleModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('idea');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.category || 'idea');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
    } else {
      setTitle('');
      setContent('');
      setCategory('idea');
      setTagsInput('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(/[,，\s]+/)
      .map(t => t.trim())
      .filter(Boolean);

    onSave({
      id: initialData?.id,
      title: title.trim() || '未命名灵感火花',
      content: content.trim(),
      category,
      tags
    });
    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 99,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#111827',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        border: '1px solid var(--border-subtle)',
        borderBottom: 'none',
        padding: '20px 20px 32px 20px',
        maxHeight: '90%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.7)'
      }}>
        {/* 顶部把手与标题 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ width: '40px', height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
            {initialData ? '编辑灵感胶囊' : '存入新灵感胶囊'}
          </div>
          <button
            onClick={onClose}
            className="touch-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          {/* 分类选择器 */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              分类标签
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className="touch-btn"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: isSelected ? '600' : '400',
                      border: isSelected ? `1px solid ${cat.color}` : '1px solid var(--border-subtle)',
                      background: isSelected ? `${cat.color}25` : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: cat.color, marginRight: '6px' }} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              胶囊主题 / 标题
            </label>
            <input
              type="text"
              placeholder="例如：关于小游戏合集的突发想法..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* 详细内容 */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              详细思维内容
            </label>
            <textarea
              rows={5}
              placeholder="在这里无拘无束地记录细节。不用担心语无伦次，之后可以随时交给 AI 工坊一键润色与重构..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '14px',
                lineHeight: '1.5',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* 标签 */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} /> 自定义标签 (以逗号或空格分隔)
            </label>
            <input
              type="text"
              placeholder="例如：产品构想, 移动端, 架构"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* 保存按钮 */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="touch-btn"
              style={{
                flex: 1,
                padding: '13px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              取消
            </button>
            <button
              type="submit"
              className="touch-btn"
              style={{
                flex: 2,
                padding: '13px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: '#000',
                fontWeight: '700',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
              }}
            >
              <Check size={18} />
              <span>保存胶囊</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
