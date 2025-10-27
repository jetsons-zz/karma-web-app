'use client';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { mockCurrentUser } from '@/lib/mock/data';

export default function SettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your personal information, password and account security',
      path: '/settings/account',
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Control notification types and frequency',
      path: '/settings/notifications',
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      description: 'Manage data privacy and permission settings',
      path: '/settings/privacy',
    },
    {
      id: 'appearance',
      title: 'Appearance Settings',
      description: 'Customize theme, language and interface preferences',
      path: '/settings/appearance',
    },
    {
      id: 'connections',
      title: 'Data Source Connections',
      description: 'Manage third-party services and API integrations',
      path: '/settings/connections',
    },
    {
      id: 'subscription',
      title: 'Subscription Management',
      description: 'View and manage your subscription plan',
      path: '/settings/subscription',
    },
    {
      id: 'about',
      title: 'About Karma',
      description: 'Version info, help docs and legal terms',
      path: '/settings/about',
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/profile')}
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
          Back to Profile
        </button>

        {/* Header with User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <Avatar src={mockCurrentUser.avatar} size="xl" />
            <div>
              <h1
                style={{
                  fontSize: 'var(--font-size-h1)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                Settings
              </h1>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {mockCurrentUser.name} " {mockCurrentUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsSections.map((section) => (
            <Card
              key={section.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => router.push(section.path)}
            >
              <CardContent>
                <div className="flex items-start gap-4 p-2">
                  <div className="flex-1">
                    <h3
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      {section.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.4',
                      }}
                    >
                      {section.description}
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    style={{ color: 'var(--color-text-muted)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Danger Zone */}
        <Card
          className="mt-8"
          style={{
            borderColor: 'var(--color-accent-danger)',
          }}
        >
          <CardContent>
            <div className="p-2">
              <h3
                style={{
                  fontSize: 'var(--font-size-body)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-accent-danger)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                Danger Zone
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                Deleting your account will permanently remove all your data including projects, tasks, avatars and earnings. This action cannot be undone.
              </p>
              <button
                className="px-4 py-2 rounded-[12px] transition-all"
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-accent-danger)',
                  color: 'var(--color-accent-danger)',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent-danger)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-accent-danger)';
                }}
              >
                Delete Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
