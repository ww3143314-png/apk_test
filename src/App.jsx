import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CapsuleView from './components/CapsuleView';
import CapsuleModal from './components/CapsuleModal';
import AIStudioView from './components/AIStudioView';
import AdvisorChatView from './components/AdvisorChatView';
import SettingsView from './components/SettingsView';
import { storageService } from './services/storage';
import { Smartphone, Monitor, Wifi, BatteryCharging } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('capsules');
  const [capsules, setCapsules] = useState([]);
  const [settings, setSettings] = useState(storageService.getSettings());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState(null);
  const [studioCapsuleId, setStudioCapsuleId] = useState('');
  const [isExpandedMode, setIsExpandedMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // 初始化加载数据与时钟
  useEffect(() => {
    setCapsules(storageService.getCapsules());
    setSettings(storageService.getSettings());

    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  // 保存/更新胶囊
  const handleSaveCapsule = (capsuleData) => {
    const updated = storageService.saveCapsule(capsuleData);
    setCapsules(updated);
  };

  // 删除胶囊
  const handleDeleteCapsule = (id) => {
    if (confirm('确定要删除这条灵感胶囊吗？')) {
      const updated = storageService.deleteCapsule(id);
      setCapsules(updated);
    }
  };

  // 打开编辑
  const handleEditCapsule = (capsule) => {
    setEditingCapsule(capsule);
    setIsModalOpen(true);
  };

  // 一键送入 AI 工坊
  const handleSendToStudio = (capsule) => {
    setStudioCapsuleId(capsule.id);
    setCurrentTab('studio');
  };

  // 更新设置
  const handleUpdateSettings = (newSettings) => {
    const saved = storageService.saveSettings(newSettings);
    setSettings(saved);
  };

  // 重置数据
  const handleDataReset = () => {
    setCapsules(storageService.getCapsules());
    setSettings(storageService.getSettings());
  };

  return (
    <div className="desktop-wrapper">
      {/* 桌面端外壳顶部控制条 (方便在电脑上切换手机视图和全屏视图) */}
      <div className="simulator-toolbar">
        <span className="simulator-badge">手机 APK 实时模拟</span>
        <button
          onClick={() => setIsExpandedMode(false)}
          className={`simulator-btn ${!isExpandedMode ? 'active' : ''}`}
        >
          <Smartphone size={14} />
          <span>手机容器 (412x870)</span>
        </button>
        <button
          onClick={() => setIsExpandedMode(true)}
          className={`simulator-btn ${isExpandedMode ? 'active' : ''}`}
        >
          <Monitor size={14} />
          <span>铺满全屏</span>
        </button>
      </div>

      {/* 手机外壳模型 */}
      <div className={`phone-case ${isExpandedMode ? 'expanded-mode' : ''}`}>
        {/* 手机前置摄像头/灵动岛 (仅在非全屏模式下显示) */}
        {!isExpandedMode && (
          <div className="phone-notch">
            <div className="notch-camera" />
            <div className="notch-sensor" />
          </div>
        )}

        {/* 手机主视口 */}
        <div className="app-viewport">
          {/* 手机系统状态栏 (时间、信号、电量) */}
          <div className="status-bar">
            <span>{currentTime || '12:00'}</span>
            <div className="status-icons">
              <Wifi size={14} />
              <BatteryCharging size={16} />
            </div>
          </div>

          {/* 软件顶部标题栏 */}
          <Header
            currentTab={currentTab}
            onOpenSettings={() => setCurrentTab('settings')}
            isMockMode={settings.useMockAI}
          />

          {/* 滚动主视图 */}
          <div className="main-content">
            {currentTab === 'capsules' && (
              <CapsuleView
                capsules={capsules}
                onOpenCreateModal={() => {
                  setEditingCapsule(null);
                  setIsModalOpen(true);
                }}
                onEditCapsule={handleEditCapsule}
                onDeleteCapsule={handleDeleteCapsule}
                onSendToStudio={handleSendToStudio}
              />
            )}

            {currentTab === 'studio' && (
              <AIStudioView
                capsules={capsules}
                selectedCapsuleId={studioCapsuleId}
                settings={settings}
                onSaveNewCapsule={handleSaveCapsule}
              />
            )}

            {currentTab === 'advisors' && (
              <AdvisorChatView
                settings={settings}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onDataReset={handleDataReset}
              />
            )}
          </div>

          {/* 底部导航栏 */}
          <TabBar
            activeTab={currentTab}
            onChangeTab={setCurrentTab}
            capsuleCount={capsules.length}
          />

          {/* 胶囊新建/编辑弹窗 */}
          <CapsuleModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingCapsule(null);
            }}
            onSave={handleSaveCapsule}
            initialData={editingCapsule}
          />
        </div>
      </div>
    </div>
  );
}
