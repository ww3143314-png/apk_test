import React from 'react';
import { Layers, Wand2, MessageSquare, Sliders } from 'lucide-react';

export default function TabBar({ activeTab, onChangeTab, capsuleCount }) {
  const tabs = [
    { id: 'capsules', label: '灵感胶囊', icon: Layers, badge: capsuleCount },
    { id: 'studio', label: 'AI 工坊', icon: Wand2 },
    { id: 'advisors', label: '智囊团', icon: MessageSquare },
    { id: 'settings', label: '设置', icon: Sliders }
  ];

  return (
    <div className="tabbar-container">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <div
            key={tab.id}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <div className="tab-icon-wrapper" style={{ position: 'relative' }}>
              <IconComponent size={22} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  background: '#f59e0b',
                  color: '#000',
                  fontSize: '9px',
                  fontWeight: '800',
                  borderRadius: '10px',
                  padding: '1px 5px',
                  lineHeight: '1.2'
                }}>
                  {tab.badge}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}
