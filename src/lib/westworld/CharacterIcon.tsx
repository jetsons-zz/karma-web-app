/**
 * 西部世界角色 SVG 图标组件
 * 扁平化二维风格的角色头像
 */

import React from 'react';
import { WestworldCharacterId, getCharacter } from './characters';

interface CharacterIconProps {
  characterId: WestworldCharacterId;
  size?: number;
  status?: 'default' | 'active' | 'offline' | 'warning';
  className?: string;
}

export function CharacterIcon({
  characterId,
  size = 64,
  status = 'default',
  className = '',
}: CharacterIconProps) {
  const character = getCharacter(characterId);
  const { visual } = character;

  // 状态相关的效果
  const getStatusEffect = () => {
    switch (status) {
      case 'active':
        return (
          <>
            <defs>
              <filter id={`glow-${characterId}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </defs>
          </>
        );
      case 'offline':
        return (
          <defs>
            <filter id={`grayscale-${characterId}`}>
              <feColorMatrix
                type="saturate"
                values="0.3"
              />
            </filter>
          </defs>
        );
      case 'warning':
        return (
          <defs>
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </defs>
        );
      default:
        return null;
    }
  };

  const filterStyle = status === 'offline' ? `url(#grayscale-${characterId})` :
                      status === 'active' ? `url(#glow-${characterId})` : 'none';

  // 根据角色ID渲染不同的图标
  const renderCharacter = () => {
    switch (characterId) {
      case 'dolores':
        return (
          <g filter={filterStyle}>
            {/* 背景圆形 */}
            <circle cx="32" cy="32" r="30" fill={visual.primaryColor} />

            {/* 金色头发 */}
            <ellipse cx="32" cy="20" rx="20" ry="22" fill={visual.secondaryColor} />

            {/* 脸部 */}
            <circle cx="32" cy="32" r="18" fill="#FFF5EE" />

            {/* 眼睛 */}
            <circle cx="26" cy="30" r="3" fill={visual.accentColor} />
            <circle cx="38" cy="30" r="3" fill={visual.accentColor} />
            <circle cx="27" cy="29" r="1.5" fill="#FFFFFF" />
            <circle cx="39" cy="29" r="1.5" fill="#FFFFFF" />

            {/* 笑容 */}
            <path
              d="M 24 38 Q 32 42 40 38"
              stroke={visual.accentColor}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* 向日葵装饰 */}
            <circle cx="48" cy="28" r="4" fill="#FFD700" />
            <circle cx="48" cy="28" r="2" fill="#8B4513" />
          </g>
        );

      case 'maeve':
        return (
          <g filter={filterStyle}>
            {/* 背景椭圆 */}
            <ellipse cx="32" cy="32" rx="30" ry="32" fill={visual.primaryColor} />

            {/* 深色卷发 */}
            <ellipse cx="32" cy="22" rx="22" ry="20" fill="#2C1810" />
            <path
              d="M 15 22 Q 12 18 15 14"
              stroke="#2C1810"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 49 22 Q 52 18 49 14"
              stroke="#2C1810"
              strokeWidth="4"
              fill="none"
            />

            {/* 脸部 */}
            <ellipse cx="32" cy="34" rx="16" ry="18" fill="#D2A679" />

            {/* 眼睛 */}
            <ellipse cx="26" cy="32" rx="2" ry="3" fill={visual.accentColor} />
            <ellipse cx="38" cy="32" rx="2" ry="3" fill={visual.accentColor} />

            {/* 华丽领口 */}
            <rect x="20" y="48" width="24" height="4" fill={visual.secondaryColor} rx="1" />
            <circle cx="26" cy="50" r="1" fill={visual.accentColor} />
            <circle cx="32" cy="50" r="1" fill={visual.accentColor} />
            <circle cx="38" cy="50" r="1" fill={visual.accentColor} />
          </g>
        );

      case 'bernard':
        return (
          <g filter={filterStyle}>
            {/* 背景方形圆角 */}
            <rect x="2" y="2" width="60" height="60" rx="8" fill={visual.primaryColor} />

            {/* 头部 */}
            <circle cx="32" cy="28" r="16" fill={visual.secondaryColor} />

            {/* 标志性眼镜 */}
            <g>
              <circle cx="24" cy="26" r="6" fill="none" stroke="#000000" strokeWidth="2" />
              <circle cx="40" cy="26" r="6" fill="none" stroke="#000000" strokeWidth="2" />
              <line x1="30" y1="26" x2="34" y2="26" stroke="#000000" strokeWidth="2" />

              {/* 镜片反光 */}
              <circle cx="24" cy="26" r="6" fill={visual.accentColor} opacity="0.2" />
              <circle cx="40" cy="26" r="6" fill={visual.accentColor} opacity="0.2" />
            </g>

            {/* 短发 */}
            <path
              d="M 18 20 Q 16 14 20 12 Q 32 8 44 12 Q 48 14 46 20"
              fill="#1C1C1C"
            />

            {/* 西装领口 */}
            <rect x="18" y="42" width="28" height="10" fill="#000080" />
            <polygon points="32,42 28,52 36,52" fill="#FFFFFF" />
          </g>
        );

      case 'teddy':
        return (
          <g filter={filterStyle}>
            {/* 背景圆形 */}
            <circle cx="32" cy="32" r="30" fill={visual.primaryColor} />

            {/* 牛仔帽 */}
            <ellipse cx="32" cy="18" rx="24" ry="4" fill={visual.secondaryColor} />
            <rect x="20" y="12" width="24" height="10" rx="4" fill={visual.secondaryColor} />

            {/* 脸部 */}
            <ellipse cx="32" cy="34" rx="14" ry="16" fill="#F5DEB3" />

            {/* 坚毅的眉毛 */}
            <line x1="24" y1="30" x2="28" y2="31" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
            <line x1="36" y1="31" x2="40" y2="30" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />

            {/* 眼睛 */}
            <circle cx="26" cy="33" r="2" fill="#4169E1" />
            <circle cx="38" cy="33" r="2" fill="#4169E1" />

            {/* 围巾 */}
            <ellipse cx="32" cy="48" rx="12" ry="4" fill="#DC143C" />

            {/* 小手枪装饰 */}
            <rect x="50" y="40" width="6" height="3" fill={visual.accentColor} rx="1" />
          </g>
        );

      case 'clementine':
        return (
          <g filter={filterStyle}>
            {/* 背景心形底 */}
            <path
              d="M 32 50 Q 12 36 12 24 Q 12 12 22 12 Q 32 18 32 18 Q 32 18 42 12 Q 52 12 52 24 Q 52 36 32 50"
              fill={visual.accentColor}
              opacity="0.3"
            />
            <circle cx="32" cy="32" r="28" fill={visual.primaryColor} />

            {/* 波浪红发 */}
            <ellipse cx="32" cy="22" rx="20" ry="18" fill={visual.primaryColor} />
            <path
              d="M 14 24 Q 12 20 14 16"
              stroke={visual.primaryColor}
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M 50 24 Q 52 20 50 16"
              stroke={visual.primaryColor}
              strokeWidth="5"
              fill="none"
            />

            {/* 脸部 */}
            <circle cx="32" cy="34" r="15" fill={visual.secondaryColor} />

            {/* 温柔的大眼睛 */}
            <ellipse cx="26" cy="32" rx="3" ry="4" fill="#8B4513" />
            <ellipse cx="38" cy="32" rx="3" ry="4" fill="#8B4513" />
            <circle cx="27" cy="31" r="1.5" fill="#FFFFFF" />
            <circle cx="39" cy="31" r="1.5" fill="#FFFFFF" />

            {/* 甜美笑容 */}
            <path
              d="M 24 40 Q 32 44 40 40"
              stroke="#FF69B4"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* 蕾丝装饰 */}
            <rect x="26" y="48" width="12" height="4" fill="#FFFFFF" opacity="0.8" />
          </g>
        );

      case 'ford':
        return (
          <g filter={filterStyle}>
            {/* 背景六边形 */}
            <polygon
              points="32,4 54,16 54,40 32,52 10,40 10,16"
              fill={visual.secondaryColor}
            />

            {/* 白发 */}
            <ellipse cx="32" cy="24" rx="18" ry="16" fill={visual.primaryColor} />

            {/* 脸部 */}
            <ellipse cx="32" cy="32" rx="14" ry="16" fill="#F5E6D3" />

            {/* 锐利的眼神 */}
            <line x1="24" y1="30" x2="28" y2="30" stroke="#000000" strokeWidth="1.5" />
            <line x1="36" y1="30" x2="40" y2="30" stroke="#000000" strokeWidth="1.5" />
            <circle cx="26" cy="30" r="2" fill={visual.accentColor} />
            <circle cx="38" cy="30" r="2" fill={visual.accentColor} />

            {/* 严肃的嘴 */}
            <line x1="28" y1="40" x2="36" y2="40" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />

            {/* 领带 */}
            <polygon points="32,46 30,52 34,52" fill={visual.accentColor} />

            {/* 全视之眼装饰 */}
            <g opacity="0.3">
              <circle cx="32" cy="8" r="4" fill={visual.accentColor} />
              <circle cx="32" cy="8" r="2" fill="#000000" />
            </g>
          </g>
        );

      case 'man-in-black':
        return (
          <g filter={filterStyle}>
            {/* 背景盾形 */}
            <path
              d="M 32 4 Q 50 4 54 16 L 54 36 Q 54 52 32 60 Q 10 52 10 36 L 10 16 Q 14 4 32 4"
              fill={visual.primaryColor}
            />

            {/* 黑色宽边帽 */}
            <ellipse cx="32" cy="20" rx="26" ry="4" fill="#000000" />
            <rect x="18" y="14" width="28" height="10" rx="2" fill="#000000" />

            {/* 脸部（阴影中） */}
            <ellipse cx="32" cy="36" rx="14" ry="16" fill={visual.secondaryColor} />

            {/* 神秘的眼神 */}
            <line x1="24" y1="32" x2="28" y2="32" stroke={visual.accentColor} strokeWidth="2" />
            <line x1="36" y1="32" x2="40" y2="32" stroke={visual.accentColor} strokeWidth="2" />

            {/* 刀疤 */}
            <path
              d="M 38 36 L 42 40"
              stroke={visual.accentColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* 迷宫图案（小） */}
            <g opacity="0.4" transform="translate(46, 46) scale(0.3)">
              <circle cx="0" cy="0" r="8" fill="none" stroke={visual.accentColor} strokeWidth="2" />
              <path
                d="M -4 0 Q -4 -4 0 -4 Q 4 -4 4 0"
                fill="none"
                stroke={visual.accentColor}
                strokeWidth="2"
              />
            </g>
          </g>
        );

      case 'elsie':
        return (
          <g filter={filterStyle}>
            {/* 背景圆角方形 */}
            <rect x="4" y="4" width="56" height="56" rx="10" fill={visual.primaryColor} />

            {/* 休闲短发 */}
            <path
              d="M 16 24 Q 16 14 22 10 Q 32 6 42 10 Q 48 14 48 24 L 48 30 L 16 30 Z"
              fill="#8B4513"
            />

            {/* 脸部 */}
            <ellipse cx="32" cy="32" rx="14" ry="15" fill="#F5DEB3" />

            {/* 好奇的大眼睛 */}
            <circle cx="26" cy="30" r="4" fill={visual.secondaryColor} />
            <circle cx="38" cy="30" r="4" fill={visual.secondaryColor} />
            <circle cx="26" cy="30" r="2.5" fill="#000000" />
            <circle cx="38" cy="30" r="2.5" fill="#000000" />
            <circle cx="27" cy="29" r="1.5" fill="#FFFFFF" />
            <circle cx="39" cy="29" r="1.5" fill="#FFFFFF" />

            {/* 探究的表情 */}
            <path
              d="M 28 38 Q 32 40 36 38"
              stroke="#000000"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* 平板设备 */}
            <rect x="14" y="46" width="16" height="12" rx="1" fill={visual.secondaryColor} />
            <rect x="15" y="47" width="14" height="10" rx="0.5" fill={visual.accentColor} />
            <line x1="17" y1="50" x2="27" y2="50" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="17" y1="53" x2="24" y2="53" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        );

      default:
        return <circle cx="32" cy="32" r="30" fill={visual.primaryColor} />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ display: 'block' }}
    >
      {getStatusEffect()}
      {renderCharacter()}
    </svg>
  );
}
