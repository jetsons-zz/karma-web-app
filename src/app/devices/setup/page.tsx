'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DeviceSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pairingCode, setPairingCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setStep(2);
    }, 2000);
  };

  const handlePair = () => {
    if (pairingCode.length === 6) {
      setStep(3);
      // Simulate pairing
      setTimeout(() => {
        setStep(4);
      }, 1500);
    }
  };

  const handleComplete = () => {
    router.push('/devices');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto" style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            添加 Karma Box
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            按照以下步骤配对您的设备
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  backgroundColor:
                    step >= s ? 'var(--color-brand-primary)' : 'var(--color-bg-elevated)',
                  color: step >= s ? '#FFFFFF' : 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: 'var(--font-weight-bold)',
                  border:
                    step >= s ? 'none' : '2px solid var(--color-border)',
                }}
              >
                {step > s ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 4 && (
                <div
                  className="w-12 h-0.5 transition-all"
                  style={{
                    backgroundColor:
                      step > s ? 'var(--color-brand-primary)' : 'var(--color-border)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 准备设备 */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>1. 准备您的设备</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className="p-6 rounded-[12px] text-center"
                  style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                >
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(108, 99, 255, 0.1)',
                      color: 'var(--color-brand-primary)',
                    }}
                  >
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    请确保您的 Karma Box 已接通电源并处于配对模式
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--color-brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      1
                    </div>
                    <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                      将 Karma Box 连接到电源
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--color-brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      2
                    </div>
                    <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                      按住设备上的配对按钮 3 秒，直到指示灯开始闪烁
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--color-brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      3
                    </div>
                    <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                      确保设备与手机/电脑处于同一 WiFi 网络
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      正在扫描设备...
                    </>
                  ) : (
                    '开始扫描'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 输入配对码 */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>2. 输入配对码</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className="p-6 rounded-[12px] text-center"
                  style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                >
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-lg)',
                    }}
                  >
                    请输入设备屏幕上显示的 6 位配对码
                  </p>
                  <div className="flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-[8px] transition-all"
                        style={{
                          backgroundColor: 'var(--color-bg-primary)',
                          border: '2px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          outline: 'none',
                        }}
                        value={pairingCode[i] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            const newCode =
                              pairingCode.substring(0, i) +
                              value +
                              pairingCode.substring(i + 1);
                            setPairingCode(newCode);
                            if (value && i < 5) {
                              const nextInput = e.target
                                .nextElementSibling as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !pairingCode[i] && i > 0) {
                            const prevInput = e.target.previousElementSibling as HTMLInputElement;
                            prevInput?.focus();
                          }
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--color-brand-primary)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--color-border)';
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    返回
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handlePair}
                    disabled={pairingCode.length !== 6}
                  >
                    配对
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: 配对中 */}
        {step === 3 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                    color: 'var(--color-brand-primary)',
                  }}
                >
                  <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: 'var(--font-size-h3)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  正在配对...
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-body)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  请稍候，正在与设备建立安全连接
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: 设置设备名称 */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>3. 完成设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className="p-6 rounded-[12px] text-center"
                  style={{ backgroundColor: 'rgba(122, 228, 199, 0.1)' }}
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(122, 228, 199, 0.2)',
                      color: 'var(--color-accent-success)',
                    }}
                  >
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body)',
                      color: 'var(--color-accent-success)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    配对成功！
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    设备名称（可选）
                  </label>
                  <Input
                    type="text"
                    placeholder="例如：办公室、家中、卧室"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    设置一个便于识别的名称
                  </p>
                </div>

                <Button variant="primary" size="lg" className="w-full" onClick={handleComplete}>
                  完成设置
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
