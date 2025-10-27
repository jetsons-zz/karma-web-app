'use client';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AboutSettingsPage() {
  const router = useRouter();

  const aboutSections = [
    {
      title: 'Version Information',
      items: [
        { label: 'App Version', value: '1.0.0' },
        { label: 'Build Number', value: '2024.01.15' },
        { label: 'Environment', value: 'Production' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { label: 'Documentation', value: 'View Docs', link: '#' },
        { label: 'Release Notes', value: 'What\'s New', link: '#' },
        { label: 'API Reference', value: 'View API Docs', link: '#' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', value: 'Get Help', link: '#' },
        { label: 'Contact Support', value: 'Contact Us', link: '#' },
        { label: 'Community Forum', value: 'Join Discussion', link: '#' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Terms of Service', value: 'Read Terms', link: '#' },
        { label: 'Privacy Policy', value: 'Read Policy', link: '#' },
        { label: 'License Agreement', value: 'View License', link: '#' },
      ],
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-2 mb-6 transition-colors"
          style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--color-text-secondary)',
            minHeight: '44px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-brand-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Settings
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="flex items-center justify-center rounded-[16px]"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#FFFFFF',
                fontSize: '32px',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              K
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'var(--font-size-h1)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                About Karma
              </h1>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                AI-powered productivity platform
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {aboutSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3"
                      style={{
                        borderBottom:
                          section.items[section.items.length - 1] !== item
                            ? '1px solid var(--color-border)'
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {item.label}
                      </span>
                      {item.link ? (
                        <button
                          onClick={() => console.log(`Navigate to ${item.link}`)}
                          className="transition-colors"
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-brand-primary)',
                            minHeight: '44px',
                            padding: '0 var(--spacing-md)',
                          }}
                        >
                          {item.value}
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3">
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Platform
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {typeof window !== 'undefined' ? navigator.platform : 'Web'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    User Agent
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      maxWidth: '400px',
                      textAlign: 'right',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits & Acknowledgments */}
          <Card>
            <CardHeader>
              <CardTitle>Credits & Acknowledgments</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                Karma is built with modern technologies including Next.js, React, TypeScript, and
                Tailwind CSS. Special thanks to all open-source contributors.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">
                  View Open Source Licenses
                </Button>
                <Button variant="secondary" size="sm">
                  Contribute on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Copyright */}
          <div
            className="text-center py-6"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-muted)',
            }}
          >
            (c) 2024 Karma. All rights reserved.
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
