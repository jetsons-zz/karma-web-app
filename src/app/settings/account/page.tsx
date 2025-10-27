'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { mockCurrentUser } from '@/lib/mock/data';

export default function AccountSettingsPage() {
  const router = useRouter();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving account settings:', formData);
    setHasChanges(false);
  };

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
          <h1
            style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Account Settings
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Manage your personal information and account security
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar src={mockCurrentUser.avatar} size="xl" />
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm">
                    Upload New
                  </Button>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                Update your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                Add an extra layer of security to your account
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xxs)',
                    }}
                  >
                    Status: Disabled
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    Protect your account with 2FA
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/settings')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
