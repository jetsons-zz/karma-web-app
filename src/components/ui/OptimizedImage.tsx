/**
 * OptimizedImage Component
 *
 * Performance-optimized image component with:
 * - Lazy loading
 * - Blur placeholder
 * - Responsive images
 * - Loading states
 * - Error handling
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/avatar.jpg"
 *   alt="User avatar"
 *   width={400}
 *   height={400}
 *   priority={false}
 * />
 */

'use client';

import { useState, useEffect, useRef, CSSProperties } from 'react';
import { Spinner } from './Spinner';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  className = '',
  style = {},
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    onError?.();
  };

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    overflow: 'hidden',
    backgroundColor: 'var(--color-bg-elevated)',
    ...style,
  };

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 300ms ease-in-out',
  };

  const placeholderStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit,
    filter: 'blur(10px)',
    transform: 'scale(1.1)',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 300ms ease-in-out',
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      role="img"
      aria-label={alt}
    >
      {/* Blur Placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && !hasError && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          style={placeholderStyle}
        />
      )}

      {/* Loading Spinner */}
      {!isLoaded && !hasError && isInView && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <Spinner size="md" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-caption)',
          }}
        >
          <svg
            className="mx-auto mb-2 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>Image not found</p>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          decoding="async"
        />
      )}
    </div>
  );
}

/**
 * Avatar-specific optimized image
 */
export function OptimizedAvatar({
  src,
  name,
  size = 'md',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'objectFit'> & {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const dimension = sizes[size];

  return (
    <OptimizedImage
      {...props}
      src={src}
      alt={`${name}'s avatar`}
      width={dimension}
      height={dimension}
      objectFit="cover"
      style={{
        borderRadius: '50%',
        ...props.style,
      }}
    />
  );
}
