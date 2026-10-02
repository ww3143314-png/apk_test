import React, { useState } from 'react';
import { ShieldCheck, Cpu, Key, Globe, Download, Upload, RotateCcw, Check, Eye, EyeOff, Smartphone } from 'lucide-react';
import { storageService } from '../services/storage';

export default function SettingsView({ settings, onUpdateSettings, onDataReset }) {
  const [formData, setFormData] = useState({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const PRESETS = [
    { name: 'DeepSeek', url: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
    { name: '通义千问 (DashScope)', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo' },
    { name: '月之暗面 (Kimi)', url: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
    { name: 'OpenAI', url: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  ];

  const handleApplyPreset = (preset) => {
    const updated = {
      ...formData,
      apiBaseUrl: preset.url,
      modelName: preset.model,
      useMockAI: false
    };
    setFormData(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExport = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SparkCapsule_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = storageService.importAllData(event.target.result);
      if (result.success) {
        setImportStatus(`成功导入 ${result.count} 条灵感胶囊！`);
        onDataReset();
      } else {
        setImportStatus(`导入失败: ${result.error}`);
      }
      setTimeout(() => setImportStatus(''), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* AI 运行引擎模式切换 */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={16} color="#f59e0b" />
            <span>AI 大模型连接模式</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '10px'
          }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, useMockAI: true }))}
              className="touch-btn"
              style={{
                padding: '12px 10px',
                borderRadius: '14px',
                background: formData.useMockAI ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                border: formData.useMockAI ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                color: formData.useMockAI ? '#34d399' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '700' }}>智能模拟 (免Key)</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>零门槛体验打字机</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, useMockAI: false }))}
              className="touch-btn"
              style={{
                padding: '12px 10px',
                borderRadius: '14px',
                background: !formData.useMockAI ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                border: !formData.useMockAI ? '1px solid #0ea5e9' : '1px solid var(--border-subtle)',
                color: !formData.useMockAI ? '#38bdf8' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '700' }}>云端真实 API</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>填入 Key 畅连大模型</span>
            </button>
          </div>
        </div>

        {/* 真实 API 配置表单 (仅在非模拟模式下高亮展示) */}
        {!formData.useMockAI && (
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={15} /> 快捷预设服务商
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="touch-btn"
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: formData.modelName === p.model ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: formData.modelName === p.model ? '#fff' : 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                API 密钥 (API Key)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer'
                  }}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                接口基地址 (Base URL)
              </label>
              <input
                type="text"
                value={formData.apiBaseUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, apiBaseUrl: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                模型名称 (Model Identifier)
              </label>
              <input
                type="text"
                value={formData.modelName}
                onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* 保存配置按钮 */}
        <button
          type="submit"
          className="touch-btn"
          style={{
            padding: '13px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            color: '#000',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}
        >
          {savedSuccess ? (
            <>
              <Check size={16} />
              <span>设置已保存！</span>
            </>
          ) : (
            <span>应用并保存设置</span>
          )}
        </button>
      </form>

      {/* 数据安全与备份区 */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
          💾 本地数据安全与备份
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: '1.5' }}>
          你的所有灵感胶囊与对话均保存在当前设备本地，绝不上报任何私有服务器。
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={handleExport}
            className="touch-btn"
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} />
            <span>导出数据备份</span>
          </button>

          <label
            className="touch-btn"
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Upload size={14} />
            <span>恢复数据文件</span>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>

        {importStatus && (
          <div style={{ fontSize: '11px', color: '#10b981', textAlign: 'center' }}>
            {importStatus}
          </div>
        )}
      </div>

      {/* 手机 APK 打包就绪说明卡片 */}
      <div className="glass-card" style={{
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981'
        }}>
          <Smartphone size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
            Android APK 容器已就绪
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
            本软件已严格遵循 Capacitor 移动规范设计，随时可打包为独立 .apk 安装包。
          </div>
        </div>
      </div>
    </div>
  );
}
