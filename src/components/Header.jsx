import React from 'react';
import { Sparkles, Sliders, ShieldCheck, Cpu } from 'lucide-react';

export default function Header({ currentTab, onOpenSettings, isMockMode }) {
  const getTitle = () => {
    switch (currentTab) {
      case 'capsules': return '灵感胶囊';
      case 'studio': return 'AI 智能工坊';
      case 'advisors': return '专家智囊团';
      case 'settings': return '系统与偏好';
      default: return 'SparkCapsule';
    }
  };

  const getSubtitle = () => {
    switch (currentTab) {
      case 'capsules': return '捕捉每一个稍纵即逝的思维火花';
      case 'studio': return '将零碎草稿一键进化为高维成果';
      case 'advisors': return '多维度专业智库，实时对话答疑';
      case 'settings': return '本地存储与大模型连接配置';
      default: return '';
    }
  };

  return (
    <div style={{
      padding: '8px 18px 12px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 70
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
        }}>
          <Sparkles size={20} color="#000" />
        </div>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px' }}>
            {getTitle()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '1px' }}>
            {getSubtitle()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* 模式状态小标签 */}
        <div 
          onClick={onOpenSettings}
          className="touch-btn"
          style={{
            padding: '4px 9px',
            borderRadius: '9999px',
            background: isMockMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(14, 165, 233, 0.12)',
            border: `1px solid ${isMockMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: '600',
            color: isMockMode ? '#34d399' : '#38bdf8'
          }}
          title={isMockMode ? "智能模拟模式 (免Key直接体验)" : "真实云端大模型模式"}
        >
          {isMockMode ? <Cpu size={12} /> : <ShieldCheck size={12} />}
          <span>{isMockMode ? '演示模拟' : '云端直连'}</span>
        </div>

        {/* 设置快捷按钮 */}
        <button
          onClick={onOpenSettings}
          className="touch-btn"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sliders size={16} />
        </button>
      </div>
    </div>
  );
}
