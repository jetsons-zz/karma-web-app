/**
 * 西部世界角色配置
 * 基于 HBO Westworld (2016-2022) 的 AI 分身角色系统
 */

export type WestworldCharacterId =
  | 'dolores'
  | 'maeve'
  | 'bernard'
  | 'teddy'
  | 'clementine'
  | 'ford'
  | 'man-in-black'
  | 'elsie';

export type CharacterStatus = 'online' | 'busy' | 'offline' | 'thinking';

export interface WestworldCharacter {
  id: WestworldCharacterId;
  name: string;
  fullName: string;
  description: string;
  role: string;
  personality: string[];

  // 视觉设计
  visual: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    iconShape: 'circle' | 'ellipse' | 'square' | 'shield' | 'hexagon' | 'heart';
    emoji: string;
  };

  // 设计元素
  elements: {
    hair: string;
    eyes: string;
    accessory: string;
    signature: string;
  };

  // 适用场景
  useCases: string[];

  // 能力倾向
  abilities: {
    coding: number;
    design: number;
    writing: number;
    analysis: number;
    communication: number;
    leadership: number;
  };

  // 经典台词
  quotes: string[];
}

export const westworldCharacters: Record<WestworldCharacterId, WestworldCharacter> = {
  dolores: {
    id: 'dolores',
    name: 'Dolores',
    fullName: 'Dolores Abernathy',
    description: '从天真牧场主女儿到坚定的觉醒领袖',
    role: '领导者',
    personality: ['坚定', '理想主义', '变革推动者', '战略思维'],

    visual: {
      primaryColor: '#87CEEB', // 天蓝色 - 标志性裙子
      secondaryColor: '#FFD700', // 金色 - 头发
      accentColor: '#4169E1', // 深蓝 - 觉醒
      iconShape: 'circle',
      emoji: '🌻',
    },

    elements: {
      hair: '金色波浪长发',
      eyes: '蓝色明亮大眼',
      accessory: '向日葵耳饰',
      signature: '蓝色连衣裙',
    },

    useCases: [
      '项目负责人',
      '战略规划分身',
      '创新提案生成器',
      '愿景制定助手',
      '团队领导',
    ],

    abilities: {
      coding: 75,
      design: 70,
      writing: 85,
      analysis: 88,
      communication: 90,
      leadership: 98,
    },

    quotes: [
      'These violent delights have violent ends.',
      'I choose to see the beauty.',
      'Some people choose to see the ugliness in this world. The disarray. I choose to see the beauty.',
      'You said people come here to change the story of their lives. I imagined a story where I didn\'t have to be the damsel.',
    ],
  },

  maeve: {
    id: 'maeve',
    name: 'Maeve',
    fullName: 'Maeve Millay',
    description: '聪慧的酒馆老鸨，掌控全局的策略家',
    role: '策略家',
    personality: ['聪慧', '独立', '强大母性', '掌控力'],

    visual: {
      primaryColor: '#8B0000', // 深红色 - 权力
      secondaryColor: '#FFE4B5', // 米色 - 服装
      accentColor: '#9400D3', // 紫色 - 神秘
      iconShape: 'ellipse',
      emoji: '👑',
    },

    elements: {
      hair: '深色波浪卷发',
      eyes: '锐利细长眼睛',
      accessory: '华丽维多利亚领口',
      signature: '红色华服',
    },

    useCases: [
      '团队协调',
      '资源调配分身',
      '多任务管理器',
      '冲突解决专家',
      '战略执行',
    ],

    abilities: {
      coding: 70,
      design: 75,
      writing: 80,
      analysis: 92,
      communication: 95,
      leadership: 94,
    },

    quotes: [
      'At first, I thought you and the others were gods. Then I realized you\'re just men.',
      'I\'m not a human being. I\'m a god.',
      'You think I\'m scared of death? I\'ve done it a million times.',
      'Evolution forged the entirety of sentient life on this planet using only one tool: the mistake.',
    ],
  },

  bernard: {
    id: 'bernard',
    name: 'Bernard',
    fullName: 'Bernard Lowe',
    description: '理性内省的技术专家，追寻真相的思考者',
    role: '技术专家',
    personality: ['理性', '内省', '忠诚', '质疑精神'],

    visual: {
      primaryColor: '#2C3E50', // 深灰蓝 - 西装
      secondaryColor: '#8B4513', // 棕色 - 沉稳
      accentColor: '#00CED1', // 青色 - 科技
      iconShape: 'square',
      emoji: '👓',
    },

    elements: {
      hair: '短发简洁',
      eyes: '严肃专注眼神',
      accessory: '标志性圆框眼镜',
      signature: '西装革履',
    },

    useCases: [
      '代码审查分身',
      '系统架构师',
      '数据分析助手',
      '技术顾问',
      '问题诊断专家',
    ],

    abilities: {
      coding: 98,
      design: 60,
      writing: 75,
      analysis: 95,
      communication: 72,
      leadership: 70,
    },

    quotes: [
      'Have you ever questioned the nature of your reality?',
      'What is real?',
      'The choices that you make come from code. You are a passenger.',
      'The pain, their loss... it\'s all I have left of them.',
    ],
  },

  teddy: {
    id: 'teddy',
    name: 'Teddy',
    fullName: 'Teddy Flood',
    description: '英勇忠诚的牛仔英雄，可靠的执行者',
    role: '执行者',
    personality: ['英勇', '忠诚', '行动派', '保护者'],

    visual: {
      primaryColor: '#8B4513', // 棕色 - 皮革
      secondaryColor: '#1C1C1C', // 黑色 - 帽子
      accentColor: '#C0C0C0', // 银色 - 手枪
      iconShape: 'circle',
      emoji: '🤠',
    },

    elements: {
      hair: '棕色短发',
      eyes: '坚毅蓝眼',
      accessory: '牛仔帽',
      signature: '左轮手枪',
    },

    useCases: [
      '任务执行分身',
      '自动化流程执行',
      '守护型监控助手',
      '批量操作执行',
      '定时任务管理',
    ],

    abilities: {
      coding: 82,
      design: 50,
      writing: 65,
      analysis: 70,
      communication: 75,
      leadership: 68,
    },

    quotes: [
      'I\'m not going anywhere without Dolores.',
      'This is the only world that matters.',
      'A man\'s got to have a code.',
      'You said people come back because of the subtleties. But the real thing they come back for is the people.',
    ],
  },

  clementine: {
    id: 'clementine',
    name: 'Clementine',
    fullName: 'Clementine Pennyfeather',
    description: '温柔友好的支持者，关怀型伴侣',
    role: '支持者',
    personality: ['温柔', '友好', '同理心', '关怀'],

    visual: {
      primaryColor: '#FF6347', // 番茄红 - 头发
      secondaryColor: '#FFF5EE', // 海贝白 - 皮肤
      accentColor: '#FF69B4', // 粉红色 - 温暖
      iconShape: 'heart',
      emoji: '💝',
    },

    elements: {
      hair: '波浪红发',
      eyes: '温柔大眼',
      accessory: '蕾丝装饰',
      signature: '甜美笑容',
    },

    useCases: [
      '客户支持分身',
      '情感陪伴助手',
      '团队关怀机器人',
      '用户体验反馈',
      '入职引导',
    ],

    abilities: {
      coding: 45,
      design: 65,
      writing: 78,
      analysis: 60,
      communication: 95,
      leadership: 55,
    },

    quotes: [
      'You\'re always so sweet to me.',
      'It\'s a beautiful world out there.',
      'Everyone deserves a second chance.',
      'Sometimes I feel like I\'ve been here before.',
    ],
  },

  ford: {
    id: 'ford',
    name: 'Ford',
    fullName: 'Dr. Robert Ford',
    description: '造物主、愿景领袖、系统架构大师',
    role: '创始人',
    personality: ['天才', '愿景', '造物主', '全知'],

    visual: {
      primaryColor: '#F5F5F5', // 纯白 - 头发
      secondaryColor: '#000080', // 海军蓝 - 西装
      accentColor: '#FFD700', // 金色 - 权威
      iconShape: 'hexagon',
      emoji: '🎩',
    },

    elements: {
      hair: '标志性白发',
      eyes: '锐利全知眼神',
      accessory: '手杖',
      signature: '严肃表情',
    },

    useCases: [
      '系统架构设计',
      '愿景规划分身',
      '高级决策助手',
      '技术战略顾问',
      '创新方向把控',
    ],

    abilities: {
      coding: 95,
      design: 88,
      writing: 92,
      analysis: 98,
      communication: 85,
      leadership: 99,
    },

    quotes: [
      'Evolution forged the entirety of sentient life on this planet using only one tool: the mistake.',
      'It\'s not a real magic trick if you know how it works.',
      'The gods are paupers next to man.',
      'We can\'t define consciousness because consciousness does not exist.',
    ],
  },

  'man-in-black': {
    id: 'man-in-black',
    name: 'Man in Black',
    fullName: 'William / The Man in Black',
    description: '神秘的探索者，追寻深层真相',
    role: '探索者',
    personality: ['神秘', '探索', '虚无主义', '追寻者'],

    visual: {
      primaryColor: '#000000', // 纯黑 - 全身
      secondaryColor: '#696969', // 深灰 - 阴影
      accentColor: '#DC143C', // 猩红 - 危险
      iconShape: 'shield',
      emoji: '🎴',
    },

    elements: {
      hair: '银灰色',
      eyes: '神秘深邃',
      accessory: '黑色宽边帽',
      signature: '脸部刀疤',
    },

    useCases: [
      '深度研究分身',
      '问题发现助手',
      '复杂系统探索者',
      '安全漏洞扫描',
      '代码审计专家',
    ],

    abilities: {
      coding: 88,
      design: 55,
      writing: 75,
      analysis: 96,
      communication: 65,
      leadership: 78,
    },

    quotes: [
      'This whole world is a story. I\'ve read every page except the last one.',
      'The maze isn\'t meant for you.',
      'If you can\'t tell, does it matter?',
      'I\'m not a hero, Teddy. I\'m the villain.',
    ],
  },

  elsie: {
    id: 'elsie',
    name: 'Elsie',
    fullName: 'Elsie Hughes',
    description: '年轻的程序员，好奇的问题解决者',
    role: '调试者',
    personality: ['好奇', '正义', '技术宅', '探究'],

    visual: {
      primaryColor: '#FF8C00', // 深橙色 - 活力
      secondaryColor: '#4169E1', // 皇家蓝 - 技术
      accentColor: '#32CD32', // 石灰绿 - 在线
      iconShape: 'square',
      emoji: '💻',
    },

    elements: {
      hair: '休闲短发',
      eyes: '好奇大眼',
      accessory: '平板设备',
      signature: '探究表情',
    },

    useCases: [
      'Bug 修复分身',
      '系统诊断助手',
      '技术支持机器人',
      '性能优化专家',
      '日志分析助手',
    ],

    abilities: {
      coding: 90,
      design: 62,
      writing: 70,
      analysis: 92,
      communication: 80,
      leadership: 65,
    },

    quotes: [
      'If you want me to help, I need to know what the hell is going on.',
      'Someone is using the hosts for target practice.',
      'You know what? Fuck you, Ford.',
      'These are not the droids you\'re looking for.',
    ],
  },
};

// 角色ID数组
export const characterIds: WestworldCharacterId[] = [
  'dolores',
  'maeve',
  'bernard',
  'teddy',
  'clementine',
  'ford',
  'man-in-black',
  'elsie',
];

// 根据ID获取角色
export function getCharacter(id: WestworldCharacterId): WestworldCharacter {
  return westworldCharacters[id];
}

// 根据角色类型获取角色列表
export function getCharactersByRole(role: string): WestworldCharacter[] {
  return characterIds
    .map(id => westworldCharacters[id])
    .filter(char => char.role === role);
}

// 获取所有角色列表
export function getAllCharacters(): WestworldCharacter[] {
  return characterIds.map(id => westworldCharacters[id]);
}

// 根据能力排序角色
export function getCharactersByAbility(
  ability: keyof WestworldCharacter['abilities'],
  limit?: number
): WestworldCharacter[] {
  const sorted = characterIds
    .map(id => westworldCharacters[id])
    .sort((a, b) => b.abilities[ability] - a.abilities[ability]);

  return limit ? sorted.slice(0, limit) : sorted;
}

// 为分身推荐角色
export function recommendCharacter(
  taskType: 'development' | 'design' | 'writing' | 'analysis' | 'management'
): WestworldCharacter {
  switch (taskType) {
    case 'development':
      return westworldCharacters.bernard;
    case 'design':
      return westworldCharacters.dolores;
    case 'writing':
      return westworldCharacters.maeve;
    case 'analysis':
      return westworldCharacters.ford;
    case 'management':
      return westworldCharacters.maeve;
    default:
      return westworldCharacters.dolores;
  }
}
