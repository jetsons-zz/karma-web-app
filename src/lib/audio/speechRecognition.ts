/**
 * 语音识别模块
 * 使用 Web Speech API 实现语音转文字功能
 *
 * @module audio/speechRecognition
 */

/**
 * 语音识别配置
 */
export interface SpeechRecognitionConfig {
  /** 语言代码 */
  lang?: string;
  /** 是否连续识别 */
  continuous?: boolean;
  /** 是否返回临时结果 */
  interimResults?: boolean;
  /** 最大备选结果数 */
  maxAlternatives?: number;
}

/**
 * 语音识别结果
 */
export interface SpeechRecognitionResult {
  /** 识别的文本 */
  transcript: string;
  /** 置信度 (0-1) */
  confidence: number;
  /** 是否是最终结果 */
  isFinal: boolean;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 语音识别事件回调
 */
export interface SpeechRecognitionCallbacks {
  /** 识别到结果 */
  onResult?: (result: SpeechRecognitionResult) => void;
  /** 识别错误 */
  onError?: (error: string) => void;
  /** 识别开始 */
  onStart?: () => void;
  /** 识别结束 */
  onEnd?: () => void;
  /** 音频开始 */
  onAudioStart?: () => void;
  /** 音频结束 */
  onAudioEnd?: () => void;
  /** 说话开始 */
  onSpeechStart?: () => void;
  /** 说话结束 */
  onSpeechEnd?: () => void;
}

/**
 * 语音识别管理器
 */
export class SpeechRecognitionManager {
  private recognition: any = null; // SpeechRecognition instance
  private isListening = false;
  private config: Required<SpeechRecognitionConfig>;
  private callbacks: SpeechRecognitionCallbacks = {};

  constructor(config: SpeechRecognitionConfig = {}) {
    this.config = {
      lang: config.lang || 'zh-CN',
      continuous: config.continuous !== undefined ? config.continuous : true,
      interimResults: config.interimResults !== undefined ? config.interimResults : true,
      maxAlternatives: config.maxAlternatives || 1,
    };

    this.initRecognition();
  }

  /**
   * 初始化 Web Speech API
   */
  private initRecognition(): void {
    if (typeof window === 'undefined') {
      console.warn('Speech Recognition is only available in browser environment');
      return;
    }

    // 检查浏览器支持
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.config.lang;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    this.setupEventHandlers();
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    if (!this.recognition) return;

    // 识别结果
    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const alternative = lastResult[0];

      const result: SpeechRecognitionResult = {
        transcript: alternative.transcript,
        confidence: alternative.confidence,
        isFinal: lastResult.isFinal,
        timestamp: Date.now(),
      };

      this.callbacks.onResult?.(result);
    };

    // 识别错误
    this.recognition.onerror = (event: any) => {
      const errorMessage = this.getErrorMessage(event.error);
      this.callbacks.onError?.(errorMessage);
    };

    // 识别开始
    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    // 识别结束
    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };

    // 音频开始
    this.recognition.onaudiostart = () => {
      this.callbacks.onAudioStart?.();
    };

    // 音频结束
    this.recognition.onaudioend = () => {
      this.callbacks.onAudioEnd?.();
    };

    // 说话开始
    this.recognition.onspeechstart = () => {
      this.callbacks.onSpeechStart?.();
    };

    // 说话结束
    this.recognition.onspeechend = () => {
      this.callbacks.onSpeechEnd?.();
    };
  }

  /**
   * 获取错误消息
   */
  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': '未检测到语音',
      'audio-capture': '无法捕获音频',
      'not-allowed': '未授予麦克风权限',
      'network': '网络错误',
      'aborted': '识别被中止',
      'language-not-supported': '不支持该语言',
      'service-not-allowed': '服务不可用',
    };

    return errorMessages[error] || `未知错误: ${error}`;
  }

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: SpeechRecognitionCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * 开始识别
   */
  start(): void {
    if (!this.recognition) {
      console.error('Speech Recognition not initialized');
      return;
    }

    if (this.isListening) {
      console.warn('Speech Recognition is already listening');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.callbacks.onError?.('启动识别失败');
    }
  }

  /**
   * 停止识别
   */
  stop(): void {
    if (!this.recognition) return;

    if (!this.isListening) {
      console.warn('Speech Recognition is not listening');
      return;
    }

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }

  /**
   * 中止识别（立即停止，不返回结果）
   */
  abort(): void {
    if (!this.recognition) return;

    try {
      this.recognition.abort();
    } catch (error) {
      console.error('Failed to abort speech recognition:', error);
    }
  }

  /**
   * 检查是否正在识别
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * 检查浏览器是否支持语音识别
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<SpeechRecognitionConfig>): void {
    if (!this.recognition) return;

    if (config.lang !== undefined) {
      this.config.lang = config.lang;
      this.recognition.lang = config.lang;
    }

    if (config.continuous !== undefined) {
      this.config.continuous = config.continuous;
      this.recognition.continuous = config.continuous;
    }

    if (config.interimResults !== undefined) {
      this.config.interimResults = config.interimResults;
      this.recognition.interimResults = config.interimResults;
    }

    if (config.maxAlternatives !== undefined) {
      this.config.maxAlternatives = config.maxAlternatives;
      this.recognition.maxAlternatives = config.maxAlternatives;
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): SpeechRecognitionConfig {
    return { ...this.config };
  }
}

/**
 * React Hook - 使用语音识别
 */
export function useSpeechRecognition(config: SpeechRecognitionConfig = {}) {
  // 在实际使用中，这里应该使用 React 的 useState 和 useEffect
  // 这里提供一个简化版本
  const manager = new SpeechRecognitionManager(config);

  return {
    start: () => manager.start(),
    stop: () => manager.stop(),
    abort: () => manager.abort(),
    isActive: () => manager.isActive(),
    setCallbacks: (callbacks: SpeechRecognitionCallbacks) => manager.setCallbacks(callbacks),
    updateConfig: (newConfig: Partial<SpeechRecognitionConfig>) =>
      manager.updateConfig(newConfig),
    isSupported: SpeechRecognitionManager.isSupported(),
  };
}

/**
 * 简单的一次性语音识别
 * 返回 Promise，识别完成后 resolve
 */
export async function recognizeSpeech(
  config: SpeechRecognitionConfig = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const manager = new SpeechRecognitionManager({
      ...config,
      continuous: false,
      interimResults: false,
    });

    let result = '';

    manager.setCallbacks({
      onResult: (res) => {
        if (res.isFinal) {
          result = res.transcript;
        }
      },
      onEnd: () => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('No speech detected'));
        }
      },
      onError: (error) => {
        reject(new Error(error));
      },
    });

    manager.start();

    // 超时处理 (30秒)
    setTimeout(() => {
      if (manager.isActive()) {
        manager.stop();
        reject(new Error('Speech recognition timeout'));
      }
    }, 30000);
  });
}

/**
 * 支持的语言列表
 */
export const SupportedLanguages = {
  'zh-CN': '中文（简体）',
  'zh-TW': '中文（繁体）',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'es-ES': 'Español',
  'ru-RU': 'Русский',
  'ar-SA': 'العربية',
  'pt-BR': 'Português (Brasil)',
  'it-IT': 'Italiano',
  'nl-NL': 'Nederlands',
  'pl-PL': 'Polski',
  'tr-TR': 'Türkçe',
} as const;

/**
 * 获取浏览器默认语言
 */
export function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'zh-CN';

  const lang = navigator.language || (navigator as any).userLanguage || 'zh-CN';

  // 如果支持该语言，直接返回
  if (lang in SupportedLanguages) {
    return lang;
  }

  // 尝试匹配主语言（如 zh-HK -> zh-CN）
  const mainLang = lang.split('-')[0];
  const matchedLang = Object.keys(SupportedLanguages).find((key) =>
    key.startsWith(mainLang)
  );

  return matchedLang || 'zh-CN';
}
