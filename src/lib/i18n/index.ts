/**
 * Internationalization (i18n) System
 * iOS-inspired multi-language support
 */

export type Locale = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru';

export const supportedLocales: Record<Locale, { name: string; native: string }> = {
  'en': { name: 'English', native: 'English' },
  'zh-CN': { name: 'Chinese (Simplified)', native: '简体中文' },
  'zh-TW': { name: 'Chinese (Traditional)', native: '繁體中文' },
  'ja': { name: 'Japanese', native: '日本語' },
  'ko': { name: 'Korean', native: '한국어' },
  'es': { name: 'Spanish', native: 'Español' },
  'fr': { name: 'French', native: 'Français' },
  'de': { name: 'German', native: 'Deutsch' },
  'ru': { name: 'Russian', native: 'Русский' },
};

interface Translations {
  common: {
    ok: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    loading: string;
    error: string;
    success: string;
  };
  tabs: {
    conversations: string;
    projects: string;
    avatars: string;
    profile: string;
    store: string;
  };
  projects: {
    title: string;
    createNew: string;
    noProjects: string;
    progress: string;
  };
  avatars: {
    title: string;
    status: {
      online: string;
      working: string;
      idle: string;
      offline: string;
    };
    createNew: string;
  };
  tasks: {
    title: string;
    session: string;
    approve: string;
    requestChanges: string;
    viewCode: string;
    runTests: string;
  };
  notifications: {
    taskComplete: string;
    hitlRequired: string;
    newSubscription: string;
  };
  errors: {
    network: string;
    timeout: string;
    unauthorized: string;
    notFound: string;
    serverError: string;
  };
}

const translations: Record<Locale, Translations> = {
  'en': {
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    tabs: {
      conversations: 'Conversations',
      projects: 'Projects',
      avatars: 'Avatars',
      profile: 'Profile',
      store: 'Store',
    },
    projects: {
      title: 'Projects',
      createNew: 'Create New Project',
      noProjects: 'No projects yet',
      progress: 'Progress: {{percentage}}%',
    },
    avatars: {
      title: 'Avatars',
      status: {
        online: 'Online',
        working: 'Working',
        idle: 'Idle',
        offline: 'Offline',
      },
      createNew: 'Create New Avatar',
    },
    tasks: {
      title: 'Task',
      session: 'Task Session',
      approve: 'Approve',
      requestChanges: 'Request Changes',
      viewCode: 'View Code',
      runTests: 'Run Tests',
    },
    notifications: {
      taskComplete: '{{avatarName}} completed the task',
      hitlRequired: '{{avatarName}} needs your approval',
      newSubscription: 'You got {{count}} new subscribers',
    },
    errors: {
      network: 'Network connection failed',
      timeout: 'Request timeout',
      unauthorized: 'Please login again',
      notFound: 'Content not found',
      serverError: 'Server error, please try again later',
    },
  },
  'zh-CN': {
    common: {
      ok: '确定',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      loading: '加载中...',
      error: '错误',
      success: '成功',
    },
    tabs: {
      conversations: '对话',
      projects: '项目',
      avatars: '分身',
      profile: '我的',
      store: '商店',
    },
    projects: {
      title: '项目',
      createNew: '创建新项目',
      noProjects: '还没有项目',
      progress: '进度: {{percentage}}%',
    },
    avatars: {
      title: '分身',
      status: {
        online: '在线',
        working: '工作中',
        idle: '空闲',
        offline: '离线',
      },
      createNew: '创建新分身',
    },
    tasks: {
      title: '任务',
      session: '任务会话',
      approve: '批准合并',
      requestChanges: '请求修改',
      viewCode: '查看代码',
      runTests: '运行测试',
    },
    notifications: {
      taskComplete: '{{avatarName}} 完成了任务',
      hitlRequired: '{{avatarName}} 需要你的审核',
      newSubscription: '你获得了 {{count}} 个新订阅',
    },
    errors: {
      network: '网络连接失败',
      timeout: '请求超时',
      unauthorized: '请重新登录',
      notFound: '内容未找到',
      serverError: '服务器错误，请稍后重试',
    },
  },
  // Add other locales with same structure...
  'zh-TW': {} as Translations,
  'ja': {} as Translations,
  'ko': {} as Translations,
  'es': {} as Translations,
  'fr': {} as Translations,
  'de': {} as Translations,
  'ru': {} as Translations,
};

/**
 * Get current locale from browser or localStorage
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'zh-CN';

  const stored = localStorage.getItem('locale');
  if (stored && stored in supportedLocales) {
    return stored as Locale;
  }

  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) {
    return browserLang.includes('TW') || browserLang.includes('HK') ? 'zh-TW' : 'zh-CN';
  }

  for (const locale of Object.keys(supportedLocales)) {
    if (browserLang.startsWith(locale.split('-')[0])) {
      return locale as Locale;
    }
  }

  return 'zh-CN';
}

/**
 * Set locale and save to localStorage
 */
export function setLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
  window.location.reload(); // Reload to apply changes
}

/**
 * Translation function with interpolation
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const locale = getCurrentLocale();
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Simple interpolation
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param]?.toString() || match;
    });
  }

  return value;
}

/**
 * Hook for using translations in React components
 */
export function useTranslation() {
  const locale = getCurrentLocale();

  return {
    t,
    locale,
    setLocale,
  };
}

/**
 * Example Usage:
 *
 * import { t, useTranslation } from '@/lib/i18n';
 *
 * // In React component
 * const { t, locale } = useTranslation();
 *
 * <button>{t('common.save')}</button>
 * <p>{t('projects.progress', { percentage: 75 })}</p>
 */
