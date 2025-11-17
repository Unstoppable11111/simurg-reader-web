// utils/crypto.js
import CryptoJS from 'crypto-js';

const DEFAULT_SECRET_KEY = 'JTDDnc1mrUf7TOfuX+9I4A==';

export function decryptData(encryptedText) {
  if (!encryptedText) return null;

  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    const ivBase64 = parts[0];
    const encryptedDataBase64 = parts[1];
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedDataBase64);
    
    // 1. 确保密钥是 Base64 解码后的字节数组
    const key = CryptoJS.enc.Utf8.parse(DEFAULT_SECRET_KEY);
    
    // 2. 使用 ECB 模式 + PKCS7 填充
    const decrypted = CryptoJS.AES.decrypt(
      {ciphertext : encryptedData}, 
      key, 
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    // 3. 转换为 UTF-8 字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error('解密失败:', e);
    throw new Error('字符串解密失败');
  }
}