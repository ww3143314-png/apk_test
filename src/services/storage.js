// SparkCapsule · 灵感智囊 - 本地离线持久化存储引擎
import { INITIAL_CAPSULES, DEFAULT_SETTINGS } from '../constants';

const STORAGE_KEYS = {
  CAPSULES: 'spark_capsules_v1',
  SETTINGS: 'spark_settings_v1',
  CHAT_PREFIX: 'spark_chat_history_'
};

/**
 * 安全地从 LocalStorage 读取数据
 */
function safeGetItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[StorageEngine] 读取失败 (${key}):`, err);
    return defaultValue;
  }
}

/**
 * 安全地写入数据到 LocalStorage
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[StorageEngine] 写入失败 (${key}):`, err);
    return false;
  }
}

// ---------------- 胶囊数据接口 ----------------

export const storageService = {
  /**
   * 获取所有灵感胶囊（按创建时间倒序）
   */
  getCapsules() {
    let capsules = safeGetItem(STORAGE_KEYS.CAPSULES, null);
    if (!capsules || !Array.isArray(capsules) || capsules.length === 0) {
      capsules = [...INITIAL_CAPSULES];
      safeSetItem(STORAGE_KEYS.CAPSULES, capsules);
    }
    return capsules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * 保存或更新胶囊
   */
  saveCapsule(capsule) {
    const capsules = this.getCapsules();
    const existingIndex = capsules.findIndex(c => c.id === capsule.id);

    if (existingIndex >= 0) {
      capsules[existingIndex] = {
        ...capsules[existingIndex],
        ...capsule,
        updatedAt: new Date().toISOString()
      };
    } else {
      const newCapsule = {
        ...capsule,
        id: capsule.id || 'cap-' + Date.now(),
        createdAt: capsule.createdAt || new Date().toISOString(),
        aiProcessed: capsule.aiProcessed || false,
        aiSummary: capsule.aiSummary || ''
      };
      capsules.unshift(newCapsule);
    }

    safeSetItem(STORAGE_KEYS.CAPSULES, capsules);
    return this.getCapsules();
  },

  /**
   * 删除指定胶囊
   */
  deleteCapsule(id) {
    const capsules = this.getCapsules().filter(c => c.id !== id);
    safeSetItem(STORAGE_KEYS.CAPSULES, capsules);
    return capsules;
  },

  // ---------------- 设置项接口 ----------------

  /**
   * 获取系统设置
   */
  getSettings() {
    return safeGetItem(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS });
  },

  /**
   * 保存系统设置
   */
  saveSettings(newSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    safeSetItem(STORAGE_KEYS.SETTINGS, merged);
    return merged;
  },

  // ---------------- 智囊对话历史接口 ----------------

  /**
   * 获取某个特定角色的历史对话列表
   */
  getChatHistory(personaId) {
    const key = STORAGE_KEYS.CHAT_PREFIX + personaId;
    return safeGetItem(key, []);
  },

  /**
   * 追加单条消息到对话历史
   */
  appendChatMessage(personaId, message) {
    const history = this.getChatHistory(personaId);
    history.push({
      ...message,
      id: message.id || 'msg-' + Date.now(),
      timestamp: message.timestamp || new Date().toISOString()
    });
    const key = STORAGE_KEYS.CHAT_PREFIX + personaId;
    safeSetItem(key, history);
    return history;
  },

  /**
   * 清空特定角色的历史对话
   */
  clearChatHistory(personaId) {
    const key = STORAGE_KEYS.CHAT_PREFIX + personaId;
    safeSetItem(key, []);
    return [];
  },

  // ---------------- 数据备份与恢复 ----------------

  /**
   * 导出所有数据为 JSON 字符串
   */
  exportAllData() {
    const allData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      capsules: this.getCapsules(),
      settings: this.getSettings()
    };
    return JSON.stringify(allData, null, 2);
  },

  /**
   * 从 JSON 恢复数据
   */
  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.capsules)) {
        safeSetItem(STORAGE_KEYS.CAPSULES, data.capsules);
      }
      if (data.settings) {
        safeSetItem(STORAGE_KEYS.SETTINGS, data.settings);
      }
      return { success: true, count: (data.capsules || []).length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
