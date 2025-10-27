'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HapticFeedback } from '@/lib/utils/haptics';

export interface FileAnalysisData {
  fileName: string;
  fileType: string;
  size: number;
  language?: string;
  linesOfCode?: number;
  analysis: {
    summary: string;
    complexity?: 'low' | 'medium' | 'high';
    quality?: number; // 0-100
    issues?: {
      type: 'error' | 'warning' | 'info';
      message: string;
      line?: number;
    }[];
    suggestions?: string[];
    dependencies?: string[];
    exports?: string[];
  };
  createdAt: string;
}

interface FileAnalysisProps {
  file: FileAnalysisData;
  onClose?: () => void;
  onViewCode?: () => void;
}

export function FileAnalysis({ file, onClose, onViewCode }: FileAnalysisProps) {
  const [expanded, setExpanded] = useState(true);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const complexityColors = {
    low: 'var(--color-accent-success)',
    medium: 'var(--color-accent-warning)',
    high: 'var(--color-accent-danger)',
  };

  const issueTypeIcons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '24px' }}>📄</span>
              <CardTitle className="truncate">{file.fileName}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{file.fileType}</Badge>
              {file.language && (
                <Badge variant="secondary">{file.language}</Badge>
              )}
              <span
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {formatFileSize(file.size)}
              </span>
              {file.linesOfCode && (
                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {file.linesOfCode} 行代码
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                HapticFeedback.light();
                setExpanded(!expanded);
              }}
              className="p-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '▼' : '▶'}
            </button>
            {onClose && (
              <button
                onClick={() => {
                  HapticFeedback.light();
                  onClose();
                }}
                className="p-2 rounded-lg transition-all"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-4">
            {/* Summary */}
            <div>
              <h4
                className="mb-2"
                style={{
                  fontSize: 'var(--font-size-body)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                }}
              >
                分析摘要
              </h4>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6',
                }}
              >
                {file.analysis.summary}
              </p>
            </div>

            {/* Metrics */}
            {(file.analysis.complexity || file.analysis.quality !== undefined) && (
              <div className="grid grid-cols-2 gap-3">
                {file.analysis.complexity && (
                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                    }}
                  >
                    <div
                      className="mb-1"
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      复杂度
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: complexityColors[file.analysis.complexity],
                      }}
                    >
                      {file.analysis.complexity === 'low' && '低'}
                      {file.analysis.complexity === 'medium' && '中'}
                      {file.analysis.complexity === 'high' && '高'}
                    </div>
                  </div>
                )}

                {file.analysis.quality !== undefined && (
                  <div
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                    }}
                  >
                    <div
                      className="mb-1"
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      代码质量
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-medium)',
                        color:
                          file.analysis.quality >= 80
                            ? 'var(--color-accent-success)'
                            : file.analysis.quality >= 60
                            ? 'var(--color-accent-warning)'
                            : 'var(--color-accent-danger)',
                      }}
                    >
                      {file.analysis.quality}/100
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Issues */}
            {file.analysis.issues && file.analysis.issues.length > 0 && (
              <div>
                <h4
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  发现问题 ({file.analysis.issues.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {file.analysis.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        borderLeft: `3px solid ${
                          issue.type === 'error'
                            ? 'var(--color-accent-danger)'
                            : issue.type === 'warning'
                            ? 'var(--color-accent-warning)'
                            : 'var(--color-brand-primary)'
                        }`,
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span>{issueTypeIcons[issue.type]}</span>
                        <div className="flex-1">
                          <p
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {issue.message}
                          </p>
                          {issue.line && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              行 {issue.line}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {file.analysis.suggestions && file.analysis.suggestions.length > 0 && (
              <div>
                <h4
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  优化建议
                </h4>
                <ul className="space-y-1">
                  {file.analysis.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2"
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <span>💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dependencies */}
            {file.analysis.dependencies && file.analysis.dependencies.length > 0 && (
              <div>
                <h4
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  依赖项 ({file.analysis.dependencies.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {file.analysis.dependencies.map((dep, idx) => (
                    <Badge key={idx} variant="outline">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Exports */}
            {file.analysis.exports && file.analysis.exports.length > 0 && (
              <div>
                <h4
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  导出项 ({file.analysis.exports.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {file.analysis.exports.map((exp, idx) => (
                    <Badge key={idx} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {onViewCode && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    HapticFeedback.light();
                    onViewCode();
                  }}
                >
                  查看代码
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  HapticFeedback.light();
                  // Download or copy functionality
                  navigator.clipboard.writeText(JSON.stringify(file.analysis, null, 2));
                  alert('分析结果已复制到剪贴板');
                }}
              >
                复制分析
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
