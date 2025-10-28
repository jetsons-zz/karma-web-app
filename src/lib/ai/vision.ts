/**
 * 图像理解模块
 * 使用 GPT-4 Vision API 实现图像分析功能
 *
 * @module ai/vision
 */

import { tokenManager } from '../security/tokenManager';

/**
 * 图像输入格式
 */
export interface ImageInput {
  /** 图像 URL 或 Base64 编码 */
  url?: string;
  /** Base64 编码的图像数据 */
  base64?: string;
  /** 图像类型 (如 image/png, image/jpeg) */
  mimeType?: string;
}

/**
 * 视觉分析请求
 */
export interface VisionAnalysisRequest {
  /** 图像列表 */
  images: ImageInput[];
  /** 分析提示/问题 */
  prompt: string;
  /** 模型名称 */
  model?: string;
  /** 最大 tokens */
  maxTokens?: number;
  /** 详细程度 (low | high) */
  detail?: 'low' | 'high';
}

/**
 * 视觉分析结果
 */
export interface VisionAnalysisResult {
  /** 分析结果文本 */
  content: string;
  /** 使用的模型 */
  model: string;
  /** 消耗的 tokens */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** 原始响应 */
  raw?: any;
}

/**
 * 图像理解管理器
 */
export class VisionManager {
  private static instance: VisionManager;
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): VisionManager {
    if (!this.instance) {
      this.instance = new VisionManager();
    }
    return this.instance;
  }

  /**
   * 设置 API 密钥
   */
  async setApiKey(apiKey: string): Promise<void> {
    this.apiKey = apiKey;
    // 存储到安全的 token 管理器（24小时过期）
    await tokenManager.storeToken('openai_api_key', apiKey, 24 * 60 * 60 * 1000);
  }

  /**
   * 获取 API 密钥
   */
  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;

    // 从 token 管理器获取
    const storedKey = await tokenManager.getToken('openai_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }

    // 从环境变量获取
    const envKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (envKey) {
      this.apiKey = envKey;
      return envKey;
    }

    throw new Error('OpenAI API key not configured');
  }

  /**
   * 分析图像
   */
  async analyzeImage(request: VisionAnalysisRequest): Promise<VisionAnalysisResult> {
    const apiKey = await this.getApiKey();

    const model = request.model || 'gpt-4o';
    const maxTokens = request.maxTokens || 1000;
    const detail = request.detail || 'auto';

    // 构建消息内容
    const content: any[] = [
      {
        type: 'text',
        text: request.prompt,
      },
    ];

    // 添加图像
    for (const image of request.images) {
      if (image.url) {
        content.push({
          type: 'image_url',
          image_url: {
            url: image.url,
            detail,
          },
        });
      } else if (image.base64) {
        const mimeType = image.mimeType || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${image.base64}`;
        content.push({
          type: 'image_url',
          image_url: {
            url: dataUrl,
            detail,
          },
        });
      }
    }

    // 调用 API
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Vision API request failed');
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      raw: data,
    };
  }

  /**
   * 分析单张图像（便捷方法）
   */
  async analyzeImageURL(imageUrl: string, prompt: string): Promise<string> {
    const result = await this.analyzeImage({
      images: [{ url: imageUrl }],
      prompt,
    });
    return result.content;
  }

  /**
   * 分析 Base64 图像（便捷方法）
   */
  async analyzeImageBase64(
    base64: string,
    prompt: string,
    mimeType = 'image/jpeg'
  ): Promise<string> {
    const result = await this.analyzeImage({
      images: [{ base64, mimeType }],
      prompt,
    });
    return result.content;
  }

  /**
   * 分析文件对象
   */
  async analyzeImageFile(file: File, prompt: string): Promise<string> {
    const base64 = await this.fileToBase64(file);
    return this.analyzeImageBase64(base64, prompt, file.type);
  }

  /**
   * 将文件转换为 Base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // 移除 data:image/xxx;base64, 前缀
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 多图像对比分析
   */
  async compareImages(images: ImageInput[], prompt?: string): Promise<string> {
    const defaultPrompt = prompt || '请比较这些图像的异同点。';
    const result = await this.analyzeImage({
      images,
      prompt: defaultPrompt,
    });
    return result.content;
  }

  /**
   * OCR - 提取图像中的文字
   */
  async extractText(image: ImageInput): Promise<string> {
    const result = await this.analyzeImage({
      images: [image],
      prompt: '请提取图像中的所有文字内容，保持原有格式。',
    });
    return result.content;
  }

  /**
   * 图像描述生成
   */
  async describeImage(image: ImageInput, detail: 'brief' | 'detailed' = 'detailed'): Promise<string> {
    const prompt =
      detail === 'brief'
        ? '请简要描述这张图像的主要内容。'
        : '请详细描述这张图像，包括场景、对象、颜色、布局等所有可见元素。';

    const result = await this.analyzeImage({
      images: [image],
      prompt,
    });
    return result.content;
  }

  /**
   * 图像问答
   */
  async askAboutImage(image: ImageInput, question: string): Promise<string> {
    const result = await this.analyzeImage({
      images: [image],
      prompt: question,
    });
    return result.content;
  }

  /**
   * 检测图像中的对象
   */
  async detectObjects(image: ImageInput): Promise<string> {
    const result = await this.analyzeImage({
      images: [image],
      prompt: '请列出图像中所有可识别的对象和元素。',
    });
    return result.content;
  }

  /**
   * 代码/公式识别
   */
  async recognizeCodeOrFormula(image: ImageInput): Promise<string> {
    const result = await this.analyzeImage({
      images: [image],
      prompt: '请识别并提取图像中的代码、数学公式或技术内容，保持原有格式。',
    });
    return result.content;
  }

  /**
   * 图表数据提取
   */
  async extractChartData(image: ImageInput): Promise<string> {
    const result = await this.analyzeImage({
      images: [image],
      prompt: '请分析图表并提取其中的数据，以结构化的方式呈现。',
    });
    return result.content;
  }

  /**
   * 截图理解（UI/UX 分析）
   */
  async analyzeUIScreenshot(image: ImageInput): Promise<string> {
    const result = await this.analyzeImage({
      images: [image],
      prompt: '请分析这个界面截图，描述其布局、功能、用户体验和改进建议。',
    });
    return result.content;
  }
}

/**
 * 导出单例实例
 */
export const visionManager = VisionManager.getInstance();

/**
 * React Hook - 使用图像理解
 */
export function useVision() {
  const manager = VisionManager.getInstance();

  return {
    analyzeImage: (request: VisionAnalysisRequest) => manager.analyzeImage(request),
    analyzeImageURL: (url: string, prompt: string) => manager.analyzeImageURL(url, prompt),
    analyzeImageBase64: (base64: string, prompt: string, mimeType?: string) =>
      manager.analyzeImageBase64(base64, prompt, mimeType),
    analyzeImageFile: (file: File, prompt: string) => manager.analyzeImageFile(file, prompt),
    compareImages: (images: ImageInput[], prompt?: string) =>
      manager.compareImages(images, prompt),
    extractText: (image: ImageInput) => manager.extractText(image),
    describeImage: (image: ImageInput, detail?: 'brief' | 'detailed') =>
      manager.describeImage(image, detail),
    askAboutImage: (image: ImageInput, question: string) =>
      manager.askAboutImage(image, question),
    detectObjects: (image: ImageInput) => manager.detectObjects(image),
    recognizeCodeOrFormula: (image: ImageInput) => manager.recognizeCodeOrFormula(image),
    extractChartData: (image: ImageInput) => manager.extractChartData(image),
    analyzeUIScreenshot: (image: ImageInput) => manager.analyzeUIScreenshot(image),
    setApiKey: (apiKey: string) => manager.setApiKey(apiKey),
  };
}

/**
 * 便捷函数 - 快速分析图像 URL
 */
export async function quickAnalyze(imageUrl: string, prompt: string): Promise<string> {
  return visionManager.analyzeImageURL(imageUrl, prompt);
}

/**
 * 便捷函数 - 快速 OCR
 */
export async function quickOCR(imageUrl: string): Promise<string> {
  return visionManager.extractText({ url: imageUrl });
}

/**
 * 便捷函数 - 快速描述
 */
export async function quickDescribe(imageUrl: string): Promise<string> {
  return visionManager.describeImage({ url: imageUrl });
}
