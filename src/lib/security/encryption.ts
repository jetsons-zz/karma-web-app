/**
 * 加密工具模块
 * 提供 AES-GCM 256 位加密/解密功能
 *
 * @module security/encryption
 */

/**
 * 生成加密密钥
 */
async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * 导出密钥为 base64 字符串
 */
async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * 从 base64 字符串导入密钥
 */
async function importKey(keyStr: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * 加密文本
 *
 * @param text - 要加密的文本
 * @param keyStr - 可选的密钥字符串，不提供则使用环境变量
 * @returns 加密后的 base64 字符串（包含 IV）
 */
export async function encrypt(text: string, keyStr?: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // 获取或生成密钥
    const key = keyStr
      ? await importKey(keyStr)
      : await getOrCreateMasterKey();

    // 生成随机 IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 加密数据
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    // 将 IV 和加密数据组合
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // 返回 base64 编码
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * 解密文本
 *
 * @param encryptedText - 加密的 base64 字符串
 * @param keyStr - 可选的密钥字符串，不提供则使用环境变量
 * @returns 解密后的原始文本
 */
export async function decrypt(encryptedText: string, keyStr?: string): Promise<string> {
  try {
    // 解码 base64
    const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));

    // 提取 IV 和加密数据
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // 获取密钥
    const key = keyStr
      ? await importKey(keyStr)
      : await getOrCreateMasterKey();

    // 解密数据
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encrypted
    );

    // 解码为文本
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * 生成安全的随机字符串
 *
 * @param length - 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 哈希字符串（用于密码等）
 *
 * @param text - 要哈希的文本
 * @returns SHA-256 哈希值
 */
export async function hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 验证哈希
 *
 * @param text - 原始文本
 * @param hashedText - 哈希值
 * @returns 是否匹配
 */
export async function verifyHash(text: string, hashedText: string): Promise<boolean> {
  const newHash = await hash(text);
  return newHash === hashedText;
}

/**
 * 获取或创建主密钥
 * 从 localStorage 获取，不存在则创建新的
 */
async function getOrCreateMasterKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('Encryption is only available in browser environment');
  }

  const MASTER_KEY_STORAGE = 'karma_master_key';

  let keyStr = localStorage.getItem(MASTER_KEY_STORAGE);

  if (!keyStr) {
    // 创建新密钥
    const key = await generateKey();
    keyStr = await exportKey(key);
    localStorage.setItem(MASTER_KEY_STORAGE, keyStr);
    return key;
  }

  return await importKey(keyStr);
}

/**
 * 重置主密钥（谨慎使用！会导致已加密数据无法解密）
 */
export async function resetMasterKey(): Promise<void> {
  if (typeof window === 'undefined') return;

  const MASTER_KEY_STORAGE = 'karma_master_key';
  localStorage.removeItem(MASTER_KEY_STORAGE);

  console.warn('Master key has been reset. Previously encrypted data cannot be decrypted.');
}

/**
 * 导出主密钥（用于备份）
 */
export async function exportMasterKey(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const MASTER_KEY_STORAGE = 'karma_master_key';
  return localStorage.getItem(MASTER_KEY_STORAGE);
}

/**
 * 导入主密钥（用于恢复）
 */
export async function importMasterKey(keyStr: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // 验证密钥格式
  try {
    await importKey(keyStr);
    const MASTER_KEY_STORAGE = 'karma_master_key';
    localStorage.setItem(MASTER_KEY_STORAGE, keyStr);
  } catch (error) {
    throw new Error('Invalid master key format');
  }
}
