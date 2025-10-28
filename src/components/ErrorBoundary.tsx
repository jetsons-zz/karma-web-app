/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourApp />
 * </ErrorBoundary>
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({ error, errorInfo });

    // TODO: Log to error reporting service (e.g., Sentry, LogRocket)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--color-bg-default)' }}
        >
          <Card style={{ maxWidth: '600px', width: '100%' }}>
            <CardContent>
              <div className="text-center py-8">
                {/* Error Icon */}
                <div
                  className="mx-auto mb-4 flex items-center justify-center rounded-full"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-accent-danger-light)',
                  }}
                >
                  <svg
                    className="h-8 w-8"
                    style={{ color: 'var(--color-accent-danger)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Error Title */}
                <h2
                  style={{
                    fontSize: 'var(--font-size-h2)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  Oops! Something went wrong
                </h2>

                {/* Error Description */}
                <p
                  style={{
                    fontSize: 'var(--font-size-body)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xl)',
                    lineHeight: '1.6',
                  }}
                >
                  We're sorry, but something unexpected happened. The error has been logged and
                  we'll look into it.
                </p>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details
                    className="text-left mb-6 p-4 rounded-lg"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <summary
                      className="cursor-pointer mb-2"
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Error Details (Development)
                    </summary>
                    <pre
                      className="overflow-auto"
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-accent-danger)',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={this.handleReset} variant="primary">
                    Try Again
                  </Button>
                  <Button onClick={this.handleReload} variant="outline">
                    Reload Page
                  </Button>
                  <Button onClick={() => (window.location.href = '/')} variant="ghost">
                    Go Home
                  </Button>
                </div>

                {/* Support Link */}
                <p
                  className="mt-6"
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  If the problem persists, please{' '}
                  <a
                    href="mailto:support@karma.ai"
                    style={{
                      color: 'var(--color-brand-primary)',
                      textDecoration: 'underline',
                    }}
                  >
                    contact support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simplified Error Fallback Component
 */
export function ErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        {error && (
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        )}
        <Button onClick={resetError}>Try again</Button>
      </div>
    </div>
  );
}
