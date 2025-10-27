'use client';

import { useState, useRef } from 'react';
import { HapticFeedback } from '@/lib/utils/haptics';

interface MultimodalInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  enableVoice?: boolean;
  enableCamera?: boolean;
  enableFiles?: boolean;
  className?: string;
}

export function MultimodalInput({
  onSend,
  placeholder = '输入消息...',
  disabled = false,
  enableVoice = true,
  enableCamera = true,
  enableFiles = true,
  className = '',
}: MultimodalInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    HapticFeedback.light();
    onSend(message, attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleVoiceRecord = async () => {
    HapticFeedback.medium();

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('浏览器不支持语音识别');
      return;
    }

    setIsRecording(!isRecording);

    if (!isRecording) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + transcript);
        setIsRecording(false);
        HapticFeedback.success();
      };

      recognition.onerror = () => {
        setIsRecording(false);
        HapticFeedback.error();
      };

      recognition.start();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    HapticFeedback.light();
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    HapticFeedback.light();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                fontSize: 'var(--font-size-caption)',
              }}
            >
              <span>📎 {file.name}</span>
              <button
                onClick={() => handleRemoveAttachment(index)}
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Voice Button */}
        {enableVoice && (
          <button
            onClick={handleVoiceRecord}
            disabled={disabled}
            className="p-2 rounded-lg transition-all"
            style={{
              color: isRecording ? 'var(--color-accent-danger)' : 'var(--color-text-secondary)',
              backgroundColor: isRecording ? 'var(--color-bg-panel)' : 'transparent',
            }}
            aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? '⏺️' : '🎤'}
          </button>
        )}

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
          style={{
            color: '#1a1a1a',
            fontSize: 'var(--font-size-body)',
          }}
          aria-label="Message input"
        />

        {/* Camera Button */}
        {enableCamera && (
          <>
            <button
              onClick={() => {
                HapticFeedback.light();
                imageInputRef.current?.click();
              }}
              disabled={disabled}
              className="p-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Attach image"
            >
              📷
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </>
        )}

        {/* File Button */}
        {enableFiles && (
          <>
            <button
              onClick={() => {
                HapticFeedback.light();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
              className="p-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Attach file"
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="px-4 py-2 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--color-brand-primary)',
            color: '#FFFFFF',
            opacity: disabled || (!message.trim() && attachments.length === 0) ? 0.5 : 1,
          }}
          aria-label="Send message"
        >
          发送
        </button>
      </div>

      {/* Keyboard Hint */}
      <div
        className="text-xs text-center"
        style={{
          color: 'var(--color-text-muted)',
        }}
      >
        ⌘Enter 或 Ctrl+Enter 发送
      </div>
    </div>
  );
}
